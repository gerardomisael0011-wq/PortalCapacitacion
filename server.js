const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();

// Middleware para entender formularios y datos JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Clave secreta para que Google Forms pueda enviar resultados de forma segura
const CLAVE_SECRETA = "MI_CLAVE_SECRETA_123"; 

app.post('/login', (req, res) => {
    const { nomina } = req.body;
    db.get('SELECT * FROM usuarios WHERE nomina = ?', [nomina], (err, user) => {
        if (!user) return res.send('Nómina no encontrada. <a href="/">Volver</a>');

        // La consulta ahora incluye 'url_form' para ser dinámica
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
                let textoEstado = esAprobado ? "APROBADO" : "PENDIENTE";
                
                html += `<li style="color: ${color}; margin-bottom: 10px;">
                    <b>${ev.titulo}</b> - ${textoEstado}
                    ${!esAprobado ? `
                        <div style="margin-top:5px;">
                            <a href="${ev.url_form}" target="_blank">
                                <button style="cursor:pointer;">Realizar Evaluación</button>
                            </a>
                        </div>` : ""}
                </li>`;
            });

            html += `</ul><br><a href="/">Salir</a>`;
            res.send(html);
        });
    });
});

// Endpoint que recibirá la notificación automática desde Google Forms
app.post('/marcar-aprobado', (req, res) => {
    const { nomina, id_evaluacion, token } = req.body;
    
    if (token !== CLAVE_SECRETA) {
        return res.status(403).send("Acceso denegado: Token inválido");
    }

    db.run('INSERT INTO resultados (id_usuario, id_evaluacion, aprobado) VALUES (?, ?, 1)', 
    [nomina, id_evaluacion], (err) => {
        if (err) return res.status(500).send("Error al guardar en BD: " + err.message);
        res.send("Evaluación registrada exitosamente.");
    });
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));