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
  in spec 002, so it's left for the slice (done in Part A).

## Spec 003: Part A, a new run

- **No To do line for Part A's build.** The bible's To do has Parts A–E only as spec-writing items (already ticked under
  Ready 4 of 5) and one build item, "Vertical slice". So no line is ticked for Parts A–D; "Vertical slice" is ticked when
  Part E finishes the slice. If the Designer wants a build line per part, that's a bible edit for them.
- **Open question (can 90 given names cover a company?):** yes. A company uses 6 names (3 mercs, 3 kin); a reroll puts
  its discarded names back in the pool, so unlimited rerolls never run out. Nothing added in code.
- **Pell and Hester kept out of the merc name pool.** They're in NM-GIVEN, but they're the slice's own cast (the bounty
  target and the eel-stall woman). A merc called Pell hunting Pell would read as a bug. The other 88 names are used.
- **The ledger's companies list is made in Part A,** not Part E, because Part A already writes an entry for an abandoned
  run. Part E's upgrade step only has to fill it, not create it.
- **The kit item's uses:** an item listed "×2" in Starting kit is kept as one slot with a count of 2 (Caltrops ×2 is one
  slot holding 2), since the bible counts the kit item as one slot.
- **Rolling stats in the creator** also draws from the muster stream, so a typed seed rematches the creator's rolls too.
- **New art not yet filed in the Asset Library** (for the Designer to file): the face parts (3 coat shades per species,
  scar, torn ear, grey muzzle, kerchief, hood) and the six coin tokens, all drawn in `src/species-art.js` on the species
  sheet's grid. Filing them means republishing the 5.5 MB library page, which I didn't risk doing unasked.

## Spec 004: Part B, the Withy March

- **Tuning check: felled tree (3 road bandits), MISSED on one seed.** 20 fights per seed, the seed's own Free Company,
  fresh each fight, auto-played (everyone uses Fight on the first target), spec 002's combat (no armor, quirks or
  breaking yet). Pass: no merc goes down in more than 2 of 20 fights.
  - 0001-A: 0 fights with a merc Downed · 6.1 HP lost · 3.6 rounds. Ambushed: 0 · 9.0 HP.
  - 4242-C: **5 fights with a merc Downed** · 9.0 HP lost · 4.0 rounds. Ambushed: 7 Downed, 1 loss · 10.9 HP.
  - 9021-M: 0 fights with a merc Downed · 5.8 HP lost · 3.5 rounds. Ambushed: 1 · 9.3 HP.
  The spec expected 10–14 HP lost with no merc down; the real loss is lower on average (6–9), but on 4242-C one merc with
  low HP keeps going down. Not retuned. Part D's armor (the jack and kettle hat) should soften this; it's re-run there.
- **Tuning check: night attacks, PASSED on HP, rooks' rations MISSED.**
  - 2 road bandits: 4.8 / 3.9 / 4.0 HP lost (pass: under 8). Downed in 0 / 1 / 0 fights of 20.
  - Rooks: 5.8 / 7.1 / 5.4 HP lost (pass). They take 2.7 / 3.5 / 2.8 rations a fight while it lasts, but with no
    breaking until Part D every rook dies and drops what it took, so the net loss is 0 (pass wants 1–3). Expected to
    pass once Skittish rooks break and fly off in Part D; re-run there.
- **The regional tic is RT-SET-1, always.** Spec 004 says the seed picks the March's tic from the RT- rows, but the Text
  Library row RT-SET-1 says it's fixed to the Withy March (slice), and the others are "drawn at run start, one set per
  March". The library is the newer, approved source, so the slice keeps RT-SET-1.
- **Map positions** are mine, placed to match the approved chart: the river through Harrowford, Saint Ebbe's east,
  Hollin north, the causeway south, the camp west, Crookback and Lowmoor Pit south-east. Hollin – Crookback crosses the
  main road east of Harrowford; it reads fine on the chart. The open question (can the chart fit 8 points at 2× without
  a tab hiding a town?) didn't come up: the chart scrolls with the cursor and the tabs sit at the chart's edges.
- **Nights at hamlets and wild sites:** the point cards there only have Leave (as the spec says), so the company's
  nights are camps on the road or nights in town until Parts C and D build the places.
- **Horror on sight, quirks and breaking** wait for Part D, as the spec says fights use what spec 002 built. The
  Corpse-candle and Lampwalkers cost no SAN on sight yet.
- **A wipe** in Part B ends the run and returns to the title (rl.run cleared), until Part E's death screen.
- **Who eats** shows as two rows (Eat: the pre-filled names, or Change who eats), so one tap confirms it.
- **New art not yet filed** (add to Part A's list): the parchment chart, point glyphs, claws and the Key, drawn in
  `src/region.js`.
