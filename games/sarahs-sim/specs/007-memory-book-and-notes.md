# Spec 007: Memory book and notes

Status: draft, for Keegan's review · Written 2026-11-25 by the Game Designer · Game: Sarah's Sim · To do: Specs (Memory book and notes)

## In plain words

The memory book is a scrapbook that fills up as she plays. Each moment gets a page: a little drawing of the scene as it really looked, with her own furniture and outfits, a short caption and the real date in handwriting. The chapters are the cats, the garden, the kitchen, holidays, home, friends and the two of you. Filling a chapter unlocks its special set a piece at a time.

Keegan's notes are hidden around the home: in a drawer, under a pillow, inside a gift. One waits under the tree on Christmas morning. Others turn up on her birthday, on holidays and on your anniversary, and about ten more are tucked around the home during her first month. When she finds one, it opens like a folded piece of paper in his handwriting, and it goes into the book.

## Bible sections this spec relies on

The bible wins over this spec (`studio-bible/studio.md`, Specs).

| Source | Section | What it sets |
| --- | --- | --- |
| `games/sarahs-sim/bible.md` | Play → Memory book | Seven chapters, about 10 moments each, rewards at 3, 6 and 10, handwritten real dates, drawn snapshots, camera photos as extras, one book across modes, a moment happens once, the moment and reward table |
| `games/sarahs-sim/bible.md` | Play → Reasons to come back | Keegan's notes: hidden in the home, one under the tree, more on holidays, each goes in the book |
| `games/sarahs-sim/bible.md` | To do → Keegan's notes | About 20 notes and their when and where, in the Notes for Sarah sheet |
| `games/sarahs-sim/bible.md` | Homes and people → Birthdays; Anniversary | Her birthday note and his party; the anniversary note on her pillow |
| `games/sarahs-sim/bible.md` | Play → Keeping designs | The camera and favorites |
| `games/sarahs-sim/bible.md` | Modes; Play → Life mode | Rewards unlock only in Life mode; Sandbox has everything |
| `games/sarahs-sim/specs/005-garden-and-yard.md`, `006-life-mode.md` | Part C; parts D and E | The garden, kitchen and cat moments those specs trigger |
| `studio-bible/art-style.md` | Fonts and sound; Craft | VT323 and Press Start 2P only; drawn in code |
| `studio-bible/ui.md` | Screen craft | Readable text, no cut-off names |
| `studio-bible/play.md` | No accidental point of no return | Nothing in the book can be lost by accident |
| `studio-bible/saves.md` | All | Save versions, export and import |

## Screens this spec covers

| Screen | Mockup |
| --- | --- |
| Memory book | **To draw** before part B |
| Note found | **To draw** before part C, drawn with the Memory book mockup |

## Part A: Moments

- **The list:** the bible's moment table, about 72 moments in seven chapters. Each moment is one data row: its id, chapter, caption, what triggers it, and which spec sets the trigger.
- **Triggers:** each spec that owns a system sets its moments' triggers. For example, garden moments come from spec 005 part C, and kitchen and cat moments from spec 006. This spec sets the rest:

| Chapter | Moments set here | Trigger |
| --- | --- | --- |
| Home | First room finished | The first room in which every wall has art or a shelf and the floor has a rug and seating (*Claude default*) |
| Home | First piece bought with coins; first favorite saved; first photo taken; first outfit designed; the ORANGE ROCKS tee worn | The action, the first time |
| Home | 10 rooms finished; every room in the Philly home redone | Counted with the same "finished" test; "redone" means at least 3 pieces in the room were changed |
| Home | First wall built on an empty lot; a whole new home finished | Spec 004 (Building) |
| The two of us | First note found; the note under the tree; every note found | Part C |
| The two of us | Cuddled up on the couch; a kiss; a cozy night in; winding down together; Sarah video-calls her mom; Keegan's game night; a slow morning in bed; our anniversary | The matching action or idle moment in spec 006, the first time; the anniversary on Jul 10 |
| Friends | All | Spec 008, except the first person made in the creator (spec 003) |
| Holidays | All | Spec 009 |

- **One book for all modes** (bible, *Claude default*): moments count in Sandbox and Life alike. Only the reward pieces wait for Life mode, since Sandbox already has every piece.
- **Once only:** each moment fires once and keeps the first date. It can never be lost or undone.
- **The pop:** when a moment happens, a small card slides in at the top for about 3 seconds, showing a book icon, the chapter and the caption. Tapping it opens that page. It never stops play.
- **The snapshot:** at the moment it fires, the game saves a picture recipe, not a picture. The recipe is the area around the moment (about 8 × 6 tiles), with each piece, its colors, the people and cats in it and their pose, and the time-of-day light. The page redraws it from that recipe at small size, so it looks exactly as it did, stays crisp and keeps the save small (*Claude default*).

**Done when:**

- Each moment fires once, on its trigger, with the real date and a snapshot.
- Each snapshot redraws the scene as it was, even after the room has changed.
- The pop card shows and never blocks play.

## Part B: The book screen

The book opens from the Start menu, or by tapping a bookshelf and choosing Memory book. It's drawn as a cloth-bound scrapbook with cream pages and seven colored tabs down the side, one per chapter, plus tabs for Notes and Photos.

