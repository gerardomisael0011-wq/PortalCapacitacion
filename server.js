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
    '2353': 'MARTHA RAMIREZ RODRIGUEZ',
    '2372': 'GILBERTO  LOPEZ SEGOVIA',
    '2393': 'MARIA FERNANDA RODRIGUEZ PRECIADO',
    '2404': 'DAFNE ABIGAIL VALENTIN TORRES',
    '2459': 'SANJUANA  GARCIA ARAUJO',
    '2462': 'MARTHA GRISELDA ALONSO CABRERA',
    '2489': 'ANTONIO HERNANDEZ CASTRO',
    '2508': 'JOSE JOEL  TORRES MORALES',
    '2525': 'LUZ REGINA GONZALEZ GARCIA',
    '2526': 'ALBA ARACELI SANCHEZ LOPEZ',
    '2529': 'PERLA LIZBETH  RODRIGUEZ  DIAZ',
    '2534': 'VICTORIA  PEREZ YEBRA',
    '2543': 'JESUS ALFONSO OLVERA HIDALGO',
    '2548': 'HILDA ISELA  PONCE  GARCIA',
    '2550': 'NELI ALEXANDRA MAYA  PONCE',
    '2569': 'SILVIA  DURAN ELIAS',
    '2591': 'MINERVA NEGRETE MACHUCA',
    '2595': 'BEBERLY ADRIANA  BASTIDA ROMERO',
    '2598': 'DAVID  ROJAS TORRES',
    '2599': 'DULCE MAYTE LOPEZ  RODRIGUEZ',
    '2618': 'MAYRA EDITH HERNANDEZ  RAMIREZ',
    '2626': 'LORENA NOEMI TORRES LOPEZ',
    '2627': 'MARIA GUADALUPE PEÑA NEGRETE',
    '2628': 'CAMARILLO ALCANTAR PAUL ERNESTO',
    '2630': 'NORMA MIREYA GUTIERREZ LOPEZ',
    '2640': 'PATRICIA  ANDRADE RAMIREZ',
    '2641': 'FRANCISCO GIOVANNI ORTEGA HERNANDEZ',
    '2644': 'ADRIAN HERNANDEZ  GASCA',
    '2683': 'GERARDO NAVA PEREZ',
    '2694': 'DULCE ITZEL DOMINGUEZ  GUERRERO',
    '2696': 'NORMA ERIKA ROCHA  ARANDA',
    '2699': 'RAYMUNDO ALEJANDRO CERVANTES VALDOVINOS',
    '2716': 'FERNANDO VAZQUEZ OROZCO',
    '2717': 'OWNA ARELY ALCALA LOPEZ',
    '2718': 'JOSE ALVARO FALCON GARCIA',
    '2719': 'SELENA CIRSTINA  RAMIREZ  RAMIREZ',
    '2724': 'ANA GABRIELA  RODRIGUEZ  MARTINEZ',
    '2725': 'MARIA CANDELARIA HERNANDEZ  CAMACHO',
    '2726': 'AMERICA LORELY LANDIN ELIAS',
    '2731': 'NANCY GERALDINE VIEYRA CASTILLO',
    '2737': 'RAMIREZ HERNANDEZ ESMERALDA',
    '2738': 'ORTEGA MENDEZ PAULA IMELDA',
    '2739': 'JUAREZ HINOJOSA MARIANA PATRICIA',
    '2740': 'JORDAN IVAN GASCA ROJAS',
    '2747': 'MURRIETA DUEÑAS ERIKA SELENA',
    '2748': 'REYNA GORETTI RAMIREZ GARCIA',
    '2750': 'RICARDO HOSSET LARA RIVAS',
    '2757': 'HIROKI SHIMIZU',
    '2760': 'BECERRA ALCANTAR JUANA',
    '2769': 'FERNANDEZ RODRIGUEZ TERESITA DE JESUS',
    '2770': 'BUSTAMANTE GUERRERO SANDRA',
    '2776': 'OLMOS BARRON FATIMA SOLEDAD',
    '2781': 'PEÑA NEGRETE BRENDA BERENICE',
    '2786': 'ORTIZ URBINA UBALDO ALEJANDRO',
    '2788': 'QUIJAS QUINTANA RICARDO',
    '2801': 'VAZQUEZ FLORES MARICRUZ',
    '2815': 'MEZA CAUDILLO ROSARIO ADRIANA',
    '2816': 'MAEGUIBO DIEGO',
    '2821': 'NAKAJIMA TAKESHI',
    '2825': 'REYES GONZALEZ VALERIA ESTEFANIA',
    '2827': 'RODRIGUEZ CRUZ JOSE DANIEL',
    '2837': 'VITAL RAMIREZ BRAULIO ADRIAN',
    '2840': 'PEREZ NORBERTO TRISTAN ABEL',
    '2841': 'RAMIREZ TRUJILLO MARIA REYNA',
    '2843': 'MEJIA DIONICIO OSCAR',
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
    '2869': 'SUNOHARA YUTAKA',
    '2871': 'ARRIAGA SUAREZ MARIA GUADALUPE',
    '2874': 'RODRIGUEZ ORTEGA SAUL ALEJANDRO',
    '2875': 'ZEPEDA ESTRADA KARINA LUCERO',
    '2876': 'FUENTES MUÑIZ MARIA GUADALUPE JANET',
    '2881': 'BARRIENTOS RODRIGUEZ DIEGO SANTIAGO',
    '2886': 'MORENO AGUILAR HECTOR ANTONIO',
    '2887': 'ROMERO AGUILAR GERARDO MISAEL',
    '2888': 'SANCHEZ CASTRO ALVARO DANIEL',
    '2889': 'BUSTAMANTE GUERRERO KAROL RUBI',
    '2890': 'AGUILAR ANGUIANO GUADALUPE DEL ROCIO',
    '2894': 'MARIN VILCHIS ANGELA EUGENIA',
    '2895': 'BONILLA SANCHEZ CRISTINA',
    '2897': 'GALVAN MARES FERNANDO',
    '2899': 'RODRIGUEZ ALVAREZ ERIKA DEL PILAR',
    '2900': 'MARIN VILCHIS MA. DE LOS ANGELES',
    '2901': 'ROMERO RANGEL MARIA CRUZ',
    '2902': 'GUERRERO RAMOS BRENDA LUCIA',
    '2903': 'GUTIERREZ MENDEZ ANA SOFIA',
    '2904': 'SANCHEZ MEDRANO JOSE GUADALUPE',
    '2905': 'MARTINEZ GUERRERO JAVIER',
    '2906': 'MENDOZA MANRIQUEZ JONATHAN EFREN',
    '2907': 'VELAZQUEZ BLANCARTE JUANA RAQUEL',
    '2908': 'PEREZ GOMEZ ESMERALDA ABIGAIL',
    '2910': 'HERNANDEZ GASCA GAEL',
    '2911': 'VALDIVIA LUGO GABRIEL',
    '2912': 'RODRIGUEZ MARTINEZ OSCAR ARMANDO',
    '2913': 'GAYTAN RODRIGUEZ PAULINA JACQUELINE',
    '2914': 'QUINTANA QUIJAS JOSE ISIDRO',
    '2915': 'RAMIREZ HERNANDEZ BRENDA BERENISE',
    '2916': 'HERNANDEZ RAMIREZ KAREN NAHIELY',
    '2917': 'MARTINEZ MALDONADO JUAN MANUEL',
    '2918': 'TOVAR CARDOSO ROSA ELIZABETH',
    '2919': 'BARROSO ALFARO ELIZABETH GUADALUPE',
    '2920': 'HUERTA MARQUEZ MARIA FERNANDA',
    '2921': 'GALVAN MORENO REYNA GRACIANA',
    '2922': 'PEÑA GUERRA ISAIAS DE JESUS',
    '2923': 'ZUÑIGA MARTINEZ GABRIELA MONTSERRAT',
    '2924': 'ZAMILPA LUNA AMERICA JOSHELYN',
    '2925': 'RAZO PEREZ LILIANA ELIZABETH',
    '2926': 'CHAVEZ DIAZ MARTHA DOLORES',
    '2927': 'SALAMANCA MARES LUCIA ESMERALDA',
    '2928': 'PEREZ CRUZ DULCE MARIA',
    '2929': 'NILA AGUILAR ADRIAN GUADALUPE',
    '2930': 'GUTIERREZ GARCIA ALONDRA ODALIS ',
    '2931': 'RODRIGUEZ LUNA NAYELI ISAMAR',
    '2932': 'CARDONA MAZUCA ANA SILVIA',
    '2933': 'MANZANO PACHECO JESSICA GUADALUPE',
    '2934': 'VILLANUEVA MENDIOLA MARIA GUADALUPE',
    '2935': 'BRAVO ELIAS ELIZABETH',
    '2936': 'GALLARDO CEDILLO YADIRA JOVITA',
    '2937': 'RAMIREZ MARTINEZ JORGE',
    '2938': 'PEREZ CRUZ VALERIA GUADALUPE',
    '2939': 'BARRIENTOS PEREZ MANUELA CECILIA ',
    '2940': 'MARTINEZ GONZALEZ JULIO CESAR',
    '2941': 'BONILLA ANGUIANO ANA KAREN',
    '2943': 'TOVAR MARTINEZ RICARDO JR.',
    '2944': 'GUTIERREZ RAMIREZ ANDREA GUADALUPE',
    '2945': 'CUELLAR AGUILAR AURELIA',
    '2946': 'AYALA GAYTAN JOSE OCTAVIO',
    '2947': 'MUÑOZ CABRERA MARIANA JAZMIN',
    '2948': 'RAMIREZ VAZQUEZ CINTHIA JANET',
    '2949': 'RAMIREZ HERNANDEZ BRENDA ABIGAIL',
    '2950': 'RANGEL GUERRERO MARTIN ADRIAN',
    '2951': 'HERNANDEZ IBARRA JUAN PABLO',
    '2952': 'NEGRETE RODRIGUEZ KARLA VANESSA',
    '2953': 'SANTIBAÑEZ MUÑOZ MIREYA MARIA DE LA LUZ',
    '2954': 'ARRIAGA LUNA ISRAEL',
    '2955': 'RANGEL MARTINEZ ANA LAURA',
    '2956': 'JASSO BONILLA PAULINA',
    '2957': 'JASSO BONILLA LIZETH',
    '2958': 'RODRIGUEZ CARDOSO ALONDRA JACQUELINE',
};

