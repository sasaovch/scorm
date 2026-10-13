import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScorm } from '../scorm/ScormContext';
import Progress from './Progress';

/**
 * Каркас слайда. Шаблон-компонент, имитирующий «страницу», как в react-router:
 * каждый слайд — отдельный компонент-маршрут, а SlideLayout задаёт общую обложку
 * (шапка, прогресс, навигация, начисление баллов за прохождение).
 *
 * index   — номер слайда (1..7)
 * title   — заголовок
 * points  — баллы за прохождение (число для инфо-слайдов)
 * nextTo  — куда вести по «Далее». null => финальный слайд (тест), навигации нет.
 */
export default function SlideLayout({ index, title, points, children, nextTo }) {
  const navigate = useNavigate();
  const { markVisited, setLessonLocation, totalSlides, visited, slidePoints } = useScorm();

  // Запоминаем текущую позицию для возобновления сессии.
  useEffect(() => {
    setLessonLocation(index);
  }, [index, setLessonLocation]);

  const handleNext = () => {
    markVisited(index); // прохождение слайда = начисление 2^(index-1) баллов
    if (nextTo) navigate(nextTo);
  };

  const isInfoSlide = index <= slidePoints.length;
  const alreadyPassed = isInfoSlide && visited[index - 1];

  return (
    <section className="slide">
      <header className="slide__header">
        <div className="slide__badge">Слайд {index} / {totalSlides}</div>
        <Progress />
      </header>

      <h1 className="slide__title">{title}</h1>

      {points != null && (
        <div className="slide__points">
          {alreadyPassed
            ? `Пройдено: +${points} балл(ов)`
            : `За прохождение: ${points} балл(ов)`}
        </div>
      )}

      <div className="slide__content">{children}</div>

      <footer className="slide__footer">
        {index > 1 && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => navigate(`/slide/${index - 1}`)}
          >
            ← Назад
          </button>
        )}
        <div className="slide__spacer" />
        {nextTo ? (
          <button type="button" className="btn btn--primary" onClick={handleNext}>
            Далее →
          </button>
        ) : (
          <span className="slide__hint">Финальный слайд — завершите тест, чтобы получить результат</span>
        )}
      </footer>
    </section>
  );
}
