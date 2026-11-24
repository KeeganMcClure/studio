You're the Game Developer on KeeganMcClure/studio. Build Rushlight's look pass, spec 008 (`games/rushlight/specs/008-look-pass.md`), one part per session, in order: 8A Sprites, 8B Streets, sites, map and HUD, 8C Menus, 8D The check. This session, build the first part whose line under "Look pass" in `games/rushlight/bible.md` To do is still unticked, and only that part. Spec 008's look checks were approved Nov 23 and it's merged, so build from it even though its header still says draft.

**Before you start**
- The look bug batch must already be built (spec 008 says build it first). Look for its entry in `games/rushlight/changelog.md`: trailing mercs, the hood, the Trade step, the outline, battle nameplates, cut-off words, dim text. If it isn't there, stop and tell Keegan. Don't guess at it.
- Read spec 008 in full; `studio-bible/art-style.md` (Craft, Quality bar, Animation); `studio-bible/ui.md` (Screen craft); the Rushlight bible's Art section (Look, Faces, Scale, Palette, Gore, and Look pass, Nov 23); `games/rushlight/src/CLAUDE.md`; and the mockups and drawing code your part names in `games/rushlight/mockups/`.
- The bar is Black Lantern's look. The Quality bar and Screen craft were written from it. You may open Black Lantern's drawing code to compare, but never its `cases/` or `story/` folders.

**How to build**
- The mockups are the target. They were drawn into the real build, so match positions, sizes and colors side by side at the same zoom. Their code is rough: tidy it as you lift it, but never flatten it.
- Only the look changes. Rules, maps, walk grids, content data and saves stay as they are (no `rl.version` change).
- Anything a second game could use goes in `engine/`: the animation timing table and rig helpers, the contact sheet runner, the parchment panel, the HUD card frame. If you touch `engine/`, run `npm run check` in both games.
- Don't hand-edit `engine/dialog.js` or `engine/shelf.js`. Never write to the Shared Shelf.
- 8A: file each creature redraw in the Rushlight Asset Library as a new version beside the old (add-only, such as rushlight-sprites-noonwife-v2), then import with `tools/import-art.js`. Hook `tools/contact-sheet.js` into `npm run check` so it writes `dist/contact-sheet.png`.
- 8A battle sizes: follow spec 008 and mockup 39 (party back views at 2×, foes at 1.5×, drawn natively). Keegan confirmed this over the older Nov 20 size line in the bible's Art section.
- 8C: add the seven CO-TAG rows to the Text Library as Draft. Pick a company becomes two steps; the rest of spec 003 part 3 holds.
- Check every changed screen at 320 × 480, 375 × 550 and 375 × 667: text never smaller than the mockup, no cut-off names, no dim body text, no bare floor.

**When you're done**
- `npm run check` passes in `games/rushlight/src/`.
- Add a dated `changelog.md` entry: what was built, what's left, and any deviation from spec 008.
- Tick your part's line under Look pass in the bible, with one indented `Done <date>:` line. Tick the parent Look pass line only after 8D.
- Push your branch and open a PR. Merging it puts the build on the Dev shelf. Don't release.
- Tell Keegan in plain words what changed, and what to look at: `dist/contact-sheet.png` (8A on) and the changed screens on Dev.
- If spec 008, a mockup and a bible rule disagree, or anything is unclear, stop and ask Keegan: 2 to 4 options, one marked (Recommended) with a one-line reason. Never change a bible or spec beyond the ticks.
