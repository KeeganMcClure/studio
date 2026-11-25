# Spec 003: Creator

Status: draft, for Keegan's review · Written 2026-11-25 by the Game Designer · Game: Sarah's Sim · To do: Specs (Creator)

## In plain words

Sarah loves a character creator, so this one gives her lots of room to play. She makes new people to live in the homes she builds and to visit her. In the same mirror view as Style, she picks an age, a face, eyes, a nose, lips, hair, a body and a skin tone from lists, then fine-tunes them with sliders: eyes a little wider apart, a little taller, more freckles. A Random button rolls a whole new person when she wants a surprise, and Undo takes a step back.

Every extra is there: makeup, blush, freckles, beards, glasses, piercings, tattoos placed where she likes, and birthmarks. Hair can be any color, with highlights. A person can be a kid, a teen, an adult or an elder, and a woman, a man or nonbinary. That choice only sets a starting point. Nothing is locked, and she can set their pronouns.

When she taps Done, the new person goes to Style to get dressed, and then she picks a home for them.

## Bible sections this spec relies on

The bible wins over this spec (`studio-bible/studio.md`, Specs). Rules are linked here and not written out again.

| Source | Section | What it sets |
| --- | --- | --- |
| `games/sarahs-sim/bible.md` | Creator | The mirror view, tabs, parts plus tuning, Random and Undo, ages, gender and pronouns, every extra, any hair color |
| `games/sarahs-sim/bible.md` | Homes and people | Keegan's and Sarah's looks; Sarah's hair is always ginger; the creator is for extra people in other homes |
| `games/sarahs-sim/bible.md` | Outfits | Style is where people get dressed |
| `games/sarahs-sim/bible.md` | Play → Memory book | The Friends chapter's "first person made in the creator" moment |
| `games/sarahs-sim/bible.md` | Saves | One save per mode |
| `games/sarahs-sim/bible.md` | Controls and screen; Art | Touch first, no L or R, the palette |
| `specs/002-outfits.md` | Parts A and B | The mirror view, the hair slot, dressing a new person |
| `specs/008-visitors-and-neighborhood.md` | Part D | Made people live in built homes and visit with ordinary gigs |
| `studio-bible/art-style.md` | All | Art drawn in code, Craft, Quality bar |
| `studio-bible/ui.md` | All | Readable text, cards, color never the only label |
| `studio-bible/studio.md` | Screen list; Playtests | Screen rows, the playtest after part A |

## Screens this spec covers

| Screen | Mockup |
| --- | --- |
| Creator | `creator-v1` (approved; drawn with L and R, which the bible has since dropped) |

## Part A: The Creator screen

Follows the approved `creator-v1` mockup: the mirror view on top, the tab row and the tray below.

**Getting there:** the Start menu's People row has a **New person** button at the bottom (spec 001). A built home's Homes card also has **Add a person**. *Claude default.*

**The view:** the person stands in the mirror view, spinning with the arrows or a swipe, as in Style (spec 002, part A). While she works on the face, the view zooms in on the head. *Claude default.*

**Tabs** (bible, Creator): age, face, eyes, nose, lips, hair, body, skin and more. "More" holds the extras (part D).

**Buttons:** Random, Undo, and Done.

- **Random** rolls the whole person, or only the open tab when she holds it down. *Claude default.* Random always picks parts and colors that go together, from hand-made sets.
- **Undo** steps back through the last 20 changes. *Claude default.*
- **Done** asks for a name, then opens Style for the new person (bible, Creator).

**Done when:** she can open the Creator, move between all nine tabs, spin the person, and use Random, Undo and Done at 375 × 667 and 320 × 480 with nothing cut off.

## Part B: Parts and colors

Each tab has a row of shapes and a row of colors (bible, Creator). Starting lists (*Claude draft*, more can be added as rows):

| Tab | Shapes | Colors |
| --- | --- | --- |
| Face | 8 face shapes (round, oval, heart, square, long and more), with jaw and cheek sliders | none |
| Eyes | 10 eye shapes, plus 8 brow shapes | 12 eye colors, brow color follows the hair or picks its own |
| Nose | 8 noses | none |
| Lips | 8 lip shapes | 10 lip colors (also in makeup) |
| Hair | 24 styles to start, short to long, curly to straight, braids, buns, locs, buzz and bald, including Sarah's four | Any hair color: 16 natural shades plus the full palette, with a highlight color |
| Body | 4 builds, with height and build sliders | none |
| Skin | none | 16 skin tones from light to deep, each with a matched blush and shadow tone |

- Every part works on every age, gender and body (bible, Creator).
- Hairstyles made here are the same list Style uses (spec 002, part B).
- Each color swatch has its name under it on a long press, so color is never the only label (`studio-bible/ui.md`).

**Done when:** every shape and color on the lists can be picked on every age, and the person updates straight away in the mirror.

## Part C: Fine tuning

(bible, Creator, Parts from lists plus fine tuning; the `creator-v1` tune tray.)

