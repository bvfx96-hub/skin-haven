const fs=require('fs');let s=fs.readFileSync('admin-api.js','utf8').replace('async function body(req){','async function body(req,max=32000){').replace('Buffer.byteLength(s)>32000','Buffer.byteLength(s)>max');s=s.replace(" const d=await body(req);\n if(url==='/api/admin/appointment')",` if(url==='/api/admin/upload'){
 const d=await body(req,7500000);
 if(typeof d.data!=='string'||! /^[A-Za-z0-9+/]*={0,2}$/.test(d.data))return send(res,400,{message:'Invalid image'});
 const bytes=Buffer.from(d.data,'base64');
 if(bytes.length>5*1024*1024)return send(res,413,{message:'Maximum image size is 5 MB'});
 if(bytes.length<24||bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||bytes.toString('ascii',12,16)!=='IHDR'||bytes.readUInt32BE(16)>4000||bytes.readUInt32BE(20)>4000)return send(res,400,{message:'Please upload a valid image'});
 const fs=require('node:fs'),path=require('node:path');const folder=path.join(__dirname,'assets','uploads');fs.mkdirSync(folder,{recursive:true});const filename=crypto.randomUUID()+'.png';fs.writeFileSync(path.join(folder,filename),bytes,{flag:'wx'});
 return send(res,201,{url:'/assets/uploads/'+filename});
 }
 const d=await body(req);
 if(url==='/api/admin/appointment')`);fs.writeFileSync('admin-api.js',s);
let h=fs.readFileSync('admin.html','utf8').replace('<label>Image URL or asset path','<label>Upload photo<input id="tip-upload" type="file" accept="image/jpeg,image/png,image/webp"></label><p class="upload-help">JPG, PNG or WebP · maximum 5 MB. Upload fills the image field; click Save Health Tip to publish.</p><p id="upload-status" role="status"></p><img id="upload-preview" hidden alt="Uploaded photo preview"><label>Image URL or asset path');fs.writeFileSync('admin.html',h);
