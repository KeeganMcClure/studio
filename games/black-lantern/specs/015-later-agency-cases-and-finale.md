# Spec 015: the later agency cases and the season finale

Status: proposed, waiting for Keegan's merge · Written 2026-11-22 by the Game Designer · Game: Black Lantern · To do: Later agency cases and the finale

## In plain words

Spec 014 set up the first agency case as a **frame**: the public rules the case has to fit, with the Developer filling in the place, cast, maps and art from the secret agency arc file. This spec says every later agency case in a season, the finale included, uses that same frame, and adds the few rules that only the finale has.

It names no case, place or story, and it never says how many agency cases a season has. That number lives only in the arc file. Public text calls each one by its LANTERN number (`LANTERN 02` and so on) and the last one "the finale".

Keegan set a planning target for season 1's regular cases on Nov 22, 2026 (kept in the project, not here), and pitch rounds fill it one at a time. The Developer still checks the arc file and says only "needs more regular cases" if that isn't enough (spec 014, Part A).

## Bible sections this spec relies on

| Source | Section | What it sets |
| --- | --- | --- |
| `games/black-lantern/bible.md` | Story → Agency arc | Agency cases unlock after a set number of closed cases and don't count toward the next unlock; the last one is the finale; the arc file stays secret and wins on arc secrets |
| `games/black-lantern/bible.md` | Story → Adding a new case | Agency cases skip the pitch; their spec is a public frame (spec 014) |
| `games/black-lantern/bible.md` | Systems → Personal arcs | Arc beats decide each agent's arc finale; running arcs carry into the next season |
| `games/black-lantern/bible.md` | Combat → Combat numbers | The season finale boss row (more HP than a case boss) |
| `games/black-lantern/bible.md` | Combat → Bosses; Lasting injuries | Boss rules and tuning check; +2 on the injury roll in a season finale fight |
| `studio-bible/studio.md` | No real brands | Look-alike names only |
| `games/black-lantern/specs/009-season-flow.md` | Steps 1, 3, 4, 5 | Season data file, agency card and unlock, the finale card, the season end screen and the next season |
| `games/black-lantern/specs/014-first-agency-case.md` | All | The frame this spec reuses: the table, art, parts A and B, the Dev shortcut, saves, must stay true, done when, rules check |

## Every later agency case

Each one is built exactly as spec 014 says, with `01` read as its own number:

- The same frame table (card, unlock, briefing, length, fights, danger zones, boss, clues, skills, motivation moments, horrors, open or quiet, cover stories, endings, loot, arc touches), the same art rules, and its own Asset Library page titled `LANTERN nn` that opens with a spoiler line.
- The same two parts, one session each: **part A** starts with the secret case file `claude/cases/lantern-nn.md` in the Black Lantern private files, then maps, art and stand-in scripts; **part B** is story and play.
- The same Dev-only shortcut, extended so it can pin any built LANTERN case. It never ships to Release.
- The same reach check: before part A, the Developer checks the regular cases that will exist when it ships against its unlock count, and reports only "LANTERN nn needs more regular cases before it can unlock".
- **One at a time, in arc order.** Each agency case is built after the one before it ships. Since the board shows only one open agency case at a time (spec 009, step 3), that's also the order you play them.

## The finale

The finale is the agency case the season data marks (spec 009, step 4). It follows the frame above, with these changes:

| Piece | Finale rule |
| --- | --- |
| Card | The finale card from spec 009: the agency card with a gold edge, `FINALE` under the LANTERN number, place line `SEASON FINALE · <place>` |
| Length | 1.5–2 hours, one case. It may break the case pattern on purpose (Gameplay loop allows it) but never runs past 2 hours |
| Fights | 2–3 story fights plus the finale boss, no random encounters |
| Boss | Threat 3, at the Season finale boss row in Combat → Combat numbers, not the case boss row. At least two case choices that weaken it, since a finale should reward the whole case, and a weakness Identify can find. 8–12 rounds. The tuning check runs against a mid-level template: a careful party wins with at most one agent Downed; a party that skipped the case's choices can lose |
| Lasting injuries | +2 on the roll in every fight of the finale, not just the boss (Combat → Lasting injuries) |
| Motivation moments | 1–2, as usual, aimed at the motivation types the season's personal arcs lean on |
| Endings | `clean`, `costly`, `worst`, as for any case. The debrief and home phase play, then the season end screen (spec 009, step 5) instead of the board |
| Season end | Big Hat's closing lines for the season end screen are part B's job, written from the arc file and kept in the season data |
| Game over | Reopens the finale like any case. The season doesn't end until it's closed |

## Art

As spec 014: Shared Shelf first, the case's own art on its `LANTERN nn` Asset Library page, generic pieces proposed to the Shelf only with Keegan's OK and described by what they are, never by the case. The finale card's gold edge is already in spec 009's build.

## What to build

Depends on the Season flow build (spec 009) and on the first agency case (spec 014), whose Dev shortcut and card this reuses.

- One To do line covers every later agency case and the finale, since listing them would show how many there are. The Developer builds them one at a time, each in a part A and a part B session, and names each in the changelog only as `LANTERN nn` or "the finale".
- The line is ticked when the season data file has every agency case of the season built, and a Dev playtest runs from a new game through the finale to the season end screen and into Season 2's board.

## Saves

None new. Everything the agency cases and the finale need in `bl.season` comes from spec 009. If a part B adds anything to what a save holds, it adds an upgrade step and test saves as usual.

## Must stay true

- Every regular case, the first agency case, the board, the season flow, the debrief and the home phase work as before.
- Old saves keep opening, every test save included.
- Closing an agency case never raises `closed`; only one agency case is open at a time; none shows on the board before it unlocks, on Release.
- No real brand names or logos.
- No count of agency cases, unlock number, place, title or story beat appears in this spec, the bible, the To do, the changelog, a commit message or a PR.

## Done when

- For each case: everything in spec 014's Done when, read for its own number.
- For the finale also: its card shows the gold edge and `FINALE`; every fight in it uses the +2 injury modifier; the boss passes the tuning check at the finale row; closing it plays the season end screen, resets overstepping to Clean, and opens Season 2's board with carried-over cases first and `MORE ON THE WAY. —BH` if there's no Season 2 file yet.
- A full-season Dev playtest from New game to the season end screen, through the Dev test season (spec 009).
- `npm run check` passes at all three sizes.

## Rules check afterwards

Like spec 014, the Designer's rules check covers only this public frame: lengths, fight and danger-zone counts, boss rules and rows, the cards, unlocks, the injury modifier, the season end, saves and screen fit. It never opens a case file or a case's text block.
