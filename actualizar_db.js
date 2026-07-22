const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('empresa_v2.db');

db.serialize(() => {
    // 1. Crear tabla de cursos
    db.run(`CREATE TABLE IF NOT EXISTS cursos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT,
        descripcion TEXT,
        tipo_contenido TEXT,
        url_recurso TEXT,
        url_form TEXT
    )`);

    // 2. Crear tabla de usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        nomina TEXT PRIMARY KEY,
        nombre TEXT,
        foto_archivo TEXT
    )`);

    // 3. Intentar agregar columnas (si ya existen, sqlite simplemente ignorará el error internamente)
    db.run("ALTER TABLE usuarios ADD COLUMN nombre TEXT", (err) => {});
    db.run("ALTER TABLE usuarios ADD COLUMN foto_archivo TEXT", (err) => {});

    console.log("Base de datos actualizada correctamente.");
});

db.close();