# Spec 007: Slice part E, the end

Status: draft for Keegan's review · Written 2026-11-22 by the Game Designer · Game: Rushlight · To do: Development readiness, Ready 4 of 5, Part E

## In plain words

Parts A to D give the slice a company, a March, two towns and six jobs. Part E builds how a run ends:

- **the Hollow Monk:** his den at Lowmoor Pit, its prep, the fight and the kill;
- **death:** what happens when one merc dies (burial, or leaving them in a ditch), and the death screen when the whole company dies;
- **the ledger:** one line per merc, one entry per company, and the ledger screen that shows them;
- **what carries over:** a new run after a wipe starts with the bestiary and the ledger, and nothing else.

The slice's scope says the run ends at the Monk's death on a ledger screen. So the slice has two endings: the Monk dies, or the company does. Both end on the ledger.

When it's done, the vertical slice can be played from the title screen to an ending and back to a new run. Only Ready 5 (approving the Text Library lines) is left before Keegan playtests it.

The new screens (the den, the death screen and the ledger) have no mockups. Mockup 6 settled this: the slice's other screens are built in the shell's list-box style and reviewed in play. The den is built from the site kit like the other sites.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/rushlight/bible.md` | To do → Vertical slice (scope) | The run ends at the Monk's death on a ledger screen |
| `games/rushlight/bible.md` | World and contracts → Set; Contracts (Finding the great creature); The slice's Withy March | No win, the ledger's score, signs to the den, Lowmoor Pit and its two den roads |
| `games/rushlight/bible.md` | Creatures → The Hollow Monk; Lampwalkers; Bestiary | His card, tales, prep, trophy; the den roamer; the Killed piece |
| `games/rushlight/bible.md` | Systems → Set (Permadeath, Carry-over); Also for sale (Burial and masses); Prices; Progression; SAN budget; Bonds (Losing a comrade) | What a wipe keeps, burial, the church's prices, great creature XP, the 10–15 SAN budget, Close comrades |
| `games/rushlight/bible.md` | Voice → The heart; samples; Nicknames | The ledger is how they grieve: one line, nicknames and what they were owed; nicknames from a great creature kill |
| `games/rushlight/bible.md` | Combat → Enemy levels, tiers, fight length; Carried rules → Sanity, SAN loss table, Combat (Downed, 0 SAN), Lasting injuries | The great creature's tier, death and snapping, injuries |
| `games/rushlight/bible.md` | Tech → Seeds; Saving | The seed on the death screen; `rl.run` cleared by a wipe, `rl.ledger` kept |
| Specs 003–006 | New run and title screen; the March; towns and the church; sites, battle, the pay screen, signs and the bestiary | What this part builds on |

## What is built today

After specs 002–006: the slice plays from a new run through all six jobs. Three signs show Lowmoor Pit and its two den roads on the chart, but the den is an empty point. A merc's death empties their seat and writes them into `rl.ledger`. A wipe returns to the title with `rl.run` cleared. A new run over a saved one files the old mercs as having left the company. `rl.run` is at version 4. (Written before those builds; the Developer checks the code first.)

## 1. Lowmoor Pit, the den

**Getting there.** Lowmoor Pit shows once the company has 3 signs (Part D). Its roads are Crookback to Lowmoor Pit (1 day) and the osier causeway to Lowmoor Pit (2 days). The Lampwalkers walk a road one step from a den road (Part B).

**The site.** A walkable site like the others (Part D), built from these chunks in this order:

1. **The pithead:** the whim, the pump house and the spoil heaps.
2. **The miners' row:** shut huts, and one door that opens.
3. **The reckoning house:** the mine's office, with its books.
4. **The shaft:** ladders down. Going down is committed: there's no coming back up without the fight.
5. **The flooded gallery:** black water under the cap beam, where he rises.

Its strip reads LOWMOOR PIT · great creature, and its NEXT line is ST-MONK-NEXT.

**Hotspots:**

| Hotspot | Skill | What it does |
| --- | --- | --- |
| The pump house | Craft | Restarts the pumps (ST-MONK-PUMPS): −15% HP, and he can't rise. A fail costs a day's work and can be tried again. |
| The open door in the miners' row | Empathy | The last miner (ST-MONK-MINER). Teaches the greeting and sorts tale 1 true. A fail: he shuts the door until tomorrow. |
| The reckoning house books | Letters or History | The mine's records (ST-MONK-RECORDS). Teaches the greeting and sorts tale 3 true. |
| The lamps in a sealed gallery | Search | CR-MONK-SIGN-1 if not found yet. Otherwise flavor, and an Unsettling unnatural roll (0/1). |
| The shaft head | none | Going down (ST-MONK-DOWN). A Disturbing unnatural roll (0/1d4) for the lead, then the gallery. |
| A cache in the reckoning house | Search | One cache (Part D's caches), 2–3 Common items: tallow, rope, rations. |

**Prep away from the den:**

- **A church-lit lamp:** the priest's rite at either church, 10 gr (free at Church Trusted). One lamp, carried by one merc, takes a kit slot. While it burns, Lamp out does nothing.
- **A mass for his soul** (tale 2, legend): 10 gr at either church. It's paid and does nothing.

Prep done shows on the Contracts page under a Hollow Monk heading, as hunts do (Part D). The pumps take at most 15% off, inside Part D's 40% cap.

## 2. The fight

He rises from the water when the company reaches the gallery (CR-MONK-DESC, then the fight).

- **His card:** HP 78, DEX 12, attack 60%, 1d4+2. The hill falls (area: 1–3 to each merc, and every body piece wears one step). Lamp out (each merc makes a Disturbing unnatural SAN roll, then −20% Shooting and Search until a light is lit). No HP bar until Identified, like the Noonwife.
- **Rises once:** the first time his HP reaches 0, he rises again at half his full HP (ST-MONK-RISE), unless the pumps are running. The second time he goes down, he's dead.
- **The greeting:** if the company learned it, an extra command shows for any merc: **Greet him** (ST-MONK-GREET). It costs that merc's turn. From then on he won't attack that merc until they strike him. Area attacks still hit them. Only one merc can greet him per fight.
- **Light:** after Lamp out, any merc can spend a turn to light a lamp or torch from the kit, which ends the −20%. The church-lit lamp stops Lamp out from working at all.
- **SAN:** Severe unnatural on sight (1/1d6). With the descent and Lamp out, the den stays inside the great creature budget (10–15 net).
- **No fleeing:** great creatures are committed. If the whole company is Downed or dead, it's a wipe.
- **Fight length:** 8–12 rounds, as the bible's tier says.

## 3. The kill and the end of the slice

When he dies:

1. **The bestiary** gets his Killed piece: weakness, all three tales sorted, the trophy's use, and CR-MONK-UNDER.
2. **The kill line:** ST-MONK-KILL.
3. **A nickname** for the merc who landed the killing blow: NM-NICK-MONK. It replaces any smaller nickname, and the ledger keeps both.
4. **The pay screen** (Part D), with no fee, since he isn't a contract:
   - 200 XP to every living merc, and level-ups;
   - SAN lost;
   - the trophy, his lamp, which never goes out.
5. **The end card:** ST-MONK-END. This is where the next region's road would open. The slice has no next region, so the run ends here.
6. **The ledger screen** (section 6), with this company's entry on top, then the title.

The living mercs go into the ledger as Living, with LG-LIVING as their line. `rl.run` is kept but marked ended, so a later build that adds the road out could carry them on. The title shows New run, not Continue, for an ended run.

## 4. When a merc dies

A merc is dead when they bleed out or hit 0 SAN (Part D). Then:

- **The death line:** one flat line from the VO-NARR-DEATH pool. The world carries on.
- **Comrades:** each other merc rolls a Severe violence SAN roll (1/1d6) for seeing a comrade killed, or Shattering (1d4/1d8) if their comrade Bond was Close. A merc lost to 0 SAN out of sight of the others costs no roll.
- **Their kit:** weapons and gear go into the shared pack, to keep, sell or leave.
- **The ledger:** their line is written (section 5).
- **Their seat:** empties, to be filled by hiring in town (Part C).
- **The body:** carried to a church for burial, or left (below).

**Burial (the bible's Burial and masses).**

- At either church: 10 gr, or 5 at Church Trusted. One line plays (LG-BURIED-LINE).
- Every surviving merc who was in the company when they died gains 1d4 SAN.
- Their ledger line ends with LG-BURIED.

**Left in a ditch.**

- If the body isn't buried by the end of the company's next contract, or the next time they leave the March, it's left.
- Every surviving merc who was in the company when they died rolls Disturbing helplessness (0/1d4).
- Their ledger line ends with LG-DITCH.

A body with no remains (none in the slice) skips burial and counts as left. Dead mercs show on the Contracts page under **The dead**, with a Bury row while a church is in reach, so the choice is never hidden.

## 5. The ledger

The ledger lives in `rl.ledger` and survives every wipe. It holds one entry per company, newest first.

**A company's entry:**

- the company's name (the template's name, or the one typed for Blank) and its seed;
- how far it got: regions crossed (0 in the slice), contracts done, great creatures killed, days on the road;
- how it ended: wiped, abandoned (a new run over a saved one, from spec 003), or the slice's end;
- one line for every merc who ever served in it, in the order they joined.

**A merc's line:** the bible's form, "their nicknames and what they were owed". Built from:

- their name, then "called" and every nickname they carried, oldest to newest (LG-NAME);
- how they ended: LG-END-FIGHT (killed by something named), LG-END-BLEED, LG-END-SNAP (0 SAN), LG-END-STARVE, LG-END-DESERT, LG-END-RETIRED (career-ending injury), LG-END-LEFT (abandoned run), LG-LIVING (the slice's end);
- what they were owed: LG-BURIED or LG-DITCH for the dead.

For example: "Frampton Tanner, called Half-Ear. Taken by the Counter at Crookback. Buried in his good cloak, briefly."

## 6. The ledger screen and the death screen

Both are list boxes in the shell, like the other slice screens.

**The death screen.** When the last merc dies or snaps, or the whole company is Downed in a committed fight:

- the death line DS-WIPE, then the company's name, the seed, the day, and where they fell;
- each merc's ledger line;
- the score (contracts done, great creatures killed, days);
- A goes on to the ledger screen.

`rl.run` is cleared. Nothing else is.

**The ledger screen.** Reached after the death screen, after the slice's end card, and from a new **Ledger** row on the title screen (shown once the ledger has an entry):

- one row per company, newest first: name, seed, how it ended and the score;
- A opens a company's page: every merc's line;
- the best company so far is marked with the Tallow dot;
- B goes back.

## 7. What a wipe carries

As the bible's Carry-over sets, and nothing more:

- **Kept:** the whole bestiary (every piece of every entry) and the ledger.
- **Gone:** the company, gear, coin, rations, XP, levels, faction standing, the Hue and cry, rumors, and signs.
- **A new run** starts as in spec 003. The bestiary shows what earlier companies learned, so a tale sorted in a past run shows sorted, and prep that's known to be legend can be skipped. The Monk's den still needs 3 signs in the new run.

## 8. Saves

A change to what `rl.run` and `rl.ledger` hold, so **upgrade step 4 → 5**:

- `rl.run` gains: the den's state (pumps running, greeting learned and by whom, the church-lit lamp, a mass paid), whether the Monk has risen, the dead waiting for burial and the contract they must be buried by, and an ended flag for the slice's end.
- `rl.ledger` gains: the companies list. The dead that Part D wrote go into one entry for the company they served in, marked as the current run's.
- **Step 4 → 5** adds empty versions of each, moves Part D's dead into a company entry, keeps everything else, and sets `rl.version` to 5.
- Add version 5 saves to `src/test-saves/`: one at the den mid-fight after he's risen, one with a body waiting for burial, and one ledger with three past companies.

## Done when

- On 3 seeds, a company can find 3 signs, reach Lowmoor Pit, do or skip each prep, kill the Monk, and reach the ledger screen, by D-pad and by tap.
- On 3 seeds, a forced wipe reaches the death screen, then the ledger, then a new run that starts with the old bestiary.
- A merc's death, burial and ditch each work, with the right SAN rolls and ledger lines.
- **Tuning check** (the bible's contract target check, for a great creature): a careful company at level 3 that restarted the pumps, learned the greeting and carries a church-lit lamp wins with at most one merc Downed; one at level 3 that skipped the prep can lose. Run both 20 times each, on 3 seeds.
- `npm run check` passes at 320 × 480, 375 × 550 and 375 × 667, and its 600 random presses include the den, the death screen and the ledger.
- The version 4 save upgrades to version 5, and the version 5 saves load.
- `changelog.md` has a dated entry: what was built, placeholders left, deviations. Tick Part E in the bible.

## Not in this spec

- The road out, Quarters, arc beats, retiring by choice and Hope (out of the slice).
- The hand-made cast remembering the dead across runs (none of them are in the slice).
- The witch and the Peddler, who would want the Monk's lamp.

## Conflicts found

None. Claude's calls inside the bible's rules, for Keegan to change in review:

- **The den's chunks and hotspots,** including the last miner and the reckoning house as the two ways to learn the greeting.
- **He rises once at half his full HP** the first time he drops to 0, unless the pumps run.
- **Greet him** is a battle command that costs a turn, one merc per fight, and area attacks still hit them.
- **The slice's end:** the living go into the ledger as Living, and `rl.run` is kept but marked ended, so a later build can carry them on.
- **Burial:** 1d4 SAN to each survivor. Left unburied past the next contract, a Disturbing helplessness roll (0/1d4) for each. The bible says burial steadies SAN and a ditch costs SAN, but not how much.
- **A dead merc's kit** goes into the shared pack.
- **A Ledger row on the title screen,** shown once the ledger has an entry.
- **The best company** is marked on the ledger screen with the Tallow dot.

## Proposed for the bible

None. Everything here applies rules the bible already sets. The calls above stay in this spec, the build reference for the slice's end.

## Open questions for the Developer to bring back (don't decide them in code)

- If the tuning check misses, stop and bring the numbers back. Don't retune his card in code.
- If the death screen or a company's page can't fit three merc lines and the score at 375 × 550 without scrolling, stop and say so.

New Draft rows in the Text Library for this spec: ST-MONK-NEXT, -PUMPS, -MINER, -RECORDS, -DOWN, -RISE, -GREET, -KILL, -END; NM-NICK-MONK; LG-NAME, LG-END-FIGHT, -BLEED, -SNAP, -STARVE, -DESERT, -RETIRED, -LEFT, LG-LIVING, LG-BURIED, LG-BURIED-LINE, LG-DITCH; DS-WIPE.