- **A chapter spread:** two moments per page. Each moment is a snapshot taped on with a soft shadow, the caption under it, and the date in handwriting. A moment not reached yet shows a faint dotted frame with its caption, so she can see what's left. *Claude default:* the caption of a moment not reached yet shows as "???", except in the Home and Garden chapters, where knowing helps her aim for it.
- **The reward ribbon:** a strip at the top of each chapter's first page shows the three reward steps (3, 6 and 10) with their pieces drawn small. Reached steps are ticked and say "In your catalog". In Sandbox, the strip says the pieces are already in her catalog.
- **Notes tab:** every note she's found, in the order she found them. Each is a small folded paper with its date, and it opens full size when tapped (as the Note found screen).
- **Photos tab:** her camera photos (bible, Keeping designs). She can add any photo to a chapter's pages as an extra, which doesn't count toward finishing the chapter, or take it off again.
- **Moving through it:** swipe, tap the page-corner arrows or press the D-pad left and right to turn pages, tap a tab to jump, and B to close. No L or R buttons are needed (see the bible, Controls and screen).
- **Handwriting:** dates and captions use VT323 in a soft brown ink, with each letter tipped a little at random, so it reads as handwriting while staying inside the studio's two fonts (`studio-bible/art-style.md`, Fonts and sound).

**Done when:**

- All seven chapters, the Notes tab and the Photos tab open.
- Pages turn by swipe, by the corner arrows and by the D-pad.
- Moments not reached show as dotted frames.
- The reward ribbon shows the right steps in Life and in Sandbox.
- Everything fits at 375 × 667 and 320 × 480 with no text cut off.

## Part C: Keegan's notes

**What's in a note:** each note is a row in the private data (see Privacy below). The row holds the note's text, when it can be found, and where it's hidden. Keegan writes them in the Notes for Sarah sheet (bible To do).

**When notes appear:**

| Kind | When | Example |
| --- | --- | --- |
| Dated | On its date, from the first time she opens the game that day. It stays until she finds it, even after the day passes | Under the tree on Christmas; on her pillow on Jul 10; on her birthday, Aug 31 |
| First month | One hidden note becomes findable every 3 real days, counted from her first day of play, until the first-month notes run out (*Claude default*) | In a drawer, under a pillow, behind a frame |

**Where:**

- Each note is tied to a kind of piece: a dresser drawer, a pillow, a gift, a book, a cookie jar, the fridge, a coat pocket and so on.
- If that piece isn't in the home (she moved or sold it), the note picks the nearest piece of a similar kind, then any drawer or shelf. So a note is never lost (*Claude default*).

**Finding one:**

- A findable note glows very softly on its piece. On her first ever note, the glow is easier to see.
- Tapping the piece shows **Look**. Sarah opens it, and the Note found screen unfolds the paper: Keegan's note in the handwriting style, signed, with the date.
- Closing it files the note in the book, and the right moment fires: First note found, The note under the tree, or Every note found once all of them are found.
- Notes come in Life and Sandbox alike, since they're Keegan's gift and not a reward. Each one can only be found once, wherever she finds it first (*Claude default*).

**Christmas:**

- The game is a Christmas gift, so if she first opens it on Dec 25, the note under the tree is waiting right away.
- If she first opens it later, the Christmas note still waits under the tree, the first time she opens the game.

**Done when:**

- Setting the phone date to each dated note's day makes that note glow.
- First-month notes appear one every 3 days.
- A note whose piece is gone moves to a nearby piece.
- Each note opens on the Note found screen, files into the book and fires its moment.

## Part D: Rewards

- Each chapter's three steps come from the bible's table (reward pieces are a *Claude draft*). At 3, 6 and 10 moments, the step's pieces join the Life catalog as special sets with a ribbon, and they're free.
- A small card says "New in your catalog: …", with a button to place the piece now.
- Only Life mode unlocks them. Moments that fired in Sandbox still count toward Life's steps, since it's one book.

**Done when:** each step unlocks its pieces in Life the moment the count is reached, and the pieces stay hers.

## Privacy

Note texts are Keegan's private words to Sarah, so they never go in this public repo. The same goes for the idle-life lists, the romance details and the real people's names.

- They live in the project files (Notes for Sarah sheet and `gift-life-sim/`).
- The build copies them into the finished game only. The repo holds a placeholder data file with the same shape and dummy text, so the game builds and tests without them.
- Set by Keegan, Nov 25 (bible, Overview, Private data): the private files stay in project files, and only the build copies them in. The Developer keeps the real data file out of git (ignored) and checks that a build with only the placeholder still passes `npm run check`.

## Saves

- The book is saved once and shared by all modes. It holds:
  - each moment's id, date and snapshot recipe
  - photos added to chapters
  - each note's state (locked, findable or found), its found date and the piece it's on
  - the first-play date that the first-month notes count from
- Camera photos are saved small. *Claude default:* she can keep up to 60 photos, and the game asks before the oldest is replaced. The save may need to keep pictures outside local storage if it gets too full; the Developer checks this.
- Everything goes under the planned `ss.` prefix, with a save version, and comes along with export and import (`studio-bible/saves.md`).

## Build order

1. Part A (moments and the pop card). This is rules and content.
2. Draw and approve the **Memory book** and **Note found** mockups.
3. Part B (the book screen). Keegan plays it on the phone (`studio-bible/studio.md`, Playtests).
4. Parts C and D.

## Claude defaults to confirm

- What counts as a "finished" room, and "redone" means at least 3 pieces changed.
- Moments not reached show "???", except in Home and Garden.
- The snapshot is saved as a recipe and redrawn when the page opens.
- One first-month note every 3 days.
- A note moves to a similar piece if its spot is gone.
- Notes come in both modes, and each can be found only once.
- Up to 60 photos.
- Handwriting is VT323 with each letter tilted a little.
