# Spec 008: Visitors and the neighborhood

Status: draft, for Keegan's review · Written 2026-11-25 by the Game Designer · Game: Sarah's Sim · To do: Specs (Visitors and the neighborhood)

## In plain words

People knock on the door. Four made-up neighbors live on the block: Dot the retired florist, Marco and Jules with a baby on the way, Theo the shy painter, and Priya the night-shift nurse with her goofy dog Biscuit. Each one drops by, chats and asks for a small design job. Over four visits each one tells a little story. At the end, Sarah walks over to their home and redoes it, and they give her a special set. Real friends and family drop by too, and so can anyone she makes in the creator.

Outside the front door is a short cozy street: Sarah's home, the four neighbors' homes and a few empty lots where she can build new homes from scratch.

## Bible sections this spec relies on

The bible wins over this spec (`studio-bible/studio.md`, Specs).

| Source | Section | What it sets |
| --- | --- | --- |
| `games/sarahs-sim/bible.md` | Play → Visitors | Who visits, visits, stories, walking to their homes; The block: four neighbors, four visits each, the story beats, their homes and sets, sets in steps, after the story, Biscuit |
| `games/sarahs-sim/bible.md` | Play → Life mode | Gigs, coins and pay (250 for a story gig, 600 for a whole home) |
| `games/sarahs-sim/bible.md` | Play → Memory book | The Friends chapter's 10 moments |
| `games/sarahs-sim/bible.md` | Homes and people | Real people from Keegan's list; the creator; other homes built on empty lots |
| `games/sarahs-sim/bible.md` | To do → Real people | The list of friends and family, with a photo or notes (family listed privately; friends still to come) |
| `games/sarahs-sim/specs/006-life-mode.md` | Part F | The Gig screen, judging with hearts, lent pieces |
| `games/sarahs-sim/specs/007-memory-book-and-notes.md` | Part A; Privacy | Moment pop cards; real names stay out of the repo |
| `studio-bible/ui.md` | Dialog box; Screen craft | The dialog box layout; readable text |
| `studio-bible/play.md` | No accidental point of no return; Picks from a pool don't repeat | Confirms; chat lines don't repeat |
| `studio-bible/studio.md` | No real brands; Playtests | Plain names; the playtest after the first part with new screens |

## Screens this spec covers

| Screen | Mockup |
| --- | --- |
| Visitor chat | **To draw** before part A |
| Neighborhood | `neighborhood-v1` (approved Nov 26, 2026) |

## Part A: Visits

**The knock** (Life mode):

- Now and then a knock shows at the front door: a small speech bubble with the visitor's face.
- *Claude default:* at most one visitor each time she opens the game, and only after 2 to 5 minutes of play, so she can settle in first.
- She taps the door to **Let in** or **Not now**. Not now is fine: they come back another time, with nothing lost and no hurt feelings (pillar 3).

**Visitor chat** (`studio-bible/ui.md`, Dialog box):

- The visitor comes in and stands with Sarah in the room.
- They're drawn large in the scene, so the box shows their name tab only, with no portrait.
- They chat for 3 to 6 short lines, and then:
  - on a story visit, they ask for the story's gig;
  - on an ordinary visit, they offer an ordinary gig on the Gig screen (spec 006).
- Chat lines come from each visitor's pool and don't repeat until the pool runs out (`studio-bible/play.md`). The list of what's been said goes in the save.

**Pacing** (*Claude default*):

- Dot visits first, on Sarah's first day of Life mode, since she's admiring the garden.
- The others meet her over the first week: Marco and Jules on day 2, Priya and Biscuit on day 4 and Theo on day 6.
- Each neighbor's next story visit can come once per real day at most, so each story takes at least four days. With the four stories overlapping, the block fills her first few weeks.

**Friendship:**

- Each visitor has a friendship meter shown as hearts, with the word "Friends" next to it.
- It grows with every chat and every gig, and more with more hearts on a gig. It never goes down.
- Story visits wait on the step before, not on the meter. The meter adds small extras: a gift at 3 hearts and a favorite piece of theirs at 5 (*Claude default*).

**Done when:**

- A knock comes and shows Let in or Not now.
- Each of the four neighbors plays their four story visits in order, each with its chat and its gig.
- Chat lines don't repeat until the pool is used up.
- Friendship only grows.

## Part B: Stories and sets

The four stories, their gigs, their homes and their sets are the bible's The block table. This spec makes each beat exact:

- **Visits 1 to 3:** a chat plus that visit's story gig. The gig pays 250 coins (bible, Coins and prices), judged in hearts like any gig (spec 006, part F).
- **Visit 2:** unlocks the first piece of their set (bible, The block). That also opens their front door for a visit to say hi (part C).
- **Visit 4:** the chat ends with the ask for their home. It opens their home for the redo (part C).
- **Home done:** the rest of the set unlocks, they throw a little thank-you moment in their home, and their story is finished.
- **After the story:** they keep visiting now and then with ordinary gigs, and they come to Sarah's holiday parties (spec 009).
- **Biscuit:**
  - He runs into Sarah's yard on Priya's first visit and comes along on her visits after that.
  - The cats react to him: Louie grumbles and Ralph slowly leaves.
  - He's never Sarah's to look after.
