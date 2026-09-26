document.querySelectorAll('.result-compare input').forEach(input => {
  const comparison = input.closest('.result-compare');
  const beforeLabel = comparison.querySelector('.before-label');
  const afterLabel = comparison.querySelector('.after-label');
  const updateComparison = () => {
    const split = Number(input.value);
    comparison.style.setProperty('--split', split + '%');
    input.setAttribute('aria-valuetext', split + '% before, ' + (100 - split) + '% after');
    // Hide a label when its image side cannot contain the label and its inset.
    const width = comparison.clientWidth;
    beforeLabel.style.visibility = width * split / 100 >= beforeLabel.offsetWidth + 20 ? 'visible' : 'hidden';
    afterLabel.style.visibility = width * (100 - split) / 100 >= afterLabel.offsetWidth + 20 ? 'visible' : 'hidden';
  };
  input.addEventListener('input', updateComparison);
  new ResizeObserver(updateComparison).observe(comparison);
  updateComparison();
});
const resultsTrack=document.querySelector('.results-track');
const resultsPrev=document.querySelector('.results-prev');
const resultsNext=document.querySelector('.results-next');
const moveResults=direction=>resultsTrack.scrollBy({left:direction*(resultsTrack.querySelector('.result-card').getBoundingClientRect().width+18),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
resultsPrev.addEventListener('click',()=>moveResults(-1));
resultsNext.addEventListener('click',()=>moveResults(1));
const updateResults=()=>{resultsPrev.disabled=resultsTrack.scrollLeft<=2;resultsNext.disabled=resultsTrack.scrollLeft+resultsTrack.clientWidth>=resultsTrack.scrollWidth-2;};
resultsTrack.addEventListener('scroll',updateResults,{passive:true});
new ResizeObserver(updateResults).observe(resultsTrack);
updateResults();
