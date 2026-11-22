# Spec 003: Slice part A, a new run

Status: draft for Keegan's review · Written 2026-11-22 by the Game Designer · Game: Rushlight · To do: Development readiness, Ready 4 of 5, Part A

## In plain words

This is the first part of the vertical slice. It builds everything from the title screen to the moment the company is signed on:

- the title screen (New run, Continue, Import);
- the run seed, random or typed;
- Pick a company: the 6 company templates and Blank, three seat cards, and Keep, Reroll, Tweak or Rebuild on each seat;
- the full creator for a Blank company or a Rebuild, for the 6 slice species and all 13 trades;
- each merc's starting kit, and the company's 30 coin and 9 rations;
- the move from Black Lantern's save keys to Rushlight's own (`rl.run`, `rl.ledger`, `rl.draft`), with a save version number, and the dice stream saved in the run;
- the save code (Export and Import).

When it's done you can start a run, sign on three mercs, look at them in the party menu, close the game, reopen it and pick up the same company. There's nowhere to go yet: the company stands in a stand-in town until Parts B and C build the Withy March and its towns. No fights are added, so this part has no tuning check.

Black Lantern's agent creator, professions, specialties and items (`creator.js`, `strings.js`) go, because this replaces them.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `studio-bible/saves.md` | Saves; Seeds | One slot, autosave, save version number with upgrade steps and a backup first, test-saves folder, save code; one seed per run, dice from a saved second stream, a typed seed starts a run |
| `studio-bible/ui.md` | Party menu | The shared party card list (built in spec 002) |
| `studio-bible/controls.md` | Buttons | L/R move between creator steps; Select cycles the lead |
| `games/rushlight/bible.md` | Mercenaries and items → Species; Making the company; Trades; Company templates; Starting kit; Items; Item list | Everything a merc is made of and starts with |
| `games/rushlight/bible.md` | Systems → The run loop (Start); Motivations; Bonds; Progression | 30 coin and 9 rations; 2 motivations, one Main; kin Bond at CHA, comrade Bonds at 1; level 1 |
| `games/rushlight/bible.md` | Carried rules → Stats, Luck and the Hunch; Sanity; Combat → Numbers | HP, WP, SAN and Breaking Point from stats; Luck 50%; skill bases |
| `games/rushlight/bible.md` | Skills and menus → Skill list | The 18 skills |
| `games/rushlight/bible.md` | Naming | Given names from the NM- pools, never repeating in a run; species never in a name |
| `games/rushlight/bible.md` | Art → Faces; Pick a company (Mockup 6); Species sheet | Grounded animal faces with a species head part; the approved Pick a company layout; the approved species art |
| `games/rushlight/bible.md` | Tech → Seeds; Saving | Seed on the Muster roll; dice position saved; the three keys and what each holds; Export and Import |
| Spec 002 | Seeded dice | The shared seeded stream and `StudioRoll` drawing from it. Part A is built after spec 002 |

## What is built today

Checked Nov 22 by reading Rushlight's own code files only.

- `creator.js` is still Black Lantern's agent creator (profession, specialty, stats, skills, bonds, appearance, identity, dossier), with human faces (skin, hair, eyes) and a roster of saved agents.
- Saves use Black Lantern's set: `rl.draft` (an agent in the creator), `rl.roster` (saved agents) and `rl.game` (a checkpoint). There's no save version number. On the launcher's Dev build the keys are `dev.rl.*`, through `RL.key`.
- `engine.js` has a seeded random maker (`mulberry`). Spec 002 turns it into the shared seeded stream.
- `content/stub.js` boots the engine with no case and ends at the title.

## What to build

### 1. Title screen

RUSHLIGHT, then three rows:

- **New run.** Opens the seed box (below), then Pick a company.
- **Continue.** Only when `rl.run` holds a run. Opens the run where it was saved.
- **Import.** Pastes a save code (see 7).

If `rl.draft` holds a company in progress, New run asks once: "Pick up the company you were making?" Yes opens it where it was left. No clears it and starts fresh.

