const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./empresa_v2.db');

// Configuración inicial de tablas
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS usuarios (nomina TEXT PRIMARY KEY, nombre TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS cursos (id INTEGER PRIMARY KEY, titulo TEXT, categoria TEXT, tipo_contenido TEXT, url_recurso TEXT, url_form TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS asignaciones (id_usuario TEXT, id_curso INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS resultados (id_usuario TEXT, id_evaluacion INTEGER, aprobado INTEGER, PRIMARY KEY(id_usuario, id_evaluacion))");

    // Inserción de cursos base con sus categorías
    db.run("INSERT OR REPLACE INTO cursos VALUES (1, 'Curso de Seguridad', 'Seguridad', 'video', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://forms.gle/jPLf2fcevrjqAGs1A')");
    db.run("INSERT OR REPLACE INTO cursos VALUES (2, 'Manual de Procesos', 'Operaciones', 'pdf', 'https://www.africau.edu/images/default/sample.pdf', 'https://forms.gle/jPLf2fcevrjqAGs1A')");
    db.run("INSERT OR REPLACE INTO cursos VALUES (3, 'Presentación ISO', 'Calidad', 'presentacion', 'https://docs.google.com/presentation/d/e/2PACX-1vQ/embed', 'https://forms.gle/jPLf2fcevrjqAGs1A')");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const CLAVE_SECRETA = "MI_CLAVE_SECRETA_123";

// Ruta raíz (Login HTML)
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Portal de Capacitación - Johnan</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #f4f7f6; margin:0;">
        <div class="card" style="text-align: center; width: 350px; padding: 30px; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <img src="/logo_johnan.png" alt="Logo" style="width: 120px; margin-bottom: 20px;" onerror="this.style.display='none'">
            <h2 style="color: #0033a0; margin-bottom: 20px;">Portal de Capacitación</h2>
            <form action="/login" method="POST" style="display: flex; flex-direction: column; gap: 15px;">
                <input type="text" name="nomina" placeholder="Ingrese su Nómina (ej. 2887)" required style="padding: 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 16px;">
                <button type="submit" style="padding: 12px; background: #0033a0; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; font-weight: bold;">Ingresar</button>
            </form>
        </div>
    </body>
    </html>
    `);
});

// Ruta de Login (POST) con renderizado directo de nombre y datos
app.post('/login', (req, res) => {
    const nomina = req.body.nomina ? req.body.nomina.trim() : '';
    if (!nomina) return res.redirect('/');

    // Definición directa del nombre según la nómina ingresada
    const nombreMostrar = nomina === '2887' ? 'Gerardo Misael Romero Aguilar' : `Colaborador Nómina ${nomina}`;
    const nominaMostrar = nomina;
    const fotoPath = `/fotos/${nominaMostrar}.png`;

    // Guardamos/actualizamos el usuario de forma segura en segundo plano
    db.run('INSERT OR REPLACE INTO usuarios (nomina, nombre) VALUES (?, ?)', [nominaMostrar, nombreMostrar], () => {
        db.run('INSERT OR IGNORE INTO asignaciones (id_usuario, id_curso) VALUES (?, 1), (?, 2), (?, 3)', [nominaMostrar, nominaMostrar, nominaMostrar], () => {
            
            const query = `SELECT c.id, c.titulo, c.categoria, r.aprobado FROM cursos c 
                            JOIN asignaciones a ON c.id = a.id_curso 
                            LEFT JOIN resultados r ON c.id = r.id_evaluacion AND r.id_usuario = ? 
                            WHERE a.id_usuario = ? 
                            ORDER BY c.categoria`;
            
            db.all(query, [nominaMostrar, nominaMostrar], (err, cursos) => {
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
                                <p style="margin:0; font-weight:bold; font-size: 14px;">${nombreMostrar}</p>
                                <p style="margin:0; font-size: 11px; color: #666;">Nómina: ${nominaMostrar}</p>
                            </div>
                            <img src="${fotoPath}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;" onerror="this.src='/logo_johnan.png'">
                        </div>
                    </div>

                    <div class="card" style="margin-top: 20px;">
                        <h1>Sus Cursos</h1>`;
                
                let categoriaActual = "";
                cursos.forEach(c => {
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
                
                res.send(html + `</div><br><a href="/" style="color:#0033a0; font-weight:bold;">Cerrar Sesión</a></div></body></html>`);
            });
        });
    });
});

// Ruta para ver el curso (Visualizador Inteligente)
app.get('/ver-curso', (req, res) => {
    db.get('SELECT * FROM cursos WHERE id = ?', [req.query.id], (err, c) => {
        if (!c) return res.send("Curso no encontrado");
        
        let contenidoHtml = "";

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