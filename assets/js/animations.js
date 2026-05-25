// animations.js

window.initAnimations = () => {
  // --- Fade-in on scroll ---
  const fadeElements = document.querySelectorAll(".fade-in-up:not(.visible)");

  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    fadeElements.forEach(el => fadeObserver.observe(el));
  }

  // --- Dynamic Number Counters ---
  const animateValue = (obj, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentVal = Math.floor(easeProgress * (end - start) + start);
      
      const prefix = obj.getAttribute('data-prefix') || '';
      const suffix = obj.getAttribute('data-suffix') || '';
      
      obj.innerHTML = `${prefix}${currentVal}${suffix}`;
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.innerHTML = `${prefix}${end}${suffix}`;
      }
    };
    window.requestAnimationFrame(step);
  };

  const numberElements = document.querySelectorAll(".metric-value[data-target-value]:not(.animated)");

  if (numberElements.length > 0) {
    const numberObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const endValue = parseInt(el.getAttribute("data-target-value"), 10);
          if (!isNaN(endValue)) {
            el.classList.add("animated");
            animateValue(el, 0, endValue, 2000);
          }
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.5
    });

    numberElements.forEach(el => numberObserver.observe(el));
  }
};

document.addEventListener("DOMContentLoaded", () => {
  window.initAnimations();
});
