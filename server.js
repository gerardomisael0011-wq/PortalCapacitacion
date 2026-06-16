const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();

const db = new sqlite3.Database('./empresa_v2.db');

// Configuración y creación automática de tablas
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS usuarios (nomina TEXT PRIMARY KEY, nombre TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS cursos (id INTEGER PRIMARY KEY, titulo TEXT, url_recurso TEXT, url_form TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS asignaciones (id_usuario TEXT, id_curso INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS resultados (id_usuario TEXT, id_evaluacion INTEGER, aprobado INTEGER, PRIMARY KEY(id_usuario, id_evaluacion))");
    
    // Datos de prueba iniciales
    db.run("INSERT OR IGNORE INTO usuarios (nomina, nombre) VALUES ('2887', 'Usuario Prueba')");
    db.run("INSERT OR IGNORE INTO cursos (id, titulo, url_recurso, url_form) VALUES (1, 'Curso de Seguridad', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'TU_LINK_DE_GOOGLE_FORMS_AQUI')");
    db.run("INSERT OR IGNORE INTO asignaciones (id_usuario, id_curso) VALUES ('2887', 1)");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const CLAVE_SECRETA = "MI_CLAVE_SECRETA_123";

// Ruta Login
app.post('/login', (req, res) => {
    const { nomina } = req.body;
    db.get('SELECT * FROM usuarios WHERE nomina = ?', [nomina], (err, user) => {
        if (!user) return res.status(401).send('<h2>Nómina no encontrada.</h2><br><a href="/">Volver</a>');
        
        const query = `SELECT c.id, c.titulo, r.aprobado FROM cursos c 
                       JOIN asignaciones a ON c.id = a.id_curso 
                       LEFT JOIN resultados r ON c.id = r.id_evaluacion AND r.id_usuario = ? 
                       WHERE a.id_usuario = ?`;
        
        db.all(query, [nomina, nomina], (err, cursos) => {
            let html = `<h1>Bienvenido, ${user.nombre}</h1><ul>`;
            cursos.forEach(c => {
                const esAprobado = c.aprobado === 1;
                html += `<li><b>${c.titulo}</b> <br>
                    <a href="/ver-curso?id=${c.id}"><button style="background:${esAprobado ? '#27ae60' : '#2980b9'}; color:white; padding:10px;">${esAprobado ? 'APROBADO' : 'Ver Contenido'}</button></a>
                </li><br>`;
            });
            res.send(html + `<hr><a href="/">Salir</a>`);
        });
    });
});

// Ruta Ver Curso
app.get('/ver-curso', (req, res) => {
    db.get('SELECT * FROM cursos WHERE id = ?', [req.query.id], (err, curso) => {
        res.send(`<h1>${curso.titulo}</h1><iframe src="${curso.url_recurso}" width="100%" height="400px"></iframe><br>
                  <a href="${curso.url_form}" target="_blank"><button style="padding:15px; background:orange; color:white;">REALIZAR EXAMEN</button></a>`);
    });
});

// Ruta Aprobación Automática
app.post('/marcar-aprobado', (req, res) => {
    const { nomina, id_evaluacion, token } = req.body;
    if (token !== CLAVE_SECRETA) return res.status(403).send("No autorizado");
    db.run('INSERT OR REPLACE INTO resultados (id_usuario, id_evaluacion, aprobado) VALUES (?, ?, 1)', [nomina, id_evaluacion], () => {
        res.send("Aprobado");
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor en puerto ${port}`));