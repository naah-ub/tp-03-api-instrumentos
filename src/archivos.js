// Librerias
const fs = require("node:fs/promises");

// Funcion asincrona
async function leerJson(ruta) {
    // Lee e interpreta el JSON
    const texto = await fs.readFile(ruta, "utf8");
    return JSON.parse(texto);
}

module.exports = {
    leerJson,
    // escribirTexto,
};