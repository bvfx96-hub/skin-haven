const fs = require('node:fs');
const data = require('./content/treatment-data');
const esc = t => t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
let home = fs.readFileSync('index.html','utf8');
const header = home.match(/<header class="header">[\s\S]*?<\/header>/)[0].replace(/href="#([^" ]+)"/g,'href="/index.html#$1"').replace(/src="assets\//g,'src="/assets/').replace('class="active"','');
const notice = home.match(/<dialog class="page-notice"[\s\S]*?<\/dialog>/)[0];
const base = fs.readFileSync('acne-acne-scar-treatment-durg-bhilai/index.html','utf8');
const visit = base.match(/<section class="visit-clinic"[\s\S]*?<\/section>/)[0];
data.forEach(d => {
  const image = `assets/treatments/${d.slug}.jpg`;
  if (fs.existsSync(`assets/treatments/${d.image}`)) fs.copyFileSync(`assets/treatments/${d.image}`,image);
  const pagePath = `${d.slug}/index.html`;
  let article = `<p class="treatment-intro">${esc(d.intro)}</p>` + d.sections.map(([title,body],i) => `<h2 id="topic-${i}">${esc(title)}</h2>${Array.isArray(body)?`<ul>${body.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:`<p>${esc(body)}</p>`}`).join('');
  const preserve = ['dark-circle-treatment-durg-bhilai','pigmentation-dark-spots-treatment-durg-bhilai','hair-loss-alopecia-treatment-durg-bhilai'].includes(d.slug);
  if (preserve) {
    const old = fs.readFileSync(pagePath,'utf8');
    article = old.match(/<article class="treatment-article">([\s\S]*?)<section class="visit-clinic"/)[1];
  } else {
    article += `<h2 id="treatment-faqs">Frequently asked questions</h2>${d.faq.map(([q,a])=>`<details class="treatment-faq"><summary>${esc(q)}</summary><div><p>${esc(a)}</p></div></details>`).join('')}`;
  }
  article += `<h2 id="planning-visit">Plan your visit from Bhilai or across Chhattisgarh</h2><p>Skin Haven is located near the new bus stand in Durg, at Arihant medical store, Sobhagya Complex, Chhattisgarh 491001. Patients from Bhilai, Risali, Supela, Nehru Nagar, Smriti Nagar and other parts of Chhattisgarh can call before travelling to confirm appointment availability.</p><p>Procedure suitability and pricing are discussed after assessment. Contact the clinic for an individual estimate and follow-up planning; a phone enquiry does not confirm a procedure booking.</p>`;
  if(d.medicalSource) article += `<p class="medical-reference">Patient information: <a href="${d.medicalSource[1]}" target="_blank" rel="noopener noreferrer">${d.medicalSource[0]}</a>.</p>`;
  const toc = [...article.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)].map(m=>`<a href="#${m[1]}">${m[2]}</a>`).join('');
  const title = `${d.name} in Durg–Bhilai | Skin Haven`;
  const description = `${d.name} consultation at Skin Haven, Durg, for patients from Bhilai and Chhattisgarh. Meet Dr. Sampreeti Sendur. Call +91 62683 27733.`;
  const output = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="icon" href="/assets/skin-haven-logo.jpg"><link rel="stylesheet" href="/style.css"></head><body class="treatment-page">${header}<main><section class="treatment-hero treatment-photo-hero"><div><nav class="treatment-breadcrumb" aria-label="Breadcrumb"><a href="/index.html">Home</a><span>/</span><a href="/index.html#treatments">Treatments</a></nav><p class="section-kicker">SKIN HAVEN · DURG, CHHATTISGARH</p><h1>${esc(d.name)} in Durg &amp; Bhilai</h1><p class="treatment-byline">Dr. Sampreeti Sendur <span>MBBS, DDVL – Dermatologist</span></p><a class="about-link" href="#visit-clinic">Book a Consultation ↗</a></div><figure><img src="/${image}" alt="${esc(d.name)} — illustrative treatment photograph" width="700" height="500"><figcaption>Illustrative image · Individual results vary.</figcaption></figure></section><div class="treatment-layout"><aside class="treatment-toc"><p>ON THIS PAGE</p><nav aria-label="On this page">${toc}</nav></aside><article class="treatment-article">${article}${visit}</article></div><section class="related-conditions"><p class="section-kicker">EXPLORE MORE</p><h2>Skin, hair &amp; aesthetic care</h2><div>${data.filter(p=>p!==d).map(p=>`<a href="/${p.slug}">${esc(p.name)} <span aria-hidden="true">↗</span></a>`).join('')}</div></section></main>${notice}<script src="/script.js"></script></body></html>`;
  fs.mkdirSync(d.slug,{recursive:true}); fs.writeFileSync(pagePath,output);
});
let index=0;
home = home.replace(/<article class="treatment-tile"[\s\S]*?<\/article>/g,()=>{
  const d=data[index++];
  return `<article class="treatment-tile"><div class="treatment-image treatment-photo"><img src="assets/treatments/${d.slug}.jpg" alt="${esc(d.name)} illustrative photograph" loading="lazy" width="700" height="500"></div><div class="treatment-tile-content"><h3>${esc(d.name)}</h3><a href="/${d.slug}" aria-label="Know more about ${esc(d.name)}">Know More <span aria-hidden="true">↗</span></a></div></article>`;
});
home = home.replace(/<p class="treatments-note">[\s\S]*?<\/p>/,'<p class="treatments-note">Images are illustrative, not patient results. Every treatment starts with a clinical consultation.</p>');
fs.writeFileSync('index.html',home);
console.log(`Built ${data.length} treatment pages and updated ${index} photo cards.`);
