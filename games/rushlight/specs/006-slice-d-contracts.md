# Spec 006: Slice part D, contracts on the ground

Status: draft for Keegan's review · Written 2026-11-22 by the Game Designer · Game: Rushlight · To do: Development readiness, Ready 4 of 5, Part D

## In plain words

Parts A to C give the company a March to walk, towns to work from and six jobs to take. Part D makes the jobs playable from start to pay:

- **the rules every job uses:** walkable sites built from room chunks, hotspots, Rushlight's full combat numbers (weapons, armor, wear, statuses, Downed, lasting injuries, snapping at 0 SAN), horror on sight, Identify and prep, loot and caches, the pay screen, XP and level picks, trophies and the bestiary;
- **the six slice jobs** on top of those rules: Pell the poacher, the Withy Hag, the wool buyer, the Noonwife, Severa the owl and the Counter, each with its tuning check.

It's the biggest part of the slice, so it's built in two halves. **D1** is the rules, proved on Pell's camp, which already has approved art. **D2** is the other five jobs. Each half gets its own pull request and changelog entry.

When it's done, every job can be taken, played and paid, and the bestiary fills in. The only thing left of the slice is the Hollow Monk and the end of a run (Part E).

**Site art (your pick on the site art card, Nov 22):** rough mockups of all four sites with no art yet (Hollin, Sallow End, the osier causeway, Crookback), drawn before D2 in the charcoal camp's layout. They're in the bible's Art section as drafts (mockups 30–33). Once approved, each site is built to its mockup and the D2 job uses it.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/rushlight/bible.md` | World and contracts → Contracts; The slice's Withy March; The slice's towns | Shapes, site maps from room chunks, pay, signs; the slice's points, jobs and givers |
| `games/rushlight/bible.md` | People jobs: the Withy March | Pell and the wool buyer, in full |
| `games/rushlight/bible.md` | Creatures (all of it) | Natures, tales and how they're sorted, the bestiary, minor jobs; the Noonwife, the Counter, Severa, the Withy Hag; roamer rules and loot |
| `games/rushlight/bible.md` | Combat (all of it) | Enemy levels, kinds, breaking, yielding, enemy numbers, quirks, builds, Folk cards, contract target rules and the tuning check, weapons, armor, wear, battle moves |
| `games/rushlight/bible.md` | Carried rules → Sanity; SAN loss table; Statuses; Combat; Lasting injuries; Skills; The map and choices | Every carried rule the fights and sites use |
| `games/rushlight/bible.md` | Systems → Progression; SAN budget; Motivations; Recovery | XP, levels and picks; net SAN per contract; motivation moments; between-contracts SAN |
| `games/rushlight/bible.md` | Mercenaries and items → Items; Loot; Caches; Trophies; Item list | What drops, what a cache holds, how proof and trophies work, every item's effect |
| `games/rushlight/bible.md` | Skills and menus → Skill unlocks; Map menu; Quality of life | Hotspot options per skill; Contracts and Bestiary rows; the pay screen card; A prompt odds; Odds when targeting; Fast battles; Signs list |
| `games/rushlight/bible.md` | Art → Battle in the GBA shell; Slice screens (contract site) | The battle layout; the site screen with its strip, NEXT line, enemy plates and hotspot diamonds |
| Specs 002–005 | Battle frame, party, dice; new run and saves; the March and road events; towns, contracts and the Hue and cry | What this part builds on |

## What is built today

After specs 002–005: the shared battle frame running fights with placeholder rules, the company on the March, towns with boards and givers, taken contracts on the Contracts page with their sites shown, and `rl.run` at version 3. Contract sites are still Part B's "Nothing here yet" cards. (Written before those builds; the Developer checks the code first.)

## D1: the rules

### 1. Contract sites

