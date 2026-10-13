# SCORM-пакет по теме ВКР

**Тема:** Разработка и исследование бинарного протокола взаимодействия на базе
Zero-Copy формата (FlatBuffers) и транспорта WebTransport (QUIC) с Zero-Allocation сервером.

## Балльная модель

| Слайд | Содержание | Баллы за прохождение |
|------:|------------|---------------------:|
| 1 | Об авторе | 1 |
| 2 | Введение и актуальность | 2 |
| 3 | FlatBuffers: Zero-Copy формат | 4 |
| 4 | Транспорт: WebTransport поверх QUIC | 8 |
| 5 | Zero-Allocation сервер | 16 |
| 6 | Результаты исследования | 32 |
| 7 | Финальный тест | 0…37 |
| **Итого** | | **100** |

- За прохождение N-го информационного слайда начисляется `2^(N-1)` баллов: `1+2+4+8+16+32 = 63`.
- Финальный тест даёт до `100 − 63 = 37` баллов (пропорционально числу верных ответов).
- **Порог зачёта:** 85 баллов (`cmi.core.lesson_status = passed`).

«Прохождение» слайда = нажатие «Далее» на нём (вызывает `markVisited(index)`).
Состояние (посещённые слайды и результат теста) сохраняется в `cmi.suspend_data`
и восстанавливается при перезапуске; текущий слайд — в `cmi.core.lesson_location`.

## Стек

- **Vite + React 18** — сборка в один self-contained `index.html` (`vite-plugin-singlefile`).
- **React Router (HashRouter)** — слайды как маршруты `/slide/1…7`, как страницы в SPA.
- **SCORM 1.2** — манифест `imsmanifest.xml`, обёртка `src/scorm/api.js` над `window.API`.
  Без LMS (открытие напрямую из файла) деградирует в `localStorage` — пакет остаётся рабочим для предпросмотра.

## Структура

```
.
├── public/imsmanifest.xml     # SCORM 1.2 манифест (masteryscore=85)
├── index.html
├── vite.config.js             # base:'./' + singlefile → один index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx                 # HashRouter + маршруты слайдов
│   ├── styles.css
│   ├── scorm/
│   │   ├── api.js              # обёртка SCORM 1.2 API (+ localStorage fallback)
│   │   └── ScormContext.jsx    # состояние, скоринг, персист в LMS
│   ├── components/
│   │   ├── SlideLayout.jsx     # каркас слайда: шапка, прогресс, навигация, баллы
│   │   └── Progress.jsx        # индикатор счёта и статуса
│   └── slides/
│       ├── Slide1Author.jsx … Slide6Results.jsx   # инфо-слайды (шаблоны)
│       └── Slide7Test.jsx                          # тест (механика готова, вопросы-шаблон)
```

## Команды

```bash
npm install
npm run dev          # локальный предпросмотр
npm run build        # сборка в dist/ (index.html + imsmanifest.xml)
npm run scorm:pack   # сборка + ZIP в scorm-package.zip для загрузки в LMS
```
