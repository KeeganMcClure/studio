# How the studio works

Lasting decisions about the studio itself, moved here from the Setup Bible (Nov 21, 2026).
The loop for each feature and the bug route are in the README; the Developer's rules are in `CLAUDE.md`.

## Platform and tools

- Every game is a web game (PWA) with GBA-style on-screen controls, played from the iPhone home screen. Delta and ROM builds are out.
- Plain HTML canvas on the studio's own engine, which grew out of Black Lantern's. No Phaser or other game framework.
- All art is drawn in code (see `art-style.md`).
- Hosting is one free GitHub Pages site: the launcher plus each game at its own path (see `launcher.md`).

## One repo, one source of truth

- One studio repo holds every game, the shared engine, the launcher and the bibles. No repo per game.
- Every bible lives as markdown in this repo. The Designer and Developer read the same files. Nothing design-critical lives only in a Claude Project's knowledge or memory.
- The repo is public: code, bibles and case content are readable by anyone. Secret story files (agency arc, motivation arcs, home scenes, secret case files) live in it too, in each game's `story/` folder (set Nov 23, 2026, Keegan's call: Keegan doesn't read the repo or its PRs, so keeping them here is enough). "Secret" means Keegan isn't shown them: bibles, specs, changelogs, To do lines, pitches, commit messages, PR titles and descriptions, and chat never quote or summarize them.
- No real brands (set Nov 21, 2026). Games and their builds are public, so real brand names and logos never appear. A game that wants a real-world feel uses look-alike brands: made-up names and logos styled after real ones (Life After's 1990s America).

## Shared engine and spoiler wall

- Anything two games could use (combat, dialogue, saves, input, menus) goes in `engine/`, never inside one game.
- Spoiler wall: work on one game never opens another game's story or case files. Fixing shared code means reading only the code file involved.
- **Shared rules start here (set Nov 23, 2026).** A new rule about screens, controls, UI, art or saves goes into `studio-bible/` first. A game's `bible.md` then adds only its own colors, contents or a named exception. Only rules about one game's story, theme or systems start in that game's bible. Why: full screen was tried and reversed in both games, and the party menu and the corner-portrait rule each started in one game and moved here later.

## Roles

| | Game Designer (Claude Project) | Game Developer (Claude Code) |
| --- | --- | --- |
| Owns | Studio bible, game bibles, specs, mockups, art direction, and each game's to-do list and what comes next | Engine, games, launcher, builds, deploys |
| Writes | `bible.md`, `specs/`, `studio-bible/` | `src/`, `engine/`, `changelog.md`, final `assets/` |
| Reads | `changelog.md` before every rules check | Bibles and specs before every feature |
| Ticks | To do items for paper work (specs, mockups, bible changes) | To do items and Bugs lines the build finishes, in the same PR as the changelog entry |
| Never | Writes code | Changes a bible or spec without asking (ticks excepted) |

- **Ticking To do items (set Nov 22, 2026):** a To do item is ticked in the same PR that finishes it, so the list never lags behind the changelog. The Developer ticks build items and adds a one-line `Done <date>:` note under each; the Designer ticks paper items in their own PRs. Before each rules check, the Designer also looks for any item the changelog shows as built but still unticked.
- The Designer is also the project manager. There is no separate project-manager Project.
- The Designer changes bibles and specs only through GitHub pull requests, one per change. Keegan merges. Never straight to `main`.
- Mockups are made by the Designer. Final sprites follow `art-style.md` and go in the game's `assets/` folder as drawing code, so nothing gets redrawn.

## Screen list

Set Nov 23, 2026, after Black Lantern's intro was built without any spec covering it.

- Each game's `bible.md` keeps a **Screens** section: one row per screen the player can see, in play order from the title to game over (title, intro, creator, map, menus, battle, endings and so on).
- Each row names the spec that covers it. A screen with no spec is a gap: the Designer writes or extends a spec before it's built, and the Developer asks before building a screen that isn't on the list.
- A spec that adds a screen adds its row in the same PR.
- Each row also names its look mockup (set Nov 23, 2026). A screen with a layout of its own needs a mockup Keegan approved before it's built. A screen that reuses an approved layout (one more card list on the same menu surface) names that mockup. A game adds the Mockup column the next time its Screens list changes; Life After adds it first.

## Design Inbox

- Keegan writes changes and comments in the [Design Inbox](https://claude.ai/artifact/7rVc59Lu79KGHHmQ4bVY7H) doc.
- It is an inbox, not a bible: the Designer moves each item into the repo, ticks it, and replies in its comment thread with where it went.
- Its New game ideas section is a parking lot for future games and is never cleared.

## Playtests

Set Nov 23, 2026, after Rushlight's look fell well behind Black Lantern's and nobody saw it until all five slice parts were built.

- Before Keegan plays, the Developer puts each new or changed screen side by side with its approved mockup at 375 × 667, fixes anything that falls short, and says in the changelog entry that the check was done.
- Keegan plays on the phone after the first part of a spec or slice that adds new screens. The Developer waits for those notes before building the next part that adds screens, so a look or feel problem is fixed before it spreads. Parts that only add rules or content can go ahead.

## Changing a rule

Locked rules change only on purpose. Change the bible file first in a PR, note the date, then update anything that depends on it.

## Specs

Set Nov 23, 2026, after Rushlight's spec 003 said the mercs follow the lead while the bible said only the lead walks, and the spec got built.

- **The bible beats a spec.** A spec links to the bible rules it relies on (file and section) instead of writing them out again, so the two can't drift apart.
- A spec that changes a rule says so on a line starting **Rule change:**, and the bible change goes in first, in its own PR.
- Before a spec PR opens, the Designer checks every line in it that touches a rule against the bible section it cites.
- If the Developer finds a spec and a bible disagree, they stop and ask Keegan before building that part, as `CLAUDE.md` says. The rest of the spec can go ahead.
