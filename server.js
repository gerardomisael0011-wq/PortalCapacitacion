const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./empresa_v2.db');

// Configuración inicial de tablas
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS usuarios (nomina TEXT PRIMARY KEY, nombre TEXT)");
    
    // Tabla con columna 'categoria' y 'tipo_contenido' para la lógica inteligente
    db.run("CREATE TABLE IF NOT EXISTS cursos (id INTEGER PRIMARY KEY, titulo TEXT, categoria TEXT, tipo_contenido TEXT, url_recurso TEXT, url_form TEXT)");
    
    db.run("CREATE TABLE IF NOT EXISTS asignaciones (id_usuario TEXT, id_curso INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS resultados (id_usuario TEXT, id_evaluacion INTEGER, aprobado INTEGER, PRIMARY KEY(id_usuario, id_evaluacion))");

    // Inserción de cursos con su categoría y tipo de contenido
    db.run("INSERT OR REPLACE INTO cursos VALUES (1, 'Curso de Seguridad', 'Seguridad', 'video', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://forms.gle/jPLf2fcevrjqAGs1A')");
    db.run("INSERT OR REPLACE INTO cursos VALUES (2, 'Manual de Procesos', 'Operaciones', 'pdf', 'https://www.africau.edu/images/default/sample.pdf', 'https://forms.gle/jPLf2fcevrjqAGs1A')");
    db.run("INSERT OR REPLACE INTO cursos VALUES (3, 'Presentación ISO', 'Calidad', 'presentacion', 'https://docs.google.com/presentation/d/e/2PACX-1vQ/embed', 'https://forms.gle/jPLf2fcevrjqAGs1A')");

    // Inserción de usuario predeterminado
    db.run("INSERT OR REPLACE INTO usuarios (nomina, nombre) VALUES ('2887', 'Gerardo Misael Romero Aguilar')");
    db.run("INSERT OR IGNORE INTO asignaciones (id_usuario, id_curso) VALUES ('2887', 1), ('2887', 2), ('2887', 3)");
});

// CORRECCIÓN CRÍTICA: Se añade urlencoded para poder leer los inputs del formulario POST de login
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const CLAVE_SECRETA = "MI_CLAVE_SECRETA_123";

