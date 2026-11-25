# Sarah's Sim bible

This game's build bible. Started 2026-11-25 from Keegan's answers in the Game Designer project.

- The house rules in `studio-bible/` (controls, art style, UI, saves, launcher) apply to every game and win where this file overlaps them, except for the named exceptions below (Controls and screen, Art).
- What's been built is in `changelog.md` next to this file. Nothing is built yet.
- Keegan sends changes through the Design Inbox doc; the Designer edits this file through pull requests.
- Reading level: everything written for this game, in chat, in this bible and in the game, sits at an average reading level. Plain words over jargon.
- Sarah's Sim has no secret story files.

## To do

In build priority order. Everything is aimed at Dec 25, 2026. Challenges mode is built last, so if time runs short it's the one thing that arrives in an update after Christmas (Keegan, Nov 25).

- [x] Setup: create this bible (Nov 25).
- [x] Base look: warm and cozy isometric room approved (Nov 25). See Art.
- [ ] Sarah's phone: Keegan finds out the model. It sets the target screen size.
- [ ] Shell space: with the phone known, Keegan picks between keeping L/R, dropping them, and a taller game screen (Keegan, Nov 25: maybe drop L/R for more room; a plain question, no mockup needed). The approved mockup uses today's shell with L/R.
- [ ] Photos: Keegan sends photos of their things and their cats. Photos stay in the Game Designer project files, never in this repo; only the drawn versions come here.
- [ ] Reference sheet: Keegan, Sarah and the cats as map sprites and portraits, plus a first set of their real furniture, drawn from the photos (`studio-bible/art-style.md`, Before a game's first build).
- [ ] Holidays: which holidays get decorations and items.
- [ ] Decorating: catalog categories, how many pieces at launch, color variants, rotate, stack and wall items. Screen mockup for the catalog.
- [ ] Outfits: what she designs (pick parts, recolor, patterns), the clothing list, and the Style screen mockup.
- [ ] Creator: the parts for making new people (face, hair, skin, body), and its screen mockup.
- [ ] Building: lot size, walls, doors, windows, floors, stairs or not, how the view scrolls and zooms over a home bigger than the screen, and the build screen mockup.
- [ ] Life mode: the day, the gentle needs, the job, coins and prices.
- [ ] Saves: slots per mode, save export and import, and taking a picture of a room or outfit to keep.
- [ ] Title and cover: the title screen and the 120 × 80 cover (`studio-bible/launcher.md`).
- [ ] Specs: one spec per build part, in this order: the Philly home and decorating (Sandbox), Outfits, Creator, Building, Life mode, Challenges.
- [ ] Challenges mode: the challenge list, rewards and its screen mockup (built last).

### Bugs

None yet.

### Ideas inbox

- After Christmas: more homes, more holidays, seasons outside the windows, more challenges.

## Screens

Every screen you can see, in play order (`studio-bible/studio.md`, Screen list). A spec that adds a screen adds its row here. Mockups are in `mockups/`. A screen marked To draw gets an approved mockup before the part that builds it.

| Screen | What you do there | Spec | Mockup |
| --- | --- | --- | --- |
| Title | Pick a mode, continue, import a save | No spec yet | **To draw** |
| Home (decorate) | Drag furniture from the tray into the room, turn it, recolor it | No spec yet | `look-iso-v1` (approved Nov 25, 2026) |
| Style (outfits) | Design and change outfits | No spec yet | **To draw** |
| Creator | Make a new person | No spec yet | **To draw** |
| Build | Draw walls, doors, windows and floors on an empty lot | No spec yet | **To draw** |
| Life mode top bar | Day, time and coins over the home | No spec yet | `look-iso-v1` (top bar) |
| Challenges | Pick a challenge and see how you did | No spec yet | **To draw** |
| Start menu | Save, homes, people, quit to title | No spec yet | **To draw** |

## Overview

**Pitch.** Sarah's Sim is a cozy life simulator for the phone, made by Keegan as a Christmas gift for Sarah. It's in the style of the life sim genre, but its own game, with a heavy focus on design: decorating and building homes, and designing outfits. It starts in a copy of Keegan and Sarah's home in Philly, with their cats and their real things.

**At a glance**

- A gift for Sarah. Deadline: Dec 25, 2026, with the whole game done, not a preview (Keegan, Nov 25).
- Built openly in this public repo (Keegan, Nov 25: Sarah doesn't check it).
- Ships as its own standalone game. While it's being built it lives on the studio shelf like the other games.
- Phone-first on Sarah's phone (model to be found; it's bigger than Keegan's and not an iPhone SE), inside the studio shell. No sound (`studio-bible/art-style.md`).
- Folder `games/sarahs-sim/`. Planned save prefix `ss.`.
- Other studio games are on hold until this one ships (Keegan, Nov 25).

**Design pillars**

1. **Design is the heart.** Homes and outfits get equal weight (Keegan, Nov 25).
2. **It's ours.** Their home, their cats, their things and the holidays they love.
3. **Cozy, never stressful.** Daily life is optional. Nothing is lost, nothing goes wrong.
4. **Fingers first.** Drag, drop and tap feel natural on the phone.

## Modes

Set Nov 25 (Keegan). Daily life is totally optional, so the game has three modes.

- **Sandbox:** free design. Everything is unlocked from the start. No days, needs or money.
- **Life:** gentle days. A few soft needs and a small job earn coins for new furniture and clothes.
- **Challenges:** themed design jobs (for example "a winter cabin for a client") with a small reward. Built last.

## Homes and people

- **Starter home** (Keegan, Nov 25): a prebuilt copy of Keegan and Sarah's place in Philly, with their cats. Their real furniture and things are drawn from Keegan's photos. No street address anywhere.
- **Holiday things** (Keegan, Nov 25): holiday decorations and items are in for sure. Which holidays: see To do.
- **People** (Keegan, Nov 25): Keegan and Sarah are drawn to look like themselves, and she can restyle their hair and outfits. A creator lets her make extra people for other homes.
- **Other homes** (Keegan, Nov 25): she builds them from scratch on empty lots: walls, doors and rooms, then furniture.
- **Room size:** rooms and homes can be much bigger than one screen. The approved mockup shows one 10 × 10 tile room only because it fits the screen; the view scrolls over bigger homes. How it scrolls and zooms is part of the Building item on To do.

## Controls and screen

- **Touch first, buttons too** (Keegan, Nov 25): she taps and drags furniture and clothes. The studio shell and its buttons stay for walking, menus and anyone who prefers buttons. **Named exception** to `studio-bible/controls.md` (Buttons): drag and drop on the game screen is a main control here, not only tapping menu rows.
- **Target screen:** Sarah's phone. The studio's tests at 375 × 667, 375 × 550 and 320 × 480 still run, so nothing is cut off anywhere.
- **Shell space:** open (see To do). On a big phone the game height cap of 320 px (`studio-bible/controls.md`, Shell) leaves dark bands above and below the room; the shell-space question covers it.

## Art

- **Mood** (Keegan, Nov 25): warm and cozy. Soft woods, warm lamp light, gentle pastel accents and snow at the windows in winter.
- **View** (Keegan, Nov 25): isometric, the diagonal view of classic life sims (2:1, the approved mockup uses 22 × 11 px floor tiles). **Named exception** to `studio-bible/art-style.md` (Craft: Maps are 3/4 top-down). Light still comes from the upper left: left-front faces lit, right-front faces in shade.
- **Base look** (approved Nov 25): `mockups/look-iso-v1` (drawing code in `look-iso-v1.js`). It sets the palette, the plank floor, striped wallpaper with a wainscot, the lamp glow, the cream tray with rose tabs and the top bar. The people and cats in it are stand-ins until the reference sheet.
- All the studio Craft rules apply on top: lit, dressed and alive rooms, soft shadows under everything, dark outlines.

### Palette

From the approved mockup.

| Use | Hex |
| --- | --- |
| Wall (light, base, shade) | `#f3d2c4`, `#ecc1b2`, `#dcab9c` |
| Trim | `#fff1e2` |
| Floor planks | `#d39a66`, `#c88d5a`, `#bb8150`, plank lines `#93603c` |
| Rose accent (light, base, shade) | `#f39bb0`, `#e46f8b`, `#b44f63` |
| Sage accent (light, base, shade) | `#9cc1b6`, `#7fa7a0`, `#5d8580` |
| Honey accent | `#f3d38a`, `#e7b75f`, `#c78f3e` |
| Leaf | `#8fc47b`, `#6aa361`, `#437a47` |
| Lamp glow | `#ffd56b` |
| Tray and cards | `#fff6ea`, edge `#e8cdb4`, ink `#6b4250` |
| Outside the room | `#3a2633` to `#22171f` |
| Shell body | `#f6c9c1`, `#e9a7a2`, `#c9827f` |
