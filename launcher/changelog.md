# Launcher changelog

What the Developer has built, newest first.

| Date | Area | Change |
| --- | --- | --- |
| Nov 21, 2026 | Launcher | First build (Setup Bible, Phase 5). Game Shelf: two covers per row drawn in code at 120 × 80 and scaled with crisp pixels, Continue under a cover when that game has a save. Settings sheet: Dev/Release toggle (Dev games keep their own saves under `dev.`), save export as one text code with Copy, and import with a second tap to confirm; import keeps a copy of what it replaced in `studio.importBackup`. Works offline: a service worker keeps the launcher, every game and the fonts on the phone, and a new build takes over on the next open. Home screen icon drawn in code. Deploys to GitHub Pages on every push; Release builds come from a `release` branch. Placeholder game Test Cart (`games/test-cart/`) proves the pipeline. Shared game-side piece in `engine/studio.js`. `npm run check` passes at 320 × 480, 375 × 550 and 375 × 667. Left: Keegan's iPhone checks (full-screen from home screen, offline, save through a reboot); shared settings (control layout, button size, volume); Black Lantern and Rushlight on the shelf (Phase 6). Deviations: Continue shows for any key with the game's prefix, since the bible doesn't say which key means "has a save"; the launcher itself always comes from `main` |
