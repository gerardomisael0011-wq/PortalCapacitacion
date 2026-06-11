const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Usamos 'path.join' para que el servidor siempre encuentre la base de datos 
// sin importar en qué carpeta la guarde Render
const dbPath = path.join(__dirname, 'empresa.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (nomina TEXT PRIMARY KEY, nombre TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS evaluaciones (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, url_form TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS resultados (id_usuario TEXT, id_evaluacion INTEGER, aprobado INTEGER DEFAULT 0)`);
});

module.exports = db;