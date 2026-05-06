//! Windows-specific glue:
//!  - System tray icon + menu (wake / sleep / honk / show-hide / autostart / quit)
//!  - Click-through polling: lets the user interact with the desktop in the
//!    transparent area around the pet, while still letting them click the pet.
//!
//! Implementation notes:
//!  - Tauri 2's `WebviewWindow::set_ignore_cursor_events(true)` makes the whole
//!    window transparent to the cursor (clicks fall through to whatever is
//!    behind it). When that flag is `true` we obviously don't get any mouse
//!    events in the WebView either, so we cannot toggle it back from JS.
//!    Hence: a 30Hz background thread that reads the global cursor position
//!    via `device_query`, compares it to the pet's bbox, and flips the flag.

use std::sync::{Arc, Mutex};

use device_query::{DeviceQuery, DeviceState};
use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{AppHandle, Emitter, Manager};

#[derive(Default, Clone, Copy, Debug)]
pub struct HitBox {
    /// X offset (physical pixels, relative to the window's top-left).
    pub x: i32,
    /// Y offset (physical pixels, relative to the window's top-left).
    pub y: i32,
    /// Width in physical pixels.
    pub w: i32,
    /// Height in physical pixels.
    pub h: i32,
    /// When true, treat the entire window as opaque (used while a menu is
    /// open, while the bubble is visible, while dragging, etc.).
    pub full_window: bool,
}

pub struct ClickThroughState {
    bbox: Mutex<HitBox>,
}

impl ClickThroughState {
    /// 200x200 area centered in the default 220x220 window.
    pub fn default_inside_window() -> Self {
        Self {
            bbox: Mutex::new(HitBox {
                x: 10,
                y: 10,
                w: 200,
                h: 200,
                full_window: false,
            }),
        }
    }

    pub fn set(&self, hb: HitBox) -> Result<(), String> {
        *self.bbox.lock().map_err(|e| e.to_string())? = hb;
        Ok(())
    }

    fn snapshot(&self) -> Option<HitBox> {
        self.bbox.lock().ok().map(|g| *g)
    }
}

pub fn spawn_click_through_loop(app: AppHandle, ct: Arc<ClickThroughState>) {
    use std::thread;
    use std::time::Duration;

    thread::spawn(move || {
        let device = DeviceState::new();
        let mut last_ignore: Option<bool> = None;
        let mut consecutive_errors = 0u32;

        loop {
            thread::sleep(Duration::from_millis(33)); // ~30Hz

            let Some(win) = app.get_webview_window("main") else {
                continue;
            };

            // Window may be hidden via the tray menu.
            if matches!(win.is_visible(), Ok(false)) {
                last_ignore = None;
                continue;
            }

            let win_pos = match win.outer_position() {
                Ok(p) => p,
                Err(_) => {
                    consecutive_errors += 1;
                    if consecutive_errors > 30 {
                        // Don't burn CPU forever in some pathological state.
                        thread::sleep(Duration::from_secs(1));
                        consecutive_errors = 0;
                    }
                    continue;
                }
            };
            consecutive_errors = 0;

            let win_size = match win.outer_size() {
                Ok(s) => s,
                Err(_) => continue,
            };

            let mouse = device.get_mouse().coords; // physical pixels
            let mx = mouse.0;
            let my = mouse.1;

            let hb = match ct.snapshot() {
                Some(h) => h,
                None => continue,
            };

            let (rx, ry, rw, rh) = if hb.full_window {
                (
                    win_pos.x,
                    win_pos.y,
                    win_size.width as i32,
                    win_size.height as i32,
                )
            } else {
                (win_pos.x + hb.x, win_pos.y + hb.y, hb.w, hb.h)
            };

            let inside = mx >= rx && mx < rx + rw && my >= ry && my < ry + rh;
            // ignore_cursor_events == true  -> window is click-through
            // ignore_cursor_events == false -> window receives clicks
            let want_ignore = !inside;

            if last_ignore != Some(want_ignore) {
                let _ = win.set_ignore_cursor_events(want_ignore);
                last_ignore = Some(want_ignore);
            }
        }
    });
}

pub fn build_tray(app: &AppHandle) -> tauri::Result<()> {
    let wake = MenuItem::with_id(app, "wake", "叫醒", true, None::<&str>)?;
    let sleep = MenuItem::with_id(app, "sleep", "让它睡", true, None::<&str>)?;
    let honk = MenuItem::with_id(app, "honk", "打个招呼", true, None::<&str>)?;
    let sep1 = PredefinedMenuItem::separator(app)?;
    let toggle_visible =
        MenuItem::with_id(app, "toggle_visible", "显示 / 隐藏宠物", true, None::<&str>)?;
    let toggle_autostart = MenuItem::with_id(
        app,
        "toggle_autostart",
        "开机自启 (切换)",
        true,
        None::<&str>,
    )?;
    let sep2 = PredefinedMenuItem::separator(app)?;
    let quit = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;

    let menu = Menu::with_items(
        app,
        &[
            &wake,
            &sleep,
            &honk,
            &sep1,
            &toggle_visible,
            &toggle_autostart,
            &sep2,
            &quit,
        ],
    )?;

    let _tray = TrayIconBuilder::with_id("main-tray")
        .icon(
            app.default_window_icon()
                .expect("default window icon missing")
                .clone(),
        )
        .tooltip("Desktop Pet")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "wake" => emit_to_main(app, "tray://wake"),
            "sleep" => emit_to_main(app, "tray://sleep"),
            "honk" => emit_to_main(app, "tray://honk"),
            "toggle_visible" => {
                if let Some(w) = app.get_webview_window("main") {
                    if matches!(w.is_visible(), Ok(true)) {
                        let _ = w.hide();
                    } else {
                        let _ = w.show();
                        let _ = w.set_focus();
                    }
                }
            }
            "toggle_autostart" => {
                use tauri_plugin_autostart::ManagerExt;
                let mgr = app.autolaunch();
                let enabled = mgr.is_enabled().unwrap_or(false);
                if enabled {
                    let _ = mgr.disable();
                } else {
                    let _ = mgr.enable();
                }
            }
            "quit" => {
                app.exit(0);
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Some(w) = app.get_webview_window("main") {
                    let _ = w.show();
                    let _ = w.set_focus();
                }
            }
        })
        .build(app)?;

    Ok(())
}

fn emit_to_main(app: &AppHandle, evt: &str) {
    if let Some(w) = app.get_webview_window("main") {
        let _ = w.show();
    }
    let _ = app.emit(evt, ());
}
