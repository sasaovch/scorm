import { useEffect } from 'react';
import SlideLayout from '../components/SlideLayout';
import { useScorm } from '../scorm/ScormContext';

// Слайд 2. Введение и актуальность. За прохождение: 2 балла.
export default function Slide2Intro() {
  const { setLessonLocation } = useScorm();
  useEffect(() => {
    setLessonLocation(2);
  }, [setLessonLocation]);

  return (
    <SlideLayout index={2} title="Введение и актуальность" points={2} nextTo="/slide/3">
      <div className="grid grid--2">
        <div className="card">
          <h3 className="card__title">Постановка проблемы</h3>
          <ul>
            <li>Серийные форматы (JSON) дороги на парсинг и аллокации — узкое место в highload.</li>
            <li>TCP+TLS+HTTP/1.1legacy stacks создают лишние копии данных и задержки.</li>
            <li>Нехватка сквозного zero-copy/zero-allocation пути «сеть → бизнес-логика».</li>
          </ul>
        </div>
        <div className="card">
          <h3 className="card__title">Актуальность</h3>
          <ul>
            <li>QUIC/WebTransport как современный транспорт с мультиплексированием и 0-RTT.</li>
            <li>FlatBuffers как zero-copy бинарный формат без десериализации.</li>
            <li>Потребность в детерминированных по латентности серверах реального времени.</li>
          </ul>
        </div>
      </div>

      <div className="card card--accent">
        <h3 className="card__title">Объект и предмет исследования</h3>
        <div className="card__lines">
          <p className="card__text">
            <b>Объект:</b> бинарный протокол взаимодействия клиент-сервер.
          </p>
          <p className="card__text">
            <b>Предмет:</b> сочетание zero-copy формата и zero-allocation
            сервера поверх транспорта WebTransport/QUIC.
          </p>
        </div>
      </div>
    </SlideLayout>
  );
}
