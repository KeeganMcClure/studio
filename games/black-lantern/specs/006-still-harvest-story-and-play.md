# Spec 006: Still Harvest story and play

Status: proposed, waiting for Keegan's merge · Written 2026-11-22 by the Game Designer · Game: Black Lantern · To do: Demo 5 of 6 (parts A, B and C)

## In plain words

After Demo 4, Still Harvest looks right but still plays like the old demo: old battle abilities, one shared item pack, no skills at hotspots, random fights in the maze, and a Gleaner with almost twice the HP the bible sets. Demo 5 makes the case play by the bible's rules, start to finish. It is the vertical slice: if this one case feels right, the design works (Process → The road, step 4).

Keegan picked on Nov 22 to build it in **three parts, one Developer session each, in this order**. Each part ships a playable build to Dev on its own, and Still Harvest must play start to finish after every part.

- **Part A, field rules:** what happens on the map. Each agent carries their own kit and items, A on a hotspot offers the lead's skills with their odds, statuses tick as you walk, and SAN works by the bible (bracing, Steadying, Breaking Points, disorders, Adapted). The map menu gets its full rows.
- **Part B, combat:** the battle rebuilt under the Combat tab. Fight, Skills, Items and Guard; turn order by DEX in a side column; WP-costed moves for every skill; Downed agents and bleed-out; lasting injuries; the head-on layout from the approved combat mockup, with battle art for the case's enemies.
- **Part C, the story:** Still Harvest rewritten in its text block under the new rules. Fewer but harder fights (2–3 story fights and the boss, no random fights), skill-driven clues, branching paths that rejoin, motivation moments and overstepping, and the Gleaner rebuilt at the bible's numbers.

What you'll feel in play: you lead with the agent whose skills fit the moment, you stock each agent before a fight, the maze stops ambushing you every few steps, and the few fights you do take are long, tense and worth planning for.

**No new mockup.** Every screen here already has an approved mockup (On Map, Character menus, Combat layout) or follows the bible's written rules (Item display).

## Where the story lives (spoiler wall)

The studio repo is public, and case content in it is readable by anyone (`studio-bible/studio.md`, One repo). So this spec gives only structure and mechanics: beats, clue types, kinds of choices, endings by label. It names no culprit, twist, solution or hidden clue.

