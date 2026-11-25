# Spec 024: the case board changes with each season

Status: proposed, waiting for Keegan's merge · Written 2026-11-25 by the Game Designer · Game: Black Lantern · To do: Seasonal case board, Season 1 (spec 024) and Seasonal case board, Season 2 (spec 024)

## In plain words

Keegan wants the case board to change every season so it carries the season's feel, and not only through its colors (Keegan, Nov 25, 2026). The board stays the same board, with the same cards, layout and buttons. What changes is what's on it and around it:

- **Keepsakes.** Each closed case leaves one of its own keepsakes on the cork, where its card hung, such as Still Harvest's burlap doll. A **season piece** goes up beside it, such as a paper lantern in Season 1 or a torn playbill page in Season 2. So the board fills up case by case, and by the end of the season it's a record of everything you went through.
- **Motion.** Every season has something small that moves on the board.
- **Big Hat's sticky note** changes as the season goes on.
- **The board acting wrong**, only in seasons that suit it. Season 2 does: a card hangs crooked, a pin has moved, a title garbles for a moment.
- **Colors.** Each season has its own board colors, the same all season. Season 1 keeps today's.

Season 1 gets all of this now (Keegan picked Nov 25), so it gets tried before Season 2. Season 2's set is written down here and built with Season 2. Later seasons get their own set when they're planned.

Mockup (approved Nov 25, 2026, with one change, below): [`024-seasonal-board-mockup.png`](024-seasonal-board-mockup.png), with its page [`024-seasonal-board-mockup.html`](024-seasonal-board-mockup.html), the two frames [`024-seasonal-board-mockup-s1.png`](024-seasonal-board-mockup-s1.png) and [`024-seasonal-board-mockup-s2.png`](024-seasonal-board-mockup-s2.png), and the drawing code [`024-seasonal-board-mockup.js`](024-seasonal-board-mockup.js). It's drawn over the real build's board in the shell at 375 × 667. Season 1 has three cases closed. Season 2 uses placeholder cards.

- **The one change Keegan asked for:** in the mockup's Season 2, the older keepsakes hide behind the cards on a full board. **Season pieces may hang over card edges**, but never over a card's text, so the season's mood shows even when every spot is full. Case keepsakes stay behind the cards and peek out.
- The keepsake drawings are rough v1. The Developer polishes them to the Quality bar (`studio-bible/art-style.md`) and keeps what each one shows and where it sits.

## Keegan's calls (Nov 25, 2026)

