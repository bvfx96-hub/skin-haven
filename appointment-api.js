const store=require('./store');
const crypto=require('node:crypto');
const recipient = 'samnthasen@gmail.com';
const attempts = new Map();
function validate(data, now = Date.now()) {
  if(!data || typeof data !== 'object') return 'Invalid request.';
  if(typeof data.name !== 'string' || !data.name.trim() || data.name.length>80 || !/^[0-9]{10}$/.test(data.phone)) return 'Enter your name and a 10-digit mobile number.';
  if(!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(data.time)) return 'Choose a valid date and time.';
  const slot=Date.parse(data.date+'T'+data.time+':00+05:30');
  if(!Number.isFinite(slot) || new Date(slot+330*60000).toISOString().slice(0,10)!==data.date || slot<now+86400000) return 'Book at least 24 hours in advance.';
  if(new Date(slot+330*60000).getUTCDay()===0) return 'Sunday is closed.';
  if(data.email && (typeof data.email!=='string'||data.email.length>150||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))) return 'Enter a valid email.';
  if(data.message && (typeof data.message!=='string'||data.message.length>1000)) return 'Message is too long.';
}
async function handle(req,res){
 const reply=(status,message)=>res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify({message}));
 if(req.method!=='POST') return reply(405,'POST required.');

 if(!req.headers['content-type']?.startsWith('application/json')) return reply(415,'JSON required.');
 const ip=req.socket.remoteAddress,now=Date.now();
 for(const [key,value] of attempts)if(now-value.start>600000)attempts.delete(key);
 const limit=attempts.get(ip)||{start:now,count:0};if(++limit.count>5)return reply(429,'Please wait before trying again.');attempts.set(ip,limit);
 try{
 let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>8192)return reply(413,'Request too large.');}
 let data;try{data=JSON.parse(body);}catch{return reply(400,'Invalid request.');}
 const error=validate(data);if(error)return reply(400,error);
 const id=crypto.randomUUID();
 store.change(db=>db.appointments.unshift({id,name:data.name.trim(),phone:data.phone,email:data.email||'',date:data.date,time:data.time,message:data.message||'',status:'pending',notes:'',emailStatus:'not configured',createdAt:new Date().toISOString()}));
 const saved='Request saved. Reference: '+id.slice(0,8)+'. The clinic will confirm your appointment. Please arrive 30 minutes early.';
 if(!process.env.RESEND_API_KEY || !process.env.APPOINTMENT_FROM)return reply(201,saved);
 const text=['New appointment request — not yet confirmed','Doctor: Dr. Sampreeti Sendur','Name: '+data.name,'Phone: '+data.phone,'Email: '+(data.email||'Not provided'),'Preferred date: '+data.date,'Preferred time (IST): '+data.time,'Message: '+(data.message||'None'),'Please confirm the appointment with the patient.','Patient must arrive 30 minutes before the confirmed time.'].join('\n');
 let response;try { response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.APPOINTMENT_FROM,to:[recipient],subject:'Skin Haven — New appointment request',text}),signal:AbortSignal.timeout(15000)}); } catch {store.change(db=>{db.appointments.find(a=>a.id===id).emailStatus='failed';});return reply(201,saved);}
 store.change(db=>{db.appointments.find(a=>a.id===id).emailStatus=response.ok?'sent':'failed';});
 if(!response.ok)return reply(201,saved);
 return reply(200,'Appointment request sent to the clinic. Await confirmation and arrive 30 minutes early.');
 }catch{return reply(502,'Unable to send email. Please use WhatsApp or try later.');}
}
module.exports={handle,validate};
