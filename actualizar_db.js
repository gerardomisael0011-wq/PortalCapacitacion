const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('empresa.db');

db.serialize(() => {
    // Esta tabla es el corazón del nuevo sistema de cursos variables
    db.run(`CREATE TABLE IF NOT EXISTS cursos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT,
        descripcion TEXT,
        tipo_contenido TEXT,
        url_recurso TEXT,
        url_form TEXT
    )`, (err) => {
        if (err) {
            console.error("Error al crear la tabla:", err.message);
        } else {
            console.log("¡Tabla 'cursos' creada con éxito!");
        }
    });
});

db.close();