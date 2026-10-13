import { useEffect } from 'react';
import SlideLayout from '../components/SlideLayout';
import { useScorm } from '../scorm/ScormContext';
import flatBufferImg from '../../img/flat_buffer.jpeg';

// Слайд 3. FlatBuffers — Zero-Copy формат. За прохождение: 4 балла.
export default function Slide3FlatBuffers() {
  const { setLessonLocation } = useScorm();
  useEffect(() => {
    setLessonLocation(3);
  }, [setLessonLocation]);

  return (
    <SlideLayout index={3} title="FlatBuffers: Zero-Copy формат" points={4} nextTo="/slide/4">
      <div className="grid grid--2">
        <div className="card">
          <h3 className="card__title">Суть подхода</h3>
          <ul>
            <li>Данные сериализуются в плоский буфер с inline-указателями-смещениями.</li>
            <li>Доступ к полям без десериализации — прямой доступ по смещению.</li>
            <li>Нет временных аллокаций: буфер читается «на месте» в памяти.</li>
          </ul>
        </div>
        <div className="card">
          <h3 className="card__title">Преимущества</h3>
          <ul>
            <li>O(1) доступ к любому полю без обхода всего сообщения.</li>
            <li>Прямая совместимость с прямой записью в сетевой буфер.</li>
            <li>Строгая схема + обратная/прямая совместимость версий.</li>
          </ul>
        </div>
      </div>

      <figure className="slide__figure">
        <img
          src={flatBufferImg}
          alt="Схема FlatBuffers: плоский буфер с inline-смещениями"
          className="slide__img"
        />
        <figcaption className="slide__caption">
          Структура FlatBuffer: поля доступны по смещению — без десериализации и аллокаций.
        </figcaption>
      </figure>

      <div className="card card--code">
        <h3 className="card__title">Схема сообщения (скелет)</h3>
<pre className="code">{`table Request {
  method: ushort;
  trace_id: ulong;
  payload: [ubyte];   // ноль копий: указатель внутрь буфера
}
root_type Request;`}</pre>
      </div>
    </SlideLayout>
  );
}
