# Spec 023: bigger agents in battle

Status: approved (studio PR #187), ready to build · Written 2026-11-23 by the Game Designer · Game: Black Lantern · To do: Bigger agents in battle (spec 023)

## In plain words

Keegan finds the agents too small in fights. Today each agent is drawn from behind, waist up, at about 34 × 44 px (`src/agent-back.js`). That size came from the approved combat mockup. Keegan's call (Nov 23, 2026): redraw them at about 48 × 60 px, with the same crisp 1 px detail as the enemies. They are drawn fresh at the new size. The old drawing is never scaled up.

Bigger agents take more of the scene, so this spec also sets how they share a short screen with a tall enemy like the 128 px Gleaner. What gives first is the agents sinking a little behind the party strip. The scene, the strip, the command box and the gap between agents stay the same.

Mockup: [`023-bigger-agents-mockup.png`](023-bigger-agents-mockup.png), rendered in the real game with the new drawings patched in. It shows today's screen at 375 × 667 beside the new one, a normal fight (Crowling and Husk Scout) and the Gleaner at 375 × 667, 320 × 480 and 375 × 550, and a sheet of all 18 professions, all 7 hair styles, the lantern and a Downed agent. The drawing code is [`023-battle-backs-mockup.js`](023-battle-backs-mockup.js) and the layout patch is [`023-battle-layout-mockup.js`](023-battle-layout-mockup.js). The drawings are rough v1: the Developer polishes them to the Quality bar and keeps the size, the layout and what each one shows.

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | Art → Faces and sprites, Battle backs | The 48 × 60 size and its finish (studio PR #186) |
| `games/black-lantern/bible.md` | Combat → Basics, Layout | Head-on, three agents from behind along the bottom, in fixed thirds |
| `games/black-lantern/bible.md` | Combat → Basics, Tall enemies on short screens | The tall enemy's head stays on screen; the agents sink first, then its bar draws over (PR #186) |
| `games/black-lantern/bible.md` | Combat → Basics, Turn order | The turn-order column down the left edge never covers the sprites |
| `games/black-lantern/bible.md` | Agents and items → Agent creator; Professions | Skin, 7 hair styles, hair color, outfit color, slim or broad build; the 18 professions |
| `games/black-lantern/bible.md` | Art → Maps | The lead carries the lantern |
| `games/black-lantern/bible.md` | Combat → Basics, 0 HP | Downed agents |
| `games/black-lantern/bible.md` | Art → Direction, Save every asset; Tech → Asset Library | New drawings go to the Asset Library with their code |
| `studio-bible/art-style.md` | Craft; Quality bar | Four-tone ramp, selective outline, rim, real gear, checked side by side |
| `studio-bible/ui.md` | Screen craft | Nothing cut off; text readable |

## Part 1 · The size

- Each battle back is about **48 × 60 px**: from the top of the hair to the waist, from arm to arm on the broad build. Hats, buns and crests may rise up to 9 px above that. The lead's lantern hangs up to 11 px out to the left.
- Drawn fresh in `src/agent-back.js` at the new size (the mockup code is the start). Same finish as the enemies: 1 px pixels, one light from the upper left, a four-tone ramp on every rounded part (light, base, shade, deep), a light rim on the lit edge, and a selective outline (dark on the shadow side and the bottom, a deep tone of the part's own color on the lit side).
- The head is about 23 px wide, so it reads as a big Stardew head on a chunky body.
- `BLB.back(agent, o)` keeps its shape: the same inputs and options, with new `W`, `H`, `AX` and `AY`. Battle code that uses those numbers (the target arrow, tap areas, the active agent's lift) moves with them.
- The creator's Identity step shows the battle back under the face (spec 022, Part 3). It shows the new drawing, scaled to fit its box if needed, with crisp pixels.

## Part 2 · The layout at each screen size

The canvas is 240 px wide at every size. Its height fits the screen (320 at 375 × 667, 282 at 320 × 480, 276 at 375 × 550). The command box (its row and two detail lines) and the party strip don't change.

| Rule | What it means |
| --- | --- |
| Fixed thirds | Each agent stands centered in its third of the screen (x 40, 120, 200), above its own party card. The gap between agents is about 32 px on the broad build, and it never shrinks. |
| Waist on the strip | The agents' waist sits on the top of the party strip, as today. |
| The enemies' baseline | The engine's room for the agents (`AGENT_ROOM` in `engine/battle.js`) grows from 66 to 82: the agents' 60 px plus the enemy's bar and name under its feet. This is Black Lantern's number; another game passes its own. |
| What gives first | When a tall enemy's head needs the room, the agents **sink behind the party strip**, up to **14 px**, until the enemy's name and bar (about 16 px under its feet) clear their heads. Only past 14 px does the enemy's bar draw over them (the Nov 23 rule, unchanged). |
| Turn-order column | It stops about 18 px higher than today, above the agents' heads, so it never covers them. |
| Downed | A Downed agent is lowered **16 px** (today 12), on top of any sink, and greyed. At least the head and shoulders (about 28 px) stay above the strip. |
| Active agent | The acting agent still lifts 3 px. |

What the mockup measured:

| Screen | Normal fight | The Gleaner (128 px) |
| --- | --- | --- |
| 375 × 667 | Nothing overlaps | Nothing overlaps; agents at full height |
| 320 × 480 | Nothing overlaps | Agents sink 8 px; the Gleaner's bar clears their heads |
| 375 × 550 | Nothing overlaps | Agents sink 14 px; the bar still clears their heads |

## Part 3 · Slim and broad

- **Broad** is the full 48 px across the arms.
- **Slim** brings the shoulders, arms and waist in **4 px a side** (40 px across). The head and hair stay the same size, so a slim agent reads as narrower, not smaller.
- Gear that sits on the back (straps, packs, the tank, the shawl, the bag strap) moves in with the build, so nothing hangs past the body.

## Part 4 · Hair, all seven styles

Every style is drawn round, like a skull from behind, with the shade as a crescent on the lower right (the Nov 23 playtest fix, kept).

| Style | From behind at 48 × 60 |
| --- | --- |
| Short | Covers the back of the head, tapered to a nape at the neck, a few strand lines in the shade tone |
| Long | Falls past the collar and over the shoulders to about y 38, with an uneven tip and strand lines; drawn over packs and straps |
| Buzz | The skull's shape in a light hair tone, with skin showing through in a broken stipple (no stripes) |
| Bald | Skin, with a small shine on the lit side |
| Bun | Close to the head, a round bun on top, and a hair tie |
| Mohawk | Shaved sides (stubble stipple on skin) and a tall crest down the middle, with a few spikes on top |
| Curly | Built from round curls, each shaded as its own little ball |

Hair color is the creator's. The ears show at both sides unless the hair covers them.

## Part 5 · The 18 profession outfits

The top is the outfit's color (the creator's, or the profession's default). Each profession shows one thing from behind that says what they do (Quality bar, Real gear). These are what the mockup draws:

| Profession | Outfit | What shows from behind |
| --- | --- | --- |
| Shooter | Tactical | A dark plate carrier with webbing rows, shoulder straps, a drag handle at the top |
| Medic | Scrubs | A soft collar and a stethoscope round the back of the neck |
| Investigator | Suit | A white shirt collar and a back vent in the jacket |
| Clerk | Cardigan | A ribbed hem and a lanyard cord across the back of the neck |
| Hacker | Hoodie | The hood bunched at the neck and headphones over the head (a cyan light on one cup) |
| Talker | Suit | A rust scarf round the neck, one end down the back |
| Bruiser | Hoodie | Sleeveless: bare arms with the top's armholes, and a hood |
| Bodyguard | Suit | A black suit, a white collar and a clear earpiece coil from the ear into the collar |
| Combat medic | Scrubs | A small olive pack with a white patch and a red cross, and its straps |
| Occultist | Cardigan | A plum shawl with its point down the back and gold fringe along the edges |
| Scientist | Lab coat | A white coat, a colored collar, a half-belt with two buttons and a vent |
| Tracker | Ranger | A rope coil over the left shoulder and a pack strap |
| Exterminator | Janitor | Blue coveralls with straps and a metal tank sprayer with a warning label and a hose |
| Funeral director | Suit | A near-black mourning coat with a velvet collar and a long vent |
| Small-town reporter | Cardigan | A bag strap across the back with a brass buckle |
| Therapist | Cardigan | Suede elbow patches and a ribbed hem |
| Hockey player | Hoodie | A jersey with a yoke, two stripes on each arm and a two-digit number on the back (from the agent's name, so it stays the same) |
| Park ranger | Ranger | A campaign hat with a wide brim and a pinched crown, and shoulder patches |

## Part 6 · The lantern and Downed

- **The lantern:** the lead holds it up and out to the left, as in the approved combat mockup. The left arm is raised, the lantern hangs from the fist on a short bail, and it gives a soft warm glow. Both builds hold it the same way. The battle shows it whenever that agent is the lead, as today.
- **Downed:** the whole sprite turns grey (no color left, a little blue in the grey so it reads on dark backdrops). The head sinks 3 px into the shoulders. It is lowered 16 px (Part 2). A Downed lead drops the lantern: it isn't drawn.
- A dead agent who stays on the field is drawn the same as Downed, as today.

## Part 7 · Art and the Asset Library

- The new drawings and their code replace the battle-backs section in the Asset Library ("Agents · in battle, from behind"), with a line saying they replace the 34 × 44 set from Nov 22. The old set stays filed below it, marked retired, so nothing is lost (Art → Direction, Save every asset).
- The build check's contact sheet shows every profession on both builds, every hair style, the lead with the lantern and a Downed agent.

## How the Developer checks it

1. Build from the mockup and the drawing code, then compare side by side with [`023-bigger-agents-mockup.png`](023-bigger-agents-mockup.png) at 375 × 667.
2. Check 320 × 480 and 375 × 550 for cut-offs, in a normal fight and against the Gleaner: every agent's hair, outfit and the lead's lantern readable, a Downed agent greyed and lowered with its head showing, the Gleaner's head on screen and its name and bar clear of the agents' heads.
3. Check the turn-order column with six fighters at 375 × 550: it stops above the agents' heads.
4. Check the creator's Identity step shows the new battle back without cutting it off.
5. `npm run check`, then copy the new drawings into the Asset Library (Part 7).

## Saves

No change. The drawings come from the agent's existing look (skin, hair, hair color, outfit color, build) and profession.

## Out of scope

- Enemy sizes, backdrops and the party strip. Rushlight's battle sizes (its own spec 008) are separate: Black Lantern keeps its own.
- New animations. The battle backs keep today's moves (the active lift, the hit shake).
