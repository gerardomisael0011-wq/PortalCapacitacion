const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const CLAVE_SECRETA = "MI_CLAVE_SECRETA_123"; 

app.post('/login', (req, res) => {
    const { nomina } = req.body;
    db.get('SELECT * FROM usuarios WHERE nomina = ?', [nomina], (err, user) => {
        if (!user) return res.send('<h2>Nómina no encontrada.</h2><br><a href="/">Volver</a>');

        const query = `
            SELECT e.id, e.titulo, e.url_form, r.aprobado 
            FROM evaluaciones e
            LEFT JOIN resultados r ON e.id = r.id_evaluacion AND r.id_usuario = ?
        `;

        db.all(query, [nomina], (err, evaluaciones) => {
            let html = `<h1>Bienvenido, ${user.nombre}</h1><h3>Estado de Evaluaciones:</h3><ul>`;
            
            evaluaciones.forEach(ev => {
                let esAprobado = ev.aprobado === 1;
                let color = esAprobado ? "green" : "red";
                let texto = esAprobado ? "APROBADO" : "PENDIENTE";
                
                html += `<li style="color: ${color}; margin-bottom: 10px;">
                    <b>${ev.titulo}</b> - ${texto}
                    ${!esAprobado ? `<br><a href="${ev.url_form}" target="_blank"><button>Realizar</button></a>` : ""}
                </li>`;
            });

            html += `</ul><br><a href="/">Salir</a>`;
            res.send(html);
        });
    });
});

app.post('/marcar-aprobado', (req, res) => {
    const { nomina, id_evaluacion, token } = req.body;
    if (token !== CLAVE_SECRETA) return res.status(403).send("Token inválido");

    db.run('INSERT INTO resultados (id_usuario, id_evaluacion, aprobado) VALUES (?, ?, 1)', 
    [nomina, id_evaluacion], (err) => {
        if (err) return res.status(500).send("Error en BD");
        res.send("Registrado");
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Servidor activo en puerto ' + port));