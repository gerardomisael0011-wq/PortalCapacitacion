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
    
    // Validamos si la nómina existe
    db.get('SELECT * FROM usuarios WHERE nomina = ?', [nomina], (err, user) => {
        if (err || !user) {
            return res.status(401).send('<h2>Nómina no encontrada.</h2><br><a href="/">Volver</a>');
        }

        // Consultamos evaluaciones y el estado del usuario
        const query = `
            SELECT e.id, e.titulo, e.url_form, r.aprobado 
            FROM evaluaciones e
            LEFT JOIN resultados r ON e.id = r.id_evaluacion AND r.id_usuario = ?
        `;

        db.all(query, [nomina], (err, evaluaciones) => {
            if (err) return res.status(500).send("Error al consultar evaluaciones");

            let html = `<h1>Bienvenido, ${user.nombre || nomina}</h1><h3>Estado de Evaluaciones:</h3><ul>`;
            
            evaluaciones.forEach(ev => {
                let esAprobado = ev.aprobado === 1;
                let color = esAprobado ? "green" : "red";
                let texto = esAprobado ? "APROBADO" : "PENDIENTE";
                
                html += `<li style="color: ${color}; margin-bottom: 15px;">
                    <b>${ev.titulo}</b> - ${texto}
                    ${!esAprobado ? `<br><a href="${ev.url_form}" target="_blank"><button style="cursor:pointer; background:#3498db; color:white; border:none; padding:5px 10px; border-radius:4px;">Realizar Evaluación</button></a>` : ""}
                </li>`;
            });

            html += `</ul><br><hr><a href="/">Salir</a>`;
            res.send(html);
        });
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