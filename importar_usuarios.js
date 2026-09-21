const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./empresa_v2.db');

// Pega aquí la lista de usuarios. 
// He formateado los primeros para que veas el ejemplo:
const usuarios = [
    { nomina: '185', nombre: 'ADRIAN ALCANTAR HERNANDEZ' },
    { nomina: '232', nombre: 'ALEJANDRO ALCANTAR HERNANDEZ' },
    // ... agrega aquí todos los demás siguiendo el mismo formato ...
];

db.serialize(() => {
    const stmt = db.prepare("INSERT OR REPLACE INTO usuarios (nomina, nombre) VALUES (?, ?)");
    usuarios.forEach(u => {
        stmt.run(u.nomina, u.nombre);
    });
    stmt.finalize();
    console.log("¡Usuarios importados correctamente!");
});

db.close();