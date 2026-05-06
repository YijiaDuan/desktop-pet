# Desktop Goose

A cozy companion goose that lives on your screen. It breathes, blinks, gets curious about your cursor, sleeps when you ignore it, and honks when you click. No productivity hacks. No notifications. Just a small white bird who hangs out.

> Inspired by Office Clippy, 瑞星小狮子, and the spirit of pre-utility desktop pets.

## Features

- **Always-on-top transparent window** that floats over any app
- **Self-running state machine**: idle → curious → drowsy → sleeping (5 / 15 min by default)
- **Mouse interactions**:
  - Click → honk + wing flap
  - Double-click → startled jump + blush
  - Long press + drag → grab the window
  - Hover 3s → nuzzle
  - Circle the cursor around it → dizzy
  - Right-click → menu (wake / sleep / honk / quit)
- **Pure SVG art** — zero image assets, fully tweakable in code
- **Tiny footprint** — ~3 MB DMG, ~30 MB RAM idle

## Tech stack

- [Tauri 2](https://tauri.app/) — Rust shell + system webview
- Vanilla HTML / CSS / JS for the goose itself

## Run from source

Requirements: Node 18+, Rust stable, Xcode Command Line Tools (macOS).

```bash
npm install
npm run dev          # hot-reload dev mode
npm run build:dmg    # produces a .dmg in src-tauri/target/release/bundle/dmg/
```

## Install the prebuilt DMG

Until the app is signed with an Apple Developer ID, macOS Gatekeeper will refuse to open it on first launch. Two ways around it:

1. Right-click the app in `/Applications` → **Open** → confirm.
2. Or in Terminal: `xattr -cr "/Applications/Desktop Goose.app"`

## Project layout

```
desktop-goose-app/
├── src/                  # Frontend (HTML/CSS/JS)
│   ├── index.html        # SVG goose + styles
│   └── main.js           # State machine + interactions
├── src-tauri/
│   ├── Cargo.toml
│   ├── tauri.conf.json   # Window config (transparent, always-on-top, etc.)
│   ├── capabilities/     # Tauri 2 permissions
│   ├── icons/            # App icons (.png + .icns)
│   └── src/
│       ├── main.rs
│       └── lib.rs
└── package.json
```

## Roadmap

- [ ] Sign + notarize for friction-free install
- [ ] Walking along the screen edge (Shimeji-style)
- [ ] Multiple pets (cat, slime) with different personalities
- [ ] Seasonal skins
- [ ] Windows + Linux builds

## License

MIT — see [LICENSE](LICENSE).
