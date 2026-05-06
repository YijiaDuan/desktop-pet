# Desktop Pet

A tiny companion app for your screen. Pick a pet — a goose for now, more on the way — and it'll breathe, blink, get curious about your cursor, and sleep when you ignore it. No productivity hacks. No notifications. Just a small creature who hangs out.

> Inspired by Office Clippy, 瑞星小狮子, and the spirit of pre-utility desktop pets.

## Available pets

| | Pet | Status |
|---|---|---|
| 🪿 | 大白鹅 (Goose) | ✅ Available |
| 🐱 | 团子 (Cat) | 🚧 Coming soon |
| 🍡 | 苔苔 (Slime) | 🚧 Coming soon |

Right-click your pet → **换一只** to switch. Selection is remembered between launches.

## Features

- **Always-on-top transparent window** that floats over any app
- **Self-running state machine**: idle → curious → drowsy → sleeping (5 / 15 min by default)
- **Mouse interactions**:
  - Click → pet's signature sound + reaction
  - Double-click → startled jump + blush
  - Long press + drag → grab the window
  - Hover 3s → nuzzle
  - Circle the cursor around it → dizzy
  - Right-click → menu (wake / sleep / switch pet / quit)
- **Pluggable pet modules** — add a new pet by dropping a single `pets/<name>.js` file (see "Adding a new pet" below)
- **Tiny footprint** — ~3 MB DMG, ~30 MB RAM idle

## Tech stack

- [Tauri 2](https://tauri.app/) — Rust shell + system webview
- Vanilla HTML / CSS / native ES modules — no bundler

## Run from source

Requirements: Node 18+, Rust stable, Xcode Command Line Tools (macOS).

```bash
npm install
npm run dev          # hot-reload dev mode
npm run build:dmg    # produces a .dmg in src-tauri/target/release/bundle/dmg/
```

## Install the prebuilt DMG

Until the app is signed with an Apple Developer ID, macOS Gatekeeper will refuse to open it on first launch:

1. Right-click the app in `/Applications` → **Open** → confirm.
2. Or in Terminal: `xattr -cr "/Applications/Desktop Pet.app"`

## Project layout

```
desktop-pet/
├── src/                       # Frontend (HTML/CSS/JS, no bundler)
│   ├── index.html             # Transparent shell + bubble + menu
│   ├── main.js                # Loader, state machine, mouse interactions
│   └── pets/
│       ├── index.js           # Registry of all pets
│       └── goose.js           # The goose: SVG + CSS + voice
├── src-tauri/
│   ├── Cargo.toml
│   ├── tauri.conf.json        # Window: transparent, always-on-top, no decorations
│   ├── capabilities/          # Tauri 2 permissions
│   ├── icons/                 # App icons (.png + .icns)
│   └── src/
│       ├── main.rs
│       └── lib.rs
└── package.json
```

## Adding a new pet

1. Copy `src/pets/goose.js` to `src/pets/yourpet.js`.
2. Replace the `svg` string with your pet's SVG markup. The root element must have classes `pet pet-<id>`.
3. Replace the `styles` string with CSS keyframes/selectors scoped to `.pet-<id>`. Useful state classes the loader will toggle on the root: `idle`, `curious`, `drowsy`, `sleeping`, `honking`, `startled`, `dizzy`, `dragging`, `nuzzling`, `blinking`.
4. (Optional) Provide `hooks.head` — a CSS selector relative to the SVG. The loader rotates that element to track the cursor.
5. Edit `src/pets/index.js`: import your pet and add it to `PETS` with `available: true`.

That's it — no JS to write, no build step, no other files to touch.

## Roadmap

- [ ] Sign + notarize for friction-free install
- [ ] Cat + slime pets
- [ ] Walking along the screen edge (Shimeji-style)
- [ ] Seasonal skins per pet
- [ ] Sound effects (off by default)
- [ ] Windows + Linux builds

## License

MIT — see [LICENSE](LICENSE).
