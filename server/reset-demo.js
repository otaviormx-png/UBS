const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const path = require("node:path");
const { routes, patients } = require("./seed-data");

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
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec("BEGIN");
try {
  db.exec("DELETE FROM patients; DELETE FROM routes; DELETE FROM sqlite_sequence WHERE name = 'patients';");

  const insertRoute = db.prepare("INSERT INTO routes (code, name) VALUES (?, ?)");
  routes.forEach(route => insertRoute.run(route.code, route.name));

  const insertPatient = db.prepare(`
    INSERT INTO patients
      (route, name, birth, age, doc, contacts, address, area, reason, visit, visit_date, professional, visit_done, priority, status, last, lat, lng)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  patients.forEach(patient => insertPatient.run(
    patient.route,
    patient.name,
    patient.birth,
    String(patient.age ?? ""),
    patient.doc,
    JSON.stringify(patient.contacts || []),
    patient.address,
    patient.area,
    patient.reason,
    patient.visit,
    patient.visitDate,
    patient.professional,
    patient.visitDone,
    patient.priority,
    patient.status,
    patient.last,
    patient.lat,
    patient.lng
  ));

  db.exec("COMMIT");
  console.log(`Base demo reiniciada: ${routes.length} rotas e ${patients.length} pacientes.`);
} catch (error) {
  db.exec("ROLLBACK");
  console.error("Falha ao reiniciar base demo:", error.message);
  process.exitCode = 1;
} finally {
  db.close();
}
