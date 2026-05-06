use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let win = app
                .get_webview_window("main")
                .expect("main window not found");
            let _ = win.set_always_on_top(true);
            // 让窗口在所有桌面（Space）之间共享 —— 通过 tauri.conf.json 的
            // visibleOnAllWorkspaces 设置，无需手写 ObjC。
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
