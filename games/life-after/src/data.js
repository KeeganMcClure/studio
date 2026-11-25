// Life After data: skills, abilities, jobs, traits, wants, looks parts, templates, names and the starting items.
// All of it from survivor.md (part of the bible) and items.md; starting recipes from spec 002 (Recipes).
// Plain data plus a few rule checks the builder uses. window.LAD.
(function () {
  var SKILLS = [
    ['melee', 'Melee'], ['guns', 'Guns'], ['sneak', 'Sneak'], ['medicine', 'Medicine'],
    ['fixing', 'Fixing'], ['outdoors', 'Outdoors'], ['cooking', 'Cooking'], ['talk', 'Talk']
  ].map(function (s) { return { id: s[0], name: s[1] }; });

  // survivor.md, Abilities: [at 3, at 5]
  var ABILITIES = {
    melee: ['Shove', 'Sweep'], guns: ['Steady shot', 'Headshot'], sneak: ['Soft steps', 'Vanish'],
    medicine: ['Field care', 'Clean the bite'], fixing: ['Hotwire', 'Jury-rig'], outdoors: ['Tracker', 'Read the sky'],
    cooking: ['Stretch it', 'Comfort food'], talk: ['Read people', 'Silver tongue']
  };

  // items.md: the full list is in items.js (window.LAI)
  var ITEMS = LAI.ITEMS;

  // survivor.md, The 12 jobs. skills: the 5 job points, main skill first. items: [id, count].
  // recipes: spec 002, Recipes, Starting recipes by job (everyone also knows the torch).
  // outfit: how the job dresses (look.js draws it), in 4 color sets.
  var JOBS = [
    { id: 'nurse', name: 'Nurse', skills: { medicine: 3, talk: 1, cooking: 1 }, items: [['bandage', 2], ['painkillers', 1]],
      itemText: '2 bandages, painkillers', extra: 'Knows the rag bandage recipe', recipes: ['torch', 'ragBandage'], outfit: 'scrubs' },
    { id: 'mechanic', name: 'Mechanic', skills: { fixing: 3, melee: 1, outdoors: 1 }, items: [['ducttape', 1], ['hammer', 1]],
      itemText: 'Duct tape, hammer and nails', extra: 'Starts dead cars faster; knows the weapon fix', recipes: ['torch', 'weaponFix'], outfit: 'coverall' },
    { id: 'farmer', name: 'Farmer', skills: { outdoors: 3, fixing: 1, cooking: 1 }, items: [['seeds', 1], ['hatchet', 1]],
      itemText: 'Seed packets, hatchet', extra: 'Knows the garden plot and both natural remedies', recipes: ['torch', 'gardenPlot', 'willowTea', 'yarrow'], outfit: 'overalls' },
    { id: 'cop', name: 'Cop', skills: { guns: 3, melee: 1, talk: 1 }, items: [['revolver', 1], ['revolverAmmo', 6], ['flashlight', 1]],
      itemText: 'Revolver with 6 rounds, flashlight', extra: 'People are more likely to surrender to you', recipes: ['torch', 'nailBat'], outfit: 'uniform' },
    { id: 'teacher', name: 'Teacher', skills: { talk: 3, medicine: 1, fixing: 1 }, items: [['backpack', 1], ['fieldguide', 1]],
      itemText: 'School backpack, field guide', extra: 'Learns recipes from books in half the time', recipes: ['torch'], outfit: 'cardigan' },
    { id: 'trucker', name: 'Trucker', skills: { fixing: 2, outdoors: 1, talk: 1, guns: 1 }, items: [['roadmap', 1], ['jerky', 1], ['lighter', 1]],
      itemText: 'Road map, beef jerky, lighter', extra: 'Knows the roads: all sections show on the road map from day 1', recipes: ['torch'], outfit: 'flannel' },
    { id: 'cook', name: 'Line cook', skills: { cooking: 3, melee: 1, fixing: 1 }, items: [['knife', 1], ['canopener', 1], ['beans', 2]],
      itemText: 'Kitchen knife, can opener, 2 cans', extra: 'Can cook on any fire, not only a stove', recipes: ['torch', 'canAlarm'], outfit: 'apron' },
    { id: 'athlete', name: 'High school athlete', skills: { melee: 3, sneak: 1, outdoors: 1 }, items: [['bat', 1], ['fannypack', 1]],
      itemText: 'Baseball bat, fanny pack', extra: 'Gets 1 extra step when fleeing', recipes: ['torch', 'nailBat'], outfit: 'jersey' },
    { id: 'homeless', name: 'Homeless', skills: { outdoors: 2, sneak: 2, talk: 1 }, items: [['duffel', 1], ['rags', 1], ['lighter', 1]],
      itemText: 'Duffel bag, rags, lighter', extra: 'Sleeping rough costs no SAN, and you find 1 extra item in alleys, bins and camps', recipes: ['torch', 'canAlarm'], outfit: 'layers' },
    { id: 'construction', name: 'Construction worker', skills: { fixing: 2, melee: 2, outdoors: 1 }, items: [['crowbar', 1], ['hammer', 1]],
      itemText: 'Crowbar, hammer and nails', extra: 'Board-ups and big builds take half the time', recipes: ['torch'], outfit: 'vest' },
    { id: 'veteran', name: 'Army veteran', skills: { guns: 2, melee: 1, sneak: 1, medicine: 1 }, items: [['rifle', 1], ['rifleAmmo', 3], ['bandage', 1]],
      itemText: 'Hunting rifle with 3 rounds, bandages', extra: 'Reloading never costs a turn', recipes: ['torch', 'firebomb'], outfit: 'fatigues' },
    { id: 'clerk', name: 'Store clerk', skills: { talk: 2, sneak: 1, fixing: 1, cooking: 1 }, items: [['fannypack', 1], ['soda', 2], ['chocolate', 1]],
      itemText: 'Fanny pack, 2 Kola King sodas, chocolate bar', extra: 'Searching stores (gas station, big-box store, pharmacy) takes half the time', recipes: ['torch'], outfit: 'polo' }
  ];
  JOBS.forEach(function (j) { j.main = Object.keys(j.skills)[0]; });

  // survivor.md, Traits. opp: the opposite trait you can't also take. later: stored and shown, does nothing yet (spec 001, 5).
  var GOOD = [
    ['lightSleeper', 'Light Sleeper', 2, 'You always wake before anything reaches you.', 'heavySleeper'],
    ['strongBack', 'Strong Back', 2, '2 extra pocket slots.', 'badBack'],
    ['steadyHands', 'Steady Hands', 3, 'Locks, searching and crafting take half the time.'],
    ['ironGut', 'Iron Gut', 1, 'Raw meat, wild berries and spoiled food never make you sick.'],
    ['brave', 'Brave', 3, 'Fear and gore cost half the SAN.'],
    ['calm', 'Calm', 2, 'At zero SAN you only freeze, never run, and SAN comes back faster at rest.'],
    ['kind', 'Kind', 1, 'People trust you faster, but killing people costs more SAN.'],
    ['quickLearner', 'Quick Learner', 3, 'Skills grow faster.'],
    ['nightOwl', 'Night Owl', 2, 'You see 2 tiles farther at night.'],
    ['greenThumb', 'Green Thumb', 1, 'Crops grow a day faster.']
  ];
  var BAD = [
    ['smoker', 'Smoker', 1, 'Starts hooked on cigarettes. Without one each day, SAN slips.'],
    ['greedy', 'Greedy', 1, 'You trade a little better, but companions bond with you slower.'],
    ['weakStomach', 'Weak Stomach', 1, 'Bad food makes you sick for longer.'],
    ['nearsighted', 'Nearsighted', 2, 'You see 2 tiles less, and guns are harder to aim.'],
    ['hothead', 'Hothead', 2, 'Talking a fight down and trading go worse, and an insult can start a fight.'],
    ['jumpy', 'Jumpy', 2, 'Surprises and dark nights cost extra SAN.'],
    ['stubborn', 'Stubborn', 2, "Skills grow slower, and companions' advice is easier to ignore by accident."],
    ['heavySleeper', 'Heavy Sleeper', 2, 'Noises rarely wake you.', 'lightSleeper'],
    ['badBack', 'Bad Back', 2, '2 fewer pocket slots.', 'strongBack'],
    ['badKnee', 'Bad Knee', 3, 'Fleeing gives you 1 fewer step, and stairs and fences take an extra turn.']
  ];
  var TRAITS = {};
  function tr(list, good) { return list.map(function (t) { var o = { id: t[0], name: t[1], cost: t[2], text: t[3], opp: t[4] || null, good: good }; TRAITS[o.id] = o; return o; }); }
  GOOD = tr(GOOD, true); BAD = tr(BAD, false);

  var WANTS = [
    ['family', 'Find family', 'Someone you lost is out there, and some rumors are about them.'],
    ['home', 'Get home', 'A far-off town the roads may lead to.'],
    ['cure', 'Find the cure', 'Chase rumors of a lab or depot.'],
    ['last', 'Make something last', 'A hideout that feeds other people.'],
    ['ocean', 'See the ocean', 'A long, quiet hope.'],
    ['score', 'Settle a score', 'Someone did something before the end, and they may still be alive.'],
    ['promise', 'Keep a promise', 'Carry something to someone.'],
    ['happened', 'Find out what happened', "The world's history, from notes and places."],
    ['clean', 'Get clean', 'Stay off a vice you used to lean on. Each clean week lifts SAN, and a slip costs it.'],
    ['dog', 'Find the dog', 'Your dog ran off when it started. A dog that finds you is a companion that never argues.'],
    ['safezone', 'Reach the safe zone', 'The radio keeps naming a place. It may be real.'],
    ['amends', 'Make amends', 'You did something before the end. Helping other survivors slowly settles it.']
  ].map(function (w) { return { id: w[0], name: w[1], text: w[2] }; });

  // survivor.md, Looks parts. Counts: body 3, skin 6, face 6, hair style 8 and color 6, outfit color set 4, age 3.
  var LOOKS = {
    body: ['Slim', 'Average', 'Heavy'],
    skin: ['Fair', 'Light', 'Tan', 'Olive', 'Brown', 'Dark'],
    face: ['Round', 'Long', 'Square', 'Soft', 'Sharp', 'Wide'],
    hairStyle: ['Short', 'Buzzed', 'Side part', 'Curly', 'Long', 'Ponytail', 'Mullet', 'Bald'],
    hairColor: ['Black', 'Dark brown', 'Brown', 'Red', 'Blond', 'Gray'],
    colors: ['Set 1', 'Set 2', 'Set 3', 'Set 4'],
    age: ['Young adult', 'Middle-aged', 'Older']
  };
  var LOOK_ROWS = [['body', 'Body'], ['skin', 'Skin'], ['face', 'Face'], ['hairStyle', 'Hair'], ['hairColor', 'Hair color'], ['colors', 'Clothes'], ['age', 'Age']];

  // survivor.md, Templates. looks are picked to fit each person.
  var TEMPLATES = [
    ['Rita', 'the night-shift nurse', 'nurse', ['lightSleeper', 'calm'], ['smoker', 'stubborn', 'weakStomach'], 'family', { body: 1, skin: 1, face: 3, hairStyle: 5, hairColor: 2, colors: 0, age: 1 }],
    ['Dale', 'the garage owner', 'mechanic', ['steadyHands'], ['badKnee'], 'last', { body: 2, skin: 0, face: 2, hairStyle: 2, hairColor: 5, colors: 0, age: 2 }],
    ['June', 'the third-generation farmer', 'farmer', ['ironGut', 'greenThumb', 'kind'], ['nearsighted', 'greedy'], 'last', { body: 1, skin: 2, face: 0, hairStyle: 5, hairColor: 3, colors: 1, age: 1 }],
    ['Ray', 'the small-town deputy', 'cop', ['brave'], ['hothead', 'smoker'], 'score', { body: 1, skin: 1, face: 4, hairStyle: 0, hairColor: 1, colors: 0, age: 0 }],
    ['Denise', 'the chemistry teacher', 'teacher', ['quickLearner'], ['nearsighted', 'weakStomach'], 'cure', { body: 0, skin: 4, face: 3, hairStyle: 3, hairColor: 0, colors: 2, age: 1 }],
    ['Hank', 'the long-haul trucker', 'trucker', ['strongBack', 'nightOwl'], ['smoker', 'greedy', 'stubborn'], 'home', { body: 2, skin: 1, face: 5, hairStyle: 6, hairColor: 2, colors: 0, age: 1 }],
    ['Tommy', 'the diner line cook', 'cook', ['ironGut', 'kind'], ['hothead'], 'promise', { body: 1, skin: 3, face: 0, hairStyle: 1, hairColor: 0, colors: 0, age: 0 }],
    ['Kayla', 'the track star', 'athlete', ['lightSleeper', 'brave'], ['badKnee', 'stubborn'], 'ocean', { body: 0, skin: 5, face: 1, hairStyle: 5, hairColor: 0, colors: 1, age: 0 }],
    ['Earl', 'who lived under the overpass', 'homeless', ['ironGut', 'nightOwl'], ['badBack', 'smoker'], 'happened', { body: 0, skin: 2, face: 1, hairStyle: 4, hairColor: 5, colors: 2, age: 2 }],
    ['Luis', 'the framing carpenter', 'construction', ['strongBack'], ['hothead'], 'family', { body: 2, skin: 3, face: 2, hairStyle: 0, hairColor: 0, colors: 0, age: 1 }],
    ['Marcy', 'the Gulf War medic', 'veteran', ['steadyHands', 'nightOwl'], ['heavySleeper', 'badKnee'], 'promise', { body: 1, skin: 0, face: 4, hairStyle: 1, hairColor: 4, colors: 0, age: 1 }],
    ['Kevin', 'the gas station night clerk', 'clerk', ['nightOwl', 'kind'], ['jumpy', 'weakStomach'], 'home', { body: 0, skin: 1, face: 5, hairStyle: 2, hairColor: 4, colors: 3, age: 0 }]
  ].map(function (t) { return { name: t[0], tag: t[1], job: t[2], good: t[3], bad: t[4], want: t[5], looks: t[6] }; });

  // About 60 1990s American first names, for the Random row (spec 001, 4).
  var NAMES = ('Jennifer Jessica Amanda Ashley Sarah Stephanie Melissa Nicole Heather Amy Michelle Angela Tiffany Kimberly ' +
    'Lisa Tammy Shannon Crystal Dawn Tonya Wendy Rhonda Brandy Misty Carla Debbie Tracy Kristen Erin Holly ' +
    'Michael Christopher Jason David James Matthew Joshua John Robert Daniel Brian Kevin Jeremy Travis Chad ' +
    'Shane Dustin Corey Derek Brandon Darnell Marcus Jamal Luis Carlos Jose Troy Wade Rusty Duane Curtis Lance').split(' ');

  var PRESETS = [
    { id: 'gentle', name: 'Gentle', note: 'More food, softer bites, fewer surprises.' },
    { id: 'standard', name: 'Standard', note: 'The world as it is.' },
    { id: 'harsh', name: 'Harsh', note: 'Less of everything, and the dead hit hard.' }
  ];
  var SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];

  var job = function (id) { for (var i = 0; i < JOBS.length; i++) if (JOBS[i].id === id) return JOBS[i]; return null; };
  var want = function (id) { for (var i = 0; i < WANTS.length; i++) if (WANTS[i].id === id) return WANTS[i]; return null; };
  var sum = function (ids) { return ids.reduce(function (n, id) { return n + (TRAITS[id] ? TRAITS[id].cost : 0); }, 0); };

  // The trait rules (survivor.md, Traits): '' when the picks are fine, otherwise the reason in plain words.
  function traitProblem(good, bad) {
    if (good.length > 3) return 'Up to 3 good traits.';
    var all = good.concat(bad);
    for (var i = 0; i < all.length; i++) { var o = TRAITS[all[i]].opp; if (o && all.indexOf(o) >= 0) return TRAITS[all[i]].name + ' and ' + TRAITS[o].name + " can't go together."; }
    if (sum(good) > sum(bad)) return 'Good points are more than bad points.';
    return '';
  }
  // Highest a skill can start (spec 001, 4): 3, or 4 for an older survivor's main job skill.
  function skillCap(jobId, age, skill) { var j = job(jobId); return (j && age === 2 && j.main === skill) ? 4 : 3; }
  // A survivor's skills from the job, the age and the free points.
  function skillsOf(jobId, age, free) {
    var j = job(jobId), s = {};
    SKILLS.forEach(function (k) { s[k.id] = (j && j.skills[k.id]) || 0; });
    if (j && age === 2) s[j.main]++;
    for (var k in free || {}) s[k] = Math.min(skillCap(jobId, age, k), s[k] + free[k]);
    return s;
  }

  window.LAD = { SKILLS: SKILLS, ABILITIES: ABILITIES, ITEMS: ITEMS, JOBS: JOBS, GOOD: GOOD, BAD: BAD, TRAITS: TRAITS, WANTS: WANTS,
    LOOKS: LOOKS, LOOK_ROWS: LOOK_ROWS, TEMPLATES: TEMPLATES, NAMES: NAMES, PRESETS: PRESETS, SEASONS: SEASONS,
    job: job, want: want, traitSum: sum, traitProblem: traitProblem, skillCap: skillCap, skillsOf: skillsOf, FREE: 3 };
})();
