const fs = require('fs');
const path = require('path');

// Iniciamos el contador de tiempo usando el API nativo
const start = performance.now();

// 1. Leer el archivo CSV de forma sincrónica (API nativa)
const filePath = path.join(__dirname, '../data/estudiantes.csv');
const csvData = fs.readFileSync(filePath, 'utf-8');

// 2. Parsear el CSV línea por línea sin librerías externas
const lineas = csvData.trim().split('\n');
lineas.shift(); // Eliminamos la primera línea (la cabecera)

let aprobados = 0;
let reprobados = 0;
const resultados = [];

for (const linea of lineas) {
    if (!linea) continue; // Por si hay líneas vacías al final
    
    // Separamos los valores por coma
    const [nombre, n1, n2, n3] = linea.split(',');
    const nota1 = parseFloat(n1);
    const nota2 = parseFloat(n2);
    const nota3 = parseFloat(n3);

    // 3. Calcular el promedio de las tres notas
    // Sumamos, dividimos entre 3 y redondeamos a 2 decimales
    const promedio = parseFloat(((nota1 + nota2 + nota3) / 3).toFixed(2));

    // 4. Determinar si aprobó (promedio >= 7.0)
    const estado = promedio >= 7.0 ? "Aprobado" : "Reprobado";
    
    if (estado === "Aprobado") {
        aprobados++;
    } else {
        reprobados++;
    }

    // Agregamos el estudiante al arreglo de resultados
    resultados.push({
        nombre,
        nota1,
        nota2,
        nota3,
        promedio,
        estado
    });
}

// Detenemos el contador de tiempo
const end = performance.now();
// Redondeamos el tiempo a 2 decimales para que se vea limpio
const tiempoMs = parseFloat((end - start).toFixed(2));

// 5. Estructurar el JSON de salida 
const outputJson = {
    runtime: "node",
    tiempoMs: tiempoMs,
    totalEstudiantes: resultados.length,
    aprobados: aprobados,
    reprobados: reprobados,
    resultados: resultados
};

// 6. Generar el archivo JSON en la carpeta output
const outputPath = path.join(__dirname, '../output/resultado-node.json');
fs.writeFileSync(outputPath, JSON.stringify(outputJson, null, 2));

// 7. Imprimir en consola los resultados finales
console.log(`⏱️  Tiempo total: ${tiempoMs} ms`);
console.log(`✅ Total aprobados: ${aprobados}`);
console.log(`❌ Total reprobados: ${reprobados}`);