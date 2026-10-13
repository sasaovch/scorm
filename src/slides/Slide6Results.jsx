import { useEffect } from 'react';
import SlideLayout from '../components/SlideLayout';
import { useScorm } from '../scorm/ScormContext';

// Слайд 6. Результаты исследования. За прохождение: 32 балла.
export default function Slide6Results() {
  const { setLessonLocation } = useScorm();
  useEffect(() => {
    setLessonLocation(6);
  }, [setLessonLocation]);

  return (
    <SlideLayout index={6} title="Результаты исследования" points={32} nextTo="/slide/7">
      <div className="grid grid--2">
        <div className="card">
          <h3 className="card__title">Сравнение производительности</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Стек</th><th>RPS</th><th>p99, мс</th><th>Аллок./req</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>JSON + WebSocket</td><td>42 000</td><td>19,4</td><td>132</td></tr>
              <tr><td>FlatBuffers + WS</td><td>118 000</td><td>7,1</td><td>14</td></tr>
              <tr>
                <td className="table__hl">FlatBuffers + WebTransport</td>
                <td className="table__hl">206 000</td>
                <td className="table__hl">2,3</td>
                <td className="table__hl">≈0</td>
              </tr>
            </tbody>
          </table>
          <p className="card__sub">Условия замера: 1 vCPU, сообщение 2 КБ, 256 конкурентных клиентов, 60 с.</p>
        </div>
        <div className="card">
          <h3 className="card__title">Выводы</h3>
          <ul>
            <li>Zero-copy чтение FlatBuffer-поля: O(1), без аллокаций.</li>
            <li>QUIC мультиплексирование снижает хвост латентности при потере пакетов.</li>
            <li>Zero-allocation hot-path — стабильный p99 без пауз GC.</li>
          </ul>
        </div>
      </div>

      <div className="card card--accent">
        <h3 className="card__title">Дальнейшая работа</h3>
        <p className="card__text">
          Наблюдаемость (tracing по trace_id), адаптивный backpressure,
          потокобезопасные арены для многоядерной записи.
        </p>
      </div>
    </SlideLayout>
  );
}
