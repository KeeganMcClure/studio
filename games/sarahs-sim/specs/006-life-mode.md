# Spec 006: Life mode

Status: draft, for Keegan's review · Written 2026-11-25 by the Game Designer · Game: Sarah's Sim · To do: Specs (Life mode: clock, needs, cat care, gigs, coins, idle life)

## In plain words

Life mode is the home with life in it. It runs on the real clock, so morning light comes through the windows in her morning and the lamps are on in her evening. Sarah plays as herself. She taps where to walk and what to do, like cooking, painting, taking a bath, playing with the cats or curling up on the couch. Keegan lives on his own. When she opens the game he's already busy doing something that fits the time of day, often cooking for her, and she can tap him to do something together.

Everyone has three soft needs: energy, hunger and fun. A low need only means a yawn or a sigh, never a problem. Louie and Ralph need food, play and a clean litter box, and when she forgets they just sit by the bowl looking grumpy. She earns coins from design gigs and chores, and spends them on furniture, clothes and seeds. Anything she buys can be sold back for every coin, so trying things costs nothing. Nothing runs down while she's away.

## Bible sections this spec relies on

The bible wins over this spec (`studio-bible/studio.md`, Specs).

| Source | Section | What it sets |
| --- | --- | --- |
| `games/sarahs-sim/bible.md` | Modes | Life mode: real clock, soft needs, cats, garden, gigs, coins; unlocks only here |
| `games/sarahs-sim/bible.md` | Play → Reasons to come back | Real date; Keegan's notes; idle life with four times of day, crafts and cheeky after-moments |
| `games/sarahs-sim/bible.md` | Play → Life mode | Who she plays; the three needs; everything pauses while away; gigs; minigames; unlocks; coins and prices; nothing is lost |
| `games/sarahs-sim/bible.md` | Play → The cats | Full pet care, needs only in Life, never bad, Louie's and Ralph's personalities |
| `games/sarahs-sim/bible.md` | Play → Romance; Winding down | Flirty with a fade to black; joints, the bong and brownies, played light |
| `games/sarahs-sim/bible.md` | Play → Cooking | Keegan cooks, cook together, the nine recipes, garden veggies add a sparkle |
| `games/sarahs-sim/bible.md` | Play → Visitors | Who brings gigs and what each friendship gives (the visit itself is spec 008) |
| `games/sarahs-sim/bible.md` | Play → Memory book | Kitchen, cats and two-of-us moments this spec triggers |
| `games/sarahs-sim/bible.md` | Decorating; Controls and screen; Art | The catalog and tray, touch first, the isometric view, `look-iso-v1` top bar |
| `games/sarahs-sim/specs/005-garden-and-yard.md` | Parts B and D | The pantry, the chores and their pay |
| `studio-bible/play.md` | No accidental point of no return; Picks from a pool don't repeat | Confirm before anything that can't be undone; idle life picks |
| `studio-bible/ui.md` | Screen craft | Readable text, cards, color never the only label |
| `studio-bible/saves.md` | All | Autosave, save versions, export and import |
| `studio-bible/studio.md` | No real brands; Playtests | Plain names on screen; the playtest after the first part with new screens |

## Screens this spec covers

| Screen | Spec | Mockup |
| --- | --- | --- |
| Life mode top bar | this spec, part A | `look-iso-v1` (top bar), approved |
| Cooking | this spec, part E | **To draw** before part E |
| Gig | this spec, part F | **To draw** before part F |

Action bubbles (part B) and need meters (part C) sit over the home screen. They're drawn in the Cooking mockup so they match it, and no extra screen row is needed.

## Part A: The clock and the top bar

- **Real time:** Life mode reads the phone's clock and date. It has no game days that run faster than real ones (bible, Reasons to come back).
- **Light:**
  - Morning (6 to 11 AM) is soft gold light from the windows.
  - Daytime (11 AM to 5 PM) is bright.
  - Evening (5 to 10 PM) is a warm sunset that turns to lamp glow.
  - Late night (10 PM to 6 AM) is dark windows with stars, lamps and the lamp-glow pools from `look-iso-v1`.
  - The light changes smoothly over about 20 real minutes at each edge.
- **Lamps:** placed lamps switch on on their own in the evening. She can tap a lamp to turn it on or off at any time.
- **Top bar** (`look-iso-v1`): the weekday and date, the time (12-hour, like her phone), and coins with a coin icon. In Sandbox it shows the mode and the home's name instead (bible, Decorating).
- **Away:** when she comes back, the clock just shows the new time. Plants have grown (spec 005), and every need is where she left it (bible, Away from the game).

