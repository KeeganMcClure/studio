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

## Spec 005: Part C, towns

- **Tuning check: 2 men-at-arms (the reeve's men at Wanted, bounty hunters at Outlawed), MISSED on one seed.**
  20 fights per seed with the seed's Free Company, auto-played; men-at-arms with their 1 armor (crits ignore it).
  Pass: no merc goes down in more than 2 fights, and no fight past 12 rounds.
  - 0001-A: 1 fight with a merc Downed · 12.7 HP lost · 6.5 rounds (longest 11). Pass.
  - 4242-C: **6 fights with a merc Downed** · 12.1 HP lost · 7.3 rounds (**longest 13**). Miss.
  - 9021-M: 0 · 9.3 HP lost · 5.3 rounds (longest 7). Pass.
  HP lost sits in the spec's 12–16 band. Seed 4242-C's Free Company is the weak one again (the same seed missed Part B's
  felled tree). Not retuned; re-run after Part D adds the company's own armor.
- **Harrowford's hire pool sits at the inn** (a "Mercs for hire" row at the Drowned Goose): spec 005 gives Harrowford a
  pool of 3 but lists no hiring corner on its street; Saint Ebbe's has its corner by the well.
- **The Counter's bill** uses CR-COUNT-DESC ("Long, low and all teeth."), since the Text Library has no CR-COUNT-BOARD
  row. The Noonwife is spoken by the prior, so her card shows CR-NOON-DESC as the job's words.
- **Prices the bible doesn't set:** holy water 5; cold iron and silver 15 (Uncommon); the apothecary's drugs 15
  (Uncommon); a tool with no rarity in the Item list (caltrops, manacles, bodkin bolts, repair kit, snare) 5 (Common);
  ale 1 (the tavern's own price in spec 005). Weapons follow Prices' Common 8 / Uncommon 25.
- **Brothel and blessing are priced per merc** (5 and 10), as Recovery's "17 coin a head (inn 2, brothel 5, rite 10)".
- **Outlaws Hated** doubles bandit events by turning a quarter of other road events into the felled tree (the felled
  tree is 25% of the table, so that about doubles it).
- **Lord Hated** sets the lord's men on the company each time it walks into either town, since both are his holdings.
- **The contract card** is a dialog box (the bill's words, WHERE, PAYS, XP, THREAT, MOMENT on separate lines) with Take it
  and Back, over the street; the board itself is a list of its bills. The full painted board of Mockup 6 (bills pinned on
  oak boards) is not drawn yet — a deviation from the approved mockup, kept simpler so the card's information is all
  there; noted for the Designer's review in play.
- **Crime witnesses:** robbing on the two main roads counts as "busy" (−40%); anywhere else as seen (−20%), since the
  victims are right there.
- **New art not yet filed** (add to the list): the two streets' buildings and props in `src/town-art.js`.

## Spec 006 D1: the rules, proved on Pell's camp

- **Tuning check: Pell, PASSED on all 3 seeds.** 20 runs per seed, the seed's Free Company at level 1, the 2 cousins
  then Pell, HP carried between the fights, auto-played carefully (Revive a Downed comrade, Patch up the badly hurt,
  otherwise fight the weakest foe). Pass: at most 1 merc Downed in 3 of 4 runs, and nobody dies.
  - 0001-A: 20/20 runs pass · 0 deaths · 3.9 rounds · 1.4 SAN lost (people budget 0–3).
  - 4242-C: 20/20 · 0 deaths · 3.6 rounds · 1.3 SAN lost.
  - 9021-M: 20/20 · 0 deaths · 4.0 rounds · 1.4 SAN lost.
- **Part B and C tuning re-run with D1's full rules** (the company's armor, wear, breaking; the same careful play):
  - Felled tree: Downed in 1 / 1 / 0 fights of 20 (pass; it missed on 4242-C without armor). Ambushed 1 / 0 / 0.
  - Night attack, 2 bandits: 3.8 / 2.6 / 2.1 HP lost (pass).
  - Rooks: 4.3 / 5.0 / 4.2 HP lost (pass); they take 2.8–3.5 rations during the fight but keep only **0.1–0.6 net**
    (Skittish rooks now break and fly off with what they took, but most die first). **Still misses** the spec's 1–3.
  - 2 men-at-arms: Downed in 1 / 2 / 0 fights, longest fights 9 / 10 / 9 rounds (pass; it missed on 4242-C before).
- **Pell is paid at Harrowford.** A bounty's proof is the body (People jobs), so the job ends at the camp and pays when
  the company walks back into Harrowford (the reeve signs for him). Letting him go pays at once (nothing).
- **The A prompt's Select** works as the mockup says (Select swaps to the best other merc and rolls), and the same
  choice also shows as a SELECT row, so it can be tapped.
- **Who the fight checks against:** a hotspot's "best other merc" is shown when they beat the lead, or when the lead
  lacks the skill.
- **Grapple** is simplified: the pinned enemy rolls each turn to break free as the bible says, but the comrades' +20%
  against it is the only other effect.
- **A Downed merc keeps their place in the turn order** (each of their turns is one of the 3 before they bleed out).
- **Not built yet (noted for later parts):** using items and skills from the map menu (a Skills row; Use, Swap and Drop
  in Items); Fast battles as a Settings row; the King's Hounds and other cast; burial (Part E).
- **New art not yet filed** (add to the list): the site tiles in `src/site-art.js` (the charcoal camp's ground, trees,
  hut, woodpile, fire pit, rack and charcoal clamps, plus tiles the D2 sites use).
