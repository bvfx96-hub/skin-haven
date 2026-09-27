const fs=require('fs');let s=fs.readFileSync('results.js','utf8');const end=s.indexOf('const resultsTrack');s=`document.querySelectorAll('.result-compare input').forEach(input => {
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
`+s.slice(end);fs.writeFileSync('results.js',s);
