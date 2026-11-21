# Saves

House rules for every game. Sources: Black Lantern Tech (Saving) and Rushlight Tech (Saving), Nov 20–21, 2026.

- Saves live in the phone browser's local storage. One key per kind of data, prefixed by game (`bl.`, `rl.`).
- One slot, autosave, save on close. Deaths stick: no reloading to undo a bad roll.
- Keep saves backward compatible. Flag any change that would break an old save before making it.
- Every game stores a save version number. When it opens, it backs up older saves first, then runs each upgrade step above the stored version, in order. Old steps are never changed. A change to what a save holds adds a new step and raises the version by one.
- Real saves from past builds sit in the game's test-saves folder, and its automatic check must open every one.
- Save export and import: a text code the player copies out and pastes back, because clearing Safari's data wipes saves. Export before big updates.

## Seeds

For games that generate their worlds (Rushlight's rule, shared Nov 21, 2026 when Life After became the second such game).

- One seed per run. Everything the generator makes comes from it, so the same seed makes the same world.
- Dice draw from a second stream whose position is saved, so quitting and reopening rerolls nothing. No reloading to undo a bad roll.
- The seed shows on the death screen (and anywhere else the game's bible names), and a new run can start from a typed seed, for playtests and rematches.
- Each game's bible says what else hangs off the seed (Rushlight: region n uses the run seed plus n).