A New run while a run is saved asks once: "This ends the run you have. The ledger stays." A run that ends this way counts as abandoned: its mercs go into the ledger as "left the company", like a wipe without the death screen. (The ledger screen itself is Part E. Until then, the build only writes the entry.)

### 2. The run seed

- A seed looks like the mockup's: four digits, a dash and a letter, `4471-K`. That's 260,000 seeds, easy to read out and type.
- New run offers **Random seed** (the default, already filled in) or **Type a seed**, which takes the four digits and the letter. A bad seed shows "Four numbers and a letter, like 4471-K" and doesn't start.
- The seed shows at top right on Pick a company and on every Muster roll, and later on the death screen (Part E).
- **What comes from the seed.** The run seed makes three streams, each saved by position:
  - the **world** stream (region n uses the run seed plus n, Parts B to D);
  - the **muster** stream: every merc rolled on Pick a company and in the creator, and every reroll. So the same seed always offers the same first company, and the same rerolls in the same order;
  - the **dice** stream (spec 002), for every roll once the run starts.
- The muster stream's position is saved in `rl.draft`, so closing the game mid-pick and reopening gives the same next reroll.

### 3. Pick a company

Built to the approved mockup (`mockups/16-company.png`, Asset Library rushlight-mockups-company-v1).

- **The list:** the 6 templates and Blank company, each with its three trades in short form, the picked one in Tallow. Under the list, the picked company's line from the Text Library (CO- rows).
- **Three seat cards**, in seat order. Each has a 40 px portrait head, the given name, species and trade, the three highest skills, the Main motivation, the kin's name and type, and the one-line backstory.
- **Picking a template** rolls three new mercs for its trades (see 4). Picking another template and coming back rolls new mercs again: a template never remembers its last three.
- **A on a seat** opens Keep, Reroll, Tweak, Rebuild. B closes it.
  - **Keep** marks the seat done (a Tallow tick on the card).
  - **Reroll** makes a new merc for the same trade. Unlimited.
  - **Tweak** opens a short list: name, species, face, backstory, kin name, motivations. Changing species re-applies the species' stat changes, size and trait to the same rolled stats, and HP, SAN and the rest follow.
  - **Rebuild** opens the full creator for that seat with the trade locked.
- **Blank company** shows three empty seats. A on one opens the full creator with free trade choice. Two seats may share a trade.
- **START** is greyed until all three seats are filled. On START the Muster roll for the whole company shows (all three, one page each, L/R to flip), then **Sign them on** starts the run. B goes back to Pick a company.
- The seat in seat 1 is the lead to begin with. Select changes the lead later (spec 002).

### 4. Rolling a merc (templates and Reroll)

All from the bible's Rolling a merc, drawn from the muster stream:

1. **Stats:** 4d6 drop the lowest, six times. Highest to the trade's first key stat, second highest to its second key stat, the other four dealt at random.
2. **Species:** one of the 6 slice species at random (mouse, rat, hare, hedgehog, badger, fox). Its +2 and −2 apply after the deal, kept between 3 and 18.
3. **Skills:** bases, then the trade (2 strong at 50%, 2 backup at 30%, or 40% for Melee, Dodge and Athletics), then the 8 picks: +20% to each of the trade's 4 skills, +20% to one backup at random, then 3 odd hobbies (+20% each to 3 different skills outside the trade). Cap 80%. Species skill changes (Small +10% Stealth, Tall −10% Stealth, the hare's +10% Athletics) apply last and may pass 80%, since they aren't picks.
4. **Identity:** a given name from the NM-GIVEN pool not used yet this run, a face from the face parts (see 6), and a backstory from the merc's trade (BK- rows, 2 per trade).
5. **Kin:** a type at random (Mate, Child, Parent, Sibling) and a given name from the same pool. Kin Bond = CHA.
6. **Motivations:** 2 different ones from the 9, one marked Main.

### 5. The full creator

