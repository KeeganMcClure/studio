# Dev priorities

Studio-wide ranked list of Developer jobs across all games. Ranked Nov 24, 2026 from a review of the bibles, specs and changelogs. Copied here from the old "Game Dev Set Up" project before it was deleted.
Keegan's call, Nov 24: work the list top to bottom, switching games as it goes. Tick an item when it's done and add one indented `Done <date>:` line under it.

1. - [x] Black Lantern: Kinder overstepping (bible rule changed Nov 24).
   Done Nov 24: built and merged.
2. - [x] Black Lantern: bigger agents in battle (spec 023), before more cases.
   Done Nov 25: built and merged.
3. - [x] Rushlight: the look bug batch. Its dev prompt (`handoffs/rushlight-look-bugs-dev-prompt.md`) still has to be shared again by the Designer (see `designer-todo.md`).
   Done Nov 24: built and merged (studio PR #219).
4. - [ ] Rushlight: look pass 8A to 8D (spec 008), one part per session. Dev prompt: `handoffs/rushlight-facelift-dev-prompt.md`. It assumes the look bug batch is done first. The seven CO-TAG rows need Keegan's OK before 8C releases.
   Done Nov 24: all four parts built and merged (studio PR #220). The seven CO-TAG rows still need Keegan's OK before 8C releases.
   Done Nov 25: Keegan approved all seven CO-TAG rows (Text Library revision 22), so 8C can release.
5. - [x] Black Lantern: the later agency cases and the finale (spec 015).
   Done Nov 25: built and merged; waiting for Keegan's playtest and release.
6. - [ ] Life After: the slice, parts A to D (specs 001 to 004) and the cover.
   Part A and the cover merged Nov 24 (PR #216). Keegan's call, Nov 25: no phone notes on part A, since there isn't enough to play yet; part B goes ahead without them, and his first phone notes come after part B. Parts B to D still wait on the Designer's mockups for their "To draw" screens (Fights, Bag, Map screen, Notebook, Hideout, Attack, Death).
   Part B's town (sections, clock, night, searching, locks) built Nov 25, ahead of the mockups by Keegan's call. The rest of part B waits for the Bag, Map screen and Notebook mockups.
7. - [x] Black Lantern: the Gleaner's 1 px sprite bug (cosmetic).
   Done Nov 24: fixed and merged.

## Open flags

- Rushlight: the slice's missed tuning checks (spec 006 D2) now have a To do line in the bible (set Nov 25): retune the fights to spec 006's pass marks. Ready to build.

## How the work goes

- One job per session, from the top of this list. The Developer follows `CLAUDE.md`; the Designer keeps `designer-todo.md`.
- Questions to Keegan are multiple choice, 2 to 4 options, one marked (Recommended) with a one-line reason. He prefers tappable cards and short answers, since he reads on his phone.
- Check every suggestion against the bibles' locked decisions. Flag a conflict and ask whether to change the decision.
- After a batch of jobs finishes, post one summary: what was done, the next step, any dev handoffs, and how big each remaining dev job is.
