# Launcher

The launcher is the one home screen app. It opens to a shelf of covers; tap one to play. House rules for how a game appears in it.

## Covers

- Each game has GBA box art at **120 × 80**, half of a 240 × 160 screen (set Nov 21, 2026).
- Drawn in code like all other art, following `art-style.md`, in the game's own palette.
- The shelf shows two covers per row and scales them up with crisp pixels, like the games.
- The cover code lives in the game's `assets/` folder.

## Title cards

- The game's title is set in Press Start 2P on the cover itself, so the shelf needs no separate label.
- A Continue button under the cover appears when the game has a save, and opens straight into it.

## How a game registers

Each game folder has a small `game.json` that the launcher reads:

| Field | Holds |
| --- | --- |
| `id` | Folder name, also the site path (`black-lantern` → `/black-lantern`) |
| `title` | Shown on the cover and in settings |
| `savePrefix` | The game's save key prefix (`bl.`, `rl.`), so the launcher can show Continue and back up saves |
| `cover` | The file in `assets/` that draws the cover |
| `channels` | Which builds exist: `dev`, `release` or both |

A game with no `release` build shows only when the Dev/Release toggle is on Dev.

## Dev and Release

- Every game has a Dev build (new work, from `main`) and a Release build (stable, from the `release` branch). A toggle on the shelf switches between them.
- New work goes to Dev. A game moves to Release only when Keegan says so.
- Dev builds keep their own saves, so testing never touches Release saves.

## On the phone

- Install: open the site in Safari, then Share, Add to Home Screen. It opens full-screen like an app.
- Every game plays offline once it has loaded.
- Saves live in on-device browser storage. The installed app protects them far better than a Safari tab, but save export and import stays (see `saves.md`).

## Shared settings

Control layout, button size and volume live in the launcher and apply to every game. Games read them; they never keep their own copy.
