# UI

House rules for every game. Each game's `bible.md` sets its own colors and menu contents.
Sources: Black Lantern Art (Faces and sprites, Light and mood) and Rushlight Art (Town street, Battle), Nov 15–21, 2026; Screen craft from Keegan's Rushlight playtest, Nov 23, 2026.

## Dialog box ("Lantern Bust" layout)

- A box along the bottom of the screen with a light border and 3 lines of VT323 text.
- The 64 × 64 portrait stands on top of the box at the map's pixel size, with the speaker's name in caps on a tab beside it.
- Signs: tab only, no portrait. Narration: no tab.
- When the speaker is drawn large in the scene in front of you (a cutscene, a briefing), the box shows the name tab only, no portrait. The portrait is for speakers you can't see up close: talk on the map, voices off screen, lines over a menu or a board (Black Lantern spec 013, Nov 22, 2026).
- Short lines, typewriter effect. A ▼ marks advance.
- Questions show their choices inside the box, under the question line, with a cursor. Tapping a choice also works, and a long list scrolls inside the box.
- Each game paints the box in its own palette.

## Screen craft

Set Nov 23, 2026 from Keegan's Rushlight playtest, written from what Black Lantern's screens already do. These are minimums: each game's bible picks its own colors and can add more.

- **Readable text.** Dialog, descriptions and anything you read for meaning use the game's main text color. The dim color is only for labels, hints and the key help line at the bottom.
- **No cut-off names.** A person's, trade's, place's, job's or item's name always shows in full. Shorten the label or wrap to a second line instead of ending it in "…". Only long flavor text may be cut, and then its full text is one press away.
- **Rows with detail are cards.** A row that carries more than a name and one value is a boxed card: a title line, a subtitle line, the portrait at 2× when it has one, and its actions as buttons on the card. Plain one-line rows are for short pick lists, like the map menu or a question's choices.
- **Room to breathe.** Boxes keep a gap between them, and a description gets its own box sized to its text. No box is mostly empty while the list above it is squeezed.
- **Portraits stand out.** A portrait sits on a lit or lighter backing that its dark outline reads against, never on a backing as dark as the outline.
- **Strips and HUDs fit.** The map HUD is a framed card. A strip that won't fit in one line at 320 × 480 splits into two lines or moves part of its contents to the card, rather than squeezing or cutting words.

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
