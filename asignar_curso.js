const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('empresa.db');

// CAMBIA ESTOS VALORES
const nomina = '2887';
const idCurso = 1;

db.run(`INSERT INTO asignaciones (id_usuario, id_curso) VALUES (?, ?)`, [nomina, idCurso], (err) => {
    if (err) console.error("Error al asignar:", err.message);
    else console.log(`Curso ${idCurso} asignado a la nómina ${nomina}`);
});

db.close();