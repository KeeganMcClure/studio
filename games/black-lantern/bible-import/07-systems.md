## Systems

HP and SAN are two health bars: HP heals, SAN mostly doesn't. Combat is purely turn-based and menu-driven (abilities, weapons and more), in Super Mario RPG's head-on layout. Combat rules live in the Combat tab.

### **Gameplay loop** (set Nov 18)

- **Case length:** 1–2 hours over a few phone sittings.
- **Fights:** 2–3 placed story fights plus the boss per case. No random encounters. A case can break this on purpose.
- **Danger zones:** 0–2 per case, set by the story, day or night. Roamers walk them in plain sight.
- **Roamers:** each guards something (a clue, a victim, a shortcut, a stash). Fight it, sneak past with a roll, or take another route. Loot drops 20% of the time, always when the drop is story-related.
- **Fleeing:** roll to flee roamers. Story fights and bosses are committed.
- **Clues:** the story picks the style. Default is threshold plus bonus (need some to move on; extras weaken the boss, add intel or open debrief options) or clues as keys (specific clues open specific places or dialog), whichever fits the theme.
- **Deduction:** never a dead end. A wrong answer costs SAN, time or a better ending, never progress. Claude checks every deduction maps to clue IDs before building.
- **Time:** story beats turn day to night by default; some cases add a clock on purpose.
- **Choices:** how far they branch varies by case. Most branch and rejoin; a few go big on purpose. Choices are remembered for the boss and debrief.
- **Healing:** meds and First Aid (once per wound) in the field, plus a full rest at a few story safe spots.
- **Saving:** one save slot. Autosaves at checkpoints and on close, and you can save anytime. No going back; deaths stick.
- **Game over:** if the whole team falls, you build a new team, the case reopens and the agency arc keeps its progress.

### **Sanity**

