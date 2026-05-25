# Guía sobre Node.js y Express en mediCampo v2

Este documento explica desde lo más básico qué son Node.js y Express, por qué los elegimos para construir el backend de mediCampo v2 y cómo se usan concretamente dentro del proyecto. La idea es que cualquier integrante del equipo entienda los fundamentos del lado del servidor de la aplicación, sin importar si ya tenía experiencia previa con desarrollo backend o si recién está descubriendo cómo funciona esta capa.

## Qué es Node.js

### El problema que resuelve

Tradicionalmente, JavaScript era un lenguaje que solo se ejecutaba dentro del navegador, esto es, dependía de un motor de JavaScript embebido en Chrome, Firefox o Safari para interpretar el código y producir interactividad en las páginas web. Esta restricción significaba que JavaScript no podía usarse para escribir programas que corrieran en servidores, herramientas de línea de comandos o cualquier otra cosa fuera del navegador. Para eso había que usar otros lenguajes como Python, Java, Ruby o PHP.

Esto cambió en 2009 cuando Ryan Dahl creó Node.js, esto es, un entorno de ejecución que tomó el motor V8 de JavaScript (el mismo que usa Chrome) y lo extrajo del navegador para poder ejecutarlo directamente en cualquier máquina, ya sea Windows, macOS o Linux. Adicionalmente, Node.js agregó APIs propias para tareas típicas del backend como leer archivos del disco, escuchar peticiones HTTP, manejar conexiones de red y trabajar con bases de datos.

El resultado fue revolucionario, dado que por primera vez los desarrolladores podían usar el mismo lenguaje tanto para el frontend (lo que ve el usuario en el navegador) como para el backend (lo que vive en el servidor), reduciendo la curva de aprendizaje y permitiendo compartir código entre ambas capas.

### Qué hace especial a Node.js

Una de las características más distintivas de Node.js es su modelo de ejecución basado en eventos y operaciones asíncronas no bloqueantes. Esto significa que cuando Node.js tiene que hacer una operación que toma tiempo (como leer un archivo o consultar una base de datos), no se queda esperando que termine para seguir con el resto del código, sino que continúa ejecutando otras cosas y solo procesa el resultado cuando este está listo, mediante callbacks, promesas o async/await.

Este modelo hace que Node.js sea muy eficiente para aplicaciones que manejan muchas conexiones simultáneas, como servidores web o APIs REST, dado que un solo proceso puede atender miles de peticiones concurrentes sin necesidad de crear un hilo separado para cada una.

### npm como gestor de paquetes

Junto con Node.js viene npm (Node Package Manager), que es el gestor de paquetes más usado en el mundo. npm permite instalar librerías de terceros con un solo comando, esto es, npm install seguido del nombre del paquete, descargando automáticamente el código necesario y sus dependencias.

El archivo package.json en la raíz de cada proyecto registra qué dependencias usa el proyecto, junto con sus versiones específicas. Esto permite que cualquier desarrollador clone el repositorio, ejecute npm install y obtenga exactamente las mismas dependencias que el resto del equipo.

En mediCampo v2 tenemos dos archivos package.json, esto es, uno en la carpeta frontend para las dependencias del lado del navegador (como React, react-router-dom, lucide-react) y otro en la carpeta backend para las dependencias del lado del servidor (como Express, Prisma, bcryptjs, jsonwebtoken).

## Qué es Express

### El framework minimalista para Node.js

Si bien Node.js incluye un módulo nativo llamado http que permite crear servidores web desde cero, en la práctica casi nadie lo usa directamente, dado que escribir un servidor robusto requiere mucho código repetitivo para tareas comunes como parsear el cuerpo de las peticiones, manejar las rutas, aplicar middlewares y servir archivos estáticos. Para resolver esto surgió Express, esto es, un framework minimalista que se construye sobre el módulo http de Node.js y simplifica enormemente la creación de aplicaciones web y APIs.

Express fue creado en 2010 y rápidamente se convirtió en el framework backend más popular del ecosistema Node.js, hasta el punto que se considera el estándar de facto para muchos proyectos. Su filosofía es proveer solo las funcionalidades fundamentales (enrutamiento, middlewares, manejo de peticiones y respuestas) sin imponer estructuras rígidas, dejando al desarrollador la libertad de organizar el código como prefiera.

### Conceptos básicos de Express

#### Rutas

Una ruta en Express es la combinación de un verbo HTTP (GET, POST, PUT, PATCH, DELETE) y una URL específica, junto con un handler que es la función que se ejecuta cuando llega una petición a esa combinación.

