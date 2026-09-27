const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const dir=process.env.DATA_DIR||path.join(__dirname,'private-data');fs.mkdirSync(dir,{recursive:true});
const file=path.join(dir,'store.json');
if(!fs.existsSync(file)){
 const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
 const tips=[...html.matchAll(/<article class="health-tip-card">([\s\S]*?)<\/article>/g)].map((m,i)=>({id:String(i+1),title:m[1].match(/<h3><a[^>]*>(.*?)<\/a>/)[1].replace(/&amp;/g,'&'),description:m[1].match(/<\/h3><p>(.*?)<\/p>/)[1],image:'/'+m[1].match(/<img src="([^"]+)"/)[1],url:m[1].match(/href="([^"]+)"/)[1],published:true}));
 fs.writeFileSync(file,JSON.stringify({appointments:[],tips,banner:{enabled:false,text:'',link:'',button:'Learn more'}}));
}
const read=()=>JSON.parse(fs.readFileSync(file,'utf8'));
const change=fn=>{const db=read();const result=fn(db);fs.writeFileSync(file+'.tmp',JSON.stringify(db,null,2));fs.renameSync(file+'.tmp',file);return result;};
const authFile=path.join(dir,'admin.json');
if(!fs.existsSync(authFile)){const password=crypto.randomBytes(15).toString('base64url'),salt=crypto.randomBytes(16).toString('hex');fs.writeFileSync(authFile,JSON.stringify({salt,hash:crypto.scryptSync(password,salt,64).toString('hex')}));fs.writeFileSync(path.join(dir,'admin-login.txt'),'Skin Haven admin\nURL: http://localhost:3000/admin.html\nPassword: '+password+'\nKeep this file private.\n');}
const verify=password=>{const a=JSON.parse(fs.readFileSync(authFile));return crypto.timingSafeEqual(crypto.scryptSync(password,a.salt,64),Buffer.from(a.hash,'hex'));};
module.exports={read,change,verify};
