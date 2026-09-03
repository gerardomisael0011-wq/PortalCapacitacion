const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('./empresa_v2.db');

// Diccionario de personal de Johnan de México
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

// 1. Catálogo General de Cursos (Registra aquí todos tus cursos con sus archivos y forms)
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS usuarios (nomina TEXT PRIMARY KEY, nombre TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS cursos (id INTEGER PRIMARY KEY, titulo TEXT, categoria TEXT, tipo_contenido TEXT, url_recurso TEXT, url_form TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS asignaciones (id_usuario TEXT, id_curso INTEGER, PRIMARY KEY(id_usuario, id_curso))");
    db.run("CREATE TABLE IF NOT EXISTS resultados (id_usuario TEXT, id_evaluacion INTEGER, aprobado INTEGER, PRIMARY KEY(id_usuario, id_evaluacion))");

    // Limpieza de duplicados previos por seguridad
    db.run("DELETE FROM asignaciones WHERE rowid NOT IN (SELECT MIN(rowid) FROM asignaciones GROUP BY id_usuario, id_curso)");

    // Ejemplos de tus cursos (puedes agregar cuantos quieras, mezclando videos locales, PDFs, presentaciones, etc.)
    db.run("INSERT OR REPLACE INTO cursos VALUES (1, 'Curso de Seguridad Industrial', 'Seguridad', 'video', '/videos/seguridad.mp4', 'https://forms.gle/EXAMEN_1')");
    db.run("INSERT OR REPLACE INTO cursos VALUES (2, 'Manual de Procesos y Calidad', 'Operaciones', 'pdf', '/videos/manual.pdf', 'https://forms.gle/EXAMEN_2')");
    db.run("INSERT OR REPLACE INTO cursos VALUES (3, 'Inducción General de Planta', 'RH', 'video', '/videos/induccion.mp4', 'https://forms.gle/EXAMEN_3')");
    db.run("INSERT OR REPLACE INTO cursos VALUES (4, 'Uso Correcto de EPP', 'Seguridad', 'presentacion', '/videos/epp.pdf', 'https://forms.gle/EXAMEN_4')");
    db.run("INSERT OR REPLACE INTO cursos VALUES (5, 'KAISEN', 'Kaisen', 'video', '/videos/KAISEN.mp4', 'https://forms.gle/bWTvtgxigDP6dYT1A')");
});

// 2. MAPA DE ASIGNACIONES: Define exactamente qué ID(s) de curso le tocan a cada Nómina
const cursosPorNomina = {
    '2887': [1, 5], // Gerardo verá solo los cursos 1, 2 y 4
    '1011': [2, 3],    // Gilberto verá solo el 2 y el 3
    '1018': [1, 3, 4],  // Norma verá solo el 1, 3 y 4
    '1037': [2, 3],
    '1047': [],
    '1051': [],
    '1102': [],
    '1114': [],
    '1126': [],
    '1171': [],
    '1175': [],
    '1176': [],
    '1201': [],
    '1277': [],
    '1283': [],
    '1285': [],
    '1311': [],
    '1315': [],
    '1322': [],
    '1325': [],
    '1329': [],
    '1331': [],
    '1372': [],
    '1386': [],
    '1390': [],
    '1398': [],
    '1401': [],
    '1414': [],
    '1419': [],
    '1469': [],
    '1470': [],
    '1473': [],
    '1476': [],
    '1477': [],
    '1478': [],
    '1482': [],
    '1486': [],
    '1508': [],
    '1541': [],
    '1545': [],
    '1563': [],
    '1565': [],
    '1577': [],
    '1585': [],
    '1593': [],
    '1608': [],
    '1621': [],
    '1648': [],
    '1658': [],
    '1663': [],
    '1670': [],
    '1688': [],
    '1740': [],
    '1760': [],
    '1783': [],
    '1881': [],
    '1883': [],
    '1884': [],
    '1927': [],
    '1934': [],
    '1938': [],
    '1946': [],
    '1960': [],
    '2002': [],
    '2022': [],
    '2034': [],
    '2035': [],
    '2076': [],
    '2078': [],
    '2087': [],
    '2093': [],
    '2110': [],
    '2123': [],
    '2133': [],
    '2148': [],
    '2149': [],
    '2162': [],
    '2187': [],
    '2247': [],
    '2254': [],
    '2255': [],
    '2259': [],
    '2273': [],
    '2303': [],
    '2306': [],
    '2315': [],
    '2324': [],
    '2325': [],
    '2339': [],
    '2346': [],
    '2352': [],
    '2353': [],
    '2367': [],
    '2372': [],
    '2393': [],
    '2404': [],
    '2459': [],
    '2462': [],
    '2489': [],
    '2502': [],
    '2508': [],
    '2525': [],
    '2526': [],
    '2529': [],
    '2534': [],
    '2536': [],
    '2543': [],
    '2548': [],
    '2550': [],
    '2568': [],
    '2569': [],
    '2585': [],
    '2591': [],
    '2595': [],
    '2598': [],
    '2599': [],
    '2605': [],
    '2618': [],
    '2626': [],
    '2627': [],
    '2628': [],
    '2630': [],
    '2640': [],
    '2641': [],
    '2643': [],
    '2644': [],
    '2663': [],
    '2683': [],
    '2694': [],
    '2696': [],
    '2699': [],
    '2716': [],
    '2717': [],
    '2718': [],
    '2719': [],
    '2721': [],
    '2724': [],
    '2725': [],
    '2726': [],
    '2731': [],
    '2734': [],
    '2737': [],
    '2738': [],
    '2739': [],
    '2740': [],
    '2744': [],
    '2747': [],
    '2748': [],
    '2750': [],
    '2757': [],
    '2760': [],
    '2763': [],
    '2769': [],
    '2770': [],
    '2776': [],
    '2781': [],
    '2786': [],
    '2788': [],
    '2792': [],
    '2793': [],
    '2798': [],
    '2801': [],
    '2804': [],
    '2815': [],
    '2816': [],
    '2821': [],
    '2825': [],
    '2827': [],
    '2828': [],
    '2835': [],
    '2837': [],
    '2838': [],
    '2840': [],
    '2841': [],
    '2843': [],
    '2844': [],
    '2846': [],
    '2848': [],
    '2851': [],
    '2852': [],
    '2855': [],
    '2861': [],
    '2862': [],
    '2863': [],
    '2866': [],
    '2867': [],
    '2868': [],
    '2869': [],
    '2871': [],
    '2874': [],
    '2875': [],
    '2876': [],
    '2878': [],
    '2881': [],
    '2882': [],
    '2883': [],
    '2885': [],
    '2886': [],
    '2888': [],
    '2889': [],
    '2890': [],
    '2891': [],
    '2893': [],
    '2894': [],
    '2895': [],
    '2896': [],
    '2897': []
    // Si una nómina no está escrita aquí, no se le asignará ningún curso por defecto.
};

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

