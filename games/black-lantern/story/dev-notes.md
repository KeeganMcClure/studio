# Developer notes (private)

Things the Developer must settle before building a part, kept here because they touch the arc.

**Nov 23:** the Designer reports both items below settled ("dev notes settled") and covered in the arc file. The arc file moved here unchanged from the private repo, so re-read it at LANTERN 01 part A and ask if either still looks open.

- **Before LANTERN 01 part A:** the arc file names Agency Case A "Dead Air" with a VHS / club / Records-clerk story, but the public To do now has "Dead Air" (spec 020) as a regular case in a different place, and "Tracking" (spec 018) has the closed club and the tape. The arc file looks older than specs 018 and 020. Ask the Designer which story LANTERN 01 tells now, in a way that doesn't spoil Keegan (Keegan chose not to know the arc).
- **Before LANTERN 03 (finale):** the arc file gives the Almoner three phases; bible Combat → Bosses allows two unless the case's spec says it needs a third, and then the battle grows.
- **Season 1 data:** the ids, unlock counts and finale flag are in `src/seasons/season-1.js` (moved from the private repo's `agency/season-1.js`, Nov 23). Regular cases planned for Season 1 (public To do): Still Harvest, Good Manners, Lot 83, Lost Hour, Tracking, Dead Air = 6, enough to reach every unlock count. `seasons/season-1.js` in the studio repo lists only the first three so far; each case's part A adds itself.
