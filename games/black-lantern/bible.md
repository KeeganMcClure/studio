# Black Lantern bible

This game's build bible. Moved from the [Black Lantern Build Bible doc](https://claude.ai/artifact/DsXEoTZYTSpYdTMPk5cojd) on 2026-11-21; that doc is frozen.

- The house rules in `studio-bible/` (controls, art style, UI, saves) apply to every game and win where this file overlaps them.
- What's been built is in `changelog.md` next to this file.
- Keegan sends changes through the Design Inbox doc; the Designer edits this file.
- Known export gaps: date chips, mentions and links to other docs became plain text, and pictures became placeholders.

## To do

One item per chat, top to bottom. Sorted cheapest first: paper and doc work comes before anything that touches the game's code.

Finished items move to `todo-archive.md` next to this file (since Nov 23, 2026), so this list shows only what's left.

- [x] Demo revamp under the new rules and art: creator, case board, Pokémon-style party menu, end-of-case improvement, branching paths. Split Nov 21 into the six items below, one Claude Code session each, in order; tick this when all six are done
  Done Nov 23: all six demo items are built.
- [x] Demo 5 of 6: Still Harvest rebuild, story and play: its text block, branching paths, and fewer but harder fights under the new combat rules. Split Nov 22 into the three parts below (spec 006), one Claude Code session each, in order; tick this when all three are done
  Done Nov 23: all three parts are built, the last being the Gleaner's tuning check.
  - [x] Demo 5 part A: field rules. Each agent's own kit and items, skills at hotspots, statuses on the map, SAN by the bible, the full map menu
    Done Nov 22: each agent carries their own kit and items with a shared backpack, A on a hotspot shows the lead's skill options with their odds, statuses tick as you walk, SAN follows the bible's rules, and Start opens the full seven-row map menu. Still Harvest keeps its old story and plays start to finish.
  - [x] Demo 5 part B: combat under the Combat tab, in the approved head-on layout, with battle art for the case's enemies
    Done Nov 22: fights use the head-on layout from the combat mockup, with the turn-order column, HP bars, the one-row Fight · Skills · Items · Guard box and result lines. Every battle move, status move, item and weapon works by the Combat tab; Downed agents bleed out after 3 turns, lasting injuries roll after the fight, and each enemy has big battle art. The case's enemies are stand-ins at the bible's tiers (the Gleaner at 60 HP, −8 per victim) until Part C.
  - [x] Demo 5 part C: the story. Its text block, branching paths, fewer but harder fights, and the Gleaner at the bible's numbers
    Done Nov 23: the Gleaner is tuned a touch harder (65 HP, −8 per victim, 60% to hit, 65% in phase 2), and a new boss simulator shows a careful Field Team that saves all three still wins almost always with at most one agent Downed, while skipping the victims can now cost the fight.
    Left (Nov 23): only the Gleaner's boss tuning check. Do it next, before any new case's part B, because every later boss is tuned against the Gleaner (Combat → Bosses, Tuning check). Keegan's read from the demo playtest: it played OK, maybe a touch harder would be good, with a strong team mix. So tune it a touch harder for a careful Field Team, inside the Boss tier (55–65 HP, Combat numbers): still a win with at most one agent Downed, and a team that skipped the victims can lose.
- [x] Leftovers from the demo build (found in the pre-season review, Nov 23): two things the bible asks for that were never built
  Done Nov 23: both leftovers are built: B skips a seen briefing or cutscene, and Mushrooms make the screen shimmer.
  - [x] B skips a briefing or cutscene you've already seen (Skills and menus → Quality of life, Skip replays; spec 006)
    Done Nov 23: once you've seen a briefing or cutscene, a B SKIP tab shows on the box and B skips the rest of it, even after a reload or a game over. Questions and choices still play.
  - [x] Mushrooms' screen shimmer while High on them (Agents and items → Item list)
    Done Nov 23: while the lead is High on Mushrooms the map shimmers, and in a fight the backdrop does too. Text, cards and sprites stay still and readable.
- [x] Demo playtest fixes (Keegan's notes, Nov 23): build the rule changes from the playtest. Tick this when all eight are done
  Done Nov 23: all eight playtest fixes are built.
  - [x] Hide skill options nobody in the party can use, at hotspots, on the map menu's Skills row and in battle (Skills and menus → Using skills; Combat → Basics, Command menu)
    Done Nov 23: skill options nobody in the party is high enough for are hidden at hotspots and on the map menu's Skills list; ones a teammate has still show greyed. Battle already showed only the acting agent's moves.
  - [x] Creator: a bonus pick that would pass 80% stops at 80% (Agents and items → Agent creator, step 3)
    Done Nov 23: a bonus pick that would pass 80% now stops at 80%, so a 10, 30, 50 or 70% skill can still reach 80.
  - [x] Turn-order column: current round only, each fighter once (Combat → Basics, Turn order)
    Done Nov 23: the turn column shows only this round, the acting fighter on top, faces dropping off as they act, and a Downed agent greyed.
  - [x] Pokémon-style battle backdrops for Still Harvest's town and maze, replacing the darkened map still (Combat → Basics, Backgrounds)
    Done Nov 23: battles now play in front of a painted street or corn maze backdrop, lit for the time of day and soured at low SAN, instead of a darkened map.
  - [x] Wounded enemies: the two damage steps for each Still Harvest enemy, replacing the red dots (Art → Townsfolk and monsters)
    Done Nov 23: every Still Harvest enemy now shows how hurt it is, in two steps (at half and at a quarter HP), with straw spilling, husks splitting and people bleeding, instead of red dots.
  - [x] Still Harvest maze: a route to all three victims that skips the Gleaner's clearing, and a go in / not yet choice at its entrance (spec 006, Revision after the demo playtest)
    Done Nov 23: the maze now has a route to all three victims, the loot, the page and the danger zone that never enters the Gleaner's clearing, and stepping into the clearing asks Go in / Not yet.
  - [x] Creator: pronouns (she, he, they) (spec 022) used by all dialog, and a slim or broad body build for map, battle and portrait sprites, plus pronouns for each Bond, with a save step for old agents and Bonds (Agents and items → Agent creator, steps 4 and 5)
    Done Nov 23: the creator picks she, he or they and a slim or broad build that shows on the face, map and battle sprites; Bonds get pronouns too; every line about an agent or Bond follows them, and old agents open as they with the broad build.
  - [x] Creator: one-word pop-culture code names (spec 022) that Big Hat gives on the Dossier step, from a tagged list of about 60, with new template names (Agents and items → Agent creator, Code names)
    Done Nov 23: Big Hat gives a one-word pop-culture code name on the Dossier in his dialog box, with Take it, Another or Type my own; template agents have new hand-picked names, and old agents keep theirs until they ask.
- [x] Home phase part C (spec 008): enough home scenes for a season, with the played list kept in the season save. Before the season flow
  Done Nov 23: every home scene choice now draws from a pool big enough for a season, and the same scene doesn't come back until the rest have played; the game remembers what played across the whole season, even after a reload.
- [x] Season flow (spec 009): the season data file, the board for a full season, agency case unlocks, the finale, the season's end and the next season. After the home phase
  Done Nov 23: the season's agency entries are in the season data file, so a whole season runs from New game to its end once its agency cases are built.
- [x] Home phase part D (spec 008, Part C table): 4 more Fulfill Responsibilities scenes at Close for each of the 8 Bond types (7 each, 32 new scenes), so a season never repeats one. After the season flow
  Done Nov 23: each Bond type now has 7 Close scenes (32 new), so a season of visits to the same close Bond never repeats one.
- [x] Creator look fixes (spec 022, Part 3): the backstory in a detail box, the map and battle sprites under the face on Identity, AGENT ??? before Big Hat names the agent, and a solid box over a darker Dossier
  Done Nov 23: Identity shows the full backstory in a box at the bottom and the map and battle sprites under the face; the Dossier reads AGENT ??? until Big Hat names the agent, and his box is solid over a darker Dossier.
- [x] Good Manners part A (spec 010): its maps and art, townsfolk and the two men, walkable with stand-in scripts. After the season flow
  Done Nov 23: Good Manners pins on the board. Its town, street, fairground and rooms all walk by day and night, every door and drive goes where it should, everyone has a sprite and a talking face, and Big Hat briefs from a new place.
- [x] Good Manners part B (spec 010): the secret case file first, then its story, fights, boss and endings
  Done Nov 23: Good Manners plays start to finish: its full briefing, clues, a deduction, two story fights, the fair's last night, the boss and all three endings, with the debrief in Big Hat's cab.
- [x] Lot 83 part A (spec 011): its maps and art, the tented night, townsfolk and Walt, walkable with stand-in scripts. After Good Manners
  Done Nov 23: Lot 83's maps, art, people and the tent at night are in, and every map walks with stand-in scripts.
- [x] Lot 83 part B (spec 011): the secret case file first, then its story, fights, boss and endings
  Done Nov 23: Lot 83 plays start to finish: its full briefing, clues, a deduction, two story fights, the tented night, the boss and all three endings, with the debrief in Big Hat's cooler.
- [x] Bigger agents in battle (spec 023): the agents redrawn at about 48 × 60, the short-screen layout, every profession, hair style and build, the lantern and Downed, then the Asset Library. After Lot 83, so every later case's fights are checked at the new size
  Done Nov 25: the agents in fights are drawn fresh at about 48 × 60, in every profession, hair style and build, with the lead's lantern and Downed. On short screens they sink behind the party cards so a tall enemy's name and bar stay clear, the turn order stops above their heads, and the new set is in the Asset Library with the old one filed as retired.
- [x] Lost Hour part A (spec 016): its maps and art, the ridge road in fog, townsfolk and the Pruetts, walkable with stand-in scripts. After Lot 83
  Done Nov 23: Lost Hour pins on the board. Cullen Gap, the Pruett house, the diner, the clinic, the ridge road and the woods in fog, and the finale area all walk by day and night, every door and drive goes where it should, everyone has a sprite and a talking face, and Big Hat briefs from a new place.
- [x] Lost Hour part B (spec 016): the secret case file first, then its story, the night drive and hypnosis session, fights, boss and endings
  Done Nov 23: Lost Hour plays start to finish: its full briefing, a timeline of clues, the night drive and the hypnosis session, a deduction and a hard choice, two story fights, the woods at night, the boss and all three endings, with the debrief in Big Hat's laundromat.
- [x] First agency case part A (spec 014): the secret case file first, from the arc file; then its maps and art, townsfolk, and the black LANTERN folder on the board, walkable with stand-in scripts. After Lot 83
  Done Nov 23: LANTERN 01 pins on the board through a real unlock and, on Dev only, straight from the board's Start button. Its maps all walk by day and night, everyone has a sprite and a talking face, Big Hat briefs from a new place, and its art is on its own Asset Library page.
- [x] First agency case part B (spec 014): its story, fights, boss and endings, and the unlock scene's lines
  Done Nov 23: the first agency case plays start to finish, with its unlock scene, story, two story fights, boss and all three endings, and the debrief in Big Hat's own place for it.
- [x] Tracking part A (spec 018): its maps and art, Fourth Street in snow and the closed club, the tracking lines effect, townsfolk, walkable with stand-in scripts. After Lost Hour
  Done Nov 23: Tracking pins on the board. Fourth Street in snow, the pawn shop, the motel rooms, two places across town by bus, the closed club and the finale area all walk by day and night; every door and bus ride goes where it should; everyone has a sprite and a talking face; the tape's tracking lines show in four steps; and Big Hat briefs from a new place.
- [x] Tracking part B (spec 018): the secret case file first, then its story, the trail and watching the tape, fights, boss and endings
  Done Nov 23: Tracking's story is in and the case plays start to finish: the trail, watching the tape, two fights, the club, the boss and three endings, with the debrief in the casino buffet.
- [x] Dead Air part A (spec 020): its maps and art, Halcott, the station and the cane fields, the broadcast look, townsfolk, walkable with stand-in scripts. After Tracking
  Done Nov 23: Dead Air pins on the board. Halcott, the station and the cane fields walk by day and night, the show has its own radio-dial look, everyone has a sprite and a talking face, and Big Hat briefs from a new place.
- [x] Dead Air part B (spec 020): the secret case file first, then its story, the two broadcasts, the fish fry, fights, boss and endings
  Done Nov 23: Dead Air plays start to finish: its full briefing, both broadcasts, the fish fry, clues, a deduction, two story fights, the cane at night, the boss and all three endings, with the debrief on Big Hat's bait shop porch.
- [x] Later agency cases and the finale (spec 015): every agency case after the first, built one at a time in arc order, each in a part A and a part B like the first, ending with the finale and the season end screen. Tick this when the season data file has them all and a Dev playtest runs from New game to Season 2's board
  Done Nov 25: every agency case and the finale are built and in the season data file, and a Dev playtest ran from New game through the finale and the season end screen to Season 2's board.
- [x] Kinder overstepping (bible, Skills and menus → Overstepping and cover stories, Nov 24, 2026; spec 007 step 4): a held cover story drops overstepping one step even if it climbed, a clean case with a held story drops two, and Federal agents no longer end the case: they're a very hard fight, then the case goes on with overstepping back at Local chief. Old saves keep their current step
  Done Nov 24: the Federal agents are now a hard fight that doesn't end the case (win it and overstepping drops back to Local chief), and a held cover story drops overstepping one step, or two after a clean case. The cover story box names both steps.
- [ ] Season 2 readiness (Keegan, Nov 25, 2026): design work for Season 2, an original King in Yellow season (Story → Season 2). Paper first, now; nothing in Season 2 is built until "Later agency cases and the finale" is done. One item per chat, in order; tick this when all seven are done
  - [x] Season 2 readiness 1 of 7: Season 2 section in the bible (Story → Season 2)
    Done Nov 25: the Season 2 section is in Story, with Keegan's seven calls from Nov 25.
  - [ ] Season 2 readiness 2 of 7: spec for how cases mark each other (what a closed case carries into later ones, in any order) and the save fields it needs
  - [ ] Season 2 readiness 3 of 7: spec for the reality shift tools any case can use (rooms that change, wrong doors, scenes out of order, garbled names and faces), with the rule that a shift never strands the party
  - [x] Season 2 readiness 4 of 7: art direction for the yellow creep and Carcosa, with a mockup Keegan approves, and the palette accents added to Art
    Done Nov 25: Keegan approved the Season 2 look mockup; its rules and colors are in Art → Season 2 look.
  - [ ] Season 2 readiness 5 of 7: the Developer writes Season 2's secret story (agency arc, 9 personal arcs, home scene touches) in `story/`, from Keegan's notes, and reports only "fits" or what's needed
  - [ ] Season 2 readiness 6 of 7: pitch rounds and a case spec for each of Season 2's regular cases, plus the agency case frames
  - [ ] Season 2 readiness 7 of 7: art kits for the picked cases and Carcosa, Shared Shelf first
- [ ] Seasonal case board, Season 1 (spec 024): keepsakes for each Season 1 case and the Season 1 season pieces, the leaves and lantern moving, Big Hat's changing note, and the save step that remembers each closed case's spot
- [ ] Seasonal case board, Season 2 (spec 024, step 8): Season 2's board colors, season pieces, motion, the board acting wrong and Big Hat's notes, built with Season 2's art kits (Season 2 readiness 7); each Season 2 case spec names its keepsake

## Bugs

Problems found in playtests. Each line: what happened · where · how to make it happen again. Claude ticks a bug when it's fixed and notes the fix in the Changelog.

- [x] Backspace acts as B, not Select · keyboard, every screen · press Backspace on the map: it backs out instead of cycling the lead. The Bible and CLAUDE.md say Backspace = Select; the game maps Select to Shift. Fixed Nov 21 by spec 001 (studio PR #14): Backspace = Select, Shift stays a second Select key, X stays B.
- [x] The Gleaner's head shape starts 1 px above its own sprite box, so one row of the art is lost · battle, the Gleaner · read its sprite code (you can't see it in play). Cosmetic and low; fixing it means redrawing the sprite (logged Nov 23, 2026)
  Done Nov 24, 2026: the Gleaner's head now sits fully inside its sprite box, so no part of it is cut off at the top.

## Ideas inbox

Drop loose ideas here; Claude sorts them into the right section next build.


Your medieval spin-off notes moved, word for word, to their own doc on Nov 19: Doc

## Screens

Every screen you can see, in play order (studio rule: `studio-bible/studio.md`, Screen list, set Nov 23, 2026). A spec that adds a screen adds its row here. Screens marked **Built before specs** were built from the bible and mockups alone; the next change to one of them needs a spec first.

| Screen | What you do there | Spec |
| --- | --- | --- |
| Title | New game, Continue, Case board, roster and agent codes | 022 (Part 1 writes down how it was built in Demo 1) |
| Pick a team | Pick one of 6 team templates or a Blank team | 022 |
| Your team | Keep, Tweak or Rebuild each seat | 022 |
| Agent creator | 7 steps: Profession, Stats, Skills, Identity, Bonds, Motives, Dossier | 022 (Part 2: pronouns, build, code names) |
| Roster | Put a saved agent in a seat | 022 |
| Case board | Pick a case from the season's cork board | 004, 009 |
| Big Hat's briefing | Big Hat in the scene, two questions, requisition | 013 (each case's spec sets its lines) |
| Map | Walk, talk, use hotspots; lead card, NIGHT tag, A bubble | 001, 005, and each case's part A |
| Dialog box | Talk, signs, narration, questions | `studio-bible/ui.md`, 013 |
| Hotspot skill prompt | Pick who rolls a skill at a hotspot | 006 part A |
| Map menu | Party, Skills, Items, Case file, Log, Settings, Save | 006 part A |
| Party and Dossier | Party cards, Make lead, Dossier, Give item | 002, 006 part A |
| Items | Each agent's items with a detail box | 006 part A |
| Big Hat's recruits | Pick one of 3 ready-made recruits after a loss | 006 part A, 007 |
| Battle | Fight in the shell | 006 part B |
| Game over | Retry from checkpoint or quit to title | 006 part B |
| Debrief | Big Hat's wrap-up, bag or hide, cover story, case gains | 007 |
| Funeral or goodbye | A cutscene for each agent lost or retired | 007 |
| Home phase | One home scene per agent between cases | 008 |
| Season's end and finale | The finale, then the season wraps up | 009, 015 |

## Overview

Black Lantern is a turn-based party JRPG with a cosmic-horror heart, played on a phone. It takes its rules spirit from the Delta Green tabletop RPG. You are the designer and writer; Claude is developer, art director and co-writer. We build in small steps over many chats. Do not produce anything playable without explicit permission. The game has no sound or music: you play it silent.

**Design pillars**