Por ejemplo, app punto get apertura paréntesis comilla barra api barra users comilla coma function open paréntesis req coma res cierra paréntesis llave res punto json open paréntesis open llave message dos puntos comilla hola comilla cierra llave cierra paréntesis cierra llave cierra paréntesis define una ruta que responde a peticiones GET en la URL /api/users devolviendo un JSON con el mensaje hola.

En nuestro proyecto, las rutas están organizadas en archivos separados dentro de la carpeta routes, por ejemplo authRoutes.ts contiene las rutas relacionadas con autenticación como /api/auth/register y /api/auth/login.

#### Middlewares

Los middlewares son funciones que se ejecutan antes de los handlers de las rutas y que pueden modificar la petición, modificar la respuesta o detener el flujo si algo no está en orden. Reciben tres parámetros, esto es, req (la petición), res (la respuesta) y next (una función que se llama para pasar al siguiente middleware o handler).

Los middlewares más comunes en Express son cors (que habilita el intercambio de recursos entre dominios distintos), express.json (que parsea automáticamente los cuerpos de las peticiones en formato JSON), express.urlencoded (que parsea cuerpos en formato URL-encoded) y los middlewares personalizados como el de autenticación.

En nuestro proyecto, el middleware más importante es protect en backend/src/middleware/authMiddleware.ts, el cual verifica el token JWT en el header Authorization de cada petición protegida. Si el token es válido, agrega el payload decodificado al objeto req como req.user y llama a next para continuar el flujo. Si el token es inválido o no existe, retorna un error 401 Unauthorized sin permitir que la petición llegue al handler.

#### Request y Response

Los objetos req y res representan respectivamente la petición HTTP entrante y la respuesta HTTP que el servidor va a enviar.

El objeto req tiene propiedades útiles como req.body (el cuerpo de la petición parseado), req.params (los parámetros variables de la URL como :id), req.query (los parámetros de query string como ?nombre=valor), req.headers (los headers HTTP) y req.user (que en nuestro caso contiene el usuario autenticado gracias al middleware protect).

El objeto res tiene métodos para construir y enviar la respuesta como res.json (envía una respuesta JSON), res.status (define el código de estado HTTP), res.send (envía cualquier tipo de respuesta) y res.redirect (redirige a otra URL).

### Códigos de estado HTTP

Cuando el servidor responde a una petición, incluye un código de estado HTTP que indica si la operación fue exitosa o si algo falló. Los códigos más comunes que usamos en mediCampo v2 son los siguientes.

200 OK significa que todo salió bien y la respuesta contiene los datos solicitados.

201 Created significa que se creó un recurso nuevo exitosamente, típico de los endpoints POST.

400 Bad Request significa que la petición tenía algún problema, por ejemplo datos faltantes o formato incorrecto.

401 Unauthorized significa que el usuario no está autenticado o el token es inválido.

403 Forbidden significa que el usuario está autenticado pero no tiene permisos para esta operación.

404 Not Found significa que el recurso solicitado no existe.

409 Conflict significa que la operación entra en conflicto con el estado actual, por ejemplo intentar registrar un email que ya existe.

500 Internal Server Error significa que algo falló en el servidor sin culpa del cliente.

## Node.js y Express dentro de mediCampo v2

### Estructura del backend

El backend de mediCampo v2 vive en la carpeta backend/ y está organizado siguiendo el patrón de arquitectura limpia con separación de capas. La estructura es la siguiente.

La carpeta src/ contiene todo el código fuente del backend. Dentro hay varias subcarpetas con responsabilidades específicas.

La subcarpeta routes/ contiene los archivos que definen los endpoints HTTP. Por ejemplo, authRoutes.ts define las rutas de autenticación, appointmentRoutes.ts las de citas, clinicalRoutes.ts las de historial clínico y livekitRoutes.ts las relacionadas con LiveKit.

La subcarpeta controllers/ contiene los controladores que reciben las peticiones, extraen los datos del req y delegan al servicio correspondiente. Su rol es manejar el aspecto HTTP de la operación sin meterse en la lógica de negocio.

La subcarpeta services/ contiene los servicios que implementan la lógica de negocio, esto es, las reglas y validaciones que definen cómo funciona cada operación. Por ejemplo, AuthService.ts contiene la lógica de validar credenciales y generar tokens, mientras que AppointmentService.ts contiene la lógica de crear citas y actualizar sus estados.

