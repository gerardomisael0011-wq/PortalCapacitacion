const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./empresa_v2.db');

// Diccionario completo de personal de Johnan de México
const nombresOficiales = {
    '1011': 'GILBERTO ABARCA DAMIAN',
    '1018': 'NORMA MARCELA GASCA NAVARRO',
    '1037': 'HECTOR CASTILLO  RAMIREZ',
    '1047': 'OLGA MORALES  ZAMILPA',
    '1051': 'ROSA ISELA RODRIGUEZ HERNANDEZ',
    '1102': 'ANGELICA DURAN  CORONADO',
    '1114': 'MARIA GUADALUPE  MENDOZA  GARCIA',
    '1126': 'CARRILLO HERRERA CAMILO',
    '1171': 'MARTHA ALICIA DIAZ SILVA',
    '1175': 'MARIA ANTONIA BARRON  MACHUCA',
    '1176': 'MARIA DEL ROCIO MOSQUEDA LEON',
    '1201': 'LETICIA MORALES  CARDENAS',
    '1277': 'MARIA ELENA AGUILAR  AGUILAR',
    '1283': 'MARIA GUADALUPE MOSQUEDA LEON',
    '1285': 'MARIA DE LA LUZ QUINTERO  CHAVEZ',
    '1311': 'MARIA JANET RIOS    NILA',
    '1315': 'RITA GABRIELA IBARRA  ALONSO',
    '1322': 'MARIA ELENA PATLAN  ESTRADA',
    '1325': 'ALMA ERIKA DIAZ  JARAMILLO',
    '1329': 'YOSHIKI ALEJANDRO YAMAMURA PEREZ',
    '1331': 'PATRICIA SARAI SERRANO  PEREZ',
    '1372': 'MARIA CRISTINA VALADEZ LUGO',
    '1386': 'JAIME FERNANDEZ CAUDILLO',
    '1390': 'JUAN MANUEL ARAUJO  LOPEZ',
    '1398': 'JULIO VAZQUEZ  GARCIA',
    '1401': 'MARIA CRISTINA GRANADOS  GOMEZ',
    '1414': 'ELISA NEGRETE   MACHUCA',
    '1419': 'LORENA DE LA LUZ ALFARO MENDEZ',
    '1469': 'JANET FERNANDEZ TORRES',
    '1470': 'MARIA ANGELICA  MORALES',
    '1473': 'MARIA ISABEL ARAUJO   RANGEL',
    '1476': 'MARCO ANTONIO VENEGAS GUTIERREZ',
    '1477': 'KARLA CECILIA GUTIERREZ FERNANDEZ',
    '1478': 'MARTHA CRISTAL TORREBLANCA CARMONA',
    '1482': 'NORMA MIRNA ABREO  VELAZQUEZ',
    '1486': 'BLANCA MARIA DE JESUS RIVERA  MORALES',
    '1508': 'DIAZ DIAZ MAYRA AZUCENA',
    '1541': 'JESUS RAFAEL LOPEZ MORALES',
    '1545': 'MARIELA ARAUJO  GARNICA',
    '1563': 'MARIA DE LOURDES ZEPEDA  HERNANDEZ',
    '1565': 'RAUL FERNANDEZ LARA',
    '1577': 'NAVARRO GOMEZ ROBERTO MARTIN',
    '1585': 'ESTELA VALDIVIA   LUGO',
    '1593': 'VERONICA ARREDONDO  LOPEZ',
    '1608': 'JUANA DELIA VAZQUEZ QUIJAS',
    '1621': 'MARIA GUADALUPE  QUIJAS CORDERO',
    '1648': 'NORMA ANGELICA HERNANDEZ  TETUAN',
    '1658': 'JOSE CRUZ BECERRA RAMIREZ',
    '1663': 'MARIA INES LOZANO LOZANO',
    '1670': 'ANDREA DE LA LUZ RAMIREZ  OLMEDO',
    '1688': 'AIDEE ADRIANA ARAUJO SANCHEZ',
    '1740': 'GRANADOS MENDOZA JORGE LUIS',
    '1760': 'MARIA GUADALUPE INFANTE ROCHA',
    '1783': 'NANCY JAZMIN ZAMARRIPA CARRETERO',
    '1881': 'ADRIANA MARIA MORALES  DIAZ',
    '1883': 'BERENICE LIZBETH LOPEZ RODRIGUEZ',
    '1884': 'VERONICA  HERNANDEZ  GUTIERREZ',
    '1927': 'ANAYELI TAPIA  ARRIAGA',
    '1934': 'DIANA ELIZABETH ORNELAS  VALDEZ',
    '1938': 'ANGELICA HERNANDEZ   ROMERO',
    '1946': 'MARIA DE LA LUZ  SANZON ORNELAS',
    '1960': 'SANDRA DELFINA RAMIREZ RAMIREZ',
    '2002': 'LETICIA CASTILLO  ARAUJO',
    '2022': 'MARIA ALEJANDRA LANDIN  PEREZ',
    '2034': 'SANDRA PAOLA CERVANTES CONTRERAS',
    '2035': 'FLORES ROCHA LUIS EDUARDO',
    '2076': 'ROSA ISABEL ESPINOZA SILVESTRE',
    '2078': 'REYNA ISABEL BONILLA CHAVEZ',
    '2087': 'DANIEL QUIROZ HERNANDEZ',
    '2093': 'MARIA GUADALUPE RAMIREZ HERNANDEZ',
    '2110': 'ANA LIDIA RANGEL   LOZANO',
    '2123': 'MARIA YULIANA LOPEZ MORALES',
    '2133': 'MARIA INES GONZALEZ  ESCAMILLA',
    '2148': 'VERONICA MAYTE JASSO BONILLA',
    '2149': 'JUAN LUIS TAVARES MONTES',
    '2162': 'ANDRES JAHIR ELIAS ESQUIVEL',
    '2187': 'XIMENA SARAI RAMOS VALDIVIA',
    '2247': 'LAURA PATRICIA ESCAMILLA VELAZQUEZ',
    '2254': 'LUCERO NEGRETE MACHUCA',
    '2255': 'SONIA MARITZA  MUNOZ RODRIGUEZ',
    '2259': 'MARCO ANTONIO RODRIGUEZ REYES',
    '2273': 'URRUTIA DIAZ JULIA ELENA',
    '2303': 'LUCERO ABIGAIL JARAMILLO JARAMILLO',
    '2306': 'IMELDA  NAVARRO HERNANDEZ',
    '2315': 'RIGOBERTO  MANZANO AGRIPINO',
    '2324': 'MARGARITA  LOPEZ  ANAYA',
    '2325': 'MARIA DEL CARMEN ESPINOZA LOPEZ',
    '2339': 'MARIA CRISTINA GONZALEZ PRADO',
    '2346': 'LAIZA NAYELI FERNANDEZ PEREZ',
    '2352': 'CHRISTIAN LORENA GOMEZ CASTILLO',
    '2353': 'MARTHA RAMIREZ RODRIGUEZ',
    '2367': 'JUAN JESUS AGUAYO RAMIREZ',
    '2372': 'GILBERTO  LOPEZ SEGOVIA',
    '2393': 'MARIA FERNANDA RODRIGUEZ PRECIADO',
    '2404': 'DAFNE ABIGAIL VALENTIN TORRES',
    '2459': 'SANJUANA  GARCIA ARAUJO',
    '2462': 'MARTHA GRISELDA ALONSO CABRERA',
    '2489': 'ANTONIO HERNANDEZ CASTRO',
    '2502': 'ANA PAULINA GONZALEZ GARCIA',
    '2508': 'JOSE JOEL  TORRES MORALES',
    '2525': 'LUZ REGINA GONZALEZ GARCIA',
    '2526': 'ALBA ARACELI SANCHEZ LOPEZ',
    '2529': 'PERLA LIZBETH  RODRIGUEZ  DIAZ',
    '2534': 'VICTORIA  PEREZ YEBRA',
    '2536': 'CRISTINA QUINTANA QUIJAS',
    '2543': 'JESUS ALFONSO OLVERA HIDALGO',
    '2548': 'HILDA ISELA  PONCE  GARCIA',
    '2550': 'NELI ALEXANDRA MAYA  PONCE',
    '2568': 'RAQUEL YANELI GONZALEZ GOMAR',
    '2569': 'SILVIA  DURAN ELIAS',
    '2585': 'MOLINA LOPEZ DULCE CRISTINA',
    '2591': 'MINERVA NEGRETE MACHUCA',
    '2595': 'BEBERLY ADRIANA  BASTIDA ROMERO',
    '2598': 'DAVID  ROJAS TORRES',
    '2599': 'DULCE MAYTE LOPEZ  RODRIGUEZ',
    '2605': 'JUAN ALFREDO VARGAS ZAVALA',
    '2618': 'MAYRA EDITH HERNANDEZ  RAMIREZ',
    '2626': 'LORENA NOEMI TORRES LOPEZ',
    '2627': 'MARIA GUADALUPE PEÑA NEGRETE',
    '2628': 'CAMARILLO ALCANTAR PAUL ERNESTO',
    '2630': 'NORMA MIREYA GUTIERREZ LOPEZ',
    '2640': 'PATRICIA  ANDRADE RAMIREZ',
    '2641': 'FRANCISCO GIOVANNI ORTEGA HERNANDEZ',
    '2643': 'MARTHA SARAI MIRANDA  NAVARRO',
    '2644': 'ADRIAN HERNANDEZ  GASCA',
    '2663': 'JESUS MARTIN MONTAÑEZ REA',
    '2683': 'GERARDO NAVA PEREZ',
    '2694': 'DULCE ITZEL DOMINGUEZ  GUERRERO',
    '2696': 'NORMA ERIKA ROCHA  ARANDA',
    '2699': 'RAYMUNDO ALEJANDRO CERVANTES VALDOVINOS',
    '2716': 'FERNANDO VAZQUEZ OROZCO',
    '2717': 'OWNA ARELY ALCALA LOPEZ',
    '2718': 'JOSE ALVARO FALCON GARCIA',
    '2719': 'SELENA CIRSTINA  RAMIREZ  RAMIREZ',
    '2721': 'PERLA MARLENE ROCHA PIÑA',
    '2724': 'ANA GABRIELA  RODRIGUEZ  MARTINEZ',
    '2725': 'MARIA CANDELARIA HERNANDEZ  CAMACHO',
    '2726': 'AMERICA LORELY LANDIN ELIAS',
    '2731': 'NANCY GERALDINE VIEYRA CASTILLO',
    '2734': 'OMAR  VARGAS ORTEGA',
    '2737': 'RAMIREZ HERNANDEZ ESMERALDA',
    '2738': 'ORTEGA MENDEZ PAULA IMELDA',
    '2739': 'JUAREZ HINOJOSA MARIANA PATRICIA',
    '2740': 'JORDAN IVAN GASCA ROJAS',
    '2744': 'JENNIFER VIOLETA LOZANO LOZANO',
    '2747': 'MURRIETA DUEÑAS ERIKA SELENA',
    '2748': 'REYNA GORETTI RAMIREZ GARCIA',
    '2750': 'RICARDO HOSSET LARA RIVAS',
    '2757': 'HIROKI SHIMIZU',
    '2760': 'BECERRA ALCANTAR JUANA',
    '2763': 'OLMOS AGUILERA FRANCISCO JAVIER',
    '2769': 'FERNANDEZ RODRIGUEZ TERESITA DE JESUS',
    '2770': 'BUSTAMANTE GUERRERO SANDRA',
    '2776': 'OLMOS BARRON FATIMA SOLEDAD',
    '2781': 'PEÑA NEGRETE BRENDA BERENICE',
    '2786': 'ORTIZ URBINA UBALDO ALEJANDRO',
    '2788': 'QUIJAS QUINTANA RICARDO',
    '2792': 'SALDAÑA MEZA MAYRA ALEJANDRA',
    '2793': 'CHAVEZ SOLANO EVELYN VIVIANA',
    '2798': 'RAMIREZ RODRIGUEZ LUCIA',
    '2801': 'VAZQUEZ FLORES MARICRUZ',
    '2804': 'JIMENEZ LOPEZ JOSE ALBERTO',
    '2815': 'MEZA CAUDILLO ROSARIO ADRIANA',
    '2816': 'MAEGUIBO DIEGO',
    '2821': 'NAKAJIMA TAKESHI',
    '2825': 'REYES GONZALEZ VALERIA ESTEFANIA',
    '2827': 'RODRIGUEZ CRUZ JOSE DANIEL',
    '2828': 'CHAVEZ ZERTUCHE ALEX MISAEL',
    '2835': 'RICO BUSTAMANTE ANA LIZBETH',
    '2837': 'VITAL RAMIREZ BRAULIO ADRIAN',
    '2838': 'COSS SANCHEZ ANGEL DANIEL',
    '2840': 'PEREZ NORBERTO TRISTAN ABEL',
    '2841': 'RAMIREZ TRUJILLO MARIA REYNA',
    '2843': 'MEJIA DIONICIO OSCAR',
    '2844': 'BONILLA DOMINGUEZ LUZ AIDA',
    '2846': 'MARTINEZ GONZALEZ DIANA GABRIELA',
    '2848': 'AGUIRRE MARTINEZ ALMA SOLEDAD',
    '2851': 'GOMEZ BELTRAN JUAN JOSE',
    '2852': 'MEXICANO SILVA MONTSERRAT VANESSA',
    '2855': 'REYNOSO GONZALEZ SAUL',
    '2861': 'MOSQUEDA TORRES MAYRA SOCORRO',
    '2862': 'BELTRAN HERNANDEZ FRANCISCO DAMIAN',
    '2863': 'TRUJILLO SALAZAR SERGIO',
    '2866': 'NAVA CANO JOHANA',
    '2867': 'REYES ZENDEJAS AIDE GUADALUPE',
    '2868': 'IBARRA GASPAR MARCO ANTONIO',
    '2869': 'SUNOHARA YUTAKA',
    '2871': 'ARRIAGA SUAREZ MARIA GUADALUPE',
    '2874': 'RODRIGUEZ ORTEGA SAUL ALEJANDRO',
    '2875': 'ZEPEDA ESTRADA KARINA LUCERO',
    '2876': 'FUENTES MUÑIZ MARIA GUADALUPE JANET',
    '2878': 'TORRES RAMIREZ VELICIA RUBI',
    '2881': 'BARRIENTOS RODRIGUEZ DIEGO SANTIAGO',
    '2882': 'NAVARRO LOPEZ MOISES',
    '2883': 'GUDINO IBARRA FATIMA',
    '2885': 'TORRES MAGAÑA JESSICA MONTSERRAT',
    '2886': 'MORENO AGUILAR HECTOR ANTONIO',
    '2887': 'ROMERO AGUILAR GERARDO MISAEL',
    '2888': 'SANCHEZ CASTRO ALVARO DANIEL',
    '2889': 'BUSTAMANTE GUERRERO KAROL RUBI',
    '2890': 'AGUILAR ANGUIANO GUADALUPE DEL ROCIO',
    '2891': 'HERNANDEZ CASTRO JAZMIN',
    '2893': 'ANGUIANO VAZQUEZ JOHAN JESUS',
    '2894': 'MARIN VILCHIS ANGELA EUGENIA',
    '2895': 'BONILLA SANCHEZ CRISTINA',
    '2896': 'LUNA HERNANDEZ MELISSA',
    '2897': 'GALVAN MARES FERNANDO'
};

