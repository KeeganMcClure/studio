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
- The repo is public: code, bibles and case content are readable by anyone. Secret story files (agency arc, motivation arcs, home scenes) never go in it.

## Shared engine and spoiler wall

- Anything two games could use (combat, dialogue, saves, input, menus) goes in `engine/`, never inside one game.
- Spoiler wall: work on one game never opens another game's story or case files. Fixing shared code means reading only the code file involved.

## Roles

| | Game Designer (Claude Project) | Game Developer (Claude Code) |
| --- | --- | --- |
| Owns | Studio bible, game bibles, specs, mockups, art direction, and each game's to-do list and what comes next | Engine, games, launcher, builds, deploys |
| Writes | `bible.md`, `specs/`, `studio-bible/` | `src/`, `engine/`, `changelog.md`, final `assets/` |
| Reads | `changelog.md` before every rules check | Bibles and specs before every feature |
| Never | Writes code | Changes a bible or spec without asking |

- The Designer is also the project manager. There is no separate project-manager Project.
- The Designer changes bibles and specs only through GitHub pull requests, one per change. Keegan merges. Never straight to `main`.
- Mockups are made by the Designer. Final sprites follow `art-style.md` and go in the game's `assets/` folder as drawing code, so nothing gets redrawn.

## Design Inbox

- Keegan writes changes and comments in the [Design Inbox](https://claude.ai/artifact/7rVc59Lu79KGHHmQ4bVY7H) doc.
- It is an inbox, not a bible: the Designer moves each item into the repo, ticks it, and replies in its comment thread with where it went.
- Its New game ideas section is a parking lot for future games and is never cleared.

## Changing a rule

Locked rules change only on purpose. Change the bible file first in a PR, note the date, then update anything that depends on it.
