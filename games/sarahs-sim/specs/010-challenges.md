# Spec 010: Challenges

Status: draft, for Keegan's review · Written 2026-11-25 by the Game Designer · Game: Sarah's Sim · To do: Specs (Challenges); Challenges mode

## In plain words

Challenges are design jobs from clients, each with one twist. For example: a winter cabin living room that has to have a fireplace, a first apartment on 800 coins, a bedroom in one color, or a date-night outfit with something red. She picks one from a board, designs it with the usual tools, and hands it in. The client gives 1 to 3 stars, and she earns a reward piece for her Life catalog. There are no timers and no way to fail, and she can try any challenge again for more stars.

This mode is built last (bible, To do). If time runs short, it's the one part that comes in an update after Christmas.

## Bible sections this spec relies on

The bible wins over this spec (`studio-bible/studio.md`, Specs).

| Source | Section | What it sets |
| --- | --- | --- |
| `games/sarahs-sim/bible.md` | Modes | Challenges: themed design jobs with a small reward, built last |
| `games/sarahs-sim/bible.md` | Play → Challenges | Client briefs with a twist, 1 to 3 stars, the list of 14, the rewards |
| `games/sarahs-sim/bible.md` | Play → Life mode | Gigs are the small jobs, and Challenges are the bigger themed ones; special sets |
| `games/sarahs-sim/bible.md` | Decorating; Style; Homes and people | The Decorate, Style and Build tools; Keegan and Sarah as models |
| `games/sarahs-sim/specs/006-life-mode.md` | Part F | How gigs judge with tags and hearts, which challenges build on |
| `studio-bible/ui.md` | Screen craft | Cards, readable text, color never the only label |
| `studio-bible/play.md` | No accidental point of no return | Leaving a challenge part-way never loses anything |
| `studio-bible/studio.md` | Screen list; Playtests | The Challenges screen row; the playtest after part A |

## Screens

| Screen | Mockup |
| --- | --- |
| Challenges (the board and the result card) | `challenges-v1` (approved Nov 26, 2026) |

## Part A: The board

- From the title screen, Challenges opens a cork board with one pinned card per challenge from the bible's list.
- **Each card** shows:
  - the client's small portrait
  - the brief in one line
  - the twist, in its own line with a ribbon icon
  - the kind of challenge (Room, Yard or Outfit)
  - her best stars so far, as stars with a number next to them (`studio-bible/ui.md`)
- **Order:** all 14 are open from the start, because a gift shouldn't make her grind to reach the fun ones (*Claude default*). The first three are pinned at the top as a gentle start.
- A finished challenge shows its ribbon. Tapping a card shows **Start** and **Back**.

## Part B: Doing a challenge

**The space:**

- **Room challenges** open a ready-made empty room of the right size, with walls, a door and windows already in.
- **Yard challenges** open an empty yard.
- **Outfit challenges** open Style on a model. The default model is Sarah, and she can swap to Keegan or a person she made.
- Challenge 7 starts with its three "keep" pieces already placed.
- Challenge 12 opens Style with both Keegan and Sarah.

**The tools:** the normal Decorate, Build-paint and Style tools, with the full catalog. A small banner at the top shows the brief, the twist and a **Hand in** button.

**The twist is checked live.** A small check by the banner turns green when the twist is met, with a word next to it, not only a color. For example:
- a budget twist shows coins spent out of 800;
- a piece limit shows pieces used out of 8;
- a one-color twist marks any piece outside the color family.

**Leaving:** B, then **Save and leave**, keeps the work in progress, one per challenge. She can come back any time. Nothing is ever lost (`studio-bible/play.md`).

**Sandbox and Life don't change.** A challenge's space is its own and never touches her homes or her coins (*Claude default*).

## Part C: Stars and rewards

**Stars** (*Claude default*), built on the gig judging in spec 006:

| Stars | When |
| --- | --- |
| 1 | The brief is met: the room has its basics (somewhere to sit, light and decor, or a full outfit) |
| 2 | The brief and the twist are both met |
| 3 | The brief and the twist, plus at least 2 of the client's 3 hidden likes. The likes are shown as hints in the client's chat after the first try |

- **The result card:** the client reacts in a short line, with their portrait. The stars fill in one by one. A snapshot of her design is pinned to the card.
- **Hints:** the client's line gives one hint toward a missing star, such as "I was hoping for more green!". She can try again as often as she likes, and only the best stars count.
- **Rewards** (bible, Play → Challenges):
  - The first finish gives one themed piece.
  - The first 3-star result gives a second piece.
  - Both join her Life catalog as a special set with a ribbon, and her finished design is kept on the board as a photo she can add to the memory book (bible, Keeping designs).
- **The final ribbon:** finishing all 14 hangs a gold ribbon on the board and unlocks a "design studio" sign piece (*Claude default*).

**Challenge data:** one row per challenge, so adding a challenge after Christmas is a new row. Each row holds:
- id, client, brief, twist type and its value, and kind;
- the room size or model;
- any starting pieces;
- the three hidden likes, as tags;
- the two reward pieces.

**Twist types** for the 14: must-have pieces, a budget, one room for everything, one color family, a minimum count of a kind of piece, keep these pieces, a piece limit, matching outfits, and a color limit.

## Saves

- Saved per challenge: best stars, rewards given, and the work in progress or the finished design.
- Saved under the planned `ss.` prefix, with a save version (`studio-bible/saves.md`). Finished designs are saved as compact recipes, like memory book snapshots (spec 007).

## Build order

1. Draw and approve the **Challenges** mockup.
2. Part A and part B with challenges 1 to 3. Keegan plays them on the phone (`studio-bible/studio.md`, Playtests).
3. Part C, then the other 11 challenges, which are content rows.

This spec needs the Decorate, Style and Build tools (specs 001 to 004) and the gig judging (spec 006, part F).

## Claude defaults to confirm

- All 14 challenges are open from the start.
- The star rules, with hidden likes as the third star.
- The challenge spaces are separate from her homes and coins.
- A gold ribbon and a sign piece for finishing all 14.
