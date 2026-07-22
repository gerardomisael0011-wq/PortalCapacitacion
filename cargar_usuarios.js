const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('./empresa_v2.db');
const sqlDatos = fs.readFileSync('./importar_datos.sql', 'utf8');

// Primero creamos la tabla
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS usuarios (nomina TEXT PRIMARY KEY, nombre TEXT)");
    
    // Luego insertamos los datos
    db.exec(sqlDatos, (err) => {
        if (err) {
            console.error("Error al insertar datos:", err.message);
        } else {
            console.log("¡Éxito! Tabla creada y usuarios importados correctamente.");
        }
        db.close();
    });
});