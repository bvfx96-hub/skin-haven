const fs=require('fs');
const files=['index.html','about-us.html','contact.html',...fs.readdirSync('.',{withFileTypes:true}).filter(e=>e.isDirectory()&&e.name.endsWith('-durg-bhilai')).map(e=>e.name+'/index.html')];
for(const file of files){let html=fs.readFileSync(file,'utf8');html=html.replace('</body>','<script src="/language-switch.js"></script></body>');fs.writeFileSync(file,html);}
