const fs = require('node:fs');
const clinic = {
  name:'Skin Haven – Skin, Hair & Aesthetic Dermatology Clinic',
  phone:'+916268327733', displayPhone:'+91 62683 27733',
  address:'Arihant medical store, Sobhagya Complex, near new bus stand, Durg, Chhattisgarh 491001',
  whatsapp:'https://wa.me/916268327733',
  maps:'https://www.google.com/maps?cid=7357031609215245511',
  directions:'https://www.google.com/maps/dir/?api=1&destination=Skin+Haven+Arihant+medical+store+Sobhagya+Complex+new+bus+stand+Durg+Chhattisgarh+491001'
};
fs.writeFileSync('content/clinic.json',JSON.stringify(clinic,null,2));
const footer = `<footer class="site-footer" id="contact"><div class="footer-intro"><div><p class="footer-eyebrow">YOUR NEXT STEP STARTS HERE</p><h2>Let’s make time for <em>you.</em></h2></div><div class="footer-actions"><a href="/index.html#book-visit">Request Appointment ↗</a><a href="${clinic.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp Us ↗</a></div></div><div class="footer-grid"><div class="footer-brand"><a href="/index.html"><img src="/assets/skin-haven-logo.jpg" alt="Skin Haven" width="64" height="64"><span>Skin Haven</span></a><p>Skin, Hair &amp; Aesthetic Dermatology Clinic in Durg–Bhilai</p><p>Personalised care with Dr. Sampreeti Sendur<br><span>MBBS, DDVL – Dermatologist</span></p></div><div><h2>Visit our Durg clinic</h2><address>${clinic.address}</address><a href="${clinic.directions}" target="_blank" rel="noopener noreferrer">Get Directions ↗</a><a href="${clinic.maps}" target="_blank" rel="noopener noreferrer">View Google Reviews ↗</a></div><div><h2>Let's talk</h2><a class="footer-phone" href="tel:${clinic.phone}">${clinic.displayPhone}</a><a href="${clinic.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp Us ↗</a><a href="/index.html#appointment">Book Appointment ↗</a><p>Monday–Saturday · Sunday closed. Call to confirm timings and appointment availability before your visit.</p></div><div><h2>Explore</h2><a href="/about-us.html">About Us</a><a href="/index.html#conditions">Skin &amp; Hair Conditions</a><a href="/index.html#treatments">Treatments</a><a href="/index.html#health-tips">Health Tips</a><a href="/index.html#faq">FAQs</a><a href="/contact.html">Contact &amp; Directions</a></div></div><div class="footer-bottom"><p>Welcoming patients from Durg, Bhilai, Risali, Supela, Nehru Nagar, Smriti Nagar and across Chhattisgarh.</p><div class="footer-legal"><span>© ${new Date().getFullYear()} Skin Haven. Development &amp; Promotion by BVFX Digify.</span><a href="/index.html#home">Back to top ↑</a></div></div></footer>`;
const home = fs.readFileSync('index.html','utf8');
const header = home.match(/<header class="header">[\s\S]*?<\/header>/)[0].replace(/href="#([^" ]+)"/g,'href="/index.html#$1"').replace(/src="assets\//g,'src="/assets/').replace('class="active"','');
const notice = home.match(/<dialog class="page-notice"[\s\S]*?<\/dialog>/)[0];
fs.writeFileSync('contact.html',`<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Contact Skin Haven in Durg–Bhilai | Address &amp; Appointments</title><meta name="description" content="Visit Skin Haven near the new bus stand in Durg, Chhattisgarh 491001. Call +91 62683 27733 for skin, hair and aesthetic consultations."><link rel="stylesheet" href="/style.css"><link rel="icon" href="/assets/skin-haven-logo.jpg"></head><body class="about-page">${header}<main class="contact-main"><p class="section-kicker">DURG · BHILAI · CHHATTISGARH</p><h1>Let's plan your visit.</h1><div class="contact-layout"><img src="/assets/skin-haven-clinic-reception-bhilai-durg.png" alt="Reception at Skin Haven clinic in Durg" width="800" height="500"><div><h2>Skin Haven Clinic</h2><address>${clinic.address}</address><p><strong>Dr. Sampreeti Sendur</strong><br>MBBS, DDVL – Dermatologist</p><div class="visit-actions"><a class="about-link" href="tel:${clinic.phone}">Call ${clinic.displayPhone}</a><a class="about-link" href="${clinic.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp Us ↗</a><a class="about-link" href="${clinic.directions}" target="_blank" rel="noopener noreferrer">Get Directions ↗</a></div><p>Sunday closed. Call before travelling to confirm consultation timings. An enquiry does not confirm an appointment.</p></div></div></main>${notice}<script src="/script.js"></script></body></html>`);
const paths=['index.html','about-us.html','contact.html',...fs.readdirSync('.',{withFileTypes:true}).filter(e=>e.isDirectory()&&e.name.endsWith('-durg-bhilai')).map(e=>`${e.name}/index.html`)];
const esc = s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
for(const path of paths){
  let html=fs.readFileSync(path,'utf8');
  if(path!=='index.html') html=html.replace(/href="#treatments"/g,'href="/index.html#treatments"');
  html=html.replace(/<footer class="site-footer"[\s\S]*?<\/footer>/g,'').replace(/<script type="application\/ld\+json" id="clinic-schema">[\s\S]*?<\/script>/g,'');
  html=html.replace(/<button type="button" disabled>Call Now<\/button>/g,`<a class="contact-action" href="tel:${clinic.phone}">Call Now</a>`).replace(/<button type="button" disabled>WhatsApp Us<\/button>/g,`<a class="contact-action" href="${clinic.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp Us</a>`).replace(/<p class="contact-pending">[\s\S]*?<\/p>/g,'');
  html=html.replace(/<button type="button" data-page="Contact">Contact<\/button>/g,'<a href="/contact.html">Contact</a>').replace(/<button type="button" data-page="Procedures">Procedures<\/button>/g,'<a href="/index.html#procedures">Procedures</a>').replace(/<button type="button" data-page="Services">Services<\/button>/g,'<a href="/index.html#treatments">Services</a>');
  if(path==='index.html'){
    html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>Skin & Hair Clinic in Durg–Bhilai, Chhattisgarh | Skin Haven</title>').replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="Skin Haven in Durg offers personalised skin, hair, aesthetic and laser consultations with Dr. Sampreeti Sendur for patients from Bhilai and Chhattisgarh. Call 62683 27733.">');
    html=html.replace(/<p class="form-status" role="status">[\s\S]*?<\/p>/,'<p class="form-status" role="status"></p>');
    if(!html.includes('class="booking-note"')) html=html.replace('<p class="form-status"','<p class="booking-note">Prepare an appointment request on WhatsApp. Your visit is confirmed by the clinic.</p><p class="form-status"');
  }
  const title=html.match(/<title>(.*?)<\/title>/)[1];
  const desc=html.match(/<meta name="description" content="([^"]*)"/)[1];
  html=html.replace(/<meta property="og:(title|description|type)" content="[^"]*">/g,'');
  html=html.replace('</head>',`<meta property="og:title" content="${esc(title.replace(/&amp;/g,'&'))}"><meta property="og:description" content="${desc}"><meta property="og:type" content="website"></head>`);
  const schema={'@context':'https://schema.org','@graph':[
    {'@type':'MedicalClinic','@id':'#skin-haven',name:clinic.name,telephone:clinic.phone,medicalSpecialty:'Dermatology',address:{'@type':'PostalAddress',streetAddress:'Arihant medical store, Sobhagya Complex, near new bus stand',addressLocality:'Durg',addressRegion:'Chhattisgarh',postalCode:'491001',addressCountry:'IN'},areaServed:['Durg','Bhilai','Risali','Supela','Nehru Nagar','Smriti Nagar','Chhattisgarh'],hasMap:clinic.maps},
    {'@type':'Person','@id':'#doctor',name:'Dr. Sampreeti Sendur',jobTitle:'Dermatologist',hasCredential:[{'@type':'EducationalOccupationalCredential',name:'MBBS'},{'@type':'EducationalOccupationalCredential',name:'DDVL'}],worksFor:{'@id':'#skin-haven'}},
    {'@type':path.includes('-durg-bhilai/')?'MedicalWebPage':'WebPage',name:title.replace(/&amp;/g,'&'),description:desc.replace(/&amp;/g,'&'),inLanguage:'en-IN',publisher:{'@id':'#skin-haven'}}
  ]};
  html=html.replace('</head>',`<script type="application/ld+json" id="clinic-schema">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script></head>`);
  html=html.replace('</body>',`${footer}</body>`);
  fs.writeFileSync(path,html);
}
const origin=process.env.SITE_URL;
if(origin){
  const url=new URL(origin); if(url.protocol!=='https:') throw Error('SITE_URL must use HTTPS');
  const links=paths.map(p=>new URL(p==='index.html'?'/':p.replace('/index.html',''),url.origin+'/').href);
  paths.forEach((p,i)=>{let html=fs.readFileSync(p,'utf8').replace(/<link rel="canonical"[^>]*>/g,''); html=html.replace('</head>',`<link rel="canonical" href="${links[i]}"></head>`);fs.writeFileSync(p,html);});
  fs.writeFileSync('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${links.map(u=>`<url><loc>${u}</loc></url>`).join('')}</urlset>`);
  fs.writeFileSync('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${url.origin}/sitemap.xml\n`);
}
console.log(`Updated clinic details, contact links, metadata and structured data on ${paths.length} pages.`);

