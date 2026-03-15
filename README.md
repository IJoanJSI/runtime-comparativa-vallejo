# Comparativa de Runtimes: Node.js vs Deno vs Bun

**Autor:** Joan Vallejo (GitHub: [@IJoanJSI](https://github.com/IJoanJSI))

Este repositorio contiene la implementación y análisis de rendimiento de un script de procesamiento de datos (CSV a JSON) ejecutado en tres de los principales entornos de ejecución de JavaScript y TypeScript: Node.js, Deno y Bun. 

El objetivo principal es medir el rendimiento de operaciones de entrada/salida (I/O) utilizando exclusivamente las APIs nativas de cada entorno, así como documentar las diferencias arquitectónicas, de configuración y sintaxis entre ellos.

## Estructura del Proyecto

El proyecto está modularizado por runtime, compartiendo un único origen de datos.

* `/node` - Implementación en JavaScript estándar utilizando el módulo `fs`.
* `/deno` - Implementación en TypeScript nativo utilizando `Deno.readTextFile`.
* `/bun` - Implementación en TypeScript nativo utilizando `Bun.file`.
* `/data` - Archivo `estudiantes.csv` generado dinámicamente (1000 registros).
* `/output` - Directorio destino para los archivos JSON generados (ignorado en el control de versiones).

## Análisis y Tabla Comparativa

Las siguientes métricas fueron obtenidas ejecutando los scripts en un entorno de desarrollo local. 

| Criterio | Node.js | Deno | Bun |
| :--- | :--- | :--- | :--- |
| **Tiempo de ejecución (ms)** | 4.21 ms | 18.79 ms | 11.5 ms |
| **Líneas de código** | 74 | 66 | 65 |
| **Requiere package.json** | Sí (Módulo ES/CommonJS) | No | Sí (Recomendado para resolución) |
| **TypeScript nativo** | No (Requiere transpilador) | Sí | Sí |
| **Permisos explícitos** | No (Acceso total por defecto) | Sí (`--allow-read`, `--allow-write`) | No (Acceso total por defecto) |
| **Dificultad de configuración (1-10)** | 3 | 1 | 2 |
| **Syntax destacada** | `fs.readFileSync()`, `path.join()` | Top-level await, `Deno.writeTextFile()` | `Bun.file()`, `await Bun.write()` |
| **¿Lo usarías en producción?** | Sí (Sistemas legacy/Enterprise) | Sí (Microservicios seguros/Edge) | En evaluación (Proyectos de alta concurrencia) |

## Reflexión Técnica Final

### 1. ¿Cuál runtime fue más fácil de configurar y por qué?
Deno resultó ser el entorno con la curva de configuración más baja. A diferencia de Node.js, que requiere inicializar un proyecto y gestionar la configuración de módulos (como el caso del `package.json` para definir el tipo de exportación), Deno permite ejecutar archivos de forma aislada e interpreta TypeScript de manera nativa sin necesidad de archivos de configuración ni herramientas de terceros. Además, la implementación del "Top-Level Await" simplifica la estructura del código al no requerir envolver la lógica asíncrona en funciones adicionales.

### 2. ¿Qué diferencia de rendimiento encontraste y te sorprendió?
Al analizar los nuevos tiempos de ejecución, el hallazgo más sorpresivo fue que Node.js resultó ser el más rápido con 4.21 ms, superando a los runtimes de nueva generación. Bun registró 11.5 ms y Deno fue el más lento con 18.79 ms. Aunque para 1000 registros una diferencia de ~14 ms es imperceptible para el usuario final, a nivel arquitectónico es significativa. Este comportamiento demuestra que el módulo nativo `fs` de Node.js está extremadamente optimizado para lecturas sincrónicas en este entorno. El mayor tiempo en Deno y Bun se atribuye al costo del "cold start" (el tiempo que tarda el motor en inicializarse e interpretar TypeScript al vuelo) en un script de ejecución tan corta. Si evaluáramos 100,000 registros o un servidor en ejecución continua, este costo de inicio se diluiría y la arquitectura de Bun y Deno probablemente revertiría la tendencia, superando a Node.js.

### 3. Si mañana empiezas un proyecto nuevo, ¿cuál runtime eliges y por qué?
La elección dependería estrictamente de los requerimientos de la arquitectura. 
Si el proyecto requiere alta estabilidad, soporte a largo plazo (LTS) y la utilización de librerías altamente específicas, elegiría Node.js debido a la inmensa madurez de su ecosistema npm. 
Sin embargo, para un proyecto nuevo enfocado en microservicios o funciones Edge, me decantaría por Deno. Este entorno ofrece una ventaja superior en seguridad de infraestructura gracias a su sistema de permisos explícitos ("Secure by default"). Bun lo mantendría en consideración para proyectos donde el factor crítico del sistema sea el rendimiento puro y la velocidad de inicio de contenedores, una vez que el ecosistema requiera menor evaluación.