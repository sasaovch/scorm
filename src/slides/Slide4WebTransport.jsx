import { useEffect } from 'react';
import SlideLayout from '../components/SlideLayout';
import { useScorm } from '../scorm/ScormContext';
import webTransportImg from '../../img/webtransport.png';

// Слайд 4. WebTransport на базе QUIC. За прохождение: 8 баллов.
export default function Slide4WebTransport() {
  const { setLessonLocation } = useScorm();
  useEffect(() => {
    setLessonLocation(4);
  }, [setLessonLocation]);

  return (
    <SlideLayout index={4} title="Транспорт: WebTransport поверх QUIC" points={8} nextTo="/slide/5">
      <div className="grid grid--2">
        <div className="card">
          <h3 className="card__title">QUIC как фундамент</h3>
          <ul>
            <li>Transport over UDP, TLS 1.3 внутри — нет отдельного TCP+TLS рукопожатия.</li>
            <li>Независимые потоки (streams) — head-of-line blocking устранён.</li>
            <li>Connection migration: смена сети не рвёт соединение.</li>
            <li>0-RTT восстановление сессии для повторных клиентов.</li>
          </ul>
        </div>
        <div className="card">
          <h3 className="card__title">WebTransport API</h3>
          <ul>
            <li>Двунаправленные datagram- и stream-каналы в одном соединении.</li>
            <li>Поддержка ненадёжной (datagram) и надёжной (stream) доставки.</li>
            <li>Сетевой буфер напрямую из пользовательских данных — основа zero-copy.</li>
          </ul>
        </div>
      </div>

      <figure className="slide__figure">
        <img
          src={webTransportImg}
          alt="Архитектура WebTransport поверх QUIC"
          className="slide__img"
        />
        <figcaption className="slide__caption">
          WebTransport поверх QUIC: мультиплексирование streams/datagrams в одном соединении с TLS 1.3.
        </figcaption>
      </figure>

      <div className="card card--accent">
        <h3 className="card__title">Почему именно WebTransport для этого протокола</h3>
        <p className="card__text">
          Мультиплексирование потоков и datagram-режим позволяют передавать бинарные
          FlatBuffer-сообщения без служебного оверхеда HTTP/фрейминга,
          а квитирование вынести на уровень приложения.
        </p>
      </div>
    </SlideLayout>
  );
}
