// Librerias
const express = require("express");
const path = require("node:path");

// Puerto
const PORT = 3000;

// Importar modulos propios mediante rutas relativas
const { leerJson } = require("./archivos.js");
// const { crearInforme } = require("./juegos.js");

// Construccion de la ruta de salida y datos
const rutaDatos = path.join(__dirname, "..", "datos", "instrumentos.json");

// Funcion main
async function main() {
    try {

        // Carga asincrona de datos
        const instrumentos = await leerJson(rutaDatos);
        
        // Crea la aplicacion de servidor 
        const app = express();

        // Esta línea configura un Middleware (un intermediario de software).
        app.use(express.json());

        // Bienvenida
        app.get("/", (req, res) => {
        res.status(200).json({ mensaje: "API de instrumentos disponible" });
        });

        // Listamos todos los instrumentos si no pasamos ninguna valor como familia
        app.get("/api/instrumentos", (req, res) => {
            // Captura el filtro de busqueda
            const { familia } = req.query;
            
            // Caso sin filtro: Devolvemos todo
            if (!familia) {
                return res.json(instrumentos);
            }

            // Caso con filtro -> el proceso de filtrado
            const resultado = instrumentos.filter(
                (instrumento) => instrumento.familia.toLowerCase() === String(familia).toLowerCase(),
            );
            res.json(resultado);
        });

        // Los dos puntos antes del 'id' indican que es un valor que va a variar
        //Busca y muestra el instrumento con el valor del id que se pase 
        app.get("/api/instrumentos/:id", (req, res) => {
            const id = Number(req.params.id);
            const instrumento = instrumentos.find((elemento) => elemento.id === id);
            if (!instrumento) {
                return res.status(404).json({ error: "Instrumento no encontrado" });
            }
            res.json(instrumento);
        });

        // POST
        app.post("/api/instrumentos", (req, res) => {
            // Extraccion de los datos mediante destructuring ----- body -> cuerpo de la solicitud
            const { nombre, familia, origen, descripcion, disponible } = req.body;
            
            // Comprobar si falta algun campo / Validacion estricta de datos
            if (!nombre || !familia || !origen || !descripcion || disponible === undefined) {
                return res.status(400).json({
                error: "Todos los campos: nombre, familia, origen, descripcion y disponible son obligatorios",
                });
            }

            // Mediante un operador ternario calculamos de forma segura el id del nuevo elemento
            const ultimoId = instrumentos.length === 0 ? 0 : instrumentos[instrumentos.length - 1].id;
            
            // Creamos el nuevo objeto estructurado
            const nuevoInstrumento = {
                id: ultimoId + 1,
                nombre,
                familia,
                origen,
                descripcion,
                disponible
            };

            // Almacenamiento en memoria
            instrumentos.push(nuevoInstrumento);
            
            // Respuesta
            res.status(201).json(nuevoInstrumento);
        });

        app.listen(PORT, () => {
            console.log(`Servidor disponible en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error(`No se pudo iniciar el servidor: ${error.message}`);
        process.exitCode = 1;
    }
}

main();