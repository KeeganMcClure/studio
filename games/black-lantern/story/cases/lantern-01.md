# SECRET CASE FILE: Dead Letter (LANTERN 01)

**Spoilers. For the Developer only.** Written Nov 23, 2026 by the Developer from spec 014's frame, the bible and the arc file's Agency Case A section ("Dead Letter", rewritten Nov 23 by the Designer). Never quote or summarize this file in the bible, specs, changelog, To do, commits, PR text or chat. Keegan plays it blind; public text calls it `LANTERN 01` only.

Public frame it fills in: `games/black-lantern/specs/014-first-agency-case.md`. Where this file and the spec disagree, the spec wins on structure (counts, budgets, card style); this file wins on what things are. The arc file (`story/SPOILERS-agency-arc.md`) wins on arc secrets.

## The card (spec 014's right-hand cells)

| Field | Value |
| --- | --- |
| Number | `LANTERN 01` (black folder card, cream text, dark red pin, red wax seal; not the finale) |
| Title | `DEAD LETTER` |
| Town (on the card) | `ASTORIA` |
| Place line (after `AGENCY CASE · `) | `ASTORIA, OR` |
| Hook, line 1 | `One of ours stopped answering the call.` |
| Hook, line 2 | `His last letters never got logged.` |
| Unlock count | In `seasons/season-1.js` only (from the arc file). |
| Big Hat's unlock lines (part B; stand-ins in part A) | "Sit. Not a town this time." / "This one's ours." |
| Heaviest themes | An agent's body worn by something else; a man asking for help and nobody coming; drowning imagery. No gore on screen past a wound. |

## The truth (what is really going on)

