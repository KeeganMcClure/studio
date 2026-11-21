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
| Portraits | 64 × 64 px in the dialog box, Undertale/Earthbound style. Plain backdrop in the portrait; the scene shows behind it. |
| Talking | Two-frame mouth flap at 140 ms a frame, in bursts while text types, then a rest. |
| Text | Short lines, typewriter effect, speaker names in caps. |
| Dialog box | "Lantern Bust" (set Nov 15). Navy box with a cream border along the bottom of the screen, 3 lines of VT323. The 64 × 64 portrait stands on top of the box at the map's pixel size, the name in caps on a tab beside it. Signs: tab only. Narration: no tab, lavender text. Exact code and colors in the Asset Library under Dialog. |

### Maps (set Nov 15)

- **Camera:** Stardew-style 3/4 top-down. You see building fronts and people's faces.
- **Who walks:** only the lead agent. You pick the lead from the party menu; the lead walks the map and does the talking with townsfolk. The lead carries the lantern at night only; by day it's put away and not drawn (set Nov 20).
- **Scale:** Wide (decided Nov 15). Sizes are under World sprites; Wide was picked because seeing more of the town helps navigation. Faces on the map stay simple; the detailed Storybook face lives in the 64 × 64 portrait.

### Light and mood

- Day and night matter: cozy daylight, dusky gold, then dark night lit only by lamps and the lead's lantern (night only; see Maps).
- Some monsters only come out after dark. How townsfolk change at night is under Townsfolk at night.
- Below 40 SAN, colors sour toward neon pink and cyan, and the lantern's light radius shrinks.
- Battles: big hand-drawn enemy sprites over a static background drawn from the map spot where the fight started. Layout (approved Nov 20): head-on, the 3 agents seen from behind, inside the GBA shell with the D-pad shown, turn order in a column at one side so it doesn't cover sprites.

### Townsfolk and monsters (set Nov 15)

- **Townsfolk:** a fair mix. About 1 in 3 has one weird trait, Earthbound style (huge glasses, a pet crow, a too-wide grin); the rest are normal people, so the weird stays novel instead of annoying. Storybook faces.
- **Monsters:** no fixed source. Each case's story decides what its monsters are made of, from folk and rural to fully cosmic. Cosmic horror is very stylized, like anime creature design or a scary Pokémon: bold silhouettes, a readable "type," then something wrong.
- **Monster faces:** decided per monster, to fit the case. This means the sprite's face (eyes, mouth, or none). Monsters that talk also get a 64 × 64 portrait in the dialog box; non-verbal ones get written grunts and groans where it fits, and no portrait.
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

Not used: `shared-ui-shell-v1` and `shared-ui-dialog-v1` (Rushlight's). Black Lantern keeps its own GBA shell (Tech, Screen and controls) and Lantern Bust dialog box (Faces and sprites).

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
- [street-test.html](https://drive.google.com/file/d/1uQ2ZxcPTplE_CV6AEL-UA5i45meUnHmK/view): Wide-scale street test, the source of the Shared Shelf's v1 pieces