- **Sandbox:** the story plays the same way (the chats and gigs are design fun), but pays no coins, and her catalog already has every piece. Story progress is saved separately per mode (*Claude default*).

**Done when:** each story runs from visit 1 to a finished home, the set unlocks in its two steps, and the neighbor then keeps coming back with ordinary gigs.

## Part C: The neighborhood

**The street:**

- Outside the front door, in the same isometric view, is one short Philly-style street with brick fronts, stoops, trees and string lights in winter.
- It has Sarah's home, the four neighbors' homes and three empty lots (Keegan approved the layout with the mockup, Nov 26):
  - Every home sits on the same side of the street, so every front door is in view. A little pocket park with benches is across the street.
  - From left to right: a large lot, Priya, a small lot, Dot, Sarah's home, Marco and Jules next door, a medium lot, and Theo on the corner, where the side street crosses.
  - The empty lots come in the bible's three sizes (spec 004).
- The street follows the real season and time of day, like the yard (spec 005).
- No real street or address appears anywhere (bible, Starter home).

**Getting around:**

- She taps the front door and picks **Go outside**, which opens the Neighborhood screen.
- She taps a home to walk there, then **Knock**, or **Go in** for her own homes. The D-pad walks too.

**Visiting a neighbor's home:**

- From visit 2, she can knock and drop in to say hi. They show her around and have a short chat, which fires the moment "First visit to a neighbor's home".
- After visit 4, Redo opens their home in the Decorate and Style tools, as one big gig:
  - All pieces are lent free, as with every room gig.
  - Her design stays as it is in their home.
  - The gig pays 600 coins (bible, Coins and prices) and fires the moment "First neighbor's home redone".
- She can go back and change their home any time after. That stays free and pays nothing more.

**Empty lots:**

- Each empty lot opens the Build tools (spec 004).
- A home she builds there can be lived in by people she makes in the creator.

**Done when:**

- She can walk from her home onto the street, into each neighbor's home once it's open, and onto each empty lot.
- The street fits at 375 × 667 and scrolls across.
- Each home's redo is saved.

## Part D: Real people and creator people

**Real friends and family** (bible, Who; To do, Real people):

- Each real person gets a person sheet drawn from Keegan's photo or notes.
- They visit in Life mode like anyone else: a knock, a chat and sometimes a small gig. They also come to holiday parties (spec 009).
- *Claude default:* real family members get simpler visits than the neighbors, with no four-part story at first. A real person's story can be added once Keegan writes one. Their visits pick from a chat pool Keegan can add lines to.
- Sarah's mom is already part of idle life as the video call. *Claude default:* her mom can also visit in person.
- **Names and chat lines are private.** They live in the private data (spec 007, Privacy), and the repo holds placeholders.

**People she makes** (spec 003, Creator):

- Anyone she makes can live in a home she builds on an empty lot.
- They visit with ordinary gigs and chats from a general pool.
- They don't have a story (*Claude default*).
- The moment "First person made in the creator" belongs to spec 003.

**Done when:**

- Placeholder real people visit with their own chat pools.
- A person made in the creator moves into a built home and drops by with a gig.

## Part E: Friends chapter moments

| Moment | Triggers when |
| --- | --- |
| First visitor | The first Let in |
| First gig done | The first gig handed in |
| First visit to a neighbor's home | The first time she goes into a neighbor's home |
| First neighbor's home redone | The first home redo handed in |
| First person made in the creator | Spec 003 |
| A visitor brings a gift | A visitor's 3-heart gift (part A) |
| First friend's story finished | The first neighbor's home is done |
| Three friends made | Three visitors at 3 hearts or more |
| Every neighbor's story finished | All four homes are done |
| A full house of visitors | Four or more visitors in her home at once, at a holiday party (spec 009) or by inviting them from the street (*Claude default:* an Invite over action on any visitor's home) |

## Saves

- Saved per visitor: friendship, story step, the date of the last visit, the chat lines said, and whether their home is open or done.
- Saved per home: each neighbor's home and each built home, as full homes.
- Also saved: who lives where.
- Saved under the planned `ss.` prefix with a save version (`studio-bible/saves.md`).

## Build order

1. Draw and approve the **Visitor chat** mockup.
2. Part A with Dot's story (part B for one neighbor). Keegan plays it on the phone (`studio-bible/studio.md`, Playtests).
3. Draw and approve the **Neighborhood** mockup, then build part C.
4. The other three stories, part D and part E. These are content and rules.

This spec needs the Gig screen (spec 006, part F) and the Build tools (spec 004) built first.

## Claude defaults to confirm

- One visitor per opening at most, after 2 to 5 minutes of play.
- Neighbors are met on days 1, 2, 4 and 6, with one story visit a day per neighbor.
- A gift at 3 hearts and a favorite piece at 5.
- Story progress is kept separately per mode.
- Real people get simpler visits until Keegan writes them a story, and Sarah's mom can also visit in person.
- Creator people have no story.
- Invite over makes "a full house" possible outside holidays.
