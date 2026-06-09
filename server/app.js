const { DatabaseSync } = require("node:sqlite");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { routes: seedRoutes, patients: seedPatients } = require("./seed-data");

const rootDir = path.join(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const dataDir = path.join(rootDir, "data");
const dbPath = path.join(dataDir, "busca-ativa.sqlite");
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";

fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec(`
  PRAGMA journal_mode = WAL;
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

seedDatabase();

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }
    serveStatic(req, res, url);
  } catch (error) {
    const status = error.status || 500;
    sendJson(res, status, { error: error.message || "Erro interno do servidor." });
  }
});

server.listen(port, host, () => {
  console.log(`Busca Ativa UBS rodando em http://${host}:${port}`);
  console.log(`Banco local: ${dbPath}`);
});

function seedDatabase() {
  const routeCount = db.prepare("SELECT COUNT(*) AS total FROM routes").get().total;
  const patientCount = db.prepare("SELECT COUNT(*) AS total FROM patients").get().total;
  if (routeCount === 0) {
    const insertRoute = db.prepare("INSERT INTO routes (code, name) VALUES (?, ?)");
    seedRoutes.forEach(route => insertRoute.run(route.code, route.name));
  }
  if (patientCount === 0) {
    const insertPatient = db.prepare(`
      INSERT INTO patients
        (route, name, birth, age, doc, contacts, address, area, reason, visit, visit_date, professional, visit_done, priority, status, last, lat, lng)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    seedPatients.forEach(patient => insertPatient.run(
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
  }
}

function resetDemoDatabase() {
  db.exec("BEGIN");
  try {
    db.exec("DELETE FROM patients; DELETE FROM routes; DELETE FROM sqlite_sequence WHERE name = 'patients';");
    const insertRoute = db.prepare("INSERT INTO routes (code, name) VALUES (?, ?)");
    seedRoutes.forEach(route => insertRoute.run(route.code, route.name));
    const insertPatient = db.prepare(`
      INSERT INTO patients
        (route, name, birth, age, doc, contacts, address, area, reason, visit, visit_date, professional, visit_done, priority, status, last, lat, lng)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    seedPatients.forEach(patient => insertPatient.run(
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
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/state") {
    sendJson(res, 200, { routes: listRoutes(), patients: listPatients() });
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/reset-demo") {
    resetDemoDatabase();
    sendJson(res, 200, { routes: listRoutes(), patients: listPatients() });
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/routes") {
    const body = await readJson(req);
    const route = createRoute(body);
    sendJson(res, 201, route);
    return;
  }
  const routeMatch = url.pathname.match(/^\/api\/routes\/(.+)$/);
  if (routeMatch && req.method === "DELETE") {
    removeRoute(decodeURIComponent(routeMatch[1]));
    sendJson(res, 200, { ok: true });
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/patients") {
    const body = await readJson(req);
    const patient = createPatient(body);
    sendJson(res, 201, patient);
    return;
  }
  const patientMatch = url.pathname.match(/^\/api\/patients\/(\d+)$/);
  if (patientMatch && req.method === "PUT") {
    const body = await readJson(req);
    const patient = updatePatient(Number(patientMatch[1]), body);
    sendJson(res, 200, patient);
    return;
  }
  if (patientMatch && req.method === "DELETE") {
    removePatient(Number(patientMatch[1]));
    sendJson(res, 200, { ok: true });
    return;
  }
  const visitMatch = url.pathname.match(/^\/api\/patients\/(\d+)\/visit$/);
  if (visitMatch && req.method === "PATCH") {
    const body = await readJson(req);
    const patient = updateVisitDone(Number(visitMatch[1]), body.visitDone);
    sendJson(res, 200, patient);
    return;
  }
  sendJson(res, 404, { error: "Rota de API não encontrada." });
}

function listRoutes() {
  return db.prepare("SELECT code, name FROM routes ORDER BY rowid").all();
}

function listPatients() {
  return db.prepare("SELECT * FROM patients WHERE removed = 0 ORDER BY id").all().map(rowToPatient);
}

function createRoute(body) {
  const code = clean(body.code);
  const name = clean(body.name);
  if (!code || !name) throw new HttpError(400, "Preencha código e nome da rota.");
  db.prepare("INSERT INTO routes (code, name) VALUES (?, ?)").run(code, name);
  return { code, name };
}

function removeRoute(code) {
  const routeCode = clean(code);
  if (!routeCode) throw new HttpError(400, "Rota inválida.");
  const route = db.prepare("SELECT code FROM routes WHERE code = ?").get(routeCode);
  if (!route) throw new HttpError(404, "Rota não encontrada.");
  db.prepare("DELETE FROM routes WHERE code = ?").run(routeCode);
}

function createPatient(body) {
  const patient = normalizePatient(body);
  if (!patient.name || !patient.address) throw new HttpError(400, "Nome e endereço são obrigatórios.");
  const result = db.prepare(`
    INSERT INTO patients
      (route, name, birth, age, doc, contacts, address, area, reason, visit, visit_date, professional, visit_done, priority, status, last, lat, lng)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    patient.route,
    patient.name,
    patient.birth,
    patient.age,
    patient.doc,
    JSON.stringify(patient.contacts),
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
  );
  return getPatient(result.lastInsertRowid);
}

function updatePatient(id, body) {
  if (!getPatient(id)) throw new HttpError(404, "Paciente não encontrado.");
  const patient = normalizePatient(body);
  db.prepare(`
    UPDATE patients SET
      route = ?, name = ?, birth = ?, age = ?, doc = ?, contacts = ?, address = ?, area = ?,
      reason = ?, visit = ?, visit_date = ?, professional = ?, visit_done = ?, priority = ?,
      status = ?, last = ?, lat = ?, lng = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND removed = 0
  `).run(
    patient.route,
    patient.name,
    patient.birth,
    patient.age,
    patient.doc,
    JSON.stringify(patient.contacts),
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
    patient.lng,
    id
  );
  return getPatient(id);
}

function updateVisitDone(id, visitDone) {
  if (!getPatient(id)) throw new HttpError(404, "Paciente não encontrado.");
  db.prepare("UPDATE patients SET visit_done = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND removed = 0").run(clean(visitDone) || "Não", id);
  return getPatient(id);
}

function removePatient(id) {
  if (!getPatient(id)) throw new HttpError(404, "Paciente não encontrado.");
  db.prepare("UPDATE patients SET removed = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(id);
}

function getPatient(id) {
  const row = db.prepare("SELECT * FROM patients WHERE id = ? AND removed = 0").get(id);
  return row ? rowToPatient(row) : null;
}

function normalizePatient(body) {
  return {
    route: clean(body.route) || "Fora?",
    name: clean(body.name),
    birth: clean(body.birth) || "Não informado",
    age: String(body.age ?? "-"),
    doc: clean(body.doc) || "Não informado",
    contacts: Array.isArray(body.contacts) ? body.contacts.map(clean).filter(Boolean) : [],
    address: clean(body.address),
    area: clean(body.area) || "-",
    reason: clean(body.reason) || "Busca ativa",
    visit: clean(body.visit) || "Assistência social / observação pendente",
    visitDate: clean(body.visitDate) || "A definir",
    professional: clean(body.professional) || "A definir",
    visitDone: clean(body.visitDone) || "Não",
    priority: clean(body.priority) || "Média",
    status: clean(body.status) || "Pendente",
    last: clean(body.last) || new Date().toLocaleDateString("pt-BR"),
    lat: Number(body.lat || -22.9045),
    lng: Number(body.lng || -43.0345)
  };
}

function rowToPatient(row) {
  return {
    id: row.id,
    route: row.route,
    name: row.name,
    birth: row.birth,
    age: row.age,
    doc: row.doc,
    contacts: parseContacts(row.contacts),
    address: row.address,
    area: row.area,
    reason: row.reason,
    visit: row.visit,
    visitDate: row.visit_date,
    professional: row.professional,
    visitDone: row.visit_done,
    priority: row.priority,
    status: row.status,
    last: row.last,
    lat: row.lat,
    lng: row.lng
  };
}

function parseContacts(value) {
  try {
    const contacts = JSON.parse(value || "[]");
    return Array.isArray(contacts) ? contacts : [];
  } catch {
    return [];
  }
}

function serveStatic(req, res, url) {
  let filePath = path.normalize(decodeURIComponent(url.pathname));
  if (filePath === "\\" || filePath === "/") filePath = "index.html";
  filePath = filePath.replace(/^[/\\]+/, "");
  const fullPath = path.join(publicDir, filePath);
  if (!fullPath.startsWith(publicDir)) {
    sendText(res, 403, "Acesso negado.");
    return;
  }
  fs.readFile(fullPath, (error, content) => {
    if (error) {
      sendText(res, 404, "Arquivo não encontrado.");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType(fullPath) });
    res.end(content);
  });
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg"
  }[ext] || "application/octet-stream";
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new HttpError(413, "Requisição muito grande."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new HttpError(400, "JSON inválido."));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function sendText(res, status, body) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(body);
}

function clean(value) {
  return String(value ?? "").trim();
}

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

process.on("uncaughtException", error => {
  console.error(error);
});
