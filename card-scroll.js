document.querySelectorAll('.card-scroll-controls').forEach(controls => {
  const track = document.getElementById(controls.dataset.track);
  const previous = controls.querySelector('[data-direction="-1"]');
  const next = controls.querySelector('[data-direction="1"]');
  const move = direction => track.scrollBy({left: direction * (track.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap)), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => { if(event.target === track && ['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();move(event.key === 'ArrowLeft' ? -1 : 1);} });
  const update = () => {previous.disabled = track.scrollLeft <= 2;next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;};
  track.addEventListener('scroll', update, {passive:true});
  new ResizeObserver(update).observe(track);
  update();
});

// Mobile care-method carousel: native swipe and accessible step buttons.
(() => {
  const track = document.querySelector('.care-method-grid');
  if (!track) return;
  const cards = [...track.children];
  const dots = document.createElement('div');
  dots.className = 'care-method-dots';
  dots.setAttribute('role', 'group');
  dots.setAttribute('aria-label', 'Choose a care step');
  track.id = 'care-method-track';
  track.setAttribute('tabindex', '0');
  track.setAttribute('aria-label', 'Care steps. Swipe or use arrow keys to explore.');
  const buttons = cards.map((card, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Show step ${index + 1}: ${card.querySelector('h3').textContent}`);
    button.setAttribute('aria-controls', track.id);
    button.addEventListener('click', () => move(index));
    dots.append(button);
    return button;
  });
  track.after(dots);
  const active = () => cards.reduce((best, card, i) => Math.abs(card.getBoundingClientRect().left - track.getBoundingClientRect().left) < Math.abs(cards[best].getBoundingClientRect().left - track.getBoundingClientRect().left) ? i : best, 0);
  const update = () => buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === active())));
  const move = index => track.scrollBy({left: cards[index].getBoundingClientRect().left - track.getBoundingClientRect().left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  track.addEventListener('scroll', update, {passive: true});
  track.addEventListener('keydown', event => {
    if (event.target !== track || !matchMedia('(max-width: 600px)').matches) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); move(Math.max(0, Math.min(cards.length - 1, active() + (event.key === 'ArrowRight' ? 1 : -1))));
    }
  });
  window.addEventListener('resize', update);
  update();
})();
