# Controls and screen

House rules for every game. Sources: Black Lantern Tech (Screen and controls) and Rushlight Tech (Screen and controls), both Nov 20–21, 2026.

## Shell

- Every game plays inside the GBA-style shell, on the map and in battle. No full-screen layouts. (Both games tried full screen first and reversed it.)
- The game draws on a canvas 240 px wide and as tall as the shell's screen allows (130 to 320 px), scaled up with crisp pixels to fill the screen (set Nov 21, matching what both games already do; it shows more of the map on a phone than 240 × 160 would).
- The shell's layout and buttons are shared by every game. Each game paints it in its own colors and brand.

## Buttons

| Button | Does |
| --- | --- |
| D-pad | Move, move the cursor |
| A | Confirm, talk |
| B | Back |
| L / R | Previous / next (each game says what it steps through). A game may give L/R their own jobs in its `bible.md` instead, and use them as previous / next inside its menus (Life After: L opens the bag, R the map, set Nov 21) |
| Start | Menu |
| Select | Cycles the lead character on the map (see `ui.md`, Party menu). A game with no lead to cycle gives Select its own job in its `bible.md` (Life After: companion orders, set Nov 21) |

- Tapping a menu row also works.
- Holding a D-pad button repeats it in menus: once on press, again after 320 ms, then every 85 ms.
- On the map, the last direction pressed wins.
- L and R are wide shoulder buttons in the top corners of the controls area: L top left, R top right, right under the screen and above the D-pad and A/B. They are about 80 × 24 px on an iPhone SE, roughly twice the width of the old middle-cluster buttons, so thumbs find them without looking (set Nov 21, spec 003; replaces L and R in the middle cluster). Select and Start stay in the middle.
- Keep every control in the bottom half of the phone so thumbs reach them.

## Keyboard (testing on a computer)

Arrows, Z = A, X = B, Q / W = L / R, Enter = Start, Backspace = Select. Space also works as A and Shift as Select (Backspace confirmed as Select Nov 21).

## Target screen

- iPhone SE first: 375 × 667 (the in-app viewer is shorter). Nothing may be cut off.
- Before every release, test at about 375 × 550 and 320 × 480.
- iOS blocks sound until the first tap. Any game that adds sound opens on a Press Start screen.
