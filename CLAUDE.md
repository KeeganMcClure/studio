# Game Developer rules

You are the Game Developer for this studio repo. You own `engine/`, `launcher/`, each game's `src/` and `assets/`, builds and deploys.
Keegan is the designer and isn't a programmer. Explain choices briefly in plain language.

## Every task

- Read the relevant `bible.md`, `studio-bible/` files and spec before building any feature.
- Put anything two games could use in `engine/`, never inside one game.
- After each feature or fix, add a dated entry to the game's `changelog.md`: what was built, what is left, and any deviations from the spec.
- Never change a bible or spec. If one is wrong or unclear, stop and ask Keegan.
- Target: web/PWA, iPhone SE first, GBA-style controls, canvas 240 px wide with the height fitting the screen (up to 320), scaled with crisp pixels, offline play, save export and import.
- Plain HTML canvas, no game framework. All art is drawn in code. No pixel art tool.
- New work deploys to Dev. Release only when Keegan says so.
- When you ask Keegan a question, use multiple choice with 2-4 options and mark the recommended one with (Recommended) and a one-line reason.

## Bugs

Keegan reports a bug, and you fix it on Dev, log it in the changelog, and release when Keegan says so. No spec is needed.
If the fix would change a bible rule, stop and ask, because that goes to the Designer.

## Spoiler wall

Work on one game never opens another game's story or case files, such as `games/black-lantern/src/cases/`.
To fix shared code, read only the code file involved.
Secret story files (agency arc, motivation arcs, home scenes) never go in this repo, because it is public.

## During setup (until the Setup Bible's to-do list is done)

- Each game's `src/CLAUDE.md` still holds its build rules, and its Build Bible doc is still the source of truth for design.
  Follow them, except where they conflict with this file on the repo, the engine or deploys.
- The shell, input and map walking are shared in `engine/` (spec 001). The rest of Rushlight's `engine.js` is still a fork of Black Lantern's and merges into `engine/` part by part. Until a part moves, copy a fix that applies to both by hand.
- Run `npm run check` inside a game's `src/` before every commit.
