# Rushlight dev notes

The Developer's running notes for the vertical slice build (started Nov 22, 2026): every choice made in Keegan's place,
every tuning check and its numbers, and anything in a bible or spec that was wrong or unclear. Newest spec at the bottom.
Keegan's standing approvals for this run: no questions; pick what the bible and spec most support, keep going, and write it here.

## Spec 002: shared engine catch-up

- **Open question (can the shared frame hold the mockup?):** it can. The log line, the countdown, the nameplates and the
  blank face are all drawn by Rushlight on top of the frame, so Black Lantern's screen is untouched.
- **Battle sprites from the Asset Library** are SVG drawing code (pixel rects and paths). The build copies them unchanged
  into `src/art/creatures.js` (`tools/import-art.js`) and turns each into a canvas once at load. That keeps "all art drawn
  in code" and means a library change is one re-run, not a hand redraw. It adds about 600 KB to the one-file build.
- **The species sheet's code** (`mockups/29-species-sheet-rough-v3.html`) is lifted unchanged into `src/species-art.js`
  for portraits, map sprites and back views, so the mercs look exactly like the approved sheet.
- **The Text Library** is copied into `src/content/text-library.js` (631 rows, all Approved, revision 18) so the game reads
  lines by ID offline. If a line changes on the Sheet, the file needs copying again.
- **Not in scope, noted:** the shell around the screen is still Black Lantern's purple. Its colours live in Rushlight's
  `index.html`; repainting it in the earth palette (leather body, Rust A, Blood B, per the approved battle mockup) wasn't
  in spec 002, so it's left for the slice (done in Part A, see below).
