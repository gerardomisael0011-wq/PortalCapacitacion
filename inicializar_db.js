const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'empresa_v2.db'));

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS cursos (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, descripcion TEXT, tipo_contenido TEXT, url_recurso TEXT, url_form TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS asignaciones (id_usuario TEXT, id_curso INTEGER)`);
    console.log("Tablas creadas en empresa_v2.db");
});
db.close();