La subcarpeta repositories/ contiene los repositorios que abstraen las operaciones contra la base de datos. Por ejemplo, UserRepository.ts contiene métodos como findByEmail, create y findById que internamente usan Prisma para hablar con la base.

La subcarpeta middleware/ contiene los middlewares personalizados como el de autenticación.

La subcarpeta config/ contiene archivos de configuración como database.ts (el singleton de Prisma) y jwt.ts (la configuración de JWT).

El archivo server.ts es el punto de entrada del backend, donde se inicializa Express, se registran los middlewares globales como cors y express.json, se montan las rutas y se arranca el servidor escuchando en el puerto definido por la variable de entorno PORT.

### Ejemplo de flujo completo de una petición

Para entender cómo Node.js y Express trabajan en conjunto dentro de mediCampo v2, sigamos el ejemplo del flujo de inicio de sesión.

Paso uno, el frontend ejecuta fetch contra la URL del backend con el método POST, el header Content-Type igual a application/json y el cuerpo con el email y la contraseña en formato JSON.

Paso dos, Node.js recibe la petición HTTP entrante y la pasa a Express. Express ejecuta primero los middlewares globales, esto es, cors verifica que el origen sea válido y express.json parsea el cuerpo de la petición convirtiéndolo en un objeto JavaScript accesible mediante req.body.

Paso tres, Express identifica que la URL /api/auth/login y el método POST coinciden con una ruta definida en authRoutes.ts, por lo cual ejecuta el handler correspondiente que está en authController.ts.

Paso cuatro, el controlador authController extrae el email y la contraseña de req.body, llama al método login del AuthService pasándole estos datos y espera el resultado.

Paso cinco, el AuthService llama al UserRepository.findByEmail para buscar al usuario en la base. El repositorio ejecuta prisma.user.findUnique, lo cual internamente genera una sentencia SQL SELECT, la envía a PostgreSQL y espera la respuesta.

Paso seis, si el usuario existe, el AuthService usa bcrypt.compare para verificar que la contraseña ingresada coincida con el hash almacenado. Si coincide, genera el token JWT con jsonwebtoken.sign incluyendo en el payload el id, rol y nombre del usuario.

Paso siete, el AuthService devuelve un objeto con el token y los datos del usuario al controlador. El controlador llama a res.status(200).json pasándole ese objeto, lo cual hace que Express construya una respuesta HTTP con código 200 y cuerpo JSON.

Paso ocho, Node.js envía la respuesta de vuelta al navegador del frontend, donde el código de React la procesa, guarda el token en localStorage y redirige al dashboard correspondiente.

Todo este flujo, que involucra muchas piezas trabajando en conjunto, suele completarse en milisegundos cuando la conexión es buena.

### Variables de entorno

El backend usa variables de entorno para configurar valores sensibles o que varían entre ambientes (desarrollo, producción). Las variables están definidas en un archivo .env en la raíz de la carpeta backend, y se cargan usando la librería dotenv al inicio del servidor.

Las variables que usamos en mediCampo v2 son las siguientes. PORT es el puerto donde escucha el servidor (típicamente 3001). DATABASE_URL es la cadena de conexión a PostgreSQL que incluye usuario, contraseña, host y nombre de la base. JWT_SECRET es la clave secreta usada para firmar los tokens JWT. LIVEKIT_API_KEY y LIVEKIT_API_SECRET son las credenciales para hablar con el servidor de LiveKit. LIVEKIT_URL es la URL del servidor de LiveKit. FRONTEND_URL es la URL del frontend para configurar CORS correctamente.

Es muy importante que el archivo .env nunca se suba al repositorio Git, dado que contiene información sensible. Por eso está incluido en .gitignore.

## Recursos para profundizar

Para los integrantes que quieran aprender más sobre Node.js y Express, la documentación oficial es el mejor punto de partida. nodejs.org tiene tutoriales y referencia completa de las APIs de Node, mientras que expressjs.com tiene la documentación de Express con guías y ejemplos.

Para entender mejor los conceptos detrás del modelo asíncrono de Node.js, vale la pena leer sobre el event loop, dado que es el corazón del runtime y entenderlo aclara muchas cosas sobre por qué Node.js se comporta como se comporta.

Para los patrones de arquitectura limpia que usamos en el backend, hay libros y artículos sobre Clean Architecture aplicada a Node.js que valen mucho la pena, especialmente para proyectos que crecen en complejidad.
