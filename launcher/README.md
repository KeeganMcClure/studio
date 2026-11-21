# Launcher (Game Shelf)

The one home screen app. House rules are in `studio-bible/launcher.md`; this file says how the code works.

## The site

Every push to `main` or `release` rebuilds and deploys the whole site to GitHub Pages
(`.github/workflows/pages.yml`), at https://keeganmcclure.github.io/studio/.

| Path | What |
| --- | --- |
| `/` | The launcher, always from `main` |
| `/<game>/` | The game's Release build, from the `release` branch |
| `/dev/<game>/` | The game's Dev build, from `main` |

## Dev and Release

- New work merges to `main`, so it shows up under Dev a minute or two later.
- To release, Claude opens a pull request from `main` into `release` when Keegan says so. Merging it updates Release.
- Before the first release there is no `release` branch, so the shelf opens on Dev.
- Dev builds keep their own saves (`dev.` in front of the game's prefix), so testing never touches Release saves.

## How a game joins the shelf

Add `games/<id>/game.json` (fields in `studio-bible/launcher.md`) and a cover in `assets/`.

- The cover file sets `window.StudioCovers['<id>'] = function (ctx) { ... }` and draws on a 120 × 80 canvas.
- If `src/package.json` has a `build` script, the site ships `src/dist/`. Otherwise `src/index.html` is bundled into one file.
- Games load `engine/studio.js` for `Studio.channel`, `Studio.savePrefix('bl.')`, `Studio.settings()`, `Studio.toShelf()` and `Studio.fromShelf` (true when opened from the shelf, so a game only offers a way back where there is one).
- A Continue button shows when any save key with the game's prefix exists, and opens the game with `?continue=1`.

## Offline

`sw.js` keeps every file of the site on the phone, plus the two Google Fonts. A new build downloads in the
background; the shelf reloads once it's ready. Saves stay in local storage and are never touched by an update.

## Checks

`npm run check` in `launcher/` builds the site, serves it like Pages does and plays it in a headless browser
at 320 × 480, 375 × 550 and 375 × 667: covers, saving, Continue, Dev/Release saves, export and import,
offline play and an update taking over.
