const video = document.querySelector('video');
const videoToggle = document.querySelector('.video-toggle');
if (video && videoToggle) {
const updateVideoControl = () => {
  videoToggle.setAttribute('aria-label', video.paused ? 'Play background video' : 'Pause background video');
  document.querySelector('.video-label').textContent = video.paused ? 'Play video' : 'Pause video';
  document.querySelector('.play-icon').textContent = video.paused ? '▷' : 'Ⅱ';
};
if (matchMedia('(prefers-reduced-motion: reduce)').matches) { video.autoplay = false; video.pause(); }
video.addEventListener('play', updateVideoControl);
video.addEventListener('pause', updateVideoControl);
videoToggle.addEventListener('click', () => { if (video.paused) video.play().catch(updateVideoControl); else video.pause(); });
updateVideoControl();
}
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
menuToggle.addEventListener('click', () => {
  mobileNav.hidden = !mobileNav.hidden;
  menuToggle.setAttribute('aria-expanded', String(!mobileNav.hidden));
  menuToggle.setAttribute('aria-label', mobileNav.hidden ? 'Open navigation' : 'Close navigation');
});
mobileNav.addEventListener('click', (event) => {
  if (event.target.closest('a')) { mobileNav.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open navigation'); }
});
const pageNotice = document.querySelector('.page-notice');
// Edit data-count in the cards to update the numbers and their animation targets.
const counters = document.querySelectorAll('[data-count]');
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count);
      const start = performance.now();
      const tick = now => {
        const progress = Math.min((now - start) / 1400, 1);
        element.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3))).toLocaleString('en-US');
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(element);
    });
  }, { threshold: 0.5 });
  counters.forEach(counter => counterObserver.observe(counter));
}
document.querySelectorAll('[data-page]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('#page-notice-title').textContent = button.dataset.page;
    pageNotice.showModal();
  });
});