1. **Familiar places that turn horrifying.** Small towns or big cities that are a little off, then dread that escalates. Quirky charm and dark humor first. Tone: grim with gallows humor.
2. **Two health bars: HP and SAN.** HP is the body and heals; SAN is the mind and mostly doesn't. Breaking Points give lasting disorders. Skills, abilities and agent traits can soften or prevent SAN loss, so it never drops like a rock.
3. **A party you build together.** You make a team of 3 agents whose builds work together, or start from a ready-made team template. Party size stays at 3 (confirmed Nov 19, and again after the demo playtest on Nov 23, 2026). The party carries over between cases. A dead or broken agent is gone for good and a recruit takes their place. Game over only if the whole team falls.
4. **Investigation first; fights are rare and dangerous.** Talk, find clues, choose, then fight. Choices matter in the boss fight and the debrief. See Gameplay loop in Systems.
5. **Classic JRPG difficulty.** Fair, with real tension. The demo's Gleaner boss fight is the benchmark: about that hard, not identical.
6. **The screen is part of the horror.** Once the lead agent drops below 40 SAN, colors shift, glitch and whisper.
7. **No mechanics for mechanics' sake.** Every system needs a gameplay stake, in combat or out. If it does nothing, cut it.

**Mature content** (set Nov 19)

Black Lantern is a mature game, in the spirit of Delta Green's content warnings. Cases can and should go to dark places when the story calls for it: graphic violence and gore, body horror, death of innocents, torture, cults, abuse, addiction, suicide, mental illness, grief, and agents doing terrible things for good reasons. The charm and gallows humor make the dread land harder; they never soften it.

- **Shown vs. implied:** most of it can be on screen. Sexual violence and harm to children are never depicted; they happen off screen and are felt through aftermath, evidence and the people left behind.
- **In the pitch:** each pitch card names its heaviest themes in one line, so you know what a case carries before you pick it, without spoiling the twist.

**The legal line**

Black Lantern is for personal use only, never sold. Your lawyer confirmed on Nov 17, 2026 that this use is in the clear. We still keep the Black Lantern branding and original names because they're ours and they're cool. Game mechanics are fair game; Lovecraft's own stories and creatures are generally public domain, but later authors' and Chaosium's additions are not.

| Use freely | Keep out (branding choice) |
| --- | --- |
| Delta Green's mechanics and general ideas: percentile skills, SAN, Breaking Points, Bonds, Adapting, disorders, home scenes, a secret agency, conspiracy, cover-ups | The name "Delta Green", Arc Dream's characters, NPC, book text, art or logos |
| Your own original writing, even if written for Delta Green | Published-scenario characters, towns and plots (swap for originals, see Rename flags) |
| Lovecraft's own creatures and names from his own stories | Mythos material added by later authors or Chaosium |
| Over the Garden Wall's mood: autumn, lanterns, folk tales, gentle-then-eerie | Over the Garden Wall characters, names, songs or recognizable designs |

If something leans on protected names or text, Claude flags it once and offers an original swap.

## Art

The look borrows Stardew Valley's craft (detailed pixel art, sprite proportions, animation) in a darker, more serious key, filled with zany Earthbound and Undertale characters. Stardew is a reference for how things are drawn and move, not for setting: each case's story decides where it takes place, rural or urban or anywhere else. Not chunky 8-bit. Locked Nov 15, 2026.

### Direction

- Inspirations: Hotline Miami, Pokémon FireRed, Stardew Valley, Don't Look Outside, Earthbound.
- Zany designs go to townsfolk, shopkeepers and monsters. Agents stay grounded and realistic.
- Monsters are uncanny before gory. Gore when a story calls for it. Nothing is off-limits thematically. The demo case's example: straw, burlap, stitched smiles, wrong proportions.
- Direction is set at the style level, not sprite by sprite. Claude designs new characters, monsters and sprites within these rules without asking, so you get surprised in play. Only new style rules come to you.
- **One case, one set of art (set Nov 15).** Townsfolk, monsters, maps and battle sprites are made for one case and never reused in another. Big Hat and the player's agents travel between cases. Generic pieces can travel too when they fit any setting (a street light works in a farm town or a big city): basic props, ground and wall tiles, lighting and the sprite-drawing method. Anything tied to a case's theme stays with that case. Generic and holiday or seasonal pieces (pumpkins, autumn trees, snow, string lights) come from the cross-game Shared Shelf (see Shared Shelf below), so several cases can share them. The Asset Library holds case art only, sorted by case (switched Nov 21).
- **Still images by default (set Nov 15).** Art and design mockups are still images. Claude builds something playable or in-engine only when you approve it first.
- **Existing assets first (set Nov 17).** Where a good free or open-source asset likely exists for a generic piece (floor and wall tiles, basic props), Claude checks for one first (CC0 sources such as OpenGameArt or Kenney), recolors it to the palette, and draws its own only when nothing fits. Characters and monsters stay custom.
- **Save every asset (set Nov 19).** Every finished asset Claude makes goes into the Asset Library with its drawing code, filed under its case, or on the Shared Shelf once you approve a generic piece. Art first drawn during a build counts too: before that build's backup, Claude copies it into the Asset Library and flags any generic piece as a Shared Shelf candidate (set Nov 20). Case art still isn't reused in other cases, but it's kept, so fixes and remakes never start from scratch.

### Palette

| Name | Hex | Use |
| --- | --- | --- |
| Ink navy | #1b1f33 | night sky, backdrops |
| Deep plum | #2a2030 | shadows, back rooms |
| Rust | #b5532e | brick, rust, warnings |
| Pumpkin | #d9772b | fire, warm lamp glow |
| Mustard | #d6a43a | lantern light |
| SAN pink | #ff4fa3 | low-SAN warp |
| SAN cyan | #3ff0e8 | low-SAN warp |

This is the base palette, meant to work in any case (Rust and Pumpkin made generic Nov 20). Each case adds a handful of its own accent colors for an individual feel. Character-specific colors live with each character in Cast.

### Faces and sprites

