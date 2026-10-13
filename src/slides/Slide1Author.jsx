import { useEffect } from 'react';
import SlideLayout from '../components/SlideLayout';
import { useScorm } from '../scorm/ScormContext';

// Слайд 1. Информация об авторе. За прохождение: 1 балл.
export default function Slide1Author() {
  const { setLessonLocation } = useScorm();
  useEffect(() => {
    setLessonLocation(1);
  }, [setLessonLocation]);

  return (
    <SlideLayout index={1} title="Об авторе" points={1} nextTo="/slide/2">
      <div className="author">
        <div className="author__avatar" aria-hidden="true">АО</div>
        <div className="author__info">
          <h2 className="author__name">Овчаренко Александр Андреевич</h2>
          <dl className="author__facts">
            <dt>Вуз / Факультет</dt>
            <dd>ИТМО, ПИиКТ</dd>
            <dt>Направление</dt>
            <dd>Веб-технологии</dd>
            <dt>Группа</dt>
            <dd>P4209</dd>
            <dt>Научный руководитель</dt>
            <dd>Жуков Николай Николаевич</dd>
            <dt>Год защиты</dt>
            <dd>2027</dd>
          </dl>
        </div>
      </div>

      <div className="card">
        <h3 className="card__title">Тема выпускной квалификационной работы</h3>
        <p className="card__text">
          Разработка и исследование бинарного протокола взаимодействия на базе
          Zero-Copy формата (FlatBuffers) и транспорта WebTransport (QUIC)
          с Zero-Allocation сервером.
        </p>
      </div>
    </SlideLayout>
  );
}
