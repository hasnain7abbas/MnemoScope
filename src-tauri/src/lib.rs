mod database;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let database = database::initialize(app.handle())
                .map_err(|error| Box::<dyn std::error::Error>::from(error))?;
            app.manage(database);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            database::list_memories,
            database::upsert_memory,
            database::delete_memory,
            database::reset_demo_data,
            database::data_location,
        ])
        .run(tauri::generate_context!())
        .expect("error while running MnemoScope");
}
