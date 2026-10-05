# Trabajo práctico 03

## Descripción

Este proyecto consiste en el desarrollo de una API HTTP construida con **Express** y **Node.js**. Su propósito principal es administrar de manera temporal un catálogo de instrumentos musicales (del dominio obligatorio requerido). La aplicación implementa una carga asíncrona de datos desde un archivo JSON local, maneja rutas estáticas y dinámicas con parámetros, procesa consultas de filtrado, interpreta cuerpos en formato JSON mediante un middleware, y responde con los códigos de estado HTTP adecuados de acuerdo con el ciclo de vida de una arquitectura cliente-servidor.

---

## Instalación

Para poner en marcha el entorno de desarrollo en tu computadora, asegúrate de tener instalado [Node.js](https://nodejs.org/). Sigue estos pasos:

1. Clona o descarga el repositorio del proyecto en tu equipo y abre una terminal en la carpeta raíz.
2. Ejecuta el comando de instalación de dependencias provisto por NPM:


```bash
npm install

```


Este comando lee el archivo `package.json` y descarga los paquetes necesarios (en este caso, **Express**) dentro de la carpeta `node_modules`.



---

## Ejecución

Una vez instaladas las dependencias, puedes iniciar la aplicación ejecutando:

```bash
npm start

```

* **¿Qué ocurre internamente?** El script ejecuta el comando configurado `"node src/index.js"`. La aplicación lee de forma asíncrona el archivo de datos (`datos/instrumentos.json`) y, solo después de obtenerlos correctamente, levanta el servidor Express.


* **Cómo detener el servidor:** Si necesitas apagar el servidor en ejecución, simplemente presiona las teclas **`Ctrl + C`** en tu terminal. Esto detendrá el proceso activo de Node.js.



---

## Endpoints

La API cuenta con los siguientes puntos de acceso (*endpoints*) definidos para interactuar con los recursos:

* **`GET /`**
* **Descripción:** Ruta raíz que entrega un mensaje de bienvenida informando que la API se encuentra disponible.




* **`GET /api/instrumentos`**
* **Descripción:** Devuelve el listado completo de todos los instrumentos musicales.


* **Parámetro de consulta opcional (`?familia=...`):** Permite filtrar los resultados por la familia del instrumento (por ejemplo, `cuerda`, `viento`, `percusion`). La comparación no distingue entre mayúsculas y minúsculas. Si no encuentra coincidencias, devuelve un arreglo vacío `[]` con estado `200`.




* **`GET /api/instrumentos/:id`**
* **Descripción:** Busca y devuelve el detalle de un instrumento específico seleccionado mediante su identificador único numérico (`id`).




* **`POST /api/instrumentos`**
* **Descripción:** Permite registrar y agregar un nuevo instrumento de forma temporal en la memoria del servidor.





---

## Ejemplos de solicitudes

Puedes probar los siguientes ejemplos utilizando cualquier cliente HTTP (como Postman, Thunder Client o cURL):

1. **Obtener la bienvenida:**
* **Método y URL:** `GET http://localhost:3000/`



2. **Listar todos los instrumentos:**
* **Método y URL:** `GET http://localhost:3000/api/instrumentos`



3. **Filtrar instrumentos por familia:**
* **Método y URL:** `GET http://localhost:3000/api/instrumentos?familia=cuerda`



4. **Obtener el detalle de un instrumento por su ID:**
* **Método y URL:** `GET http://localhost:3000/api/instrumentos/1`



5. **Crear un nuevo instrumento (Solicitud POST):**
* **Método y URL:** `POST http://localhost:3000/api/instrumentos`

* **Encabezados obligatorios:** `Content-Type: application/json`

* **Cuerpo de la solicitud (JSON):**
```json
{
  "nombre": "Ukelele",
  "familia": "Cuerda",
  "origen": "Hawái",
  "descripcion": "Instrumento de cuatro cuerdas pulsadas, derivado del braguinha portugués.",
  "disponible": true
}

```





---

## Códigos de estado

La API utiliza códigos de estado HTTP estandarizados para comunicar el resultado de cada operación de manera clara:

* **`200 OK`**: Se utiliza en solicitudes exitosas de lectura (como la bienvenida, la obtención del listado general, la aplicación de filtros con o sin resultados, y la consulta de un detalle existente).


* **`201 Created`**: Se emplea exclusivamente cuando una solicitud `POST` procesa correctamente los datos y añade un nuevo recurso de manera exitosa.


* **`400 Bad Request`**: Se devuelve si el cliente envía una solicitud de creación (`POST`) omitiendo alguno de los campos obligatorios o si el valor de disponibilidad (`disponible`) no está definido (`undefined`). El servidor rechaza la inserción.


* **`404 Not Found`**: Se dispara cuando se intenta consultar un recurso específico mediante un identificador de ruta (`:id`) que no existe en la colección.



---

## Persistencia de los datos

Para comprender cómo maneja la información este sistema, es importante tener en cuenta los siguientes conceptos clave de arquitectura y Node.js:

* **Diferencia entre parámetro de ruta y consulta:**
* El **parámetro de ruta** (ej. `/api/instrumentos/:id`) forma parte fija de la estructura del endpoint y se usa para identificar y apuntar a un recurso único y específico.


* El **parámetro de consulta o *query string*** (ej. `?familia=viento`) se añade al final de la URL mediante un signo de interrogación y se utiliza para modificar, filtrar u ordenar opcionalmente los datos de una colección sin alterar la ruta principal.




* **Función de `express.json()`:**
* Es un middleware integrado de Express que actúa como un intérprete previo. Su labor consiste en interceptar las solicitudes entrantes que poseen un cuerpo en formato JSON (`Content-Type: application/json`), analizarlas y transformarlas en un objeto JavaScript accesible mediante `req.body`. Sin esta función, los datos enviados en un `POST` llegarían como `undefined`.




* **Por qué las creaciones desaparecen al reiniciar:**
* La aplicación realiza una lectura inicial de los datos almacenados en el archivo `datos/instrumentos.json` volcándolos a un arreglo temporal en la memoria RAM del servidor. Cuando se ejecuta un `POST`, el nuevo elemento se añade únicamente a ese arreglo en memoria mediante un método de inserción (`push`).


* Como la aplicación **no sobreescribe** ni modifica el archivo físico del disco, el almacenamiento opera de forma volátil. Al detener y reiniciar el servidor (`npm start`), la memoria RAM se limpia y el proceso vuelve a cargar el archivo JSON original, por lo que cualquier instrumento creado de forma temporal se pierde.