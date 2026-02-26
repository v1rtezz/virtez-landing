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
