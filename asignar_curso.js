const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'empresa_v2.db'));

const nomina = '2887';
const idCurso = 1;

db.run(`INSERT INTO asignaciones (id_usuario, id_curso) VALUES (?, ?)`, [nomina, idCurso], (err) => {
    if (err) console.error("Error al asignar:", err.message);
    else console.log(`Curso ${idCurso} asignado a la nómina ${nomina} en empresa_v2.db`);
});
db.close();