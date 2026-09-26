const galleryButtons = [...document.querySelectorAll('.gallery-thumb')];
galleryButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const source = button.querySelector('img');
    const featured = document.querySelector('#clinic-featured');
    featured.src = source.src;
    featured.alt = source.alt;
    featured.classList.toggle('portrait-view', index === 4);
    document.querySelector('#clinic-caption').textContent = button.dataset.caption;
    document.querySelector('#clinic-count').textContent = `${String(index + 1).padStart(2, '0')} / 05`;
    galleryButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) featured.animate([{ opacity: .4 }, { opacity: 1 }], { duration: 350 });
  });
});
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const aboutObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.animate([{ opacity: .3, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 650, easing: 'ease-out' });
      aboutObserver.unobserve(entry.target);
    });
  }, { threshold: .12 });
  document.querySelectorAll('.about-copy, .clinic-gallery, .doctor-copy, .doctor-visual, .procedures-copy, .procedures-visual').forEach(element => aboutObserver.observe(element));
}
