const fs = require('node:fs');
const cards = [
 ['Pimple Treatment',118,175,'/acne-acne-scar-treatment-durg-bhilai'],
 ['Acne Scar Treatment',444,215,'/acne-acne-scar-treatment-durg-bhilai'],
 ['Dark Circle Treatment',770,195,'/dark-circle-treatment-durg-bhilai'],
 ['Dark Spots & Pigmentation',1096,175,'/pigmentation-dark-spots-treatment-durg-bhilai'],
 ['Skin Lightening Treatment',1422,195,null],
 ['Botox',118,490,null],
 ['Dermal Fillers',444,530,null],
 ['Thread Lifts',770,510,null],
 ['Laser Hair Removal',1096,495,null],
 ['Hair Loss Treatment',1422,510,'/hair-loss-alopecia-treatment-durg-bhilai']
];
const markup = `<section class="treatments-section" id="treatments" aria-labelledby="treatments-title"><div class="treatments-wrap"><header class="conditions-heading"><p class="section-kicker">TREATMENTS AT SKIN HAVEN</p><h2 id="treatments-title">Skin &amp; hair care in Bhilai–Durg.<br><em>Explore your options.</em></h2><p>Treatment suitability is assessed during a clinical consultation. Explore skin, hair and aesthetic care at Skin Haven.</p></header><div class="treatments-grid">${cards.map(([title,x,y,href],i) => `<article class="treatment-tile" style="--tile-delay:${i%5*60}ms"><div class="treatment-image" role="img" aria-label="${title.replace('&','&amp;')} illustrative photograph"><img src="assets/skin-hair-treatment-reference.png" alt="" loading="lazy" width="1834" height="837" style="left:${-x/311*100}%;top:${-y/200*100}%"></div><div class="treatment-tile-content"><h3>${title.replace('&','&amp;')}</h3>${href ? `<a href="${href}" aria-label="Know more about ${title.replace('&','&amp;')}">Know More <span aria-hidden="true">↗</span></a>` : `<button type="button" data-page="${title.replace('&','&amp;')}">Know More <span aria-hidden="true">↗</span></button>`}</div></article>`).join('')}</div><p class="treatments-note">Every skin journey is different. Let's find the right starting point for yours.</p><a class="about-link" href="#appointment">Book a Consultation <span aria-hidden="true">↗</span></a></div></section>`;
let html = fs.readFileSync('index.html','utf8');
if(!html.includes('id="treatments"')) html = html.replace('  </main>', markup + '\n  </main>');
html = html.replace(/<button type="button" data-page="Services">Services<\/button>/g,'<a href="#treatments">Services</a>');
fs.writeFileSync('index.html',html);
