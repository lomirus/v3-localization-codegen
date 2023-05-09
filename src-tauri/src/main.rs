// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, Menu, Submenu};

fn main() {
    let import = CustomMenuItem::new("import".to_string(), "导入表格");
    let submenu = Submenu::new(
        "菜单",
        Menu::new()
            .add_item(import)
            .add_native_item(tauri::MenuItem::Quit),
    );
    let menu = Menu::new().add_submenu(submenu);

    tauri::Builder::default()
        .menu(menu)
        .on_menu_event(|event| match event.menu_item_id() {
            "import" => {
                event.window().emit("import", ()).unwrap();
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