- **Built from room chunks.** Each site type has 3–6 hand-made chunks (a few screens of tiles each). The seed picks 3–4 and joins them, then places the job's fights, hotspots and 0–2 caches in the slots the chunks mark. The chunk lists are in D2, per job.
- **The site screen** is the approved Mockup 6 site (Asset Library rushlight-mockups-site-v1): a site strip (party heads, the site's name, the contract's kind and shape, day), the NEXT line under it, enemy plates over placed fights (name, level, threat skulls, count), Tallow hotspot diamonds that brighten when the lead is close, dimmed in Ash once used.
- **Hotspots:** A shows the A prompt: the action, what's there (its ST- line), who rolls and their odds, and the best other merc's odds on Select, which swaps the lead before rolling. Options the lead lacks show greyed with the skill's name. Only the lead's skills work on the map. A hotspot can be tried once unless its line says otherwise; a fail can be retried after the next rest.
- **Light:** sites at night use spec 002's night light. A Torch, Horn lantern or Rushlight bundle lights the area, as their item lines say.
- **Loud** actions (a hand cannon, Black powder, a Powder pot, Force it) draw any roamer on the site to the noise.
- **Leaving:** a site can be left any time by walking off its edge. A job left after its first fight or hotspot counts as started: dropping it now is a failed job (half XP, no fee, a giver's favor lost).
- **Statuses tick** on each chunk change (Carried rules → Statuses).

### 2. Battle with Rushlight's numbers

Spec 002's frame, now with every rule in the bible's Combat and Carried rules → Combat:

- DEX order (ties to mercs; On guard means enemies never act first; Ambushed means enemies all act first in round 1, unless Light sleeper); the Fight floor of 30%; STR bonus; crits and fumbles; weapon dice and extras from the Item list; two weapon slots, swapping takes a turn; Reload, can't-fire-twice and Loud; armor, its floor of 1, crits through armor, headwear jobs, shields.
- **Wear:** a fumble wears the weapon a step; a crit taken while armored wears the body piece (the kettle hat first, the first time it turns a crit).
- **Commands:** Fight, Skills (battle moves at 40%, 75% and 90% with their WP costs), Items, Guard (Defend, Brace, Retch, Flee from roamers only). Odds when targeting shows each target's hit chance.
- **Enemies:** levels, threat skulls, kinds, builds, Nerve and breaking at 75%, 50% and 25%; the yield box (Spare, Bind with Manacles, Rob, Kill) with its crimes and the violence SAN roll for killing one who yielded; about 3 in 4 roamers and set-fight enemies roll a quirk; targeting leans toward whoever hurt them last.
- **Horror on sight:** an Unnatural enemy's first appearance calls for a SAN roll from all 3, at its card's tier. Bracing works as in Sanity.
- **0 HP:** Downed; bleeds out after 3 of their own turns unless Revived; if the fight ends first, up at 1 HP. Lasting injuries rolled after the fight, with every modifier. Career-ending retires the merc on the spot (a short goodbye, no Hope SAN).
- **0 SAN:** the merc snaps, as Carried rules says.
- **Breaking Points**, disorders, giving up a motivation and Leaning on a Bond, all as Sanity says. Their screens are list boxes.
- **Death:** a merc who bleeds out or snaps is gone. Their seat empties (hiring, Part C). Seeing a comrade die is a Severe violence SAN roll for the others. Burial is Part E. A wipe goes to Part E's death screen; until it's built, a wipe returns to the title with `rl.run` cleared.
- **Fight end:** loot (section 6), then the lasting injury rolls, then back to the site.

### 3. SAN on the ground

- Every horror a job writes names a tier and a kind (D2 lists them), rolled once per contract per merc, softened in the bible's order.
- **People:** killing a person in a fight is a Disturbing violence roll for the merc who lands the blow; killing one who yielded is Severe.
- **Motivation moments:** each job plants an optional moment for each tagged motivation a merc holds (Part C's tags; D2 says what each one is). Acting on it costs what the job says and gives that merc 1d4 SAN. The MOMENT row on the contract card names the merc.

### 4. Identify, tales and prep

- **Identify** (Occult 40%, 1 WP; −20% in battle): on a site, at a sign hotspot; in battle, on the enemy. Success: the bestiary's Identified piece (kind, nature), one tale sorted true or legend, exact HP shown for the rest of the contract, and the weakness shown in battle.
- **Sorting tales:** a witness (Empathy), the records (History or Letters), a Distilled sample (Alchemy 75%) and Identify each mark one tale. Killing it marks all three. D2 places each source.
- **Acting on a tale:** any tale the company has heard can be acted on, sorted or not. A legend's prep costs what it costs and does nothing, and the ones marked "backfires" do what their card says.
- **Prep:** each hunt's prep steps (D2) weaken the target or strengthen the company, at most 40% off its HP. Prep done shows on the Contracts page.

### 5. Signs

- Signs toward the Hollow Monk go on the Contracts page's Signs list, with no count of how many are left, and as margin notes on the chart near where they were found.
- The slice's sources: one hotspot in the Noonwife hunt (CR-MONK-SIGN-4) and one in the Counter hunt (CR-MONK-SIGN-1), the tavern rumor (Part C, RU-MONK), the strange sign road event and the Lampwalkers (Part B). A sign already found isn't given twice; the next unfound CR-MONK-SIGN row is used instead.
- **3 signs** show Lowmoor Pit and its two den roads on the chart (Part B's hide and show). Part E builds the den.

### 6. Loot and caches

- **Roamers:** 30% to drop one item from their loot table (each roamer card's Loot line). **Folk:** coin about 70% of the time (1d6 gr each), rations about 40% (1). **Beasts:** meat about 30% (1). The unnatural drop nothing edible. Set-fight drops are fixed where D2 says.
- **Caches:** 0–2 per site, seeded, behind a hotspot (ST-CACHE-1 or -2), each holding 2–3 items that fit the job, from the Item list's Common and Uncommon. Robbing a shrine cache (ST-CACHE-2) drops Church standing a step and is a crime.
- Looting the dead is free. Robbing someone who yielded is a crime.

### 7. The pay screen

When a job ends, the pay screen shows, in order:

1. **The fee:** paid in full with proof (a hunt's trophy, a bounty's body, the escort delivered), or half (ST-PAY-HALF) for a hunt with no trophy. Giver jobs pay their +25% and any haggle, and give 1 favor with the giver's faction.
2. **XP:** quick job and minor creature jobs 100; short case and road job 150; hunt 200 (region 1). Every living merc gets the full amount. A failed job pays half XP and no fee.
3. **SAN lost** this contract, per merc.
4. **Trophies and loot** gained.
5. **Level-ups:** a merc who reaches a level opens the pick screen: 2 picks of +5% to any skill (cap 95%) and +1 max HP. It can be put off and done from the Party menu, which shows a badge until it's done.

Then the contract's flags: statuses clear; the between-contracts SAN at the inn, brothel and blessing is ready again (Part C); each town's hire pool refreshes; the Hue and cry drops a step if nothing climbed during the job; the next job goes up on the board.

### 8. Trophies

- **Hunts pay on proof.** Any merc can take crude proof with no roll. Butchery's Dress the kill takes a clean trophy plus 1–2 spare parts.
- **Proof and trophies** sit in the shared pack with the tooth mark (and UNNATURAL for unnatural ones). They sell wherever there's a buyer. In the slice, the church buys unnatural trophies (5 gr, 8 at Church Trusted, and +1 Church favor), and markets and the apothecary buy spare parts (3–8 gr). The witch and the Peddler are out of the slice; the fence opens only from the Withy Hag's cut.
- A Pious giver pays +25% when the hunt's trophy goes to the church.

### 9. The bestiary and the ledger

- Map menu → Bestiary: every creature met in the run, by region, each with its pieces: Sighted (folk name, signs, the 3 tales unsorted), Identified (kind, nature, one tale sorted), Killed (weakness, all tales sorted, what its trophy is good for, the Underneath line). Beasts and false alarms have Sighted and Killed only. The Withy Hag's Killed piece is CR-HAG-BEST.
- **It lives in `rl.ledger`**, not `rl.run`, so it survives a wipe. A later run starts with every piece already earned.
- The ledger (past companies and their dead) is written here as each merc dies; Part E shows it.

### 10. Saves

A change to what `rl.run` and `rl.ledger` hold, so **upgrade step 3 → 4**:

- `rl.run` gains: the job in progress (site layout from the seed, hotspots used, fights done, prep done, tales heard and sorted, the next line), each merc's statuses, injuries, Adapted marks, disorders and Breaking Point, unspent level picks, XP, and gear wear.
- `rl.ledger` gains: bestiary entries and the dead.
- **Step 3 → 4** adds empty versions of each, keeps everything else, and sets `rl.version` to 4.
- Autosave on every chunk change and every battle round. Reopening mid-fight resumes the same round with the same dice position.
- Add version 4 saves to `src/test-saves/`: one mid-site, one mid-fight.

### D1 is done when

- Pell's job (D2's first job) plays start to finish on 3 seeds, every rule in sections 1–10 has a Dev setting that forces it, and the version 3 save upgrades.
- Spec 002's test fight is gone, replaced by real fights.

## D2: the six jobs

Numbers are the bible's. Each job lists its site chunks, hotspots, fights, horrors, moments and tuning check. Lines are the Text Library's ST- rows (all Draft) unless named.

### Pell the poacher (bounty, short case; the charcoal camp)

- **Chunks:** a deer trail or a cart track in (seed picks one), the clearing (the approved Mockup 6 camp), the burners' hut.
- **Hotspots:** the dug ground (Search: ST-PELL-DUG; a pass spots the Snare line, so the first merc to close on Pell isn't Stunned). The frogs on a line (Survival's Track: ST-PELL-FROGS; the fight with Pell opens with him Exposed). The hut, after the fight (Empathy: PJ-PELL-KIN, his kits; the choice is then made knowing). The thatch (Search: ST-PELL-THATCH, his winter money, 10 gr).
- **Fights:** his two cousins at the fire (2 road bandits), then Pell with whoever's left (his card in People jobs). He yields when the bible says (Skittish, on purpose) with PJ-PELL-YIELD.
- **Endings:** Bind (Manacles) for +50%; Kill for the fee (the Severe roll for killing one who yielded, but no crime on a bounty target); Rob as usual; let him go (no pay, +1 Outlaws favor, ST-PELL-GO).
- **Moments:** Family: let him go for his kits (costs the fee). Money: take the thatch purse (it's his kits' winter money; it's a crime if anyone sees, and it closes the Family moment).
- **SAN:** people only, 0–3 net.
- **Tuning check:** 2 road bandits, then Pell (HP 22, DEX 16, 50%, 1d4+1) and any bandit left. Pass: on 3 seeds, 20 runs each with the Free Company at level 1, no more than 1 merc Downed in 3 of 4 runs, and nobody dies.

### The Withy Hag (false alarm, quick job; the osier causeway, at night)

- **Chunks:** the causeway (fixed), the osier beds (left or right of it, seeded), the beached boats.
- **Hotspots:** the claw marks (Search or Survival: ST-HAG-PRINTS, the bootprints). The same marks with Identify (ST-HAG-NOLAW: no nature, no law). The heron skull on a pole (CR-HAG-SIGN-2, flavor). Under an upturned boat (Search: ST-HAG-SALT, the salt).
- **The Hag** walks out of the withies screaming. If the company found the bootprints, A on her offers **Unmask** (ST-HAG-UNMASK) before any fight, opening the bible's Persuade scene with four ways out:
  - **Turn them in:** the guild's fee (25) plus the reeve's bounty, 10 gr, +50% if they're brought in alive; +1 Town favor.
  - **Take a cut:** no fee, 15 gr from the smugglers, a crime for the Hue and cry, +1 Outlaws favor, and their fence opens at Harrowford (buys stolen goods and trophies).
  - **Sell the guild the mask as the head:** the fee, and the smugglers carry on. At the next Harrowford visit, a Luck roll; fail, the guild finds out and Town drops a step.
  - **Fight.**
  Without the bootprints, she's a fight at once, and the mask falls when the leader yields or dies.
- **Fight:** 3 road bandits and the leader (a road bandit with the Veteran quirk).
- **Bestiary:** Sighted as the Withy Hag; unmasked or killed adds CR-HAG-BEST.
- **Moment:** Find the truth: unmask her (costs the chance of a clean fight; the smugglers may run).
- **SAN:** none but the people roll (a false alarm costs no SAN).
- **Tuning check:** 4 Folk (3 at HP 12, the leader at Veteran). Pass: as Pell's.

### The wool buyer (escort, road job; Harrowford to Saint Ebbe's)

All as People jobs says. In Part B's terms:

- The road card carries the client: he eats a ration a day (PJ-WOOL-BARK-1 on day 1), and in any fight 1 in 4 enemy attacks go at him (HP 12; he can be healed). If he dies, no pay and −1 Town favor.
- **Day 1** always brings the felled tree (3 road bandits; pay or fight). Other days roll as normal.
- **At the first camp:** a Search roll finds the second purse (PJ-WOOL-PURSE). Then: return it to the guild master at Harrowford (+1 more Town favor), keep it (20 gr, a crime, with the witness penalty while he lives), or take his offer to split it (PJ-WOOL-BEG; 10 gr, no roll).
- **Arriving** at Saint Ebbe's: ST-WOOL-ARRIVE, then the pay screen.
- **Moments:** Money: take the split (costs the favor the return would earn). Duty: return it.
- **Tuning check:** the felled tree with the client in it. Pass: the client survives in 3 of 4 runs with the Free Company at level 1.

### The Noonwife (hunt; Hollin)

- **Chunks:** the lane and bell tower, the reapers' cottages, the field edge, the field (where she's fought).
- **Hotspots:**
  - The dead reaper (Butchery's Examine: ST-NOON-REAPER; a Disturbing violence roll on sight; marks CR-NOON-SIGN-1).
  - The surviving reaper (Empathy: ST-NOON-WITNESS, then ST-NOON-ASKED; strips The Question, and marks tale 2 true).
  - The sexton (Persuade, or pay 5 gr: ST-NOON-SEXTON; he rings the noon bell early, −15% HP).
  - The church roll (History's Old stones: ST-NOON-ROLL; marks tale 1 true).
  - The crows (CR-NOON-SIGN-2) and the shimmer (CR-NOON-SIGN-3), flavor and Sighted.
  - The old miner (ST-NOON-MINER: the Hollow Monk's sign).
- **The fight** opens when the company walks into the field at noon. Her card: HP 58, DEX 16, 60%, 1d4+2, Wring and The Question; no HP bar until Identified; Wring ignores armor; a blank face in the turn column; she casts no shadow. The noon bell countdown sits under the log (spec 002's extras): 12 rounds. When it reaches 0 the bell ends noon and she's gone until tomorrow. That's a failed attempt, not a failed job: the company can try again the next day, at a day's rations.
- **Tale 3 (legend, backfires):** if the company has heard it, a **Hold up iron** command shows; it costs the merc's turn and she laughs (ST-NOON-LAUGH).
- **SAN:** Disturbing on sight (0/1d4); The Question's fail, Disturbing unnatural. Budget: hunt, 6–10 net.
- **Trophy:** her headcloth (crude proof, or a clean trophy with Dress the kill). The church burns it.
- **Moments:** Protect the innocent: sit with the surviving reaper (costs a day). Faith: pay for a mass for the dead reaper at Hollin's church (10 gr).
- **Tuning check** (the bible's contract target check): a careful company at level 2 that did the prep wins with at most one merc Downed; one at level 2 that skipped it can lose. Run both, 20 times each, on 3 seeds.

### Severa the owl (beast job, quick job; Sallow End)

- **Chunks:** the yards, the church and its loft, the parents' cottage.
- **The scene decides how the fight opens**, as her card says:
  - By day, climb to the roost (Athletics at the loft ladder: ST-OWL-LOFT). She starts Stunned; the fight is in the rafters, −10% Dodge for everyone.
  - By night, bait a yard with a child's smock (Persuade the parents: ST-OWL-PARENTS). She comes to the company and acts first.
- **Fight:** HP 20, DEX 18, 55%, 1d4+1; Tough, Lurker, Skittish; Carry off (the smallest merc by size); Silent wing at night; rolls a quirk. Fled, she's back the next night and the job isn't done.
- **After:** the roost holds the children's shoes (CR-OWL-ROOST). The hamlet pays the priest to bury them.
- **Loot:** her pinions (Part).
- **Moments:** Protect the innocent: carry the shoes to the priest (costs a day). Family: sit with the parents (costs the day's light, so the fight is at night).
- **SAN:** none (a beast job).
- **Tuning check:** day and night, 20 each. Pass: no merc dies, and the night fight Downs a merc more often than the day fight.

### The Counter (hunt; Crookback)

Built to its rough mockup (bible, Art, mockup 33) once that's approved.

- **Chunks:** the plague ditch and pit, the empty street, the church and churchyard, the bakehouse, the apothecary's ruin.
- **Hotspots:**
  - The churchyard graves (Butchery's Examine: ST-COUNT-GRAVES; Disturbing unnatural; CR-COUNT-SIGN-1).
  - The bone rows (Search: ST-COUNT-ROWS; CR-COUNT-SIGN-2).
  - The nest in the bakehouse oven (ST-COUNT-NEST; burn it with a Torch, Fire pot or the oven: −15% HP, and a Disturbing unnatural roll for whoever handles the bones).
  - The fleeces (Craft: ST-COUNT-FLEECE; muffle boots and kit, so the fight opens with it Stunned).
  - The poppy seed (ST-COUNT-SEED; tale 1, legend, backfires: it eats the seed and follows the trail, so the company starts the fight Exposed).
  - The pit (ST-COUNT-PIT; tale 2, legend: turning the body costs a Severe violence roll and does nothing).
  - The parish book (History or Letters: ST-COUNT-PARISH; marks tale 3 true).
  - The shuttered room (ST-COUNT-LAMP: the Hollow Monk's sign).
- **The fight** comes to the loudest place: the first Loud action on the site, or the pit if nothing is Loud. HP 48, DEX 18, 65%, 1d6+2; Frenzy and Burrow; a blank face in the turn column; a hand cannon's shot draws all its attacks for the next round.
- **SAN:** Disturbing on sight (0/1d4), plus the hotspots above. Budget: hunt, 6–10 net.
- **Trophy:** its teeth. The church takes them in the slice.
- **Moments:** Revenge: break open the sealed house where the last family died (Force it, Loud: it brings the fight). Curiosity: read the whole parish book (costs a rest's worth of time: the camp that night counts as Sleep rough).
- **Tuning check:** as the Noonwife's, at level 2 with and without the muffling and the nest.

## Done when

- **D1:** as above.
- **D2:** every job plays start to finish on 3 seeds by D-pad and by tap, every ending of each job can be reached, the five tuning checks pass, and the Signs list reaches 3 on every seed without the strange sign road event.
- `npm run check` passes at 320 × 480, 375 × 550 and 375 × 667 after each half.
- The bestiary keeps every piece through a forced wipe and a new run.
- The version 3 save upgrades to version 4; the version 4 saves load mid-site and mid-fight.
- `changelog.md` has a dated entry for each half: what was built, placeholders left, deviations. Tick Part D in the bible after D2.

## Not in this spec

- The Hollow Monk and his den, burial and masses, the ledger and death screens, the wipe screen (Part E).
- The witch, the Peddler and bargainers, rites and magic, Quarters, retiring by choice, the Lying and Two-faced givers, the tithe barn and the deserters, the adder.

## Conflicts found

None. Claude's calls inside the bible's rules, for Keegan to change in review:

- **D1 and D2 as two builds**, proving the rules on Pell first.
- **Every job's site chunks, hotspots, moments and where its tales get sorted.** The bible sets each card's fight, prep and tales, but not the site around it.
- **The Noonwife's 12-round noon bell**, and a missed noon is a failed attempt, not a failed job.
- **The Counter comes to the loudest place** on the site.
- **The four rough site mockups:** each site's time of day (Hollin at noon, Sallow End at dusk, the causeway at night, Crookback overcast), where the Hag stands before she walks out, and the site strip showing the Hag's posting as a hunt, not a false alarm.
- **The Withy Hag's reeve's bounty** is 10 gr, and the smugglers' cut is 15 gr.
- **Leaving a started job** counts as a failed job.
- **Each Monk sign comes once**; a repeated source gives the next unfound sign.

## Proposed for the bible

None. Everything here applies rules the bible already sets. The calls above stay in this spec, the build reference for the slice's jobs.

## Open questions for the Developer to bring back (don't decide them in code)

- If any tuning check misses, stop and bring the numbers back. Don't retune cards in code.
- If a site can't fit its chunks on the 240-wide canvas without the site strip or NEXT line covering hotspots, stop and say so.

New Draft rows in the Text Library for this spec: ST-PELL-DUG, -FROGS, -THATCH, -GO; ST-HAG-PRINTS, -NOLAW, -SALT, -UNMASK; ST-WOOL-ARRIVE; ST-NOON-REAPER, -WITNESS, -ASKED, -SEXTON, -ROLL, -MINER, -LAUGH; ST-OWL-PARENTS, -LOFT; ST-COUNT-GRAVES, -ROWS, -NEST, -FLEECE, -SEED, -PIT, -PARISH, -LAMP; ST-CACHE-1, -2; ST-PAY-1, ST-PAY-HALF.
