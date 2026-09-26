const store=require('./store'),crypto=require('node:crypto');
const sessions=new Map(),limits=new Map();
const send=(res,code,data)=>res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(data));
const safeLink=s=>typeof s==='string'&&s.length<1000&&( /^\/(?!\/)/.test(s)||/^https:\/\//.test(s));
async function body(req,max=32000){let s='';for await(const c of req){s+=c;if(Buffer.byteLength(s)>max)throw Error('Request too large');}return JSON.parse(s);}
async function handle(req,res,url){try{
 if(url==='/api/content'&&req.method==='GET'){const d=store.read();return send(res,200,{banner:d.banner,tips:d.tips.filter(t=>t.published)});}
 if(req.method!=='GET' && (req.headers.origin && req.headers.origin!==`${req.socket.encrypted?'https':'http'}://${req.headers.host}`))return send(res,403,{message:'Origin rejected'});
 if(req.method!=='GET'&&!req.headers['content-type']?.startsWith('application/json'))return send(res,415,{message:'JSON required'});
 if(url==='/api/admin/login'&&req.method==='POST'){
 const ip=req.socket.remoteAddress,now=Date.now();for(const [k,v]of limits)if(now-v.time>900000)limits.delete(k);
 const l=limits.get(ip)||{time:now,count:0};limits.set(ip,l);if(++l.count>10)return send(res,429,{message:'Too many attempts. Try in 15 minutes.'});
 const d=await body(req);if(typeof d.password!=='string'||d.password.length>200||!store.verify(d.password))return send(res,401,{message:'Incorrect password'});
 const token=crypto.randomBytes(32).toString('hex');sessions.set(token,now+8*3600000);res.setHeader('Set-Cookie',`admin_session=${token}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=28800${req.socket.encrypted?'; Secure':''}`);return send(res,200,{ok:true});}
 const token=req.headers.cookie?.match(/(?:^|;\s*)admin_session=([^;]+)/)?.[1];
 for(const [k,v]of sessions)if(v<Date.now())sessions.delete(k);
 if(!token||!sessions.has(token))return send(res,401,{message:'Please sign in'});
 if(url==='/api/admin/logout'&&req.method==='POST'){sessions.delete(token);res.setHeader('Set-Cookie','admin_session=; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=0');return send(res,200,{ok:true});}
 if(url==='/api/admin/data'&&req.method==='GET')return send(res,200,{...store.read(),emailConfigured:Boolean(process.env.RESEND_API_KEY&&process.env.APPOINTMENT_FROM)});
 if(req.method!=='POST')return send(res,405,{message:'Method not allowed'});
 if(url==='/api/admin/upload'){
 const d=await body(req,7500000);
 if(typeof d.data!=='string'||! /^[A-Za-z0-9+/]*={0,2}$/.test(d.data))return send(res,400,{message:'Invalid image'});
 const bytes=Buffer.from(d.data,'base64');
 if(bytes.length>5*1024*1024)return send(res,413,{message:'Maximum image size is 5 MB'});
 if(bytes.length<24||bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||bytes.toString('ascii',12,16)!=='IHDR'||bytes.readUInt32BE(16)>4000||bytes.readUInt32BE(20)>4000)return send(res,400,{message:'Please upload a valid image'});
 const fs=require('node:fs'),path=require('node:path');const folder=path.join(__dirname,'assets','uploads');fs.mkdirSync(folder,{recursive:true});const filename=crypto.randomUUID()+'.png';fs.writeFileSync(path.join(folder,filename),bytes,{flag:'wx'});
 return send(res,201,{url:'/assets/uploads/'+filename});
 }
 const d=await body(req);
 if(url==='/api/admin/appointment'){
 if(!['pending','confirmed','cancelled','completed'].includes(d.status))throw Error('Invalid status');
 let found=false;store.change(db=>{const a=db.appointments.find(a=>a.id===d.id);if(a){a.status=d.status;a.notes=String(d.notes||'').slice(0,2000);a.updatedAt=new Date().toISOString();found=true;}});if(!found)return send(res,404,{message:'Appointment not found'});
 }else if(url==='/api/admin/banner'){
 if(typeof d.text!=='string'||d.text.length>180||typeof d.button!=='string'||d.button.length>35||d.link&&!safeLink(d.link))throw Error('Check banner text and link');
 if(d.image&&!safeLink(d.image))throw Error('Invalid image URL');
 store.change(db=>db.banner={enabled:!!d.enabled,text:d.text,button:d.button,link:d.link||'',image:d.image||''});
 }else if(url==='/api/admin/tip'){
 if(typeof d.title!=='string'||!d.title.trim()||d.title.length>140||typeof d.description!=='string'||d.description.length>1200||!safeLink(d.url)||!safeLink(d.image))throw Error('Check title, description and image/article URLs');
 store.change(db=>{const tip={id:d.id||crypto.randomUUID(),title:d.title,description:d.description,image:d.image,url:d.url,published:!!d.published};const i=db.tips.findIndex(t=>t.id===tip.id);if(i<0)db.tips.push(tip);else db.tips[i]=tip;});
 }else return send(res,404,{message:'Not found'});
 return send(res,200,{ok:true});
 }catch(e){return send(res,400,{message:'Unable to save. Check the fields and try again.'});}}
module.exports={handle};
