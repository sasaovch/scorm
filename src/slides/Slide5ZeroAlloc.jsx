import { useEffect } from 'react';
import SlideLayout from '../components/SlideLayout';
import { useScorm } from '../scorm/ScormContext';

// Слайд 5. Zero-Allocation сервер. За прохождение: 16 баллов.
export default function Slide5ZeroAlloc() {
  const { setLessonLocation } = useScorm();
  useEffect(() => {
    setLessonLocation(5);
  }, [setLessonLocation]);

  return (
    <SlideLayout index={5} title="Zero-Allocation сервер" points={16} nextTo="/slide/6">
      <div className="grid grid--2">
        <div className="card">
          <h3 className="card__title">Принципы</h3>
          <ul>
            <li>Буферные пулы и аренда (arena/region allocator) вместо heap-аллокаций на запрос.</li>
            <li>Прямая запись FlatBuffer-ответа в сетевой буфер без промежуточных копий.</li>
            <li>С ZERO-COPY read: указатель на принятый датаграмм-буфер до бизнес-логики.</li>
            <li>Hot-path без GC-давления — предсказуемые паузы и латентность p99.</li>
          </ul>
        </div>
        <div className="card">
          <h3 className="card__title">Архитектура (скелет)</h3>
          <ul>
            <li>Event-loop поверх QUIC API, неблокирующий I/O.</li>
            <li>Worker-пул с thread-per-core и аффинностью буферов.</li>
            <li>Маршрутизация по <code>method</code> из FlatBuffer-заголовка.</li>
            <li>Backpressure через квитирование на уровне приложения.</li>
          </ul>
        </div>
      </div>

      <div className="card card--code">
        <h3 className="card__title">Hot-path: путь пакета</h3>
<pre className="code">{`recv datagram (QUIC, zero-copy)
  -> FlatBuffer root (no parse)
    -> dispatch by method id
      -> handler writes response into arena
        -> send datagram (zero-copy, arena pinned)`}</pre>
      </div>
    </SlideLayout>
  );
}
