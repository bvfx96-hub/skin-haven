const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.mp4': 'video/mp4' };
http.createServer((req, res) => {
  if(req.url.split("?")[0] === "/api/appointments") { require("./appointment-api").handle(req,res); return; }
  const apiUrl=req.url.split('?')[0];
  if(apiUrl.startsWith('/api/admin/')||apiUrl==='/api/content'){require('./admin-api').handle(req,res,apiUrl);return;}
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  if (pathname.startsWith('/private-data/') || pathname.startsWith('/content/') || /\/(store|admin-api)\.js$/.test(pathname)) {res.writeHead(403).end();return;}
  if (pathname.split('/').some(p=>p.startsWith('.')) || /(?:appointment-api|server|add-|update-|build-|apply-|check-)/.test(pathname) || !/\.(html|css|js|jpg|png|webp|mp4)$/.test(pathname) && pathname !== '/' && !pathname.endsWith('-durg-bhilai') && !pathname.endsWith('/')) { res.writeHead(403).end(); return; }
  let file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) { res.writeHead(404).end('Not found'); return; }
    const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]); const end = range[2] ? Math.min(Number(range[2]), stat.size - 1) : stat.size - 1;
      if (start > end || start >= stat.size) { res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }).end(); return; }
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Content-Length': end - start + 1 });
      fs.createReadStream(file, { start, end }).pipe(res);
    } else { res.writeHead(200, { ...headers, 'Content-Length': stat.size }); fs.createReadStream(file).pipe(res); }
  });
}).listen(Number(process.env.PORT)||3000, '127.0.0.1', () => console.log('Skin Haven preview: http://localhost:3000'));
