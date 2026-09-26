const fs=require('fs');
const section=`
<section class="testimonials-section" id="testimonials" aria-labelledby="testimonials-title">
 <div class="testimonials-wrap">
  <header class="testimonials-heading"><p class="section-kicker">PATIENT EXPERIENCES</p><h2 id="testimonials-title">Your experience.<br><em>Your words.</em></h2><p>Explore patient feedback for Skin Haven in Durg, welcoming patients from Bhilai and across Chhattisgarh.</p></header>
  <div class="testimonials-grid">
   <article class="testimonial-card"><span class="review-symbol" aria-hidden="true">“</span><p class="review-eyebrow">SKIN HAVEN · DURG</p><h3>Hear from our patients</h3><p>Read patient experiences on our Google profile before planning your visit.</p><a href="https://www.google.com/maps?cid=7357031609215245511" target="_blank" rel="noopener noreferrer">Read Google Reviews <span aria-hidden="true">↗</span></a></article>
   <article class="testimonial-card"><span class="review-symbol" aria-hidden="true">✎</span><p class="review-eyebrow">BEEN TO OUR CLINIC?</p><h3>Share your experience</h3><p>Your feedback helps us understand your visit and helps others get to know the clinic.</p><a href="https://www.google.com/maps?cid=7357031609215245511" target="_blank" rel="noopener noreferrer">Review us on Google <span aria-hidden="true">↗</span></a></article>
   <article class="testimonial-card"><span class="review-symbol" aria-hidden="true">♡</span><p class="review-eyebrow">CARE CLOSE TO HOME</p><h3>Start your own journey</h3><p>Have a skin or hair concern? Meet Dr. Sampreeti Sendur at our Durg clinic for a personal consultation.</p><a href="#book-visit">Plan Your Visit <span aria-hidden="true">↗</span></a></article>
  </div>
  <a class="google-reviews-link" href="https://www.google.com/maps?cid=7357031609215245511" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">G</span> Skin Haven · Durg–Bhilai <span aria-hidden="true">↗</span></a>
 </div>
</section>
`;
let html=fs.readFileSync('index.html','utf8');
html=html.replace('<section class="booking-section"',section+'<section class="booking-section"');
fs.writeFileSync('index.html',html);