The bible's 7 steps, one screen each, in the shell's list-box style (no mockup: the bible's Mockup 6 note says the other slice screens are reviewed in play). L/R move between steps; A picks; B backs out of a list.

1. **Trade:** the 13 trades, each with its 4 skills and key stats. Locked on a Rebuild.
2. **Stats:** Roll (4d6 drop the lowest, with one full reroll) or Point buy (72 points, each stat 3 to 18). Both shown before species changes, with the species' changes listed under them.
3. **Skills:** 8 picks of +20%, cap 80%, into any skill. A picked skill can be unpicked.
4. **Identity:** name (typed, or Roll for one from the pool), species (the 6), face (see 6), backstory (Roll among the trade's lines, or type one, up to the card's one line). The species card shows its size, stat changes and trait.
5. **Kin Bond:** type, then name (typed or rolled). Shows the starting score, which is CHA.
6. **Motivations:** pick 2 of the 9, then mark one Main.
7. **Muster roll:** the whole merc on one page (below), then **Sign on**, which fills the seat.

The creator saves into `rl.draft` on every change, so closing the game mid-merc loses nothing.

### 6. Faces

Each portrait is the species head from the approved species sheet (Asset Library rushlight-sprites-species-v1) plus face parts. **The parts list waits on Keegan's pick on the face parts card** (Proposed for the bible, below). Until it's set, build the species head with coat shade as the only part.

The 40 px head on the seat card is the same portrait scaled down; the map sprite and the battle back view use the merc's coat shade too, so the merc looks the same everywhere.

### 7. What a merc holds

Worked out once when signed on, then saved:

- Level 1, 0 XP.
- **HP** = (STR + CON) ÷ 2, rounded up, then +2 for Tall or −2 for Small. **WP** = POW. **SAN** = POW × 5. **Breaking Point** = SAN − POW. Luck is a flat 50%.
- The 18 skills, the species trait, size and stat changes, and the trade.
- Kin: type, name and Bond score. Comrade Bonds: 1 with each other merc in the company.
- 2 motivations, one Main. Adapted marks at 0. No disorders, no statuses, no nickname.
- **Gear:** the trade's weapon in WPN 1, a knife in WPN 2 (the Scribe's knife goes in WPN 1 and WPN 2 is empty), the trade's armor in BODY and HEAD, and the kit item in a slot with its uses. All gear starts Sound.

The company starts with a purse of 30 gr and 9 rations in the shared pack, and nothing else in it.

