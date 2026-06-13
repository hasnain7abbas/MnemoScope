use rusqlite::{params, Connection, OptionalExtension};
use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf, sync::Mutex};
use tauri::{AppHandle, Manager, State};

pub struct Database(pub Mutex<Connection>);

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Memory {
    pub id: String,
    pub title: String,
    pub memory_type: String,
    pub content: String,
    pub summary: String,
    pub source_path: Option<String>,
    pub thumbnail_path: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub captured_at: String,
    pub metadata_json: String,
    pub tags: Vec<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MemoryInput {
    pub id: String,
    pub title: String,
    pub memory_type: String,
    pub content: String,
    pub summary: String,
    pub source_path: Option<String>,
    pub thumbnail_path: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub captured_at: String,
    pub metadata_json: String,
    pub tags: Vec<String>,
}

const MIGRATIONS: &str = r#"
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS memories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  source_path TEXT,
  thumbnail_path TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  captured_at TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE COLLATE NOCASE,
  color TEXT NOT NULL DEFAULT '#79d7d5'
);

CREATE TABLE IF NOT EXISTS memory_tags (
  memory_id TEXT NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (memory_id, tag_id),
  FOREIGN KEY (memory_id) REFERENCES memories(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS memory_links (
  source_memory_id TEXT NOT NULL,
  target_memory_id TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (source_memory_id, target_memory_id),
  FOREIGN KEY (source_memory_id) REFERENCES memories(id) ON DELETE CASCADE,
  FOREIGN KEY (target_memory_id) REFERENCES memories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts USING fts5(
  memory_id UNINDEXED,
  title,
  content,
  summary,
  tokenize = 'porter unicode61'
);

CREATE TRIGGER IF NOT EXISTS memories_ai AFTER INSERT ON memories BEGIN
  INSERT INTO memories_fts(memory_id, title, content, summary)
  VALUES (new.id, new.title, new.content, new.summary);
END;

CREATE TRIGGER IF NOT EXISTS memories_au AFTER UPDATE ON memories BEGIN
  DELETE FROM memories_fts WHERE memory_id = old.id;
  INSERT INTO memories_fts(memory_id, title, content, summary)
  VALUES (new.id, new.title, new.content, new.summary);
END;

CREATE TRIGGER IF NOT EXISTS memories_ad AFTER DELETE ON memories BEGIN
  DELETE FROM memories_fts WHERE memory_id = old.id;
END;
"#;

const DEMO_MEMORIES: &[(&str, &str, &str, &str, &str, &str, &[&str])] = &[
    (
        "demo-note",
        "The archive should feel alive",
        "note",
        "A timeline is more honest than a folder. It preserves the path, not just the conclusion. The interface should leave enough quiet around each thought that the user can hear it again.",
        "A product principle for treating memory as a living sequence rather than static storage.",
        "2026-06-13T07:48:00+05:00",
        &["product", "principles"],
    ),
    (
        "demo-image",
        "Desk light study",
        "image",
        "Warm pools of light against a quiet, near-black room. Saved as a visual reference for the memory observatory.",
        "A visual reference built around warm focus and a dark, calm environment.",
        "2026-06-13T09:12:00+05:00",
        &["visual", "reference"],
    ),
    (
        "demo-code",
        "Search ranking sketch",
        "code",
        "const score = exactMatch * 4 + phraseMatch * 2 + recencyBoost;\n\n// Older memories should remain discoverable when their language is precise.",
        "A ranking idea that balances exact language, phrase relevance, and recency.",
        "2026-06-13T10:36:00+05:00",
        &["search", "prototype"],
    ),
    (
        "demo-voice",
        "Walk home: project direction",
        "voice",
        "The useful part is not collecting more. It is finding the shape that was already there. Make the daily replay feel like reviewing rushes from a film.",
        "A voice thought connecting daily replay with reviewing film rushes.",
        "2026-06-12T20:36:00+05:00",
        &["voice", "direction"],
    ),
    (
        "demo-pdf",
        "Ambient interfaces notes",
        "pdf",
        "Notes on calm technology, peripheral awareness, and interfaces that communicate without continuously demanding attention.",
        "Research notes about calm, ambient interfaces.",
        "2026-06-12T15:22:00+05:00",
        &["research", "reading"],
    ),
    (
        "demo-project",
        "Weekend prototype plan",
        "note",
        "Saturday: persistence and capture. Sunday: timeline, search, and export. Protect the feel of the product before expanding the feature list.",
        "A focused two-day plan for the first coherent MnemoScope prototype.",
        "2026-06-11T18:04:00+05:00",
        &["planning", "mnemoscope"],
    ),
];

pub fn initialize(app: &AppHandle) -> Result<Database, String> {
    let data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;
    fs::create_dir_all(&data_dir).map_err(|error| error.to_string())?;
    let db_path = data_dir.join("mnemoscope.sqlite3");
    let connection = Connection::open(db_path).map_err(|error| error.to_string())?;
    connection
        .execute_batch(MIGRATIONS)
        .map_err(|error| error.to_string())?;
    seed_demo_data(&connection)?;
    Ok(Database(Mutex::new(connection)))
}

fn seed_demo_data(connection: &Connection) -> Result<(), String> {
    let count: i64 = connection
        .query_row("SELECT COUNT(*) FROM memories", [], |row| row.get(0))
        .map_err(|error| error.to_string())?;

    if count > 0 {
        return Ok(());
    }

    for (id, title, memory_type, content, summary, captured_at, tags) in DEMO_MEMORIES {
        let input = MemoryInput {
            id: (*id).to_string(),
            title: (*title).to_string(),
            memory_type: (*memory_type).to_string(),
            content: (*content).to_string(),
            summary: (*summary).to_string(),
            source_path: None,
            thumbnail_path: None,
            created_at: (*captured_at).to_string(),
            updated_at: (*captured_at).to_string(),
            captured_at: (*captured_at).to_string(),
            metadata_json: "{}".to_string(),
            tags: tags.iter().map(|tag| (*tag).to_string()).collect(),
        };
        save_memory(connection, &input)?;
    }

    Ok(())
}

fn memory_from_row(connection: &Connection, row: &rusqlite::Row<'_>) -> rusqlite::Result<Memory> {
    let id: String = row.get(0)?;
    let mut tag_statement = connection.prepare(
        "SELECT tags.name
         FROM tags
         JOIN memory_tags ON memory_tags.tag_id = tags.id
         WHERE memory_tags.memory_id = ?1
         ORDER BY tags.name",
    )?;
    let tags = tag_statement
        .query_map([&id], |tag_row| tag_row.get::<_, String>(0))?
        .collect::<rusqlite::Result<Vec<_>>>()?;

    Ok(Memory {
        id,
        title: row.get(1)?,
        memory_type: row.get(2)?,
        content: row.get(3)?,
        summary: row.get(4)?,
        source_path: row.get(5)?,
        thumbnail_path: row.get(6)?,
        created_at: row.get(7)?,
        updated_at: row.get(8)?,
        captured_at: row.get(9)?,
        metadata_json: row.get(10)?,
        tags,
    })
}

fn save_memory(connection: &Connection, input: &MemoryInput) -> Result<(), String> {
    connection
        .execute(
            "INSERT INTO memories (
                id, title, type, content, summary, source_path, thumbnail_path,
                created_at, updated_at, captured_at, metadata_json
             ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
             ON CONFLICT(id) DO UPDATE SET
                title = excluded.title,
                type = excluded.type,
                content = excluded.content,
                summary = excluded.summary,
                source_path = excluded.source_path,
                thumbnail_path = excluded.thumbnail_path,
                updated_at = excluded.updated_at,
                captured_at = excluded.captured_at,
                metadata_json = excluded.metadata_json",
            params![
                input.id,
                input.title,
                input.memory_type,
                input.content,
                input.summary,
                input.source_path,
                input.thumbnail_path,
                input.created_at,
                input.updated_at,
                input.captured_at,
                input.metadata_json,
            ],
        )
        .map_err(|error| error.to_string())?;

    connection
        .execute("DELETE FROM memory_tags WHERE memory_id = ?1", [&input.id])
        .map_err(|error| error.to_string())?;

    for tag in &input.tags {
        connection
            .execute(
                "INSERT INTO tags(name) VALUES (?1) ON CONFLICT(name) DO NOTHING",
                [tag],
            )
            .map_err(|error| error.to_string())?;
        let tag_id: i64 = connection
            .query_row("SELECT id FROM tags WHERE name = ?1", [tag], |row| {
                row.get(0)
            })
            .map_err(|error| error.to_string())?;
        connection
            .execute(
                "INSERT OR IGNORE INTO memory_tags(memory_id, tag_id) VALUES (?1, ?2)",
                params![input.id, tag_id],
            )
            .map_err(|error| error.to_string())?;
    }

    Ok(())
}

#[tauri::command]
pub fn list_memories(database: State<'_, Database>) -> Result<Vec<Memory>, String> {
    let connection = database.0.lock().map_err(|error| error.to_string())?;
    let mut statement = connection
        .prepare(
            "SELECT id, title, type, content, summary, source_path, thumbnail_path,
                    created_at, updated_at, captured_at, metadata_json
             FROM memories
             ORDER BY julianday(captured_at) DESC",
        )
        .map_err(|error| error.to_string())?;

    let memories = statement
        .query_map([], |row| memory_from_row(&connection, row))
        .map_err(|error| error.to_string())?
        .collect::<rusqlite::Result<Vec<_>>>()
        .map_err(|error| error.to_string())?;
    Ok(memories)
}

#[tauri::command]
pub fn upsert_memory(database: State<'_, Database>, memory: MemoryInput) -> Result<Memory, String> {
    let connection = database.0.lock().map_err(|error| error.to_string())?;
    save_memory(&connection, &memory)?;

    connection
        .query_row(
            "SELECT id, title, type, content, summary, source_path, thumbnail_path,
                    created_at, updated_at, captured_at, metadata_json
             FROM memories WHERE id = ?1",
            [&memory.id],
            |row| memory_from_row(&connection, row),
        )
        .optional()
        .map_err(|error| error.to_string())?
        .ok_or_else(|| "Memory was not found after saving".to_string())
}

#[tauri::command]
pub fn delete_memory(database: State<'_, Database>, id: String) -> Result<(), String> {
    let connection = database.0.lock().map_err(|error| error.to_string())?;
    connection
        .execute("DELETE FROM memories WHERE id = ?1", [id])
        .map_err(|error| error.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn reset_demo_data(database: State<'_, Database>) -> Result<Vec<Memory>, String> {
    {
        let connection = database.0.lock().map_err(|error| error.to_string())?;
        connection
            .execute("DELETE FROM memories", [])
            .map_err(|error| error.to_string())?;
        seed_demo_data(&connection)?;
    }
    list_memories(database)
}

#[tauri::command]
pub fn data_location(app: AppHandle) -> Result<PathBuf, String> {
    app.path().app_data_dir().map_err(|error| error.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn migrations_seed_relations_and_search_index() {
        let connection = Connection::open_in_memory().expect("in-memory database");
        connection
            .execute_batch(MIGRATIONS)
            .expect("database migrations");
        seed_demo_data(&connection).expect("demo seed");

        let memory_count: i64 = connection
            .query_row("SELECT COUNT(*) FROM memories", [], |row| row.get(0))
            .expect("memory count");
        let tagged_count: i64 = connection
            .query_row("SELECT COUNT(*) FROM memory_tags", [], |row| row.get(0))
            .expect("tag relation count");
        let search_count: i64 = connection
            .query_row(
                "SELECT COUNT(*) FROM memories_fts WHERE memories_fts MATCH 'timeline'",
                [],
                |row| row.get(0),
            )
            .expect("search count");

        assert_eq!(memory_count, 6);
        assert!(tagged_count >= 12);
        assert!(search_count >= 1);

        let updated = MemoryInput {
            id: "demo-note".to_string(),
            title: "A living archive".to_string(),
            memory_type: "note".to_string(),
            content: "Constellations of connected ideas.".to_string(),
            summary: "A renamed product principle.".to_string(),
            source_path: None,
            thumbnail_path: None,
            created_at: "2026-06-13T09:42:00+05:00".to_string(),
            updated_at: "2026-06-13T10:00:00+05:00".to_string(),
            captured_at: "2026-06-13T09:42:00+05:00".to_string(),
            metadata_json: "{}".to_string(),
            tags: vec!["archive".to_string()],
        };
        save_memory(&connection, &updated).expect("memory update");

        let title: String = connection
            .query_row(
                "SELECT title FROM memories WHERE id = 'demo-note'",
                [],
                |row| row.get(0),
            )
            .expect("updated title");
        let updated_search_count: i64 = connection
            .query_row(
                "SELECT COUNT(*) FROM memories_fts WHERE memories_fts MATCH 'constellations'",
                [],
                |row| row.get(0),
            )
            .expect("updated search count");

        assert_eq!(title, "A living archive");
        assert_eq!(updated_search_count, 1);
    }
}
