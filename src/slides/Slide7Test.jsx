import { useEffect, useMemo, useState } from 'react';
import SlideLayout from '../components/SlideLayout';
import { useScorm } from '../scorm/ScormContext';

// Слайд 7. Финальный тест. Максимум: 100 - 63 = 37 баллов.
// Механика: за каждый верный ответ начисляется 1/total от 37 баллов.
// Порог зачёта по пакету — 85 баллов (см. ScormContext).
//
// Вопросы теста по теме ВКР (FlatBuffers + WebTransport + zero-allocation сервер).

const QUESTIONS = [
  {
    id: 'q1',
    text: 'Какое свойство FlatBuffers ключевое для Zero-Copy?',
    options: [
      'Десериализация в объекты на лету',
      'Доступ к полям по смещению без десериализации',
      'Сжатие данных без потерь',
      'Поддержка только текстовых полей',
    ],
    correct: 1,
  },
  {
    id: 'q2',
    text: 'На каком транспорте работает WebTransport?',
    options: ['TCP + TLS 1.2', 'UDP + QUIC + TLS 1.3', 'HTTP/1.1 over TCP', 'Сырой UDP без TLS'],
    correct: 1,
  },
  {
    id: 'q3',
    text: 'Что устраняет QUIC по сравнению с TCP+HTTP/2?',
    options: [
      'Head-of-line blocking на уровне потоков',
      'Возможность мультиплексирования',
      'Использование TLS',
      'Надёжность доставки',
    ],
    correct: 0,
  },
  {
    id: 'q4',
    text: 'Цель Zero-Allocation сервера на hot-path — это…',
    options: [
      'Минимизировать паузы GC и число аллокаций на запрос',
      'Максимизировать число системных вызовов',
      'Использовать только стековую память',
      'Полностью отказаться от TLS',
    ],
    correct: 0,
  },
];

export default function Slide7Test() {
  const { setLessonLocation, submitTest, testSubmitted, testScore, rawScore, passThreshold } =
    useScorm();
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    setLessonLocation(7);
  }, [setLessonLocation]);

  const correctCount = useMemo(
    () => QUESTIONS.reduce((acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0), 0),
    [answers],
  );
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const handleSubmit = () => {
    if (!allAnswered) return;
    submitTest(correctCount, QUESTIONS.length);
  };

  const passed = testSubmitted && rawScore >= passThreshold;

  return (
    <SlideLayout index={7} title="Финальный тест" points={null} nextTo={null}>
      <div className="slide__points slide__points--test">
        Максимум за тест: 37 баллов · Всего за пакет: 100 · Порог зачёта: {passThreshold}
      </div>

      {testSubmitted ? (
        <div className={`result ${passed ? 'result--pass' : 'result--fail'}`}>
          <h2 className="result__title">{passed ? 'Пакет засчитан' : 'Пакет не засчитан'}</h2>
          <p className="result__score">
            Результат: <b>{rawScore}</b> / 100
          </p>
          <p className="result__detail">
            Тест: {correctCount} из {QUESTIONS.length} верно → {testScore} из 37 баллов.
          </p>
          {!passed && (
            <p className="result__hint">Нужно набрать не менее {passThreshold} баллов.</p>
          )}
        </div>
      ) : (
        <ol className="quiz">
          {QUESTIONS.map((q, qi) => (
            <li key={q.id} className="quiz__item">
              <p className="quiz__question">
                {qi + 1}. {q.text}
              </p>
              <div className="quiz__options">
                {q.options.map((opt, oi) => (
                  <label key={oi} className="quiz__option">
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === oi}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </li>
          ))}
        </ol>
      )}

      <footer className="slide__footer slide__footer--test">
        <span className="slide__hint">
          Отвечено: {answeredCount} / {QUESTIONS.length}
        </span>
        <div className="slide__spacer" />
        {!testSubmitted && (
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            Завершить тест
          </button>
        )}
      </footer>
    </SlideLayout>
  );
}
