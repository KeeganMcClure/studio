// Sarah's Sim: their future Philly home (spec 001, part F), as prebuilt home data. The Build screen (spec 004) isn't built
// yet, so this file says where the rooms, doors, windows and stairs are; walls come from the rooms' edges, and the drawing
// matches mockups/build-v1 so the Build tools can reuse it.
// A red-brick rowhouse, 8 tiles wide and 12 deep with the stairs along the left party wall, on a small 16 x 16 lot with the
// yard behind it. The spec says "about 8 wide and 14 deep"; 12 deep leaves a yard of 4 rows behind it on the 16-tile lot.
// No street address anywhere (bible, Homes and people).
//
// House tiles: x 0-7 left to right, y 0-11 back to front (y = 12 is the street side). Rooms are [x0, y0, x1, y1), end
// excluded. Rooms in the same group are open to each other (no wall). Openings: [x, y, axis, kind] on a tile edge, where
// axis 'x' runs from (x, y) to (x + 1, y) and axis 'y' from (x, y) to (x, y + 1); kind 'door' (a door leaf), 'arch' (an
// open doorway) or 'open' (no wall). Windows: [x, y, axis, length].
(function () {
  SS.HOMES = {
    philly: {
      id: 'philly', name: 'OUR PLACE', lot: 16, lotName: 'SMALL LOT', at: [4, 4], w: 8, d: 12,
      floors: [
        { // floor 1: living room at the front (the big window with the tree), dining nook, kitchen at the back with the back door
          rooms: [
            { id: 'kitchen', name: 'Kitchen', r: [0, 0, 8, 4], group: 'k', floor: 'check', paper: 'sage' },
            { id: 'dining', name: 'Dining nook', r: [0, 4, 8, 7], group: 'k', floor: 'planks', paper: 'honey' },
            { id: 'living', name: 'Living room', r: [0, 7, 8, 12], floor: 'planks', paper: 'rose' }
          ],
          openings: [[0, 7, 'x', 'open'], [3, 7, 'x', 'arch'], [4, 7, 'x', 'arch'], [1, 12, 'x', 'door'], [6, 0, 'x', 'door']],
          windows: [[4, 12, 'x', 3], [2, 0, 'x', 2]]
        },
        { // floor 2: a study for Keegan, a bathroom with a tub, and Sarah's craft corner
          rooms: [
            { id: 'hall2', name: 'Landing', r: [0, 0, 2, 12], floor: 'planks', paper: 'cream' },
            { id: 'bath', name: 'Bathroom', r: [2, 0, 8, 4], floor: 'tile', paper: 'blue' },
            { id: 'study', name: 'Study', r: [2, 4, 8, 8], floor: 'planks', paper: 'sage' },
            { id: 'craft', name: 'Craft corner', r: [2, 8, 8, 12], floor: 'planks', paper: 'lilac' }
          ],
          openings: [[2, 1, 'y', 'door'], [2, 5, 'y', 'door'], [2, 9, 'y', 'arch'], [2, 10, 'y', 'arch']],
          windows: [[4, 0, 'x', 2], [4, 12, 'x', 3]]
        },
        { // floor 3: their bedroom under the roof, with the window seat at the front where the cats sit
          rooms: [
            { id: 'bedroom', name: 'Bedroom', r: [0, 0, 8, 12], floor: 'planks', paper: 'rose' }
          ],
          openings: [],
          windows: [[3, 0, 'x', 2], [3, 12, 'x', 3]]
        }
      ],
      // straight flights: tiles from the bottom step to the top step on the lower floor; you step on from `from` and off at
      // `to` on the floor above. The flight leaves an open stairwell over its tiles with a banister (bible, Building, Stairs).
      stairs: [
        { floor: 0, tiles: [[0, 6], [0, 5], [0, 4], [0, 3]], from: [0, 7], to: [0, 2] },
        { floor: 1, tiles: [[0, 10], [0, 9], [0, 8], [0, 7]], from: [0, 11], to: [0, 6] }
      ],
      // the starting furniture, from the first batch of the catalog (house tiles; r is the turn, 0 to 3)
      pieces: [
        // living room
        { id: 'wool-rug', f: 0, x: 3, y: 8, r: 1 },
        { id: 'three-seat-sofa', f: 0, x: 2, y: 8, r: 3, sw: 0 },
        { id: 'coffee-table', f: 0, x: 3, y: 9, r: 1 },
        { id: 'tv-stand', f: 0, x: 5, y: 9, r: 1 },
        { id: 'club-armchair', f: 0, x: 7, y: 8, r: 1, sw: 1 },
        { id: 'floor-lamp', f: 0, x: 7, y: 7, r: 0 },
        { id: 'side-table', f: 0, x: 2, y: 7, r: 0 },
        { id: 'table-lamp', f: 0, on: 'side-table@0' },
        { id: 'monstera', f: 0, x: 1, y: 7, r: 0 },
        { id: 'bookshelf', f: 0, x: 0, y: 9, r: 3 },
        { id: 'christmas-tree', f: 0, x: 7, y: 11, r: 0 },
        { id: 'record-player', f: 0, x: 6, y: 11, r: 0 },
        { id: 'framed-print', f: 0, wall: [6, 7, 'x'] },
        // dining nook
        { id: 'round-dining-table', f: 0, x: 4, y: 4, r: 0 },
        { id: 'dining-chair', f: 0, x: 3, y: 5, r: 3 },
        { id: 'dining-chair', f: 0, x: 6, y: 4, r: 1 },
        { id: 'dining-chair', f: 0, x: 5, y: 6, r: 2 },
        { id: 'snake-plant', f: 0, x: 7, y: 6, r: 0 },
        // kitchen
        { id: 'kitchen-counter', f: 0, x: 0, y: 0, r: 0 },
        { id: 'fridge', f: 0, x: 1, y: 0, r: 0 },
        { id: 'sink-cabinet', f: 0, x: 2, y: 0, r: 0 },
        { id: 'kitchen-counter', f: 0, x: 3, y: 0, r: 0 },
        { id: 'stove', f: 0, x: 4, y: 0, r: 0 },
        { id: 'kitchen-counter', f: 0, x: 5, y: 0, r: 0 },
        { id: 'mugs', f: 0, on: 'kitchen-counter#2@0' },
        { id: 'kitchen-counter', f: 0, x: 7, y: 0, r: 0 },
        { id: 'vase-of-flowers', f: 0, on: 'kitchen-counter#3@0' },
        { id: 'curtains', f: 0, wall: [2, 0, 'x'] },
        { id: 'curtains', f: 0, wall: [3, 0, 'x'] },
        { id: 'wall-clock', f: 0, wall: [0, 2, 'y'] },
        // bathroom
        { id: 'bath-tub', f: 1, x: 6, y: 0, r: 0 },
        { id: 'bathroom-sink', f: 1, x: 3, y: 0, r: 0 },
        { id: 'toilet', f: 1, x: 2, y: 0, r: 3 },
        { id: 'bath-mat', f: 1, x: 6, y: 1, r: 0 },
        { id: 'mirror', f: 1, wall: [3, 0, 'x'] },
        { id: 'small-succulent', f: 1, x: 7, y: 3, r: 0 },
        // study
        { id: 'round-rug', f: 1, x: 4, y: 5, r: 0, sw: 1 },
        { id: 'desk', f: 1, x: 5, y: 4, r: 0 },
        { id: 'desk-chair', f: 1, x: 6, y: 5, r: 2 },
        { id: 'bookshelf', f: 1, x: 3, y: 4, r: 0 },
        { id: 'floor-lamp', f: 1, x: 7, y: 4, r: 0, sw: 2 },
        { id: 'two-seat-sofa', f: 1, x: 2, y: 6, r: 3, sw: 1 },
        { id: 'floating-shelf', f: 1, wall: [2, 6, 'y'] },
        // craft corner
        { id: 'easel', f: 1, x: 5, y: 9, r: 3 },
        { id: 'kitchen-counter', f: 1, x: 7, y: 8, r: 3, sw: 1 },
        { id: 'small-succulent', f: 1, on: 'kitchen-counter#5@0' },
        { id: 'monstera', f: 1, x: 7, y: 11, r: 0, sw: 1 },
        { id: 'club-armchair', f: 1, x: 3, y: 10, r: 3, sw: 2 },
        { id: 'framed-print', f: 1, wall: [4, 8, 'x'], sw: 2 },
        { id: 'cat-bed', f: 1, x: 3, y: 11, r: 0 },
        // bedroom
        { id: 'round-rug', f: 2, x: 3, y: 5, r: 0 },
        { id: 'double-bed', f: 2, x: 3, y: 0, r: 0, sw: 0 },
        { id: 'nightstand', f: 2, x: 2, y: 0, r: 0 },
        { id: 'nightstand', f: 2, x: 5, y: 0, r: 0 },
        { id: 'table-lamp', f: 2, on: 'nightstand#1@0', sw: 1 },
        { id: 'table-lamp', f: 2, on: 'nightstand#2@0', sw: 1 },
        { id: 'dresser', f: 2, x: 7, y: 5, r: 3 },
        { id: 'window-seat-cushion', f: 2, x: 3, y: 11, r: 2 },
        { id: 'framed-print', f: 2, wall: [6, 0, 'x'], sw: 1 },
        { id: 'floor-lamp', f: 2, x: 1, y: 1, r: 0, sw: 1 },
        { id: 'monstera', f: 2, x: 7, y: 9, r: 0, sw: 2 },
        { id: 'curtains', f: 2, wall: [3, 0, 'x'], sw: 3 },
        { id: 'curtains', f: 2, wall: [4, 0, 'x'], sw: 3 }
      ]
    }
  };
  // wallpapers and floors (bible, Art palette, and mockups/build-v1's wall styles)
  SS.PAPERS = {
    rose: { base: '#ecc1b2', stripe: '#f3d2c4', low: '#dcab9c', dot: '#e79aa0' },
    sage: { base: '#b5cdc4', stripe: '#c8dcd4', low: '#98b5aa', dot: '#e7f0ea' },
    honey: { base: '#f0d9a8', stripe: '#f6e6c2', low: '#d9bd85', dot: '#e7a96f' },
    cream: { base: '#f3e6d6', stripe: '#fbf1e4', low: '#e3d3bf', dot: '#e8b8a8' },
    blue: { base: '#c6d8e6', stripe: '#d8e6f0', low: '#a9c2d6', dot: '#ffffff' },
    lilac: { base: '#ddcbe8', stripe: '#e9dcf0', low: '#c3aed4', dot: '#f39bb0' }
  };
})();
