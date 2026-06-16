const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('empresa_v2.db');

db.serialize(() => {
    // Borra todo y crea desde cero para evitar conflictos
    db.run("DROP TABLE IF EXISTS cursos");
    db.run("DROP TABLE IF EXISTS asignaciones");
    db.run("DROP TABLE IF EXISTS resultados");
    
    db.run("CREATE TABLE cursos (id INTEGER PRIMARY KEY, titulo TEXT, url_recurso TEXT, url_form TEXT, tipo_contenido TEXT)");
    db.run("CREATE TABLE asignaciones (id_usuario TEXT, id_curso INTEGER)");
    db.run("CREATE TABLE resultados (id_usuario TEXT, id_evaluacion INTEGER, aprobado INTEGER)");
    
    console.log("Base de datos limpia y tablas creadas exitosamente.");
});
db.close();