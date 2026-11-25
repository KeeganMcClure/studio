# Spec 009: Holidays

Status: draft, for Keegan's review · Written 2026-11-25 by the Game Designer · Game: Sarah's Sim · To do: Specs (Holidays)

## In plain words

The game follows the real calendar. In December snow falls past the windows and the Holiday tab fills with Christmas pieces. On Christmas morning there are gifts under the tree, and one of them is a note from Keegan. The rest of the year has its own days: New Year's Eve, Valentine's Day, his birthday on St. Patrick's Day, the first warm day of spring, the Fourth of July, your anniversary, her birthday, Halloween and Thanksgiving. On each one, the home and the street feel a little special, and she can throw a party for the neighbors. Each holiday is a page in the memory book.

Christmas is built first, since the game is opened on Christmas.

## Bible sections this spec relies on

The bible wins over this spec (`studio-bible/studio.md`, Specs).

| Source | Section | What it sets |
| --- | --- | --- |
| `games/sarahs-sim/bible.md` | Homes and people → Holiday things; Birthdays; Anniversary | Year-round holidays, Christmas first, then Valentine's, Halloween, Thanksgiving and more; her birthday Aug 31 and his Mar 17; the anniversary on Jul 10 |
| `games/sarahs-sim/bible.md` | Play → Reasons to come back | Real date; in Sandbox any holiday's pieces any time; Keegan's notes on holidays |
| `games/sarahs-sim/bible.md` | Play → Memory book | The Holidays chapter's moments and rewards |
| `games/sarahs-sim/bible.md` | Play → Life mode | Holiday pieces on sale during their holiday, staying hers after; holidays unlock special sets |
| `games/sarahs-sim/bible.md` | Decorating; Style | The Holiday tabs in the catalog and the wardrobe; the Christmas clothes |
| `games/sarahs-sim/bible.md` | Play → Visitors | Neighbors come to her holiday parties |
| `games/sarahs-sim/specs/005-garden-and-yard.md` | Part B, Seasons | Season dates and the yard's winter look |
| `games/sarahs-sim/specs/007-memory-book-and-notes.md` | Part C | Dated notes on holidays |
| `games/sarahs-sim/specs/008-visitors-and-neighborhood.md` | Parts C to E | The street; "a full house of visitors" |
| `studio-bible/studio.md` | No real brands | Plain holiday pieces |

The holiday pieces themselves, both furniture and clothes, are drawn as part of the decorating and Style work. This spec sets when they show up and what happens on each day.

## Screens

No new screens. Holidays dress the home, the yard and the street, fill the Holiday tabs and add a small **Party** card (part C). The party card is drawn in the Visitor chat mockup (spec 008).

## Part A: The holiday calendar

The holiday calendar follows the real date on her phone. Each holiday has a **season**, when its pieces are on sale and the street is dressed, and a **day**, when its special things happen. Season windows are a *Claude default*.

| Holiday | Season | Day | Build order |
| --- | --- | --- | --- |
| Christmas | Dec 1 to Jan 6 | Dec 24 evening and Dec 25 | 1 (by Dec 25) |
| New Year's Eve | Dec 26 to Jan 1 | Dec 31 evening | 2 |
| Valentine's Day | Feb 1 to 14 | Feb 14 | 3 |
| Keegan's birthday (St. Patrick's Day) | Mar 10 to 17 | Mar 17 | 4 |
| Spring's first warm day | first day of spring | Mar 20 | 5 |
| Fourth of July | Jun 27 to Jul 4 | Jul 4 | 6 |
| Anniversary | Jul 10 | Jul 10 | 7 |
| Sarah's birthday | Aug 31 | Aug 31 | 8 |
| Halloween | Oct 1 to 31 | Oct 31 | 9 |
| Thanksgiving | the week of the fourth Thursday of November | the fourth Thursday | 10 |
| First snow | the first winter day she opens the game | the same | with Christmas |

- **Build order:** the bible says Christmas comes first, then Valentine's, Halloween, Thanksgiving and more. The rest of the order is a *Claude default* that follows the calendar after Christmas, so each holiday is ready before its date comes round. Every holiday is aimed at Dec 25, as everything is.
- **The street in season:**
  - Christmas brings lights on every stoop and wreaths on the doors.
  - Halloween brings pumpkins and paper bats.
  - The Fourth of July brings small flags.
  - Each neighbor dresses their own home in their own style.
- **First snow** is a weather moment, not a holiday. Snow falls the first time she opens the game on or after Dec 21 (the start of winter, spec 005).

## Part B: Holiday pieces and dressing

**The Holiday tabs** (bible, Decorating; Style):

- In Life mode, each holiday's pieces show a "This season" ribbon and go on sale during that holiday's season.
- Once she buys a piece, it's hers to keep and use any time, all year.
- Out of season, pieces she hasn't bought show "Back in December", or the right month, with no price.
- Each holiday also has one special set. Its first piece is free on the day (a gift in the home), and the Holidays chapter rewards complete it (bible, Memory book).
- **In Sandbox,** every holiday's pieces are always there to use (bible, Real date).