**Done when:** the light matches each of the four times of day when the phone clock is set to them. Lamps come on at 5 PM. The top bar fits at 320 × 480 with nothing cut off.

## Part B: Playing as Sarah

**Moving and doing** (bible, Who she plays; Controls and screen):

- She taps the floor to walk Sarah there, along a path around furniture. The D-pad walks her too.
- She taps a piece, a cat or Keegan to open a small **action bubble** over it, with 2 to 4 actions as large buttons. A tells Sarah to do the first one, and B closes the bubble.
- Sarah walks over and does it with a short animation, from a few seconds up to about 30. A slim bar over her head shows how long is left. Tapping anywhere else stops the action, and nothing is lost.
- Only one action runs at a time. She can line up to 3, shown as small icons by the top bar (*Claude default*).

**Starter actions** (*Claude default*, by piece type. New pieces add their own):

| Tap on | Actions | Fills |
| --- | --- | --- |
| Bed | Sleep · Nap · Lie in (with Keegan, when he's free) | Energy |
| Sofa | Sit · Watch a show · Cuddle up (with Keegan) | Fun, a little energy |
| Fridge or pantry | Snack · Cook (opens Cooking, part E) | Hunger |
| Easel or craft table | Paint · Seasonal craft | Fun. Makes a piece (below) |
| Tub or shower | Bath or Shower. Louie may hop up on the tub edge (bible, Louie) | Energy, fun |
| Bookshelf | Read | Fun |
| Desk or laptop | Find a gig (part F) · Video-call Mom | Fun |
| Wardrobe or mirror | Change outfit (opens Style) | none |
| Cat | Pet · Treat · Play (with a toy) | Fun, and the cat's play |
| Keegan | Together actions (below) | Depends on the action |
| Back door | Go to the yard (spec 005) | none |

**Crafts** (bible, Idle life, Crafts):

- When Sarah finishes Paint, she gets a painting. Her seasonal craft makes that season's piece: winter ornaments or a garland, spring pressed flowers, a summer wind chime or painted pots, or a fall wreath or carved pumpkin.
- Each finished piece goes into her catalog under **Ours**, and the first copy appears near where she made it. She can keep it there, move it or put it away.
- Keegan's finished crochet works the same way: a blanket on the sofa, a little cat hat, or a plant hanger.
- Each craft piece is free and drawn in code. *Claude default:* about 4 pieces per season, plus 6 paintings and 6 crochet pieces to start. They come from a pool that doesn't repeat until every piece has been made once (`studio-bible/play.md`).

**Sleep:** sleeping fills energy. When she plays at night, Sarah can go to bed and the screen fades to a cozy sleeping scene. She doesn't need to skip time, because time is the real clock.

## Part C: Needs

People have three soft needs (bible, Needs):

| Need | Icon | Goes down | Filled by |
| --- | --- | --- | --- |
| Energy | Moon | Slowly while awake and playing | Sleep, naps, a bath, lying in |
| Hunger | Bowl | Slowly while playing, a bit faster after winding down (bible, Winding down) | Keegan's meals, cooking together, snacks, brownies |
| Fun | Star | Slowly while playing | Crafts, reading, shows, cats, gigs, minigames, Keegan, winding down |

- **Rates** (*Claude default*): from full to low takes about 40 minutes of play. Nothing drains while the game is closed.
- **Low needs:** below a quarter, Sarah yawns, sighs or her tummy rumbles, and actions take a little longer. That's all that happens (bible, Needs; pillar 3). No need can hurt her, stop her doing anything or end anything.
- **Meters:** tapping Sarah shows her three meters beside the action bubble, each with its icon and word (`studio-bible/ui.md`). The meters are hidden the rest of the time, to keep the room clean.
- **Keegan's needs:** he has the same three, but he looks after them himself as part of idle life. They're shown only when she taps him.
- **Sandbox:** no needs (bible, Modes).

**Done when:** each need goes down only while the game is open, fills from the actions above, and only makes Sarah yawn, sigh or slow down when it's low. In Sandbox, there are no meters.

## Part D: Keegan, the cats and idle life

**Idle life on opening** (bible, Idle life):

- Each time she opens Life mode, Keegan, and Sarah if she's idle, start in an activity from the current time of day's pool.
- The pools and the full list are in the private project files. The build gets them as game data at build time, the way Black Lantern gets its secret story files. They're never quoted in this repo.
- Picks don't repeat until the pool runs out. The list of what's been shown goes in the save (`studio-bible/play.md`). *Claude default:* the after-moments are rare, at most one in every eight openings.
- Idle Sarah: the game opens with Sarah in the middle of something (her call with Mom, painting, watering). As soon as she taps anything, Sarah stops and is hers to play.

**Keegan through the day:**

- He moves from one activity to the next in his pool every 5 to 15 minutes of play. He's often cooking near mealtimes (morning, around noon and evening), and a meal he finishes goes on the table with a sparkle. Tapping it lets Sarah eat, which fills hunger (bible, Cooking).
- **Together actions:** she taps Keegan for Chat, Hug, Kiss, Cuddle up, Cook together (part E), Wind down together, Play a game together and Go to bed. Each one walks them both to the right spot.
  - Romance follows the bible: flirty, with a fade to black, never explicit. The details are in the private project files.
  - **Hug and kiss feel different** (Keegan, Nov 25). Each picks from its own pool of variations, with no repeats until the pool runs out (`studio-bible/play.md`):
    - Hug is warm and comforting. Its variations include a cheeky one Keegan asked for. It fills a little fun and a little energy.
    - Kiss is romantic and changes with the time of day. It fills more fun, and the first one is the "A kiss" memory book moment.
    - The variations themselves are in the private data, and the repo keeps a placeholder (spec 007, Privacy).
  - Winding down uses the joint, the bong or a brownie, and fills fun and lowers hunger a little (the munchies). The bong is drawn from Keegan's reference photo (bible To do).
- **Busy:** if Keegan is in the middle of something he can't stop (on a call or in class), the bubble says so, and she can queue the action for when he's done.

**Sarah's phone** (Keegan, Nov 25):

- Doomscrolling on her phone is one of Sarah's idle activities, at any time of day. She's curled up somewhere and thumbing away.
- **Always about to die:** her phone has a little battery that runs down while she scrolls, calls or takes photos (bible, Keeping designs). When it's low, a red low-battery icon pops over her head and she holds the phone up with a look of despair.
  - Tapping her shows **Charge**, and she goes looking for the charger. The charger is never where she left it: it's under a couch cushion, in the bed sheets, or under Ralph. Finding it is a quick tap on the right spot, with the first spot glowing as a hint.
  - Keegan may hand her his charger if he walks by, as a little together moment.
  - A dead phone just means no calls or photos until it's charged, which takes a few minutes of play. Nothing else is lost (pillar 3).
  - *Claude default:* the battery drains only while the game is open, like the needs, and the charger hides in a different spot each time, from a pool that doesn't repeat until it's used up (`studio-bible/play.md`).

**The cats** (bible, The cats):

| Cat need | Shows when low | She fixes it by |
| --- | --- | --- |
| Hunger | Sits by the bowl. Louie gets chatty, with speech bubbles. Ralph flops by the fridge | Filling the bowl (tap the bowl, then Fill) |
| Play | Gets bored, and knocks a small thing off a table (it can always be picked back up) | Playing with a toy. Ralph's feather wand counts double |
| Litter box | A grumpy face near the box | Scooping it (tap the box, then Scoop) |

- Cat needs drain at the same rate as people's, only while she's playing, and pause while she's away. A cat never gets sick, hurt or runs off (bible, Never bad).
- Their personalities drive what they do on their own: Louie naps in the coziest spot and sits on the tub edge, and Ralph turns up whenever Keegan cooks and lies on his toy pile. Toys she gives Ralph join the pile.
- Ralph slowly leaves the room when something loud starts, like the vacuum, the blender or the mower. Louie sits right next to Sarah, but isn't a cuddler.
- In Sandbox, the cats wander, nap and react, with no needs (bible, *Claude default*).

**Done when:**

- Opening the game at each of the four times of day starts Keegan in a fitting activity, with no repeats until the pool runs out.
- Each together action plays.
- Each cat need shows its nudge and clears when she fixes it.
- Nothing about a cat ever goes wrong.

## Part E: Cooking

The Cooking screen is a short minigame: chop, stir and plate one of Keegan's nine dishes with him (bible, Cooking).

- **Starting it:** she taps the stove or the fridge and picks Cook, or taps Keegan while he's cooking and picks Cook together. The recipe card shows the dish, what goes in and its steps.
- **Playing it:** each step from the bible's Minigame steps column is one short one-thumb game: drag to chop, circle to stir, hold to sear, or tap to stack. A whole dish takes 1 to 2 minutes. Keegan cooks beside her and does the other half of each step.
- There's no way to fail and no timer. A step that's a bit off still makes the dish, and the plate just has a little less sparkle.
- **Garden veggies:** if the pantry (spec 005) has a matching veggie (peppers, onions, greens or tomatoes), it's used in place of the store-bought one and the dish gets a garden sparkle (bible, *Claude default*).
- **Eating:** the dish goes on the table. Eating it fills hunger for both of them, and Ralph shows up and stares.
- **Moments:** the first time she makes each dish adds a Kitchen chapter moment, with its date (bible, Memory book). Cooking pays no coins (bible, Coins and prices).
- **Store-bought ingredients** are always in the pantry, with plain names and no brands. Coins never limit what she can cook (*Claude default*).
- **Sandbox:** she can cook for fun.

**Done when:** each of the nine dishes plays from start to finish at 375 × 667 and 320 × 480. A garden veggie adds the sparkle. The first time she makes a dish, it adds its moment.

## Part F: Gigs, coins and the shop

**Gigs** (bible, Job: design gigs):

- **Where they come from:** a visitor at the door (spec 008), or Find a gig at the desk, which offers 2 or 3 small jobs from neighbors and friends she has met. Gigs are always available whenever she plays.
- **The Gig screen:** a card shows who asked, what they want in one line (for example "a reading corner that feels like fall" or "an outfit for a first date"), the space or person to design for, what they like (2 or 3 tags, like "plants" or "warm colors") and the pay range. It has Accept and Not now buttons.
- **Doing it:** she designs in the normal Decorate or Style screen, inside the gig's space or on the gig's person, with a small banner showing the ask, the tags and a **Hand in** button.
  - For room gigs, every piece is free to use and goes back when she hands it in, so she doesn't spend her own coins (*Claude default*).
- **Judging it:** the visitor reacts with 1 to 3 hearts, depending on how many of their tags the design matches. Pay follows the bible's table: 100 to 200 coins for an ordinary gig, more the happier they are, 250 for a neighbor's story gig and 600 for a whole home. There's no wrong answer: even 1 heart pays the lowest amount.
- **Friendship:** every gig and chat grows that visitor's friendship, which drives their story (spec 008).

**Coins** (bible, Coins and prices):

- She starts with 500 coins. The prices and pay follow the bible's tables.
- **The shop is the catalog.** In Life mode each card shows its price. Buying puts the piece in her tray, and Put away keeps it in storage, so she never has to buy it again.
- **Selling back** refunds every coin she paid. Before anything is sold, she gets a confirm with the cursor on Keep (`studio-bible/play.md`).
- Special sets (memory book rewards, visitor gifts, holiday pieces) show a little ribbon and how to earn them instead of a price. Holiday pieces go on sale during their holiday and stay hers after.
- There are no bills, rent or running costs (bible, Nothing is lost).

**Done when:**

- A gig can be accepted, designed, handed in, rated and paid.
- Coins buy pieces and selling back refunds every coin.
- A special set shows how to earn it.
- The coin count survives a reload and an export and import.

## Saves

- The Life save holds:
  - coins, the pieces she owns and where they are
  - Sarah's and Keegan's needs, and the cats' needs
  - the idle-life shown list, any queued actions
  - open gigs and friendships (shared with spec 008)
  - the pantry and crafts made
  - the timestamps the garden needs (spec 005)
- Each mode keeps its own home, so Sandbox changes never touch Life (*Claude default*. Slots per mode are an open To do item, "Saves").
- Everything is under the planned `ss.` prefix, with a save version and upgrade steps (`studio-bible/saves.md`).

## Build order

1. Parts A and B (the clock, the top bar and playing as Sarah). Keegan plays them on the phone (`studio-bible/studio.md`, Playtests).
2. Parts C and D (needs, Keegan, the cats and idle life). These are rules and content.
3. Draw and approve the **Cooking** mockup, then build part E.
4. Draw and approve the **Gig** mockup, then build part F. The visitor half of gigs comes with spec 008.

Part B needs the decorating spec's home and catalog built first.

## Claude defaults to confirm

- Up to 3 queued actions.
- The starter action list by piece.
- Needs take about 40 minutes of play to go from full to low.
- Craft pools: about 4 seasonal pieces per season, 6 paintings and 6 crochet pieces.
- After-moments show at most once in every eight openings.
- Keegan moves to a new activity every 5 to 15 minutes, and cooks near mealtimes.
- Room-gig pieces are lent for free.
- Store-bought ingredients are always stocked.
- Each mode keeps its own home.
