const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const out = path.join(root, 'public');
fs.mkdirSync(out, { recursive: true });
const scripts = ['about.js','admin.js','booking.js','card-scroll.js','conditions.js','language-switch.js','results.js','script.js','site-content.js','video-gallery.js'];
for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (entry.isFile() && (/\.(html|css)$/.test(entry.name) || scripts.includes(entry.name) || ['robots.txt','sitemap.xml'].includes(entry.name))) {
    fs.copyFileSync(path.join(root, entry.name), path.join(out, entry.name));
  }
  if (entry.isDirectory() && (entry.name === 'assets' || entry.name.endsWith('-durg-bhilai'))) {
    fs.cpSync(path.join(root, entry.name), path.join(out, entry.name), { recursive: true });
  }
}
console.log('Vercel public assets prepared. Private data and server source excluded.');
