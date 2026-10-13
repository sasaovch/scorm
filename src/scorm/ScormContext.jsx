import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { scorm } from './api';

// --- Балльная модель -------------------------------------------------------
// 6 информационных слайдов: за прохождение N-го слайда — 2^(N-1) баллов.
//   слайд 1 -> 1, 2 -> 2, 3 -> 4, 4 -> 8, 5 -> 16, 6 -> 32  (сумма = 63)
// Финальный тест: 100 - 63 = 37 баллов.
// Итого: 100 баллов. Пакет засчитан при >= 85.
export const TOTAL_INFO_SLIDES = 6;
export const SLIDE_POINTS = [1, 2, 4, 8, 16, 32];
export const TOTAL_SLIDES = TOTAL_INFO_SLIDES + 1; // + тест
export const TEST_MAX_POINTS = 100 - SLIDE_POINTS.reduce((a, b) => a + b, 0); // 37
export const TOTAL_MAX_POINTS = 100;
export const PASS_THRESHOLD = 85;

const DEFAULT_STATE = {
  visited: Array(TOTAL_INFO_SLIDES).fill(false),
  testScore: 0,
  testSubmitted: false,
};

function parseSuspend(raw) {
  if (!raw) return { ...DEFAULT_STATE, visited: [...DEFAULT_STATE.visited] };
  try {
    const parsed = JSON.parse(raw);
    const visited = Array(TOTAL_INFO_SLIDES).fill(false);
    if (Array.isArray(parsed.visited)) {
      for (let i = 0; i < Math.min(parsed.visited.length, TOTAL_INFO_SLIDES); i += 1) {
        visited[i] = Boolean(parsed.visited[i]);
      }
    }
    return {
      visited,
      testScore: Number.isFinite(parsed.testScore) ? parsed.testScore : 0,
      testSubmitted: Boolean(parsed.testSubmitted),
    };
  } catch {
    return { ...DEFAULT_STATE, visited: [...DEFAULT_STATE.visited] };
  }
}

const ScormContext = createContext(null);

export function ScormProvider({ children }) {
  const [state, setState] = useState(() => parseSuspend(scorm.get('cmi.suspend_data')));
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);

  // Старт сессии: LMSInitialize + восстановление состояния + сохранение времени на unload.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    scorm.init();
    setState(parseSuspend(scorm.get('cmi.suspend_data')));
    setReady(true);

    const handleUnload = () => {
      try {
        scorm.commit();
        scorm.finish();
      } catch {
        /* игнорируем ошибки при закрытии */
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  // Текущий набранный балл.
  const rawScore = useMemo(() => {
    const slideScore = state.visited.reduce(
      (acc, visited, i) => acc + (visited ? SLIDE_POINTS[i] : 0),
      0,
    );
    const testScore = state.testSubmitted ? state.testScore : 0;
    return slideScore + testScore;
  }, [state]);

  // Статус урока.
  const lessonStatus = useMemo(() => {
    if (!state.testSubmitted) return 'incomplete';
    return rawScore >= PASS_THRESHOLD ? 'passed' : 'failed';
  }, [state, rawScore]);

  // Персист в LMS при любом изменении состояния/счёта.
  useEffect(() => {
    if (!ready) return;
    scorm.set('cmi.suspend_data', JSON.stringify(state));
    scorm.set('cmi.core.score.min', '0');
    scorm.set('cmi.core.score.max', String(TOTAL_MAX_POINTS));
    scorm.set('cmi.core.score.raw', String(rawScore));
    scorm.set('cmi.core.lesson_status', lessonStatus);
    scorm.commit();
  }, [state, ready, rawScore, lessonStatus]);

  // Отметить слайд пройденным (idempotent). Вызывается по "Далее" на информационном слайде.
  const markVisited = useCallback((index) => {
    if (index < 1 || index > TOTAL_INFO_SLIDES) return;
    setState((prev) => {
      if (prev.visited[index - 1]) return prev;
      const visited = prev.visited.slice();
      visited[index - 1] = true;
      return { ...prev, visited };
    });
  }, []);

  // Запомнить текущий слайд для возобновления (cmi.core.lesson_location).
  const setLessonLocation = useCallback((index) => {
    scorm.set('cmi.core.lesson_location', String(index));
    scorm.commit();
  }, []);

  // Принять ответы теста: correct из total => балл пропорционально TEST_MAX_POINTS.
  const submitTest = useCallback((correct, total) => {
    const score = total > 0 ? Math.round((correct / total) * TEST_MAX_POINTS) : 0;
    setState((prev) => ({ ...prev, testScore: score, testSubmitted: true }));
  }, []);

  const reset = useCallback(() => {
    setState({ visited: Array(TOTAL_INFO_SLIDES).fill(false), testScore: 0, testSubmitted: false });
  }, []);

  const value = {
    ready,
    totalInfoSlides: TOTAL_INFO_SLIDES,
    totalSlides: TOTAL_SLIDES,
    testMaxPoints: TEST_MAX_POINTS,
    totalMaxPoints: TOTAL_MAX_POINTS,
    passThreshold: PASS_THRESHOLD,
    slidePoints: SLIDE_POINTS,
    visited: state.visited,
    testScore: state.testScore,
    testSubmitted: state.testSubmitted,
    rawScore,
    lessonStatus,
    markVisited,
    setLessonLocation,
    submitTest,
    reset,
  };

  return <ScormContext.Provider value={value}>{children}</ScormContext.Provider>;
}

export function useScorm() {
  const ctx = useContext(ScormContext);
  if (!ctx) throw new Error('useScorm must be used within ScormProvider');
  return ctx;
}