| Element | Rule |
| --- | --- |
| Faces | "Storybook": big eyes with whites, colored irises, glints and lashes, freckles, rosy cheeks, expressive open mouths. More face detail is welcome. |
| World sprites | About 14 × 26 px for agents on 16 px tiles (Wide scale), Stardew proportions (big heads, chunky bodies). Dark outlines and hard shading on the shadow side. The light rim on the lit edge is for portraits and battle sprites only; map sprites skip it because it's too small to read (set Nov 15). |
| Battle backs | About 48 × 60 px: each agent in battle, seen from behind, waist up, three across the bottom of the 240 px screen (set Nov 23, 2026, Keegan's call; replaces the 34 × 44 size from the approved combat mockup). Drawn fresh at this size, never scaled up. Same finish as the enemies: 1 px pixels, light from the upper left, a light rim on the lit edge and a dark outline. Built from the agent's creator parts (skin, hair, build, outfit), so every agent looks like themselves; the lead holds the lantern. Spec 023. |
| Portraits | 64 × 64 px in the dialog box, Undertale/Earthbound style. Plain backdrop in the portrait; the scene shows behind it. |
| Talking | Two-frame mouth flap at 140 ms a frame, in bursts while text types, then a rest. |
| Text | Short lines, typewriter effect, speaker names in caps. |
| Dialog box | "Lantern Bust" (set Nov 15). Navy box with a cream border along the bottom of the screen, 3 lines of VT323. The 64 × 64 portrait stands on top of the box at the map's pixel size, the name in caps on a tab beside it. Signs: tab only. Narration: no tab, lavender text. A blinking ▼ marks advance (set Nov 21). Exact code and colors in the Asset Library under Dialog. |

### Maps (set Nov 15)

- **Camera:** Stardew-style 3/4 top-down. You see building fronts and people's faces.
- **Who walks:** only the lead agent. You pick the lead from the party menu; the lead walks the map and does the talking with townsfolk. The lead carries the lantern at night only; by day it's put away and not drawn (set Nov 20).
- **Scale:** Wide (decided Nov 15). Sizes are under World sprites; Wide was picked because seeing more of the town helps navigation. Faces on the map stay simple; the detailed Storybook face lives in the 64 × 64 portrait.

### Light and mood

- Day and night matter: cozy daylight, dusky gold, then dark night lit only by lamps and the lead's lantern (night only; see Maps).
- Some monsters only come out after dark. How townsfolk change at night is under Townsfolk at night.
- Below 40 SAN, colors sour toward neon pink and cyan, and the lantern's light radius shrinks.
- Battles: big hand-drawn enemy sprites over a static background of the place where the fight started. Layout (approved Nov 20): head-on, the 3 agents seen from behind, inside the GBA shell with the D-pad shown, turn order in a column at one side so it doesn't cover sprites.

### Townsfolk and monsters (set Nov 15)

- **Townsfolk:** a fair mix. About 1 in 3 has one weird trait, Earthbound style (huge glasses, a pet crow, a too-wide grin); the rest are normal people, so the weird stays novel instead of annoying. Storybook faces.
- **Monsters:** no fixed source. Each case's story decides what its monsters are made of, from folk and rural to fully cosmic. Cosmic horror is very stylized, like anime creature design or a scary Pokémon: bold silhouettes, a readable "type," then something wrong.
- **Monster faces:** decided per monster, to fit the case. This means the sprite's face (eyes, mouth, or none). Monsters that talk also get a 64 × 64 portrait in the dialog box; non-verbal ones get written grunts and groans where it fits, and no portrait.
- **Wounded enemies (set Nov 23, 2026, after the demo playtest):** an enemy's battle sprite shows its damage in two steps, at half HP and at a quarter, so you can read how it's doing at a glance even before Identify shows numbers. Each step uses big shapes that read on a phone: a slump or tilt in the pose, torn or missing chunks, dark stains or leaking stuffing at least 3 px across, and a duller color on the damaged side. Never a scatter of single red pixels. What breaks fits the monster (straw spills from the Gleaner, a husk splits, a person bleeds). Each case draws both steps for every enemy with its battle art.
- **Townsfolk at night:** only NPCs touched by the case's weirdness change at night; normal people stay normal. The story decides, and a change is skipped if it would spoil that someone was secretly affected. Treatments: subtle tells on the same sprite (eye glints, stiller poses), separate night sprites, or changed behavior only.
- **Where it's set:** a case's pitch names its monster theme and its night treatment.

### Shared Shelf (switched Nov 21)

Generic and seasonal art comes from the cross-game [Shared Shelf](https://claude.ai/artifact/Jmv2FBeGHXczqy7juZW8dL), which Rushlight uses too. Its pieces draw from palette slots, so Black Lantern paints them with `SHELF.use(PALETTES.blacklantern)`. The shelf is add-only: a fix arrives as a new version beside the old one, and Black Lantern stays on the versions below until Claude moves it, checks it against the street test, and logs it in the Changelog.

| File in use | Piece |
| --- | --- |
| `shared-sprites-method-v1` | Sprite-drawing method |
| `shared-sprites-person-v1` | Person template |
| `shared-props-streetlight-v1` | Street light |
| `shared-props-bench-v1` | Bench |
| `shared-tiles-dirtroad-v1` | Dirt road |
| `shared-tiles-boardwalk-v1` | Boardwalk |
| `shared-tiles-sidewalk-v1` | Stone sidewalk |
| `shared-tiles-grass-v1` | Grass |
| `shared-tiles-fence-v1` | Picket fence |
| `shared-tiles-wall-v1` | Walls: brick, siding, batten |
| `shared-tiles-roof-v1` | Roofs |
| `shared-tiles-window-v1` | Windows |
| `shared-tiles-door-v1` | Doors: panel, barn |
| `shared-tiles-awning-v1` | Awning |
| `shared-effects-dusk-v1` | Dusk lighting |
| `shared-props-pumpkin-v1` | Pumpkin (autumn) |
| `shared-props-pumpkinpile-v1` | Pumpkin pile (autumn) |
| `shared-props-jackolantern-v1` | Jack-o'-lantern (autumn) |
| `shared-props-haybale-v1` | Hay bale (autumn) |
| `shared-props-autumntree-v1` | Autumn trees (autumn) |
| `shared-effects-leaves-v1` | Falling leaves and litter (autumn) |
| `shared-tiles-summergrass-v1` | Summer grass, green and dry (summer) |
| `shared-props-summertree-v1` | Summer trees (summer) |
| `shared-tiles-drydirt-v1` | Dry dirt: cracked and gravel (summer) |
| `shared-effects-heat-v1` | Heat shimmer (summer) |
| `shared-effects-sodium-v1` | Sodium night light |
| `shared-tiles-storefront-v1` | Flat-front storefront |
| `shared-props-signblank-v1` | Sign blank, with a 3 × 5 letter set |
| `shared-props-watertower-v1` | Water tower |
| `shared-props-trafficlight-v1` | Traffic light on a wire, blinking |
| `shared-props-gaspump-v1` | Gas pump |
| `shared-tiles-ranchhouse-v1` | Ranch house |
| `shared-tiles-porch-v1` | Porch |
| `shared-props-mailbox-v1` | Mailbox |
| `shared-props-sedan-v1` | Sedan, two facings, any color |
| `shared-tiles-parkinglot-v1` | Parking lot: asphalt with painted lines |
| `shared-tiles-floor-v1` | Floors: lino, carpet, wood, tile |
| `shared-tiles-innerwall-v1` | Inner walls: plain, paneled |
| `shared-props-counter-v1` | Counter |
| `shared-props-tablechairs-v1` | Table and chairs |
| `shared-props-desk-v1` | Desk |
| `shared-props-bed-v1` | Bed |
| `shared-props-shelf-v1` | Shelving |
| `shared-props-stringlights-v1` | String lights (fair) |
| `shared-props-booth-v1` | Game booth (fair) |
| `shared-props-ferriswheel-v1` | Ferris wheel, still and turning (fair) |

Added Nov 23, 2026 for Good Manners (spec 012): the 25 pieces above from `shared-tiles-summergrass-v1` down, with six new palette slots (leaf, dry, sodium, asphalt, lino, carpet). The Shelf page is at version 1795453242-e9c0, 48 pieces.

Not used: `shared-ui-shell-v1` and `shared-ui-dialog-v1` (Rushlight's). Black Lantern keeps its own GBA shell (Tech, Screen and controls) and Lantern Bust dialog box (Faces and sprites).

### Season 2 look (approved Nov 25, 2026)

Keegan approved [`specs/season-2-look-mockup.png`](specs/season-2-look-mockup.png) (source [`specs/season-2-look-mockup.html`](specs/season-2-look-mockup.html)), drawn on the approved night street (spec 005). Three frames: Season 1 today, a regular Season 2 case with the yellow creep, and Carcosa.

- **Yellow creep (regular cases):** the base palette stays. Lamp and window light turn tarnished and pallid instead of warm mustard, a faint yellow film sits over the scene, and small signs show up in the dressing: a chalked sign, a playbill, a yellow rag, a townsperson's glasses catching the light. Small and easy to miss early in the season, more of it as the season goes on. Each case's spec says how far along it is.
- **Carcosa (where the story calls for it):** a grey lake under black stars and two low suns, dark towers with tatters on the far shore, and something from home (in the mockup, a half-sunk street lamp) so it still feels like somewhere you've been. The NIGHT tag reads `???` there.
- **Always readable:** the lead's lantern lights as usual in both, and text, the HUD, people and usable things are never hidden. Low SAN still sours toward SAN pink and cyan on top (Light and mood).
- **Signs are our own:** every sign, glyph and playbill is drawn fresh. Nothing copies the Yellow Sign as Delta Green, Chaosium or other later works drew it (Story → Season 2).

| Name | Hex | Use |
| --- | --- | --- |
| Tarnished | #b0962e | creeping yellow light, rags, tatters, the smaller sun |
| Pallid | #e6da8c | pallid lamp and window light, the larger sun, glasses |
| Pallid glow | #f4eebc | lamp and sun hot spots |
| Bruise | #120d14 | Carcosa's towers and black stars |
| Lake | #56636a | Carcosa's lake |

### Reference mockups

Approved stills, saved in Drive under [Black Lantern/mockups](https://drive.google.com/drive/folders/1KXRes_4wDMlTF4EfS9phaWWxUJIQzuR1) (moved from project files Nov 20). Builds match these first.

- [combat-mockup-shell.html](https://drive.google.com/file/d/1MyVtgKdzfwnNiugMhIvhNowJa6xgKVjv/view): battle screen (Nov 20)
- [map-mockup-shell.html](https://drive.google.com/file/d/19WJz7_o1rLPZa0JtCSR9YxEeK8q8qKHd/view): On Map screen (Nov 20)
- [party-menu-mockup-shell.html](https://drive.google.com/file/d/1pOLrP7by3kSMf_bzj0Rv5THbVEV6Lqgf/view): party menu (Nov 20; the card faces are too hard to read, fix in the build)
- [dossier-mockup-shell.html](https://drive.google.com/file/d/18n5-v_uRQEHpebwFYwYhN1s2QAE0Ls9R/view): agent dossier (Nov 20)
- [case-board-mockup-shell.html](https://drive.google.com/file/d/1d7TR1PwBgX9AZN-y0rk8spBwdEqCq_SR/view): case board, option A (cork board) chosen, B shows the list fallback (Nov 21)
- Agent creator, 5 screens (Nov 21): [1 Pick a team](https://drive.google.com/file/d/11J9qq7vRrCAHn9FKqilH-LQJLVYonUOB/view), [2 Your team](https://drive.google.com/file/d/1FtyaMGRLQn1d6c7QuJTJLBf1Ifr3Jbvg/view), [3 Skills step](https://drive.google.com/file/d/1oMD1ztzdF6aIzk3JM1TYpn5zX64HJXwc/view), [4 Bonds step](https://drive.google.com/file/d/1R3oPff8TnOs2ZJgzuNBXVu3iUI0t1mrc/view), [5 Motivations step](https://drive.google.com/file/d/1tI6zyvpk0Pj8kPv7X8M4KPwHTdnBa7V5/view). Profession, Stats, Identity and Dossier steps reuse the same 7-step frame. Portraits on Your team are 32 × 32 Storybook faces (the detail level to match); the names and skill numbers shown are placeholders.
- [debrief-mockup-shell.html](https://drive.google.com/file/d/16_gqcRTTopHqYL-kdFOjzDRy84RGOv0Z/view): debrief and case gains, 4 screens in play order (Nov 21): Big Hat's debrief with the case wrap-up card over the back-room scene, bag or hide case items, cover story (pick the story, then who tells it, with the overstepping track on top), then skill gains with the die shown and new unlocks flashed. Names, items and numbers are placeholders.
- [home-phase-mockup-shell.html](https://drive.google.com/file/d/182nLvVuvOsqCdTYr2RHZv6353Uqxleer/view): home phase, 4 screens in play order (Nov 21): one choice per agent with the team strip on top (unusable choices greyed with the reason; Use hidden unless the agent has Addiction), Bond picker with score bar and mood, the scene in the Lantern Bust box over a per-Bond-type backdrop, then a result card that calls out mood changes. Names, numbers and lines are placeholders.
- [night-map-mockup-shell.html](https://drive.google.com/file/d/1_mzOmFtxO6s6J8BWqVtsNEwGTjk5L-w8/view): night and low SAN, 2 frames of the On Map street (Nov 21): normal night at SAN 61 (only the street lamp and the lead's lantern light the street), then the same spot at SAN 32 with shadows soured to cyan, warm light to pink, the lantern's circle about a third smaller and the SAN number in pink. Colors only: no extra creepy tells at low SAN (decided Nov 21); case stories can add their own.
- [season-2-look-mockup.png](specs/season-2-look-mockup.png): Season 2 look, 3 frames (Nov 25, 2026): Season 1 night, the yellow creep, Carcosa
- [024-seasonal-board-mockup.png](specs/024-seasonal-board-mockup.png): seasonal case board, Season 1 and Season 2 with three cases closed (Nov 25, 2026; approved with season pieces allowed over card edges). Season 2's cards are placeholders
- [street-test.html](https://drive.google.com/file/d/1uQ2ZxcPTplE_CV6AEL-UA5i45meUnHmK/view): Wide-scale street test, the source of the Shared Shelf's v1 pieces

## Cast

Big Hat is the only character who appears in every case; his 64 × 64 calm and shout portraits are approved. Each case's townsfolk and monsters belong to that case only; the demo case's art lives in the Asset Library. Add each new character here with the same fields.

### Big Hat

| Field | Spec |
| --- | --- |
| Role | The agency's only handler. Replaces Wren. Gives the briefing before every mission and the debrief after it, in the same back-office scene. |
| Intros | Cutscene style: Big Hat large and center screen, subtitled lines, and dialog options. The options must do something, such as unlocking extra intel. |
| Personality | Deadpan, serious, eerie, with sudden unhinged outbursts. Folksy and profane, with cold spy-agency triage. Serious-but-funny throwaway lines. |
| Tone reference | Mr. Boss from Smiling Friends, for tone only, never design. |
| Age and face | His 30s. Strong square jaw, chin cleft, dark stubble. Dark brown horseshoe mustache. A toothpick that switches sides. |
| Shadow | The hat brim's shadow covers his face down to the mustache. You never see his eyes; two pinprick glints appear rarely. |
| Outfit | Small body in a leather vest over a cream shirt, turquoise bolo on a silver slide. Huge ten-gallon hat with a cattleman crease and a turquoise concho on the band. |
| Hat size | Locked at the current size. The hat-grows-each-chapter gag is dropped; remove it from the game code. |
| Shout | Portrait shakes, mustache flares, mouth opens wide, toothpick flies off, red marks flash. In game the screen also shakes and flashes red. |
| Backdrop | Plain in the portrait. The scene behind him changes with each mission's intro: every case spec names its own place, somewhere odd near the case's road, and part A draws it as the briefing backdrop in the back room's layout (set Nov 23, 2026). The debrief plays in the same place as that case's briefing, not back at the donut shop (Keegan, Nov 23, 2026); a case's part B builds it there. Demo case: the back room of a 24-hour donut shop off I-5 (crullers, flickering tube light, corkboard with a scarecrow photo). |
| Sound | None; the game has no audio. |
| Lines | "Sit." · "Don't make it weird." · "You were awake." · "Be smart, be careful, don't get burned." · "Put a bow on this." · "I don't do paperwork on a Sunday." · "Not in my jurisdiction." |
| Colors | Hat felt #7a5a34, hat shadow #3a2814, vest leather #6b3a22, bolo turquoise #3fb8a6, skin #c98a62, mustache #4a2e1c, brim shadow #0c0a10 |
| Code | Portrait drawing code lives in the Asset Library. In game: `bigHatScene(fn)` and `shout(text)` in Script 2. |

### Next characters

- Recurring characters who appear regardless of party are where you have a hand. For each one, and for anyone adapted from your own writing, Claude asks whether you want to design them or leave it to Claude. You don't want to design every character.

## Story

**Overarching story (decided Nov 17).** Cases can be played in any order, so two threads tie them together: first an agency-level arc that advances by how many cases you've closed, not which ones; later, personal arcs for each agent through home scenes and motivations.

**Agency arc (set Nov 19).** The game runs in seasons. Each season has its own cork board of cases you can tackle in any order. Special agency cases unlock on that board after a set number of cases are closed (any cases, any order), and the last one is the season's finale. Agency cases don't count toward the next unlock. Regular cases still open when the finale closes carry over to the next season's board as open cases (set Nov 22, spec 009). Claude wrote the season's story and keeps it in the project file claude/SPOILERS-agency-arc.md, which you don't open; that file wins over this doc only on arc secrets. Claude quietly adds small arc touches to regular cases when building them; they never appear in pitches, this doc or the Changelog. Personal arcs run alongside it, one per agent per season (see Personal arcs in Systems).

**Agency backstory (set Nov 19).** Black Lantern's history is The Federal Group's from your Group Stories. In the game the agency is only ever called Black Lantern; nobody in-world says "Federal Group".

- **Founding:** in 1928 the government's first brush with Outside Entities, a botched raid on Innsmouth, Massachusetts, was passed off to the press as Prohibition arrests. President Coolidge founded the agency that year as an autonomous group inside the government, gave up oversight and destroyed the founding records before Hoover took office. Agents credit that secrecy for there never being a public disaster.
- **Today:** it quietly recruits from public and private life to track, destroy and cover up Outside Entities, the agency's word for the unnatural. Most recruits have already brushed against one, and turning the offer down can be fatal. An agent's average life in the field is 4 years.
- **Field names:** agents go by field names, often pop-culture puns (Raine, Mickey, Jerry, Ahab), and each decides how much of their real life to share.
- **Units:** teams carry a founding name until they're wiped out; a fallen member is replaced by someone with similar skills.
- **Big Hat:** legally doesn't exist; nobody learns his backstory. His thick country accent may be fake, and agents suspect the huge hats keep anyone from describing his face. He hands out gear in absurd packaging, like pink Walmart gift bags. His look stays as set in Cast.

**Case board.** You pick a case from a board, which opens Big Hat's briefing for it. Each case is a self-contained module. The board is a cork board of pinned case cards (decided Nov 21; mockup listed in Art, Reference mockups). Each card shows its file number, title and town; the D-pad moves a cursor between cards, and the selected card opens a description box at the bottom (place, a two-line hook, A for the briefing, B to back out). A closed case is stamped CLOSED, then moves to a CLOSED pile in the board's corner; A on the pile lists every closed case (set Nov 22, spec 009, replacing "closed cases stay pinned"). The board always shows six open regular cases: the rest of the season's cases wait in a hidden queue, in the season data file's order with no randomness (Keegan, Nov 23, after the demo playtest), and when one closes the next pins into its spot, until the queue runs out (Keegan, Nov 22). An open agency case pins in the bottom row, over Big Hat's sticky note, one at a time, beside the pile and the memorial plaque. The board always fits, so there is no plain list. When a case closes, the next case from the queue takes its spot and the other cards stay put (the season save keeps which case sits in each spot), and the agency folder pins in the bottom row's right spot (accepted Nov 23, 2026 from the Developer's logged calls). Finishing a case goes straight to the board.

**Seasonal look (Keegan, Nov 25, 2026; spec 024).** The board stays the same each season, but carries the season's feel, and not only in color. Each closed case leaves one of its own keepsakes where its card hung, with a season piece beside it, so the board fills up as the season goes; season pieces may hang over card edges, never over text. Every season also has something small that moves and a Big Hat sticky note that changes as cases close. Seasons that suit it make the board act a little wrong (a crooked card, a moved pin, a title that garbles for a moment), always readable. Each season has its own board colors, the same all season; Season 1 keeps today's. Keepsakes only show what you've already seen.

### Season 2: The King in Yellow (set Nov 25, 2026)

Keegan's call: Season 2 is inspired by the Delta Green campaign *Impossible Landscapes*, built as our own King in Yellow season.

- **Sources:** Robert W. Chambers' *The King in Yellow* (1895) and Ambrose Bierce's Carcosa are public domain and free to use: the play, the Yellow Sign, Carcosa, Hastur as Chambers and Bierce wrote them. From *Impossible Landscapes* we take only its tone: reality that bends, time that slips, people losing who they are. Its plot, people, places, text and part structure stay out, as do later authors' and Chaosium's additions (see Rename flags). This repo is public, so nothing of it is quoted here or anywhere.
- **One season, one story:** every case builds on the others, and the agency arc is the spotlight. Cases still play in any order on the board as in Season 1; what you find and choose in one case leaves a mark on later ones, and the agency cases pull it together.
- **Secret story:** Keegan stays surprised, as in Season 1. The Developer writes the agency arc and the season's personal arcs in `story/`, drawing on Keegan's own notes from running the campaign (kept in the project's private files, never in this repo).
- **Losing yourself:** no new meter. It runs on SAN, Bonds and disorders (Systems), with the screen garbling names and faces, as pillar 6 already allows. Text, the HUD and usable things stay readable.
- **Reality shifts:** entirely story dependent. Each case decides whether and how its maps and time shift, and its spec says so. A shift never strands the party (Gameplay loop, Deduction; `studio-bible/play.md`).
- **The look:** in regular cases a tarnished yellow creeps into the base palette; Carcosa itself (twin suns, black stars, tatters) shows where the story calls for it. Rules and colors are in Art → Season 2 look.
- **When:** design work now; building after Season 1's agency cases and finale.

The demo case, "Operation Still Harvest," is built and playable. It's the test build, not a chapter one.

### Demo case: Operation Still Harvest

Marrow Creek, Oregon, during the Harvest Lantern Walk.

1. **Briefing** with Big Hat in the donut-shop back room off I-5.
2. **Town investigation:** 5 clues, 3 needed to proceed.
3. **Committee Volunteer** fight.
4. **Dark corn maze** with roamers in a danger zone, loot and a lore note (no random encounters, per Gameplay loop).
5. **Victims:** 3 people tied to scarecrow poles who can be cut down. The maze has a route to all three that never passes the Gleaner's clearing, so you can free them and explore the rest before you choose to face it (Keegan's demo playtest, Nov 23, 2026). The clearing is a dead end with one way in and a 5 × 5 open middle (was 7 × 7; its edge became the hedge that closes it off, kept Nov 23, 2026).
6. **Boss: The Gleaner**, a figure of harvest straw with a lantern for a head. It gets weaker for each victim rescued.
7. **Debrief** with Big Hat, a cover-story choice, then a home scene choosing a Bond. The agent's new SAN and disorders save to the roster.

Every case uses this breakdown as its template: briefing, investigation, fights, set pieces, boss, debrief. A case can break the pattern on purpose now and then.

### Adding a new case

Cases start from your DG notes or take them as inspiration (set Nov 19). You sign off on one thing, the pitch; everything after it is a surprise in play. Reworked Nov 22 for the studio repo, where everything public is readable by anyone, so each step names who does it and where it lives.

1. **Gather seeds (Designer).** Draw on Case seeds and Flavor below, and swap every ⚠ name and any published-scenario material for originals. The full notes inventory (claude/evernote-dg-notes-inventory.md) stays in the Black Lantern Claude Project files.
2. **Pitch (Designer).** Pitches go in `games/black-lantern/pitches/`, one file per round, and are public-safe: title, setting, a one-paragraph hook with no twist, the monster theme, the night treatment, its heaviest themes (see Mature content), open or quiet case (see Overstepping), and which seeds it uses. Arc touches never appear here. A round pitches 3 options for one board spot; you pick one per round, on a card in the project.
3. **You pick one.** Your only sign-off. If a pitch is flagged as too big for 1–2 hours, you also choose: trim it to one case, or split it into Part 1 and Part 2 (Part 2 unlocks after Part 1). Unpicked pitches stay in the round's file and can come back in a later round.
4. **Case spec (Designer).** A public-safe spec in `specs/`, made from `specs/case-spec-template.md`: the card text, setting and maps by name, the day and night plan, how many story fights and danger zones, threat skulls and how many enemy types, the 8–10 skills it calls on, which motivation types its 1–2 moments aim at, open or quiet, its ending labels, its art needs (Shared Shelf first), and its season slot. Like spec 006, it names no culprit, twist, solution or hidden clue.
5. **Case file (Developer, secret).** At the start of the story build, the Developer designs the rest in `games/black-lantern/story/cases/<case>.md` (since Nov 23, 2026; before, the Claude Project files), which you don't open: twist, internal logic, clue IDs, the choices that matter, enemy cards, the boss with phases and a weakening choice, and any arc touches. Every deduction must map to clue IDs. Nothing public quotes it.
6. **Build in two parts (Developer)**, one session each, like Demo 4 and Demo 5: (A) maps and art, with the case's own art on its own Asset Library page and anything generic proposed to the Shared Shelf only with your OK; (B) story and play, with every line written in your voice (see Voice) in the case's text block, no review before play.
7. **Ending.** Debrief with Big Hat, a cover-story choice, the home phase, and a saved SAN outcome; the boss and ending react to choices (specs 007 and 008).
8. **Check and ship.** Boss tuning check, `npm run check` at all three sizes, and the playtest checklist. The case joins the season's queue in the season data file (spec 009). You play it first on Dev; what you find goes to Bugs or the Ideas inbox. The Designer runs a rules check against its spec (`studio-bible/rules-checks.md`), and it reaches Release when you say so. Release keeps the last finished build until a case's part B is done, so a part A stand-in case never ships to Release (Keegan, Nov 23, 2026).

**Agency cases** skip steps 2 and 3: they come from the secret arc file, so no pitch is shown. Their case spec is a public frame (set Nov 22, spec 014): the card style, the case's size limits, the boss rules and the build steps, with no place, title or cast. The Developer writes the case file (step 5) at the start of part A, since the place, maps and art come from it, and public text names the case only by its LANTERN number.

### Your original material

Summarized from your Evernote notes: the notes you used to run Delta Green games at a game store about five years ago, much of it your own custom material. There's no canon to protect except the agency's own lore; unexplained things happening is part of the idea, and each case just needs an internal logic that holds together. Design rules from these notes now live in Systems. Names marked ⚠ get swapped before use.

**Flavor** (small details to drop into any case)

- **Era:** present day by default, with current pop-culture texture, unless a case is set in another era on purpose.
- **Small-town color:** a glassy-eyed neighbor walking her dog who'll remember you if cops come; a dog that barks from the second you enter; a shrieking ceiling fan; a sketchy rural gas station; a tinted black car that tails you for an hour, then vanishes; a grandkid's stick-figure "grampa" drawing on a dead man's fridge.

**Case seeds** (story ideas waiting for a case)

- **The patron's house:** one story built from several notes. Seven-day diary: reading a dangerous diary takes 7 days, one revelation per day, and the haunting escalates daily. Leaving town is punished (phones ring in dead voices, flights grounded, tires flat). One agent grows obsessed with the place; the final page breaks it. The expulsion ritual demands a human sacrifice. Walking away means the house number follows you everywhere. Diary voice: a widow healed by a mysterious woman; her joy curdles as she learns who the "patron" is, she refuses to sign the book, and her dark half lives in the mirrors. Fallout: an abusive priest's murder is pinned on three grieving brothers whose youngest died by suicide; the nation sides with the brothers, and lingering questions point back to the haunted house. Strong debrief or cover-story material. ⚠ Rename all characters, the house, the town and the patron entity.
- **"WE KNOW" tape:** a cursed found-footage case. A VHS of a sick, sore-covered club dancer moving with impossible force while someone off-camera chants.

* **Apt# 432:** in Austin, a widower who buys dead strangers' belongings unboxes an occult collector's lot, notebook #83 included. A blind, one-eyed larva hatches, grows and wants out. The scene is sealed as pest control and the neighbors are cleared out.
* **Classic abduction:** a couple's lost night, Betty-and-Barney-Hill style. Hypnosis recovers it, a medical exam finds an implant, research ties it together, and the job may end with the abductees killed.
* **Bad neighbors:** something lives in an apartment complex; deal with it without the rest of the building finding out.
* **Men in black:** small-town callers report two men in black suits and shades following them. No eyes, no body heat, broken grasp of language, anatomy almost human. They seem to be learning how to be people.
* **Missing agent:** an agent doesn't answer the call. He'd been studying Outside Entities to fight fire with fire, and something tried to use him as a host.
* **Bad pregnancy:** a woman's ultrasound shows something badly wrong. She agreed to it at the time; now she wants it reversed and a normal baby.

**Rename flags**

Even with legal clearance, we keep Black Lantern's own names and branding.

| Protected | Swap to |
| --- | --- |
| Delta Green, the Program, A-Cell, Friendlies | Black Lantern equivalents |
| Green Box | "Lantern Box" (stash site) |
| Nyarlathotep / the Dark Man | Nyarlathotep himself is Lovecraft's and usable; the Dark Man as Delta Green wrote him becomes an original patron entity (the folk "dark man with a book" archetype is fine) |
| Published-scenario characters, addresses and towns | Original names and places |
| Impossible Landscapes material | Swap for originals; The King in Yellow (1895) itself is public domain and usable |

## Voice

Every line should read like your fiction (set Nov 19): real people saying specific, crude, funny things while something wrong arrives sideways. Grief and found family are the heart; the jokes are how people survive it.

**Who's talking**

- Narration sits on someone's shoulder and borrows their mouth ("Uselessly Slow Postal Service", "Filth the Bar"). It changes register with the person: a stoner's run-ons, a trucker's "Yes, sirree", a four-year-old filing away a new bad word to ask about later.
- Thoughts cut into the narration as short asides: "Real nice, Rosie." "Okay, asshole."
- People sound like where they're from: Texas, Cajun, small-town Southern, big-city tired. Nicknames beat names (Ma and Pa, Doc, Hendy, "BH"), and regulars are known by their drink order.
- Insults are how family says love: "dipshit", a middle finger for hello, a mother saying "Children" on reflex. Threats come out light.
- Big Hat is the exception: absurd to look at, never a joke to his face. People mock him after the door closes.

**Joke pacing**

- The setup is mundane; the punch is the most specific detail. A brand, a number, a show: Rumpleminz as "Bartender's Mouthwash", Paul Blart on a hospital TV, 23 taxidermied cats.
- Two normal things, then a wrong one (your 1, 2, 3… PUNCH). In the game, the box break is the beat: the setup ends a box, the punch opens the next.
- Throwaway asides land as a tacked-on beat or their own short box, never in parentheses (people don't talk in them): "Police came. An ambulance. And a fire crew, for some reason."
- People stay petty and ordinary inside the horror. A pastor drafts sermon titles while he's being beaten. The worse it gets, the more mundane the inner voice.
- Jokes come from people coping, right up against the worst moment. The narration never sneers at a victim or a grieving person.

**How dread arrives**

- Sideways, during an errand: a detour to a used bookstore, unboxing a package, a text from Mom deleted unread. Never announced.
- In the body first: blood in a cough, a cold sweat, a book too heavy to hold, fingertips that won't wash clean. Then the mind fogs and explains it away ("probably an old cookbook").
- Compared to ordinary fears, not dressed in adjectives: like the phone ringing when you know it's bad news. No "eldritch", "unspeakable" or "indescribable".
- One wrong detail, stated flatly and never explained: the rat on the cover that isn't dead yet; the thing jiggling the door handle.
- A refrain that comes back changed: "Do you know your lines?" every night, then "You're on." on a sticky note, then a chant. Or strangers in different scenes giving the same warning: "Don't let him inside."
- One way it gets in: through a wound. It talks like a friendly good ol' boy ("friendo", "Close enough") and offers what the person is missing: approval, a family, God's love. They go willingly, and that's the horror. Scripture sounds wrong in its mouth: "Well done, my good and faithful servant."
- Defying it costs something small and petty first: skip the outfit the dream laid out, and the coffee lands on your chest.
- Now and then the narrator knows how it ends and says so in one flat line: "Rosa didn't talk to him later that night, or ever again."
- After the worst, cut to procedure: the coroner, tape across the door, no next of kin, a TV special years later. The worst news gets the flattest sentence.
- Small graces balance it: the snow stops; the stranger who pulls over is the drunk's son; a cat sleeps beside the baby for thirteen years.

**In the dialog box**

- One thought per box, 3 short lines at most. Long confessions split across boxes where the breath would.
- Present-day texture: real brands, phones, streaming shows, gas-station food, Whataburger.
- Characters lie, ramble and dodge. Clues hide inside what people want to talk about, not in what they're asked.
- Animals and kids notice it first and understand it least: the cat on the edge of the tub, the kid in the booster seat. What they can't name, the player can.

**Sample lines**

| Who | Line |
| --- | --- |
| BIG HAT, briefing | Man in Toledo bought a dead woman's recliner online. Recliner's fine. |
| BIG HAT, briefing | Your cover is pest control. Don't eat anything that's already been opened. |
| BIG HAT, shout | DID I SAY WRITE THAT DOWN? |
| BIG HAT, debrief | Fire marshal says bad wiring. Fire marshal's right. Sit. |
| Bar regular | Jukebox played that song three times tonight. It's been unplugged since '09. |
| Agent banter | You call me sport one more time, you're carrying the body bag. |
| Possessed townsperson | Oh, you're not done yet, friendo. Sit back down. |
| The thing, tempting | They never clapped for you at home. Here, they'll stand. |
| Refrain, first night | Somebody left the porch light on for you. |
| Refrain, last night | Somebody left the porch light on for you. The house burned down in '98. |
| Narration, day | The gas station sells bait, scratchers and a hot dog that's been turning since the last election. |
| Narration, night | The dog on the porch has stopped barking. It's still looking at you. |
| Narration, low SAN | Your hand is on the doorknob. You don't remember deciding to open it. |
| Narration, foreshadow | You'll think about this door a lot, later. |
| Debrief narration | County calls it a gas leak. Four names on the plaque. One spelled wrong. |

Read in full for this guide: Yellow (draft 3.1) and Bar Flies (first draft, through your outline notes). Also read: Nine of Swords, Five of Pentacles and everything in The Group Stories folder.

## Systems

HP and SAN are two health bars: HP heals, SAN mostly doesn't. Combat is purely turn-based and menu-driven (abilities, weapons and more), in Super Mario RPG's head-on layout. Combat rules live in the Combat tab.

### **Gameplay loop** (set Nov 18)

- **Case length:** 1–2 hours over a few phone sittings.
- **Fights:** 2–3 placed story fights plus the boss per case. No random encounters. A case can break this on purpose.
- **Danger zones:** 0–2 per case, set by the story, day or night. Roamers walk them in plain sight.
- **Roamers:** each guards something (a clue, a victim, a shortcut, a stash). Fight it, sneak past with a roll, or take another route. Loot drops 20% of the time, always when the drop is story-related.
- **Fleeing:** roll to flee roamers. Story fights and bosses are committed.
- **The boss waits for you (set Nov 23, 2026):** a boss fight starts only when you choose to go to it. Every victim, clue, stash and danger zone in the boss's area can be reached without walking through the boss's spot, and the last step in shows a "go in / not yet" choice. In the demo playtest the maze's paths ran through the Gleaner's clearing, which started the fight before you could do everything.
- **Clues:** the story picks the style. Default is threshold plus bonus (need some to move on; extras weaken the boss, add intel or open debrief options) or clues as keys (specific clues open specific places or dialog), whichever fits the theme.
- **Deduction:** never a dead end. A wrong answer costs SAN, time or a better ending, never progress. Claude checks every deduction maps to clue IDs before building.
- **Time:** story beats turn day to night by default; some cases add a clock on purpose.
- **Turning the day is your choice (set Nov 23, 2026, from the pre-season review):** a story beat that moves the case on to the next part of the day (day to night, night to the next day) is a point of no return when it closes places or people you can't reach again (`studio-bible/play.md`). So it waits for you: the beat shows a "Go on / Not yet" choice with the cursor on Not yet, and one line naming what closes ("The morgue closes for the night."). Not yet leaves you where you are. A beat that closes nothing needs no choice. Each case spec lists its turns and what each one closes.
- **Choices:** how far they branch varies by case. Most branch and rejoin; a few go big on purpose. Choices are remembered for the boss and debrief.
- **Healing:** meds and First Aid (once per wound) in the field, plus a full rest at a few story safe spots.
- **Saving:** one save slot. Autosaves at checkpoints and on close, and you can save anytime. No going back; deaths stick.
- **Game over:** if the whole team falls, you build a new team, the case reopens and the agency arc keeps its progress.

### **Sanity**

- SAN loss is permanent-ish. Breaking Points give lasting disorders, unless the agent gives up a motivation or leans on a Bond instead (see Motivations and Leaning on a Bond).
- **SAN hits (set Nov 18):** a horror calls for a SAN roll against current SAN, tabletop style: pass loses a little, fail loses more. Loss sizes follow the SAN loss table below (tabletop levels, capped at 1d6/1d10); the defenses below do the softening. Only one halving applies per horror (bracing, Steadying or an Occult perk), so they never stack. Target: a typical agent loses about 6–10 SAN per case, so they last about 5–7 cases before needing a Sabbatical.
- **Who rolls:** on the map, only the lead agent (the one walking and looking). In cutscenes and battles, all 3 agents roll.
- **Bracing:** before a horror you know is coming, an agent can brace. It costs 1d4 Willpower Points and halves any SAN lost from that horror. In battle it also uses the agent's turn; on the map it costs no time.
- **Willpower Points (WP):** equal to POW. They refill at story rest spots along with HP, and fully between cases. Bracing is what gives WP its stake.
- **Steadying:** an agent with 40% or more in the people skill (Empathy) can roll against it to shrink a teammate's SAN loss. A critical success cancels that SAN loss entirely. Otherwise it halves the loss, once per horror (see Empathy under Skill unlocks).
- **Leaning on a Bond (set Nov 20):** only at a Breaking Point, as a third choice beside taking a disorder or giving up a motivation. The agent picks one Bond; it loses 1d6 and the disorder is skipped. They're still Shaken. Leaning can't take a Bond below 1, and a Bond at 1 is greyed out, so a Bond never breaks this way. There's no prompt on ordinary SAN losses. It plays one straight line naming the Bond ("Dale calls his brother at 3 a.m. and can't say why."), and the Bond's lower score sets the mood of its next home scene.
- **Adapted (set Nov 19):** each SAN loss from violence marks a violence box, and each loss from helplessness marks a helplessness box (a pass that loses 0 doesn't mark). At 3 marks the agent is Adapted to that kind: from then on their SAN rolls for it pass automatically, so they lose only the pass number (0 for the two lowest tiers). Getting Adapted costs every Bond 1 point and plays one straight line ("Marisol doesn't flinch anymore. Her sister notices."). A Breaking Point caused by a kind wipes that kind's marks. The unnatural never adapts. The party menu shows the marks as pips. (Cold-blooded is cut; Adapted to violence covers it.)
- **Recovery** has two routes, side by side: Bonds (home scenes heal through them; leaning on one at a Breaking Point wears it down) and Sabbatical. On Sabbatical you choose 1–3 cases for the agent to sit out in psych care while a recruit fills in; each case sat out restores +1d6 SAN and has a 40% chance to cure one disorder of your choice (set Nov 20). When the agent comes back, you choose who keeps the seat, the agent or the recruit who covered; the other goes to the roster (set Nov 22, spec 008).
- An agent at 0 SAN or dead is lost for good (see Losing an agent).

### **SAN loss table** (set Nov 19)

Every horror a case writes gets a tier and a kind. The agent rolls SAN: a pass loses the left number, a fail the right.

| Tier | Loss | Examples, by kind |
| --- | --- | --- |
| Unsettling | 0/1 | Violence: a corpse, a bloody crime scene. Helplessness: a victim's family grieving. |
| Disturbing | 0/1d4 | Violence: a mangled body, being badly wounded, killing in self-defense. Helplessness: being trapped or tied up, hearing someone die out of reach. Unnatural: a strange symbol, an animal acting wrong. |
| Severe | 1/1d6 | Violence: killing a fleeing or helpless person, seeing a teammate or innocent killed. Helplessness: failing to save someone you could have, a Bond breaking. Unnatural: a ritual site, an impossible object, a page of an unnatural text. |
| Shattering | 1d4/1d8 | Unnatural: seeing a monster clearly, learning what's really going on. Violence: a teammate torn apart in front of you. |
| Boss | 1d6/1d10 | Unnatural: the case's final reveal, face to face with the thing behind it. At most one per case. |

- **Order of softening:** roll the loss, apply one halving if any (bracing, Steadying or an Occult perk; round down), then Drunk takes 1 off. Never below 0.
- **Once per horror:** an agent rolls for a given horror once per case. Walking back past the same corpse costs nothing.
- **Case budget:** a typical case has about 3–5 Unsettling or Disturbing horrors, 1–2 Severe, 0–1 Shattering, and the Boss. Claude checks each case against the 6–10 net SAN target when writing it. The numbers get tuned in the Still Harvest playtest.
- **Breaking Point:** starts at SAN minus POW. When a loss takes SAN to it or below, the agent is Shaken and takes a disorder, gives up a motivation or leans on a Bond (see Motivations, Leaning on a Bond and Disorders). It then resets to current SAN minus POW. If that comes to 0 or less, the agent has no Breaking Points left and the next line is 0 SAN. One Breaking Point per loss, even if a big loss crosses two. SAN won back later doesn't move it up.

### **Disorders** (set Nov 19)

A disorder is the lasting scar of a Breaking Point. It stays quiet until its trigger shows up, then it can flare. There are six. An agent can carry more than one, never the same one twice.

| Disorder | Trigger (sets off a flare) | Flare (rest of the scene) |
| --- | --- | --- |
| PTSD | The first Loud attack in a fight, or a moment that echoes how they broke (cases flag these) | Freezes: loses their next turn in battle; on the map, −20% to all rolls |
| Paranoia | Talking to someone who is lying or hiding something (cases flag these) | −20% to Persuade and Empathy; won't take items from teammates or let anyone Steady them |
| Phobia (of a subject) | Its subject appears: the dark, blood, deep water, dogs, a kind of monster | On the map they won't lead: the lead passes to the next agent until the scene ends (if nobody else can, they go in Shaken). In battle, −20% to all rolls and they can't attack an enemy that is the subject |
| Depression | A death the party couldn't stop: a victim, a witness, a teammate | Can't brace, and motivation moments restore no SAN for them |
| Sleep disorder | A rest at a safe spot, or the first night scene of a case | Exhausted until the next rest, so that rest refills none of their WP (HP still heals) |
| Addiction | The start of every case, no roll | Withdrawal: −10% to all rolls until they dose (see Addiction under Items) |

- **Getting one:** at a Breaking Point (unless the agent gives up a motivation or leans on a Bond instead), the kind of horror that pushed them over sets the pool, and the game picks one of its two at 50/50. If the agent already has that one, they get the other; if they have both, any disorder they don't have. Every horror carries one of three kinds, listed in the SAN loss table above.
  - Violence (killing, being maimed, seeing someone killed): PTSD or Sleep disorder.
  - Helplessness (failing to save someone, being trapped, a Bond breaking): Depression or Sleep disorder.
  - The unnatural (seeing it, learning about it): Paranoia or Phobia. Phobia takes its subject from the horror that caused it.
  - Addiction never comes from a Breaking Point, only from drugs.
- **Flaring:** when a trigger hits, the agent rolls SAN. Pass: they hold it together. Fail: the disorder flares for the rest of the scene (in a fight, the rest of the fight). At most one flare per disorder per scene. Addiction skips the roll.
- **Built calls (accepted Nov 23, 2026 from the Developer's logged calls):** an arc's bad ending that would name a disorder outside these six uses the closest of the six.
- **Who checks:** a trigger the agent has to see or hear checks only the lead on the map, and everyone in cutscenes and battles, the same as SAN rolls. A trigger that happens to the whole party (a rest, a death, a new case) checks every agent with that disorder.
- **Calming a flare:** the Therapist's sedatives or Medicine's Sedate end it for the scene.
- **Between flares:** nothing. A disorder only costs something when it flares.
- **On screen:** a flare plays one dialog-box line, written straight, never for laughs ("Dale's hands won't stop shaking."). The disorder's icon pulses beside HP and SAN until it ends. The party menu lists each agent's disorders; tapping one shows its trigger and flare.
- **Cases:** cases tag each horror with its kind (and a phobia subject for unnatural ones) and flag trigger moments like liars and echoes. The game checks the party's disorders against those tags, so no case is written around one agent.
- **Curing:** three Therapy home scenes on the same disorder, or Sabbatical's chance for each case sat out (40% per case sat out). A cured disorder can come back from a later Breaking Point. An arc's bad ending that gives a disorder picks the one from this list that fits its story.

### **Statuses** (set Nov 18)

Statuses are short-term conditions that end within a case. Map and combat rules are both set (combat notes filled Nov 20).

- **Who has them:** any agent. Damage ticks hit whoever has the status; roll penalties matter only for whoever rolls (on the map, usually the lead). Icons show in the party menu and beside HP and SAN.
- **Ticks on the map:** each area or room change.
- **Map floor and scenes (accepted Nov 23, 2026 from the Developer's logged calls):** status damage on the map stops at 1 HP; in a fight, Bleeding and Poisoned can Down an agent. On the map, "the rest of the scene" ends at the next area change. SAN rolls take no status penalties except Mushrooms'.
- **Ending:** every status clears at the end-of-case heal-up. Disorders (from SAN) and lasting injuries carry between cases.
- **Lasting injuries:** separate from statuses and long-term, Delta Green style: a serious wound can leave a lasting injury, such as a lost stat point or a limp. The table, tiers and odds are under Lasting injuries in the Combat tab (set Nov 20).
- **Drunk and High:** mostly the player's choice, with trade-offs; sometimes forced by the story or an enemy.

| Status | Cause | On the map | Ends with | Combat note |
| --- | --- | --- | --- | --- |
| Bleeding | Wounds, traps, claws | −1 HP each area change | First Aid, Medicine's Treat, or a rest | −1 HP each turn |
| Poisoned | Bites, spores, bad food, spiked drinks | −20% to all rolls and −1 HP every 2 area changes; never wears off | Antitoxin item; or Treat, which takes a penalty until Science's Sample names the poison | Damage each turn; some enemies apply it |
| Sickened | Gore, rot, bad air | −20% to physical skills (Athletics, Stealth, Melee, Firearms, Dodge) | A rest; or Retch: a CON × 5 roll that clears it on success, once per scene on the map | Retch is a combat action, once per turn, and uses the agent's turn |
| Drunk | Booze item or a bar hotspot | Each SAN loss is 1 smaller; −20% to Search, Forensics, Firearms and Computers | Wears off after 4 area changes | Same as the map: −20% to Firearms (and Search), and every SAN loss is 1 smaller |
| High | Any drug item, or a hotspot | −20% to rolls the drug doesn't help, on top of the drug's own effect (see Item list) | Wears off after 4 area changes | Same as the map: the drug's effect and the −20% carry into the fight |
| Exhausted | Long nights, forced marches, story beats | Willpower doesn't refill and bracing costs double | A rest | Bracing costs double; no other effect |
| Shaken | Hitting a Breaking Point | −20% to all rolls for the rest of the scene | The scene ends, or Empathy's Calm | −20% to all rolls for the rest of the fight (a fight counts as one scene); Empathy's Calm clears it |
| Stunned | Heavy blows, blasts, shocks | Combat only | Ends after the lost turn | The agent loses their next turn |
| Exposed | Search's Spot weak point, Computers' Alarm | Combat only; enemies only | The enemy's next turn | Everyone gets +20% to hit it |

### **Losing an agent** (set Nov 19)

- **Lost for good:** an agent who bleeds out (see 0 HP in Combat) or hits 0 SAN. At 0 SAN they get one straight dialog line and leave the party. In a fight, they snap instead: you lose control of them, and on each of their turns the game picks one of four at equal odds (25% each): attack themselves (an automatic hit with their weapon), attack a random ally, attack a random enemy, or do nothing. The other agents can now target them like an enemy. When the fight ends, or they're Downed, they're out of the fight and leave the party. Whoever Downs them makes a Severe violence SAN roll (1/1d6).
- **Rest of the fight:** the other two finish it. Fleeing a roamer still works.
- **Next safe spot:** the recruit arrives at the next area change after the fight or scene, never mid-fight and never inside a boss area. A loss in the boss fight means the recruit joins at the debrief.
- **Pick 1 of 3:** Big Hat offers three ready-made recruits, or you can build your own in the creator instead (set Nov 20). One always shares the lost agent's profession; the other two have different professions. Each is built like a team-template agent: creation-level skills, full HP, SAN and WP, two motivations with one marked Main, and their own Bonds. Their personal arc starts at beat 1 and counts from this case.
- **Starting kit only:** the recruit brings their profession's starting kit. The lost agent's gear goes with them. Exception: case evidence and key items pass to the lead, so a case can never dead-end.
- **Arrival scene:** one short beat, Big Hat's message and the recruit's first line, written per profession so it fits any case.
- **More than one loss:** each lost agent is replaced the same way. Game over is unchanged: the whole team down in one fight.
- **Send-off:** at the debrief Big Hat says a line about the lost agent, and their field name, cases closed and how they were lost go on a memorial list on the case board screen. Then a funeral cutscene plays before home scenes; it doesn't use up anyone's home scene, and the recruit stands at the back. Claude writes these without review, in claude/home-scenes.md.
- **Grief:** seeing a teammate killed is already a Severe violence horror in the SAN loss table and a Depression trigger, so the funeral adds no SAN cost of its own.

### **Motivations** (set Nov 18)

- **Picking:** each agent has 2, chosen in the creator from a preset list: Protect the innocent, Find the truth, Family, Faith, Revenge, Duty, Curiosity, Money, Redemption. Team templates come with theirs set. A party of 3 covers about 6 types, so most cases hook someone.
- **Motivation moments:** each case plants 1–2 optional moments, aimed at different types. Acting on one costs something (time, risk, a clue or a better route) and the agent who holds that motivation regains 1d4 SAN. The prompt appears whenever any party member holds the motivation.
- **Every motivation, every season (set Nov 23, 2026, from the pre-season review):** across a season's regular cases, each of the nine types gets at least one motivation moment, so no agent's pick goes a season with nothing. Each case spec names its two types; the Designer checks the season's spread when a case spec is written. Season 1's public spread: Protect the innocent (Good Manners, Dead Air), Find the truth (Good Manners), Curiosity and Family (Lot 83), Revenge and Duty (Lost Hour), Money and Redemption (Tracking), Faith (Dead Air).
- **Breaking Point shield:** at a Breaking Point, the agent can give up one motivation for good instead of taking a disorder. They're still Shaken. An agent with no motivations left can still lean on a Bond (see Sanity); with no Bond above 1 either, they must take the disorder.
- **At home:** the Personal Motivation home scene restores a little SAN, or replaces a lost motivation or swaps one (see Home scenes).
- SAN restores from motivations count toward the 6–10 SAN per case target, so that target is net loss.

### **Personal arcs** (set Nov 19)

- **Built from the Main motivation:** in the creator, each agent marks one of their 2 motivations as Main. That motivation's arc is the agent's story for the season. Claude writes 9 arcs per season, one per motivation, and each new season brings a new set of 9. Arcs star the agent's own Bonds by name, so template agents, custom agents and recruits all get one; template agents get hand-made touches.
- **3 beats, automatic:** each beat is a short cutscene that plays on its own after the agent's 1st, 3rd and 5th case survived that season. It doesn't use up the agent's home scene. Cases sat out on Sabbatical don't count; a recruit's count starts at their first case.
- **Branching ending:** beats 1 and 2 each end with a choice, and together they decide the finale. Good ending: a signature perk for that agent, tied to the motivation. Bad ending: a disorder or a broken Bond (the Bond drops to 0), whichever the arc's story calls for.
- **Shield link:** giving up the Main motivation at a Breaking Point plays the bad ending right away.
- **Swapping at home:** replacing or swapping the Main motivation through the Personal Motivation home scene ends the old arc with no payoff and starts the new motivation's arc at beat 1.
- **Season change:** an arc still running when a season ends finishes first; the new season's arc starts after it.
- **Writing:** Claude writes every arc without review, kept in claude/arcs-season-N.md, which you don't open.

### **Home scenes** (between cases)

Picking a home scene plays a quick cutscene that changes with who the Bond is and the Bond score. For example, a spouse at a high score: a hug and a little heart; at a low score: your agent yelling at them. Bonds appear as NPCs in these scenes. The options come from Delta Green and get tweaked or trimmed by the no-mechanics-for-mechanics'-sake rule. Claude writes every home-scene cutscene without review (set Nov 19), kept in claude/home-scenes.md, which you don't open.

**Bond moods (set Nov 19).** A Bond's score sets the mood of its home scenes: **Close** (two-thirds of CHA or more), **Strained** (one-third up to two-thirds), **Fraying** (below one-third). At 0 the Bond is **Broken**: one last scene plays, then that person is gone and the slot stays empty until New Bond fills it.

**No repeats (set Nov 23, 2026):** each choice draws from a pool of scenes that doesn't repeat until all of it has played, remembered for the season; the pool sizes are in spec 008, Part C (`studio-bible/play.md`).

**One choice per agent.** Between cases, each agent picks exactly one home scene option from the table below, never several. Within an option that offers an "or" (like Personal Motivation), the agent also does only one of them.

**Built calls (accepted Nov 23, 2026 from the Developer's logged calls):** a scene plays straight after its pick, so B on the home list does nothing (B backs out of the Bond picker and sub-menus). New Bond offers four names or a typed one. A mixed arc ending's Bond cost never takes a Bond below 1. A recruit covering a Sabbatical gets no home scene that break.

| Choice | Effect |
| --- | --- |
| Fulfill Responsibilities | SAN roll. Success: +1d6 to a Bond (up to CHA). Crit: also +1 SAN. Fumble: −1d4 Bond and −1 SAN. |
| Back to Nature | −1 Bond, then SAN roll. Success: +1d4 SAN. Crit: +4. Fumble: −1d4. |
| Personal Motivation | Pursue a motivation: SAN roll. Success: +1d2 SAN. Crit: +2. No Bond cost. Or instead: replace a lost motivation, or swap one, from the preset list. |
| Use (Addiction only) | Only offered to an agent with Addiction. They spend the break using, so they start the next case with no Withdrawal. Cost: one Bond loses 1d4, the agent loses 1 SAN, and it takes their one home scene, so nothing else heals this break. |
| New Bond | Only when the agent has an empty Bond slot (a Bond broke). Pick a type and name; the new Bond starts at half CHA, rounded up. No roll. Until it's done, that agent has one less person to heal through. |
| Therapy | Choose one. SAN: a SAN roll; success +1d4 SAN, crit +4, fumble means the therapist hears too much and the agency finds out, so Big Hat refuses this agent's requisition at the next briefing. Or Disorder: work on one disorder, no roll; the third Therapy home scene spent on the same disorder cures it. A Therapist in the party can run the session, rolling their Empathy instead of SAN. |
| Improve Skill | +1d6% to one chosen skill (set Nov 18). |
| Special Training | Raise one untrained skill (10%) to 30%. Improve Skill deepens a skill you have; this adds a new one, so a team can cover a gap. Costs 1 point from one Bond. |
| Sabbatical | Sit out 1–3 cases in psych care while a recruit fills in (see Sanity). |

### **Between cases**

- Carry-over: the whole party carries SAN, disorders, Bond damage, wounds, gear and skill gains between cases.
- End-of-case improvement: heal up, and each skill you tried and failed during the case gains +1d4%. The Improve Skill home scene adds +1d6% to one skill you choose (set Nov 18). No skill goes above 99% (Delta Green; set Nov 20).
- Party menu: open anytime on the map, not just between cases (see Map menu in the Skills and menus tab).

## Agents and items

### **Agent creator**

- **Creation flow (set Nov 19).** New game opens a Pick a team screen: the 6 team templates plus a Blank team. A template loads 3 ready-made agents. On the team screen each seat offers Keep, Tweak (name, face, backstory, Bond names, motivations) or Rebuild (the full creator for that seat). Start is enabled once all 3 seats are filled. Two seats can share a profession.
- **The full creator**, one step per screen, L/R to move between steps:
  1. **Profession:** one of the 18 roles below. It sets 2 strong skills at 50% and 2 backup skills at 30% (40% for Melee, Dodge and Athletics); every other skill starts at its Delta Green base (see Combat numbers).
  2. **Stats:** roll (4d6, drop the lowest, one full reroll allowed) or point buy (72 points, each stat 3–18). Template agents come with their stats already set.
  3. **Skills:** 8 bonus picks of +20%, cap 80%, into any skill. A pick that would pass 80% stops at 80%, so a skill that starts at 10, 30, 50 or 70% can still reach 80 (that pick gives only +10; set Nov 23, 2026, after the demo playtest). Weird hobbies live here: a funeral director who boxes, a hockey player who reads tarot.
  4. **Identity:** name, Storybook face built from parts, a one-line backstory.
     **Pronouns and body (set Nov 23, 2026, after the demo playtest):** the Identity step also picks pronouns (she, he or they) and a body build (slim or broad). Pronouns change every line that talks about the agent: case dialog, Big Hat, home scenes, arc beats and battle lines. Case text writes them as tokens, never a fixed "he" or "she". The build changes the agent's shape everywhere it's drawn: the map sprite, the battle sprite seen from behind, and the shoulders under the portrait. Face parts, hair and outfits mix freely with any build and any pronouns. Template agents come with both set, and Tweak can change them. Old saved agents open as "they" with the build closest to their look, and the player can change both from Tweak.
  5. **Bonds:** 2 people, each picked from a preset list of types (Partner, Kid, Parent, Sibling, Friend, Ex, Coworker, Mentor) and then named; each starts at CHA. The type decides which home scenes they get (set Nov 19). Each Bond also gets pronouns (she, he or they), picked with the name, so home scenes and Big Hat's lines talk about them right; New Bond picks them too. Old saved Bonds open as "they" (set Nov 23, 2026).
  6. **Motivations:** pick 2 from the preset list and mark one as Main, which drives the agent's personal arc (see Motivations below).
  7. **Dossier:** review everything, then save to the roster. Big Hat gives the agent their code name here, at the end, once he knows who they are (see Code names below).
- **Code names (set Nov 23, 2026, after the demo playtest; replaces the two-random-words names like IRON HERON):** one name, like the agents in Keegan's Agency stories (RAINE, MICKEY, JERRY, AHAB). Each is a pop-culture reference, usually tied to the agent's home life: a Bond, their Main motivation, a hobby from their bonus picks, or their backstory. Big Hat hands it over on the Dossier step in one line that hints at the why without spelling it out ("Kid named Marco, hockey on weekends. You're GRETZKY."). The player can take it, ask for another (the next best match), or type their own. Names come from a list kept in the game's strings, each tagged with what it fits (Bond types, motivations, skills, professions); the build writes the list, about 60 names, from TV, film, books, comics, music and sports, never a brand or logo (studio-bible/studio.md, No real brands). Template agents get hand-picked names. Old saved agents keep their names, and Tweak can ask Big Hat for a new one.
- **Worked out from stats (Delta Green):** HP = (STR + CON) ÷ 2, rounded up; WP = POW; SAN = POW × 5; Breaking Point = SAN − POW. DEX sets turn order. Stat jobs (set Nov 19), so every stat has a stake: STR 13+ adds +1 Melee damage; CON lets an agent roll CON × 5 to shrug off Poisoned or Sickened as it lands; INT gives a Hunch once per case: stuck on a deduction, roll INT × 5 for a hint.
- **Luck (set Nov 19):** a flat 50% for every agent, tied to no stat, used only for pure-chance moments like overstepping's first step. Retch is a CON × 5 roll instead, since it's the body's job.
- **Recruits (set Nov 19):** when an agent dies, hits 0 SAN or goes on Sabbatical, you pick 1 of Big Hat's 3 ready-made recruits or build your own in the creator (confirmed Nov 20). Who's offered, when they arrive and what they bring are under Losing an agent in Systems. Recruits start fresh, with no case gains.
- **Kept from the demo:** roster and agent code export (your backup if Safari data is cleared). Demo extras like the squad roll are cut unless they earn a stake.

**Built Nov 21 (Demo 1 of 6).** How the creator works in the game, beyond the rules above:

- Empty seats (Blank team) offer Build or Roster: a saved agent can fill a seat, once per team.
- Tweak keeps each Bond's type; only Rebuild changes it. Tweak never touches profession, stats or skills.
- Done checks every step and jumps to the first unfinished one: all 8 picks spent, a name, both Bonds named, 2 motivations with a Main.
- Start files all 3 agents to the roster and begins the case with seat 1 as the lead.
- New game asks first when a case is closed or past Season 1, since it starts the seasons over (accepted Nov 23, 2026 from the Developer's logged calls).
- Each agent keeps a codename, since case dialog uses it. Given at the Dossier step since Nov 23 (Code names, above); it was on the Identity step before.
- Until Demo 5: each profession borrows 2 of the old battle abilities, and play still uses the old shared item pack; the creator already shows the Bible's kit and weapon. Weapons use the Combat numbers dice.
- Old agents converted to the nearest new profession (Federal Agent to Investigator, Priest to Therapist, Ice Cream Truck Driver to Talker, and so on); picks in cut skills are dropped, so a converted agent can have fewer than 8.

### Professions (set Nov 19)

Each team-template seat is a profession, so tweaked template agents and custom agents share one list. Starting skill values are in step 1 of the full creator above.

| Profession | Team | Strong | Backup |
| --- | --- | --- | --- |
| Shooter | Field Team | Firearms, Dodge | Search, Athletics |
| Medic | Field Team | First Aid, Medicine | Empathy, Science |
| Investigator | Field Team | Forensics, Search | Persuade, Occult |
| Clerk | Paper Trail | Bureaucracy, History | Persuade, Computers |
| Hacker | Paper Trail | Computers, Search | Craft, Stealth |
| Talker | Paper Trail | Persuade, Empathy | Bureaucracy, Stealth |
| Bruiser | Medics and Muscle | Melee, Athletics | Craft, Dodge |
| Bodyguard | Medics and Muscle | Dodge, Firearms | Melee, Search |
| Combat medic | Medics and Muscle | Medicine, First Aid | Firearms, Dodge |
| Occultist | Night Shift | Occult, History | Search, Empathy |
| Scientist | Night Shift | Science, Forensics | Medicine, Computers |
| Tracker | Night Shift | Survival, Stealth | Athletics, Firearms |
| Exterminator | Short Notice | Craft, Science | Stealth, Search |
| Funeral director | Short Notice | Forensics, Empathy | Bureaucracy, Medicine |
| Small-town reporter | Short Notice | History, Persuade | Computers, Search |
| Therapist | Off the Clock | Empathy, Persuade | Medicine, Search |
| Hockey player | Off the Clock | Melee, Athletics | Dodge, First Aid |
| Park ranger | Off the Clock | Survival, Search | Firearms, First Aid |

### Starting kit (set Nov 19)

Every agent carries a handgun. Six professions also carry a better weapon and a lighter item; the rest carry a signature item.

| Profession | Weapon | Item |
| --- | --- | --- |
| Shooter | Assault rifle: +2 damage, Loud | Painkillers, 1 use: heal 1d4 HP |
| Bodyguard | Shotgun: +3 damage, −20% to hit | Zip ties, once per case: tie up a beaten human enemy (one at a quarter HP or less, or Stunned) for an extra clue at the debrief |
| Park ranger | Hunting rifle: +4 damage, can't fire two turns in a row | Bear spray, once per case: a beast-like enemy is Stunned |
| Tracker | Compound bow: handgun damage, silent (never draws roamers) | Snare trap, once per case: a roamer is caught and you slip past, or the fight opens with it Stunned |
| Bruiser | Baseball bat: +1 damage, quiet | Energy drink, 1 use: clears Exhausted, +1d4 WP |
| Hockey player | Hockey stick: handgun damage, quiet, Stuns on a crit | Ice pack, 1 use: heal 1d4 HP and clear Stunned |
| Medic | Handgun | Medkit, 3 uses: heal 1d6 HP with no roll, outside First Aid's once-per-wound limit |
| Combat medic | Handgun | Adrenaline shot, once per case: a Downed agent stands at 1d4 HP, no roll |
| Investigator | Handgun | Pocket recorder, once per case: play a witness's words to someone else to unlock a hidden line |
| Clerk | Handgun | Hotline to Big Hat, once per case: request one item from the Lantern Box catalog (Bureaucracy roll at the item's Req modifier +15%; arrives right away) |
| Hacker | Handgun | Signal jammer, once per case: kills phones and cameras in an area, so overstepping doesn't escalate there |
| Talker | Handgun | Roll of cash, once per case: bribe one person past a door or for a secret, no roll |
| Occultist | Handgun | Old charm, once per case: the holder auto-passes the first horror-on-sight roll |
| Scientist | Handgun | UV lamp, once per case: reveals hidden unnatural hotspots in one area |
| Exterminator | Handgun | Bug bomb, once per fight: every living enemy is Poisoned |
| Funeral director | Handgun | Smelling salts, 2 uses: each clears Sickened |
| Small-town reporter | Handgun | Camera, once per case: photograph a clue to unlock an extra cover story at the debrief |
| Therapist | Handgun | Sedatives, 2 uses: each calms a disorder flare for the scene |

- **Kit items are active.** Every Starting kit item is something you use, with its own effect. Other gear can be passive, like body armor. No item just adds a bonus to a skill, and no ability needs an item to work.
- **Refills:** used-up items come back at the start of each case. Bigger guns and extra gear come from Lantern Boxes in cases that need them.

### **Items** (set Nov 19)

Everything beyond the Starting kit: what you find, where it comes from and how much you can carry. Numbers that touch combat (grenade damage and the like) are in Combat numbers.

- **Carrying:** each agent carries up to 8 items, usable anytime, in battle too. Each item takes one slot, with no stacking, and the agent's Starting kit item counts toward the 8; weapons don't. Everything else goes in the party's shared backpack, which has no limit but only opens from the map menu, so you stock each agent before a fight. All items carry over between cases; only kit items refill.
- **Weapons:** each agent carries up to 2, the handgun included, and Fight uses the equipped one; swapping in battle takes a turn. Spare weapons go in the backpack and swap in from the map menu (set Nov 20). Ammo is not tracked; damage dice are in Combat numbers. Give item moves a weapon or kit item to another agent.
- **Using items:** on the map, from the map menu's Items row on any agent; in battle, the Items command uses only what that agent carries, and uses their turn but no WP.
- **No shops or money.** Items come from the world, loot, Lantern Boxes, the Clerk's hotline and requisitions.

### **Item display** (set Nov 19)

Every item screen uses one look: rows on top, a detail box underneath. It shows numbers, not words, since skills already show as percentages.

- **Rows:** name and uses left (Medkit ×3); weapons show their dice (Shotgun 2d6). The header names whose list it is and the slots used (RAINE 5/8).
- **Detail box:** the highlighted item's full effect in a small navy box under the list, 3 lines at most, styled like the dialog box. For weapons: damage dice, the skill and that agent's to-hit % with any modifier (Firearms 50% −20), Loud or quiet, and extras (Stuns on a crit).
- **Markers:** tiny pixel icons on the row: a lantern for a kit item (refills each case), a pin for a case-only item (Big Hat sorts these at the debrief), a bang for a Loud weapon. The detail box spells out each icon.
- **Map menu Items:** pick an agent to see their 2 weapons (equipped one marked), then their 8 slots; then the backpack, where you move items in and out.
- **Give item:** the same rows, then pick a teammate; each teammate card shows slots used (5/8) and weapons (1/2), with full ones greyed out.
- **Battle Items:** only what that agent carries. The list opens with their 2 weapons, equipped one marked; picking the other swaps and ends the turn. Their items follow.
- **Pickups:** one dialog-box line, like "Found: Bandage. Clears Bleeding.", plus where it went: the lead agent's slots if there's room, otherwise the backpack.
- **Debrief:** Big Hat's sorting lists case-only items as the same rows with the pin icon and the detail box.

### Item list (set Nov 19)

Every Shared item in one place. Kit-only items are in the Starting kit table.

| Item | Type | Effect | Where from |
| --- | --- | --- | --- |
| Bandage | Med | Clears Bleeding | Common · LB · Req +20% |
| Painkillers | Med | Heal 1d4 HP | Common · Shooter kit · Req +20% |
| Energy drink | Med | Clears Exhausted, +1d4 WP | Common · Bruiser kit · Req +20% |
| Smelling salts | Med | Clears Sickened | Common · Funeral director kit · Req +20% |
| First-aid kit | Med | Heal 1d6 HP, no roll, outside First Aid's once-per-wound limit | Uncommon · LB · Req +20% |
| Antitoxin | Med | Clears Poisoned | Uncommon, or wherever a case has poison · LB · Req +20% |
| Booze | Drink | The drinker is Drunk; leaves a Broken bottle | Bars, homes |
| Cigarettes | Smoke | 1 use: clears Shaken; not a drug, so no High | Common (gas stations, bars) |
| Joint | Drug | High; clears Shaken | Set by the case |
| Nerve pills | Drug | High; the next SAN loss this scene is halved (counts as that horror's one halving) | Set by the case |
| Uppers | Drug | High; clears Exhausted, +1d4 WP; Exhausted again when it wears off | Set by the case |
| Strong painkillers | Drug | High; heal 1d6 HP; Bleeding does no damage while High | Set by the case |
| Coke | Drug | High; +20% to Persuade and Melee; −1d4 WP when it wears off | Set by the case |
| Mushrooms | Drug | High; hidden unnatural hotspots show and the screen shimmers (only while the lead is High, set Nov 23, 2026); every case from Good Manners on has at least one hidden hotspot (set Nov 23, 2026); SAN rolls get harder | Set by the case |
| Frag grenade | Throwable | 1 use, thrown with Athletics: damage to every enemy; Loud | LB · Req +0% |
| Flashbang | Throwable | 1 use, thrown with Athletics: every human enemy is Stunned; Loud | LB · Req +0% |
| Molotov | Throwable | 1 use, thrown with Athletics: damage to one enemy; things that burn take double | LB · Req +0% |
| Smoke grenade | Throwable | 1 use, thrown with Athletics: enemies get −20% to hit until the next round; against roamers, Flee succeeds | LB · Req +0% |
| Road flare | Throwable | 1 use: on the map, lights a dark area for the scene (roamers show; Stealth rolls there get harder); in battle, one light-shy enemy is Shaken | Common (cars, gas stations) · LB · Req +20% |
| Firecrackers | Throwable | 1 use, on the map: a roamer leaves its post for a while, so you slip past with no roll; Loud | Common (gas stations) |
| Body armor | Gear | Worn, no item slot, one per agent: each hit does 1 less damage | LB · Req −20% |
| Gas mask | Gear | Worn, no item slot, one per agent: can't be Sickened by bad air or Poisoned by spores or gas | Uncommon · LB · Req −20% |
| Salt | Tool | 1 use, anyone, no roll: lay a line one unnatural roamer won't cross | Common (kitchens) · LB · Req +20% |
| Bolt cutters | Tool | Cut a chain or padlock quietly, no roll; breaks after 2 uses | Uncommon (sheds, work sites) |
| Handgun | Gun | Baseline damage | Every agent's kit |
| Assault rifle | Gun | +2 damage; Loud | Shooter kit · LB · Req −20% |
| Shotgun | Gun | +3 damage, −20% to hit | Bodyguard kit · LB · Req −20% |
| Hunting rifle | Gun | +4 damage; can't fire two turns in a row | Park ranger kit · LB · Req −20% |
| Revolver | Gun | +1 damage; crits cause Bleeding | Uncommon · LB · Req −20% |
| SMG | Gun | Burst costs 1 WP instead of 2; Loud | LB · Req −20% |
| Silenced pistol | Gun | Handgun damage; silent | Rare · LB · Req −20% |
| Flare gun | Flare (rolls Firearms) | −1 damage; things that burn take double; lights the area, so Stealth rolls there get harder | Uncommon · LB · Req +0% |
| Taser | Gun | No damage; a hit Stuns a human enemy; can't fire two turns in a row | Uncommon · LB · Req −20% |
| Nail gun | Gun (rolls Craft) | −1 damage; quiet; causes Bleeding | Sheds, work sites |
| Compound bow | Gun | Handgun damage; silent | Tracker kit |
| Baseball bat | Melee | +1 damage; quiet | Bruiser kit · Common |
| Hockey stick | Melee | Handgun damage; quiet; Stuns on a crit | Hockey player kit |
| Knife | Melee | −1 damage; silent; Jump them does double damage | Common |
| Machete | Melee | +1 damage; a hit causes Bleeding | Uncommon |
| Fire axe | Melee | +3 damage, −20% to hit | Uncommon |
| Crowbar | Melee | Handgun damage; Force it is quiet while held | Common |
| Shovel | Melee | +1 damage; quiet | Common |
| Frying pan | Melee | −1 damage; while Defending, the first hit does no damage | Common (homes) |
| Chainsaw | Melee | +4 damage, −20% to hit; Loud; a hit leaves the wielder Sickened | Rare |
| Pitchfork | Melee | Handgun damage; an enemy it hits can't target the wielder next turn | Uncommon (farms) |
| Golf club | Melee | +1 damage; a crit drops the enemy to last in the turn order | Common |
| Broken bottle | Melee | −1 damage; causes Bleeding; breaks after one fight | From Booze |
| Hatchet | Thrown (Athletics) | Handgun damage; lost for the rest of the fight | Common |

- **Key:** LB = in the Lantern Box catalog. Req = requisition modifier at briefings; items without one can't be requisitioned. Common, Uncommon and Rare set how often loot and Search's Sweep turn them up. Damage bonuses here are averages; each weapon's actual dice are in Combat numbers. A flare gun is a signal tool, not a real gun, so it requisitions like a throwable (set Nov 20).
- **Shared or case-only (set Nov 19):** cases can and often should add new items. A generic one (a road flare) joins this list for later cases. One made for a single case (Bob's gun) lives in that case's file and never drops anywhere else.
- **Case-only items after the case:** at the debrief Big Hat sorts them. Ordinary ones you keep as trophies; unnatural ones get bagged as evidence, unless you choose to hide one from him. Hiding has consequences for the agency.
- **Drugs (set Nov 19):** every drug makes the taker High (see Statuses) on top of its own effect. Found only where a case puts them (homes, dealers, evidence lockers); never requisitioned.
- **Addiction (disorder, set Nov 19):** a second dose of the same drug in one case calls for a SAN roll; a fail gives Addiction to that drug, which carries between cases. Withdrawal: each case, until the agent takes a dose, −10% to all rolls. A dose clears Withdrawal for the case and makes them High as usual. Any case where the agent uses, one Bond loses 1. Withdrawal counts as a disorder flare, so the Therapist's sedatives or Medicine's Sedate clear it for a scene. Cured like other disorders, through Sabbatical or the Therapy home scene. The Use home scene gets an agent through a case without using (see Home scenes).

### Where items come from

- **Lantern Boxes:** 0–2 stash sites per case, each holding 2–3 items from the catalog, picked to fit the case.
- **Lantern Box catalog:** every item marked LB in the Item list above.
- **Clerk's hotline:** once per case, mid-case, the Clerk calls Big Hat for any one catalog item: a Bureaucracy roll with the item's requisition modifier plus 15%. On a success it arrives with the Clerk right away (in the backpack if their 8 slots are full).
- **Requisition:** at each briefing, every agent can roll Bureaucracy once to request one catalog item from Big Hat. Easy items (meds, Antitoxin) +20%, throwables +0%, heavy gear (guns, body armor) −20%. On a fail, Big Hat says no. Requisitioned items go in the backpack.
- **Loot:** a roamer drop (20%) is one item from the case's loot table of 4–6 field items that fit the case. Story drops are fixed and always drop. Search's Sweep finds items placed at hotspots.

### **Team templates** (set Nov 19)

All six are available from the start. Each has a clear weakness, so picking one is a real choice, not a skin.

- **Field Team:** the balanced starter. Shooter, Medic, Investigator.
- **Paper Trail:** strong at clues, weak in fights. Clerk, Hacker, Talker.
- **Medics and Muscle:** strong in fights, weak at clues. Bruiser, Bodyguard, Combat medic.
- **Night Shift:** the occult crew. Loses less SAN to horrors but is fragile in long fights. Occultist, Scientist, Tracker.
- **Short Notice (set Nov 19):** oddballs who saw something and got recruited instead of silenced. Hands-on with bodies, traps and gossip; nobody trained to fight. Exterminator, Funeral director, Small-town reporter.
- **Off the Clock (set Nov 19):** people with normal jobs who got pulled in. Tough in body and mind, with a Therapist to cushion SAN; no paper skills, so records and lab clues are hard. Therapist, Hockey player, Park ranger.
- **No civilian rule (set Nov 19):** the oddball teams play by the same rules as the trained ones. Their trade-off comes only from their skill mix, and odd hobbies show up as high skills.
- **Seats are professions:** each seat's skills are in the Professions table under Agent creator.
- **Ready-made people:** every template agent comes with a name, face, short backstory, set stats, Bonds and 2 motivations, all renamable and tweakable. Each team covers about 6 motivation types. Claude designs these people without review when the creator is rebuilt.
- **More later:** new templates can be added when a case seed suggests one. Not every seed needs a new team.

## Skills and menus

### Skill list (set Nov 18)

The demo's 40 Delta Green skills merge into 19. Each one's unlocks are in Skill unlocks below.

| Skill | Folds in | Rough job |
| --- | --- | --- |
| Firearms | Firearms, Heavy Weapons, Military Science | All guns |
| Melee | Melee Weapons, Unarmed Combat | Hits for agents who can't shoot |
| Dodge | — | Defend in combat |
| Search | Search, Alertness | Find clues, spot ambushes |
| Forensics | Forensics, Criminology | Bodies and crime scenes; can unlock deductions |
| Occult | — | What a horror is and what hurts it |
| History | History, Anthropology, Archeology, Foreign Language | Old records, artifacts, strange languages |
| Science | — | Lab work, samples |
| Empathy | HUMINT, Psychotherapy | Read people; Steadying (see Sanity) |
| Persuade | — | Talk your way in; dialog options |
| Bureaucracy | Bureaucracy, Law, Accounting | Paperwork, access; can slow the overstepping escalation |
| Athletics | Athletics, Swim | Climbing, chases, flee rolls |
| Stealth | Stealth, Disguise | Sneak past roamers |
| Survival | Survival, Navigate | Wilderness, tracking, shortcuts |
| First Aid | — | Field healing |
| Medicine | Medicine, Surgery, Pharmacy | Cure statuses, revive downed agents |
| Computers | Computer Science, SIGINT | Hacking, phones, records |
| Craft | Craft, Demolitions | Repairs, jury-rigs, explosives |

Cut: Art, and Vehicles (Drive, Ride, Heavy Machinery): no stake, so driving happens in cutscenes. Persuade and Empathy stay separate: reading someone and talking them into something are different moves. The demo's profession skill lists get remapped when the creator is rebuilt.

### Using skills (set Nov 18)

- **On the map:** only the lead agent's skills are available. Walk up to a hotspot (a locked shed, a nervous witness, a body) and press A; the lead's usable skill options appear. Options the lead lacks show greyed out with the skill name, so you know to swap leads. An option nobody in the party is high enough to use is hidden, not greyed, so the list only shows what this team can do (Keegan's demo playtest, Nov 23, 2026).
- **Away from hotspots:** a few skills work anywhere from the map menu's Skills row (see Map menu below).
- **Swapping leads:** anytime from the party menu, except during a fight or cutscene.
- **Unlocks:** each skill unlocks at least 3 actions or abilities, at 40%, 75% and 90%. An unlock gives you the action; a percentile roll against the skill still decides whether it works. Higher tiers can add perks such as rerolls or a once-per-case auto-success. Creation cap stays 80%, so 90% unlocks are earned in play, through failure growth and the Improve Skill home scene (see Between cases). Skills cap at 99%. Each skill's unlocks are in Skill unlocks below.
- **Built calls (accepted Nov 23, 2026 from the Developer's logged calls):** a 90% once-per-case auto-success fires by itself on that skill's first failed roll of the case. A hotspot whose only option is Look plays it at once.

### Skill unlocks (set Nov 18)

Each unlock is a hotspot option, a battle use or a perk; the shape varies per skill. Every skill earns a stake somewhere, not necessarily in battle. Not every skill matters in every case: a case fully supports about 8–10 skills. At a hotspot, an option a teammate could use shows greyed out; one nobody in the party can use is hidden (set Nov 23). Firearms, Melee and Dodge hold a weaker battle move beside each map unlock (see Battle moves in the Combat tab). Most other skills also hold one status move (see Status moves in the Combat tab). Loud actions draw nearby roamers.

| Skill | 40% | 75% | 90% |
| --- | --- | --- | --- |
| Firearms | Shoot it open: blast a lock or chain. Loud. Battle: Aimed shot. | Lights out: shoot out a lamp to darken an area; Stealth rolls there get easier. Battle: Burst. | Battle: Dead eye (see Battle moves). |
| Melee | Force it: kick a door, pry boards or a crate. Loud. Battle: Shove. | Jump them: catch a roamer from behind; the fight opens with a free hit. Battle: Haymaker. | Battle: Grapple (see Battle moves). |
| Dodge | Duck: when a map hazard springs (falling beam, lunging roamer), roll to take no damage. Battle: Slip. | Slip free: when a roamer catches you, roll to break away before the fight starts. Battle: Draw fire. | Battle: Riposte (see Battle moves). |
| Search | Sweep: search a hotspot for hidden clues and items. | On guard: entering a danger zone, roll to spot roamer routes; enemies there never get the first turn. | Keen eye: hidden hotspots glint on the map; once per case, one Search roll auto-succeeds. |
| Forensics | Examine: read a body or crime scene for a clue. | Reconstruct: link two clues into a deduction the case otherwise hides. | Hardened: bodies and gore cost this agent no SAN. |
| Occult | Identify: name a sigil, ritual item or creature; its weakness shows in battle. | Ward: mark a protective line or sign that blocks a roamer's path; no item needed. | Seen it in the books: halve SAN loss from any horror this agent has Identified. |
| History | Dig records: old newspapers, archives and gravestones give a clue. | Translate: read strange languages and inscriptions; opens lore and old-timer dialog. | Local legend: the first archive visit each case gives a free bonus clue. |
| Science | Sample: take and test a substance; names a poison or status. | Analyze: at a safe spot, turn samples into a clue or a weakness (e.g. the straw burns hotter). | Field lab: Sample and Analyze work anywhere, not just at safe spots. |
| Empathy | Read: spot lies and hidden fear in dialog. Steadying: when a teammate fails a SAN roll, roll Empathy; success halves the loss, a crit cancels it. Once per horror, costs no turn. | Calm: talk a panicked witness or victim down so they follow you or talk. | Anchor: reroll a failed Steadying once per case. |
| Persuade | Talk your way in: get past guards and doors, pry loose information. | Lean on them: back down a hostile person; can stop a human story fight before it starts. | Silver tongue: once per case, one Persuade roll auto-succeeds, plus one free retry on a failed talk each case. |
| Bureaucracy | Paper trail: deeds, permits and police reports give a clue. | Credentials: get into official spaces (morgue, evidence room) and push overstepping back one step. | Clean books: the debrief always offers a safe cover story, and overstepping starts a step lower each case. |
| Athletics | Climb and jump: reach roofs, cross gaps, take shortcuts. | Outrun: the whole party flees using this agent's Athletics. | Second wind: once per case, a failed flee or chase roll succeeds anyway. |
| Stealth | Sneak: slip past a roamer. | Blend in: disguise yourself to enter restricted spots or overhear a clue. | Ghost: after sneaking past a roamer, also lift what it guards; once per case, one Stealth roll auto-succeeds. |
| Survival | Track: follow footprints or blood trails to hidden spots. | Pathfinder: open shortcuts through woods or mazes; danger zones show a safe route. | Make camp: once per case, the whole party rests anywhere outside a danger zone and gets back half their HP and WP. |
| First Aid | Patch up: heal one agent's HP, once per hurt: each fight or hazard that hurt an agent allows one First Aid try on them (map menu's Skills row). | Triage: heal all 3 agents at once, a little each. | Steady hands: outside a fight, First Aid always succeeds (still once per hurt). |
| Medicine | Treat: cure one status such as bleeding or poisoned (map menu's Skills row). | Revive: get a downed agent back on their feet. | Sedate: calm an agent gripped by a disorder until the next area change on the map, or for the rest of the fight in battle. |
| Computers | Crack it: get into a phone or laptop for messages and photos. | Trace: pull call records, CCTV or a phone's location; opens a new place on the map. | Backdoor: electronic locks and cameras open to you; once per case, one Computers roll auto-succeeds. |
| Craft | Fix it: repair a generator, gate, car or fuse box to open a route. | Rig: set a trap or barricade; a roamer is blocked, or a story fight opens with enemies hurt. | Blow it: demolitions break sealed doors and walls. |

### Skill choices

- Every skill needs a practical in-game job; only Firearms felt useful in the demo. The merged list above keeps this game simpler than the tabletop one.
- Branching choices: decision points where your skills open extra options.
- Overstepping has consequences on branching paths: see Overstepping and cover stories below.
- Conflicted choices: make players conflicted mechanically and emotionally. SAN cost changes with whether you believe the victim is innocent or monstrous. Some creatures only want to escape: they wound you for a turn or two, then flee. Agent traits can change the SAN cost (see Sanity).

### Overstepping and cover stories (set Nov 20)

The agents work in secret. Breaking the rules on the job (breaking in, roughing someone up, taking evidence, a scene in public) is overstepping. Each case marks which choices overstep.

- **The roll:** an overstepping choice calls for a Luck roll: no penalty if nobody saw, −20% if someone saw, −40% if it was public or on camera (the case sets which). Pass: nothing happens. Fail: overstepping climbs one step.
- **Do the locals know you're here?** Each case sets it. In an open case (the agents arrived with badges, as feds), the first step is Local chief. In a quiet case (undercover, or they never checked in), the first step is Noticed instead, and Local chief comes after it.
- **What each step does:** see the table. Steps never skip; a bad roll always climbs exactly one.

| Step | What happens |
| --- | --- |
| Clean | Nothing. |
| Noticed (quiet cases only) | Word gets around that strangers are asking questions. A few townsfolk the case picks clam up. |
| 1. Local chief | The chief turns up for one scene. Some townsfolk won't talk, and official places (morgue, evidence room, station) lock. Bureaucracy's Credentials or a Persuade roll can still get the party in. |
| 2. Agency call | Big Hat calls mid-case: one short dialog beat. At the next briefing he refuses requisition for the whole party. |
| 3. Federal agents | Federal agents arrive as a clean-up crew: a very hard human story fight (killing a person still costs SAN per the SAN loss table). Persuade's Lean on them can't stop it. If the party wins, the case goes on as normal, and overstepping drops straight back to Local chief (in open and quiet cases alike), so reaching the top hurts once and doesn't trap the rest of the case or the next one. It can climb again from there. Normal 0 HP rules apply, so it's a game over only if the whole team falls (Nov 24, 2026: the feds no longer end the case). Reaching it doesn't rule out the case's clean ending: the hard fight and the cover story are the cost (Keegan's call, Nov 25, 2026). |

- **Extreme cases:** a case can flag Local chief to arrive as a fight with deputies instead. It's a human story fight (killing a person still costs SAN per the SAN loss table), and Persuade's Lean on them can stop it before it starts. Winning or talking them down lets the case go on; the step still counts. Federal agents always arrive as a fight (see the table).
- **Cover story at the debrief:** Big Hat asks what the locals will be told. The case offers 2–3 cover stories. Strong ones need a skill roll (Persuade to sell it, Bureaucracy to paper it), made by whichever agent you pick. One weak story is always there and calls for a Luck roll instead. A quiet, clean case can offer an easy one. Bureaucracy's Clean books adds a safe story that needs no roll. Pass: the case closes quietly and overstepping drops one step, even if it climbed during the case (Nov 24, 2026). Fail: overstepping climbs one step, carried into the next case.
- **Carry-over:** overstepping carries between cases. At the debrief, a held cover story drops it one step; a clean case (it never climbed) whose story held drops it two. It never goes below Clean. Clean books also starts each case a step lower, and Credentials pushes it back one step mid-case. Each new season starts back at Clean.
- **On screen:** the Case file shows the current step, and each climb plays one dialog line.

### Map menu (set Nov 18)

Press Start on the map to open it. It's the same navy list box as the battle command menu; D-pad or tap.

- **Rows:** Party, Skills, Items, Case file, Log, Settings, Save.
- **Party:** three agent cards stacked, Pokémon-style, each showing HP, SAN, WP and status icons, with the lead marked. Tap a card for Make lead, Dossier or Give item. Open anytime except during a fight or cutscene. Cards stay in seat order and the LEAD tag moves; Give item shows greyed with a one-line reason until Demo 5 brings item slots (set Nov 21, spec 002).
- **Party card faces (noted Nov 20):** the faces in the approved party menu mockup are too rough and hard to read. Make them clearer when the menu is built; no new mockup needed.
- **Skills:** the lead's skills usable away from hotspots: First Aid and Medicine, plus Survival's Make camp and Science's Analyze once unlocked. Skills the lead lacks show greyed out with the skill name, as at hotspots, and skills nobody in the party has are hidden.
- **Items:** see Item display in the Agents and items tab.
- **Case file:** a Next line with the current goal at the top, then each clue found with a one-line note, so you never get lost between sittings. A Rules page lists every status, item icon and threat skull.
- **Log:** rereads the last 30 or so dialog boxes, since clues hide in what people ramble about.
- **Settings:** one toggle, Fast battles, that speeds up battle animations and result lines. It's the only setting for now.
- **Save:** saves to the one slot, then asks Keep playing or Quit to title (the menu has no quit row) (accepted Nov 23, 2026 from the Developer's logged calls). Autosaves still happen. Retch sits in the Skills row.
- **Select button:** cycles the lead agent on the map without opening the menu, in seat order; it works inside Party too (set Nov 21, spec 002).

### Quality of life (set Nov 19)

Small comforts for short phone sittings. None of them change a rule; they save taps and keep you from getting lost.

- **Finish the box:** the first tap (or A) shows the whole box at once; the next one moves on.
- **Skip replays:** after a game over, Retry goes back to the last checkpoint (set Nov 23, 2026), and briefings and cutscenes you've already seen can be skipped with B. B skips only the current part and stops at each question or menu, so Big Hat's questions, requisition, SAN rolls and choices always play (set Nov 23, 2026).
- **Battle cursor memory:** each agent's command menu opens on the last command and target they used.
- **Odds when targeting:** picking a target shows the agent's to-hit % with every modifier applied (Firearms 50% −20 = 30%) and the weapon's dice.
- **A prompt:** a small A bubble appears over a usable hotspot when the lead stands next to it. Hidden hotspots stay hidden until found.
- **Odds on hotspots:** each option shows the lead's chance, like "Force it · Melee 55%"; greyed-out options still name the skill. Options nobody in the party can use are hidden (set Nov 23).
- **Running:** hold B on the map to run. Walking is the default.
- **Confirm what sticks:** a "Can't be undone. Sure?" box before permanent choices only: giving up a motivation, hiding evidence from Big Hat, sending an agent on Sabbatical.
- **Last time:** loading a save opens one box summing up where you were and the Case file's Next goal.
- **Status info:** tap any status icon on an agent or enemy for one line on what it does and when it ends.
- **Bleed-out counter:** a Downed agent's card shows the turns left ("2 turns left"), so you know how urgent Revive is.
- **Auto-target:** when only one enemy is left, attacks skip the target step.
- **Dim used hotspots:** once a hotspot has nothing left, its A bubble turns grey.
- **Talked out:** townsfolk with nothing new to say show a small "…" instead of a speech bubble, until a new clue gives them more.
- **Low-health pulse:** on the map, an agent's card blinks at 3 HP or less, or while Bleeding or Poisoned.
- **Odds on home scenes:** each home scene option shows the agent's roll chance and the Bond's current mood before you pick.
- **Case wrap-up card:** at the debrief, one card shows clues found (4/5), victims saved and SAN lost per agent.
- **L/R flips agents:** in Items or Give item, L and R jump to the previous or next agent instead of backing out. In a dossier, L and R change tabs (INFO, SKILLS, BONDS) and Up/Down moves to the previous or next agent, as in the approved dossier mockup (changed Nov 21, spec 002).
- **Turned down (Nov 19):** text speed setting, repeat last round (brings back Attack-spamming), quick travel, restock button, calmer-flashes setting; boss wind-up tells, danger-zone edge tint, tap to walk, "fight ahead" warning, left-handed layout, randomize in creator.

## Combat

### Basics

- **Layout (decided Nov 15):** head-on, Super Mario RPG spirit. Enemies at the top of the screen facing you; all three agents in a row along the bottom with their backs to the camera. Big animated sprites. The battle plays inside the GBA shell (see Tech), with the agents seen from the waist up (mockup approved Nov 20). The agents are about 48 × 60 px each, three across in fixed thirds of the 240 px screen (set Nov 23, 2026, Keegan's call; replaces the mockup's 34 × 44; see Art → Faces and sprites, Battle backs, and spec 023). Reference: the [Combat mockup canvas](https://claude.ai/artifact/4hpNdAF9Z95xSGEeKuT7zt), "Battle in the GBA shell" artboard; its code is saved in project files as claude/combat-mockup-shell.html.
- **Party on the field:** all 3 agents fight at once. No reserve slot. Balance is tuned for 3.
- **Turn order (set Nov 18):** agents and enemies all act in DEX order, highest first; ties go to agents. A column of small faces down the left edge shows the turn order, so it never covers the sprites (set Nov 20). It shows the current round only: each fighter once, in the order they act, the one acting now on top. A face drops off once that fighter has acted, and the full order comes back at the next round. Enemies that die or flee leave the column; a Downed agent stays, greyed, since their bleed-out counts their turns (set Nov 23, 2026, after the demo playtest). Search's On guard means enemies never take the first turn.
- **Hit rolls:** each attack is a percentile roll against the agent's skill. No dice animation; a short result line pops up instead, e.g. FIREARMS 62% · rolled 41 · HIT.
- **Command menu (set Nov 18):** a one-row box along the bottom in the dialog-box style (navy, cream border) with Fight, Skills, Items and Guard. D-pad or tap. Fight: attack with the equipped weapon, free. Skills: battle unlocks, which cost WP. The list shows only moves the acting agent has unlocked; one they have but can't use right now (not enough WP, no fitting target) shows greyed with the reason (set Nov 23). Items: meds, Antitoxin and the like. Guard: Defend (half damage until your next turn), Brace, Retch, or Flee (roamers only).
- **Move cost (set Nov 18):** special battle moves cost Willpower Points, the same pool used for bracing, so every big move risks the mind later. Plain Fight attacks are free. Costs follow the unlock tier: 40% moves 1 WP, 75% moves 2 WP, 90% moves 3 WP; free perks cost nothing. Healing skills cost WP like any special; items are free. At 0 WP an agent can't use specials or brace, but Fight, Items and Defend still work (set Nov 18).
- **0 HP (set Nov 18):** the agent is Downed and bleeds out after 3 of their own turns unless Medicine's Revive gets them up; bleeding out is death, for good. If the fight ends first, they survive at 1 HP. Anyone Downed during a fight, even if Revived, rolls for a lasting injury when it ends (see Lasting injuries below).
- **Built calls (accepted Nov 23, 2026 from the Developer's logged calls):** Defend only halves damage. Brace in battle spends 1d4 WP and halves that agent's next SAN loss this fight. Riposte's counter is a plain Fight. Burst rolls one d100 against each enemy. A grappler holds automatically each turn. Patch up has no once-per-hurt limit in battle (that's a map rule). WP comes back only from rests and items, never after each fight.
- Purely turn-based. No timed hits or real-time inputs.
- Classic JRPG difficulty: defend, heal and use abilities wisely. The Gleaner fight is the benchmark.
- **Must-haves for the redesign** (Nov 15 playtest), all met: the turn-order column, enemy health bars, status moves and the Fight floor for agents who can't shoot, WP-costed moves against Attack-spamming, and threat skulls as the risk read.
- **Statuses** (set Nov 18): the list, map rules and combat notes are under Statuses in the Systems tab; exact numbers are in Combat numbers below.
- **Backgrounds (reworked Nov 23, 2026, after the demo playtest):** a painted battle backdrop of the kind of place the fight started in, Pokémon style, not a darkened copy of the map. Each backdrop is drawn head-on at battle scale, like the enemies: a ground plane the fighters stand on, a horizon, and two or three big landmarks that say where you are (corn walls and a scarecrow pole in the maze, a lamp post and shop fronts on a town street), lit for the time of day and the low-SAN look. A case draws one backdrop per kind of place it fights in (usually 2–3), files them in the Asset Library under the case like its other art, and lists them in its spec's art needs. Generic ones (a plain street, woods) can go to the Shared Shelf with Keegan's OK.
- **Tall enemies on short screens (set Nov 23, 2026, from a bug fix):** when the screen is short, a tall enemy (like the 128 px Gleaner) stands lower, its feet behind the agents' heads, so nothing is ever cut off. Its HP bar, name, tags and target arrow then draw over the agents. With the bigger agents (Nov 23, 2026, spec 023), the agents first sink behind the party strip, up to 14 px, until the enemy's name and bar clear their heads; only past that does the enemy's bar draw over them. The scene, the party strip, the command box and the gap between the agents never change for it.

### Combat numbers (set Nov 19)

The dice and numbers the code uses. Every weapon rolls its own dice, at the same average as its Item list bonus.

- **Weapon damage:** handgun 1d8, and anything at handgun damage too. Weapon dice (set Nov 19) keep each weapon's average but change its feel; more dice are steadier, one big die is swingier: shotgun 2d6 · hunting rifle 1d12+2 · revolver 1d10 · assault rifle 2d4+1 · chainsaw 3d4+1 · fire axe 1d12+1 · bat, shovel, machete, golf club 1d10 · knife, broken bottle, frying pan, nail gun, flare gun 1d6. A hit's dice always give at least 1; armor and halving come after and can take it to 0. Halves (Burst, Shove, Defend) round down.
- **Fists:** 1d4−1, rolled with Melee.
- **STR bonus (Delta Green, set Nov 19):** melee, fists and thrown weapons add STR 1–4 −2 · 5–8 −1 · 9–12 +0 · 13–16 +1 · 17–18 +2. Guns don't.
- **Crits (Delta Green, set Nov 19):** a hit on 01 or doubles (11, 22 … 99) is a crit: double damage, and it triggers weapon extras (revolver Bleeding, hockey stick Stun). Automatic hits like Dead eye can't crit.
- **Fumbles (Delta Green, set Nov 20):** a roll of 100, or doubles that miss (11, 22 … 99), is a fumble. In a fight a fumble is just a miss with a bad-luck line (the gun jams, the swing goes wide); any WP is still spent, with no other penalty. Outside fights, each scene says what its fumble does. Enemies crit and fumble by the same rules, so an enemy crit does double damage.
- **Skill bases (Delta Green, set Nov 19):** Melee 30%, Dodge 30%, Athletics 30%, Firearms 20%, Search 20%, Persuade 20%, every other skill 10%. Professions and the 8 bonus picks build on these.
- **Fight floor (set Nov 19):** a plain Fight attack never rolls under 30%, so every agent can chip in. Special moves use the real skill.
- **Weakening choices:** each takes 10–15% off a boss's HP, at most 40% in all. The tuned Gleaner (Nov 23, 2026): 65 HP, −8 per rescued victim (41 with all three saved, 37% off).
- **Fight totals:** roamer fights 10–18 enemy HP in all; story fights 20–35.
- **Damage over time:** Bleeding and Poisoned take 1 HP a turn from agents, 2 from enemies (bigger bodies, bigger HP).
- **Armor and Defend:** body armor takes 1 off each hit (a hit can drop to 0). Defend halves damage, rounded down.
- **Throwables:** thrown with Athletics (the Fight floor doesn't apply). Frag grenade 1d6 to every enemy; Molotov 1d8 to one enemy, doubled against things that burn.
- **Healing skills:** Patch up heals 1d4; Triage heals 1d2 to each agent; Revive stands a Downed agent at 1d4 HP.

| Enemy tier | HP | Attack % | Hit damage |
| --- | --- | --- | --- |
| Weak (swarm critter) | 4–8 | 35–45 | 1–3 (1d3) |
| Ordinary | 10–16 | 40–55 | 2–4 (1d3+1) |
| Tough | 18–25 | 50–60 | 2–5 (1d4+1) |
| Boss | 55–65 | 50–65 | 3–6 (1d4+2); area attacks 1–3 each |
| Season finale boss | 70–80 | 55–65 | 3–6 (1d4+2); area attacks 1–3 each |

**The Gleaner, tuned (Nov 23, 2026), the bar for every later boss** (Combat → Bosses, Tuning check). 65 HP, −8 per victim saved. 60% to hit in phase 1 and 65% in phase 2; hit 1d4+2, sweep 1d3 to each agent. Phase 1 moves: sickle 5, sweep 2, names 1 (out of 8). Phase 2 starts at half HP and adds two sickle strikes and one sweep for each victim still on a pole, plus one names if the names are still live.

Simulator check (`tools/boss-sim.js` plays the game's real battle code; 1000 fights each, Field Team at full strength; "careful" heals, Slips, braces and uses Aimed shot and Spot weak point; "plain" uses Fight and meds only):

| Party | Victims saved | Wins | Notes |
| --- | --- | --- | --- |
| Careful | 0 | 92% | about 9.5 rounds, 0.4 Downed on average, 98% of wins with at most 1 Downed |
| Careful, arriving worn (−3 HP, −4 WP each) | 0 | 74% | |
| Careful | 3 | 98% | about 6 rounds, every win with at most 1 Downed |
| Plain | 0 | 86% | |
| Plain | 3 | 97% | |

Deducing right (no names) makes it a little harder (careful, 0 saved: 86%), because the names turns do no HP damage. Every later boss is added to the simulator as one entry and checked against this table. **Can lose (set Nov 23, 2026):** skipping the case's choices counts as "can lose" when it raises a careful team's losses clearly above the all-choices fight, as the Gleaner's do (about 2% with all three saved, 8% with none at full strength, 26% with none arriving worn). A boss doesn't have to beat a careful team that skipped the choices most of the time.

Older check, before the tune (Nov 19, plain attacks only): Paper Trail beat the old 60 HP Gleaner about 1 in 4 with none saved and 2 in 3 with all three, and a finale boss at 75 HP was a coin flip for a Field Team. Rerun these on the simulator when the finale is tuned.

### Battle moves (set Nov 18)

Each combat skill has a job: Firearms deals damage, Melee disrupts up close, Dodge protects the team. The 40% and 75% moves are weaker battle unlocks that sit beside each tier's map unlock; 90% is the full move. They live in the Skills menu, except Defend and Slip, which are under Guard.

| Skill | 40% | 75% | 90% |
| --- | --- | --- | --- |
| Firearms | Aimed shot (1 WP): −20% to hit, double damage on a hit | Burst (2 WP): one roll against every enemy, half damage on each hit | Dead eye (3 WP): an automatic hit that also causes Bleeding |
| Melee | Shove (1 WP): half damage; the enemy drops to last in the turn order | Haymaker (2 WP): −20% to hit; a hit does full damage and Stuns | Grapple (3 WP): pin one enemy. At the start of each of its turns it rolls its attack % against the grappler's Melee: if it succeeds and the grappler fails, or both succeed and it rolls higher, it breaks free and acts; otherwise it loses that turn. The grappler holds instead of acting, and teammates get +20% against it |
| Dodge | Slip (free): while Defending, roll Dodge against each attack; success takes no damage | Draw fire (2 WP): Defend, and every enemy targets this agent until their next turn | Riposte (free perk): each Dodge passed while Defending earns a free counterattack |

- **Defend** (Guard menu, free, anyone): take half damage until your next turn.
- **Other skills in battle:** Patch up 1 WP, Triage 2, Treat 1, Revive 2, Sedate 1, Identify 1 (−20% in battle; a success also reveals the weakness).
- **Free:** Fight, Items, Defend, Retch, Steadying (costs no turn), Flee. Brace keeps its own 1d4 WP cost.
- Status moves for most other skills are under Status moves below.

### Status moves (set Nov 18)

Thirteen non-combat skills each get one battle move that causes or clears a status. Each is narrower than a normal unlock, so it shares its tier with that tier's map unlock. Each is a roll against the skill and costs the tier's WP (40% = 1, 75% = 2). First Aid and Medicine already have battle moves, so they get none.

| Skill | Tier | Move | Effect |
| --- | --- | --- | --- |
| Search | 40% | Spot weak point (1 WP) | One enemy is Exposed |
| Computers | 40% | Alarm (1 WP) | Blare a phone or car alarm; one enemy is Exposed. Loud |
| Bureaucracy | 40% | Flash the badge (1 WP) | A human enemy is Stunned. Once per fight |
| Athletics | 40% | Tackle (1 WP) | The enemy is Stunned, but this agent loses their next turn too |
| Survival | 40% | Road flare (1 WP) | Beast-like enemies are Shaken |
| Forensics | 75% | Find the wound (2 WP) | An already-hurt enemy starts Bleeding |
| Stealth | 75% | Vanish (2 WP) | Enemies can't target this agent until they act; that next attack causes Bleeding |
| Science | 75% | Caustic mix (2 WP) | A living enemy is Poisoned |
| Occult | 75% | Bind (2 WP) | An unnatural enemy this agent has Identified is Stunned. |
| History | 75% | Speak its name (2 WP) | An enemy found in the case's records is Shaken |
| Persuade | 75% | Intimidate (2 WP) | A human enemy is Shaken; on a crit, it flees |
| Craft | 75% | Tripwire (2 WP) | The next enemy to attack this agent is Stunned |
| Empathy | 75% | Calm (2 WP) | Clears a teammate's Shaken mid-fight |

- **Exposed** (enemy status): until its next turn, everyone gets +20% to hit it. See Statuses.
- **Shaken on an enemy:** −20% to all its rolls for the rest of the fight.
- **Resisting statuses is a creature ability,** not a general rule. Each enemy's design says what it shrugs off, such as a boss that can't be Stunned two turns in a row, or a mindless thing that can't be Shaken.

### Enemies and difficulty (set Nov 18)

Fights are rare, so each one hits hard and lasts long enough to use statuses and WP.

- **Health bars:** every enemy shows an HP bar under its sprite, with no numbers. Exact HP (e.g. 18/30) appears once an agent Identifies that enemy with Occult (rest of the case) or uses Search's Spot weak point on it (rest of the fight).
- **Threat skulls:** roamers and story-fight enemies show 1–3 skulls over their map sprite. 1 = a fair fight; 2 = it will cost HP, WP or SAN; 3 = it can kill an agent. Set per enemy when the case is designed, not adjusted for your party's state. Bosses always show 3.
- **Fight length:** roamers 2–3 rounds, story fights 3–5, bosses 8–12. A round is everyone acting once.
- **Damage:** agents have about 10–12 HP. An ordinary enemy hit does 2–4, a boss hit 3–6, so three or four hits put an agent down and Defend, Draw fire and healing matter.
- **Horror on sight:** an unnatural enemy triggers a SAN roll for all 3 agents when it first appears. Bracing works as in Sanity.
- **Enemy card:** each enemy is designed with HP, DEX, attack % and damage, 1–2 special moves, what it resists, its weakness (shown by Identify), its threat skulls, and whether it causes a SAN roll.
- **Enemy targeting (set Nov 20):** when nothing forces a target (Draw fire, Vanish), an enemy picks an agent at random, but leans toward whoever hurt it last (about half its attacks go there). Downed agents aren't targeted.
- **Flee (set Nov 20):** roamer fights only. Any agent can pick it on their turn, but the party's lowest Athletics (Downed agents aside) is what gets rolled: the team is only as fast as its slowest. Success ends the fight with no rewards; failure uses up that turn.

### Bosses (set Nov 18)

- **Phases:** set per boss in its case file. A boss has up to 2 phases (one phase change, which the battle supports; the Gleaner has two) (accepted Nov 23, 2026 from the Developer's logged calls). A case that needs a third says so in its spec, and the battle grows then.
- **Every boss needs:** at least one case choice that weakens it (the Gleaner loses strength for each rescued victim), a weakness Identify can find, and 8–12 rounds against a careful party that skipped the weakening choices, or 5–8 rounds when it made them all (set Nov 23, 2026: the shorter fight is the reward for doing the case well).
- **Tuning check:** the Gleaner is tuned first (Nov 23, 2026), and its tuned numbers and the simulator result go in Combat numbers as the bar every later boss is checked against. Before a case ships, Claude runs the boss against a mid-level team template. Target: a careful party wins with at most one agent Downed; a party that skipped the case's choices can lose. The demo's Gleaner sets the bar.

### Lasting injuries (set Nov 20)

Any agent Downed during a fight who survives it, Revived or not, rolls CON × 5% when it ends (a quick Revive still helps: it stops the Downed 2+ turns modifier). A success means they walk it off. A failure rolls 1d12 plus any modifiers on the table below. Low rolls are Minor and fade after a case; middle rolls are Serious and need rehab; high rolls are Grave and permanent; only a bad fight can reach Career-ending.

| 1d12 + mods | Tier | Injury | Penalty |
| --- | --- | --- | --- |
| 1 | Minor | Black eye | −10% Search |
| 2 | Minor | Sprained wrist | −10% Firearms |
| 3 | Minor | Rolled ankle | −10% Athletics |
| 4 | Minor | Bruised ribs | −10% Dodge |
| 5 | Minor | Split knuckles | −10% Melee |
| 6 | Serious | Bad knee | −20% Athletics |
| 7 | Serious | Cracked ribs | −20% Dodge |
| 8 | Serious | Torn shoulder | −20% Melee |
| 9 | Serious | Nerve-damaged hand | −20% Firearms |
| 10 | Serious | Concussion | −20% Search |
| 11 | Grave | Lost eye | −20% Firearms, −10% Search |
| 12 | Grave | Facial scarring | −20% Persuade |
| 13 | Grave | Chronic pain | −2 max HP |
| 14 | Grave | Ruined leg | −20% Athletics, −10% Dodge |
| 15+ | Career-ending | Done with field work | Leaves the party (see below) |

- **Modifiers (they stack):** +2 in a boss or season finale fight · +2 if the agent was Downed for 2 or more of their own turns · +2 if the CON roll fumbled (100, or doubles that miss). So a quick Revive and a careful boss fight both keep injuries small.
- **How long they last:** Minor lasts through the next case and clears at that case's end-of-case heal-up. Serious is Rehab: a Sabbatical clears every one the agent has. Grave is Permanent and never clears.
- **Grave hurts the mind too:** a Grave injury counts as being badly wounded (Disturbing, violence) in the SAN loss table, so the injured agent makes that SAN roll.
- **Career-ending:** the agent lives but can't do field work. They leave the party and Big Hat offers recruits exactly as in Losing an agent (Systems tab). The send-off is a retirement, not a death: their name goes on the memorial list marked Retired, a short goodbye scene plays in place of the funeral, and teammates make no SAN roll. Claude writes the goodbye without review, in claude/home-scenes.md.
- **Same injury twice:** a repeat Minor restarts its clock. A repeat Serious turns Permanent (the knee never fully comes back). A repeat Grave rerolls.
- **Odds in practice (CON 10):** half of Downed agents walk it off. In an ordinary fight, about 1 Downed in 5 gets a Minor, 1 in 5 a Serious and 1 in 12 a Grave. In a boss fight (+2) Grave rises to 1 in 6. A boss fight where the agent also lay Downed for 2+ turns (+4): Grave 1 in 6, Career-ending 1 in 12.
- **Floors:** penalties can't push a skill below its base; the Fight floor (30%) still applies.
- **Display:** injuries show on the agent's page in the party menu, tagged Minor (with cases left), Rehab or Permanent, with the penalty in plain words. No sprite or portrait changes.

## Tech

The game plays on an iPhone SE inside a Game Boy Advance-style shell. Since the move to the studio repo it deploys to the studio's GitHub Pages site at `/black-lantern` (Dev and Release, `studio-bible/launcher.md`); where this tab still names the Intake artifact, Drive backups or this doc's own Changelog, the studio's README and `CLAUDE.md` win (set Nov 23, 2026).

### File and code

- One artifact, split into parts (since Nov 21). The parts live in the studio repo (KeeganMcClure/studio) under `games/black-lantern/src/` and are built in Claude Code, which bundles them into one HTML file for the artifact; the CLAUDE.md files there carry these rules (since Nov 21). No outside assets except Google Fonts: Press Start 2P (headings, UI) and VT323 (body text). All art is drawn in code on canvas; there is no sound or music.
- The parts, loaded in this order (updated Nov 22): `index.html` (the page and Black Lantern's shell colors), then the studio's shared `engine/studio.js`, `engine/shell.js`, `engine/input.js`, `engine/move.js`, `engine/clock.js` and `engine/party.js` (the site's Dev/Release saves, the shell layout, buttons and keyboard, map walking, the 60-ticks-a-second clock, and the party card list; shared with Rushlight, spec 001 and later), `strings.js` (the shared strings block, `window.BLS`), `creator.js` (agent creator and portraits, and where button presses go, `window.BL`), `engine/shelf.js` (the Shared Shelf script), `agent-sprite.js` (agent map sprites, `window.BLA`), `engine/dialog.js` (the Lantern Bust box, `window.BLD`), `engine.js` (map, dialog, sanity, battle, Big Hat scenes, saves, pause, input, `window.BLG`), `field.js` (hotspots, items, statuses, roamers and loot on the map), `battle.js` and `agent-back.js` (the battle and the agents seen from behind), with the shared `engine/battle.js` and `engine/patrol.js`, `party-menu.js` (the Party screen and Dossier, spec 002), `engine/nearest.js` (moves a cursor to the nearest thing in a direction) and `case-board.js` (the case board, spec 004), then one file per case in `cases/` (Still Harvest: `cases/still-harvest.js`). `engine/shelf.js` and `engine/dialog.js` are the one shared copy of each, synced unchanged from the Shared Shelf and the Asset Library, never edited by hand. A chat reads only the parts its task touches. A new case is a new file in `cases/`, added as a script line at the end of `index.html`; each case file supplies its maps, enemies, scripts, a `caseOpening` briefing and a `caseCard` (file number, title, town, place line, two-line hook, pin color), and ends with `registerCase`, which puts it on the case board.
- Agents on the map (since Nov 21): the Shared Shelf's method v1 and person v1 are the pieces in use. The engine calls `BLA.draw` for the lead; since Demo 4 (spec 005, Nov 22) the townsfolk have their own map sprites and talking portraits, and the old `drawChar` look is gone.
- **Agency cases and secret files live in the studio repo (set Nov 23, 2026, Keegan's call; replaces the private-repo rule from earlier that day).** Agency cases are built like any case: `cases/lantern-nn.js` with its text block and art, and its entry (id, unlock count, finale) and the season-end lines in `seasons/season-1.js`. The secret authoring files (the agency arc `SPOILERS-agency-arc.md`, the personal arcs `arcs-season-1.md`, the home scenes `home-scenes.md`, each case's secret case file in `cases/<case>.md`, and the Developer's checklist `dev-notes.md`) live in `games/black-lantern/story/`. No private repo, token or deploy secret is needed: the old private repo `KeeganMcClure/black-lantern` is retired (it holds a `RETIRED.md`), the deploy no longer reads it and the build bundles no private files. Keegan doesn't read the repo or its PRs; the spoiler rule is about what Keegan is shown, so this bible, the specs, the changelog, the To do, pitches, commit messages, PR text and chat still never quote or summarize them.
- Cases are data plus small async functions: `say`, `ask`, `choose`, `battle`, `sanCheck`, `clue`, `checkpoint`.
- **Where text lives (set Nov 20).** All in-game text stays in the game file, with no separate text store or Sheet, so case writing stays a surprise. Once the file is split, each case part opens with its own text block (dialog, case text, its pools of lines), and menus, items and names share one strings block. Item and menu wording is designed in Agents and items and Skills and menus, then copied in at build time.
- Edit the existing file, never rewrite from scratch. After each change: syntax check, playtest the changed part, copy any newly drawn art into the Asset Library (see Art, Save every asset), run npm run check, commit and push, then publish the bundled file to the same artifact with a dated label (Build YYYY-MM-DD), and add a Changelog line. Milestone builds also go to Drive (see Process, Backups).

### Screen and controls

- **GBA shell stays**, on the map and in battle. You reversed the full-screen decision on Nov 15 after playing the demo, and chose the shell for combat on Nov 20.
- On-screen buttons: D-pad, A (confirm/talk), B (back), L/R (previous/next step in the creator), Start (menu or dossier), Select (cycles the lead agent on the map). Tapping menu rows also works. L and R are wide shoulder buttons in the top corners of the controls area, right under the screen (moved there from the middle cluster Nov 21, spec 003; see `studio-bible/controls.md`).
- Keyboard (for testing on a computer): arrows, Z = A, X = B, Q/W = L/R, Enter = Start, Backspace = Select.
- Target: iPhone SE (375 × 667; the in-app viewer is shorter). Nothing may be cut off. Test at about 375 × 550 and 320 × 480 before publishing (see the playtest checklist in Process).

### Saving

Saves live in the phone browser's local storage, one key per row below. Clearing Safari data wipes them, so export agent codes before big updates (see Process).

| Key | Holds |
| --- | --- |
| `bl.roster` | Saved agents, with everything that carries between cases: SAN, disorders, Bonds, lasting injuries, motivation arc beats, Sabbatical cases left. Since save step 12 (Nov 23, 2026) each agent also has pronouns (she, he or they) and a build (slim or broad), and each Bond has pronouns; older agents and Bonds open as they, and older agents as broad |
| `bl.draft` | Team in progress in the creator (since Nov 21: the team, its 3 seats, and the agent being built or tweaked) |
| `bl.game` | Case checkpoint, including which case it belongs to (since Nov 21, spec 004) and who leads (spec 002) |
| `bl.party` | The 3 agents in the field, who leads, and the backpack |
| `bl.season` | Season number, the case board (each case open or closed, and how it ended), cases closed, overstepping step (since Nov 21, spec 004: `season`, `cases` with `state` and `ending`, `closed`, `overstep`). Added since: `hidden` (evidence hidden from Big Hat, step 8); `agency`, `ended`, `past`, `carried` and `slots` (which case sits in each of the board's six spots) (step 10, spec 009); each case's `intel` (the briefing topics asked, step 11, spec 013); each case's `seen` (cutscenes already played, so B can skip them; no step needed, since a case without it has seen nothing, Nov 23, 2026); `played` and `playedNow` (home scenes played this season and this break's picks, moved out of the home checkpoint by step 13, Nov 23, 2026). A new season clears `seen`, `played` and `playedNow` |
| `bl.memorial` | Fallen and retired agents |
| `bl.settings` | The map menu's Settings choices |
| `bl.version` | Save version number (since Nov 21; 13 as of Nov 23, 2026). Step 2 moved agents to the new creator rules, 3 added who leads, 4 the season save, 5 each agent's own kit, 6 lasting injuries, 7 the rewritten Still Harvest, 8 hidden evidence, 9 the home phase, 10 the full season, 11 briefing intel, 12 pronouns and build, 13 the home scenes' season memory. Saves without it count as version 0 |
| `bl.backup` | Untouched copy of every save, taken just before the last upgrade, with the version it came from |
| `bl.broken` | A checkpoint the upgrade couldn't read, set aside instead of deleted (only exists if that happened) |
| `bl.sound` | Retired Nov 21 with all sound and music. The game no longer reads or writes it; old saves that still have it just ignore it |

Keep saves backward compatible. Any change that would break old saves gets flagged first. Season length and agency-case unlock counts live only in the secret arc file; Claude copies them into the game's data at build time and never writes them here (set Nov 20).

**Save upgrades (set Nov 21).** When the game opens, it backs up any older saves to `bl.backup`, then runs each upgrade step above the stored version, in order. Old steps are never changed; a change to what a save holds adds a new step and raises the version by one. Real saves from past builds sit in the repo's `tools/test-saves/`, and `npm run check` must open every one of them.

### Asset Library

The Asset Library (the old Art Bible page, converted Nov 15) is Claude's reference: live sprites, exact canvas drawing code and palette values. You view it; this doc is where you edit. Generic and seasonal art comes from the Shared Shelf instead (see Art, Shared Shelf, for the versions in use), so the Library keeps only Black Lantern's own art. Since Nov 21 it is split: the core page holds the palette, the dialog box (dialog.js), Big Hat (bighat.js) and the agents' map sprites (shelf.js, agent-sprite.js), and each case has its own page and code file (Still Harvest: still-harvest.html and still-harvest.js). To build a case, read just that case's files. Since Demo 4 (spec 005, Nov 22) Still Harvest's map runs on the Shared Shelf, and legacy-street-kit.js, the frozen street-test shelf code, is deleted. A new case's art goes on a new page made from the Still Harvest one.

## Process

How we build Black Lantern, from first idea to finished case (set Nov 17, 2026). Since the move to the studio repo, the studio README, `CLAUDE.md` and `studio-bible/studio.md` set the day-to-day steps (PRs, the changelog, ticks, deploys) and win where this section differs (Nov 23, 2026). Claude follows this every chat and logs every build or Bible change in the Changelog below.

**The road**

1. **Foundations** (mostly done): design pillars, art direction, this Bible.
2. **Paper design**: gameplay loop, SAN, skills, combat, story, team templates, character creation, voice. Cheap to change, so it's settled before code.
3. **Tech prep**: split the game file into parts and fit the shell to small screens, so every later build is cheaper and safer.
4. **Vertical slice**: rebuild Still Harvest under the new rules and art. If one case feels right start to finish, the design works.
5. **Case production**, repeated per case: pitch → paper design → art → build → playtest → polish → publish.
6. **Upkeep**: fix Bugs, keep old saves working, sort the Ideas inbox.

**Every chat**

1. Claude reads the Bible tab the task needs.
2. One task, named up front.
3. Decisions come as multiple choice, with Claude's pick marked.
4. Claude builds or creates asset mockup; you test and/or provide approval.
5. Claude updates the Bible: ticks the To do item, records decisions where they belong, files any Bugs, and adds a Changelog line.
6. Claude backs up (see Backups).
7. Claude tells you when to start a fresh chat.

**Backups**

- **Game:** every publish gets a dated label (Build YYYY-MM-DD) in the game artifact's own version history, which loads into no chat. Milestone builds (the finished demo, each finished case) also go to Drive as Black Lantern/builds/intake-YYYY-MM-DD.html. Nothing dated goes in project files, since those load into every chat (set Nov 20).
- **Bible:** a markdown export goes to Drive as Black Lantern/Bible backups/bible-YYYY-MM-DD.md before any big edit and once a week (set Nov 20).
- **Your agents:** they live in your phone's browser and vanish if Safari data is cleared. Export agent codes before big updates.

**Playtest checklist** (run before every publish)

- Loads with no errors or blank screen.
- Fits at 375 × 550 and 320 × 480; nothing cut off.
- Every button works: D-pad, A, B, L/R, Start, Select.
- The changed part plays start to finish.
- An old save still loads, and a new save works.
- Text fits the box; no typos; no leftover sound settings.
- Fun check: what felt slow, confusing, too easy or too hard? Anything found goes to Bugs or the Ideas inbox.
