# Spec 005: Slice part C, towns

Status: draft for Keegan's review · Written 2026-11-22 by the Game Designer · Game: Rushlight · To do: Development readiness, Ready 4 of 5, Part C

## In plain words

Part B gives the company the Withy March to walk, but its two towns are only stand-in cards. Part C builds the towns themselves, Harrowford and Saint Ebbe's:

- a walkable street in each, with townsfolk and their lines;
- the notice board and the two givers, and the slice's pool of 6 contracts, posted a few at a time;
- hiring from a town's pool when a seat is empty;
- the market, the smith, the apothecary, the barber-surgeon, the inn, the tavern with its rumors, the church, and the brothel;
- faction standing, and the Hue and cry with its crimes and ways to settle it.

When it's done, you can walk Harrowford's street, read the board, haggle with the guild master, take Pell's bounty, buy rope and bandages, have the smith mend a cracked jack, buy a rumor that shows a hidden road, and get Noticed for robbing refugees. Taking a contract shows its site on the map and puts it on the Contracts page. Doing the job (the site, the fight, the pay) is Part D.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/rushlight/bible.md` | To do → Vertical slice | The 6 jobs; hiring and the Hue and cry are in; the feud, war contracts, magic, bargainers, debt, the Crown's people, retiring and Quarters are out |
| `games/rushlight/bible.md` | World and contracts → Contracts; The slice's Withy March | Who offers work; board and giver pay; haggling; work runs out (a fixed pool, 3–4 posted); the slice's points |
| `games/rushlight/bible.md` | People jobs: the Withy March | Pell (board, VO-BOARD-2) and the wool buyer (the guild master, Town) |
| `games/rushlight/bible.md` | Creatures → First hand-made creatures; Creature batch 1 | The Noonwife and the Counter (hunts), Severa (beast job), the Withy Hag (false alarm, the guild's fee) |
| `games/rushlight/bible.md` | Factions and the law | The four factions, standing steps, favors, what Trusted, Sworn and Hated do; the Hue and cry, its steps, crimes, settling and fading |
| `games/rushlight/bible.md` | Cast → Givers and townsfolk | Giver archetypes per faction and giver quirks; townsfolk archetypes |
| `games/rushlight/bible.md` | Mercenaries and items → Hire pool; Hires; Items; Trophies | 2–4 mercs a town, refreshed after each contract; hires rolled with 2–3 bumps; no refills; what sells where |
| `games/rushlight/bible.md` | Systems → Money; Also for sale; Prices; Recovery → Town services; Camp and inn | Every price; inn, brothel and blessing each 1d4 SAN once per merc between contracts |
| `games/rushlight/bible.md` | Skills and menus → Skill unlocks; Reading; Map menu; Quality of life | Letters 40% literacy and the Writ; Persuade's Lean on them; Empathy's Read; Contracts page; Shops (better or worse arrows, Restock), Crime marks, Mend all, Sell all here |
| `games/rushlight/bible.md` | Art → Town street (rework 2); Street dressing; Notice board (Mockup 6) | The street layout, the town strip, the dialog box, dressing by town type; the board and the contract card |
| `games/rushlight/bible.md` | Voice; Naming | Town lines, the regional tic, names from the NM- pools |
| Specs 002–004 | Party; Seeded dice; Saves; the region map and point cards | What this part builds on and replaces |

## What is built today

After specs 002–004 are built: a signed-on company walking the slice's Withy March, travel, rations, camp and inn on a stand-in town card, road events, and `rl.run` at version 2. Towns are point cards with Rest at the inn, Sleep rough, Buy rations and Leave. The Hue and cry and faction rows on the map strip draw but do nothing. (Written before those builds; the Developer checks the code first.)

## What to build

### 1. The two streets

Each town is one walkable street at Wide scale, built to the approved Harrowford mockup (Asset Library rushlight-mockups-town-v1): the town strip on top (party heads with the lead in Tallow, the town's name and type, purse, day), house fronts across the top, only the lead walking, and the dialog box for anyone who talks. A at a door or stall opens that place as a list box over the street. B backs out.

| | Harrowford (river-crossing town) | Saint Ebbe's (monastery town) |
| --- | --- | --- |
| Arriving | TW-HARROW-1 | TW-EBBE-1 |
| Along the street | Notice board, market stalls (Hester's eel stall), the smith, the barber-surgeon, the inn (the Drowned Goose), the tavern, the chapel, the brothel, the reeve's door, the guild hall | Notice board, market stalls, the apothecary (the infirmarer's window), the guesthouse (the inn), an alehouse (the tavern), the priory church, the prior's gate, the reeve's door, the hiring corner by the well |
| Dressing | As the mockup: the pillory, a chalk plague cross, the handcart with a body | The priory wall and gate, monks in grey, a beggar at the gate, a gibbet outside the wall |
| Givers | The guild master (Town) | The prior (Church) |
| Hire pool | 3 mercs, any trades | 2 mercs, learned trades first (Friar, Scribe, Hedge-witch, Barber-surgeon) |

- Saint Ebbe's street has no art yet. Build it from the same tile and sprite kit as Harrowford's (premade check first), and file the new pieces in the Asset Library before the build uses them.
- **Townsfolk:** 3–5 on each street, from the townsfolk archetypes, at all three heights, drawn from the 6 slice species. Each says one line on A, from the Voice rows that fit (VO- barks, the March's regional tic from the RT- rows, SY- sayings, TX- texture). A townsperson with a line gets a name from the NM- pools; the rest stay nameless.
- **The inn and Sleep rough** move from Part B's point card to the inn door and a "Sleep rough" row on the street's Start menu. Buy rations moves to the market.
- The rest of the March's points keep Part B's cards until Part D builds their sites.

### 2. The contract pool

The slice's pool is the 6 jobs below. Fixed jobs, seeded order:

| Job | Shape | Where it's offered | Pays (region 1) | Site |
| --- | --- | --- | --- | --- |
| Pell the poacher | Bounty, short case | Harrowford board (VO-BOARD-2) | 40, +50% alive | The charcoal camp |
| The Withy Hag | False alarm, quick job | Harrowford board (CR-HAG-BOARD), posted for the guild | 25 | The osier causeway |
| The wool buyer | Escort, road job | Harrowford's guild master (PJ-WOOL-BOARD as his pitch) | 40, +25% giver | Harrowford to Saint Ebbe's |
| The Noonwife | Hunt | Saint Ebbe's prior | 60, +25% giver | Hollin |
| Severa the owl | Beast job, quick job | Saint Ebbe's board (CR-OWL-BOARD) | 25 | Sallow End |
| The Counter | Hunt | Saint Ebbe's board | 60 | Crookback |

- **Posting:** 4 jobs are up at the start, chosen by the seed with at least one at each town. When one is taken, the next in the seed's order goes up at its own town. With all 6 taken or done, the board shows only old bills and church notices, and the work has run out, as the bible says. The Hollow Monk isn't in the pool (Part E).
- **Taking:** a board job's card is Mockup 6's contract card: title and position, kind, shape and "board job, no haggling"; the bill's own words; WHERE (place, days, rations needed against carried); PAYS; XP (Part D's numbers; until then, "—"); THREAT (kind, level, skulls, "???" until known); MOMENT (any merc whose motivation is tagged). A takes it, B backs out.
- **Reading:** with nobody in the company at Letters 40%, a board card shows only the fee and the place, not the bill's words or the threat. Giver jobs are spoken, so they show in full.
- **A taken job** puts a wax seal on its site on the map, shows the site and its roads if unknown, and goes on the Contracts page with its Next line ("Go to the charcoal camp"). The company can hold any number of taken jobs.
- **Dropping a job** from the Contracts page: a board job goes back on the board, at no cost. A giver job dropped or failed costs 1 favor with that giver's faction (the bible's failed giver job).
- **Contract tags:** each of the 6 jobs carries 1–2 motivation tags. Claude's first draft: Pell (Money, Family), the Withy Hag (Find the truth), the wool buyer (Money, Duty), the Noonwife (Protect the innocent, Faith), Severa (Protect the innocent, Family), the Counter (Revenge, Curiosity). Part D plants the moments; this part shows the MOMENT row.

### 3. The givers

- **Harrowford's guild master** (Town archetype) and **Saint Ebbe's prior** (Church archetype). Each is named from the pools, with a portrait from the face parts. Their first line is GV-GUILD-1 or GV-PRIOR-1.
- **The giver card** shows name, archetype, faction and its standing step, any showing quirk, and the job.
- **Quirks:** each rolls one from Tight-fisted, Desperate, Pious and Grieving. Two-faced is left out of the slice, since there's no feud. Lying is left out too, since it changes a job's site and fights, which Part D builds fixed for the slice.
- **Haggling:** once per giver job, with Persuade (the merc with the best Persuade, odds shown). Pass: +25% on the fee. Fail: closed. Fumble: closed and −1 favor with the giver's faction. Tight-fisted haggles at −20%; Desperate pays +25% and won't haggle. The stoat and fox take −10% here (Distrusted).
- **Empathy's Read** (40%) on a giver shows a hidden quirk. None of the slice's quirks are hidden, so in the slice it reads "Nothing hidden". Build it anyway.
- **Wary** with a giver's faction: that giver offers no work and greys out.

### 4. Hiring

- **Only into an empty seat.** The company is always 3 (the bible: no reserve slot). A seat is empty after a death, a desertion or a 0 SAN loss. With 3 mercs, the hire corner shows its pool but greys the Hire rows ("No seat open").
- **The pool:** 2–4 mercs per town (the table above). Rolled from the world stream with the bible's hire rules: Rolling a merc, with 2–3 random +20% bumps in place of the 8 picks (the first to a strong skill, the second to a backup, a third, if rolled, an odd hobby). Each has a kin Bond, 2 motivations and a backstory, and a 1-in-6 chance of Weak-willed, hidden unless Empathy's Read is used on them.
- **Level:** region 1 hires are level 1. Fee 25 (15 + 10 × level).
- **Species:** the seed picks the Withy March's primary species from the 6. Half of each pool, rounded up, is that species.
- **Refreshed** after each finished contract (Part D raises the flag). Until then, it refreshes when a seat opens.
- **The hire card:** the same seat card as Pick a company, with the fee. A opens Hire (pays, fills the seat, comrade Bonds start at 1 with each merc), Read (Empathy, once per hire), and Back.
- **Weak-willed** now plays as the bible says: grumbles on the first unfed day, and from the third rolls Luck each day to stay, deserting with their own kit on a fail.

### 5. Shops and services

Every shop is a list box with the item's type icon, price, and better or worse arrows against what each merc has equipped. Buying puts an item in the shared pack. Each shop has **Restock** (the consumables used since the last market, at this shop's price) and **Sell** (half the buy price, Sell all here). Prices are the bible's region-1 prices. Wary with Town adds 25% at both towns' shops; Town Trusted takes 10% off at market.

| Place | Town | Sells or does |
| --- | --- | --- |
| Market | Both | Rations (1 gr), and every item whose Where from includes Market and is Common: Linen bandage, Willow-bark tea, Vinegar sponge, Chewing root, Fire pot, Rushlight bundle, Salt, Snare, Torch, Hatchet, Rope, Horn lantern, Hood, Buckler, Sling, Knife, Cudgel. Silver (dear) at Harrowford only |
| Smith | Harrowford | Caltrops, Manacles, Bodkin bolts, Repair kit, Crowbar, Padded jack, Mail shirt, Kettle hat, Mail coif, the shields, Arming sword, Mace, Halberd, Bearded axe, Flail, Crossbow, cold iron. **Mend:** 3 to lift Worn, 6 Cracked, 10 Broken, per step; Mend all with its total |
| Apothecary | Saint Ebbe's | Surgeon's roll, Theriac, Bitter tonic, Herb bundle, Smoke pot, Blade venom, Herb mask, and the drugs (Hemp smoke, Poppy syrup, Wakeleaf, Poppy tincture, Fire-root), under Drugs and Addiction |
| Barber-surgeon | Harrowford | 5 per merc to heal to full HP. Lasting injuries (30) come with Part D |
| Inn | Both | Part B's inn, now behind a door |
| Tavern | Both | Rumors, 3 gr (section 6). Ale or wine, 1 gr, as an item |
| Church | Both | A priest's blessing: 10 gr, 1d4 SAN once per merc between contracts. Indulgence: 20 gr, +1 Church favor. Holy water. Sell trophies (Part D). Half price at Church Trusted. Burial and masses come with Part E |
| Brothel | Harrowford | 5 gr: an off-screen scene, 1d4 SAN once per merc between contracts, a day passes, and a CON × 5 roll or Sickened |

- **Stock is endless** in the slice: a shop never runs out. Rare items (the hand cannon, plate pieces) aren't sold in either town.
- **Between contracts:** the inn's, brothel's and blessing's SAN each work once per merc until the next finished contract. Part D clears the flags. Until it's built, they clear when the company leaves a town for a contract site.

### 6. Rumors

- 3 gr at either tavern for the next rumor in the region's pool, read out as one line from the Text Library (RU- rows). Each is bought once in the run.
- **The pool**, in the seed's order: the true line for whichever road the seed hid (RU-ROAD-A or -B), RU-CAMP, RU-CAUSE, RU-SALLOW, RU-CROOK, RU-MONK, RU-LIE-1, RU-LIE-2.
- **True ones** show what they name on the map: the hidden road, or a site and its road. RU-MONK gives one of the Hollow Monk's signs to the Signs list (Part D shows it on the chart).
- **Lies** put a pencil ? on the chart by Hollin (RU-LIE-1) or up the river past Harrowford (RU-LIE-2), with a road of 1 day. Going there finds nothing (RU-NOTHING), costs the days and rations, and the ? is struck out. This is the bible's "the map can be wrong".
- Rumors cost nothing to the Hue and cry and are never crimes.

### 7. Faction standing

- All four factions start Neutral in region 1 with 0 favors, and show on the map strip as icon and word. The slice has no feud, so no Rust cross.
- **Favors:** 2 climb a step. A giver job done gives 1 (Part D pays it). An indulgence gives 1 Church favor. The bible's other favors in the slice: letting Pell go (+1 Outlaws, Part D), the Withy Hag's endings (Part D), returning the wool buyer's skim (Part D).
- **Offenses** drop a full step at once: a crime against that faction (a fight with the lord's men, killing a man-at-arms, robbing in a town), as the bible lists.
- **What each step does in the slice:** Wary (+25% prices with that faction, its givers give no work). Trusted and Sworn as the bible's table says, except what's out of the slice: there's no lord's giver yet, and the free Confession waits for Quarters. Hated per the table: the Lord's men attack on sight in his holdings (both towns count), Church Hated closes the church, Town Hated shuts both gates without a bribe or a Writ, Outlaws Hated doubles bandit road events.

### 8. The Hue and cry

Built as the bible sets it, with the slice's crimes.

- **Crimes in the slice:** robbing travelers (Rob them, now offered on Part B's refugees and wounded traveler), fighting the lord's man at a toll (now offered on the lord's toll), any fight inside a town, and Part D's crimes (killing a yielded enemy, keeping the wool buyer's skim, taking the smugglers' cut). Each shows a crime mark and its Luck odds after the witness penalty, as Crime marks does.
- **Rob them:** a fight-free choice that takes 1d6 gr from refugees or 2d6 gr from a wounded traveler, and is a crime with someone watching (−20%).
- **The roll:** Luck; no penalty unseen, −20% seen, −40% in a town or on a busy road (the two main roads count as busy). Pass: nothing. Fail: up one step, with its line (HC- rows).
- **The steps** as the bible's table. In the slice, Wanted's "reeve turns up for one scene" is a dialog at the next town's reeve's door that ends in Settle or a fight with 2 men-at-arms; Persuade's Lean on them (75%) can stop it. Outlawed's bounty hunters join the road events as 2 men-at-arms (a new row of 10 in the road event table, replacing Storm 81–90 while Outlawed).
- **Settling** at the reeve's door, in a town not shut to the company: blood-money (15 to clear Noticed, 30 Wanted, 45 Outlawed; no roll), a Writ (Letters 75%, once per rest, a Letters roll; a fumble climbs one step), or Talk to the reeve (Persuade; a fail climbs one step). Each brings it down one step, with HC-SETTLE.
- **Fading:** a contract finished with no climb drops it one step (Part D raises the flag).
- **On screen:** the four pips on the map strip, the step named, and the climb's line.

### 9. Saves

A change to what `rl.run` holds, so **upgrade step 2 → 3**:

- `rl.run` gains: each town's board (what's posted, taken or done), the pool's order and position, taken contracts and their Next lines, each giver (name, face, quirk, haggled or not), each town's hire pool, townsfolk names, rumors bought and lie points found, faction steps and favors, the Hue and cry step, and the between-contracts flags for the blessing and brothel.
- **Step 2 → 3:** fills all of these from the run's seed as if the company had just arrived, keeps everything else, and sets `rl.version` to 3.
- Add a version 3 save to `src/test-saves/` with two taken contracts and the Hue and cry at Noticed.

## The tuning check

This part adds two fights, both only from the Hue and cry: the reeve's men at Wanted and the bounty hunters at Outlawed, each 2 men-at-arms (HP 33, DEX 10, 55%, 1d4, armor 1; Hold the line; Call the watch in town).

- Two men-at-arms soak more than they hit: about 2 HP a round to the company, but 66 HP behind armor, so about 6–8 rounds. Expect the company to lose 12–16 HP and no merc to go down. They're there to make Wanted cost time and HP, not to kill a run.
- **Pass:** over 20 simulated fights on 3 seeds with the Free Company, no merc goes down in more than 2 fights, and no fight runs past 12 rounds. If it misses, stop and bring the numbers back.

## Done when

- `npm run check` passes at 320 × 480, 375 × 550 and 375 × 667.
- New runs on 3 seeds: both streets load, 4 jobs are posted with at least 1 in each town, every job can be taken, and after all 6 are taken the boards show no work.
- Every shop buys and sells at the bible's prices, with Wary and Trusted applied, and the smith's Mend all charges the right total.
- Haggling: pass, fail and fumble each do what section 3 says. The Letters 40% rule hides a board card's words and threat.
- A hire fills an empty seat and is greyed with a full company. Weak-willed desertion works on a hungry hire.
- Every rumor can be bought; true ones show what they name; lies show a ? that comes to nothing.
- Every crime shows its mark and odds; the Hue and cry climbs, fights at Wanted and Outlawed open, and each way of settling works.
- The version 2 test save upgrades to version 3; the version 3 save loads with its taken contracts and Hue and cry.
- The tuning check passes.
- `changelog.md` has a dated entry: what was built, placeholders left (XP, sites, trophies, favors from job endings, the between-contracts flags), and any deviations. Tick Part C in the bible.

## Not in this spec

- Contract sites, their fights, the pay screen, XP, trophies, loot, motivation moments and the bestiary (Part D).
- The Hollow Monk, burial and masses, the ledger and death screens (Part E).
- The feud and war contracts, the lord's giver, Two-faced and Lying givers, magic and the witch, bargainers, debt and collectors, retiring, Quarters and Confession, mules and carts, gambling, the bathhouse.

## Conflicts found

None. Claude's calls inside the bible's rules, for Keegan to change in review:

- **Which town offers which job**, who the two givers are, and the jobs' motivation tags.
- **What each town has**, and the slice's shop stock (the bible says stock varies by town type but doesn't list it).
- **Hiring only into an empty seat**, from the bible's "no reserve slot".
- **Any number of taken jobs**, and dropping a board job is free.
- **Rob them** takes 1d6 or 2d6 gr; Outlawed's bounty hunters are 2 men-at-arms; Wanted's reeve scene ends in Settle or a fight.
- **Weak-willed** is 1 in 6 among hires.
- **Rumor pool** of 9 (7 true, 2 lies).

## Proposed for the bible

Added to the bible in this pull request, under The slice's Withy March: which town offers which job, the two givers, and what each town has.

## Open questions for the Developer to bring back (don't decide them in code)

- If Saint Ebbe's street can't be built from Harrowford's kit without new art beyond a few pieces (the priory wall, the gate, monks), stop and say what's missing.
- If the tuning check misses, bring the numbers back.

New Draft rows in the Text Library for this spec: RU-ROAD-A, RU-ROAD-B, RU-CAMP, RU-CAUSE, RU-SALLOW, RU-CROOK, RU-MONK, RU-LIE-1, RU-LIE-2, RU-NOTHING, HC-NOTICED, HC-WANTED, HC-OUTLAWED, HC-SETTLE, GV-GUILD-1, GV-PRIOR-1, TW-HARROW-1, TW-EBBE-1.
