const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// --- CONFIGURACIÓN DE BASE DE DATOS ---
// Se crea la base de datos en memoria o archivo
const db = new sqlite3.Database('./empresa_v2.db');

// Crear tablas y datos iniciales automáticamente al arrancar
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS usuarios (nomina TEXT PRIMARY KEY, nombre TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS cursos (id INTEGER PRIMARY KEY, titulo TEXT, url_recurso TEXT, url_form TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS asignaciones (id_usuario TEXT, id_curso INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS resultados (id_usuario TEXT, id_evaluacion INTEGER, aprobado INTEGER, PRIMARY KEY(id_usuario, id_evaluacion))");
    
    // Inserta usuarios de prueba si no existen
    db.run("INSERT OR IGNORE INTO usuarios (nomina, nombre) VALUES ('2887', 'Usuario Prueba')");
    db.run("INSERT OR IGNORE INTO usuarios (nomina, nombre) VALUES ('1102', 'Empleado Ejemplo')");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const CLAVE_SECRETA = "MI_CLAVE_SECRETA_123";

// --- RUTAS DEL SERVIDOR ---

// Login
app.post('/login', (req, res) => {
    const { nomina } = req.body;
    db.get('SELECT * FROM usuarios WHERE nomina = ?', [nomina], (err, user) => {
        if (err || !user) return res.status(401).send('<h2>Nómina no encontrada en el sistema.</h2><br><a href="/">Volver</a>');

        const query = `SELECT c.id, c.titulo, r.aprobado FROM cursos c 
                       JOIN asignaciones a ON c.id = a.id_curso 
                       LEFT JOIN resultados r ON c.id = r.id_evaluacion AND r.id_usuario = ? 
                       WHERE a.id_usuario = ?`;

        db.all(query, [nomina, nomina], (err, cursos) => {
            if (err) return res.status(500).send("Error al consultar cursos.");
            
            let html = `<h1>Bienvenido, ${user.nombre}</h1><h3>Tus cursos asignados:</h3><ul>`;
            cursos.forEach(c => {
                const esAprobado = c.aprobado === 1;
                html += `<li><b>${c.titulo}</b> <br>
                    <a href="/ver-curso?id=${c.id}">
                        <button style="padding:10px 20px; background-color:${esAprobado ? '#27ae60' : '#2980b9'}; color:white; border:none; cursor:${esAprobado ? 'default' : 'pointer'}">
                            ${esAprobado ? 'APROBADO' : 'Ver Contenido / Examen'}
                        </button>
                    </a>
                </li><br>`;
            });
            res.send(html + `<hr><a href="/">Salir</a>`);
        });
    });
});

// Ver Contenido
app.get('/ver-curso', (req, res) => {
    db.get('SELECT * FROM cursos WHERE id = ?', [req.query.id], (err, curso) => {
        if (err || !curso) return res.send("Curso no encontrado.");
        res.send(`
            <div style="font-family: sans-serif; padding: 20px;">
                <h1>${curso.titulo}</h1>
                <iframe src="${curso.url_recurso}" width="100%" height="500px"></iframe>
                <hr>
                <a href="${curso.url_form || 'https://forms.gle/7NAELfw9qsudwxkj8'}" target="_blank">
                    <button style="padding: 15px 30px; background-color: #e67e22; color: white; border: none; font-size: 16px;">
                        REALIZAR EXAMEN (GOOGLE FORMS)
                    </button>
                </a>
                <br><br><a href="javascript:history.back()">Volver a mis cursos</a>
            </div>
        `);
    });
});

// Recepción de Aprobación desde Google Forms
app.post('/marcar-aprobado', (req, res) => {
    const { nomina, id_evaluacion, token } = req.body;
    if (token !== CLAVE_SECRETA) return res.status(403).send("Token inválido");

    db.run('INSERT OR REPLACE INTO resultados (id_usuario, id_evaluacion, aprobado) VALUES (?, ?, 1)', 
    [nomina, id_evaluacion], (err) => {
        if (err) return res.status(500).send("Error al guardar en BD");
        res.send("Aprobado correctamente");
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor activo en el puerto ${port}`));