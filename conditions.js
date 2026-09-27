const conditionCards = [...document.querySelectorAll('.condition-card')];
const conditionFilters = [...document.querySelectorAll('[data-filter]')];
const reduceConditionMotion = matchMedia('(prefers-reduced-motion: reduce)');
conditionFilters.forEach(button => button.addEventListener('click', () => {
  conditionFilters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  let visible = 0;
  conditionCards.forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
    if (!card.hidden) {
      visible++;
      if (!reduceConditionMotion.matches) card.animate([{ opacity: .3, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 300 });
    }
  });
  document.querySelector('#condition-results').textContent = `Showing ${visible} ${button.dataset.filter === 'all' ? '' : button.dataset.filter + ' '}concern${visible === 1 ? '' : 's'}.`;
}));
conditionCards.forEach(card => {
  const button = card.querySelector('.condition-more');
  button.setAttribute('aria-label', `Know more about ${card.querySelector('h3').textContent}`);
});
if ('IntersectionObserver' in window && !reduceConditionMotion.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.animate([{ opacity: .2, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 500 });
    observer.unobserve(entry.target);
  }), { threshold: .15 });
  conditionCards.forEach(card => observer.observe(card));
}
// Keep navigation links outside the rotating photo panels.
const mobileConditionCards = matchMedia('(max-width: 767px)');
const flipPanels = [...document.querySelectorAll('.condition-flip')];
flipPanels.forEach((panel, index) => {
  let timer;
  let inView = false;
  let pausedUntil = 0;
  const setFlipped = value => {
    panel.classList.toggle('is-flipped', value);
    panel.setAttribute('aria-pressed', String(value));
    panel.setAttribute('aria-label', `${value ? 'Show description' : 'Show illustrative photo'}: ${panel.querySelector('h3').textContent}`);
  };
  const stop = () => clearTimeout(timer);
  const schedule = (delay = 6000) => {
    stop();
    if (!inView || document.hidden || !mobileConditionCards.matches || reduceConditionMotion.matches) return;
    timer = setTimeout(() => {
      const remaining = pausedUntil - Date.now();
      if (remaining > 0) { schedule(remaining); return; }
      if (panel.matches(':focus-visible')) { schedule(); return; }
      setFlipped(!panel.classList.contains('is-flipped'));
      schedule();
    }, delay);
  };
  const manualFlip = value => {
    setFlipped(value);
    pausedUntil = Date.now() + 20000;
    schedule(20000);
  };
  panel.addEventListener('click', () => manualFlip(!panel.classList.contains('is-flipped')));
  panel.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); manualFlip(!panel.classList.contains('is-flipped'));
    }
    if (event.key === 'Escape') manualFlip(false);
  });
  panel.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse' && !mobileConditionCards.matches) setFlipped(true);
  });
  panel.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse' && !mobileConditionCards.matches) setFlipped(false);
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting && entries[0].intersectionRatio >= .5;
      schedule(6000 + (index % 4) * 900);
    }, { threshold: [0, .5] });
    observer.observe(panel);
  }
  document.addEventListener('visibilitychange', () => schedule());
  mobileConditionCards.addEventListener('change', () => schedule());
  reduceConditionMotion.addEventListener('change', () => schedule());
});