**Day dressing** (*Claude default*, from the bible's birthday and anniversary lines):

- On a holiday's day, the home gets a light layer of decorations that are only for that day, like balloons or candles.
- They sit on top of her own design and never move or cover her pieces. They go away the next day.
- She can tap any of them to keep it, and it then joins her catalog for free.

| Day | Dressing and what happens |
| --- | --- |
| Christmas Eve | Stockings on the mantel or a wall, cookies left out for the night |
| Christmas morning | Gifts under her tree, or a little tree if she hasn't placed one. One gift holds Keegan's note (spec 007), and each of the others is a free Christmas piece. The cats wear tiny Santa hats. Keegan makes a special breakfast |
| New Year's Eve | Streamers, sparkling cider and a countdown at midnight on the real clock, then a kiss (bible, Romance) |
| Valentine's Day | Hearts on the windows, flowers on the table and a dinner to cook together (spec 006, part E) |
| Keegan's birthday | She can throw him a party with green decorations (bible, Birthdays) |
| Spring's first warm day | The windows open, light comes in and the cats sun themselves on the sills. A free seed packet waits on the back step (spec 005) |
| Fourth of July | A grill in the yard and fireworks over the street after dark. Ralph slowly leaves the window (no sound, shown on screen) |
| Anniversary | Candles, flowers and a special dinner to cook together, with Keegan's note on her pillow (bible, Anniversary) |
| Sarah's birthday | The home wakes up with balloons and a cake, a gift and a note from Keegan, and the cats in party hats (bible, Birthdays) |
| Halloween | Jack-o'-lanterns and costume picks in the Style Holiday tab. Neighbors trick-or-treat at the door in costume |
| Thanksgiving | A long table, a feast cooked with Keegan, and neighbors and family invited |

## Part C: Parties

- On any holiday day, a **Party** card shows when she opens the game: "Throw a party?" with **Invite everyone** and **Not this time**. The cursor starts on Not this time.
- When she says yes:
  - Neighbors she has met, plus friends and family (spec 008, part D), arrive over a few minutes.
  - They mingle, chat from a holiday line pool and react to her design.
  - Four or more guests at once fires "A full house of visitors" (spec 008, part E).
- On a party day, each guest who arrives gives a small holiday gift piece.
- Parties never cost coins and can't go wrong (pillar 3).
- On her birthday and his, the party is for that person. On his it's St. Patrick's green, and on hers the cake comes first.
- In Sandbox, she can start a party from the Start menu at any time, with any holiday's decorations.

## Part D: Holidays chapter moments

| Moment | Triggers when |
| --- | --- |
| First snow | The first-snow day (part A) |
| The Christmas tree trimmed | She places a Christmas tree with at least 5 ornament or light pieces on or around it (*Claude default*) |
| Christmas morning | She opens the game on Dec 25 |
| New Year's Eve | She has the game open at midnight on Dec 31, or opens it on Jan 1 (*Claude default*) |
| Valentine's Day | She opens the game on Feb 14 |
| Spring's first warm day | She opens the game on or after Mar 20, for the first time that spring |
| Fourth of July | She sees the fireworks: the game is open after dark on Jul 4 |
| Halloween costumes | She dresses Sarah and Keegan in Halloween costumes on Oct 31 |
| Thanksgiving dinner | She cooks or sits down to the Thanksgiving feast |
| Sarah's birthday | She opens the game on Aug 31 |
| Keegan's birthday | She throws or opens the game on his party day, Mar 17 |
| A whole year of holidays | Every holiday moment above is done |

- **The anniversary** goes in "The two of us" chapter (bible, Anniversary; spec 007).
- **A missed day** isn't a lost moment. If she doesn't open the game on a holiday, that moment waits for next year. The book shows that holiday's next date on its page (*Claude default*).

## Saves

- Saved here: the holidays she's seen, with their dates; day-dressing pieces she chose to keep; and gifts already given. Gifts are saved so they never repeat in the same year.
- The holiday dates are worked out from the phone's date each time, so nothing needs saving for the calendar itself.
- Everything goes under the planned `ss.` prefix, with a save version (`studio-bible/saves.md`).

## Build order

1. The Christmas season, Christmas Eve and Christmas morning, plus first snow. These must be ready by Dec 25.
2. Parties, built with Christmas.
3. The other holidays in calendar order (part A). Each is content plus the day dressing, with no new screens.

## Testing

- The game has a test-only date override, so each holiday can be checked without waiting for it.
- That override is never in the build Sarah plays (*Claude default*).

## Claude defaults to confirm

- Season windows.
- Build order after Christmas.
- Day dressing is one day only, and she can keep any piece.
- What each day brings (part B table).
- Party card on holiday days, with a gift from each guest.
- Moment triggers in part D.
- A missed holiday waits for next year.
