# UI

House rules for every game. Each game's `bible.md` sets its own colors and menu contents.
Sources: Black Lantern Art (Faces and sprites, Light and mood) and Rushlight Art (Town street, Battle), Nov 15–21, 2026.

## Dialog box ("Lantern Bust" layout)

- A box along the bottom of the screen with a light border and 3 lines of VT323 text.
- The 64 × 64 portrait stands on top of the box at the map's pixel size, with the speaker's name in caps on a tab beside it.
- Signs: tab only, no portrait. Narration: no tab.
- When the speaker is drawn large in the scene in front of you (a cutscene, a briefing), the box shows the name tab only, no portrait. The portrait is for speakers you can't see up close: talk on the map, voices off screen, lines over a menu or a board (Black Lantern spec 013, Nov 22, 2026).
- Short lines, typewriter effect. A ▼ marks advance.
- Questions show their choices inside the box, under the question line, with a cursor. Tapping a choice also works, and a long list scrolls inside the box.
- Each game paints the box in its own palette.

## Menus

- Menus are list boxes with a cursor, worked with the D-pad or by tapping a row.
- Start opens the map menu.

## Party menu

Set Nov 21, 2026 from Black Lantern spec 002; Rushlight's Map menu sets the same screen.

- Start → Party shows the party as cards stacked Pokémon-style, in seat order, with the lead marked. The cards don't move when the lead changes; the lead marker does.
- Each card opens Make lead, a details page (Dossier in Black Lantern, Merc card in Rushlight) and Give item.
- Select cycles the lead in seat order, on the map and in the party menu, never in battle, dialog or cutscenes. The new lead takes the old lead's tile and facing, and a short banner names them.
- Each game's bible sets what a card and its details page show.
- A game with one fixed lead leaves out Make lead and Select cycling, and its bible says what Select does instead (Life After: companion orders, set Nov 21).
- The shared parts (who leads, Select cycling, the card list) live in `engine/`.

## Battle screen

For games that cut to a battle screen. A game that fights on the map instead (Life After, set Nov 21, 2026) skips this section, and its `bible.md` says how fights show on the map.

- Inside the shell, with the D-pad shown.
- Head-on: big enemy sprites over a still background drawn from the spot where the fight started. The party is seen from behind.
- Turn order runs in a column at one side, so it never covers sprites.
