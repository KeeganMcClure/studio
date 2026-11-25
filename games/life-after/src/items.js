// Life After items: every item in items.md (part of the bible) as data, with the numbers from spec 002 (8, 9).
// kind sets how it stacks (spec 002, 8): food, med, part and the small consumables up to 5 in a slot; ammo up to 30;
// weapons, tools, bags, keepsakes and finds don't stack. slots: bag squares it takes. food: hunger points (spec 002, 9).
// keeps: days before it spoils (0 = never in this slice). bag: extra slots when worn. Look-alike brands only. window.LAI.
(function () {
  var STACK = { food: 5, med: 5, part: 5, small: 5, ammo: 30, weapon: 1, tool: 1, bag: 1, keep: 1, find: 1, key: 1 };
  // [id, name, kind, slots, extra]
  var LIST = [
    // food and water
    ['beans', 'Farmstead canned beans', 'food', 1, { food: 40, can: 1 }],
    ['ravioli', "Chef Tony's ravioli", 'food', 1, { food: 40, can: 1 }],
    ['soda', 'Kola King soda', 'food', 1, { food: 8 }],
    ['water', 'Clear Springs water', 'food', 1, { food: 5 }],
    ['cereal', 'Crunch Bunch cereal', 'food', 1, { food: 20, keeps: 21 }],
    ['jerky', 'Beef jerky (Trail Boss)', 'food', 1, { food: 20 }],
    ['eggs', 'Fresh eggs', 'food', 1, { food: 30, keeps: 4 }],
    ['veg', 'Garden vegetables', 'food', 1, { food: 30, keeps: 4 }],
    ['rawmeat', 'Raw meat', 'food', 1, { food: 50, keeps: 1 }],
    ['berries', 'Wild berries', 'food', 1, { food: 20, keeps: 1 }],
    ['spoiled', 'Spoiled food', 'food', 1, { food: 15 }],
    // medicine and remedies
    ['bandage', 'Bandages', 'med', 1], ['alcohol', 'Rubbing alcohol', 'med', 1],
    ['painkillers', 'Painkillers (Relievo)', 'med', 1], ['antibiotics', 'Antibiotics', 'med', 1],
    ['splint', 'Splint kit', 'med', 1], ['firstaid', 'First aid kit', 'med', 2],
    ['cure', 'Unlabeled vials', 'med', 1], ['willowTea', 'Willow bark tea', 'med', 1], ['yarrow', 'Yarrow poultice', 'med', 1],
    // weapons (noise and wear from items.md; damage comes with part C)
    ['knife', 'Kitchen knife', 'weapon', 1, { noise: 'quiet', wears: 'fast' }],
    ['bat', 'Baseball bat (Slugger)', 'weapon', 1, { noise: 'low', wears: 'medium' }],
    ['nailbat', 'Nail bat', 'weapon', 1, { noise: 'low', wears: 'medium' }],
    ['pipe', 'Lead pipe', 'weapon', 1, { noise: 'low', wears: 'slow' }],
    ['fireaxe', 'Fire axe', 'weapon', 2, { noise: 'medium', wears: 'slow', force: 1 }],
    ['machete', 'Machete', 'weapon', 1, { noise: 'quiet', wears: 'medium' }],
    ['hatchet', 'Hatchet', 'weapon', 1, { noise: 'low', wears: 'medium' }],
    ['golfclub', 'Golf club', 'weapon', 1, { noise: 'low', wears: 'fast' }],
    ['shovel', 'Shovel', 'weapon', 2, { noise: 'low', wears: 'slow' }],
    ['hockey', 'Hockey stick', 'weapon', 1, { noise: 'low', wears: 'fast' }],
    ['pitchfork', 'Pitchfork', 'weapon', 2, { noise: 'low', wears: 'medium' }],
    ['cleaver', 'Meat cleaver', 'weapon', 1, { noise: 'quiet', wears: 'fast' }],
    ['rifle', 'Hunting rifle', 'weapon', 2, { noise: 'very loud', gun: 1, ammo: 'rifleAmmo' }],
    ['revolver', 'Revolver', 'weapon', 1, { noise: 'very loud', gun: 1, ammo: 'revolverAmmo' }],
    ['bow', 'Hunting bow', 'weapon', 2, { noise: 'quiet', gun: 1, ammo: 'arrows' }],
    ['shotgun', 'Pump shotgun', 'weapon', 2, { noise: 'very loud', gun: 1, ammo: 'shells' }],
    ['pistol', '9mm pistol', 'weapon', 1, { noise: 'very loud', gun: 1, ammo: 'pistolAmmo' }],
    // ammo: [fewest, most] in a box (items.md)
    ['rifleAmmo', 'Rifle rounds', 'ammo', 1, { box: [5, 10] }], ['revolverAmmo', 'Revolver rounds', 'ammo', 1, { box: [6, 12] }],
    ['arrows', 'Arrows', 'ammo', 1, { box: [4, 6] }], ['shells', 'Shotgun shells', 'ammo', 1, { box: [4, 8] }],
    ['pistolAmmo', '9mm rounds', 'ammo', 1, { box: [8, 15] }],
    // tools and light
    ['flashlight', 'Flashlight (Beamline)', 'tool', 1, { light: 1 }], ['batteriesD', 'D batteries', 'small', 1],
    ['crowbar', 'Crowbar', 'tool', 1, { force: 1 }], ['lockpicks', 'Lockpicks', 'tool', 1],
    ['hammer', 'Hammer and nails', 'tool', 1, { force: 1 }], ['canopener', 'Can opener', 'tool', 1],
    ['lighter', 'Lighter (Flint King)', 'tool', 1], ['radio', 'Battery radio', 'tool', 1], ['roadmap', 'Road map', 'tool', 1],
    ['fieldguide', 'Field guide', 'tool', 1, { teaches: ['willowTea', 'yarrow'] }], ['rod', 'Fishing rod', 'tool', 2],
    ['snare', 'Snare wire', 'tool', 1], ['seeds', 'Seed packets', 'small', 1], ['feed', 'Animal feed', 'small', 1],
    // bags
    ['fannypack', 'Fanny pack', 'bag', 1, { bag: 2 }], ['backpack', 'School backpack', 'bag', 1, { bag: 6 }],
    ['duffel', 'Duffel bag', 'bag', 1, { bag: 8, slow: 1 }], ['hikingpack', 'Hiking pack', 'bag', 1, { bag: 10 }],
    // vices and comforts
    ['cigarettes', 'Cigarettes (Marlo Reds)', 'small', 1], ['whiskey', 'Whiskey (Old Ridge)', 'small', 1],
    ['weed', 'Homegrown weed', 'small', 1], ['pills', 'Sleeping pills', 'med', 1],
    ['chocolate', 'Chocolate bar (Cocoa Joe)', 'food', 1, { food: 10 }],
    // crafting parts
    ['wood', 'Scrap wood', 'part', 1], ['ducttape', 'Duct tape', 'part', 1], ['rope', 'Rope', 'part', 1],
    ['rags', 'Rags', 'part', 1], ['bottle', 'Glass bottle', 'part', 1], ['gasoline', 'Gasoline', 'part', 1], ['cans', 'Tin cans', 'part', 1],
    // keepsakes and 1990s finds
    ['mixtape', 'Mixtape', 'keep', 1], ['photo', 'Family photo', 'keep', 1], ['drawing', "Kid's drawing", 'keep', 1],
    ['carkeys', 'Car keys', 'keep', 1], ['cassette', 'Cassette player (Soundwave)', 'find', 1], ['boombox', 'Boombox', 'find', 2],
    ['pocketpixel', 'Pocket Pixel', 'find', 1], ['cbradio', 'CB radio', 'find', 2], ['camera', 'Instant camera', 'find', 1],
    ['vhs', 'VHS tape', 'small', 1], ['cards', 'Sports cards', 'small', 1], ['batteriesAA', 'AA batteries', 'small', 1],
    ['quarters', 'Quarters', 'small', 1],
    // reading: a how-to magazine teaches one recipe (spec 002, 10)
    ['magFixer', 'Home Fixer magazine', 'find', 1, { teaches: ['nailBat'] }],
    ['magPrepper', 'Backyard Prepper magazine', 'find', 1, { teaches: ['canAlarm'] }],
    // a key to one lock (the name says which)
    ['key', 'Key', 'key', 1]
  ];
  var ITEMS = {};
  LIST.forEach(function (r) {
    var o = Object.assign({ id: r[0], name: r[1], kind: r[2], slots: r[3] }, r[4] || {});
    o.stack = STACK[o.kind];
    ITEMS[o.id] = o;
  });
  // how much hunger a meal's worth is (a can of beans), for the food budget (spec 002, 6)
  var MEAL = 40;
  window.LAI = { ITEMS: ITEMS, STACK: STACK, MEAL: MEAL };
})();