// Forzar actualización de cursos en Render

const cursosPorNomina = {
    '2887': [22, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17], 
    '1011': [22, 17, 16, 5, 7, 8, 9, 10],    
    '1018': [22, 17, 16, 5, 7, 8, 9, 10], 
    '1037': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1047': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1051': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1102': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1114': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1126': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1171': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1175': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1176': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1201': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1277': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1283': [22, 17, 5, 7, 8, 9, 10],
    '1285': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1311': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1315': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1322': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1325': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1329': [22, 17, 5, 7, 8, 9, 10],
    '1331': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1372': [22, 17, 16, 5, 7, 8, 9, 10, 13, 15],
    '1386': [22, 17, 5, 7, 8, 9, 10],
    '1390': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1398': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1401': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1414': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1419': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1469': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1470': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1473': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1476': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1477': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1478': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1482': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1486': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1508': [22, 17, 5, 7, 8, 9, 10],
    '1541': [22, 17, 5, 7, 8, 9, 10],
    '1545': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1563': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1565': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1577': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1585': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1593': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1608': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1621': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1648': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1658': [22, 17, 5, 7, 8, 9, 10],
    '1663': [22, 17, 5, 7, 8, 9, 10],
    '1670': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1688': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1740': [22, 17, 5, 7, 8, 9, 10],
    '1760': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1783': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1881': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1883': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1884': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1927': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1934': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1938': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1946': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '1960': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2002': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2022': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2034': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2035': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2076': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2078': [22, 17, 16, 5, 7, 8, 9, 10],
    '2087': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2093': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2110': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2123': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2133': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2148': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2149': [22, 17, 5, 7, 8, 9, 10],
    '2162': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2187': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2247': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2254': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2255': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2259': [22, 17, 5, 7, 8, 9, 10],
    '2273': [22, 17, 5, 7, 8, 9, 10],
    '2303': [22, 17, 16, 5, 7, 8, 9, 10],
    '2306': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2315': [22, 17, 5, 7, 8, 9, 10],
    '2324': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2325': [22,11, 6, 17, 5, 7, 8, 9, 10],
    '2339': [22, 17, 16, 5, 7, 8, 9, 10],
    '2346': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2352': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2353': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2367': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2372': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2393': [22, 15, 6, 17, 16, 5, 7, 8, 9, 10],
    '2404': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2459': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2462': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2489': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2502': [22, 17, 5, 7, 8, 9, 10],
    '2508': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2525': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2526': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2529': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2534': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2536': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2543': [22, 17, 5, 7, 8, 9, 10],
    '2548': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2550': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2568': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2569': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2585': [22, 17, 5, 7, 8, 9, 10],
    '2591': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2595': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2598': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2599': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2605': [22, 17, 5, 7, 8, 9, 10],
    '2618': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2626': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2627': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2628': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2630': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2640': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2641': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2643': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2644': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2663': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2683': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2694': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2696': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2699': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2716': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2717': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2718': [22, 15, 6, 17, 16, 5, 7, 8, 9, 10],
    '2719': [22, 17, 5, 7, 8, 9, 10],
    '2721': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2724': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2725': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2726': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2731': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2734': [22, 17, 5, 7, 8, 9, 10],
    '2737': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2738': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2739': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2740': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2744': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2747': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2748': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2750': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2757': [22, 17, 5, 7, 8, 9, 10],
    '2760': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2763': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2769': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2770': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2776': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2781': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2786': [22, 11, 6, 17, 16, 5, 7, 8, 9, 10, 13, 15],
    '2788': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2792': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2793': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2798': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2801': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2804': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2815': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2816': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2821': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2825': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2827': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2828': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2835': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2837': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2838': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2840': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2841': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2843': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2844': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2846': [22, 17, 16, 5, 7, 8, 9, 10],
    '2848': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2851': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2852': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2855': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2861': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2862': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2863': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2866': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2867': [22, 17, 5, 7, 8, 9, 10],
    '2868': [22, 17, 5, 7, 8, 9, 10],
    '2869': [22, 17, 5, 7, 8, 9, 10],
    '2871': [22, 17, 5, 7, 8, 9, 10],
    '2874': [22, 17, 5, 7, 8, 9, 10],
    '2875': [22, 17, 5, 7, 8, 9, 10],
    '2876': [22, 17, 5, 7, 8, 9, 10],
    '2878': [22, 17, 5, 7, 8, 9, 10],
    '2881': [22, 17, 5, 7, 8, 9, 10],
    '2882': [22, 17, 5, 7, 8, 9, 10],
    '2883': [22, 17, 5, 7, 8, 9, 10],
    '2885': [22, 17, 5, 7, 8, 9, 10],
    '2886': [22, 17, 16, 5, 7, 8, 9, 10],
    '2888': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2889': [22, 17, 5, 7, 8, 9, 10],
    '2890': [22, 17, 5, 7, 8, 9, 10],
    '2891': [22, 17, 5, 7, 8, 9, 10],
    '2893': [22, 17, 5, 7, 8, 9, 10],
    '2894': [22, 17, 5, 7, 8, 9, 10],
    '2895': [22, 17, 5, 7, 8, 9, 10],
    '2896': [22, 17, 5, 7, 8, 9, 10],
    '2897': [22, 11, 6, 17, 5, 7, 8, 9, 10, 13, 15],
    '2899': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2900': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    "2901": [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2902': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2903': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2904': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2905': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2906': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2907': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2908': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2910': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2911': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2912': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2913': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2914': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2915': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2916': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2917': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2918': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2919': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2920': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2921': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2922': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2923': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2924': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2925': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2926': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2927': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2928': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2929': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2930': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2931': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2932': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2933': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2934': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2935': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2936': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2937': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2938': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2939': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2940': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2941': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2942': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2943': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2944': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2945': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2946': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2947': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2948': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2949': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2950': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2951': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2952': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2953': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2954': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2955': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2956': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2957': [17, 5, 7, 8, 9, 10, 13, 15, 22],
    '2958': [17, 5, 7, 8, 9, 10, 13, 15, 22]

    // Si una nómina no está escrita aquí, no se le asignará ningún curso por defecto.
};

