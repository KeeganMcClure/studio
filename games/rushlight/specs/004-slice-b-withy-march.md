# Spec 004: Slice part B, the Withy March

Status: draft for Keegan's review · Written 2026-11-22 by the Game Designer · Game: Rushlight · To do: Development readiness, Ready 4 of 5, Part B

## In plain words

Part A ends with the company signed on and standing in a stand-in town. Part B gives them somewhere to go: the Withy March, cut down to 8 points for the slice, on the approved region map. It builds:

- the slice's map: 8 named points, 10 roads and how many days each takes;
- the region map screen with its top strip, the Key on L and the coin marker;
- travel: route travel, the road card, rations eaten each day, foraging, meat, and who eats when food runs short;
- camp every night on the road, and the inn in town;
- road events, including the Lampwalkers' line and roamers met on the road.

When it's done, you can walk the company from Harrowford around the March, run short of food, camp, get held up at a felled tree, and come back to town to rest. The contract sites are there to visit, but there's no work at them yet: the board, the shops and the jobs come in Parts C and D.

**Map layout (Keegan's pick, Nov 22):** a hand-placed map that the seed varies, for the slice only. The full game still generates every region from its seed (World and contracts), and that generator is built after the slice.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `studio-bible/saves.md` | Saves; Seeds | A save shape change adds an upgrade step and raises the version; everything generated comes from the seed |
| `games/rushlight/bible.md` | To do → Vertical slice | The Withy March cut to about 8 points and 2 towns; the 6 jobs and the Hollow Monk; food, camp and inn are in |
| `games/rushlight/bible.md` | World and contracts → Set; First hand-made parts | Nodes and roads; roads take 1–3 days; seeded season; road events about 25% a travel day; visibility; surprises; the road event list |
| `games/rushlight/bible.md` | People jobs: the Withy March | The wool buyer's road from one slice town to the other, with the felled tree on day 1 |
| `games/rushlight/bible.md` | Creatures → First hand-made creatures; Creature batch 1 | Where each slice job happens; roamer rules; the Lampwalkers' line and den link; the Corpse-candle where the dead lie |
| `games/rushlight/bible.md` | Combat → Folk enemies: region 1 | The road bandit card (felled tree and night attacks) |
| `games/rushlight/bible.md` | Systems → Food; Camp and inn; Going hungry; Prices | Rations, the larder, foraging, meat, camp, the night roll, the inn, ration and inn prices |
| `games/rushlight/bible.md` | Mercenaries and items → Species | Mouse: Light sleeper; Ambushed |
| `games/rushlight/bible.md` | Skills and menus → Map menu; Quality of life | L Key, R Contracts, Start menu, Select; the road card plays itself; Who eats; Route travel; rations-cover days in the strip |
| `games/rushlight/bible.md` | Art → Region map (mockup 3 and rework 3); Company marker (Mockup 5, option C) | The map screen, its strip, chart, cursor, road card and Key; the coin token struck with the lead's head |
| `games/rushlight/bible.md` | Voice; Naming | The March's names (Harrowford, Saint Ebbe's, Hollin, Crookback); the regional tic |
| Spec 002 | Battle; Party; Seeded dice | Fights use the shared battle frame; Select cycles the lead; dice from the saved stream |
| Spec 003 | Saves; the stand-in town | `rl.run` at version 1; the stand-in town that this part replaces |

## What is built today

After specs 002 and 003 are built: a signed-on company in a stand-in town, the shared battle frame with a test fight, the party card list, the seeded dice stream, and `rl.run` at version 1. Nothing of the region map, travel or food exists yet. (This spec was written before those builds; the Developer checks the code against this list first.)

## What to build

### 1. The slice's Withy March

Eight hand-placed points. Names in caps are towns.

