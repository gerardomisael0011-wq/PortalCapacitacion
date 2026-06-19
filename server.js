const express = require('express');
const bodyParser = require('body-parser'); // Importante agregar esto
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./empresa_v2.db');

// Configuración inicial de tablas
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS usuarios (nomina TEXT PRIMARY KEY, nombre TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS cursos (id INTEGER PRIMARY KEY, titulo TEXT, url_recurso TEXT, url_form TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS asignaciones (id_usuario TEXT, id_curso INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS resultados (id_usuario TEXT, id_evaluacion INTEGER, aprobado INTEGER, PRIMARY KEY(id_usuario, id_evaluacion))");
    
    db.run("REPLACE INTO cursos (id, titulo, url_recurso, url_form) VALUES (1, 'Curso de Seguridad', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://forms.gle/jPLf2fcevrjqAGs1A')");
    db.run("INSERT OR IGNORE INTO usuarios (nomina, nombre) VALUES ('2887', 'Usuario Prueba')");
    db.run("INSERT OR IGNORE INTO asignaciones (id_usuario, id_curso) VALUES ('2887', 1)");
});

app.use(bodyParser.json());
app.use(express.static('public'));

const CLAVE_SECRETA = "MI_CLAVE_SECRETA_123";

// Ruta de Login
app.post('/login', (req, res) => {
    const { nomina } = req.body;
    db.get('SELECT * FROM usuarios WHERE nomina = ?', [nomina], (err, user) => {
        if (!user) return res.status(401).send('<h2>Nómina no encontrada.</h2>');
        
        const query = `SELECT c.id, c.titulo, r.aprobado FROM cursos c 
                       JOIN asignaciones a ON c.id = a.id_curso 
                       LEFT JOIN resultados r ON c.id = r.id_evaluacion AND r.id_usuario = ? 
                       WHERE a.id_usuario = ?`;
        
        // ... dentro de app.post('/login') en server.js ...
        db.all(query, [nomina, nomina], (err, cursos) => {
            // Texto más corporativo y sin el título de "Bienvenido" que ya está arriba.
            let html = `<h1>Sus Cursos</h1><p>Panel de asignaciones:</p><ul>`;
            cursos.forEach(c => {
                const esAprobado = (c.aprobado === 1);
                html += `<li>
                    <b>${c.titulo}</b>
                    <button class="${esAprobado ? 'btn-approved' : 'btn-pending'}" 
                        onclick="${esAprobado ? 'void(0)' : 'window.location.href=\'/ver-curso?id=' + c.id + '\''}">
                        ${esAprobado ? '✓ Aprobado' : 'Ver Contenido'}
                    </button>
                </li>`;
            });
            res.send(html + `</ul><br><a href="/" style="color:var(--primary-blue)">Cerrar Sesión</a>`);
        });
    });
});

// Ruta para ver el curso
app.get('/ver-curso', (req, res) => {
    db.get('SELECT * FROM cursos WHERE id = ?', [req.query.id], (err, c) => {
        if (!c) return res.send("Curso no encontrado");
        // Nota: Esta respuesta debe ser un HTML completo o ajustarse al div.card existente
        res.send(`<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head>
                  <body><div class="card"><h1>${c.titulo}</h1>
                  <iframe src="${c.url_recurso}" width="100%" height="300px" style="border:none;"></iframe>
                  <p>Al terminar, envía tu examen:</p>
                  <a href="${c.url_form}" target="_blank">ABRIR EXAMEN</a>
                  <br><br><a href="/">Volver</a></div></body></html>`);
    });
});

app.post('/marcar-aprobado', (req, res) => {
    const { nomina, id_evaluacion, token } = req.body;
    if (token !== CLAVE_SECRETA) return res.status(403).send("No autorizado");
    db.run('INSERT OR REPLACE INTO resultados (id_usuario, id_evaluacion, aprobado) VALUES (?, ?, 1)', 
        [nomina, id_evaluacion], () => res.send("OK"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor activo`));