- **The case design** (twist, internal logic, clue IDs and what each proves, the choices that matter, the 8–10 skills it supports, its 1–2 motivation moments, enemy cards, the boss's phases and weakening choice, and which endings exist) goes in **`claude/cases/still-harvest.md` in the Black Lantern Claude Project files**, as Story → Adding a new case, step 4 says. Keegan doesn't open it. The Developer writes it there at the start of Part C if it isn't there yet, reads it at build time, and never copies it into this repo. Still Harvest was approved long ago, so there is no pitch step (step 3).
- **Arc touches:** the agency arc file (`claude/SPOILERS-agency-arc.md`, Project files) may add small touches to the case. They never appear in this spec, the changelog, the bible or a commit message (Story → Agency arc).
- **The lines themselves** ship in `cases/still-harvest.js`, the case's text block, because all in-game text lives in the game files (Tech → Where text lives). That's expected. Changelog entries and commit messages describe what was built in mechanical terms only ("the town has a second story fight"), never what it reveals.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | To do → Demo 5 of 6 | Its text block, branching paths, and fewer but harder fights under the new combat rules |
| `games/black-lantern/bible.md` | Overview → Design pillars | Investigation first, fights rare and dangerous; classic JRPG difficulty with the Gleaner as the benchmark; no mechanics for mechanics' sake |
| `games/black-lantern/bible.md` | Story → Demo case: Operation Still Harvest | The case's seven steps: briefing, town investigation (5 clues, 3 needed), the Volunteer fight, the dark corn maze, three victims, the Gleaner, the debrief |
| `games/black-lantern/bible.md` | Story → Adding a new case | Steps 4–8: private case file, writing in Keegan's voice, art, ending, build and check (boss tuning check) |
| `games/black-lantern/bible.md` | Story → Agency arc | Arc touches are added quietly and never written down in the repo |
| `games/black-lantern/bible.md` | Voice | How every line reads: one thought per box, 3 short lines at most, clues hidden in what people want to talk about |
| `games/black-lantern/bible.md` | Systems → Gameplay loop | Case length; 2–3 story fights plus the boss, no random encounters; 0–2 danger zones with roamers; fleeing; clue styles; deduction never a dead end; time of day; choices branch and rejoin; healing; saving; game over |
| `games/black-lantern/bible.md` | Systems → Sanity, SAN loss table, Disorders | SAN rolls, who rolls, bracing, WP, Steadying, leaning on a Bond, Adapted, Breaking Points, the loss table and case budget, the six disorders and flares |
| `games/black-lantern/bible.md` | Systems → Statuses | The nine statuses, their map and combat rules, ticks on area changes |
| `games/black-lantern/bible.md` | Systems → Losing an agent | 0 SAN and bleed-out, snapping in a fight, the recruit at the next safe spot, pick 1 of 3, starting kit only, case items pass to the lead |
| `games/black-lantern/bible.md` | Systems → Motivations | 1–2 motivation moments per case, 1d4 SAN back, giving one up at a Breaking Point |
| `games/black-lantern/bible.md` | Agents and items → Agent creator | Luck is a flat 50%; stat jobs (STR melee bonus, CON shrugs, INT Hunch) |
| `games/black-lantern/bible.md` | Agents and items → Starting kit, Items, Item display, Item list, Where items come from | Per-profession kit, 8 slots and 2 weapons per agent, the shared backpack, Give item, refills, the item screens, Lantern Boxes, requisition, loot |
| `games/black-lantern/bible.md` | Skills and menus → Using skills, Skill unlocks, Skill choices | Lead-only skills at hotspots, greyed options naming the skill, unlocks at 40/75/90%, Loud actions |
| `games/black-lantern/bible.md` | Skills and menus → Overstepping and cover stories | The overstepping roll and steps, open or quiet cases, the Case file shows the step |
| `games/black-lantern/bible.md` | Skills and menus → Map menu, Quality of life | Party, Skills, Items, Case file, Log, Settings, Save; the QoL list |
| `games/black-lantern/bible.md` | Combat → Basics, Combat numbers, Battle moves, Status moves, Enemies and difficulty, Bosses, Lasting injuries | The whole battle: layout, turn order, hit rolls, command menu, WP costs, 0 HP, dice, crits and fumbles, Fight floor, enemy tiers, every move, health bars, threat skulls, horror on sight, targeting, flee, bosses and the tuning check, the injury table |
| `games/black-lantern/bible.md` | Art → Light and mood, Townsfolk and monsters, Direction | Battle backgrounds from the map spot; uncanny monsters; monsters that talk get a portrait; townsfolk at night; one case, one set of art; save every asset |
| `games/black-lantern/bible.md` | Tech → File and code, Saving | Parts and load order; cases as data plus small scripts; where text lives; the save keys and save upgrades |
| `games/black-lantern/bible.md` | Process → Playtest checklist | Run before every publish |
| `studio-bible/ui.md` | Battle screen, Menus, Party menu, Dialog box | Head-on battle inside the shell with the D-pad, turn order in a side column; menu and dialog look |
| `studio-bible/controls.md` | Buttons, Target screen | Button jobs and the three screen sizes |
| `studio-bible/saves.md` | (whole file) | Version number, back up first, one upgrade step per change, test saves must open |
| `studio-bible/art-style.md` | (whole file) | Drawn in code; portraits 64 × 64; SAN pink and cyan; Shared Shelf rules |
| `studio-bible/studio.md` | One repo, Shared engine and spoiler wall | The repo is public; shared code goes in `engine/` |

## What is built today

From the changelog (Demos 1–4, Nov 21–22) and the code:

- **The case** (`cases/still-harvest.js`) is the old demo story with Demo 4's art. Its text block (`TEXT`) is still empty; every line sits inline in the scripts. Five clues in town, 3 needed for the gate key; the Volunteer fight; the maze at night with **random encounters** every 11–22 steps (`G.enc`, from two encounter tables); three victims on scarecrow poles; a lore note; the Gleaner at **110 HP**; a debrief with a cover-story question and a Bond pick. Choices are three-option `ask` menus, not skill rolls.
- **Combat** (`engine.js`, `battle`, `memberTurn`, `useAbil`) is the old system: Attack, Skill, Item, Defend, Run (60% flat); each profession borrows 2 of the old named abilities (Badge Flash, Triage, and so on) with old WP costs; no turn-order column, no threat skulls, no Downed bleed-out (KO'd agents stand at 1 HP after the fight), no injuries. Weapons already roll the Combat numbers dice. Enemies are at old numbers.
- **Items:** one shared item pack for the party (`startKit`). The creator shows each profession's bible kit and weapon, but play doesn't use them. Party → Give item is greyed with a reason.
- **Skills on the map:** none. No hotspot offers a skill roll, so changing the lead changes nothing yet.
- **SAN:** `sanCheck` rolls against SAN with pass/fail losses. No bracing, Steadying, tiers or kinds, Breaking Points, disorders, flares or Adapted marks.
- **Statuses:** only a Dev test hook shows status chips on the party cards (`BLG._t.status`); nothing causes or ticks them.
- **Map menu:** the pause menu, not the bible's seven rows. No Case file, Log or Settings.
- **Map look (Demo 4):** Shared Shelf maps, town at dusk, maze at night, the low-SAN look below 40 (`engine/light.js`), the lead card, NIGHT tag and A bubble.
- **Saves:** version 4 (`bl.roster`, `bl.draft`, `bl.game`, `bl.party`, `bl.season`, `bl.backup`). Ten test saves in `tools/test-saves/`, including a mid-maze checkpoint.

## What to build

### Part A: field rules (To do: Demo 5 part A)

Rules that work on the map and in menus. The story stays today's; Part A only swaps its plumbing, so Still Harvest still plays start to finish.

**A1. Each agent's own kit and items** (Agents and items → Starting kit, Items, Item display)

- Every agent starts the case with a handgun plus their profession's kit weapon and item from the Starting kit table. This replaces the shared pack (`startKit`).
- Each agent: up to 2 weapons (one equipped) and 8 item slots, the kit item included, no stacking. Everything else goes in the party's shared backpack (no limit, map menu only).
- Kit items refill at the start of each case; all other items carry over.
- **Map menu → Items** and **Party → Give item** work as Item display says: rows on top, a detail box under them, the header with the owner and slots used (`RAINE 5/8`), weapon dice, the lantern / pin / bang markers. Give item stops greying out; full teammates show greyed.
- **Pickups:** one line ("Found: Bandage. Clears Bleeding."), then where it went: the lead's slots if there's room, else the backpack.
- Every item in the Item list works as written, on the map now and in battle from Part B. Items that only matter in battle (throwables, Bear spray) can be used there once Part B lands; until then they show and can be moved, not used.
- L/R flip agents in Items and Give item (Quality of life).

**A2. Skills at hotspots** (Skills and menus → Using skills, Skill unlocks)

- A on a hotspot opens the lead's options for it, each with its odds: `Force it · Melee 55%`. Options the lead lacks, or hasn't unlocked yet (40/75/90%), show greyed with the skill name, so you know whom to swap in.
- Every unlock in the Skill unlocks table that a case can call on is available to cases as data: a hotspot lists which options it offers and what success, failure and a fumble do. Cases decide which ones they use; Part C fills Still Harvest's.
- Loud actions are flagged, so Part C's roamers can hear them.
- **Map menu → Skills:** the lead's away-from-hotspot skills: First Aid's Patch up (once per hurt), Medicine's Treat, Survival's Make camp and Science's Analyze once unlocked. Greyed with the skill name when the lead lacks them.
- **INT Hunch:** once per case, at a deduction, roll INT × 5 for a hint (Agent creator, stat jobs).
- **Failed tries are remembered:** every skill an agent tried and failed this case is saved, for Demo 6's end-of-case improvement (Between cases).

**A3. Statuses on the map** (Systems → Statuses)

- All nine statuses exist, with the map rules and endings in the table. Ticks happen on each area or room change. They clear at the end-of-case heal-up.
- Icons show beside HP and SAN on the lead card and the party cards; tapping one gives its one-line rule (Status info).
- **Low-health pulse** on the lead card at 3 HP or less, or while Bleeding or Poisoned (Quality of life; held from spec 005).
- CON shrugs: an agent can roll CON × 5 to shrug off Poisoned or Sickened as it lands; Retch works once per scene on the map.

**A4. SAN by the bible** (Systems → Sanity, SAN loss table, Disorders; Motivations)

- **Horrors are data:** each has a tier (Unsettling, Disturbing, Severe, Shattering, Boss), a kind (violence, helplessness, unnatural, with a phobia subject for unnatural ones) and an id, so it costs SAN once per case.
- **Who rolls:** the lead on the map; all three in cutscenes and battles.
- **Bracing:** before a horror the case marks as known-coming, a prompt offers each agent who would roll a brace (1d4 WP, halves the loss). Exhausted doubles the cost.
- **Steadying:** an agent at 40%+ Empathy rolls when a teammate fails, once per horror, no turn; success halves, a crit cancels.
- **Order of softening:** roll, then one halving (round down), then Drunk −1, never below 0.
- **Breaking Point:** SAN minus POW, reset after each one. Hitting it makes the agent Shaken and offers three choices: take a disorder, give up a motivation (with the "Can't be undone. Sure?" box), or lean on a Bond (1d6 off one Bond, Bonds at 1 greyed). Each plays its one straight line.
- **Disorders:** the six from the table, picked from the kind's pool at 50/50 as written. Flares check on the trigger tags a case sets (liars, echoes, Loud attacks, a death, a rest, a night scene, the case start), roll SAN, and last the scene. The flare line plays and the icon pulses. Sedatives and Sedate end it.
- **Adapted:** violence and helplessness marks, 3 to adapt, every Bond −1 and its line; the unnatural never adapts. Pips show in the Dossier.
- **0 SAN on the map:** the agent's straight line, and they leave the party (A6).
- **Motivation moments:** cases can mark a moment for a motivation type; it shows when any party member holds it, and acting on it gives that agent 1d4 SAN.
- **Luck:** a flat 50% roll helper, for overstepping and anything else the case calls pure chance.

**A5. The map menu** (Skills and menus → Map menu, Quality of life)

- Start on the map opens the bible's rows: **Party, Skills, Items, Case file, Log, Settings, Save**, in the navy list-box style. The Dev-only **Dev: finish case** row stays just above the last row on Dev builds.
- **Case file:** a Next line with the current goal at the top, each clue found with a one-line note, the overstepping step, and a Rules page (every status, item icon and threat skull).
- **Log:** the last 30 or so dialog boxes, reread in the Lantern Bust look.
- **Settings:** one toggle, Fast battles (used from Part B).
- **Save:** saves to the one slot; autosaves stay.
- **Last time:** loading a save opens one box with where you were and the Case file's Next goal.
- **Talked out** "…" over townsfolk with nothing new, and **dim used hotspots** (grey A bubble), both held from spec 005.

**A6. Losing an agent off the battlefield** (Systems → Losing an agent)

- 0 SAN on the map or in a cutscene plays the line and the agent leaves. At the next area change, Big Hat offers 3 ready-made recruits (one shares the lost agent's profession) or the creator. Recruits bring their starting kit only; case items pass to the lead. The arrival is one short beat (Big Hat's message, the recruit's first line), written per profession.
- Claude designs the 18 recruits (one per profession, built like template agents) without review. They're generic, not story, so they live in `strings.js`.
- The funeral, the memorial list and Big Hat's send-off line are **Demo 6**, with the debrief. Until then the lost agent is saved to `bl.memorial` so Demo 6 can show them.

**A7. Part A's stand-ins**

- Today's case keeps its story. Where it has hotspots, wire them to the new A menu with the options they already have (Look and any existing choice), and turn today's `sanCheck` calls into tiered horrors that match their old sizes. No new story content: that's Part C.
- Battles still use the old system until Part B, but they read and change the agents' new items, statuses and SAN.

### Part B: combat (To do: Demo 5 part B)

The battle rebuilt under the Combat tab. Today's case enemies get stand-in cards at the bible's tiers, so the case plays start to finish; Part C replaces them with the case's real enemy cards.

**B1. Layout** (Combat → Basics; Art → Light and mood; `studio-bible/ui.md`, Battle screen)

- Build from the approved combat mockup: the [Combat mockup canvas](https://claude.ai/artifact/4hpNdAF9Z95xSGEeKuT7zt), "Battle in the GBA shell" artboard (code in the Project files as `claude/combat-mockup-shell.html`). Head-on, enemies at the top facing you, the three agents along the bottom seen from behind, waist up, inside the shell with the D-pad shown, room for HP and SAN.
- Turn order: a column of small faces down the left edge showing the next few turns.
- Enemy HP bars under each sprite, no numbers, until Identify (rest of the case) or Spot weak point (rest of the fight) shows exact HP.
- Background: a still image drawn from the map spot where the fight started.
- The result line for each roll: `FIREARMS 62% · rolled 41 · HIT`. No dice animation. Fast battles speeds animations and result lines.

**B2. Rules** (Combat → Basics, Combat numbers, Battle moves, Status moves, Enemies and difficulty)

- DEX order, highest first, ties to agents. Search's On guard: enemies never take the first turn.
- **Command menu:** one row, Fight, Skills, Items, Guard. Fight is free with the equipped weapon (Fight floor 30%). Skills lists the agent's battle unlocks and status moves at their tiers and WP costs (1/2/3), greyed when WP is short. Items uses only what that agent carries; picking the other weapon swaps and ends the turn. Guard: Defend, Brace, Retch, Flee (roamers only).
- Crits on 01 or doubles that hit (double damage, weapon extras); fumbles on 100 or doubles that miss (a miss with a bad-luck line, WP still spent). Enemies crit and fumble the same way.
- Every Battle move, Status move, the other skills' battle costs, every item, armor, throwables and the STR bonus, exactly as written.
- **Statuses** in battle per the Statuses table and Combat numbers (ticks of 1 for agents, 2 for enemies). Resistances come from each enemy's card.
- **Enemy cards** as data: HP, DEX, attack %, damage, 1–2 special moves, resists, weakness (shown by Identify), threat skulls, horror on sight (tier and kind). Targeting leans toward whoever hurt it last; Downed agents aren't targeted.
- **Horror on sight:** an unnatural enemy's first appearance calls a SAN roll for all three, with the brace prompt from A4.
- **Flee:** roamer fights only, the party's lowest Athletics (Downed agents aside); success ends the fight with no rewards.
- **0 HP:** Downed, bleeds out after 3 of their own turns unless Revived; the card shows "2 turns left". If the fight ends first they survive at 1 HP. Bleeding out is death, for good.
- **Lasting injuries:** after the fight, every agent Downed during it rolls CON × 5%, then 1d12 plus the stacking modifiers on the table. Minor, Rehab and Permanent tags and penalties show on the Dossier; a Grave injury is a Disturbing violence SAN roll; Career-ending works like a loss, marked Retired.
- **0 SAN in a fight:** the agent snaps (25% each: hurt themselves, a random ally, a random enemy, nothing) and can be targeted by the others; whoever Downs them makes a Severe violence roll. They leave when the fight ends.
- **Disorder flares** in battle on their triggers (PTSD on the first Loud attack, Phobia on its subject).
- Quality of life: battle cursor memory, odds when targeting (to-hit with every modifier and the weapon's dice), auto-target when one enemy is left, status info on tap.
- **Game over** if the whole team falls, as today: build a new team, the case reopens, the season keeps its progress. Briefings and cutscenes already seen can be skipped with B.

**B3. Art** (Art → Direction, Townsfolk and monsters, Faces and sprites)

- Big hand-drawn battle sprites for every enemy the case fights, with the light rim (battle sprites get it), uncanny before gory. Part B draws today's roster (Crowling, Husk Scout, Bale Hound, Long Man, the Volunteer, the Gleaner), starting from the Asset Library's Demo 5 drafts (Husk Scout, Gleaner, battle sprites). If Part C's case design cuts or adds an enemy, Part C draws it.
- Agents from behind, waist up, built from each agent's creator parts (hair, outfit), so every custom agent looks like themselves.
- The Gleaner gets a 64 × 64 portrait if it speaks in the case (Monster faces: monsters that talk get one).
- File every new piece on the Asset Library's Still Harvest page (agents' battle backs on the core page), with its code.

**B4. Shared engine** (`studio-bible/studio.md`, Shared engine; studio `CLAUDE.md`)

- Anything another game could use goes in `engine/`: the battle screen frame (layout inside the shell, the turn-order column, enemy HP bars, the one-row command box, the result line) and the percentile roll helper with crits and fumbles. Each game supplies its own rules, colors and words.
- Black Lantern's own rules (WP, SAN, the move lists, injuries) stay in the game.
- Rushlight doesn't load the new parts yet, so its `npm run check` must still pass untouched.

### Part C: the story (To do: Demo 5 part C)

Still Harvest rewritten under the new rules, from its private case file.

**C1. Write the case file first** (Story → Adding a new case, steps 4–5)

- In `claude/cases/still-harvest.md` (Project files, never the repo): the twist and internal logic, the maps' hotspots, clue IDs, the choices that matter, the 8–10 skills the case supports, 1–2 motivation moments for different types, every horror's tier and kind with the SAN budget check, enemy and boss cards, the boss's phases and weakening choice, and the endings.
- Keep the case's frame: Marrow Creek during the Harvest Lantern Walk, the five townsfolk, the town and maze maps from Demo 4, Big Hat's donut-shop briefing. The case keeps its seven steps (Story → Demo case) as its spine, and the writing may change anything inside them that the new rules call for. A case "can break the pattern on purpose" (Story), so the case file may, but should say so in the changelog in plain terms.
- Maps: keep Demo 4's layout. Small additions the story needs (a new hotspot, a Lantern Box, a roamer path, a door) are fine. Moving buildings is not: ask Keegan first.

**C2. The text block** (Tech → Where text lives; Voice)

- Every line of the case moves into the `TEXT` block at the top of `cases/still-harvest.js`; scripts refer to lines by key. Menu words, items and names stay in `strings.js`.
- Written in Keegan's voice (Voice): one thought per box, 3 short lines at most, the setup ends a box and the punch opens the next, clues hide inside what people want to talk about.
- The case card's hook (spec 004) is a teaser and stays unless the new story makes it untrue.

**C3. Investigation** (Systems → Gameplay loop, Clues, Deduction; Skills and menus → Skill choices)

- Clues come mostly from skill options at hotspots and in talk (A2), across the 8–10 skills the case supports, so every team template can make progress and swapping the lead matters. Each needed clue has at least two ways to get it, so no team is stuck.
- Clue style: threshold plus bonus, as today's "5 clues, 3 needed" (some are needed to move on; extras weaken the boss, add intel or open debrief options), unless the case file picks clues as keys.
- At least one deduction, mapped to clue IDs. A wrong answer costs SAN, time or a better ending, never progress.
- Every clue shows in the Case file with its one-line note, and the Next line always says what to do.

**C4. Fights** (Systems → Gameplay loop; Combat → Enemies and difficulty, Bosses)

- **No random encounters.** Today's `G.enc` step counter and encounter tables go.
- **2–3 placed story fights plus the boss.** The Volunteer stays a story fight unless the case file changes it.
- **0–2 danger zones**, likely in the maze. Roamers walk them in plain sight with threat skulls showing, each guarding something (a clue, a victim, a shortcut, a stash). Fight, sneak past with a roll, or go around. Loud actions nearby draw them. Loot drops 20% of the time from the case's loot table of 4–6 items, always when the drop is story-related.
- Fight sizes and lengths by the Combat numbers: roamer fights 10–18 enemy HP in all (2–3 rounds), story fights 20–35 (3–5 rounds).
- **The Gleaner**, rebuilt: 60 HP, −8 per rescued victim (36 with all three), boss-tier attack and damage, at least one weakness Identify can find, phases from the case file, 8–12 rounds against a careful party. Other weakening choices allowed up to 40% off in all.
- **Boss tuning check** before Part C ships (Bosses): run the Gleaner against a mid-level team template; a careful party wins with at most one agent Downed, a party that skipped the case's choices can lose. Put the numbers in the changelog.

**C5. Choices, branches and the clock** (Systems → Gameplay loop; Skills and menus → Overstepping)

- Choices mostly branch and rejoin. Each is remembered for the boss and the debrief (saved in the checkpoint).
- **Overstepping:** the case file sets open or quiet case and marks which choices overstep, with how public each is. Each calls the Luck roll; failures climb the step, play the climb line and show in the Case file. Steps act as the table says. Federal agents is in scope if the case can reach it; its "worst ending" is an ending label for Demo 6.
- **Motivation moments:** 1–2, for different motivation types, each with a real cost (time, risk, a clue or a better route).
- **Time of day:** story beats can turn the town to night (`light` per map, spec 005, step 2). If they do, the case file says which townsfolk change at night and how (Art → Townsfolk at night), and Part C draws them.
- **Healing:** a full rest at a few story safe spots (HP and WP refill, Sleep disorder triggers), plus meds and First Aid.
- **Items in the world:** 0–2 Lantern Boxes with 2–3 catalog items each, hotspot items for Search's Sweep, and any case-only items (pin marker). Requisition at the briefing: each agent may roll Bureaucracy once for one catalog item (Where items come from).

**C6. The ending, held for Demo 6**

- The case ends with an **ending label** (for example `clean`, `costly`, `worst`; the case file names them) plus the facts Demo 6's debrief needs: clues found, victims saved, SAN lost per agent, case-only items, choices made, overstepping step, failed skill tries, and anyone lost. Save it with the case's state in `bl.season` and the checkpoint.
- Until Demo 6, a short stand-in debrief plays: Big Hat's few lines and today's cover-story question, then the case is stamped CLOSED. No skill gains, evidence sort or home scenes yet.

### Saves (all parts) (Tech → Saving; `studio-bible/saves.md`)

- Each part that changes what a save holds adds its own upgrade step and raises the version by one (Part A to 5, and so on). Old steps are never changed. Add real test saves from each part's build to `tools/test-saves/`.
- **New things to save:** per-agent weapons and item slots, the backpack (`bl.party`), statuses, Breaking Point, disorders and Adapted marks (on each agent, so they reach `bl.roster`), failed skill tries this case, lasting injuries (Part B), lost agents (`bl.memorial`), case flags, choices and the ending label (Part C).
- **Flagged for Keegan, Part C: a game paused mid-case in the old story can't land in the new story's middle.** The upgrade step keeps the team, roster and season, and restarts Still Harvest from the briefing with one line saying the case was rewritten. Nothing else is lost.
- Old roster agents get their profession's kit when they next start a case.

### Left out on purpose

| Piece | Now or later |
| --- | --- |
| The debrief, bagging or hiding evidence, cover stories with skill rolls, skill gains | **Demo 6** |
| The funeral, memorial list on the board, Big Hat's send-off line | **Demo 6** |
| Home scenes and personal arc beats | **Later**, after Demo 6 (no To do item yet) |
| Sabbatical, Therapy, Special Training | With home scenes |
| Agency cases, season length, unlocks | **Later**, from the secret arc file |
| Party size 3 vs 4 | After the Still Harvest playtest (its own To do) |
| New Shared Shelf pieces | Only after Keegan approves a flagged candidate |
| Rushlight using the new battle frame | **Later**, in a Rushlight spec |

### Screen sizes

Everything fits with nothing cut off at 375 × 667, 375 × 550 and 320 × 480 (Tech → Screen and controls; `studio-bible/controls.md`). The battle at 320 × 480 keeps all three agents' HP and SAN, the turn column and the command row on screen. Item rows and their detail box fit at every size.

## Must stay true

- After every part, Still Harvest plays start to finish, and the case board, party menu and Select work as before.
- Old saves keep opening, every test save included.
- Walking speed and the Demo 4 look are unchanged.
- Nothing a player could only learn by playing (who, why, what the twist is) appears in this spec, the changelog, the bible or a commit message.
- Every system Demo 5 adds has a stake in Still Harvest. If a rule never comes up in the case, it still works, but the changelog says it went untested in play.

## Bible notes for the Designer (no change made here)

- Story → Demo case, step 4 still says the maze has "random encounters". Systems → Gameplay loop (set Nov 18) says no random encounters, and the To do asks for fewer but harder fights, so this spec follows the Gameplay loop. A separate PR rewords step 4.

## Revision after the demo playtest (Nov 23, 2026)

Keegan's note: "In the maze, it's impossible to actually do everything because you have to go to the middle where Gleaner is and the fight starts automatically." And: "The maze should have a route to get the scarecrows that doesn't go to Gleaner."

What to change in the built case (Demo 5 part C):

- **A route to the victims that skips the clearing.** Rework the maze's paths so all three scarecrow victims, the danger zone, the Lantern Box and the lore note can be reached without stepping into the Gleaner's clearing. The clearing becomes a dead end you enter on purpose, not a crossroads. Keep the maze's size and look (Demo 4 art); move hedges and openings only.
- **Going in is a choice.** The tile into the clearing shows a short line and a choice: go in, or not yet. Not yet steps the lead back one tile. Going in starts the boss fight as today (committed, no fleeing).
- **Nothing else changes:** the Gleaner's numbers, the victims' −8 each and the endings stay as built. A test save inside the maze must still open; if a saved spot is now a hedge, the lead moves to the nearest open tile.
- Bible: Systems → Gameplay loop (The boss waits for you) and Story → Demo case, step 5.

