# Spec 008: the home phase

Status: proposed, waiting for Keegan's merge · Written 2026-11-22 by the Game Designer · Game: Black Lantern · To do: Season readiness, step 3

## In plain words

After Demo 6, a closed case goes from Big Hat's debrief straight back to the case board (spec 007, step 6). This spec adds what happens in between: the agents go home.

First, any personal arc beat that's due plays on its own: a short cutscene about an agent's own story, after their 1st, 3rd and 5th case of the season. Then each of the three agents picks **one** thing to do with the break: see one of their people, get out into nature, chase a motivation, go to therapy, train, kick a habit's withdrawal by using, make a new Bond after one broke, or go on Sabbatical. Most choices play a short scene at home with one of the agent's Bonds, in a backdrop drawn for that kind of person, and the scene's mood follows how that relationship is doing. A result card shows the roll and what changed. After the third agent, you're back at the case board.

What you'll feel in play: SAN and Bonds finally have a way back up, so the people your agents love become something you protect, and spending them (to lean on at a Breaking Point, or to pay for training) is a real choice. A badly broken agent can step away on Sabbatical while a recruit covers, then come back.

Mockup (approved Nov 21): [`008-home-phase-mockup.png`](008-home-phase-mockup.png), with its source [`008-home-phase-mockup.html`](008-home-phase-mockup.html), copied unchanged from Drive (`home-phase-mockup-shell.html`). Four screens in play order. Build these.

Two things in the mockup are not to copy:

- **Placeholders.** Names, numbers, Bonds and the scene's lines are made up.
- **The shell.** The mockup was drawn before spec 003, so L and R sit in the bottom row. Use today's shared shell (`engine/shell.js`). Only the screen area is the mockup.

**Built in two parts, one Developer session each, in this order**, like Demo 5. Each ships a playable build to Dev on its own.

- **Part A, rules and screens:** the arc beats, the home screen, every choice's rules, Sabbatical with its recruit, the result card and the save. Scenes play in the Lantern Bust box over one plain stand-in backdrop, with the Bond's portrait.
- **Part B, the art:** the backdrops for each Bond type and each place, older faces for parents and mentors, and the Broken-Bond and arc-beat dressing.

## Where the story lives (spoiler wall)

The repo is public (`studio-bible/studio.md`, One repo). This spec gives only flow and rules.