// Configuración inicial de tablas
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS usuarios (nomina TEXT PRIMARY KEY, nombre TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS cursos (id INTEGER PRIMARY KEY, titulo TEXT, categoria TEXT, tipo_contenido TEXT, url_recurso TEXT, url_form TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS asignaciones (id_usuario TEXT, id_curso INTEGER)");
    db.run("CREATE TABLE IF NOT EXISTS resultados (id_usuario TEXT, id_evaluacion INTEGER, aprobado INTEGER, PRIMARY KEY(id_usuario, id_evaluacion))");

    // Inserción de cursos base (El curso 3 ahora es tipo 'video' con enlace de YouTube para pruebas)
    db.run("INSERT OR REPLACE INTO cursos VALUES (1, 'Curso de Seguridad', 'Seguridad', 'video', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://forms.gle/jPLf2fcevrjqAGs1A')");
    db.run("INSERT OR REPLACE INTO cursos VALUES (2, 'Manual de Procesos', 'Operaciones', 'pdf', 'https://www.africau.edu/images/default/sample.pdf', 'https://forms.gle/jPLf2fcevrjqAGs1A')");
    db.run("INSERT OR REPLACE INTO cursos VALUES (3, 'Capacitación de Calidad', 'Calidad', 'video', '/videos/calidad.mp4', 'https://forms.office.com/Pages/ResponsePage.aspx?id=64xBAHO6kUeKLjKiNVcFt_1hOd-Sn7JHtXT0dG_x6GNUN0lMU0VHTERZUTdNM1FYUURNMDIxOFpFSy4u')");
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

// Ruta de Login (POST)
app.post('/login', (req, res) => {
    const nomina = req.body.nomina ? req.body.nomina.trim() : '';
    if (!nomina) return res.redirect('/');

    const nombreMostrar = nombresOficiales[nomina] || `Colaborador Nómina ${nomina}`;
    const nominaMostrar = nomina;
    const fotoPath = `/fotos/${nominaMostrar}.png`;

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

// Ruta para ver el curso (Visualizador Inteligente Actualizado)
app.get('/ver-curso', (req, res) => {
    db.get('SELECT * FROM cursos WHERE id = ?', [req.query.id], (err, c) => {
        if (!c) return res.send("Curso no encontrado");
        
        let contenidoHtml = "";

        if (c.tipo_contenido === 'video') {
            if (c.url_recurso.includes('youtube.com') || c.url_recurso.includes('youtu.be')) {
                contenidoHtml = `<iframe src="${c.url_recurso}" width="100%" height="450px" frameborder="0" allowfullscreen></iframe>`;
            } else {
                contenidoHtml = `<video width="100%" height="450px" controls><source src="${c.url_recurso}" type="video/mp4">Tu navegador no soporta video.</video>`;
            }
        } else if (c.tipo_contenido === 'presentacion') {
            contenidoHtml = `<iframe src="${c.url_recurso}" width="100%" height="450px" frameborder="0"></iframe>`;
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
            <div class="card" style="max-width: 800px; margin: 20px auto; padding: 20px;">
                <h1>${c.titulo}</h1>
                ${contenidoHtml}
                <br><br>
                <a href="${c.url_form}" target="_blank" class="btn-primary" style="display: block; text-align: center; background: #0033a0; color: white; padding: 12px; text-decoration: none; border-radius: 6px; font-weight:bold;">ABRIR EXAMEN</a>
                <br>
                <a href="/" style="display: block; text-align: center; color:#0033a0; font-weight:bold;">Volver al panel</a>
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