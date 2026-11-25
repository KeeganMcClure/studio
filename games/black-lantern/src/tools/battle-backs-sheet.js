// The battle backs' contact sheet (spec 023, Part 7; studio-bible/art-style.md, Animation: "Contact sheet every build").
// Runs in the built page through engine/tools/contact-sheet.js and returns one canvas: every profession on both builds,
// every hair style on both builds, the lead with the lantern (both builds) and Downed (an agent, and a Downed lead,
// who drops the lantern). Shown at 3x on the battle's dark blue, each with its label. It also measures each drawing, so
// check.js can fail the build when one is blank, the wrong size, or a slim build isn't 8 px narrower at the waist.
module.exports = function draw() {
  const Z = 3, PAD = 6, LAB = 12, { W, H } = BLB, cw = W * Z + PAD, ch = H * Z + LAB + PAD;
  const ag = (prof, look, name) => ({ prof, name: name || 'Sheet Agent', look: Object.assign({ skin: 1, hair: 0, hairC: 1, eyes: 0, acc: 0, outfitC: -1, build: 'broad' }, look) });
  const HN = ['Short', 'Long', 'Buzz', 'Bald', 'Bun', 'Mohawk', 'Curly'];
  const rows = [
    ['Professions · broad', BL.PROFS.map((p, i) => [p.id, ag(p.id, { skin: i % 6, hair: i % 7, hairC: (i * 3) % 7 }, 'Agent ' + p.name), {}])],
    ['Professions · slim', BL.PROFS.map((p, i) => [p.id + ' slim', ag(p.id, { skin: i % 6, hair: i % 7, hairC: (i * 3) % 7, build: 'slim' }, 'Agent ' + p.name), {}])],
    ['Hair · broad and slim', HN.flatMap((n, h) => [[n, ag('investigator', { skin: [1, 0, 2, 3, 5, 4, 2][h], hair: h, hairC: [1, 3, 4, 5, 6, 0, 1][h] }), {}],
      [n + ' slim', ag('medic', { skin: [1, 0, 2, 3, 5, 4, 2][h], hair: h, hairC: [1, 3, 4, 5, 6, 0, 1][h], build: 'slim' }), {}]])],
    ['The lead and Downed', [['lead', ag('shooter', { skin: 2, hair: 4, hairC: 0 }), { lantern: true }], ['lead slim', ag('medic', { skin: 0, hair: 1, hairC: 4, build: 'slim' }), { lantern: true }],
      ['lead · ranger', ag('ranger', { skin: 4, hair: 6, hairC: 0 }), { lantern: true }], ['downed', ag('investigator', { skin: 4, hair: 2, hairC: 5 }), { downed: true }],
      ['downed slim', ag('clerk', { skin: 3, hair: 1, hairC: 3, build: 'slim' }), { downed: true }], ['downed lead', ag('shooter', { skin: 2, hair: 4, hairC: 0 }), { lantern: true, downed: true }]]]
  ];
  const cols = Math.max(...rows.map(r => r[1].length)), per = 12, lines = rows.reduce((n, r) => n + Math.ceil(r[1].length / per), 0);
  const c = document.createElement('canvas'); c.width = PAD + Math.min(cols, per) * cw; c.height = 22 + lines * ch + rows.length * 16;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.fillStyle = '#14101c'; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = '#d6a43a'; g.font = '12px monospace'; g.textBaseline = 'top';
  g.fillText(`Black Lantern · battle backs · ${BLB.BODY_W} x ${BLB.BODY_H} body, ${W} x ${H} canvas · 3x`, PAD, 5);
  const info = []; let y = 22;
  const opaque = (cv, row) => { const d = cv.getContext('2d').getImageData(0, row, cv.width, 1).data; let a = -1, b = -1; for (let x = 0; x < cv.width; x++) if (d[x * 4 + 3]) { if (a < 0) a = x; b = x; } return a < 0 ? 0 : b - a + 1; };
  rows.forEach(([title, cells]) => {
    g.fillStyle = '#d6a43a'; g.fillText(title, PAD, y); y += 16;
    cells.forEach(([label, a, o], k) => {
      const x = PAD + (k % per) * cw, yy = y + Math.floor(k / per) * ch, cv = BLB.back(a, o);
      g.fillStyle = '#1b1f33'; g.fillRect(x, yy, W * Z, H * Z); g.drawImage(cv, x, yy, W * Z, H * Z);
      g.fillStyle = '#ece8de'; g.fillText(label, x + 2, yy + H * Z + 1);
      const px = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; let n = 0; for (let i = 3; i < px.length; i += 4) if (px[i]) n++;
      info.push({ label, w: cv.width, h: cv.height, pixels: n, waist: opaque(cv, cv.height - 1), slim: a.look.build === 'slim', lantern: !!o.lantern && !o.downed, downed: !!o.downed, prof: a.prof, hair: a.look.hair });
    });
    y += Math.ceil(cells.length / per) * ch;
  });
  c.info = info;
  return c;
};
