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

### macOS

Requirements: Node 18+, Rust stable, Xcode Command Line Tools.

```bash
npm install
npm run dev          # hot-reload dev mode
npm run build:dmg    # produces a .dmg in src-tauri/target/release/bundle/dmg/
```

### Windows

Requirements:

- Node 18+
- Rust stable for `x86_64-pc-windows-msvc` (`winget install Rustlang.Rustup`)
- **Microsoft C++ Build Tools** with the *Desktop development with C++* workload
  (`winget install Microsoft.VisualStudio.2022.BuildTools --override "--add Microsoft.VisualStudio.Workload.VCTools --includeRecommended"`)
- **WebView2 Runtime** (preinstalled on Windows 11; on Windows 10 it ships with new versions of Edge — otherwise download the *Evergreen Bootstrapper* from Microsoft)

```bash
npm install
npm run dev               # hot-reload dev mode
npm run build:windows     # produces .msi + .exe (NSIS) in src-tauri/target/release/bundle/
# or pick one
npm run build:msi
npm run build:nsis
```

The Windows build adds a few platform-specific niceties on top of the
shared cross-platform behavior:

- **System tray icon** with **叫醒 / 让它睡 / 打个招呼 / 显示·隐藏宠物 / 开机自启 / 退出**
  (left-click the tray icon to bring the pet back if you hide it).
- **Click-through outside the pet** — the transparent area around the goose
  *doesn't* steal clicks from your desktop or whatever app is behind it.
  Click the pet itself to interact, or grab it to drag it around.
- **Optional autostart** via `tauri-plugin-autostart` — toggle from the tray.
- **Skipped from the taskbar**, so it really does feel like a desktop creature
  rather than an app window.

#### Heads-up on first launch

The installer is unsigned, so SmartScreen will say *"Windows protected your PC"*.
Click **More info → Run anyway**. (Signing is on the roadmap.)

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
│   ├── icons/                 # App icons (.png + .icns + .ico)
│   └── src/
│       ├── main.rs
│       ├── lib.rs             # cross-platform setup + autostart plugin
│       └── windows_support.rs # Windows-only: tray icon + click-through polling
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
- [x] Windows build
- [ ] Linux build

## License

MIT — see [LICENSE](LICENSE).
