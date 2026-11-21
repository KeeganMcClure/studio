## Combat

### Basics

- **Layout (decided Nov 15):** head-on, Super Mario RPG spirit. Enemies at the top of the screen facing you; all three agents in a row along the bottom with their backs to the camera. Big animated sprites. The battle plays inside the GBA shell (see Tech), with the agents seen from the waist up (mockup approved Nov 20). Reference: the [Combat mockup canvas](https://claude.ai/artifact/4hpNdAF9Z95xSGEeKuT7zt), "Battle in the GBA shell" artboard; its code is saved in project files as claude/combat-mockup-shell.html.
- **Party on the field:** all 3 agents fight at once. No reserve slot. Balance is tuned for 3.
- **Turn order (set Nov 18):** agents and enemies all act in DEX order, highest first; ties go to agents. A column of small faces down the left edge shows the next few turns, so it never covers the sprites (set Nov 20). Search's On guard means enemies never take the first turn.
- **Hit rolls:** each attack is a percentile roll against the agent's skill. No dice animation; a short result line pops up instead, e.g. FIREARMS 62% · rolled 41 · HIT.
- **Command menu (set Nov 18):** a one-row box along the bottom in the dialog-box style (navy, cream border) with Fight, Skills, Items and Guard. D-pad or tap. Fight: attack with the equipped weapon, free. Skills: battle unlocks, which cost WP. Items: meds, Antitoxin and the like. Guard: Defend (half damage until your next turn), Brace, Retch, or Flee (roamers only).
- **Move cost (set Nov 18):** special battle moves cost Willpower Points, the same pool used for bracing, so every big move risks the mind later. Plain Fight attacks are free. Costs follow the unlock tier: 40% moves 1 WP, 75% moves 2 WP, 90% moves 3 WP; free perks cost nothing. Healing skills cost WP like any special; items are free. At 0 WP an agent can't use specials or brace, but Fight, Items and Defend still work (set Nov 18).
- **0 HP (set Nov 18):** the agent is Downed and bleeds out after 3 of their own turns unless Medicine's Revive gets them up; bleeding out is death, for good. If the fight ends first, they survive at 1 HP. Anyone Downed during a fight, even if Revived, rolls for a lasting injury when it ends (see Lasting injuries below).
- Purely turn-based. No timed hits or real-time inputs.
- Classic JRPG difficulty: defend, heal and use abilities wisely. The Gleaner fight is the benchmark.
- **Must-haves for the redesign** (Nov 15 playtest), all met: the turn-order column, enemy health bars, status moves and the Fight floor for agents who can't shoot, WP-costed moves against Attack-spamming, and threat skulls as the risk read.
- **Statuses** (set Nov 18): the list, map rules and combat notes are under Statuses in the Systems tab; exact numbers are in Combat numbers below.
- **Backgrounds:** a static image drawn from the map spot where the fight started.

### Combat numbers (set Nov 19)

The dice and numbers the code uses. Every weapon rolls its own dice, at the same average as its Item list bonus.

- **Weapon damage:** handgun 1d8, and anything at handgun damage too. Weapon dice (set Nov 19) keep each weapon's average but change its feel; more dice are steadier, one big die is swingier: shotgun 2d6 · hunting rifle 1d12+2 · revolver 1d10 · assault rifle 2d4+1 · chainsaw 3d4+1 · fire axe 1d12+1 · bat, shovel, machete, golf club 1d10 · knife, broken bottle, frying pan, nail gun, flare gun 1d6. A hit's dice always give at least 1; armor and halving come after and can take it to 0. Halves (Burst, Shove, Defend) round down.
- **Fists:** 1d4−1, rolled with Melee.
- **STR bonus (Delta Green, set Nov 19):** melee, fists and thrown weapons add STR 1–4 −2 · 5–8 −1 · 9–12 +0 · 13–16 +1 · 17–18 +2. Guns don't.
- **Crits (Delta Green, set Nov 19):** a hit on 01 or doubles (11, 22 … 99) is a crit: double damage, and it triggers weapon extras (revolver Bleeding, hockey stick Stun). Automatic hits like Dead eye can't crit.
- **Fumbles (Delta Green, set Nov 20):** a roll of 100, or doubles that miss (11, 22 … 99), is a fumble. In a fight a fumble is just a miss with a bad-luck line (the gun jams, the swing goes wide); any WP is still spent, with no other penalty. Outside fights, each scene says what its fumble does. Enemies crit and fumble by the same rules, so an enemy crit does double damage.
- **Skill bases (Delta Green, set Nov 19):** Melee 30%, Dodge 30%, Athletics 30%, Firearms 20%, Search 20%, Persuade 20%, every other skill 10%. Professions and the 8 bonus picks build on these.
- **Fight floor (set Nov 19):** a plain Fight attack never rolls under 30%, so every agent can chip in. Special moves use the real skill.
- **Weakening choices:** each takes 10–15% off a boss's HP, at most 40% in all. The rebuilt Gleaner: 60 HP, −8 per rescued victim (36 with all three saved).
- **Fight totals:** roamer fights 10–18 enemy HP in all; story fights 20–35.
- **Damage over time:** Bleeding and Poisoned take 1 HP a turn from agents, 2 from enemies (bigger bodies, bigger HP).
- **Armor and Defend:** body armor takes 1 off each hit (a hit can drop to 0). Defend halves damage, rounded down.
- **Throwables:** thrown with Athletics (the Fight floor doesn't apply). Frag grenade 1d6 to every enemy; Molotov 1d8 to one enemy, doubled against things that burn.
- **Healing skills:** Patch up heals 1d4; Triage heals 1d2 to each agent; Revive stands a Downed agent at 1d4 HP.

| Enemy tier | HP | Attack % | Hit damage |
| --- | --- | --- | --- |
| Weak (swarm critter) | 4–8 | 35–45 | 1–3 (1d3) |
| Ordinary | 10–16 | 40–55 | 2–4 (1d3+1) |
| Tough | 18–25 | 50–60 | 2–5 (1d4+1) |
| Boss | 55–65 | 50–65 | 3–6 (1d4+2); area attacks 1–3 each |
| Season finale boss | 70–80 | 55–65 | 3–6 (1d4+2); area attacks 1–3 each |

Simulator check (plain attacks and meds only, no special moves, so real odds run higher): a Field Team beats the rebuilt Gleaner about 8 times in 10 with no victims saved (about 11 rounds, about one agent Downed) and almost always with all three saved. Paper Trail wins about 1 in 4 with none saved and 2 in 3 with all three. A finale at 75 HP is a coin flip for a Field Team.

### Battle moves (set Nov 18)

Each combat skill has a job: Firearms deals damage, Melee disrupts up close, Dodge protects the team. The 40% and 75% moves are weaker battle unlocks that sit beside each tier's map unlock; 90% is the full move. They live in the Skills menu, except Defend and Slip, which are under Guard.

| Skill | 40% | 75% | 90% |
| --- | --- | --- | --- |
| Firearms | Aimed shot (1 WP): −20% to hit, double damage on a hit | Burst (2 WP): one roll against every enemy, half damage on each hit | Dead eye (3 WP): an automatic hit that also causes Bleeding |
| Melee | Shove (1 WP): half damage; the enemy drops to last in the turn order | Haymaker (2 WP): −20% to hit; a hit does full damage and Stuns | Grapple (3 WP): pin one enemy. At the start of each of its turns it rolls its attack % against the grappler's Melee: if it succeeds and the grappler fails, or both succeed and it rolls higher, it breaks free and acts; otherwise it loses that turn. The grappler holds instead of acting, and teammates get +20% against it |
| Dodge | Slip (free): while Defending, roll Dodge against each attack; success takes no damage | Draw fire (2 WP): Defend, and every enemy targets this agent until their next turn | Riposte (free perk): each Dodge passed while Defending earns a free counterattack |

- **Defend** (Guard menu, free, anyone): take half damage until your next turn.
- **Other skills in battle:** Patch up 1 WP, Triage 2, Treat 1, Revive 2, Sedate 1, Identify 1 (−20% in battle; a success also reveals the weakness).
- **Free:** Fight, Items, Defend, Retch, Steadying (costs no turn), Flee. Brace keeps its own 1d4 WP cost.
- Status moves for most other skills are under Status moves below.

### Status moves (set Nov 18)

Thirteen non-combat skills each get one battle move that causes or clears a status. Each is narrower than a normal unlock, so it shares its tier with that tier's map unlock. Each is a roll against the skill and costs the tier's WP (40% = 1, 75% = 2). First Aid and Medicine already have battle moves, so they get none.

| Skill | Tier | Move | Effect |
| --- | --- | --- | --- |
| Search | 40% | Spot weak point (1 WP) | One enemy is Exposed |
| Computers | 40% | Alarm (1 WP) | Blare a phone or car alarm; one enemy is Exposed. Loud |
| Bureaucracy | 40% | Flash the badge (1 WP) | A human enemy is Stunned. Once per fight |
| Athletics | 40% | Tackle (1 WP) | The enemy is Stunned, but this agent loses their next turn too |
| Survival | 40% | Road flare (1 WP) | Beast-like enemies are Shaken |
| Forensics | 75% | Find the wound (2 WP) | An already-hurt enemy starts Bleeding |
| Stealth | 75% | Vanish (2 WP) | Enemies can't target this agent until they act; that next attack causes Bleeding |
| Science | 75% | Caustic mix (2 WP) | A living enemy is Poisoned |
| Occult | 75% | Bind (2 WP) | An unnatural enemy this agent has Identified is Stunned. |
| History | 75% | Speak its name (2 WP) | An enemy found in the case's records is Shaken |
| Persuade | 75% | Intimidate (2 WP) | A human enemy is Shaken; on a crit, it flees |
| Craft | 75% | Tripwire (2 WP) | The next enemy to attack this agent is Stunned |
| Empathy | 75% | Calm (2 WP) | Clears a teammate's Shaken mid-fight |

- **Exposed** (enemy status): until its next turn, everyone gets +20% to hit it. See Statuses.
- **Shaken on an enemy:** −20% to all its rolls for the rest of the fight.
- **Resisting statuses is a creature ability,** not a general rule. Each enemy's design says what it shrugs off, such as a boss that can't be Stunned two turns in a row, or a mindless thing that can't be Shaken.

### Enemies and difficulty (set Nov 18)

Fights are rare, so each one hits hard and lasts long enough to use statuses and WP.

- **Health bars:** every enemy shows an HP bar under its sprite, with no numbers. Exact HP (e.g. 18/30) appears once an agent Identifies that enemy with Occult (rest of the case) or uses Search's Spot weak point on it (rest of the fight).
- **Threat skulls:** roamers and story-fight enemies show 1–3 skulls over their map sprite. 1 = a fair fight; 2 = it will cost HP, WP or SAN; 3 = it can kill an agent. Set per enemy when the case is designed, not adjusted for your party's state. Bosses always show 3.
- **Fight length:** roamers 2–3 rounds, story fights 3–5, bosses 8–12. A round is everyone acting once.
- **Damage:** agents have about 10–12 HP. An ordinary enemy hit does 2–4, a boss hit 3–6, so three or four hits put an agent down and Defend, Draw fire and healing matter.
- **Horror on sight:** an unnatural enemy triggers a SAN roll for all 3 agents when it first appears. Bracing works as in Sanity.
- **Enemy card:** each enemy is designed with HP, DEX, attack % and damage, 1–2 special moves, what it resists, its weakness (shown by Identify), its threat skulls, and whether it causes a SAN roll.
- **Enemy targeting (set Nov 20):** when nothing forces a target (Draw fire, Vanish), an enemy picks an agent at random, but leans toward whoever hurt it last (about half its attacks go there). Downed agents aren't targeted.
- **Flee (set Nov 20):** roamer fights only. Any agent can pick it on their turn, but the party's lowest Athletics (Downed agents aside) is what gets rolled: the team is only as fast as its slowest. Success ends the fight with no rewards; failure uses up that turn.

### Bosses (set Nov 18)

- **Phases:** set per boss in its case pitch; there's no default.
- **Every boss needs:** at least one case choice that weakens it (the Gleaner loses strength for each rescued victim), a weakness Identify can find, and 8–12 rounds against a careful party.
- **Tuning check:** before a case ships, Claude runs the boss against a mid-level team template. Target: a careful party wins with at most one agent Downed; a party that skipped the case's choices can lose. The demo's Gleaner sets the bar.

### Lasting injuries (set Nov 20)

Any agent Downed during a fight who survives it, Revived or not, rolls CON × 5% when it ends (a quick Revive still helps: it stops the Downed 2+ turns modifier). A success means they walk it off. A failure rolls 1d12 plus any modifiers on the table below. Low rolls are Minor and fade after a case; middle rolls are Serious and need rehab; high rolls are Grave and permanent; only a bad fight can reach Career-ending.

| 1d12 + mods | Tier | Injury | Penalty |
| --- | --- | --- | --- |
| 1 | Minor | Black eye | −10% Search |
| 2 | Minor | Sprained wrist | −10% Firearms |
| 3 | Minor | Rolled ankle | −10% Athletics |
| 4 | Minor | Bruised ribs | −10% Dodge |
| 5 | Minor | Split knuckles | −10% Melee |
| 6 | Serious | Bad knee | −20% Athletics |
| 7 | Serious | Cracked ribs | −20% Dodge |
| 8 | Serious | Torn shoulder | −20% Melee |
| 9 | Serious | Nerve-damaged hand | −20% Firearms |
| 10 | Serious | Concussion | −20% Search |
| 11 | Grave | Lost eye | −20% Firearms, −10% Search |
| 12 | Grave | Facial scarring | −20% Persuade |
| 13 | Grave | Chronic pain | −2 max HP |
| 14 | Grave | Ruined leg | −20% Athletics, −10% Dodge |
| 15+ | Career-ending | Done with field work | Leaves the party (see below) |

- **Modifiers (they stack):** +2 in a boss or season finale fight · +2 if the agent was Downed for 2 or more of their own turns · +2 if the CON roll fumbled (100, or doubles that miss). So a quick Revive and a careful boss fight both keep injuries small.
- **How long they last:** Minor lasts through the next case and clears at that case's end-of-case heal-up. Serious is Rehab: a Sabbatical clears every one the agent has. Grave is Permanent and never clears.
- **Grave hurts the mind too:** a Grave injury counts as being badly wounded (Disturbing, violence) in the SAN loss table, so the injured agent makes that SAN roll.
- **Career-ending:** the agent lives but can't do field work. They leave the party and Big Hat offers recruits exactly as in Losing an agent (Systems tab). The send-off is a retirement, not a death: their name goes on the memorial list marked Retired, a short goodbye scene plays in place of the funeral, and teammates make no SAN roll. Claude writes the goodbye without review, in claude/home-scenes.md.
- **Same injury twice:** a repeat Minor restarts its clock. A repeat Serious turns Permanent (the knee never fully comes back). A repeat Grave rerolls.
- **Odds in practice (CON 10):** half of Downed agents walk it off. In an ordinary fight, about 1 Downed in 5 gets a Minor, 1 in 5 a Serious and 1 in 12 a Grave. In a boss fight (+2) Grave rises to 1 in 6. A boss fight where the agent also lay Downed for 2+ turns (+4): Grave 1 in 6, Career-ending 1 in 12.
- **Floors:** penalties can't push a skill below its base; the Fight floor (30%) still applies.
- **Display:** injuries show on the agent's page in the party menu, tagged Minor (with cases left), Rehab or Permanent, with the penalty in plain words. No sprite or portrait changes.