// Inicialización de la base de datos SQLite
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS usuarios (nomina TEXT PRIMARY KEY, nombre TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS cursos (id INTEGER PRIMARY KEY, titulo TEXT, categoria TEXT, tipo_contenido TEXT, url_recurso TEXT, url_form TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS asignaciones (id_usuario TEXT, id_curso INTEGER, PRIMARY KEY(id_usuario, id_curso))");
    db.run("CREATE TABLE IF NOT EXISTS resultados (id_usuario TEXT, id_evaluacion INTEGER, aprobado INTEGER, PRIMARY KEY(id_usuario, id_evaluacion))");

    db.run("DELETE FROM cursos");

    // Inserción de cursos con consultas preparadas (evita errores de sintaxis en apóstrofes)
    const stmtCurso = db.prepare("INSERT OR REPLACE INTO cursos VALUES (?, ?, ?, ?, ?, ?)");
    
    const listaCursos = [
        //[1, 'Curso de Seguridad Industrial', 'Seguridad', 'video', '/videos/seguridad.mp4', 'https://forms.gle/EXAMEN_1'],
        //[2, 'Manual de Procesos y Calidad', 'Operaciones', 'pdf', '/videos/manual.pdf', 'https://forms.gle/EXAMEN_2'],
        //[3, 'Inducción General de Planta', 'RH', 'video', '/videos/induccion.mp4', 'https://forms.gle/EXAMEN_3'],
        //[4, 'Uso Correcto de EPP', 'Seguridad', 'presentacion', '/videos/epp.pdf', 'https://forms.gle/EXAMEN_4'],
        [5, 'Kaisen', 'KAISEN', 'video', '/videos/KAIZEN.mp4', 'https://forms.gle/bWTvtgxigDP6dYT1A'],
        [6, 'Listado de Verificacion DE 5´S', 'KAISEN', 'video', '/videos/LISTADO DE VERIFICACION DE 5´S.mp4', 'https://forms.gle/fQUMCP98B4sLxZCe9'],
        [7, 'Aspectos Ambientales', 'AMBIENTAL', 'video', '/videos/Aspectos ambientales.mp4', ''],
        [8, 'Inducción a ISO 14001', 'AMBIENTAL', 'video', '/videos/Inducción a ISO 14001.mp4', 'https://forms.gle/PmHegCo9WXGnvfgi7'],
        [9, 'Objetivos ambientales', 'AMBIENTAL', 'video', '/videos/Objetivos ambientales.mp4', 'https://forms.gle/bzypAVUH3VNSD5hD6'],
        [10, 'Recuerda reportar', 'AMBIENTAL', 'video', '/videos/Recuerda reportar.mp4', ''],
        [11, 'Sustancias químicas', 'AMBIENTAL', 'video', '/videos/Sustancias químicas.mp4', 'https://forms.gle/ppHVdZpFbpPB637WA'],
        //[12, 'Infografia_Aviso_Ausencias', 'RH', 'pdf', '/videos/Infografia_Aviso_Ausencias.pdf', ''],
        [13, 'Alertas de calidad', 'SISTEMA DE GESTION DE CALIDAD', 'video', '/videos/Alertas de calidad.mp4', 'https://forms.gle/TJmbox5MCzzbh9HFA'],
        [14, 'Auditorias de proceso', 'SISTEMA DE GESTION DE CALIDAD', 'video', '/videos/Auditorias de proceso.mp4', 'https://forms.gle/8LQuJn7EFwEfgwVd9'],
        [15, "Control de cambios de 4 M's", 'SISTEMA DE GESTION DE CALIDAD', 'video', '/videos/1. Control de cambios de 4 M\'s.mp4', 'https://forms.gle/93gwj7PaJUpJcEfbA'],
        [16, 'Control documental', 'SISTEMA DE GESTION DE CALIDAD', 'video', '/videos/Control documental.mp4', 'https://forms.gle/R2LzXioDjWRaRgqQ8'],
        [17, 'Infografia_Aviso_Ausencias', 'RH', 'video', '/videos/Infografia_Aviso_Ausencias.mp4', ''],
        [18, 'Verificacion de las 5´s', 'KAISEN', 'video', '/videos/LISTADO 5´S.mp4', 'https://forms.gle/uLVzo9aTEuF9aVrt7'],
        [19, '12 Reglas', 'Produccion', 'video', '/videos/12 REGLAS 1.mp4', ''],
        [20, 'Anormalidades Flujo PNC', 'Produccion', 'video', '/videos/ANORMALIDADES FLUJO PNC.mp4', ''],
        [21, 'Hoja de Operacion Estandar', 'Produccion', 'video', '/videos/Hoja de Operación Estandar 2.mp4', ''],
        [23, 'ILUO', 'Produccion', 'video', '/videos/ILUO.mp4', 'https://forms.gle/oTS3hah6aPJKWZqq8'],
        [24, 'Los 7 desperdicios de Produccion', 'Produccion', 'video', '/videos/Los 7 desperdicios de Producción [Autoguardado] 1 (1).mp4', ''],
        [22, 'Reglamento', 'RH', 'pdf', '/videos/REGLAMENTO.pdf', 'https://forms.gle/bCiff5CA1Vt3aAV56'],
        [25, 'Control de Producto no Conforme', 'Calidad-Laboratorio', 'video', '/videos/4. CONTROL DE PRODUCTO NO CONFORME.mp4', ''],
        [26, 'Caracteristicas Especiales', 'Calidad-Laboratorio', 'video', '/videos/Caracteristicas Especiales.mp4', ''],
        [27, 'Fundamentos de instrumentos de medición ', 'Calidad-Laboratorio', 'video', '/videos/Fundamentos de instrumentos de medición.mp4', ''],
        [28, 'Importancia de las liberaciones', 'Calidad-Laboratorio', 'video', '/videos/Importancia de las liberaciones.mp4', ''],
        [29, 'Liberacion de producto y HDI', 'Calidad-Laboratorio', 'video', '/videos/Liberacion de producto y HDI.mp4', ''],
        [30, '', '', 'video', '/videos/.mp4', ''],
        [31, '', '', 'video', '/videos/.mp4', '']
    ];

    listaCursos.forEach(c => stmtCurso.run(c));
    stmtCurso.finalize();

    // Cargar asignaciones iniciales
    db.run("DELETE FROM asignaciones");
    const stmtAsign = db.prepare("INSERT OR REPLACE INTO asignaciones (id_usuario, id_curso) VALUES (?, ?)");
    for (const [nomina, cursos] of Object.entries(cursosPorNomina)) {
        for (const cursoId of cursos) {
            stmtAsign.run(nomina, cursoId);
        }
    }
    stmtAsign.finalize();
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
    const fotoPath = `/fotos/${nomina}.png`;

    db.run('INSERT OR REPLACE INTO usuarios (nomina, nombre) VALUES (?, ?)', [nomina, nombreMostrar], () => {
        const misCursosAsignados = cursosPorNomina[nomina] || [];

        db.run('DELETE FROM asignaciones WHERE id_usuario = ?', [nomina], () => {
            const stmt = db.prepare('INSERT OR IGNORE INTO asignaciones (id_usuario, id_curso) VALUES (?, ?)');
            misCursosAsignados.forEach(idCurso => {
                stmt.run(nomina, idCurso);
            });
            stmt.finalize(() => {
                const query = `SELECT c.id, c.titulo, c.categoria, r.aprobado FROM cursos c 
                                JOIN asignaciones a ON c.id = a.id_curso 
                                LEFT JOIN resultados r ON c.id = r.id_evaluacion AND r.id_usuario = ? 
                                WHERE a.id_usuario = ? 
                                ORDER BY c.categoria, c.id`;
                
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
                    
                    if (!cursos || cursos.length === 0) {
                        html += `<p style="text-align: center; color: #666; padding: 20px;">No tienes cursos asignados actualmente.</p>`;
                    } else {
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
                    }
                    
                    res.send(html + `</div><br><a href="/" style="color:#0033a0; font-weight:bold;">Cerrar Sesión</a></body></html>`);
                });
            });
        });
    });
});

