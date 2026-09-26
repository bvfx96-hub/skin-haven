const visitForm = document.querySelector('#visit-request');
const visitDate = visitForm.elements.date;
const visitTime = visitForm.elements.time;
const bookingLeadTime = 24 * 60 * 60 * 1000;
const clinicParts = timestamp => new Date(timestamp + 330 * 60000).toISOString();
const validateVisitDay = () => {
  const earliest = Date.now() + bookingLeadTime;
  const earliestParts = clinicParts(earliest);
  visitDate.min = earliestParts.slice(0,10);
  const sunday = visitDate.value && new Date(visitDate.value+'T12:00:00+05:30').getUTCDay() === 0;
  visitDate.setCustomValidity(sunday ? 'The clinic is closed on Sunday. Please choose Monday to Saturday.' : '');
  const selected = visitDate.value && visitTime.value ? Date.parse(visitDate.value+'T'+visitTime.value+':00+05:30') : NaN;
  visitTime.setCustomValidity(Number.isFinite(selected) && selected < earliest ? 'Please choose an appointment at least 24 hours from now (India time).' : '');
  const rounded = clinicParts(Math.ceil(earliest / 60000) * 60000);
  visitTime.min = visitDate.value === rounded.slice(0,10) ? rounded.slice(11,16) : '';
  document.querySelector('#visit-day').textContent = sunday ? 'Sunday closed — choose another date' : visitDate.value ? new Date(visitDate.value+'T12:00:00+05:30').toLocaleDateString('en-IN',{weekday:'long',timeZone:'Asia/Kolkata'}) : 'Monday–Saturday · Sunday closed';
};
visitDate.addEventListener('input', validateVisitDay);
visitTime.addEventListener('input', validateVisitDay);
validateVisitDay();
visitForm.elements.phone.addEventListener('input', event => {event.target.value = event.target.value.replace(/[^0-9]/g,'').slice(0,10);});
visitForm.addEventListener('submit', async event => {
  event.preventDefault();
  validateVisitDay();
  if(!visitForm.reportValidity()) return;
  const name = visitForm.elements.name.value.trim();
  if (!name) { visitForm.elements.name.setCustomValidity('Please enter your name.'); visitForm.elements.name.reportValidity(); return; }
  const fields = new FormData(visitForm);
  const submit = visitForm.querySelector('button[type="submit"]');
  submit.disabled = true;
  let emailStatus;
  try {
    const response = await fetch('/api/appointments', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(fields)),signal:AbortSignal.timeout(20000)});
    const result = await response.json();
    emailStatus = result.message;
  } catch { emailStatus = 'Request could not be saved. Please use WhatsApp below.'; }
  finally { submit.disabled = false; }
  const date = new Date(fields.get('date')+'T12:00:00').toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const message = ['Hello Skin Haven, I would like to request an appointment at your Durg clinic.', 'Doctor: Dr. Sampreeti Sendur', `Name: ${name}`, `Phone: ${fields.get('phone')}`, `Preferred day/date: ${date}`, `Preferred time (IST): ${fields.get('time')}`, fields.get('email') ? `Email: ${String(fields.get('email')).trim()}` : '', fields.get('message') ? `Message: ${String(fields.get('message')).trim()}` : '', 'Booking requires at least 24 hours advance notice.', 'Please arrive at the clinic 30 minutes before your confirmed appointment time.', 'Please confirm availability for my preferred date and time.'].filter(Boolean).join('\n');
  const link = document.createElement('a');
  link.href = `https://wa.me/916268327733?text=${encodeURIComponent(message)}`;
  link.target = '_blank'; link.rel = 'noopener noreferrer';
  link.textContent = 'Review & send on WhatsApp ↗';
  const reminder = document.createElement('p');
  reminder.textContent = emailStatus + ' Request prepared. Once the clinic confirms your appointment, please arrive 30 minutes before your appointment time.';
  document.querySelector('.visit-request-status').replaceChildren(reminder, link);
  link.addEventListener('click', event => { validateVisitDay(); if (!visitForm.reportValidity()) { event.preventDefault(); document.querySelector('.visit-request-status').replaceChildren(); } });
});
visitForm.elements.name.addEventListener('input', () => visitForm.elements.name.setCustomValidity(''));
visitForm.addEventListener('input', () => document.querySelector('.visit-request-status').replaceChildren());
