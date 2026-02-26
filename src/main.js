import './style.css'
const revealElements = document.querySelectorAll(".reveal");
const pingElements = document.querySelectorAll(".ping-value");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealElements.forEach((element) => observer.observe(element));

const abStorageKey = "virtez_ab_hero_v1";
const abVariants = {
  a: {
    headline: "Подключи VPN за 1 минуту",
    offer: "3 дня бесплатно • от 299 ₽ • скорость до 10 Гбит/с",
    ctaPrimary: "Активировать пробный период",
    ctaTop: "Попробовать бесплатно",
    ctaSecondary: "Открыть бота и подключиться",
    ctaFooter: "Перейти в Telegram-бот",
    ctaSticky: "Открыть бота",
  },
  b: {
    headline: "Стабильный VPN без лишних шагов",
    offer: "Запуск за минуту • 3 дня бесплатно • от 299 ₽",
    ctaPrimary: "Запустить бесплатный период",
    ctaTop: "Активировать бесплатно",
    ctaSecondary: "Начать безопасное подключение",
    ctaFooter: "Запустить VPN",
    ctaSticky: "Запустить VPN",
  },
};

const setTextBySelector = (selector, text) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = text;
  });
};

const getAbVariant = () => {
  const forcedVariant = new URLSearchParams(window.location.search).get("ab");
  if (forcedVariant === "a" || forcedVariant === "b") {
    try {
      localStorage.setItem(abStorageKey, forcedVariant);
    } catch {
      // Ignore storage errors in restricted environments.
    }
    return forcedVariant;
  }

  try {
    const savedVariant = localStorage.getItem(abStorageKey);
    if (savedVariant === "a" || savedVariant === "b") {
      return savedVariant;
    }
  } catch {
    // Ignore storage errors in restricted environments.
  }

  const randomVariant = Math.random() < 0.5 ? "a" : "b";
  try {
    localStorage.setItem(abStorageKey, randomVariant);
  } catch {
    // Ignore storage errors in restricted environments.
  }
  return randomVariant;
};

const applyAbVariant = () => {
  const variantKey = getAbVariant();
  const variant = abVariants[variantKey] ?? abVariants.a;

  setTextBySelector("[data-ab-headline]", variant.headline);
  setTextBySelector("[data-ab-offer]", variant.offer);
  setTextBySelector("[data-ab-cta-primary]", variant.ctaPrimary);
  setTextBySelector("[data-ab-cta-top]", variant.ctaTop);
  setTextBySelector("[data-ab-cta-secondary]", variant.ctaSecondary);
  setTextBySelector("[data-ab-cta-footer]", variant.ctaFooter);
  setTextBySelector("[data-ab-cta-sticky]", variant.ctaSticky);
  document.body.dataset.abVariant = variantKey;
};

applyAbVariant();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pingUpdateMinInterval = 3000;
const pingUpdateMaxInterval = 4000;
const pingAnimationDuration = 1700;
const pingStates = new WeakMap();

const getRandomPing = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const setPingText = (element, value) => {
  element.textContent = `${value} мс`;
};

const updatePing = (element) => {
  const state = pingStates.get(element);
  if (!state) {
    return;
  }

  const target = getRandomPing(state.min, state.max);
  if (target === state.current) {
    return;
  }

  if (prefersReducedMotion) {
    state.current = target;
    setPingText(element, target);
    return;
  }

  if (state.rafId) {
    cancelAnimationFrame(state.rafId);
  }

  const startValue = state.current;
  const startTime = performance.now();

  const animate = (time) => {
    const progress = Math.min((time - startTime) / pingAnimationDuration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const nextValue = Math.round(
      startValue + (target - startValue) * easedProgress
    );

    state.current = nextValue;
    setPingText(element, nextValue);

    if (progress < 1) {
      state.rafId = requestAnimationFrame(animate);
      return;
    }

    state.current = target;
    setPingText(element, target);
    state.rafId = null;
  };

  state.rafId = requestAnimationFrame(animate);
};

const schedulePingRefresh = () => {
  window.setTimeout(() => {
    pingElements.forEach(updatePing);
    schedulePingRefresh();
  }, getRandomInterval(pingUpdateMinInterval, pingUpdateMaxInterval));
};

if (pingElements.length > 0) {
  pingElements.forEach((element) => {
    const min = Number.parseInt(element.dataset.pingMin ?? "30", 10);
    const max = Number.parseInt(element.dataset.pingMax ?? "40", 10);

    if (Number.isNaN(min) || Number.isNaN(max) || min > max) {
      return;
    }

    const initialValue = getRandomPing(min, max);
    pingStates.set(element, { min, max, current: initialValue, rafId: null });
    setPingText(element, initialValue);
  });

  schedulePingRefresh();
}

const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
