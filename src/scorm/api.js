// Обёртка SCORM 1.2 Runtime API.
// LMS внедряет объект window.API (обычно в родительском фрейме/окне).
// Если API не найден (пакет открыт напрямую из файла/на статике) —
// используем localStorage как фолбэк, чтобы пакет оставался полностью рабочим
// для предпросмотра и тестирования.

const SUSPEND_KEY = 'scorm1.2.suspend_data';

function findAPIInWindow(win) {
  let current = win;
  let tries = 0;
  while (current && current.API == null && current.parent && current.parent !== current && tries < 15) {
    current = current.parent;
    tries += 1;
  }
  return current ? current.API : null;
}

function findAPI() {
  if (typeof window === 'undefined') return null;
  if (window.API) return window.API;

  let api = findAPIInWindow(window);

  // LMS иногда открывает SCO в новом окне/фрейме, открывателем которого является окно с API.
  if (!api && window.opener) {
    let opener = window.opener;
    let tries = 0;
    while (opener && !api && tries < 15) {
      api = opener.API || findAPIInWindow(opener);
      opener = opener.opener;
      tries += 1;
    }
  }
  return api;
}

const isTrue = (value) => value === 'true' || value === true;

class ScormApi {
  constructor() {
    this.api = findAPI();
    this.fallback = !this.api;
    this.initialized = false;
    this.lastError = '0';

    // Фолбэк-хранилище — простой ключ/значение в localStorage.
    this.store = {};
    if (this.fallback) {
      try {
        const raw = localStorage.getItem(SUSPEND_KEY);
        this.store = raw ? JSON.parse(raw) : {};
      } catch {
        this.store = {};
      }
    }
  }

  /** Инициализация сессии. Вызывать один раз при старте. */
  init() {
    if (this.api) {
      this.initialized = isTrue(this.api.LMSInitialize(''));
    } else {
      this.initialized = true;
    }
    return this.initialized;
  }

  get(key) {
    if (this.api) {
      const value = this.api.LMSGetValue(key);
      this.lastError = this.api.LMSGetLastError ? this.api.LMSGetLastError() : '0';
      return value;
    }
    return this.store[key] ?? '';
  }

  set(key, value) {
    if (this.api) {
      const ok = isTrue(this.api.LMSSetValue(key, value));
      this.lastError = this.api.LMSGetLastError ? this.api.LMSGetLastError() : '0';
      return ok;
    }
    this.store[key] = String(value);
    this.#persist();
    return true;
  }

  commit() {
    if (this.api) {
      return isTrue(this.api.LMSCommit(''));
    }
    this.#persist();
    return true;
  }

  finish() {
    if (this.api) {
      return isTrue(this.api.LMSFinish(''));
    }
    this.#persist();
    return true;
  }

  #persist() {
    try {
      localStorage.setItem(SUSPEND_KEY, JSON.stringify(this.store));
    } catch {
      /* localStorage может быть недоступен (приватный режим) — игнорируем */
    }
  }
}

// Один общий экземпляр на сессию.
export const scorm = new ScormApi();
