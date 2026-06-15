const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('empresa.db');

// Ajusta estos valores con tu primer curso real
const titulo = "Inducción Corporativa";
const desc = "Video introductorio sobre los valores de la empresa";
const tipo = "video"; // O 'pdf'
const url_r = "https://www.youtube.com/embed/VIDEO_ID"; // Link embebido
const url_f = "https://docs.google.com/forms/tu-link";

db.run(`INSERT INTO cursos (titulo, descripcion, tipo_contenido, url_recurso, url_form) 
        VALUES (?, ?, ?, ?, ?)`, [titulo, desc, tipo, url_r, url_f], (err) => {
    if (err) console.error(err.message);
    else console.log("¡Curso agregado exitosamente!");
});

db.close();