- **Abel Teague, code name SEXTON.** Black Lantern field agent, 51, nineteen years in, the longest-lived agent anyone at the agency knows of (four years is the average). Divorced, no kids, a sister in Spokane he calls on her birthday. He was posted to Astoria eighteen months ago on a long watch: the Columbia's mouth has a history of things washing in.
- **What he found.** Reading old case evidence (his own, and what Records sent him to "re-file"), he noticed the evidence carried numbered paper fragments that didn't belong to the cases. He followed the numbers. They're pages of a ledger (the arc's Ledger; Teague never learned its keeper's name, only that "somebody is collecting signatures and the agency is the mailman").
- **Fire with fire.** He decided to fight it with an Outside Entity of his own: a lesser thing out of a binding book he bought from a dead fisherman's estate, *The Tidewater Psalter* (a hand-copied 1880s book of "net-blessings" that are nothing of the kind). The rite binds a thing that lives in the brackish line where river meets sea into a vessel, to be used as a hound.
- **It went wrong.** The vessel the rite asks for is a body that consents. Teague, alone, tired, half-drunk, read the consent line himself, meaning to use a gutted salmon on the cannery's slime table. The thing took the nearest body that had said yes out loud: his. It's been wearing him for three weeks. It calls itself **the Tenant**, and it treats him like a lease: it lives in him, it keeps him tidy, it speaks in his voice, and it is slowly moving the furniture.
- **The reports.** Teague's last six reports (before and during) went up through Records, asking for help in plainer and plainer words. Each came back stamped with a Records chain-of-custody stamp and nothing else. None was ever logged. The last one is in his own PO box, returned, opened and resealed. Dot Ferrell, a Records clerk who'd been his contact for years, slipped a note into the return of the fifth: "They read everything you send. Stop sending it."
- **Rules (the internal logic).**
  1. The Tenant can only keep a body that once said yes. It can't take an agent unless an agent consents (part B: a tempting line in the boss, refused automatically; no mechanic needed).
  2. It's brackish: river and sea. Fresh rain doesn't hurt it (it loves the rain). **Salt water burns it** (seawater, brine, the cannery's salt). Identify finds this. Still Harvest's lantern rules don't apply.
  3. A host's own true name, read aloud from a record that names him, reminds the host he's a person: the Tenant loses its grip for a moment (phase 2 skipped, Teague can speak).
  4. The binding holds while the Psalter's binding page exists. Burn the book and the Tenant can't re-anchor when it's hurt (no regeneration in phase 2).
  5. It is polite. It never raises Teague's voice. It apologizes for the smell.
- **Where he is.** By day, the Tenant keeps Teague's routine badly: he's seen at the post office at 9 sharp, he sits in his usual stool at the bar and orders nothing. At night it goes down into the shut cannery's retort room, where the binding was done, and sits in the water.

## The cast (public names; sprites and portraits in part A)

| Who | Map id / tab | Role in the story | Weird trait (1 in 3) |
| --- | --- | --- | --- |
| **Abel Teague (SEXTON)** | `teague` / `TEAGUE` | The missing agent, worn by the Tenant. By day: on the street in his long oilskin coat, polite, wrong. At night: in the cannery. The Tenant speaks with his portrait (part B can add a second portrait, `THE TENANT`, for the boss). | none (he's the case) |
| **Inga Halvorsen** | `inga` / `MRS. HALVORSEN` | His landlady. Seventies, owns the cannery building and rents the loft over it. Finnish-Norwegian Astoria stock. Kind, nosy, scared. Noticed he stopped eating and that his room smells like low tide. Liar tag: says he paid February's rent (he didn't; she's covering for him). | a cat named Pastor who rides on her shoulder |
| **Ray Pulkkinen** | `ray` / `RAY` | Postmaster, the branch on Commercial Street. Sixties, strict, a stamp collector. Knows box 418 is Teague's, knows the returned mail, won't open a box without paper (Bureaucracy). | none |
| **Mo Duarte** | `mo` / `MO` | Bartender at the Snag Tavern on Marine Drive. Forties, ex-Coast Guard, tattoos of knots. Saw Teague write on napkins every night, then stop. Keeps his last napkins in the register "in case he comes back for them". | none |
| **Hap Lindgren** | `hap` / `HAP` | A regular at the Snag, old gillnetter, eighties. Drank with Teague. Saw him walk into the river at low tide and come out "dry as a Bible". Knows the Psalter's old owner. | wears a sou'wester hat indoors and talks to the pickled egg jar like it's his wife |
| **Pastor** | (on Inga's shoulder) | The cat. Won't go near the stairs to the loft. | it's a cat on a shoulder |
| Street folk (no talk tab) | `walker` | A dog walker in a poncho by day; a fisherman on the pier smoking under the light at night. Narration only. | the walker's dog wears boots |

Dot Ferrell is not in Astoria (she's at Records). She appears only as her letter, and in the ending: gone, desk cleared.

## The maps (part A places them)

| Map id | Name on screen | When | What's there |
| --- | --- | --- | --- |
| `town` | MARINE DRIVE | day; night (danger zone at night, the pier end) | The waterfront street in February rain: the Snag Tavern, the post office branch, Halvorsen's house, the shut cannery (BUMBLE BAY PACKING, look-alike, faded) with the outside stairs up to the loft, a bus shelter, the rail line, the pier with pilings and the river beyond, the bridge's lights far off. The van. |
| `loft` | THE LOFT · TEAGUE | day; night | Teague's safehouse over the cannery: the study wall (string, pages, photos, numbers), his cot, a hot plate, a lockbox under the floorboard (the service record), the mirror (hidden hotspot), a window over the river. The day turns here (stand-in in part A). |
| `snag` | THE SNAG TAVERN | day; night | Bar, stools, the pickled egg jar, a jukebox, a pool table, the coat rack (the Mushrooms), the register (his napkins). Mo and Hap. |
| `post` | POST OFFICE | day only (closes at night) | Counter, PO box wall (box 418), the sorting room door, the flag outside. Ray. |
| `halvorsen` | HALVORSEN HOUSE | day; night | A front room: doilies, a TV with the news on mute, the rent ledger on the side table, Pastor's basket, a stove. Inga. |
| `cannery` | THE CANNERY FLOOR | night only | **The finale area.** The shut packing floor: the slime tables, the conveyor, the can line, the retort room's doors (the boss), the brine tanks (salt water: the weakness), the office (the Psalter at night). Go in / Not yet at the side door. |

## Turning the day (points of no return)

- **Day to night** (the only turn): in the loft, "wait for dark" (part A stand-in: the window). Go on / Not yet, cursor on Not yet. Closes: **"The post office closes for the night."** (Ray and box 418 are out of reach for good.)
- **The cannery** opens only at night; its side door asks Go in / Not yet. The boss waits in the retort room; everything else on the floor (the brine tanks, the office) is reachable without crossing the retort room's doors.

## The hidden hotspot (Mushrooms)

- **Where:** the loft, Teague's shaving mirror on the wall over the basin.
- **Shows only** while the lead is High on Mushrooms. Sober, it's a mirror, a little fogged.
- **What it is:** High, the mirror shows the loft a few seconds behind, and Teague in his chair, and something sitting *in* him like a man in a coat too big for him, its hands an inch inside his hands. On the fog, written from the other side of the glass in his block capitals: *"NOT ME. STILL HERE. —A.T."*
- **What it gives (part B):** clue `mirror`: proves rule 1 (he's still in there) and that the clean ending is possible; unlocks a line at the boss where the party can talk to Teague directly. Unsettling horror (unnatural). Part A stand-in: a placeholder narration.
- **Where the Mushrooms are:** Hap's coat on the Snag's coat rack: a paper bag of dried liberty caps, pencilled FOR MY KNEES. Part A stand-in: Search the coat rack (once), open by day and night.

## Clues (threshold plus bonus: 3 open the night's last door; extras weaken the boss or open lines)

| ID | Where | Skills | What it proves | Second way in |
| --- | --- | --- | --- | --- |
| `wall` | Loft: the study wall | Occult, History | He was following numbered pages through filed evidence and meant to bind something to fight back | Hap: "He asked me what a net-blessing was." (Persuade) |
| `box` | Post office: box 418 | Bureaucracy (the paper), Persuade (Ray), Stealth (night is closed: day only) | His last report came back unlogged, with a Records chain-of-custody stamp | Mo has a copy he mailed from the bar's fax (Persuade) |
| `dot` | Inside box 418, or the loft's trash | Search | Dot's letter: "They read everything you send. Stop sending it." (arc touch; no mechanical effect but the ending's line) | — |
| `rent` | Halvorsen house | Empathy, Persuade | He hasn't eaten in three weeks; two voices at night; she's covering his rent | Pastor won't go upstairs (Search, the cat's basket by the door) |
| `napkins` | The Snag's register | Persuade (Mo), Search | His napkin notes: the rite, "consent line", "WHAT HAVE I DONE", and "salt?" | — |
| `tide` | The Snag, Hap | Persuade, Empathy | He walked into the river and came out dry; he flinched from the brine barrel at the dock | Survival on the pier at night (the marks stop at the waterline) |
| `record` | Loft lockbox under the floorboard | Search, Craft (the lock), Bureaucracy (the code is his badge number on a Records form in the wall) | **Weakening 1:** his service record, with his name and oath | — |
| `psalter` | The cannery office, night | Occult (find the binding page), Science (burn it safely, or the floor goes up) | **Weakening 2:** the binding book | — |
| `mirror` | Hidden hotspot (Mushrooms) | none (High) | He's still in there: the clean ending's talk line | Empathy with the Tenant in phase 1 (hard, −20) |

Threshold: 3 of `wall`, `box`, `rent`, `napkins`, `tide` open the deduction. Nine clues; nothing the story needs sits behind one alone.

## The deduction (in the loft, before dark; never a dead end)

Big Hat calls on the loft's landline (Teague's): **"Where's my agent?"**
1. "He ran. He's drunk somewhere up the coast." (wrong: costs 1 SAN each at the first night horror; the night still turns)
2. "Something's living in him. It came in through his own work." (right: needs `wall` plus `napkins` or `rent`; Big Hat: "Then you get it out of him." The van carries a jug of seawater, the salt: battle item for the boss)
3. "Records got to him." (half: needs `box`; Big Hat goes quiet: "Not on this line." No salt from the van; it's still in the cannery's brine tanks)
Night turns either way with Go on.

## Choices that matter

- **`record` Read his name aloud** (History or Bureaucracy, in the boss with the record in hand): skips phase 2's shield, Teague speaks.
- **`burn` Burn the Psalter** (Science or Occult, in the cannery office): no regeneration in phase 2.
- **`salt` Bring salt water** (the van's jug from the right deduction, or fill a can at the brine tanks: Craft): the weakness as a battle item (3 uses).
- **`talk` Talk to Teague, not the Tenant** (the **Redemption** motivation moment; needs `mirror` or Empathy −20): in phase 2, one round where the party speaks to him; the clean ending's gate along with `record`.
- **`letters` Read all six reports** (the **Duty** motivation moment): Bureaucracy in the loft or post office: the agent with Duty takes it hard (SAN 0/1) but gains +1 to the ending's Big Hat line.

## Overstepping (quiet case: Noticed first; extreme flag off)

| Act | Public? | Mark |
| --- | --- | --- |
| Force box 418 without paper | Seen (Ray) | 1 step |
| Break the loft's door with Inga downstairs | Seen | 1 step |
| A fight on Marine Drive by day | Public | 1 step |
| Anything in the cannery at night | Unseen | Luck, no penalty |
| Burn the Psalter carelessly (a fire on the floor) | Seen from the street | 1 step |

Noticed: Ray and Inga clam up. Local chief: an Astoria PD sergeant walks Marine Drive at dusk; the post office locks early.

## Fights

| Fight | Kind | Skulls | Where / when | Enemy card |
| --- | --- | --- | --- | --- |
| **The bull on the dock** | A sea lion bull hauled out on the pier, something sublet in it: it doesn't blink, it hums Teague's whistle | 2 | Town, the pier, day (when you go out to the rail for `tide`) | `bull`: HP 22, DEX 9, 50%, 1d6 bite, "it whistles" 0/1 SAN; tags unnatural; weak: salt |
| **The empty coat** | Teague's spare oilskin and boots on the loft's hook, worn by nothing, at night | 2 | Loft, night (on the stand-in's turn) | `coat`: HP 18, DEX 12, 55%, 1d4+1 strangle, grapples; tags unnatural, burns; weak: salt, fire |
| **Roamers** (danger zone: the pier and the cannery's back lot, night) | `gull` flocks with Teague's eyes, and one `piling` (a drowned thing tangled in old net that walks the pier). Guard: the brine barrel (salt), the Lantern Box under the pier steps, the cannery's back door (shortcut to the office), the fisherman under the light | 1–2 | Town, night | HP 6–14, unnatural; drop 20% |
| **Boss: The Tenant** | Teague, upright in the retort room's flooded floor, the water around his shins not quite water | 3 | The cannery's retort room, night (Go in / Not yet at the doors) | below |

### The boss: The Tenant

- **Base:** 60 HP, DEX 11, 55%, 1d6 (his own hands), all-target "the tide comes in" 1d3 + 0/1d3 SAN, regenerates 4 per round in phase 2. Tags unnatural, wears-a-host. **Weakness (Identify): salt water** (double damage, stuns one round).
- **Phase 1 (polite):** it talks in Teague's voice, offers to "let him go" if an agent says yes (refused automatically; the line is a horror, 0/1).
- **Phase 2 (at half): the lease breaks:** Teague's body moves wrong, shield (half damage) unless his name is read (`record`); regeneration unless `burn`.
- **Tuning:** all choices taken: about 5–8 rounds. None: 8–12 (tools/boss-sim.js against the Gleaner's numbers).

## Horrors (inside 6–10 net SAN)

| Horror | Tier | Kind | Tags |
| --- | --- | --- | --- |
| The study wall, read whole: numbers going back years | Unsettling | unnatural | |
| Teague on the street by day, polite, standing in the rain with his eyes open while it runs into them | Disturbing | unnatural | subj: people wearing people |
| The bull on the dock, humming his whistle | Disturbing | unnatural | |
| The mirror (Mushrooms) | Unsettling | unnatural | |
| The empty coat | Disturbing | unnatural, violence | |
| The six reports, read in order | Unsettling | ordinary (grief) | Duty |
| The retort room: Teague in the water, the water moving like it's breathing | Shattering | unnatural | all |
| The Tenant | Boss | unnatural | known after Identify |

Phobia subject: **deep water**. Trigger tags: Teague is a liar (Paranoia); the cannery is dark (Nyctophobia).

## Motivation moments

1. **Duty:** the reports (`letters`), at a SAN price.
2. **Redemption:** talking to Teague himself (`talk`). (Family and Redemption agents get extra lines with Records people in the arc; here Redemption gets the moment.)

## Items

- **Lantern Box** (1): under the pier steps at night, guarded by a gull flock: Road flare, First-aid kit, Flashlight.
- **Loot table** (5): Energy drink, Painkillers, Road flare, Cigarettes, Coffee.
- **Case-only items:**
  - **Teague's badge** (ordinary, Keepsake): from the loft; given to Big Hat at the debrief, +1 to the Duty agent's next roll.
  - **The Tidewater Psalter** (unnatural, Evidence): if not burned. Bag or hide. **The key evidence item; its flyleaf carries the page fragment (arc hook: the page), numbered 4.**
  - **A can of brine** (unnatural-touched, Tool): the salt water, 3 uses in battle.
  - **Hap's mushrooms** (Mushrooms, Drug).

## Arc touches (quiet; never in public text)

- **The page:** the Psalter's flyleaf, page 4 of the Ledger, bound in by someone after the fisherman died (Records "returned" the book to Teague as re-filed evidence; he bought the rest of the estate later). Bagged → Records.
- **The stamps:** every report carries a Records chain-of-custody stamp; none logged.
- **Dot Ferrell:** her letter in box 418.
- **The ending (every label):** a short scene at the debrief: Big Hat reads a Records memo: Dot Ferrell's desk is cleared, no forwarding. A Records requisition for Teague's file, signed only "W." Big Hat, after a beat: "Not in my jurisdiction." This unlocks Off the books (part B adds the flag to the season save as an upgrade step if it needs one; check spec 015 first).
- **The cameo:** none (the arc gives this case its own beats).

## Endings

| Label | What it means |
| --- | --- |
| `clean` | Name read and Teague spoken to: the Tenant is driven out and Teague dies as himself, after a few words for Big Hat ("Tell Hat I wrote."). |
| `costly` | The Tenant is driven out and Teague with it: he dies without waking. |
| `worst` | The Tenant walks out into the rain wearing him (a party wipe at the boss that the case still closes as, a Federal agents' shutdown, or the boss fled). Season 2 seed. |

## Big Hat's briefing (and the debrief, same place)

- **Place:** the wheelhouse of a decommissioned lightship moored as a museum on the Astoria waterfront, after hours, in the rain: the ship's wheel and chart table in front of him where the desk would be, rain on the wheelhouse windows, the harbor lights beyond, a brass lamp right over him so his face reads, the great lens lamp behind his shoulder (switched off), a ship's clock. No donut shop: he came out here himself. Part A draws it (`L01A.wheelhouse`).
- **The four topics** (two get asked; each an INTEL note and a small edge, spoiler-free):
  - **Sexton** — "Abel Teague. Nineteen years. Longest I ever had." Edge: +10% Empathy with Inga.
  - **His mail** — "His reports went up. Nothin' came back down." Edge: Ray opens the box at Bureaucracy +10.
  - **The town** — "Cannery town. Every bar on Marine Drive knows his stool." Edge: Mo's first line opens without a roll.
  - **The rain** — "February. It don't stop. Keep your powder dry." Edge: the lantern's light reaches a little farther on the first night.
- **Unlock scene (spec 009, step 3):** "Sit." / "Not a town this time. This one's ours."

## Part A build notes (Developer, Nov 23, 2026)

- Maps, art, folk and portraits as above; the cannery floor is night-only and reached by its side door with Go in / Not yet; the retort room's doors stand-in asks Go in / Not yet too (no fight yet).
- The day turn is the loft's window (Go on / Not yet, naming the post office).
- Mushrooms: the Snag's coat rack, once. The mirror is the hidden hotspot.
- The van drives nowhere new (everything is on Marine Drive); it's a look only, plus the debrief stand-in through Dev: finish case.
