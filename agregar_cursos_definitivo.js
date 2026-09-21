const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'empresa_v2.db'));

db.run(`INSERT OR REPLACE INTO cursos (id, titulo, descripcion, tipo_contenido, url_recurso, url_form) 
        VALUES (1, 'Curso de Seguridad', 'Video introductorio', 'video', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://docs.google.com/forms')`, 
        (err) => {
    if (err) console.error(err.message);
    else console.log("¡Curso 1 agregado correctamente a empresa_v2.db!");
});
db.close();