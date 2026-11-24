# studio

Keegan's game studio: every game, the shared engine, the launcher and the bibles, in one repo.
Games are web games with GBA-style on-screen controls, played from the iPhone home screen.

## Layout

```
studio/
  designer-todo.md     Designer jobs not yet on a game's To do
  studio-bible/        house rules for every game
    studio.md          platform, repo, roles, Design Inbox
    controls.md        GBA layout, button sizes
    art-style.md       palette, sprite sizes, fonts
    ui.md              menus, dialogue boxes, title cards
    launcher.md        cover art size, how games register
    saves.md           save slots, versions, export and import
    rules-checks.md    what a rules check verifies
    play.md            how every game treats the player
  engine/              shared code: combat, dialogue, saves, input
  launcher/            the home screen app and game shelf
  games/
    black-lantern/
      bible.md         this game's build bible
      changelog.md     what the Developer has built
      specs/           feature specs from the Designer
      assets/          sprite drawing code
      mockups/         design reference pictures (never loaded by the game)
      src/             game-specific code and content
    rushlight/         same structure
```

Some of these files don't exist yet. The bibles move in from their Claude Docs during setup.
For now each game's code is still whole in its `src/` folder. Shared parts move into `engine/` later.

## Who does what

- **Game Designer** (a Claude Project) decides *what* to build: bibles, specs, mockups, art direction. It never writes code.
- **Game Developer** (Claude Code, this repo) decides *how*: engine, games, launcher, builds, deploys. It never changes a bible or spec without asking.

They talk through files in this repo, not through memory.

## The loop for each feature

1. The Designer writes a spec in `games/<game>/specs/` that cites the bible sections it relies on.
2. The Developer builds it, puts shared parts in `engine/`, and adds a changelog entry.
3. Keegan plays the Dev build from the launcher.
4. The Designer reads the changelog and runs a rules check against the bibles.
5. If it passes, it ships to Release. If not, a revised spec goes back to step 2.

**Bugs** skip the spec. Keegan reports one, the Developer fixes it on Dev and logs it, and it ships when Keegan says so.
The Designer is involved only if the fix would change a bible rule.

## Hosting

Everything deploys to one GitHub Pages site, each game at its own path (for example `/black-lantern`), updated on every push.
