const {spawn}=require('node:child_process'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'skin-haven-test-'));const child=spawn(process.execPath,['server.js'],{env:{...process.env,PORT:'3012',DATA_DIR:dir,RESEND_API_KEY:'',APPOINTMENT_FROM:''},stdio:['ignore','pipe','pipe']});try{await new Promise((resolve,reject)=>{child.stdout.once('data',resolve);child.once('error',reject);});let cookie='';async function call(url,data){const r=await fetch('http://localhost:3012'+url,{method:data?'POST':'GET',headers:{'Content-Type':'application/json',Cookie:cookie},body:data?JSON.stringify(data):undefined});return {r,data:await r.json()};}
assert.equal((await call('/api/admin/data')).r.status,401);
await call('/api/content');const password=fs.readFileSync(path.join(dir,'admin-login.txt'),'utf8').match(/Password: (.*)/)[1];let login=await call('/api/admin/login',{password});assert.equal(login.r.status,200);cookie=login.r.headers.get('set-cookie').split(';')[0];
let day=new Date(Date.now()+3*86400000);while(day.getUTCDay()===0)day=new Date(+day+86400000);const date=day.toISOString().slice(0,10);
const appointment=await call('/api/appointments',{name:'QA Visitor',phone:'9999999999',date,time:'15:00'});assert.equal(appointment.r.status,201);
let d=(await call('/api/admin/data')).data;assert.equal(d.appointments.length,1);await call('/api/admin/appointment',{id:d.appointments[0].id,status:'confirmed',notes:'QA note'});assert.equal((await call('/api/admin/data')).data.appointments[0].status,'confirmed');
await call('/api/admin/banner',{enabled:true,text:'Test offer',button:'Book',link:'/index.html#book-visit'});assert.equal((await call('/api/content')).data.banner.text,'Test offer');
await call('/api/admin/tip',{title:'Test tip',description:'Test',image:'/assets/skin-haven-logo.jpg',url:'/contact.html',published:true});assert.ok((await call('/api/content')).data.tips.find(t=>t.title==='Test tip'));
assert.equal((await call('/api/admin/tip',{title:'Unsafe',description:'Test',image:'javascript:alert(1)',url:'/contact.html',published:true})).r.status,400);
assert.equal((await fetch('http://localhost:3012/private-data/admin-login.txt')).status,403);
assert.equal((await fetch('http://localhost:3012/store.js')).status,403);
await call('/api/admin/logout',{});assert.equal((await call('/api/admin/data')).r.status,401);console.log('PASS: login, private routes, booking persistence, status, banner, tips, URL validation, logout');
}finally{child.kill();}})().catch(e=>{console.error(e);process.exitCode=1;});
