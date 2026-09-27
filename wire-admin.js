const fs=require('fs');let s=fs.readFileSync('appointment-api.js','utf8');s="const store=require('./store');\nconst crypto=require('node:crypto');\n"+s;
s=s.replace(" if(!process.env.RESEND_API_KEY || !process.env.APPOINTMENT_FROM) return reply(503,'Email service is not connected yet. Please use WhatsApp.');",'');
s=s.replace(" const text=['New appointment",` const id=crypto.randomUUID();
 store.change(db=>db.appointments.unshift({id,name:data.name.trim(),phone:data.phone,email:data.email||'',date:data.date,time:data.time,message:data.message||'',status:'pending',notes:'',emailStatus:'not configured',createdAt:new Date().toISOString()}));
 const saved='Request saved. Reference: '+id.slice(0,8)+'. The clinic will confirm your appointment. Please arrive 30 minutes early.';
 if(!process.env.RESEND_API_KEY || !process.env.APPOINTMENT_FROM)return reply(201,saved);
 const text=['New appointment`);
s=s.replace(" if(!response.ok)return reply(502,'Email could not be sent. Please use WhatsApp or try later.');", " store.change(db=>{db.appointments.find(a=>a.id===id).emailStatus=response.ok?'sent':'failed';});\n if(!response.ok)return reply(201,saved);");
s=s.replace(" const response=await fetch", " let response;try { response=await fetch");s=s.replace("signal:AbortSignal.timeout(15000)});", "signal:AbortSignal.timeout(15000)}); } catch {store.change(db=>{db.appointments.find(a=>a.id===id).emailStatus='failed';});return reply(201,saved);}");fs.writeFileSync('appointment-api.js',s);
let server=fs.readFileSync('server.js','utf8');server=server.replace('  let pathname;',`  const apiUrl=req.url.split('?')[0];
  if(apiUrl.startsWith('/api/admin/')||apiUrl==='/api/content'){require('./admin-api').handle(req,res,apiUrl);return;}
  let pathname;`);
server=server.replace("  if (pathname.split", "  if (pathname.startsWith('/private-data/') || pathname.startsWith('/content/') || /\\/(store|admin-api)\\.js$/.test(pathname)) {res.writeHead(403).end();return;}\n  if (pathname.split");fs.writeFileSync('server.js',server);
let b=fs.readFileSync('booking.js','utf8');b=b.replace("'Email could not be sent. Please use WhatsApp below.'","'Request could not be saved. Please use WhatsApp below.'");fs.writeFileSync('booking.js',b);
let h=fs.readFileSync('index.html','utf8').replace('</body>','<script src="/site-content.js"></script></body>').replace('Submit your details to request an appointment by email.','Submit your details to request an appointment.');fs.writeFileSync('index.html',h);
