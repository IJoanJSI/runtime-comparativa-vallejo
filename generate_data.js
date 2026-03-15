const fs = require('fs');
const names = ['Ana','Luis','Maria','Carlos','Sofia','Pedro',
'Lucia','Diego','Valentina','Andres'];
const lastNames = ['Torres','Mendoza','Vargas','Ruiz','Lopez',
'Garcia','Perez','Sanchez','Gomez','Diaz'];
let csv = 'nombre,nota1,nota2,nota3\n';
for (let i = 0; i < 1000; i++) {
const n = names[i % names.length];
const l = lastNames[Math.floor(i / names.length) % lastNames.length];
const n1 = (Math.random() * 6 + 4).toFixed(1);
const n2 = (Math.random() * 6 + 4).toFixed(1);
const n3 = (Math.random() * 6 + 4).toFixed(1);
csv += `${n} ${l} ${i+1},${n1},${n2},${n3}\n`;
}
fs.writeFileSync('./data/estudiantes.csv', csv);
console.log('CSV generado: 1000 estudiantes');