- **Every home scene's lines** (per choice, per Bond type, per mood, including each Bond's last scene when it breaks) are written in `claude/home-scenes.md` in the Black Lantern Claude Project files (Systems → Home scenes). The Developer reads it at build time and copies only the lines into the game files.
- **The personal arcs** (each motivation's three beats, the two choices, both endings, and what each signature perk does) are in `claude/arcs-season-1.md` (Systems → Personal arcs). The Developer copies the beats' lines and the perks' effects into game data. Perk names and effects never appear in this spec, the bible, the changelog or a commit message.
- **Where the lines ship:** a new `home.js` text block for home scenes and arcs, following Tech → Where text lives (all in-game text stays in the game files). It's generic to every case, so it doesn't go in a case file.
- Changelog entries and commit messages describe what was built in mechanical terms only ("Fulfill Responsibilities plays a Parent scene in three moods").

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | Systems → Home scenes | One choice per agent; the nine choices and their numbers; Bond moods (Close, Strained, Fraying, Broken); Bonds appear as NPCs; scenes change with the Bond and its score |
| `games/black-lantern/bible.md` | Systems → Personal arcs | Main motivation's arc; beats after the 1st, 3rd and 5th case survived; choices in beats 1 and 2; good ending perk, bad ending disorder or broken Bond; Shield link; swapping at home restarts the arc; recruits count from their first case; Sabbatical cases don't count |
| `games/black-lantern/bible.md` | Systems → Motivations | The preset list; Breaking Point shield; Personal Motivation at home |
| `games/black-lantern/bible.md` | Systems → Sanity | Recovery routes; Sabbatical (1–3 cases, +1d6 SAN and 40% cure per case sat out); Leaning on a Bond sets the next scene's mood; Adapted costs Bonds |
| `games/black-lantern/bible.md` | Systems → Disorders | Curing: three Therapy scenes on the same disorder, or Sabbatical's chance; Addiction and Withdrawal |
| `games/black-lantern/bible.md` | Agents and items → Items, Addiction | Use home scene; Withdrawal each case |
| `games/black-lantern/bible.md` | Agents and items → Agent creator | Bond types (Partner, Kid, Parent, Sibling, Friend, Ex, Coworker, Mentor), Bonds start at CHA; Storybook faces from parts; recruits |
| `games/black-lantern/bible.md` | Agents and items → Professions | The Therapist |
| `games/black-lantern/bible.md` | Systems → Losing an agent | Recruits: pick 1 of 3 or the creator, starting kit only, arc starts at beat 1 |
| `games/black-lantern/bible.md` | Combat → Lasting injuries | Serious injuries clear on a Sabbatical |
| `games/black-lantern/bible.md` | Skills and menus → Quality of life | Odds on home scenes; Confirm what sticks before Sabbatical and giving up a motivation; Finish the box |
| `games/black-lantern/bible.md` | Skills and menus → Skill unlocks | Unlocks at 40, 75 and 90%; 99% cap (Between cases) |
| `games/black-lantern/bible.md` | Where items come from → Requisition | Big Hat refuses requisition after a Therapy fumble |
| `games/black-lantern/bible.md` | Art → Faces and sprites; Townsfolk and monsters | Storybook faces; drawn in code |
| `games/black-lantern/bible.md` | Tech → Saving | `bl.roster` holds Bonds, arc beats and Sabbatical cases left |
| `studio-bible/saves.md`, `ui.md`, `controls.md`, `art-style.md` | House rules | Saves, screen, buttons, art |
| `games/black-lantern/specs/007-debrief-and-case-gains.md` | Step 6 | The debrief ends at the board until home scenes exist |

## What is built today

From the changelog and specs 006 and 007, once Demo 6 is built:

- Agents carry Bonds (type, name, score), motivations with a Main, SAN, disorders, Adapted marks, lasting injuries and skills in `bl.roster`. Leaning on a Bond and giving up a motivation at a Breaking Point work (Demo 5 part A).
- The debrief ends with the funeral (if any), then the case board.
- Recruits: pick 1 of 3 or the creator, mid-case and at the debrief.
- Nothing raises SAN or a Bond between cases. Nothing counts arc beats.

If Demo 5 or 6 built any of this differently, the changelog wins; note the difference in this spec's changelog entry.

## What to build

### Part A: rules and screens (To do: Home phase part A)

**A1. Where it sits.** After the debrief's funeral or goodbye (spec 007, step 6) and before the case board. Spec 007's gains hint changes from `A: continue` to `Next: home scenes. A: continue`, as the mockup has it. Each agent's finished pick autosaves, so closing the app mid-phase picks up at the next agent. It plays after every closed case, never after a game over.

**A2. Arc beats first.** Before the home screen, each agent whose survived-case count this season just reached 1, 3 or 5 plays their Main motivation's beat, in seat order (Personal arcs).

- Count only cases the agent finished in the party. Sabbatical cases don't count. A recruit's count starts at their first case.
- Beats 1 and 2 end with a two-way choice in the Lantern Bust box; save it.
- Beat 3 plays the ending the two choices lead to. **Good:** the agent gains their arc's signature perk (its effect is game data from the arcs file), shown in the dossier's INFO tab as one line. **Bad:** the disorder or broken Bond the arc names. A broken Bond plays its last scene (A5).
- A beat doesn't use up the agent's home scene.
- **Shield link:** giving up the Main motivation at a Breaking Point plays the bad ending right then, as a short scene after the Breaking Point box (Personal arcs). The agent's arc is then over for the season.
- **Swapping the Main** at home (A4, Personal Motivation) ends the old arc with no payoff; the new arc starts at beat 1 and counts from the next case.
- An agent with no Main (both motivations given up) has no arc until Personal Motivation replaces one.

**A3. The home screen (mockup screen 1).**

- **Header:** `HOME` · `One choice each`. The team strip below: three faces, field names and their state (`Waiting`, `Choosing…` lit, or the pick they made, ticked).
- **The list,** one row per choice, with a small tag for what it touches (`+BOND`, `+SAN`, `+1D6%`, `BOND` cost, `1–3 CASES`). Each row shows the agent's odds where there's a roll (Odds on home scenes): `SAN 52%`, or the Therapist's Empathy when one runs Therapy.
- Rows that can't be used are greyed with the reason (`NO SLOT` for New Bond, `NO BOND ABOVE 1` when a Bond cost can't be paid). **Use** only appears for an agent with Addiction.
- The detail box spells out the highlighted choice: what it does, the roll, and what a crit and a fumble do. `A: pick` · `B: back` (B goes to the previous agent's pick, undoing it, until the first agent's scene has played; after that, picks stand).
- Agents choose in seat order. An agent on Sabbatical isn't in the strip; the recruit covering for them is.

