use tauri::Manager;

#[cfg(target_os = "windows")]
mod windows_support;

/// State container shared across the app. On non-Windows targets it is
/// effectively empty so the rest of the codebase can ignore the platform.
struct AppState {
    #[cfg(target_os = "windows")]
    click_through: std::sync::Arc<windows_support::ClickThroughState>,
}

#[tauri::command]
fn update_pet_hitbox(
    #[allow(unused_variables)] x: i32,
    #[allow(unused_variables)] y: i32,
    #[allow(unused_variables)] w: i32,
    #[allow(unused_variables)] h: i32,
    #[allow(unused_variables)] full_window: bool,
    #[allow(unused_variables)] state: tauri::State<'_, AppState>,
) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        state
            .click_through
            .set(windows_support::HitBox {
                x,
                y,
                w,
                h,
                full_window,
            })
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(target_os = "windows")]
    let click_through = std::sync::Arc::new(windows_support::ClickThroughState::default_inside_window());

    let app_state = AppState {
        #[cfg(target_os = "windows")]
        click_through: click_through.clone(),
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None,
        ))
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![update_pet_hitbox])
        .setup(move |app| {
            let win = app
                .get_webview_window("main")
                .expect("main window not found");
            let _ = win.set_always_on_top(true);

            // System tray + click-through are Windows-specific.
            // The macOS build keeps its original "right-click the pet"
            // contextual menu UX exactly as it was.
            #[cfg(target_os = "windows")]
            {
                windows_support::build_tray(app.handle())?;
                windows_support::spawn_click_through_loop(
                    app.handle().clone(),
                    click_through.clone(),
                );
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
