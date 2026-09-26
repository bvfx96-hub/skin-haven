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