| # | Point | Type | Slice job there (built in Part D) | Known at start |
| --- | --- | --- | --- | --- |
| 1 | HARROWFORD | Town · river crossing | Board and givers (Part C). The run starts here | Yes |
| 2 | SAINT EBBE'S | Town · monastery town | Board and givers (Part C) | Yes |
| 3 | Hollin | Hamlet · fields and a bell tower | The Noonwife (hunt) | Yes |
| 4 | Sallow End | Hamlet | Severa the owl (beast job) | No |
| 5 | The charcoal camp | Wild site · charcoal burners' camp | Pell the poacher (bounty) | No |
| 6 | The osier causeway | Wild site · causeway through the osier beds | The Withy Hag (false alarm) | No |
| 7 | Crookback | Wild site · emptied plague village | The Counter (hunt) | No |
| 8 | Lowmoor Pit | Den · flooded mine | The Hollow Monk (Part E) | No, found by its signs |

The wool buyer's escort runs the main road between the two towns.

| Road | Days | Kind | Notes |
| --- | --- | --- | --- |
| Harrowford – Saint Ebbe's | 2 | Main | The wool buyer's road |
| Harrowford – Hollin | 1 | Main | |
| Harrowford – the charcoal camp | 1 | Side | |
| Harrowford – the osier causeway | 1 | Side | |
| Saint Ebbe's – Sallow End | 1 | Side | |
| Saint Ebbe's – Crookback | 2 | Side | |
| Hollin – Crookback | 2 | Side | Hidden on some seeds (below) |
| Sallow End – Hollin | 3 | Side | Hidden on some seeds (below) |
| Crookback – Lowmoor Pit | 1 | Den road | Shown when the den is found |
| The osier causeway – Lowmoor Pit | 2 | Den road | Shown when the den is found |

Draw it on the approved chart (Asset Library rushlight-mockups-map-v1): the river through Harrowford, Saint Ebbe's to the east, Hollin and its fields north, the osier beds and causeway along the river south, the charcoal camp in the woods west, Crookback and Lowmoor Pit beyond, and the cartouche reading THE WITHY MARCH · AUTUMN. The mockup's other points (the shrine, the old field, the gibbet, Withy Mill) aren't in the slice. They come back with the full region.

**What the seed changes** (everything from the world stream, spec 003):