// Ruta opcional GET por si entran directo a la raíz (muestra un formulario de acceso rápido si no tienen index.html)
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head><link rel="stylesheet" href="style.css"><meta charset="UTF-8"><title>Login</title></head>
    <body style="display:flex; justify-content:center; align-items:center; height:100vh; background:#f4f7f6;">
        <div class="card" style="text-align:center; padding:30px; background:white; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
            <h2 style="color:#0033a0;">Portal de Capacitación</h2>
            <form action="/login" method="POST" style="display:flex; flex-direction:column; gap:15px; margin-top:20px;">
                <input type="text" name="nomina" placeholder="Ingrese su Nómina" required style="padding:10px; border:1px solid #ccc; border-radius:5px;">
                <button type="submit" style="padding:10px; background:#0033a0; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">Ingresar</button>
            </form>
        </div>
    </body>
    </html>`);
});

// Ruta de Login (POST) optimizada para aceptar cualquier nómina al vuelo sin bloquear
app.post('/login', (req, res) => {
    const nomina = req.body.nomina ? req.body.nomina.trim() : '';
    if (!nomina) return res.redirect('/');

    db.get('SELECT * FROM usuarios WHERE nomina = ?', [nomina], (err, user) => {
        
        const renderizarPanel = (userData) => {
            const fotoPath = `/fotos/${nomina}.png`;

            // Consulta que agrupa por categoría
            const query = `SELECT c.id, c.titulo, c.categoria, r.aprobado FROM cursos c 
                            JOIN asignaciones a ON c.id = a.id_curso 
                            LEFT JOIN resultados r ON c.id = r.id_evaluacion AND r.id_usuario = ? 
                            WHERE a.id_usuario = ? 
                            ORDER BY c.categoria`;
            
            db.all(query, [nomina, nomina], (err, cursos) => {
                let html = `
                <!DOCTYPE html>
                <html>
                <head><link rel="stylesheet" href="style.css"></head>
                <body>
                    <header class="header-johnan">
                        <img src="/logo_johnan.png" alt="Logo">
                        <strong>Johnan de México</strong>
                    </header>

                    <div style="position: fixed; top: 10px; right: 20px; z-index: 1001; background: white; padding: 8px 15px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: right;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="text-align: right;">
                                <p style="margin:0; font-weight:bold; font-size: 14px;">${userData.nombre}</p>
                                <p style="margin:0; font-size: 11px; color: #666;">Nómina: ${userData.nomina}</p>
                            </div>
                            <img src="${fotoPath}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;" onerror="this.src='/logo_johnan.png'">
                        </div>
                    </div>

                    <div class="card" style="margin-top: 20px;">
                        <h1>Sus Cursos</h1>`;
                
                let categoriaActual = "";
                cursos.forEach(c => {
                    // Genera el título de la sección al cambiar de categoría
                    if (c.categoria !== categoriaActual) {
                        categoriaActual = c.categoria;
                        html += `<h2 style="text-align: left; color: #0033a0; margin-top: 30px; border-bottom: 2px solid #0033a0; padding-bottom: 5px;">${categoriaActual}</h2>`;
                    }

                    const esAprobado = (c.aprobado === 1);
                    html += `<div class="li-item" style="margin-bottom: 10px;">
                        <strong>${c.titulo}</strong>
                        <button class="${esAprobado ? 'btn-approved' : 'btn-pending'}" 
                            onclick="${esAprobado ? 'void(0)' : 'window.location.href=\'/ver-curso?id=' + c.id + '\''}">
                            ${esAprobado ? '✓ Aprobado' : 'Ver Contenido'}
                        </button>
                    </div>`;
                });
                
                res.send(html + `</div><br><a href="/" style="color:#0033a0;">Cerrar Sesión</a></div></body></html>`);
            });
        };

        if (!user) {
            // Si la nómina no existe, la registramos automáticamente para que no te vuelva a bloquear
            const nombreNuevo = nomina === '2887' ? 'Gerardo Misael Romero Aguilar' : `Colaborador Nómina ${nomina}`;
            db.run('INSERT INTO usuarios (nomina, nombre) VALUES (?, ?)', [nomina, nombreNuevo], () => {
                db.run('INSERT OR IGNORE INTO asignaciones (id_usuario, id_curso) VALUES (?, 1), (?, 2), (?, 3)', [nomina, nomina, nomina], () => {
                    renderizarPanel({ nomina, nombre: nombreNuevo });
                });
            });
        } else {
            // Aseguramos que tenga sus cursos asignados
            db.run('INSERT OR IGNORE INTO asignaciones (id_usuario, id_curso) VALUES (?, 1), (?, 2), (?, 3)', [nomina, nomina, nomina], () => {
                renderizarPanel(user);
            });
        }
    });
});

// Ruta para ver el curso (Visualizador Inteligente)
app.get('/ver-curso', (req, res) => {
    db.get('SELECT * FROM cursos WHERE id = ?', [req.query.id], (err, c) => {
        if (!c) return res.send("Curso no encontrado");
        
        let contenidoHtml = "";

        // Lógica según el tipo de contenido
        if (c.tipo_contenido === 'video') {
            contenidoHtml = `<iframe src="${c.url_recurso}" width="100%" height="400px" frameborder="0" allowfullscreen></iframe>`;
        } else if (c.tipo_contenido === 'presentacion') {
            contenidoHtml = `<iframe src="${c.url_recurso}" width="100%" height="400px" frameborder="0"></iframe>`;
        } else if (c.tipo_contenido === 'pdf') {
            contenidoHtml = `<embed src="${c.url_recurso}" width="100%" height="600px" type="application/pdf">`;
        } else {
            contenidoHtml = `<a href="${c.url_recurso}" target="_blank">Abrir material en una ventana nueva</a>`;
        }

        res.send(`
        <!DOCTYPE html>
        <html>
        <head><link rel="stylesheet" href="style.css"></head>
        <body>
            <div class="card">
                <h1>${c.titulo}</h1>
                ${contenidoHtml}
                <br><br>
                <a href="${c.url_form}" target="_blank" class="btn-primary" style="color:#0033a0; font-weight:bold;">ABRIR EXAMEN</a>
                <br><br>
                <a href="/">Volver al panel</a>
            </div>
        </body>
        </html>`);
    });
});

app.post('/marcar-aprobado', (req, res) => {
    const { nomina, id_evaluacion, token } = req.body;
    if (token !== CLAVE_SECRETA) return res.status(403).send("No autorizado");
    db.run('INSERT OR REPLACE INTO resultados (id_usuario, id_evaluacion, aprobado) VALUES (?, ?, 1)', 
        [nomina, id_evaluacion], () => res.send("OK"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor activo en puerto ${port}`));
