# Designer to do

Studio-wide list of Designer jobs that aren't on one game's `bible.md` To do yet. Started Nov 24, 2026 from a review of all three games.
Tick an item when it's done and add one indented `Done <date>:` line under it. When a job belongs to one game, it can move to that game's To do instead.

- [x] Rushlight: share the look bug batch again (`handoffs/rushlight-look-bugs-dev-prompt.md`). Spec 008 says to build it before the look pass, but it isn't in project files.
  Done Nov 25: no longer needed. The Developer built the batch from the copy in project files (studio PR #219), before the look pass.
- [x] Rushlight: decide on the slice's missed tuning checks (`games/rushlight/dev-notes.md`, spec 006 D2). The Noonwife and the Counter are too easy, mercs died against the Withy Hag and the Counter, and Severa never Downs anyone. Then add a To do line to the bible.
  Done Nov 25: your pick, retune the fights to spec 006's targets (don't change the targets). It's a To do line in the Rushlight bible for the Developer.
- [x] Rushlight: file the slice's new art in the Asset Library: face parts and coin tokens (`src/species-art.js`), the region map (`src/region.js`), the streets (`src/town-art.js`) and the site tiles (`src/site-art.js`). The list is under "Art still to file" in `dev-notes.md`.
  Done Nov 24: five draft pieces in the Asset Library, drawn from the game code: rushlight-portraits-faces-v1, rushlight-icons-coins-v1, rushlight-ui-chart-v1, rushlight-tiles-streets-v1 and rushlight-tiles-sites-v1, waiting for your OK.
  Done Nov 25: Keegan approved the 16 current pieces (the look pass's species sheet, all 9 creatures, streets v2, sites v2, chart v2, the parchment menus, face parts and coin tokens). The 10 older drafts they replaced are marked replaced, each pointing to its newer version.
- [x] Rushlight: add autumn rows to the Text Library's VO-NARR-DEATH pool. The only row is a winter one, so the slice drops its frost line.
  Done Nov 24: VO-NARR-DEATH-2 to -6 added to the Text Library as Draft, waiting for your OK. Once approved, the build copies them in and plays them in autumn.
  Done Nov 25: Keegan approved all five; they're Approved in the Text Library, ready for the build to copy in.
- [x] Black Lantern: run more pitch rounds if season 1 still needs regular cases before the later agency cases (spec 015).
  Done Nov 25: closed on your call. Season 1 has its 6 regular cases, all specced and built, and the finale (spec 015) is built too.
- [x] Update the status lines on merged specs that still read draft or waiting for merge: Black Lantern 015 and 023, Rushlight 008, Life After 001 to 004.
  Done Nov 24: all seven now read "approved (studio PR #<n>), ready to build". Most other Black Lantern and Rushlight specs still read draft or waiting for merge too; they weren't on this list.
