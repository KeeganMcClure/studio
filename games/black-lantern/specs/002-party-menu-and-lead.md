# Spec 002: Party menu and Select cycling the lead

Status: approved (studio PR #27, Nov 21), ready to build · Written 2026-11-21 by the Game Designer · Game: Black Lantern · To do item: Demo 2 of 6

## In plain words

Today, Start → Party just reads each agent out in a dialog box, one after another, and the lead is always whoever sat in seat 1 when the case began. This spec turns Party into the Pokémon-style screen from the approved mockup: three agent cards stacked, each with a clear face, HP, WP, SAN, any status, and the lead marked. Pick a card for **Make lead**, **Dossier** or **Give item**. On the map, **Select** swaps the lead to the next agent without opening any menu.

What you'll feel in play: you can put your Occultist in front before you walk up to the strange altar, because only the lead's skills work at hotspots and only the lead makes SAN rolls on the map. The new lead steps onto the same tile, facing the same way, carrying the lantern at night, and the low-SAN screen follows the new lead's SAN straight away.

Mockup: [`002-party-menu-mockup.html`](002-party-menu-mockup.html) (picture: [`002-party-menu-mockup.png`](002-party-menu-mockup.png)). It's a rough still drawn in code at the real 240 px width, built on the approved Nov 20 party menu and dossier mockups, with the clearer faces the bible asks for.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | To do → Demo 2 of 6 | The task: Pokémon-style party menu, and Select cycling the lead on the map |
| `games/black-lantern/bible.md` | Skills and menus → Map menu | Party: 3 cards stacked, HP, SAN, WP, status icons, lead marked; tap for Make lead, Dossier, Give item; open anytime except a fight or cutscene; Select cycles the lead; card faces must be clearer than the mockup |
| `games/black-lantern/bible.md` | Skills and menus → Using skills | Only the lead's skills work on the map; swapping leads anytime from the party menu, except during a fight or cutscene |
| `games/black-lantern/bible.md` | Skills and menus → Quality of life | Status info on tap; low-health pulse (3 HP or less, or Bleeding or Poisoned); L/R flips agents in a dossier or Give item |
| `games/black-lantern/bible.md` | Systems → Sanity | Who rolls: on the map, only the lead |
| `games/black-lantern/bible.md` | Systems → Statuses | Icons show in the party menu; each status's map effect and how it ends (for the detail line) |
| `games/black-lantern/bible.md` | Systems → Between cases | Party menu opens anytime on the map |
| `games/black-lantern/bible.md` | Agents and items → Item display | Give item: teammate cards show slots (5/8) and weapons (1/2), full ones greyed |
| `games/black-lantern/bible.md` | Agents and items → Agent creator, Built Nov 21 | Start begins with seat 1 as lead; battle abilities and items are stand-ins until Demo 5 |
| `games/black-lantern/bible.md` | Overview → pillar 6 | Below 40 SAN the lead's screen warps |
| `games/black-lantern/bible.md` | Art → Maps | Only the lead walks; the lead carries the lantern at night only |
| `games/black-lantern/bible.md` | Art → Faces and sprites | Storybook faces; dialog box colors (navy, cream border) |
| `games/black-lantern/bible.md` | Art → Reference mockups | party-menu-mockup-shell.html and dossier-mockup-shell.html (Nov 20); creator's 32 × 32 Storybook faces are the detail level to match |
| `games/black-lantern/bible.md` | Art → Light and mood | Below 40 SAN, colors sour and the lantern's light shrinks |
| `games/black-lantern/bible.md` | Combat → Lasting injuries (Display) | Injuries show on the agent's page in the party menu (later; see Not in this spec) |
| `games/black-lantern/bible.md` | Tech → Screen and controls | Select cycles the lead agent on the map |
| `games/black-lantern/bible.md` | Tech → Saving | `bl.party` holds the 3 agents in the field and who leads; keep saves backward compatible; save upgrades |
| `games/black-lantern/bible.md` | Process → Playtest checklist | Every button works, including Select; fits at 375 × 550 and 320 × 480 |
| `studio-bible/controls.md` | Buttons | Select cycles the lead character on the map; tapping a menu row works; D-pad repeat timing |
| `studio-bible/controls.md` | Target screen | iPhone SE first; nothing cut off at 375 × 550 and 320 × 480 |
| `studio-bible/ui.md` | Menus | List boxes with a cursor, D-pad or tap; Start opens the map menu |
| `studio-bible/art-style.md` | How art is made; Craft; Color; Fonts | Drawn in code; Storybook craft; SAN pink for low SAN; Press Start 2P and VT323 only |
| `studio-bible/saves.md` | (whole file) | Version number, upgrade steps, test saves must open |
| `studio-bible/rules-checks.md` | Shared engine; Across games | Shared parts go in `engine/`; an engine change must not break another game |
| `studio-bible/studio.md` | Shared engine and spoiler wall | Anything two games could use goes in `engine/` |

## What is built today

From `changelog.md` (Nov 21) and a read of `engine.js` and `creator.js` only (no case files opened).

- **Map menu:** Start opens Party, Items, Notebook, Save & quit, Close. Party plays one dialog box per agent (profession, HP, WP, SAN, Breaking Point, disorder, weapon).
- **Lead:** always the first agent in the party list (seat 1 from Your team). Nothing can change it. Select does nothing on the map ("Art build pass, part 1").
- **Statuses on the map:** none are built yet. Agents carry only HP, WP, SAN, a disorder, Downed and Stunned (both battle only).
- **Items:** one shared stand-in item pack for the whole party, no per-agent slots (until Demo 5).
- **Faces:** the creator draws 32 × 32 Storybook portraits for any agent (`BL.drawPortrait`, `BL.portraitURL`).
- **Saves:** the party, in seat order, is saved inside the checkpoint (`bl.game`). There is no `bl.party` key yet. Save version is 2.
- **Battle stand-in:** the old battle code ends the fight as lost when the lead goes down. That breaks the bible's game-over rule, but battle is rebuilt in Demo 5 (see Conflicts found).

## What to build

### 1. Party screen (Start → Party)

Matches mockup frame 1 and the approved Nov 20 party menu mockup.

- A header box: PARTY, and a hint "SELECT swaps the lead".
- Three cards stacked, one per agent, **always in seat order** (seat 1 on top). The LEAD tag moves; the cards don't (see Open question 1).
- Each card shows:
  - The agent's 32 × 32 Storybook face from the creator, at a size that reads clearly on an iPhone SE. Not the 12 × 12 placeholder faces from the Nov 20 mockup (Map menu, "Party card faces").
  - Name and profession on one line.
  - An HP bar with HP as numbers (current/max).
  - WP and SAN as numbers. SAN shows in SAN pink below 40.
  - A status tag for each status the agent has, short word on a colored chip (BLEED, POISON, SICK, DRUNK, HIGH, TIRED, SHAKEN). Since no map statuses exist yet, the build only needs the slot and the chip style ready, plus a test hook to show one.
  - The lead card: a mustard LEAD tag with a small lantern icon, and a mustard top edge.
- **Low-health pulse:** a card blinks at 3 HP or less, or while Bleeding or Poisoned (Quality of life).
- **Detail box** under the cards for the highlighted agent: name, profession, then one plain line per status saying what it does and how it ends, using the Statuses table's wording. With no status, it shows "No conditions."
- **Moving:** Up/Down or a tap moves the cursor between cards; the cursor wraps. A or a tap on the highlighted card opens the popup. B closes Party and returns to the map menu.
- **Select inside Party** makes the next agent the lead (same as on the map) and the LEAD tag moves right away.
- **Tapping a status chip** shows its detail line (Status info on tap).

### 2. The popup: Make lead, Dossier, Give item

- A small list box beside the highlighted card, same look as the other list boxes (navy, cream border).
- **Make lead:** that agent becomes the lead; the popup closes and the LEAD tag moves. On the current lead it is greyed out.
- **Dossier:** opens section 3.
- **Give item:** greyed out, with the detail box saying "Item slots arrive with the Still Harvest rebuild." until Demo 5 adds per-agent slots (see Open question 2). The row is there so the menu never changes shape later.
- B closes the popup back to the cards.

### 3. Dossier

Matches mockup frame 2 and the approved Nov 20 dossier mockup.

- Tabs along the top: INFO, SKILLS, BONDS.
- **INFO:** 64 × 64 face (the creator portrait scaled), name, LEAD tag if the lead, profession, one-line backstory, Main motivation; HP, WP and SAN bars with numbers and the Breaking Point; the six stats; equipped weapon with its dice and the to-hit skill %; any disorder.
- **SKILLS:** every skill with its current %, the same list and order as the creator's skills step.
- **BONDS:** each Bond's name, type and score (current/CHA) with its mood word (Close, Strained, Fraying, Broken) from Home scenes.
- Moving between agents and tabs follows Open question 3. B returns to the cards with the same agent highlighted.

### 4. Select on the map

- Pressing Select while the lead is free to walk makes the next agent in seat order the lead (1 → 2 → 3 → 1). Skip any agent who can't lead (lost or Downed), in case a later demo allows it on the map.
- It does nothing during dialog, menus other than Party, cutscenes, scripted moves, mid-step, or battle (Using skills, Swapping leads). Presses there are ignored, not saved up.
- The new lead appears on the same tile, facing the same way. No walking animation, no fade.
- A small banner at the top of the screen, "LEAD · NAME" in Press Start 2P, shows for about 1 second (mockup frame 3). Another Select while it shows replaces it.
- Everything that follows the lead switches at once: the map sprite, the lantern at night, the low-SAN colors and lantern size (they follow the new lead's SAN), whose skills hotspots offer, and who rolls SAN on the map. Case dialog that names the lead (`{code}`, `{first}`) uses the new lead from the next line on.

### 5. Saving who leads

- Who leads is saved and survives closing the game and reloading a checkpoint.
- Per Tech → Saving, it belongs to `bl.party`. If moving the party out of `bl.game` into `bl.party` is too big for this demo, keeping the party in the checkpoint and adding the lead there is allowed, logged as a deviation in the changelog.
- Either way it is a change to what a save holds, so it adds upgrade step 3 (version 2 → 3). Old saves with no lead stored open with seat 1 as lead, exactly as today. Fresh test saves (one with the lead in seat 2 or 3) go in `tools/test-saves/`, and `npm run check` must open every old and new one (`studio-bible/saves.md`).

### 6. Shared engine: flag

Rushlight's bible has the same rules: three cards stacked Pokémon-style with the lead marked and Make lead / Merc card / Give item, and Select cycling the lead (Rushlight Skills and menus → Map menu). Under the studio's rule, anything two games could use goes in `engine/` (`studio-bible/studio.md`, Shared engine).

- **Into `engine/`** (a new file, for example `engine/party.js`): tracking who leads, cycling it in seat order while skipping agents who can't lead, the "can the lead change now?" check, and the stacked card list with its cursor, popup, taps, wrap and blink. Each game supplies what goes on a card, its words, and its colors.
- **Stays in Black Lantern:** card contents (HP, WP, SAN, statuses), the Dossier, the detail lines, the colors, and the save keys.
- **Rushlight's checks must pass.** Rushlight doesn't have to use the new file yet, but `npm run check` must pass in Rushlight's `src/` as well as Black Lantern's before this merges (`studio-bible/rules-checks.md`, Across games). Nothing in `engine/shell.js`, `input.js` or `move.js` may change behavior for Rushlight; if Select needs routing changes there, Rushlight's presses must behave exactly as today.

## What must not change

- Seat order, and the battle row order, stay as picked on Your team. Changing the lead never reorders the party in battle.
- Walking, running speed, facing, warps and step triggers (spec 001).
- The other map menu rows (Items, Notebook, Save & quit, Close) work as today. Renaming them to the bible's full row list is not this spec.
- Battle rules, the stand-in items and the stand-in abilities.
- Every save from past builds still opens, with seat 1 leading where no lead was saved.
- No new sound (there is none), no new fonts, no outside art.
- Rushlight plays exactly as today.

## Done when

1. Start → Party shows three cards in seat order with face, name, profession, HP bar and numbers, WP, SAN (pink below 40), status chips and the LEAD tag, and a detail box for the highlighted agent. The faces are the creator's Storybook portraits and are clearly readable on an iPhone SE.
2. Make lead, Dossier and Give item open from a card; Make lead is greyed on the current lead; Give item is greyed with its reason line.
3. The Dossier shows INFO, SKILLS and BONDS for each agent, and moving between agents and tabs works as answered in Open question 3.
4. Select on the map cycles the lead 1 → 2 → 3 → 1. The new lead stands on the same tile facing the same way, the banner shows, and with a lead below 40 SAN the warp and smaller lantern appear or disappear at once.
5. Select does nothing during dialog, battle, cutscenes or mid-step.
6. After swapping the lead, a hotspot offers the new lead's skills and a map SAN roll is made by the new lead.
7. The lead survives Save & quit and reload. Every old test save opens with seat 1 leading; the new test saves open with their saved lead.
8. A card blinks at 3 HP or less (testable with a debug value), and a status chip shows its line when tapped (testable with the test hook).
9. `npm run check` passes in Black Lantern's and Rushlight's `src/` at 320 × 480, 375 × 550 and 375 × 667, including Select. Nothing is cut off at any size, the popup included.
10. `changelog.md` gets a dated entry: what was built, what's left, any deviation (for example the save key choice in section 5).

## Not in this spec

- **Give item working, and the Items row's per-agent slots and backpack.** They need Demo 5's items. Give item's screen follows Item display then.
- **The map's lead card** (top-left on the approved On Map mockup) and its low-health pulse on the map. Part of the map look in Demo 4.
- **Statuses on the map** (causes, ticks, cures). This spec only shows them once they exist.
- **Lasting injuries, Adapted pips and the bleed-out counter** in the Dossier. Those systems aren't built; their display joins the Dossier when they are.
- **The full map menu row list** (Skills, Case file, Log, Settings).
- **Battle changes**, including the stand-in "lose when the lead goes down" rule.
- **Revisiting party size** (its own To do item after the Still Harvest playtest).

## Conflicts found

1. **L/R in the Dossier.** Quality of life says "L/R flips agents: in a dossier, Items or Give item, L and R jump to the previous or next agent" (set Nov 19). The approved dossier mockup (Nov 20) uses L/R for the INFO / SKILLS / BONDS tabs and Up/Down for the next agent. See Open question 3. I won't pick one without you, because the bible and an approved mockup disagree.
2. **Lead going down in battle.** The old battle code loses the fight when the lead is Downed. The bible says game over only when the whole team falls (Overview, pillar 3; Gameplay loop). Once you can pick any lead, this stand-in decides which agent's fall ends the fight. Left for Demo 5, since this spec doesn't touch battle, but you should know that playtesting this demo can still end a fight early.
3. **Where the lead is saved.** Tech → Saving names `bl.party`, which doesn't exist yet; the party lives in the checkpoint. Section 5 allows either, logged as a deviation.

## Proposed for studio-bible/

Both games share these rules word for word today, so I propose a separate PR, once you answer the questions below, that adds to `studio-bible/ui.md` a **Party menu** section:

- Start → Party shows the party as cards stacked Pokémon-style, in seat order, with the lead marked. Each card opens Make lead, a details page (Dossier in Black Lantern, Merc card in Rushlight) and Give item.
- Select cycles the lead in seat order, on the map and in the party menu, never in battle, dialog or cutscenes. The new lead takes the old lead's tile and facing, and a short banner names them.
- Each game's bible sets what a card shows.

`studio-bible/controls.md` already says Select cycles the lead; the PR would point it at the new section.

## Open questions for Keegan

1. **When you change the lead, do the cards move?**
   - A. Cards stay in seat order; the LEAD tag moves. (Recommended) Cards never jump under your thumb, and Select cycling is easy to predict.
   - B. The lead's card moves to the top, Pokémon-style; the others keep their order.
2. **Give item before Demo 5.**
   - A. Show it greyed with a one-line reason until Demo 5. (Recommended) The menu keeps its final shape, and nothing is built twice.
   - B. Hide the row until Demo 5.
   - C. Make it work now on the stand-in shared item pack (thrown away in Demo 5).
3. **L/R in the Dossier** (Conflict 1).
   - A. Follow the mockup: L/R change tabs, Up/Down change agent, and reword the Quality of life line to match. (Recommended) Three tabs need a button, and Up/Down already means "next card" on the Party screen.
   - B. Follow Quality of life: L/R change agent, and Left/Right on the D-pad change tabs.
4. **Moving the shared party-menu parts into `engine/`.**
   - A. Yes: lead tracking, Select cycling and the card list go in `engine/` now; Rushlight adopts them when it builds its party menu. (Recommended) It's the studio rule, and Rushlight's bible asks for the same screen.
   - B. Build it inside Black Lantern now, and move it when Rushlight needs it.

**Answers (Keegan, Nov 21):** 1 A, 2 A, 3 A, 4 A. Cards stay in seat order and the LEAD tag moves; Give item is greyed with its reason until Demo 5; in the Dossier, L/R change tabs and Up/Down change agent (Quality of life reworded to match); lead tracking, Select cycling and the card list go in `engine/`. The bible and `studio-bible/ui.md` were updated to match in the follow-up PR.
