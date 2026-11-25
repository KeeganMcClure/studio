# Spec 013: Big Hat's briefing, reworked

Status: approved and built (status updated Nov 25, 2026; see the bible's To do and the changelog) · Written 2026-11-22 by the Game Designer · Game: Black Lantern · To do: Big Hat's briefing rework

## In plain words

Keegan played the demo and saw the old intro. Demo 5 part C kept Big Hat's briefing almost word for word, because spec 006 said to keep the donut-shop briefing as the case's frame. Keegan asked for three changes (Nov 22), plus two fixes from the screenshot:

1. **Questions that do something.** The bible says Big Hat's options "must do something, such as unlocking extra intel." Today "Who are you?", "Why us?" and "No questions." are only flavor.
2. **New briefing lines**, drafted below in Big Hat's voice for Keegan to approve.
3. **A new look for the scene.** The Big Hat standing behind the desk is the old small desk sprite (tall plain hat with a gold buckle, white shirt, tie). It no longer matches his approved portrait, which is right.
4. **No corner portrait while he's on screen.** If you can see him talking in front of you, the portrait over the text box is doubled up.

Mockup: `specs/013-briefing-rework-mockup.html` (picture: `013-briefing-rework-mockup.png`), rough v1.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | Cast → Big Hat | Intros are cutscenes with Big Hat large and center; options must do something; his look, colors, shout, lines; the backdrop changes per case; portrait code lives in the Asset Library |
| `games/black-lantern/bible.md` | Voice | One thought per box, joke pacing, Big Hat is never a joke to his face |
| `games/black-lantern/bible.md` | Story → Demo case; Where items come from | The briefing is step 1; requisition happens at the briefing |
| `games/black-lantern/bible.md` | Art → Faces and sprites | Portraits 64 × 64; dark outlines, hard shading |
| `studio-bible/ui.md` | Dialog box | The portrait stands on the box; signs get the tab only; narration no tab. This PR adds the in-scene rule below |
| `games/black-lantern/specs/006-still-harvest-story-and-play.md` | C2, C5 | The case's `TEXT` block; requisition at the briefing |
| `games/black-lantern/specs/007-debrief-and-case-gains.md` | Debrief | The same back-room scene plays the debrief |

## 1 · Big Hat in the scene (every briefing and debrief)

- Big Hat in the back room is drawn from his approved portrait art (the Asset Library's `bighat.js`, already in `engine.js` as `drawBigHatPortrait`), at double size: a 128 × 128 bust, centered, standing behind the desk so the desk covers his lower vest. No plain backdrop square behind him; the room shows around him.
- The old desk sprite (`drawBigHat` in `engine.js`) goes. One drawing, two sizes, so he can never drift apart again.
- While he talks, his mouth flaps on the same two frames the portrait uses. The toothpick switches sides every few seconds and the two pinprick glints show rarely (Cast). Shouts use the shout face in the scene, with today's screen shake and red flash.
- The desk, cruller box, cup, corkboard and flickering tube stay. Move the corkboard if the hat's brim covers it.
- Anywhere `bigHatScene` plays (briefing, debrief, the season's closing lines) gets the new Big Hat. Lines he says away from his scene (an agency case pinning onto the board, a recruit's arrival message) keep the corner portrait, since he isn't on screen there.
- New art: file the in-scene size on the Asset Library's core page with the portrait, as `bl-sprites-bighat-scene-v1`.

## 2 · No corner portrait when the speaker is in the scene

New studio rule, added to `studio-bible/ui.md` → Dialog box in this PR, since every game's cutscenes will hit it:

> When the speaker is drawn large in the scene in front of you (a cutscene, a briefing), the box shows the name tab only, no portrait. The portrait is for speakers you can't see up close: talk on the map, voices off screen, lines over a menu or a board.

For Black Lantern: inside `bigHatScene`, BIG HAT's lines show the tab only. Everyone else's lines keep their portrait as today.

## 3 · Two questions (every case's briefing)

- Big Hat asks "Two questions. Make 'em count." The box lists the case's four topics plus **No questions**.
- You pick one, he answers, and the list comes back with that topic greyed. After the second answer he says "That's two." and moves on. No questions ends it at once with his "Don't make it weird" line.
- Each answer does two things: an **INTEL** note in the Case file (Start → Case file), one line each, below the clue notes and not counted as clues; and **one small edge** in the case, set by the case file.
- In the build, the question list sits low enough that his face stays in view (the mockup's list covers it).
- B skips a briefing you've already seen (spec 006), and the picks you made stay. A new briefing on a case played before asks again.
- The two picks save with the case's state in `bl.season`, so a reload keeps the notes and edges. New saves only add a field; old saves without it play as if no questions were asked.
- Every new case's spec names its four topics, the notes and the edges (add a row to the case spec template).

### Still Harvest's four topics

| Topic | INTEL note | Edge |
| --- | --- | --- |
| The town | Dot runs the diner, the only place open during the Walk. She knows everybody. | Dot shows first on the Next line, and her talk options open without the warm-up |
| The scarecrow photo | The ring on the scarecrow is real. Somebody dressed it with care. Count the scarecrows. | +10% on Search at the town's scarecrow hotspots |
| The local law | Deputy Ross called it in from his own phone. He needs three things that aren't crazy. | +10% on Persuade with Ross, including the Local chief route to the key |
| The corn maze | The gate is chained until dusk. Forcing it is loud. | The maze's danger zone shows its roamers' beats on entry once, as On guard does |

The +10% edges are a first guess. Change them at the demo playtest if they feel too small to matter.

## 4 · The new lines (draft for Keegan's OK)

The opening card and text stay: "SATURDAY · 11:52 PM" and the unlisted-number text. Then, one box each:

1. *The back room of a 24-hour donut shop off I-5. Spurs on linoleum.*
2. **BIG HAT:** Agent {code}. Sit.
3. *There is no chair.*
4. **BIG HAT:** Agency rang six teams tonight. You were awake.
5. **BIG HAT:** Marrow Creek, Oregon. Eight hundred and twelve people and a Dairy Queen that closes at six.
6. **BIG HAT:** Three of 'em gone in nine days. All durin' the Harvest Lantern Walk.
7. **BIG HAT:** Local police say they wandered off.
8. **BIG HAT:** Local police also mailed me a photo. Scarecrow in a church dress, wearin' one victim's wedding ring.
9. **BIG HAT:** I don't care for scarecrows, {first}. A scarecrow is a man with the man taken out.
10. **BIG HAT (shout):** AND I WILL NOT HAVE IT IN MY JURISDICTION.
11. *He sets down his cruller. His hand is perfectly steady.*
12. **BIG HAT:** Two questions. Make 'em count.

Answers (two boxes each):

- **The town:** "Diner's the only thing open durin' the Walk. Woman named Dot runs it." / "Dot's known every soul in that town since the Carter administration. Start with the pie."
- **The scarecrow photo:** "Ring's real. I had a fella check." / "Somebody dressed that scarecrow careful. Like for church. Count how many more they made."
- **The local law:** "One deputy. Ross. Only one who called it in, and he called from his own phone." / "He won't hand you the key to anything on a hunch. Bring him three things that ain't crazy."
- **The corn maze:** "Corn maze on the east side. Gate's chained till dusk." / "You cut that chain loud, the whole town hears it. Find a key or find a quiet tool."
- **No questions:** "Good. I like you. Don't make it weird."
- **After two:** "That's two."

Then requisition, as today. Then:

13. **BIG HAT:** You go in with badges. Town knows you're federal. Act like it.
14. **BIG HAT:** Ask around. Find 'em. Bring 'em home if they'll come.
15. **BIG HAT:** And {first}? Be home by Sunday. I don't do paperwork on a Sunday.
16. *You never see his eyes. Just the brim, and under it, the toothpick, moving.*

Cut from today's version: "Who are you?" / "I'm the fella in the big hat. That's the whole file." and the "Don't ring anything" line. "You were awake" moves into box 4.

## Build notes (Developer)

- Engine: `engine.js` (the scene drawing, the tab-only rule inside `bigHatScene`, the two-question helper so every case uses the same flow), the Case file's INTEL lines, and `cases/still-harvest.js` (`TEXT` lines, the four topics and their edges).
- The tab-only box is a setting on the call that shows the line; `engine/dialog.js` already draws a box with no portrait for signs, so no change to the shared file should be needed. If it is, change it in `engine/` for both games.
- Saves: one new field on the case's state; old saves keep opening.
- `npm run check`, then play the briefing with each topic, with No questions, and the debrief, at all three sizes.
- Changelog entry, and tick the To do line.

## Out of scope

- The debrief's lines (spec 007 set them).
- Big Hat's portrait itself, which stays as approved.
- Other cases' backdrops (each case's spec sets its own).