- **Sliders:** eye spacing, eye size, eye height, brow height, nose size, lip fullness, jaw width, cheek fullness, height and build. Each has 7 steps, with the middle as the default. *Claude default.*
- **Switches:** freckles, dimples, smile lines and a gap in the teeth. *Claude default* for smile lines and the gap.
- Sliders are big enough for a thumb, and each shows its name and a small picture at both ends.

**Done when:** each slider and switch changes the face or body on all four sides of the person, and Undo steps back through them.

## Part D: Age, gender and extras

**Ages** (bible, Creator): kid, teen, adult and elder, each with its own body size.

- Kid is about two-thirds of adult height, teen about nine-tenths, and elder the same as adult with a softer posture. Elders can have grey or white hair and smile lines on by default. *Claude default.*
- People never age on their own (bible, Creator).

**Gender** (bible, Creator): woman, man or nonbinary.

- It sets a starting body and the pronouns she/her, he/him or they/them.
- **Edit** next to the pronouns lets her pick any of the three, or type her own (up to 3 short words, like "ze/zir"). *Claude default* for typed pronouns.
- Nothing is locked: every body, hairstyle and outfit works for anyone.

**Extras** (bible, Creator, Extras, all of them; the `creator-v1` extras tray with its seven sub-tabs):

| Sub-tab | What she can add |
| --- | --- |
| Makeup | eyeliner, eyeshadow, mascara, lipstick and blush, each in palette colors |
| Freckles and blush | freckles (light to lots), rosy cheeks |
| Facial hair | stubble, mustache, short beard, full beard, goatee, sideburns, in the hair color or its own |
| Glasses | 6 frames, any color, clear or tinted lenses (also in Style's extras) |
| Piercings | ear studs, hoops, nose stud, nose ring, eyebrow, lip, in gold or silver |
| Tattoos | 8 designs (a heart, a flower, a cat, a star, a moon, a swallow, a vine and a small word), on 6 spots (forearm, upper arm, wrist, ankle, neck, shoulder), in any ink color |
| Birthmarks | 4 shapes, on the face or body, moved with a drag |

- Tattoos and birthmarks show only where the outfit doesn't cover them. *Claude default.*

**Done when:** each age shows its own size, the pronouns can be changed or typed, and every extra can be put on, moved where it moves, colored and taken off.

## Part E: Where made people go

- After Style, a short card asks which home they live in: any built home in this mode (spec 004), or "No home yet" to keep them in her People list for later. *Claude default.*
- People she makes live in built homes and visit with ordinary gigs and chats, with no story (spec 008, part D).
- She can open any made person in the Creator again from the People list, and change anything.
- **Keegan and Sarah** are not opened in the Creator. Their faces are drawn to look like themselves (bible, Homes and people). They're restyled in Style only, where Sarah's hair stays ginger. *Claude default.*
- Each mode keeps its own people (bible, Saves).
- **Moment:** the first person made in the Creator adds the Friends chapter moment, with its date (bible, Memory book; spec 007).

**Done when:** a new person can be named, dressed, moved into a built home and edited again later, and the first one adds the memory book moment.

## Person data

One record per person, saved in that mode's save:

| Field | Example |
| --- | --- |
| Name | Robin |
| Age | adult |
| Pronouns | they/them |
| Parts | face, eyes, brows, nose, lips, hair, body shape ids |
| Colors | eye, brow, lip, hair, highlight, skin |
| Tuning | each slider's step, each switch |
| Extras | makeup, facial hair, glasses, piercings, tattoos with spot and ink, birthmarks with spot |
| Outfits | everyday and sleep (spec 002, part F) |
| Home | the home's id, or none |

## Art

- Every face part, hairstyle and extra is drawn for the big mirror figure in all four turns, and small for the map sprite (`creator-v1`, `people-v1`).
- Each age has its own body, drawn at the same quality, not just scaled.
- Hair follows the approved front and back look from `style-v1`, with real strands and a visible nape where the style shows it.
- Skin tones each have matched shading, so a deep skin tone gets warm shadows, not grey ones.

## Build order

1. Part A and part B, with half the shapes. Keegan plays it on the phone (`studio-bible/studio.md`, Playtests).
2. Parts C and D (tuning, ages and extras), then the rest of the shapes. These add rules and content.
3. Part E. It needs spec 004's built homes for moving in, and spec 002's Style for dressing.

## Claude defaults to confirm

These follow the bible but fill in details it doesn't set. Keegan can change any of them:

- New person from the Start menu's People row, and Add a person on a built home.
- The face view zooms in while she works on it.
- Holding Random rolls just the open tab. Undo covers 20 steps.
- The starting lists (8 faces, 10 eyes, 8 noses, 8 lips, 24 hairstyles, 4 builds, 16 skin tones and so on).
- Seven-step sliders, plus smile lines and a tooth gap as switches.
- Age sizes, and elders start with grey hair and smile lines.
- Typed pronouns of up to 3 words.
- Tattoos and birthmarks hide under clothes.
- Keegan and Sarah are restyled in Style only, never in the Creator.
- A made person can wait with no home.