- SAN loss is permanent-ish. Breaking Points give lasting disorders, unless the agent gives up a motivation or leans on a Bond instead (see Motivations and Leaning on a Bond).
- **SAN hits (set Nov 18):** a horror calls for a SAN roll against current SAN, tabletop style: pass loses a little, fail loses more. Loss sizes follow the SAN loss table below (tabletop levels, capped at 1d6/1d10); the defenses below do the softening. Only one halving applies per horror (bracing, Steadying or an Occult perk), so they never stack. Target: a typical agent loses about 6–10 SAN per case, so they last about 5–7 cases before needing a Sabbatical.
- **Who rolls:** on the map, only the lead agent (the one walking and looking). In cutscenes and battles, all 3 agents roll.
- **Bracing:** before a horror you know is coming, an agent can brace. It costs 1d4 Willpower Points and halves any SAN lost from that horror. In battle it also uses the agent's turn; on the map it costs no time.
- **Willpower Points (WP):** equal to POW. They refill at story rest spots along with HP, and fully between cases. Bracing is what gives WP its stake.
- **Steadying:** an agent with 40% or more in the people skill (Empathy) can roll against it to shrink a teammate's SAN loss. A critical success cancels that SAN loss entirely. Otherwise it halves the loss, once per horror (see Empathy under Skill unlocks).
- **Leaning on a Bond (set Nov 20):** only at a Breaking Point, as a third choice beside taking a disorder or giving up a motivation. The agent picks one Bond; it loses 1d6 and the disorder is skipped. They're still Shaken. Leaning can't take a Bond below 1, and a Bond at 1 is greyed out, so a Bond never breaks this way. There's no prompt on ordinary SAN losses. It plays one straight line naming the Bond ("Dale calls his brother at 3 a.m. and can't say why."), and the Bond's lower score sets the mood of its next home scene.
- **Adapted (set Nov 19):** each SAN loss from violence marks a violence box, and each loss from helplessness marks a helplessness box (a pass that loses 0 doesn't mark). At 3 marks the agent is Adapted to that kind: from then on their SAN rolls for it pass automatically, so they lose only the pass number (0 for the two lowest tiers). Getting Adapted costs every Bond 1 point and plays one straight line ("Marisol doesn't flinch anymore. Her sister notices."). A Breaking Point caused by a kind wipes that kind's marks. The unnatural never adapts. The party menu shows the marks as pips. (Cold-blooded is cut; Adapted to violence covers it.)
- **Recovery** has two routes, side by side: Bonds (home scenes heal through them; leaning on one at a Breaking Point wears it down) and Sabbatical. On Sabbatical you choose 1–3 cases for the agent to sit out in psych care while a recruit fills in; each case sat out restores +1d6 SAN and has a 40% chance to cure one disorder of your choice (set Nov 20).
- An agent at 0 SAN or dead is lost for good (see Losing an agent).

### **SAN loss table** (set Nov 19)

Every horror a case writes gets a tier and a kind. The agent rolls SAN: a pass loses the left number, a fail the right.

| Tier | Loss | Examples, by kind |
| --- | --- | --- |
| Unsettling | 0/1 | Violence: a corpse, a bloody crime scene. Helplessness: a victim's family grieving. |
| Disturbing | 0/1d4 | Violence: a mangled body, being badly wounded, killing in self-defense. Helplessness: being trapped or tied up, hearing someone die out of reach. Unnatural: a strange symbol, an animal acting wrong. |
| Severe | 1/1d6 | Violence: killing a fleeing or helpless person, seeing a teammate or innocent killed. Helplessness: failing to save someone you could have, a Bond breaking. Unnatural: a ritual site, an impossible object, a page of an unnatural text. |
| Shattering | 1d4/1d8 | Unnatural: seeing a monster clearly, learning what's really going on. Violence: a teammate torn apart in front of you. |
| Boss | 1d6/1d10 | Unnatural: the case's final reveal, face to face with the thing behind it. At most one per case. |

- **Order of softening:** roll the loss, apply one halving if any (bracing, Steadying or an Occult perk; round down), then Drunk takes 1 off. Never below 0.
- **Once per horror:** an agent rolls for a given horror once per case. Walking back past the same corpse costs nothing.
- **Case budget:** a typical case has about 3–5 Unsettling or Disturbing horrors, 1–2 Severe, 0–1 Shattering, and the Boss. Claude checks each case against the 6–10 net SAN target when writing it. The numbers get tuned in the Still Harvest playtest.
- **Breaking Point:** starts at SAN minus POW. When a loss takes SAN to it or below, the agent is Shaken and takes a disorder, gives up a motivation or leans on a Bond (see Motivations, Leaning on a Bond and Disorders). It then resets to current SAN minus POW. If that comes to 0 or less, the agent has no Breaking Points left and the next line is 0 SAN. One Breaking Point per loss, even if a big loss crosses two. SAN won back later doesn't move it up.

### **Disorders** (set Nov 19)

A disorder is the lasting scar of a Breaking Point. It stays quiet until its trigger shows up, then it can flare. There are six. An agent can carry more than one, never the same one twice.

| Disorder | Trigger (sets off a flare) | Flare (rest of the scene) |
| --- | --- | --- |
| PTSD | The first Loud attack in a fight, or a moment that echoes how they broke (cases flag these) | Freezes: loses their next turn in battle; on the map, −20% to all rolls |
| Paranoia | Talking to someone who is lying or hiding something (cases flag these) | −20% to Persuade and Empathy; won't take items from teammates or let anyone Steady them |
| Phobia (of a subject) | Its subject appears: the dark, blood, deep water, dogs, a kind of monster | On the map they won't lead: the lead passes to the next agent until the scene ends (if nobody else can, they go in Shaken). In battle, −20% to all rolls and they can't attack an enemy that is the subject |
| Depression | A death the party couldn't stop: a victim, a witness, a teammate | Can't brace, and motivation moments restore no SAN for them |
| Sleep disorder | A rest at a safe spot, or the first night scene of a case | Exhausted until the next rest, so that rest refills none of their WP (HP still heals) |
| Addiction | The start of every case, no roll | Withdrawal: −10% to all rolls until they dose (see Addiction under Items) |

- **Getting one:** at a Breaking Point (unless the agent gives up a motivation or leans on a Bond instead), the kind of horror that pushed them over sets the pool, and the game picks one of its two at 50/50. If the agent already has that one, they get the other; if they have both, any disorder they don't have. Every horror carries one of three kinds, listed in the SAN loss table above.
  - Violence (killing, being maimed, seeing someone killed): PTSD or Sleep disorder.
  - Helplessness (failing to save someone, being trapped, a Bond breaking): Depression or Sleep disorder.
  - The unnatural (seeing it, learning about it): Paranoia or Phobia. Phobia takes its subject from the horror that caused it.
  - Addiction never comes from a Breaking Point, only from drugs.
- **Flaring:** when a trigger hits, the agent rolls SAN. Pass: they hold it together. Fail: the disorder flares for the rest of the scene (in a fight, the rest of the fight). At most one flare per disorder per scene. Addiction skips the roll.
- **Who checks:** a trigger the agent has to see or hear checks only the lead on the map, and everyone in cutscenes and battles, the same as SAN rolls. A trigger that happens to the whole party (a rest, a death, a new case) checks every agent with that disorder.
- **Calming a flare:** the Therapist's sedatives or Medicine's Sedate end it for the scene.
- **Between flares:** nothing. A disorder only costs something when it flares.
- **On screen:** a flare plays one dialog-box line, written straight, never for laughs ("Dale's hands won't stop shaking."). The disorder's icon pulses beside HP and SAN until it ends. The party menu lists each agent's disorders; tapping one shows its trigger and flare.
- **Cases:** cases tag each horror with its kind (and a phobia subject for unnatural ones) and flag trigger moments like liars and echoes. The game checks the party's disorders against those tags, so no case is written around one agent.
- **Curing:** three Therapy home scenes on the same disorder, or Sabbatical's chance for each case sat out (40% per case sat out). A cured disorder can come back from a later Breaking Point. An arc's bad ending that gives a disorder picks the one from this list that fits its story.

### **Statuses** (set Nov 18)

Statuses are short-term conditions that end within a case. Map and combat rules are both set (combat notes filled Nov 20).

- **Who has them:** any agent. Damage ticks hit whoever has the status; roll penalties matter only for whoever rolls (on the map, usually the lead). Icons show in the party menu and beside HP and SAN.
- **Ticks on the map:** each area or room change.
- **Ending:** every status clears at the end-of-case heal-up. Disorders (from SAN) and lasting injuries carry between cases.
- **Lasting injuries:** separate from statuses and long-term, Delta Green style: a serious wound can leave a lasting injury, such as a lost stat point or a limp. The table, tiers and odds are under Lasting injuries in the Combat tab (set Nov 20).
- **Drunk and High:** mostly the player's choice, with trade-offs; sometimes forced by the story or an enemy.

| Status | Cause | On the map | Ends with | Combat note |
| --- | --- | --- | --- | --- |
| Bleeding | Wounds, traps, claws | −1 HP each area change | First Aid, Medicine's Treat, or a rest | −1 HP each turn |
| Poisoned | Bites, spores, bad food, spiked drinks | −20% to all rolls and −1 HP every 2 area changes; never wears off | Antitoxin item; or Treat, which takes a penalty until Science's Sample names the poison | Damage each turn; some enemies apply it |
| Sickened | Gore, rot, bad air | −20% to physical skills (Athletics, Stealth, Melee, Firearms, Dodge) | A rest; or Retch: a CON × 5 roll that clears it on success, once per scene on the map | Retch is a combat action, once per turn, and uses the agent's turn |
| Drunk | Booze item or a bar hotspot | Each SAN loss is 1 smaller; −20% to Search, Forensics, Firearms and Computers | Wears off after 4 area changes | Same as the map: −20% to Firearms (and Search), and every SAN loss is 1 smaller |
| High | Any drug item, or a hotspot | −20% to rolls the drug doesn't help, on top of the drug's own effect (see Item list) | Wears off after 4 area changes | Same as the map: the drug's effect and the −20% carry into the fight |
| Exhausted | Long nights, forced marches, story beats | Willpower doesn't refill and bracing costs double | A rest | Bracing costs double; no other effect |
| Shaken | Hitting a Breaking Point | −20% to all rolls for the rest of the scene | The scene ends, or Empathy's Calm | −20% to all rolls for the rest of the fight (a fight counts as one scene); Empathy's Calm clears it |
| Stunned | Heavy blows, blasts, shocks | Combat only | Ends after the lost turn | The agent loses their next turn |
| Exposed | Search's Spot weak point, Computers' Alarm | Combat only; enemies only | The enemy's next turn | Everyone gets +20% to hit it |

### **Losing an agent** (set Nov 19)

- **Lost for good:** an agent who bleeds out (see 0 HP in Combat) or hits 0 SAN. At 0 SAN they get one straight dialog line and leave the party. In a fight, they snap instead: you lose control of them, and on each of their turns the game picks one of four at equal odds (25% each): attack themselves (an automatic hit with their weapon), attack a random ally, attack a random enemy, or do nothing. The other agents can now target them like an enemy. When the fight ends, or they're Downed, they're out of the fight and leave the party. Whoever Downs them makes a Severe violence SAN roll (1/1d6).
- **Rest of the fight:** the other two finish it. Fleeing a roamer still works.
- **Next safe spot:** the recruit arrives at the next area change after the fight or scene, never mid-fight and never inside a boss area. A loss in the boss fight means the recruit joins at the debrief.
- **Pick 1 of 3:** Big Hat offers three ready-made recruits, or you can build your own in the creator instead (set Nov 20). One always shares the lost agent's profession; the other two have different professions. Each is built like a team-template agent: creation-level skills, full HP, SAN and WP, two motivations with one marked Main, and their own Bonds. Their personal arc starts at beat 1 and counts from this case.
- **Starting kit only:** the recruit brings their profession's starting kit. The lost agent's gear goes with them. Exception: case evidence and key items pass to the lead, so a case can never dead-end.
- **Arrival scene:** one short beat, Big Hat's message and the recruit's first line, written per profession so it fits any case.
- **More than one loss:** each lost agent is replaced the same way. Game over is unchanged: the whole team down in one fight.
- **Send-off:** at the debrief Big Hat says a line about the lost agent, and their field name, cases closed and how they were lost go on a memorial list on the case board screen. Then a funeral cutscene plays before home scenes; it doesn't use up anyone's home scene, and the recruit stands at the back. Claude writes these without review, in claude/home-scenes.md.
- **Grief:** seeing a teammate killed is already a Severe violence horror in the SAN loss table and a Depression trigger, so the funeral adds no SAN cost of its own.

### **Motivations** (set Nov 18)

- **Picking:** each agent has 2, chosen in the creator from a preset list: Protect the innocent, Find the truth, Family, Faith, Revenge, Duty, Curiosity, Money, Redemption. Team templates come with theirs set. A party of 3 covers about 6 types, so most cases hook someone.
- **Motivation moments:** each case plants 1–2 optional moments, aimed at different types. Acting on one costs something (time, risk, a clue or a better route) and the agent who holds that motivation regains 1d4 SAN. The prompt appears whenever any party member holds the motivation.
- **Breaking Point shield:** at a Breaking Point, the agent can give up one motivation for good instead of taking a disorder. They're still Shaken. An agent with no motivations left can still lean on a Bond (see Sanity); with no Bond above 1 either, they must take the disorder.
- **At home:** the Personal Motivation home scene restores a little SAN, or replaces a lost motivation or swaps one (see Home scenes).
- SAN restores from motivations count toward the 6–10 SAN per case target, so that target is net loss.

### **Personal arcs** (set Nov 19)

- **Built from the Main motivation:** in the creator, each agent marks one of their 2 motivations as Main. That motivation's arc is the agent's story for the season. Claude writes 9 arcs per season, one per motivation, and each new season brings a new set of 9. Arcs star the agent's own Bonds by name, so template agents, custom agents and recruits all get one; template agents get hand-made touches.
- **3 beats, automatic:** each beat is a short cutscene that plays on its own after the agent's 1st, 3rd and 5th case survived that season. It doesn't use up the agent's home scene. Cases sat out on Sabbatical don't count; a recruit's count starts at their first case.
- **Branching ending:** beats 1 and 2 each end with a choice, and together they decide the finale. Good ending: a signature perk for that agent, tied to the motivation. Bad ending: a disorder or a broken Bond (the Bond drops to 0), whichever the arc's story calls for.
- **Shield link:** giving up the Main motivation at a Breaking Point plays the bad ending right away.
- **Swapping at home:** replacing or swapping the Main motivation through the Personal Motivation home scene ends the old arc with no payoff and starts the new motivation's arc at beat 1.
- **Season change:** an arc still running when a season ends finishes first; the new season's arc starts after it.
- **Writing:** Claude writes every arc without review, kept in claude/arcs-season-N.md, which you don't open.

### **Home scenes** (between cases)

Picking a home scene plays a quick cutscene that changes with who the Bond is and the Bond score. For example, a spouse at a high score: a hug and a little heart; at a low score: your agent yelling at them. Bonds appear as NPCs in these scenes. The options come from Delta Green and get tweaked or trimmed by the no-mechanics-for-mechanics'-sake rule. Claude writes every home-scene cutscene without review (set Nov 19), kept in claude/home-scenes.md, which you don't open.

**Bond moods (set Nov 19).** A Bond's score sets the mood of its home scenes: **Close** (two-thirds of CHA or more), **Strained** (one-third up to two-thirds), **Fraying** (below one-third). At 0 the Bond is **Broken**: one last scene plays, then that person is gone and the slot stays empty until New Bond fills it.

**One choice per agent.** Between cases, each agent picks exactly one home scene option from the table below, never several. Within an option that offers an "or" (like Personal Motivation), the agent also does only one of them.

| Choice | Effect |
| --- | --- |
| Fulfill Responsibilities | SAN roll. Success: +1d6 to a Bond (up to CHA). Crit: also +1 SAN. Fumble: −1d4 Bond and −1 SAN. |
| Back to Nature | −1 Bond, then SAN roll. Success: +1d4 SAN. Crit: +4. Fumble: −1d4. |
| Personal Motivation | Pursue a motivation: SAN roll. Success: +1d2 SAN. Crit: +2. No Bond cost. Or instead: replace a lost motivation, or swap one, from the preset list. |
| Use (Addiction only) | Only offered to an agent with Addiction. They spend the break using, so they start the next case with no Withdrawal. Cost: one Bond loses 1d4, the agent loses 1 SAN, and it takes their one home scene, so nothing else heals this break. |
| New Bond | Only when the agent has an empty Bond slot (a Bond broke). Pick a type and name; the new Bond starts at half CHA, rounded up. No roll. Until it's done, that agent has one less person to heal through. |
| Therapy | Choose one. SAN: a SAN roll; success +1d4 SAN, crit +4, fumble means the therapist hears too much and the agency finds out, so Big Hat refuses this agent's requisition at the next briefing. Or Disorder: work on one disorder, no roll; the third Therapy home scene spent on the same disorder cures it. A Therapist in the party can run the session, rolling their Empathy instead of SAN. |
| Improve Skill | +1d6% to one chosen skill (set Nov 18). |
| Special Training | Raise one untrained skill (10%) to 30%. Improve Skill deepens a skill you have; this adds a new one, so a team can cover a gap. Costs 1 point from one Bond. |
| Sabbatical | Sit out 1–3 cases in psych care while a recruit fills in (see Sanity). |

### **Between cases**

- Carry-over: the whole party carries SAN, disorders, Bond damage, wounds, gear and skill gains between cases.
- End-of-case improvement: heal up, and each skill you tried and failed during the case gains +1d4%. The Improve Skill home scene adds +1d6% to one skill you choose (set Nov 18). No skill goes above 99% (Delta Green; set Nov 20).
- Party menu: open anytime on the map, not just between cases (see Map menu in the Skills and menus tab).
