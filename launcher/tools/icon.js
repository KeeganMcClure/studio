// Draws the home screen icon in code and writes it as PNG (no image tools).
// A tiny handheld on a 32 x 32 grid, scaled up with crisp pixels.
const zlib = require('zlib');

const C = { '.': '#3a2e78', h: '#5242a0', l: '#221a4c', k: '#0a0812', s: '#0d1322', g: '#ffd166', p: '#ff4fa3', c: '#3ff0e8', b: '#1c1733', a: '#c23a5c', w: '#ebe5c8' };
const ART = [
  '................................',
  '................................',
  '...hhhhhhhhhhhhhhhhhhhhhhhhhh...',
  '...hkkkkkkkkkkkkkkkkkkkkkkkkl...',
  '...hkkkkkkkkkkkkkkkkkkkkkkkkl...',
  '...hkksssssssssssssssssssskkl...',
  '...hkksssssssssssssssssssskkl...',
  '...hkksssssssssssssssssssskkl...',
  '...hkksssssskkkkkkkksssssskkl...',
  '...hkksssssskhhhhhhksssssskkl...',
  '...hkksssssskhwwwwhksssssskkl...',
  '...hkksssssskhwppwhksssssskkl...',
  '...hkksssssskhwwwwhksssssskkl...',
  '...hkksssssskhwccwhksssssskkl...',
  '...hkksssssskhhhhhhksssssskkl...',
  '...hkksssssskhgggghksssssskkl...',
  '...hkksssssskkkkkkkksssssskkl...',
  '...hkksssssssssssssssssssskkl...',
  '...hkkkkkkkkkkkkkkkkkkkkkkkkl...',
  '...hkkkkkkkkkkkkkkkkkkkkkkkkl...',
  '...llllllllllllllllllllllllll...',
  '................................',
  '.......bbb..............aa......',
  '.......bbb.............aaaa.....',
  '....bbbbbbbbb..........aaaa.....',
  '....bbbbbbbbb.....aa....aa......',
  '....bbbbbbbbb....aaaa...........',
  '.......bbb.......aaaa...........',
  '.......bbb........aa............',
  '................................',
  '................................',
  '................................'
].map((row) => row.padEnd(32, '.').slice(0, 32));

function hex(c) { return [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)); }

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

// Returns a PNG Buffer of the icon at size x size.
function iconPng(size) {
  const scale = Math.floor(size / 32), off = Math.floor((size - 32 * scale) / 2);
  const bg = hex(C['.']);
  const raw = Buffer.alloc(size * (size * 3 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const gx = Math.floor((x - off) / scale), gy = Math.floor((y - off) / scale);
      const inside = gx >= 0 && gy >= 0 && gx < 32 && gy < 32;
      const rgb = inside ? hex(C[ART[gy][gx]] || C['.']) : bg;
      rgb.forEach((v, i) => { raw[y * (size * 3 + 1) + 1 + x * 3 + i] = v; });
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0; // 8-bit RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))
  ]);
}

module.exports = { iconPng };
