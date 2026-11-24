# Designer to do

Studio-wide list of Designer jobs that aren't on one game's `bible.md` To do yet. Started Nov 24, 2026 from a review of all three games.
Tick an item when it's done and add one indented `Done <date>:` line under it. When a job belongs to one game, it can move to that game's To do instead.

- [ ] Rushlight: share the look bug batch again (`handoffs/rushlight-look-bugs-dev-prompt.md`). Spec 008 says to build it before the look pass, but it isn't in project files.
- [ ] Rushlight: decide on the slice's missed tuning checks (`games/rushlight/dev-notes.md`, spec 006 D2). The Noonwife and the Counter are too easy, mercs died against the Withy Hag and the Counter, and Severa never Downs anyone. Then add a To do line to the bible.
- [x] Rushlight: file the slice's new art in the Asset Library: face parts and coin tokens (`src/species-art.js`), the region map (`src/region.js`), the streets (`src/town-art.js`) and the site tiles (`src/site-art.js`). The list is under "Art still to file" in `dev-notes.md`.
  Done Nov 24: five draft pieces in the Asset Library, drawn from the game code: rushlight-portraits-faces-v1, rushlight-icons-coins-v1, rushlight-ui-chart-v1, rushlight-tiles-streets-v1 and rushlight-tiles-sites-v1, waiting for your OK.
- [x] Rushlight: add autumn rows to the Text Library's VO-NARR-DEATH pool. The only row is a winter one, so the slice drops its frost line.
  Done Nov 24: VO-NARR-DEATH-2 to -6 added to the Text Library as Draft, waiting for your OK. Once approved, the build copies them in and plays them in autumn.
- [ ] Black Lantern: run more pitch rounds if season 1 still needs regular cases before the later agency cases (spec 015).
- [x] Update the status lines on merged specs that still read draft or waiting for merge: Black Lantern 015 and 023, Rushlight 008, Life After 001 to 004.
  Done Nov 24: all seven now read "approved (studio PR #<n>), ready to build". Most other Black Lantern and Rushlight specs still read draft or waiting for merge too; they weren't on this list.
