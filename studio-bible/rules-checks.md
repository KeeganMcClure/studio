# Rules checks

A rules check is how the Designer confirms a build matches the bibles before it ships to Release. It runs after Keegan has played the Dev build (step 4 of the loop in the README).

## Before the check

1. Read the game's `changelog.md` to see what was actually built, including any deviations the Developer logged.
2. Read the spec in `specs/` that the feature came from.
3. Read the `studio-bible/` files and `bible.md` sections the spec cites.

## What it verifies

- **The spec:** everything the spec asked for is built, and nothing it ruled out was added.
- **The game's bible:** the feature follows `bible.md`, section by section.
- **House rules:** the feature follows `studio-bible/`: controls and screen, art style, UI, saves.
- **Saves:** no old save breaks. A change to what a save holds came with a new upgrade step and test saves.
- **Shared engine:** anything another game could use went into `engine/`, not into this game.
- **Across games:** if the feature touched `engine/` or `studio-bible/`, it doesn't break or contradict another game. The spoiler wall holds: no game's story files were opened for another game.
- **Deviations:** each one in the changelog is either accepted (and the bible updated to match) or sent back.

## The result

- Cite the bible section for every finding.
- **Pass:** it ships to Release when Keegan says so.
- **Fail:** list each conflict and write a revised spec, which goes back to the Developer.
- If a rule could apply to more than one game, propose moving it into `studio-bible/`.

Bugs skip rules checks unless the fix changes a bible rule.
