const fs=require('node:fs');
const path=require('node:path');
const files=['index.html','about-us.html','contact.html',...fs.readdirSync('.',{withFileTypes:true}).filter(e=>e.isDirectory()&&e.name.endsWith('-durg-bhilai')).map(e=>e.name+'/index.html')];
const failures=[];
for(const file of files){
 const html=fs.readFileSync(file,'utf8');
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const url=match[1]; if(/^(https?:|tel:|data:)/.test(url))continue;
  const [p,anchor]=url.split('#');
  let target=p?path.resolve(p.startsWith('/')?'.':path.dirname(file),p.startsWith('/')?'.'+p:p):path.resolve(file);
  if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
  if(!fs.existsSync(target))failures.push(`${file}: missing ${url}`);
  else if(anchor&&target.endsWith('.html')&&!fs.readFileSync(target,'utf8').includes(`id="${anchor}"`))failures.push(`${file}: missing anchor ${url}`);
 }
 const schema=html.match(/<script type="application\/ld\+json" id="clinic-schema">([\s\S]*?)<\/script>/);
 if(!schema)failures.push(`${file}: missing schema`);else JSON.parse(schema[1]);
 if((html.match(/<h1[ >]/g)||[]).length!==1)failures.push(`${file}: incorrect h1 count`);
 if((html.match(/<footer /g)||[]).length!==1)failures.push(`${file}: footer count`);
 const clinicCopy=html.replace(/<section class="results-section"[\s\S]*?<\/section>/,'');
 if(/La Derma|Kolkata|9433122662|contact-pending/.test(clinicCopy))failures.push(`${file}: stale clinic details`);
 if(file==='index.html'&&html.includes('id="visit-clinic"'))failures.push('Home visit block must remain removed');
}
console.log(JSON.stringify({pages:files.length,failures},null,2));
if(failures.length)process.exit(1);
