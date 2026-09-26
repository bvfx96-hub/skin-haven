const fs = require('node:fs');
const source = fs.readFileSync('content/conditions.md', 'utf8').replace(/\r/g, '');
const home = fs.readFileSync('index.html', 'utf8');
const escape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inline = text => escape(text).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
const pages = source.split(/^# PAGE \d+: /m).slice(1).map(chunk => {
  const slug = chunk.match(/`\/([^`]+)`/)[1];
  const title = chunk.match(/\*\*Meta Title:\*\*\s*\n([^\n]+)/)[1];
  const description = chunk.match(/\*\*Meta Description:\*\*\s*\n([^\n]+)/)[1];
  const body = chunk.slice(chunk.indexOf('\n# ') + 1).trim();
  const heading = body.split('\n')[0].slice(2);
  return { slug, title, description, heading, body };
});
const visit = `<section class="visit-clinic" id="visit-clinic" aria-labelledby="visit-title"><p class="section-kicker">PERSONAL CARE. CLOSE TO HOME.</p><h2 id="visit-title">Visit Skin Haven Clinic</h2><p>Skin Haven – Skin, Hair, Aesthetic &amp; Laser Clinic provides personalised dermatology and aesthetic care for patients from Durg, Bhilai, Risali, Supela, Nehru Nagar, Smriti Nagar and nearby areas of Chhattisgarh.</p><div class="visit-doctor"><strong>Dr. Sampreeti Sendur</strong><span>MBBS, DDVL – Dermatologist</span></div><p class="visit-note">Treatment recommendations and results vary according to the patient’s diagnosis, skin type and individual response. A clinical consultation is required before beginning any procedure.</p><div class="visit-actions"><a class="about-link" href="/index.html#appointment">Book Appointment <span aria-hidden="true">↗</span></a><button type="button" disabled>Call Now</button><button type="button" disabled>WhatsApp Us</button></div><p class="contact-pending">Phone and WhatsApp contact details will be available soon.</p></section>`;
let header = home.match(/<header class="header">[\s\S]*?<\/header>/)[0].replace(/href="#home"/g, 'href="/index.html"').replace(/href="#care"/g, 'href="/index.html#care"').replace(/href="#appointment"/g, 'href="#visit-clinic"').replace(/src="assets\//g, 'src="/assets/').replace('class="active"','');
const notice = home.match(/<dialog class="page-notice"[\s\S]*?<\/dialog>/)[0];
pages.forEach((page, pageIndex) => {
  const lines = page.body.split('\n');
  let html = '', inList = false, inFaq = false, faqOpen = false, sectionCount = 0;
  const toc = [];
  const closeList = () => { if(inList) { html += '</ul>'; inList = false; } };
  const closeFaq = () => { if(faqOpen) { html += '</div></details>'; faqOpen = false; } };
  for (const raw of lines.slice(1)) {
    const line = raw.trim();
    if(!line) { closeList(); continue; }
    if(line.startsWith('## ')) {
      closeList(); closeFaq();
      const heading = line.slice(3); const id = 'section-' + ++sectionCount;
      toc.push({heading, id}); inFaq = heading === 'Frequently Asked Questions';
      html += `<h2 id="${id}">${inline(heading)}</h2>`;
    } else if(line.startsWith('* ')) {
      if(!inList) {html += '<ul>'; inList = true;}
      html += `<li>${inline(line.slice(2))}</li>`;
    } else if(inFaq && /^\*\*.+\*\*$/.test(line)) {
      closeFaq(); html += `<details class="treatment-faq"><summary>${inline(line.slice(2,-2))}</summary><div>`; faqOpen = true;
    } else if(/^\*\*.+\*\*$/.test(line) && /Book|Schedule/.test(line)) {
      html += `<p><a class="text-consult" href="#visit-clinic">${inline(line.slice(2,-2))} ↗</a></p>`;
    } else { closeList(); html += `<p>${inline(line)}</p>`; }
  }
  closeList(); closeFaq();
  const related = pages.filter((_, i) => i !== pageIndex).map(p => `<a href="/${p.slug}">${escape(p.heading.replace(' in Durg & Bhilai',''))}<span aria-hidden="true">↗</span></a>`).join('');
  const output = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}"><link rel="icon" href="/assets/skin-haven-logo.jpg"><link rel="stylesheet" href="/style.css"></head><body class="treatment-page">${header}<main><section class="treatment-hero"><div><nav class="treatment-breadcrumb" aria-label="Breadcrumb"><a href="/index.html">Home</a><span>/</span><a href="/index.html#conditions">Conditions</a></nav><p class="section-kicker">SKIN HAVEN · DURG &amp; BHILAI</p><h1>${escape(page.heading)}</h1><p class="treatment-byline">Dr. Sampreeti Sendur <span>MBBS, DDVL – Dermatologist</span></p><a class="about-link" href="#visit-clinic">Plan Your Consultation ↗</a></div></section><div class="treatment-layout"><aside class="treatment-toc"><p>ON THIS PAGE</p><nav aria-label="On this page">${toc.map(t => `<a href="#${t.id}">${escape(t.heading)}</a>`).join('')}</nav></aside><article class="treatment-article">${html}${visit}</article></div><section class="related-conditions"><p class="section-kicker">EXPLORE MORE</p><h2>Other skin &amp; hair concerns</h2><div>${related}</div></section></main>${notice}<script src="/script.js"></script></body></html>`;
  fs.mkdirSync(page.slug, {recursive:true}); fs.writeFileSync(`${page.slug}/index.html`, output);
});
let i = 0;
let updated = home.replace(/<button type="button" class="condition-more">Know More <span aria-hidden="true">↗<\/span><\/button>/g, () => `<a class="condition-more" href="/${pages[i++].slug}">Know More <span aria-hidden="true">↗</span></a>`);
updated = updated.replace(/\s*<dialog class="condition-dialog"[\s\S]*?<\/dialog>/, '');
updated = updated.replace(/\s*<div class="home-visit-wrap"><section class="visit-clinic"[\s\S]*?<\/section><\/div>/, '');
const aboutPath = 'about-us.html';
let about = fs.readFileSync(aboutPath, 'utf8');
if (!about.includes('id="visit-clinic"')) {
  about = about.replace('</main>', `<div class="inner-visit-wrap">${visit}</div></main>`);
  fs.writeFileSync(aboutPath, about);
}
fs.writeFileSync('index.html', updated);
console.log(`Built ${pages.length} condition pages and connected ${i} home links.`);
