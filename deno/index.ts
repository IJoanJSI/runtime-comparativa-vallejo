// deno/index.ts

// Iniciamos el contador
const start = performance.now();

// 1. Leer el archivo CSV usando la API nativa de Deno 
const csvData = await Deno.readTextFile("../data/estudiantes.csv");

// 2. Parsear el CSV
const lineas = csvData.trim().split('\n');
lineas.shift(); // Eliminamos la cabecera

let aprobados = 0;
let reprobados = 0;
const resultados = [];

for (const linea of lineas) {
    if (!linea) continue;
    
    const [nombre, n1, n2, n3] = linea.split(',');
    const nota1 = parseFloat(n1);
    const nota2 = parseFloat(n2);
    const nota3 = parseFloat(n3);

    // 3. Calcular el promedio
    const promedio = parseFloat(((nota1 + nota2 + nota3) / 3).toFixed(2));

    // 4. Determinar estado
    const estado = promedio >= 7.0 ? "Aprobado" : "Reprobado";
    
    if (estado === "Aprobado") {
        aprobados++;
    } else {
        reprobados++;
    }

    resultados.push({
        nombre,
        nota1,
        nota2,
        nota3,
        promedio,
        estado
    });
}

const end = performance.now();
const tiempoMs = parseFloat((end - start).toFixed(2));

// 5. Estructurar el JSON 
const outputJson = {
    runtime: "deno",
    tiempoMs: tiempoMs,
    totalEstudiantes: resultados.length,
    aprobados: aprobados,
    reprobados: reprobados,
    resultados: resultados
};

// 6. Escribir el archivo JSON usando la API nativa de Deno
await Deno.writeTextFile("../output/resultado-deno.json", JSON.stringify(outputJson, null, 2));

// 7. Imprimir resultados
console.log(`⏱️  Tiempo total Deno: ${tiempoMs} ms`);
console.log(`✅ Total aprobados: ${aprobados}`);
console.log(`❌ Total reprobados: ${reprobados}`);