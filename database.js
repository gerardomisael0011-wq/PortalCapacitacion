const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'empresa_v2.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (nomina TEXT PRIMARY KEY, nombre TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS evaluaciones (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, url_form TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS resultados (id_usuario TEXT, id_evaluacion INTEGER, aprobado INTEGER DEFAULT 0)`);
    // Aseguramos que las tablas nuevas también existan aquí
    db.run(`CREATE TABLE IF NOT EXISTS cursos (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, descripcion TEXT, tipo_contenido TEXT, url_recurso TEXT, url_form TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS asignaciones (id_usuario TEXT, id_curso INTEGER)`);
});

module.exports = db;