**The Muster roll** (the creator's last step, and the START review) shows on one page: name, species, trade, size and trait; the six stats; HP, WP, SAN, Breaking Point; every skill above its base; kin and Bond; motivations with Main marked; gear; backstory; and the run seed in the corner.

### 8. Saves

The bible's three keys, plus a version number, all through `RL.key` so the Dev build keeps `dev.rl.*`:

| Key | Holds in Part A | Filled in later parts |
| --- | --- | --- |
| `rl.version` | `1` | Raised by one each time a save changes shape |
| `rl.run` | Seed; world, muster and dice stream positions; the 3 mercs (everything in 7); lead index; purse; pack; the stand-in town and the company's tile | Region state, contract in progress (B to D) |
| `rl.ledger` | An empty bestiary and ledger, made on the first run if missing; abandoned runs' mercs (see 1) | Every kill, death and nickname (D, E) |
| `rl.draft` | Pick a company in progress: seed, muster position, template, the three seats, the open creator step | Nothing more |

- **Upgrade step 0 → 1** (no version stored): copy every old `rl.*` key into `rl.backup.v0` as one block, then delete `rl.roster` and `rl.game`, and delete `rl.draft` if it holds a Black Lantern agent (it has `prof`) rather than a company. These are Black Lantern-shaped test data from the setup copy, and none is a real run, so nothing playable is lost. Set `rl.version` to 1.
- Autosave on every screen change, as Tech says. Deaths stick: nothing here lets a player reload a roll.
- Put a save from the current Dev build (version 0) and one from the finished Part A (version 1) in `src/test-saves/`, and the check opens both.

### 9. The save code

- **Start → Export** on the map shows a text code holding `rl.version`, `rl.run` and `rl.ledger`, with a Copy row.
- **Title → Import** takes a pasted code. A good one asks "Replace your run and ledger with this one?" and loads it, running any upgrade steps first. A bad one says "That code doesn't read" and changes nothing.
- The launcher's own save export (Settings) keeps working alongside it.

### 10. After Sign them on

Until Parts B and C exist, Sign them on drops the company into a **stand-in town**: one small walkable street, built from the shell's tiles, with the three mercs following the lead. Start opens the map menu: Party (the shared card list from spec 002, now with real mercs), Items (gear and pack, read-only), Export, and Title. Part C replaces the stand-in with Harrowford.

### Wiring

- `strings.js` drops Black Lantern's professions, specialties and items and gets Rushlight's: species, trades, company templates, the item list's starting items, motivations and the skill list, as data.
- Lines (company lines, backstories, names) come from the Text Library by ID. New Draft rows added for this spec: CO-FREE, CO-HUNT, CO-THIEF, CO-HEDGE, CO-POWDER, CO-CAMP, CO-BLANK, and BK-HALB-1 to BK-TINK-2 (2 per trade, 26 rows). Drafts are placeholders until Ready 5.
- Add `RLG.newRun(seed)`, which the checks use for new runs on 3 seeds (`src/CLAUDE.md`, rule 5).
- Update `src/CLAUDE.md`: the parts list, and "Still Black Lantern's" (the creator, strings and save keys are no longer Black Lantern's).

## Done when

- `npm run check` passes in Rushlight at 320 × 480, 375 × 550 and 375 × 667.
- New runs on 3 typed seeds each sign on a company with no errors. The same seed offers the same first company and the same next 5 rerolls, every time.
- For each of the 6 templates on 3 seeds, every rolled merc has stats from 3 to 18, no skill above 80% except by species, the trade's strong skills at 70%, the right starting kit, and a name not used elsewhere in the run.
- A Blank company made in the full creator signs on, using every step, by D-pad and by tap.
- Closing mid-creator and reopening picks up the same step. Closing on the stand-in town and reopening loads the same company on the same tile.
- The version 0 test save opens, is backed up to `rl.backup.v0`, and lands on the title with no run. The version 1 test save opens with its company.
- Export and then Import of the same code gives the same run.
- `changelog.md` has a dated entry: what was built, placeholders left (the stand-in town, faces if the parts list isn't set, Draft lines), and any deviations. Tick Part A in the bible.

## Not in this spec

- The Withy March, travel and rations used up (Part B); real towns, hiring and shops (Part C); fights, XP and level picks (Part D); the ledger and death screens (Part E).
- The other 5 species (vole, squirrel, stoat, otter, beaver): first release, not the slice.
- Using species traits in play. They're stored and shown here, and each takes effect in the part that has its moment (Light sleeper in Part B's night attacks, Spines in Part D's fights, and so on).
- Hires from town pools (Part C). They use the same rolling, with fewer picks.

## Conflicts found

None. Claude's calls inside the bible's rules, for Keegan to change in review:

- **Seed format** `4471-K`, taken from the approved mockup.
- **The muster stream:** the starting company comes from the seed, so a typed seed is a true rematch.
- **A new run over a saved one** asks first and files the old mercs as having left the company.
- **Species skill changes** may pass the creator's 80% cap, since they aren't picks.
- **Tweaking species** keeps the rolled stats and re-applies the new species' changes.

## Proposed for the bible

- **Art → Faces:** the slice's face parts, from Keegan's pick on the card (pending). Added to the bible in this pull request once picked.

## Open questions for the Developer to bring back (don't decide them in code)

- If the Text Library's NM-GIVEN pool (90 names) can't cover three mercs, their kin and unlimited rerolls without repeats, stop and say so. Don't add names in code. (A reroll's discarded names can go back in the pool.)
