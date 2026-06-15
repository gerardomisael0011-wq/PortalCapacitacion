const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const CLAVE_SECRETA = "MI_CLAVE_SECRETA_123"; 

// Ruta principal para validar usuario
app.post('/login', (req, res) => {
    const { nomina } = req.body;
    
    db.get('SELECT * FROM usuarios WHERE nomina = ?', [nomina], (err, user) => {
        if (err || !user) {
            return res.status(401).send('<h2>Nómina no encontrada.</h2><br><a href="/">Volver</a>');
        }

        // Consultamos cursos asignados (asumiendo que en el futuro los ligaremos a cursos)
        const query = `
            SELECT id, titulo, 'PENDIENTE' as estado 
            FROM cursos
        `;

        db.all(query, [], (err, cursos) => {
            if (err) return res.status(500).send("Error al consultar cursos");

            let html = `<h1>Bienvenido, ${user.nombre || nomina}</h1><h3>Tus cursos asignados:</h3><ul>`;
            
            cursos.forEach(c => {
                html += `<li style="margin-bottom: 15px;">
                    <b>${c.titulo}</b> 
                    <br>
                    <a href="/ver-curso?id=${c.id}"><button style="cursor:pointer; background:#3498db; color:white; border:none; padding:5px 10px; border-radius:4px;">Ver Contenido</button></a>
                </li>`;
            });

            html += `</ul><br><hr><a href="/">Salir</a>`;
            res.send(html);
        });
    });
});

// NUEVA RUTA: Renderizador Universal de Cursos
app.get('/ver-curso', (req, res) => {
    const cursoId = req.query.id;
    
    db.get('SELECT * FROM cursos WHERE id = ?', [cursoId], (err, curso) => {
        if (err || !curso) return res.send("Curso no encontrado.");

        let contenidoHtml = "";

        // Lógica "Camaleónica": El servidor detecta el tipo y decide cómo mostrarlo
        if (curso.tipo_contenido === 'video') {
            contenidoHtml = `<iframe width="100%" height="500" src="${curso.url_recurso}" frameborder="0" allowfullscreen></iframe>`;
        } else if (curso.tipo_contenido === 'pdf') {
            contenidoHtml = `<iframe src="${curso.url_recurso}" width="100%" height="600px"></iframe>`;
        } else {
            contenidoHtml = `<p>Recurso: <a href="${curso.url_recurso}" target="_blank">Abrir material aquí</a></p>`;
        }

        res.send(`
            <div style="font-family: Arial; padding: 20px;">
                <h1>${curso.titulo}</h1>
                <p>${curso.descripcion}</p>
                <div style="margin: 20px 0;">${contenidoHtml}</div>
                <hr>
                <a href="${curso.url_form}" target="_blank">
                    <button style="padding: 15px 30px; font-size: 18px; cursor:pointer; background-color: #27ae60; color: white; border: none; border-radius: 5px;">
                        REALIZAR EXAMEN (GOOGLE FORMS)
                    </button>
                </a>
                <br><br>
                <a href="/">Volver al inicio</a>
            </div>
        `);
    });
});

// Endpoint para Google Apps Script
app.post('/marcar-aprobado', (req, res) => {
    const { nomina, id_evaluacion, token } = req.body;
    
    if (token !== CLAVE_SECRETA) {
        return res.status(403).send("Acceso denegado: Token inválido");
    }

    db.run('INSERT OR REPLACE INTO resultados (id_usuario, id_evaluacion, aprobado) VALUES (?, ?, 1)', 
    [nomina, id_evaluacion], (err) => {
        if (err) return res.status(500).send("Error al guardar en BD");
        res.send("Evaluación registrada exitosamente.");
    });
});

// Puerto dinámico para Render
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor activo en puerto ${port}`);
});