| Question | Pick |
| --- | --- |
| How much changes each season | Same board; the season's look starts light and builds as you close cases |
| What builds it up | One keepsake per closed case. Colors stay the same all season |
| What else changes | Motion and Big Hat's note every season; the board acting wrong only when a season suits it (Season 2 does) |
| What a keepsake is | Both: the closed case's own keepsake, plus a season piece beside it |
| Season 1 too? | Yes |
| The look | Approved, with season pieces allowed over card edges |

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | Story → Case board | The cork board, six card spots, the CLOSED pile, the memorial plaque, Big Hat's sticky note, the agency folder in the bottom row's right spot. This PR adds the seasonal look line |
| `games/black-lantern/bible.md` | Story → Agency arc | Seasons each have their own board; agency cases; nothing hints at how many cases a season has or when agency cases come |
| `games/black-lantern/bible.md` | Story → Season 2: The King in Yellow | Tarnished yellow creeps in; the play, the Yellow Sign, tatters; nothing from *Impossible Landscapes* |
| `games/black-lantern/bible.md` | Story → Adding a new case | Case specs and pitches are public-safe; arc touches never appear in them |
| `games/black-lantern/bible.md` | Art → Direction, Palette | Drawn in code; base palette; one case, one set of art (keepsakes are that case's own art) |
| `games/black-lantern/bible.md` | Art → Season 2 look | The yellow creep's colors (tarnished, pallid, bruise), more of it as the season goes on, signs drawn fresh and never copied |
| `games/black-lantern/bible.md` | Art → Light and mood | Text stays readable at low SAN; colors sour below 40 SAN |
| `games/black-lantern/bible.md` | Art → Reference mockups | The approved case board mockup (option A) and the Season 2 look mockup |
| `games/black-lantern/bible.md` | Tech → Saving | `bl.season` and its fields; season length and unlock counts never in the bible |
| `games/black-lantern/specs/004-case-board.md` | All | The board, its cards and the coffee ring |
| `games/black-lantern/specs/009-season-flow.md` | Steps 2 to 5 | Six spots, the pile, the queue, the season end, the next season |
| `studio-bible/art-style.md` | How art is made, Craft, Quality bar, Animation | Drawn in code, lit, alive, the four-tone ramp, the timing table |
| `studio-bible/ui.md` | Menus | Nothing on the board gets in the way of reading or picking a card |
| `studio-bible/saves.md` | (whole file) | Save version, back up first, one upgrade step, test saves |

## What is built today

From the changelog and the code (`case-board.js`, `season.js`):

- The board has six card spots in two rows of three, then a bottom row with the CLOSED pile, the memorial plaque (once someone is lost) and Big Hat's sticky note (`NOBODY TOUCH MY CRULLERS. —BH`), which an open agency folder covers.
- A coffee ring sits on the cork. Nothing on the board moves except the cursor, the stamp and the slides.
- A closed case is stamped, then slides onto the pile. The next case from the queue pins into its spot.
- `bl.season` doesn't save which spot a closed case was in. Save version 13.

## What to build

### 1. Where keepsakes go

- **A case keepsake** pins in the spot where that case's card hung, once its card has slid onto the pile. If a new card from the queue takes the spot, the keepsake stays behind the new card, with an edge or a corner peeking out, as in the mockup's Season 2. If the spot stays empty, as in the mockup's Season 1, it shows in full.
- **Two keepsakes in one spot:** the newer one goes on top, nudged so the older one still peeks out. A spot shows at most its two newest. Older ones are still in the save.
- **A season piece** goes up with each closed case, in the season's list order, in the gaps beside that case's spot: the strip above the top row, the gaps between cards and rows, and the open cork in the bottom row. Season pieces may hang over a card's edge but never over its text (title, file number, town), the pin, the CLOSED stamp, the cursor, the pile's count, the plaque or the sticky note.
- **What stays clear:** the bottom row's three spots (pile, plaque and note or agency folder) never get a keepsake on top. If the memorial plaque appears where a season piece hangs, the piece moves aside.
- **Agency cases** leave a keepsake too, in their bottom-right spot, behind the next folder or the note. The Developer picks it from the case's secret file. It may only show something you saw in that case, never a hint of what comes next, and it isn't named in any public file.
- Placement is fixed by the save, with no randomness, so the board looks the same every time you open it.
- Keepsakes can't be selected and do nothing when tapped. The cursor skips them.

### 2. Motion

- Each season names one or two small moving things (step 7 and 8). They follow the Animation timing table (`studio-bible/art-style.md`): slow loops, a frame every 300 ms or slower, never a flash.
- Motion never moves a card, the cursor or text, and never slows input.

### 3. Big Hat's sticky note

- Each season has a short list of note lines (step 7 and 8). The note shows the first line on a new season's board, then moves to the next line each time a regular case closes, and stays on the last line.
- Lines are 4 short rows at most, ending `—BH`, in today's note style. They're jokes about the office, never hints about the story.
- The open agency folder still covers the note, as today. `MORE ON THE WAY. —BH` (a season with no data file) stays as it is.

### 4. The board acting wrong (only in seasons that say so)

A season that turns this on picks from these, and each happens only when you come back to the board, never while you're moving the cursor:

- **Crooked:** one open card hangs a few degrees off, picked fresh each time the board opens. Its text still reads.
- **Moved pin:** one pin sits a few pixels from where it was.
- **Garble:** once in a while, one card's title flickers to garbled letters for about 300 ms, then back. Never the selected card, and never the description box.

The description box, the header, the hints and the selected card are always exact and readable (Art, Light and mood; pillar 6).

### 5. Colors

- Each season names its board colors: frame, cork, cork dots, card paper, closed paper, file and town ink, the ring, the sticky note and the box trim. They don't change within a season.
- Season 1 keeps today's colors exactly. The pin colors stay each case's own (spec 004).

### 6. The save

Save version 13 → 14 (`studio-bible/saves.md`).

| Field | Holds |
| --- | --- |
| `cases[id].spot` | New. The board spot (0 to 5, or `"agency"`) the case's card was in when it closed |

- **Upgrade step 14:** a case closed before this version gets `spot` from the order it closed in, spread across spots 0 to 5, so an old save's board fills in the same way every time. Never change steps 1 to 13.
- Which keepsakes and season pieces show comes from the closed cases, their `at` order and their `spot`. Nothing else is saved.
- A new season's board starts bare. The last season's keepsakes go with it (`past`). A regular case carried over keeps no keepsake until it closes in the new season.
- **Test saves:** one Season 1 save with three cases closed, one with a closed case under a new card, and one from version 13 with closed cases. `npm run check` opens them all and finds no keepsake over a card's text or the bottom row.

### 7. Season 1's set (build now)

The look: today's colors, warm and autumn, lantern light.

**Case keepsakes**, each from that case's own public hook. Each is drawn with the case's art, filed on that case's Asset Library page.

| Case | Keepsake |
| --- | --- |
| Still Harvest | A small burlap doll with a corn-husk body and a stitched smile |
| Good Manners | A county fair prize ribbon |
| Lot 83 | A torn box flap marked `LOT 83` in marker, with green mold creeping across it |
| Lost Hour | A gas station receipt, the time on it smudged |
| Tracking | The VHS tape with its `WE KNOW` label |
| Dead Air | A station sticker, `KHLT 1340` |

**Season pieces**, in order: a paper lantern, autumn leaves, a polaroid of a dark treeline, a donut-shop napkin, a folded road map scrap, a burned-down candle stub. If a season has more closed cases than pieces, the list starts over with the next piece turned a little.

**Motion:** the leaves stir now and then, and the paper lantern's glow breathes slowly.

**Acting wrong:** off.

**Big Hat's note**, in order:

1. `NOBODY / TOUCH MY / CRULLERS. / —BH` (today's)
2. `I COUNT / THE / CRULLERS. / —BH`
3. `ONE IS / MISSING. / —BH`
4. `SOMEBODY / TOUCHED MY / CRULLERS. / —BH`

Text goes in `strings.js` (season lines) and in each case's file (its keepsake's name, if it ever shows).

### 8. Season 2's set (build with Season 2's art kits, Season 2 readiness 7)

The look: the yellow creep (Story → Season 2; Art → Season 2 look: tarnished `#b0962e`, pallid `#e6da8c`, bruise `#120d14`). The playbill and every other sign are drawn fresh, as that section says. Brass pins, paper gone sallow, pallid trim, a yellow coffee ring.

- **Colors (from the mockup):** frame `#2b2014`, cork `#7d6233`, card paper `#e6da8c`, closed paper `#cdbd7a`, town ink `#7a5a14`, note `#cdbd6a`, box trim `#b0962e`, header text `#e6da8c`.
- **Case keepsakes:** each Season 2 case spec names its own, under the same rules as Season 1's: only something you saw in that case, nothing from the secret story.
- **Season pieces**, in order: a ticket stub (`ADMIT ONE`), a torn playbill page (`THE KING IN YELLOW · ACT I`), a yellow tatter, a second playbill page (`ACT II`), a length of yellow thread, a playbill page with its act number torn off. These come from Chambers' public-domain play only (Story → Season 2, Sources).
- **Motion:** the tatter stirs with no draft, and the light over the board dims and flickers now and then.
- **Acting wrong:** on, with all three from step 4.
- **Big Hat's note**, in order:
  1. `NEW CORK. / NEW YEAR. / —BH`
  2. `WHO PINNED / THAT UP? / —BH`
  3. `WHO KEEPS / PINNING / THESE UP? / —BH`
  4. `I DIDN'T / PIN THAT. / —BH`

### 9. Later seasons

When a season is planned, its plan names its board set in the same shape as steps 7 and 8. Season 3 (Cthulhu and Dagon) is not planned yet. Its rough idea in the earlier rough (damp cork, salt, a tide table) is only a sketch.

### 10. Where the code goes

The keepsake layout (which spot, which gaps, what stays clear) and the motion loop live in `case-board.js`, Black Lantern's own board. Each season's set (colors, piece list, motion, note lines, acting wrong on or off) goes in that season's data file, read the way the board reads its cases today. Case keepsakes are drawn in each case's art file. If any piece is generic, such as "pin things in the gaps between cards," it goes in `engine/` per `CLAUDE.md`.

## Must stay true

- Every card's text, the cursor, the pile, the plaque, the note and the description box stay readable and reachable at 375 × 667, 375 × 550 and 320 × 480.
- Nothing on the board hints at how many cases a season has or when an agency case comes.
- Old saves keep working, with a backup first, then step 14.
- No keepsake, season piece or note line shows anything from a secret story file before you've played it, and none is named in a public file for agency cases.

## Not in this spec

- Season 3's set and any later season's.
- Showing how a case ended (spec 004).
- Sound.

## Done when

- `npm run check` passes in `games/black-lantern/src/` at all three sizes, with every old and new test save opening.
- Playtest: close Still Harvest, then two more Season 1 cases. After each one, a keepsake and a season piece appear where the case's card hung, and Big Hat's note moves on. A new card pinned into the spot leaves the keepsake peeking out. The leaves stir and the lantern breathes. Nothing covers text.
- On an iPhone SE, the board matches the mockup's Season 1 frame, at the Quality bar.
- `changelog.md` has a dated entry, with any deviations.
