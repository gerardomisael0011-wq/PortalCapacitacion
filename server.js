const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const CLAVE_SECRETA = "MI_CLAVE_SECRETA_123"; 

// --- LOGIN Y CONSULTA DE CURSOS ---
app.post('/login', (req, res) => {
    const { nomina } = req.body;
    db.get('SELECT * FROM usuarios WHERE nomina = ?', [nomina], (err, user) => {
        if (err || !user) return res.status(401).send('<h2>Nómina no encontrada.</h2><br><a href="/">Volver</a>');

        const query = `
            SELECT c.id, c.titulo, r.aprobado 
            FROM cursos c
            JOIN asignaciones a ON c.id = a.id_curso
            LEFT JOIN resultados r ON c.id = r.id_evaluacion AND r.id_usuario = ?
            WHERE a.id_usuario = ?
        `;

        db.all(query, [nomina, nomina], (err, cursos) => {
            if (err) return res.status(500).send("Error al consultar cursos");

            let html = `<h1>Bienvenido, ${user.nombre || nomina}</h1><h3>Tus cursos:</h3><ul>`;
            cursos.forEach(c => {
                const esAprobado = c.aprobado === 1;
                const color = esAprobado ? "#27ae60" : "#c0392b";
                const textoBtn = esAprobado ? "APROBADO" : "Ver Contenido";
                const estadoAttr = esAprobado ? "disabled style='cursor:not-allowed;'" : "";

                html += `<li><b>${c.titulo}</b> <br>
                    <a href="/ver-curso?id=${c.id}"><button ${estadoAttr} style="background:${color}; color:white; border:none; padding:8px 15px;">${textoBtn}</button></a>
                </li><br>`;
            });
            res.send(html + `<hr><a href="/">Salir</a>`);
        });
    });
});

// --- VER CURSO (CON TU URL INTEGRADA) ---
app.get('/ver-curso', (req, res) => {
    const cursoId = req.query.id;
    db.get('SELECT * FROM cursos WHERE id = ?', [cursoId], (err, curso) => {
        if (err || !curso) return res.send("Curso no encontrado.");
        
        // Uso de tu link por defecto si no está en la base de datos
        const linkExamen = curso.url_form || "https://forms.gle/7NAELfw9qsudwxkj8";

        res.send(`
            <div style="font-family: Arial; padding: 20px;">
                <h1>${curso.titulo}</h1>
                <iframe src="${curso.url_recurso}" width="100%" height="500px"></iframe>
                <hr>
                <a href="${linkExamen}" target="_blank">
                    <button style="padding: 15px 30px; background-color: #2980b9; color: white; border: none; border-radius: 5px;">
                        REALIZAR EXAMEN (GOOGLE FORMS)
                    </button>
                </a>
                <br><br><a href="/">Volver</a>
            </div>
        `);
    });
});

// --- RUTA QUE RECIBE EL AVISO DE GOOGLE FORMS ---
app.post('/marcar-aprobado', (req, res) => {
    const { nomina, id_evaluacion, token } = req.body;
    if (token !== CLAVE_SECRETA) return res.status(403).send("Token inválido");

    db.run('INSERT OR REPLACE INTO resultados (id_usuario, id_evaluacion, aprobado) VALUES (?, ?, 1)', 
    [nomina, id_evaluacion], (err) => {
        if (err) return res.status(500).send("Error BD");
        res.send("Aprobado correctamente");
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor iniciado en puerto ${port}`));