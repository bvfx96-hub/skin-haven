const galleryDialog = document.querySelector('.gallery-dialog');
const galleryPlayer = galleryDialog.querySelector('video');
let galleryOpener;
const openGalleryVideo = event => {
  galleryOpener = event.currentTarget;
  document.querySelectorAll('video').forEach(video => video.pause());
  galleryDialog.showModal();
  document.body.classList.add('gallery-video-open');
  galleryPlayer.play().catch(() => {});
};
document.querySelectorAll('.video-preview, .watch-video').forEach(button => button.addEventListener('click', openGalleryVideo));
galleryDialog.querySelector('.close-gallery-video').addEventListener('click', () => galleryDialog.close());
galleryDialog.addEventListener('click', event => { if (event.target === galleryDialog) { const rect = galleryDialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) galleryDialog.close(); } });
galleryDialog.addEventListener('close', () => { galleryPlayer.pause(); document.body.classList.remove('gallery-video-open'); galleryOpener?.focus(); });
