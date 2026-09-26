const fs=require('fs');let s=fs.readFileSync('server.js','utf8');s=s.replace('  let pathname;','  if(req.url.split("?")[0] === "/api/appointments") { require("./appointment-api").handle(req,res); return; }\n  let pathname;');s=s.replace('  let file =',`  if (pathname.split('/').some(p=>p.startsWith('.')) || /(?:appointment-api|server|add-|update-|build-|apply-|check-)/.test(pathname) || !/\\.(html|css|js|jpg|png|webp|mp4)$/.test(pathname) && pathname !== '/' && !pathname.endsWith('-durg-bhilai') && !pathname.endsWith('/')) { res.writeHead(403).end(); return; }
  let file =`);fs.writeFileSync('server.js',s);
let b=fs.readFileSync('booking.js','utf8');b=b.replace("visitForm.addEventListener('submit', event =>", "visitForm.addEventListener('submit', async event =>");b=b.replace("  const date = new Date(fields",`  const submit = visitForm.querySelector('button[type="submit"]');
  submit.disabled = true;
  let emailStatus;
  try {
    const response = await fetch('/api/appointments', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(fields)),signal:AbortSignal.timeout(20000)});
    const result = await response.json();
    emailStatus = result.message;
  } catch { emailStatus = 'Email could not be sent. Please use WhatsApp below.'; }
  finally { submit.disabled = false; }
  const date = new Date(fields`);b=b.replace("reminder.textContent = 'Request prepared.","reminder.textContent = emailStatus + ' Request prepared.");fs.writeFileSync('booking.js',b);
let h=fs.readFileSync('index.html','utf8').replace('Prepare a WhatsApp message, then review and send it. Your appointment is confirmed by the clinic.','Submit your details to request an appointment by email. You can also continue on WhatsApp. The clinic confirms your booking.');fs.writeFileSync('index.html',h);
