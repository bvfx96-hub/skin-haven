const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const dataDirectory = path.join(__dirname, 'private-data');
const dataFile = path.join(dataDirectory, 'store.json');
const defaults = {
  banner: { enabled: false, text: '', button: '', link: '', image: '' },
  tips: [],
  appointments: [],
};

function cloneDefaults() {
  return JSON.parse(JSON.stringify(defaults));
}

function normalize(value) {
  return {
    banner: { ...defaults.banner, ...(value?.banner || {}) },
    tips: Array.isArray(value?.tips) ? value.tips : [],
    appointments: Array.isArray(value?.appointments) ? value.appointments : [],
  };
}

function read() {
  try {
    return normalize(JSON.parse(fs.readFileSync(dataFile, 'utf8')));
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('[v0] Unable to read store:', error.message);
    return cloneDefaults();
  }
}

function change(mutator) {
  const data = read();
  mutator(data);
  fs.mkdirSync(dataDirectory, { recursive: true });
  const temporaryFile = `${dataFile}.${process.pid}.${crypto.randomUUID()}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(data, null, 2), { mode: 0o600 });
  fs.renameSync(temporaryFile, dataFile);
  return data;
}

function verify(password) {
  const expected = process.env.ADMIN_PASSWORD;
  if (typeof expected !== 'string' || typeof password !== 'string') return false;
  const supplied = Buffer.from(password);
  const configured = Buffer.from(expected);
  return supplied.length === configured.length && crypto.timingSafeEqual(supplied, configured);
}

module.exports = { read, change, verify };