// Ruta de Login (POST) - Filtra y asigna los cursos correspondientes
app.post('/login', (req, res) => {
    const nomina = req.body.nomina ? req.body.nomina.trim() : '';
    if (!nomina) return res.redirect('/');

    const nombreMostrar = nombresOficiales[nomina] || `Colaborador Nómina ${nomina}`;
    const fotoPath = `/fotos/${nomina}.png`;

    db.run('INSERT OR REPLACE INTO usuarios (nomina, nombre) VALUES (?, ?)', [nomina, nombreMostrar], () => {
        
        // Extraemos la lista de ID de cursos configurados para esta nómina (si no tiene, devuelve arreglo vacío)
        const misCursosAsignados = cursosPorNomina[nomina] || [];

        // Borramos asignaciones previas de este usuario para sincronizar con los cambios recientes
        db.run('DELETE FROM asignaciones WHERE id_usuario = ?', [nomina], () => {
            
            // Insertamos exclusivamente sus cursos correspondientes
            const stmt = db.prepare('INSERT OR IGNORE INTO asignaciones (id_usuario, id_curso) VALUES (?, ?)');
            misCursosAsignados.forEach(idCurso => {
                stmt.run(nomina, idCurso);
            });
            stmt.finalize(() => {

                // Consultamos únicamente los cursos que pertenecen a este usuario en la base de datos
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
                                    <p style="margin:0; font-weight:bold; font-size: 14px;">${nombreMostrar}</p>
                                    <p style="margin:0; font-size: 11px; color: #666;">Nómina: ${nomina}</p>
                                </div>
                                <img src="${fotoPath}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;" onerror="this.src='/logo_johnan.png'">
                            </div>
                        </div>

                        <div class="card" style="margin-top: 20px;">
                            <h1>Mis Cursos Asignados</h1>`;
                    
                    if (cursos.length === 0) {
                        html += `<p style="text-align: center; color: #666; padding: 20px;">No tienes cursos asignados actualmente.</p>`;
                    }

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
});

// Ruta para visualizar el contenido del curso (videos locales, PDFs o presentaciones)
app.get('/ver-curso', (req, res) => {
    db.get('SELECT * FROM cursos WHERE id = ?', [req.query.id], (err, c) => {
        if (!c) return res.send("Curso no encontrado");
        
        let contenidoHtml = "";

        if (c.tipo_contenido === 'video') {
            if (c.url_recurso.includes('youtube.com') || c.url_recurso.includes('youtu.be')) {
                contenidoHtml = `<iframe src="${c.url_recurso}" width="100%" height="450px" frameborder="0" allowfullscreen></iframe>`;
            } else {
                contenidoHtml = `
                <video width="100%" height="450px" controls controlsList="nodownload">
                    <source src="${c.url_recurso}" type="video/mp4">
                    Tu navegador no soporta la reproducción de video.
                </video>`;
            }
        } else if (c.tipo_contenido === 'presentacion' || c.tipo_contenido === 'pdf') {
            contenidoHtml = `<embed src="${c.url_recurso}" width="100%" height="600px" type="application/pdf">`;
        } else {
            contenidoHtml = `<a href="${c.url_recurso}" target="_blank" style="padding: 10px 20px; background: #0033a0; color: white; text-decoration: none; border-radius: 5px;">Abrir material</a>`;
        }

        res.send(`
        <!DOCTYPE html>
        <html>
        <head><link rel="stylesheet" href="style.css"></head>
        <body style="background: #f4f7f6; font-family: Arial, sans-serif;">
            <div class="card" style="max-width: 800px; margin: 30px auto; padding: 25px; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h1 style="color: #0033a0; margin-top: 0;">${c.titulo}</h1>
                <div style="background: #000; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
                    ${contenidoHtml}
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="${c.url_form}" target="_blank" style="display: inline-block; background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin-bottom: 15px;">ABRIR EXAMEN DEL CURSO</a>
                    <br>
                    <a href="/" style="color:#0033a0; font-weight:bold; text-decoration: none;">← Volver al panel de cursos</a>
                </div>
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