- **One hidden road.** Either Hollin – Crookback or Sallow End – Hollin is hidden until found (a wounded traveler's directions, a rumor in Part C, or arriving at either end). The other is shown dashed from the start, but only once one of its ends is known.
- **Roamers on the roads** (below): which road each one is on.
- **Road events and camps:** every roll, from the dice stream.
- **The regional tic:** the March's tic set from the RT- rows (Voice).
- **What the seed doesn't change in the slice:** the points, the roads' days and the season. The season is always autumn in the slice, since the Noonwife needs a harvest. Winter's rules (roads +1 day, ration prices +50%, foraging −20%) are built but switched on only by a Dev setting, so the checks can test them.

### 2. What the company knows

- **At the start:** the two towns, Hollin and the two main roads.
- **Arriving at any point** shows every road leaving it (dashed if side roads), with a pencil ? at any far end not yet known. This is the bible's scouting.
- **Taking a contract** (Part C) shows its site and the roads to it.
- **The den** shows once the company has 3 of the Hollow Monk's signs (Part D and E build the signs; this part builds the hide and show).
- A known point stays known for the rest of the run.

### 3. The region map screen

Built to the approved mockup (`mockups/07-map-shell.png` and `08-mapkey-shell.png`; Asset Library rushlight-mockups-map-v1 and -mapkey-v1). The bible's Art section describes every mark. In this part:

- **Top strip, row 1:** party heads with the lead in Tallow, where the company is, purse, day, and rations as a count plus the days they cover ("9 · 3d"). A warning shows there when meat will rot tomorrow.
- **Top strip, row 2:** the Hue and cry pips and the four factions at their starting steps. Their rules come in Part C; here they only draw.
- **The chart:** town and site glyphs, solid main roads, dashed side roads, day ticks, pencil ? for points not yet known, the whole-region inset, edge tabs for known points off screen, and the coin token (below). Margin notes for signs and claws for seen roamers draw when Part D adds them.
- **Cursor and road card:** the D-pad hops point to point and the route lights in Tallow dots. The road card shows the point's name and type, the total days, rations carried against rations needed, the number of road-event rolls, any taken contract (Part C), and the threat (??? until known). A travels.
- **Buttons:** L opens the Key over the dimmed map. R opens Contracts, which shows "No contracts taken" and the Signs list until Parts C and D fill it. Start opens the map menu. Select cycles the lead.
- **The coin token** (Mockup 5, option C): a brass coin struck with the lead's head in Peat, the species' one strongest mark showing. It redraws when the lead changes. Draw the six species' coins from the species sheet's portrait heads and file them in the Asset Library before the build uses them.

Arriving at a town or site opens that place. Until Parts C and D exist, a town opens a short **point card** standing in for the street: Rest at the inn, Sleep rough, Buy rations (1 gr each, the market price), and Leave. A wild site or hamlet opens a card that names it and says "Nothing here yet", with Leave. Parts C and D replace these cards.

### 4. Travel

- **Route travel:** pick any known point. The game routes along known roads by fewest days and shows total days and rations needed against rations carried. It stops at every point on the way, and the march can be cancelled at any stop.
- **The road card plays itself**, a day at a time, and stops only for a road event, a night attack or a real choice:
  1. **Forage.** The merc with the best Survival rolls it: success gives +1d2 rations. No cost on a fail.
  2. **Road event roll** (section 6).
  3. **Camp** at the end of the day (section 5). On the last day, the company arrives instead, and that night is in town or at the site.
- **Eating:** at the end of each day, every merc eats one ration. When there aren't enough, the Who eats box comes pre-filled (whoever went hungry yesterday eats first, then the lowest HP). One tap confirms it or changes it.
- **Going hungry:** Hungry on the first unfed day (no WP back at camp), Starving from the second (1 HP and 1 SAN a day until they eat). One meal clears both. A merc taken to 0 HP by Starving is Downed as in combat (Part D's rules; until then, they're at 1 HP and can't be taken lower by hunger). Weak-willed only applies to hires (Part C).
- **The larder** holds 15 rations. Rations bought or foraged past 15 are lost, with a note.
- **Meat** is its own counter, with each lot's days left. Raw meat rots after 2 days and is cooked into rations at camp (one ration per meat, no roll). Beasts that drop meat come in Part D. Build the counter, the rot and the cooking now, with a Dev setting that adds meat for the checks.
- **Days** count up from 1 at the run's start and show in the strip. There's no clock; days only cost food.

### 5. Camp and inn

- **Camp:** every night on the road, and Sleep rough in town. Each merc heals 1d4 HP, WP refills, once-per-rest abilities refresh, raw meat is cooked. No SAN comes back. A Hungry merc gets no WP back.
- **The night roll:** half the road-event odds (12.5% in the slice). On a hit, a night attack (section 6). Before the roll, the merc with the best Search rolls On guard if they have it (Search 75%); a pass, or a mouse anywhere in the company, means the company isn't Ambushed.
- **Make camp** (Survival 90%): that camp counts as an inn night instead. No merc can reach 90% at level 1, but build it now.
- **Inn:** 2 gr per merc. Full HP and WP, the day's meals (no ration eaten), and 1d4 SAN once per merc between contracts. The between-contracts flag clears when a contract is finished (Part D). Until then, the first inn night of the run gives the SAN and later ones don't.

### 6. Road events

Each travel day rolls once: 25% in region 1 (the bible's figure). On a hit, roll the table below. Each event opens as a dialog box with its line from the Text Library (RE- rows, all Draft), then its choices. A choice that needs a roll shows who rolls and their odds, as on hotspots. Numbers are Claude's first draft, tuned in playtest.

| Roll (d100) | Event | Choices |
| --- | --- | --- |
| 1–25 | **Bandits at a felled tree** (RE-TREE-1, VO-BANDIT-1) | **Pay the toll:** 2 gr per merc (RE-TREE-PAY). **Fight:** 3 road bandits, and the company is Ambushed unless On guard passed or a mouse is in the company. On the wool buyer's road this event always comes on day 1 of the escort (Part C/D). |
| 26–40 | **A lord's toll** (RE-TOLL-1) | **Pay:** 1 gr per merc. **Talk:** Persuade; pass, through for free (RE-TOLL-TALK); fail, pay double. **Go round:** +1 day on this road (RE-TOLL-ROUND). Fighting the lord's man is a crime, and the Hue and cry is Part C, so it isn't offered until then. |
| 41–55 | **Refugees** (RE-REFUGEE-1) | **Give 2 rations** (RE-REFUGEE-GIVE): a merc with Protect the innocent gets that motivation's moment, +1d4 SAN. **Pass by** (RE-REFUGEE-PASS). Rob them comes with crimes in Part C. |
| 56–70 | **A wounded traveler** (RE-WOUND-1) | **Help:** First Aid; pass, he shows the seed's hidden road, or a random unknown point if it's already found (RE-WOUND-SAVED); fail, he dies (RE-WOUND-DIED). **Pass by.** |
| 71–80 | **A flagellant procession** (RE-PROC-1) | **Wait for them:** +1 day on this road (RE-PROC-WAIT). **Walk through:** each merc rolls CON × 5 or is Sickened (RE-PROC-THROUGH). A merc with Faith can take the moment instead: walk with them, +1d4 SAN, and the same CON roll. |
| 81–95 | **Storm** (RE-STORM-1) | No choice: +1 day on this road. |
| 96–100 | **A strange sign** | On a road within 2 roads of Lowmoor Pit, one of the Hollow Monk's signs (CR-MONK-SIGN rows), once per run. Anywhere else, or once it's been found, reroll. Signs are Part D's; until then this only writes the sign to the Signs list. |

- **Broken axle** is left out of the slice, since it needs a cart.
- **Night attacks** (section 5): roll d100, 1–50 rooks (Creature batch 1), 51–100 two road bandits. An Ambushed night attack opens with RE-CAMP-RAID; a spotted one with RE-CAMP-GUARD.
- **Roamers on the road.** The seed puts the hedge cat on one road and the rooks on another, never the same road and never a main road. The Corpse-candle goes on one of the two roads touching Crookback (the plague dead lie unburied there). The Lampwalkers' line is one of the three roads one step from a den road (Harrowford – the osier causeway, Saint Ebbe's – Crookback, Hollin – Crookback), so they stay within 2 roads of the den. The first day on a roamer's road always meets it, instead of the road event roll:
  - The hedge cat, the rooks and the Corpse-candle: **Sneak past** (the lead rolls Stealth; pass, through with no fight; fail, the fight opens with the company Ambushed), **Fight**, or **Turn back** (to the point you came from, the day spent). Items that work on roamers (Bangers, Snare, Salt for the Corpse-candle) show as choices when the company carries them.
  - The Lampwalkers (RE-LAMP-1): **Wait them out** (+1 day, with CR-LAMP-PASS) or **Stand** (the fight). Their law means sneaking doesn't apply.
  - Once met, the roamer shows as claws on its road. A killed roamer is gone for the run, and a roamer you got past stays.
- **Fights** in this part open the shared battle from spec 002 with the enemy's card numbers from the bible. Rushlight's full combat rules (weapons, armor, Downed, loot, XP) are Part D. Until Part D is built, a fight uses what spec 002 built and ends on the battle's own win or wipe.

### 7. Saves

A change to what `rl.run` holds, so **upgrade step 1 → 2**:

- `rl.run` gains the region: the company's point, the day, known points and roads, the hidden road and whether it's found, each roamer's road and whether it's met or dead, signs found, the larder, meat lots, each merc's Hungry and Starving days, and whether the run's between-contracts inn SAN is used.
- **Step 1 → 2:** moves a company from the stand-in town to Harrowford on day 1, with the larder set from the old ration count, and fills the region from the run's seed. Set `rl.version` to 2.
- Add a version 2 save to `src/test-saves/`, taken mid-road with a hungry merc. The check opens every saved version.
- Autosave every day on the road, at every stop and after every road event, so closing the phone mid-trip loses at most a day.

## The tuning check

Two fights are added. Both use the road bandit card (HP 12, DEX 12, 45%, 1d3+1) and the rooks (4 bodies, HP 5, 40%, 1d3).

- **Felled tree, 3 road bandits against a fresh company:** the bandits deal about 4 HP a round between them; a fresh company of three mercs with their trade weapons kills one about every round and a half. Expect the company to lose about 10–14 HP in total and no merc to go down, with Ambushed adding about 4. A night at camp heals 1d4 each, so the cost is about one camp's healing, or 6 gr to pay instead. **Pass:** over 20 simulated fights on 3 seeds with the Free Company, no merc goes down in more than 2 fights.
- **Night attack, 2 road bandits or the rooks:** smaller than the felled tree. The rooks' real cost is rations stolen. **Pass:** the company loses under 8 HP on average, and the rooks take 1–3 rations a fight.

If either misses, stop and bring the numbers back. Don't retune the enemy cards in code.

## Done when

- `npm run check` passes at 320 × 480, 375 × 550 and 375 × 667.
- New runs on 3 seeds: every point can be reached by known roads once the hidden road is found, roamers sit on legal roads, and a march from Harrowford to every known point and back runs with no errors.
- On each seed, a company that sets out with 9 rations and doesn't forage goes hungry on the right day, the Who eats box comes up, Starving costs 1 HP and 1 SAN a day, and a meal clears it.
- Camp heals and refills as above; the inn charges 2 gr a merc and gives SAN once; Sleep rough is free.
- Every road event can be reached with a Dev setting that forces it, and every choice on it works by D-pad and by tap.
- The coin token shows the lead's species and changes when Select changes the lead.
- The version 1 test save upgrades to version 2 at Harrowford; the version 2 save loads mid-road on the same day with the same larder.
- The tuning check passes.
- `changelog.md` has a dated entry: what was built, placeholders left (the point cards, faction row drawn but inert, signs written but not shown on the chart), and any deviations. Tick Part B in the bible.

## Not in this spec

- The town street, notice board, givers, contracts, hiring, shops, the Hue and cry and factions (Part C).
- Contract sites, their fights, signs on the chart, loot, XP and the bestiary (Part D).
- The den, the Hollow Monk, the ledger and death screens (Part E).
- The full region (14+ points), the generator, other seasons in play, mules and carts, debt collectors, surprises, Leaving early and the road out.

## Conflicts found

None. Claude's calls inside the bible's rules, for Keegan to change in review:

- **The 8 points and 10 roads**, their days, and which jobs sit where (the bible names each job's kind of place but not the slice's cut). Crookback becomes the emptied plague village and the den is named Lowmoor Pit.
- **The slice is always autumn**, since the Noonwife needs a harvest.
- **Road event choices and odds.** The bible names the 8 events but not what each does; the table above is a first draft. Broken axle is left out.
- **Roamers meet the company on roads** in the slice, since all 8 points hold jobs.
- **Night attacks** are rooks or two road bandits.

## Proposed for the bible

Added to the bible in this pull request, under World and contracts:

- **The slice's Withy March**: the 8 points and 10 roads above.
- **Road events**: the table above, as the first draft for every region.

## Open questions for the Developer to bring back (don't decide them in code)

- If the approved chart can't fit all 8 points at its 2× scale without the edge tabs hiding a town, stop and say so.
- If the tuning check misses, bring the numbers back.
