const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('empresa.db');

db.serialize(() => {
    console.log("--- CONTENIDO DE CURSOS ---");
    db.each("SELECT * FROM cursos", (err, row) => {
        console.log(row);
    });

    console.log("\n--- CONTENIDO DE ASIGNACIONES ---");
    db.each("SELECT * FROM asignaciones", (err, row) => {
        console.log(row);
    });
});
db.close();