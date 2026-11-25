// Studio contact sheet runner (studio-bible/art-style.md, Animation: "Contact sheet every build").
// Opens a game's built page in the pre-installed browser, runs the game's own drawing function there, and saves what it
// draws as a PNG. The game decides what goes on the sheet; this file only runs it and writes the picture.
//
//   const sheet = require('../../../engine/tools/contact-sheet.js');
//   await sheet({ page: 'dist/index.html', draw: (opts) => canvas, opts, out: 'dist/contact-sheet.png', wait: () => promise });
//     draw   a function that runs in the page and returns a canvas (it may be async)
//     wait   optional, runs in the page first (e.g. until the game's art has loaded)
// Resolves to {width, height, errors}. Errors thrown in the page are listed, and the sheet is still written if it drew.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
module.exports = async function contactSheet({ page, draw, opts, out, wait }) {
  const browser = await chromium.launch();
  try {
    const p = await browser.newPage({ viewport: { width: 800, height: 600 } }), errors = [];
    p.on('pageerror', e => errors.push(e.message));
    await p.goto('file://' + path.resolve(page));
    if (wait) await p.evaluate(wait);
    const res = await p.evaluate(async ([src, o]) => {
      const fn = (0, eval)('(' + src + ')'), c = await fn(o);
      return { url: c.toDataURL('image/png'), width: c.width, height: c.height };
    }, [draw.toString(), opts || {}]);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, Buffer.from(res.url.split(',')[1], 'base64'));
    return { width: res.width, height: res.height, errors };
  } finally { await browser.close(); }
};
