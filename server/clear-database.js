const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.join(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const dbPath = path.join(dataDir, "busca-ativa.sqlite");

fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS routes (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    route TEXT NOT NULL,
    name TEXT NOT NULL,
    birth TEXT,
    age TEXT,
    doc TEXT,
    contacts TEXT NOT NULL DEFAULT '[]',
    address TEXT NOT NULL,
    area TEXT,
    reason TEXT,
    visit TEXT,
    visit_date TEXT,
    professional TEXT,
    visit_done TEXT,
    priority TEXT,
    status TEXT,
    last TEXT,
    lat REAL,
    lng REAL,
    removed INTEGER NOT NULL DEFAULT 0,
    removed_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);
ensureColumn("patients", "removed_at", "TEXT");

db.exec("BEGIN");
try {
  db.exec("DELETE FROM patients; DELETE FROM routes; DELETE FROM sqlite_sequence WHERE name = 'patients';");
  setSetting("disable_demo_seed", "1");
  db.exec("COMMIT");
  console.log("Banco limpo: 0 rotas e 0 pacientes. A base demo nao sera recriada automaticamente.");
} catch (error) {
  db.exec("ROLLBACK");
  console.error("Falha ao limpar banco:", error.message);
  process.exitCode = 1;
} finally {
  db.close();
}

function ensureColumn(table, column, definition) {
  const exists = db.prepare(`PRAGMA table_info(${table})`).all().some(item => item.name === column);
  if (!exists) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

function setSetting(key, value) {
  db.prepare(`
    INSERT INTO app_settings (key, value)
    VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(key, value);
}
