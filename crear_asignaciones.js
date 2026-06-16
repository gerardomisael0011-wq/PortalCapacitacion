const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('empresa_v2.db');

db.serialize(() => {
    // Tabla que une nóminas con cursos
    db.run(`CREATE TABLE IF NOT EXISTS asignaciones (
        id_usuario TEXT,
        id_curso INTEGER,
        FOREIGN KEY(id_usuario) REFERENCES usuarios(nomina),
        FOREIGN KEY(id_curso) REFERENCES cursos(id)
    )`);
    console.log("Tabla de asignaciones creada.");
});
db.close();