// Ruta para visualizar el contenido del curso
app.get('/ver-curso', (req, res) => {
    db.get('SELECT * FROM cursos WHERE id = ?', [req.query.id], (err, c) => {
        if (!c) return res.send("Curso no encontrado");
        
        let contenidoHtml = "";

        if (c.tipo_contenido === 'video') {
            if (c.url_recurso.includes('youtube.com') || c.url_recurso.includes('youtu.be')) {
                contenidoHtml = `<iframe src="${c.url_recurso}" width="100%" height="450px" frameborder="0" allowfullscreen></iframe>`;
            } else {
                contenidoHtml = `
                <div style="background: #000; border-radius: 8px; overflow: hidden;">
                    <video width="100%" height="450px" controls controlsList="nodownload">
                        <source src="${c.url_recurso}" type="video/mp4">
                        Tu navegador no soporta la reproducción de video.
                    </video>
                </div>`;
            }
        } else if (c.tipo_contenido === 'presentacion' || c.tipo_contenido === 'pdf') {
            contenidoHtml = `
            <div style="width: 100%; height: 650px; border: 1px solid #ccc; border-radius: 8px; overflow: hidden;">
                <iframe src="${c.url_recurso}" width="100%" height="100%" style="border: none;">
                    Tu navegador no soporta la vista previa del PDF. 
                    <a href="${c.url_recurso}" target="_blank">Haz clic aquí para descargarlo/verlo.</a>
                </iframe>
            </div>`;
        } else {
            contenidoHtml = `<a href="${c.url_recurso}" target="_blank" style="padding: 10px 20px; background: #0033a0; color: white; text-decoration: none; border-radius: 5px;">Abrir material</a>`;
        }

        res.send(`
        <!DOCTYPE html>
        <html>
        <head><link rel="stylesheet" href="style.css"></head>
        <body style="background: #f4f7f6; font-family: Arial, sans-serif;">
            <div class="card" style="max-width: 850px; margin: 30px auto; padding: 25px; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h1 style="color: #0033a0; margin-top: 0;">${c.titulo}</h1>
                <div style="margin-bottom: 20px;">
                    ${contenidoHtml}
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    ${c.url_form ? `<a href="${c.url_form}" target="_blank" style="display: inline-block; background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; margin-bottom: 15px;">ABRIR EXAMEN DEL CURSO</a><br>` : ''}
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