**A4. The nine choices** (Systems → Home scenes; numbers as the bible sets them).

| Choice | Bond pick? | What the game does |
| --- | --- | --- |
| Fulfill Responsibilities | Yes, the Bond to see | SAN roll. Success: +1d6 to that Bond, up to CHA. Crit: also +1 SAN. Fumble: −1d4 to that Bond and −1 SAN |
| Back to Nature | Yes, the Bond who pays | −1 to that Bond, then a SAN roll. Success +1d4 SAN; crit +4; fumble −1d4 SAN |
| Personal Motivation | No | Pick one: **Pursue** one of the agent's motivations (SAN roll; success +1d2, crit +2), **Replace** a lost motivation, or **Swap** one, from the preset list. Replacing or swapping the Main asks which one is Main afterward, and a swap of the Main asks `Can't be undone. Sure?` because it ends the arc (A2) |
| Use | No (the game picks a random Bond to lose) | Only with Addiction. The agent starts the next case with no Withdrawal. One Bond (random among those above 0) loses 1d4; the agent loses 1 SAN |
| New Bond | No | Only with an empty Bond slot. Pick a type from the creator's list and type a name, as in creator step 5. It starts at half CHA, rounded up. No roll |
| Therapy | No | Pick **SAN** or **Disorder**. SAN: a SAN roll (or, if a Therapist is in the party and isn't this agent, they can run it with their Empathy; the detail box shows both odds and the better one is used). Success +1d4, crit +4. Fumble: no SAN change, and Big Hat refuses this agent's requisition at the next briefing (saved as a flag; Part C's requisition reads it). Disorder: pick one of the agent's disorders; no roll; the third Therapy scene on the same disorder cures it, and the card shows `2 of 3` |
| Improve Skill | No | Pick any skill: +1d6%, never above 99%. Crossing 40, 75 or 90 flashes the new unlock, as on spec 007's gains screen |
| Special Training | Yes, the Bond who pays | Pick an untrained skill (10%): it becomes 30%. −1 to that Bond. Greyed if every Bond is at 1 or less |
| Sabbatical | No | See A6 |

- **Crit and fumble** follow the bible's rules for every roll (Fumble: 100, or doubles that miss).
- **Bond costs never break a Bond by choice:** a Bond at 1 is greyed as a payer, like Leaning on a Bond. A fumble's loss can still take a Bond to 0 (A5).
- **Adapted, SAN and Breaking Points:** SAN gains never go above the agent's starting SAN (POW × 5); SAN losses at home (fumbles, Use) can trigger a Breaking Point, which plays the usual box after the scene.

**A5. Bond pick, scene and result (mockup screens 2–4).**

- **Pick a Bond (screen 2):** header `WHO TO SEE?` (or `WHO PAYS?` for a cost), the agent's CHA and SAN, then each Bond: portrait, name, type, score bar out of CHA with tick marks at the mood lines, and the mood tag. The detail box gives the line for that Bond's state and the roll. Broken Bonds (0) don't appear.
- **The scene (screen 3):** a few Lantern Bust boxes from `home.js`, picked by choice, Bond type and mood (Close, Strained, Fraying, from the score **before** the roll). A Bond lowered by Leaning or Adapted plays the mood its lower score sets (Sanity). Choices with no Bond play a scene at a place (the choice-to-place list is in Part B). Finish the box works throughout.
- **How it went (screen 4):** the last narration line, then the result card over the dimmed scene: header `HOME · <AGENT>` and the choice; the roll and die chips (`d100·31 PASS`, `d6·4 7 → 11`); and a mood change line when a Bond crosses a mood (`STRAINED → CLOSE · Next visit plays warmer.`). `A` goes to the next agent, or the case board after the last.
- **A Bond hitting 0:** right after the result card, that Bond's last scene plays, then the slot empties until New Bond fills it (Bond moods). A Bond breaking is a Severe helplessness horror (SAN loss table), so the agent rolls SAN for it.
- **Bond portraits:** built from the creator's Storybook face parts, the first time a Bond appears, then saved with the Bond so it never changes. Part A uses today's face parts; Part B adds the older parts.

**A6. Sabbatical.**

- Picking it asks how many cases, 1–3, then `Can't be undone. Sure?` (Confirm what sticks).
- Right away, Big Hat offers 3 recruits or the creator, exactly as for a loss (Losing an agent). The recruit takes the seat; the agent leaves the party and waits in the roster, marked `Sabbatical · n cases left`.
- **Each case the party closes** while they're away: their SAN rises 1d6 (up to max), and a 40% roll cures one disorder the player picks at that moment; the cure is shown in the home phase before the home screen, one card per agent away. All their Serious lasting injuries clear on the first case sat out (Lasting injuries).
- **Coming back (Keegan picked Nov 22: you choose each time):** when the last case is sat out, at the start of that home phase a small `BACK FROM SABBATICAL` screen shows the returning agent and the recruit who covered for them side by side (face, field name, profession, SAN, and the recruit's cases closed), and asks who keeps the seat. A picks, then `Can't be undone. Sure?` (Confirm what sticks). The other goes to the roster with everything they've earned. Whoever keeps the seat then picks a home scene like everyone else.
- Each returning agent gets their own screen, in seat order. Only the recruit who covered for that agent is offered against them.
- A game over while agents are away doesn't touch them; they're in the roster.

**A7. The case board after.** The board opens as spec 007 left it. Nothing on the board changes in this spec.

### Part B: the art (To do: Home phase part B)

- **Backdrops by Bond type,** one each, drawn in code at the screen's size in the dark home palette of the mockup's kitchen, with a night version where the scene calls for it: Partner (the agent's own living room), Kid (a kid's bedroom), Parent (the kitchen, as in the mockup), Sibling (a diner booth), Friend (a bar), Ex (a front porch), Coworker (a break room), Mentor (a cluttered study).
- **Places for choices with no Bond:** Back to Nature (woods at the edge of town; the paying Bond isn't in it), Personal Motivation (a church pew, a cemetery bench or a motel room, picked by the motivation), Therapy (a therapist's office), Improve Skill and Special Training (a firing range and a library), Use (a parked car at night), Sabbatical (a psych ward hallway), New Bond (the same backdrop as the new Bond's type).
- **Older faces:** grey and white hair, lines around the eyes and mouth, and reading glasses, as face parts, so Parent and Mentor Bonds read older (mockup screen 3). Kids get a smaller-face set.
- **Arc beats** play over the backdrop of the Bond their beat names, or a place, as the arcs file says.
- Check the Shared Shelf first for anything generic (furniture, windows, a fridge); propose new generic pieces to the Shelf only with Keegan's OK (CLAUDE.md, Shared Shelf). Black Lantern-only art goes on the Asset Library's core page under a new Home section, not a case page.

### Part C: enough scenes for a season (To do: Home phase part C; added Nov 23, 2026)

Today each choice has one scene per Bond type and mood (Back to Nature has six vignettes, Use three), so across a season an agent who keeps seeing the same Bond sees the same scene again and again. `studio-bible/play.md`, Picks from a pool don't repeat, asks the spec to size each pool and say how long the memory lasts.

| Pool | Size | Memory |
| --- | --- | --- |
| Fulfill Responsibilities | At least **3 scenes** for each Bond type and mood (8 types × Close, Strained, Fraying), plus each Bond's one last scene at Broken | Per Bond, for the season |
| Back to Nature | At least **9** vignettes | Whole party, for the season |
| Personal Motivation (Pursue) | At least **2** per motivation | Per agent, for the season |
| Therapy | At least **3** for SAN and **3** for a disorder | Per agent, for the season |
| Improve Skill, Special Training | At least **3** each | Per agent, for the season |
| Use | At least **3** | Per agent, for the season |

- A pick takes a scene from its pool that hasn't played yet for that memory. Once all of them have played, it starts over, never repeating the one that just played.
- **The memory lasts the season and goes in the save:** the list of played scenes moves from the home checkpoint to `bl.season` (one save step). A new season clears it.
- The scenes are written by the Developer in claude/home-scenes.md (Project files, never the repo), as today, in Keegan's voice (Voice). The sizes above are minimums; more is welcome.
- If a season runs longer than these pools can cover, the Developer says so, and the Designer raises the sizes here.

### Saves (Tech → Saving; `studio-bible/saves.md`)

- Part A adds one upgrade step, version + 1. Add test saves: one mid-home-phase, one with an agent on Sabbatical.
- **New on each agent (`bl.roster`):** cases survived this season; arc beats seen and the choices made; the arc's ending and perk; Therapy count per disorder; Sabbatical cases left and the seat they left; the requisition-refused flag; the no-Withdrawal flag for the next case; each Bond's saved portrait.
- **Old saves:** every agent's survived-case count starts at the number of cases closed this season that they were in, where the save knows it, otherwise 0. Nobody is owed a past beat: the next beat plays at the next 1, 3 or 5 they reach. Old Bonds get portraits the first time they appear.

### Left out on purpose

| Piece | Now or later |
| --- | --- |
| What happens to arcs and Sabbaticals when a season ends | Season readiness, step 4 (season flow spec) |
| Swapping agents in and out of the party from the roster between cases | Not in the bible. Raise it in the season flow spec if it's wanted |
| New choices beyond the bible's nine | Not planned |

### Screen sizes

Every screen fits with nothing cut off at 375 × 667, 375 × 550 and 320 × 480. At 320 × 480 the team strip and all nine rows fit with the detail box; if they can't, the list scrolls and the strip stays.

### Shared code

The home phase is Black Lantern's own (`home.js`, a new part loaded after `debrief.js`). Generic pieces, such as the die-roll chip spec 007 may have put in `engine/` and a score bar with tick marks, go in `engine/` per `CLAUDE.md`.

## Must stay true

- Still Harvest, the debrief, the case board, the party menu and Select work as before.
- Old saves keep opening, every test save included.
- One choice per agent per break, never more.
- Deaths stick: nothing at home revives the lost or undoes a broken Bond.
- Nothing from the home-scene or arc files appears in this spec, the changelog, the bible or a commit message.

## Done when

- `npm run check` passes in `games/black-lantern/src/` at all three sizes, with every old and new test save opening.
- Playtest after Part A (the Sabbatical return screen included, trying both picks): close Still Harvest, play beat 1 for each agent with both choices tried across runs; try every choice at least once, including a crit, a fumble, a Bond crossing a mood, a Bond breaking and New Bond; send an agent on Sabbatical for 1 case, close the case again (New game → same season, or a Dev shortcut), and see them come back; close the app mid-phase and reopen.
- Playtest after Part B: every backdrop and place shows, and Parent and Mentor Bonds read older.
- On an iPhone SE, the four screens match the mockup.
- `changelog.md` has a dated entry per part, with any deviations, and the matching To do lines are ticked.

## Bible notes for the Designer (no change made here)

- Systems → Sanity: Sabbatical says a recruit "fills in" but not what happens when the agent comes back. Keegan picked Nov 22 that the player chooses who keeps the seat each time (A6). This PR adds that line to Sanity.
- Systems → Home scenes: Use's Bond loss doesn't say which Bond. This spec picks one at random among those above 0, since the agent is hiding it from everyone.
