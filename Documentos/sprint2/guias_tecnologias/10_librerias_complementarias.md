# Guía sobre las Librerías Complementarias en mediCampo v2

Este documento explica qué son y para qué sirven las librerías más importantes que usamos en mediCampo v2, más allá de los frameworks principales que ya cubrimos en sus propias guías. La idea es que cualquier integrante del equipo entienda qué hace cada dependencia listada en los archivos package.json del frontend y del backend, dado que conocer las herramientas que componen el proyecto es fundamental para defender el trabajo realizado durante la revisión.

## Cómo funcionan las dependencias en JavaScript

Antes de entrar en cada librería específica, conviene recordar cómo funciona el ecosistema de dependencias en el mundo JavaScript. Cuando construimos una aplicación moderna, no escribimos todo desde cero, sino que aprovechamos librerías de terceros que resuelven problemas comunes. Estas librerías se distribuyen a través de npm (Node Package Manager), que es el registro público más grande del mundo con más de dos millones de paquetes disponibles.

Cada proyecto JavaScript tiene un archivo llamado package.json que lista las dependencias que usa, junto con sus versiones específicas. Hay dos categorías principales, esto es, las dependencias (las librerías que la aplicación necesita para funcionar en producción) y las devDependencies (las librerías que solo se usan durante el desarrollo, como compiladores o herramientas de testing).

Cuando un nuevo desarrollador clona el repositorio, ejecuta npm install y npm descarga automáticamente todas las dependencias listadas en package.json hacia una carpeta llamada node_modules. Esta carpeta es muy grande (puede tener decenas de miles de archivos) y por eso nunca se sube al repositorio Git, dado que se puede regenerar en cualquier momento con npm install.

## Librerías del frontend

A continuación describimos las librerías más importantes del frontend de mediCampo v2.

### react y react-dom

Como ya cubrimos en su propia guía, React es la librería central de nuestro frontend. El paquete react contiene el motor de React (la lógica de componentes, hooks y estado), mientras que react-dom contiene las funciones específicas para renderizar componentes de React dentro del DOM del navegador. Ambos paquetes se instalan juntos y trabajan en conjunto.

### react-router-dom

Esta es la librería de enrutamiento más usada en el ecosistema de React. Permite manejar la navegación entre las distintas pantallas de la aplicación sin recargar la página completa, lo cual es la base de las Single Page Applications.

En mediCampo v2 la usamos en App.tsx para definir todas las rutas, esto es, qué componente se renderiza en cada URL. Por ejemplo, la ruta / muestra la pantalla principal, /reserva muestra el componente ReservaCita, /dashboard-paciente muestra el DashboardPaciente, y /room/:roomId muestra el componente Videollamada con un parámetro variable.

Los hooks que importamos de esta librería incluyen useNavigate (para redirigir programáticamente entre rutas) y useParams (para acceder a los parámetros variables de la URL). También importamos el componente Navigate (para redirecciones declarativas) y HashRouter (que es la variante de router que usa el hash de la URL para navegar, lo cual evita problemas en hostings estáticos).

### lucide-react

Esta es una librería de íconos vectoriales (en formato SVG) optimizada para React. Lucide es un fork moderno y mantenido del proyecto Feather Icons, con más de 1500 íconos disponibles cubriendo todas las categorías comunes (acciones, navegación, comunicación, sistema, multimedia, etcétera).

Cada ícono se importa por su nombre y se usa como un componente normal de React, esto es, podemos hacer import { Mail, Lock, Calendar } from lucide-react y luego usar Mail className=algo barra como cualquier otro componente. Las props que aceptan los íconos incluyen size para el tamaño en píxeles, color para el color (aunque también responden a las clases text- de Tailwind), strokeWidth para el grosor del trazo, y className para clases CSS adicionales.

En mediCampo v2 usamos decenas de íconos distintos a lo largo de la aplicación. Por ejemplo, en Login.tsx usamos Mail, Lock, ArrowRight, HeartPulse y Loader2. En DashboardMedico.tsx usamos Video, FileText, Clock, CheckCircle2, Stethoscope y muchos más.

### @livekit/components-react

Este es el SDK oficial de LiveKit para React, que provee componentes prediseñados y hooks para construir interfaces de videollamada con muy poco código. Como ya cubrimos en la guía de LiveKit, los componentes principales que usamos son LiveKitRoom (el contenedor principal de la sala), RoomAudioRenderer (que reproduce el audio de los participantes), GridLayout (que organiza visualmente los participantes), ParticipantTile (que renderiza cada participante) y varios hooks como useTracks, useLocalParticipant y useRoomContext.

### @livekit/components-styles

Este es un paquete complementario que provee los estilos CSS por defecto para los componentes de @livekit/components-react. Lo importamos al inicio de Videollamada.tsx con la línea import @livekit/components-styles. Esto nos da un punto de partida visual que luego podemos personalizar con clases adicionales.

### livekit-client

Este es el SDK base de LiveKit para JavaScript del lado del cliente, que es usado internamente por @livekit/components-react pero también podemos usarlo directamente cuando necesitamos acceso más fino a las APIs. De este paquete importamos las clases Track, Room y RoomEvent que son los tipos centrales del SDK.

### lucide-react versus react-icons

Vale la pena mencionar que existen otras librerías de íconos populares como react-icons, que es un paquete que agrega múltiples colecciones de íconos (Font Awesome, Material Icons, Bootstrap Icons, etcétera) en una sola librería. La razón por la que elegimos lucide-react es que sus íconos son más coherentes visualmente entre sí, dado que vienen de una sola colección, y el bundle final es más pequeño porque solo incluimos los íconos que efectivamente usamos.

### tailwindcss

Como cubrimos en su propia guía, TailwindCSS es el framework de utilidades CSS que usamos para los estilos. Si bien técnicamente Tailwind se ejecuta en el pipeline de compilación (no en el runtime del navegador), está listado como devDependency dado que se necesita durante el desarrollo y la construcción del bundle final.

### vite

Vite es la herramienta de construcción que compila nuestro código TypeScript y JSX a JavaScript ejecutable por el navegador. Fue creada por Evan You (el mismo creador de Vue.js) y se ha vuelto muy popular en el ecosistema React por ser dramáticamente más rápida que las alternativas tradicionales como Create React App o Webpack.

Vite tiene dos modos principales. En modo desarrollo (npm run dev), levanta un servidor local con hot module replacement, lo cual significa que cuando guardamos cambios en el código, el navegador se actualiza casi instantáneamente sin perder el estado de la aplicación. En modo construcción (npm run build), genera el bundle optimizado para producción, esto es, archivos minificados y comprimidos listos para servir desde un hosting estático.

### typescript

Es el compilador de TypeScript que transforma nuestro código .ts y .tsx en JavaScript estándar. Está listado como devDependency dado que solo se usa durante el desarrollo y la compilación. El archivo tsconfig.json en cada proyecto define las opciones del compilador, como el target de JavaScript a generar, las rutas de los módulos, los niveles de estricción del tipado y otros parámetros.

## Librerías del backend

A continuación describimos las librerías más importantes del backend de mediCampo v2.

### express

Como cubrimos en su propia guía, Express es el framework web minimalista que usamos para construir las rutas HTTP del backend. Es la librería más importante del lado del servidor.

### @prisma/client

Es el cliente generado por Prisma a partir de nuestro esquema, que usamos en los repositorios para hablar con la base de datos. Como cubrimos en la guía de Prisma, este cliente está completamente tipado en TypeScript y provee métodos como findUnique, findMany, create, update, delete y upsert para cada modelo definido en schema.prisma.

### prisma

Es la herramienta de línea de comandos de Prisma, listada como devDependency. Provee los comandos como prisma migrate dev, prisma generate y prisma studio. Solo se necesita durante el desarrollo, no en producción.

### bcryptjs

Como cubrimos en la guía de autenticación, es la librería que usamos para hashear las contraseñas de los usuarios. Las funciones principales son bcrypt.hash (para generar el hash al registrarse) y bcrypt.compare (para verificar la contraseña al iniciar sesión).

### jsonwebtoken

Como cubrimos en la guía de autenticación, es la librería que usamos para generar y verificar los tokens JWT. Las funciones principales son jwt.sign (para emitir un token al hacer login) y jwt.verify (para validar el token en el middleware protect).

### cors

CORS son las siglas de Cross-Origin Resource Sharing, esto es, un mecanismo de seguridad de los navegadores que controla qué dominios pueden hacer peticiones a nuestro backend. Por defecto, los navegadores bloquean las peticiones desde un dominio distinto al del servidor, lo cual es un problema cuando el frontend está en un dominio distinto al backend (que es nuestro caso).

La librería cors es un middleware de Express que agrega los headers HTTP necesarios para permitir las peticiones desde los dominios autorizados. En nuestro caso configuramos cors para permitir peticiones desde el dominio donde está desplegado el frontend, mediante la variable de entorno FRONTEND_URL.

### dotenv

Esta librería carga automáticamente las variables del archivo .env en process.env, esto es, el objeto global de Node.js que contiene las variables de entorno. La línea require('dotenv').config() al inicio del servidor hace que todas las variables del .env queden disponibles para el resto del código.

Las variables que cargamos incluyen DATABASE_URL, JWT_SECRET, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL, PORT y FRONTEND_URL.

### livekit-server-sdk

Este es el SDK oficial de LiveKit para Node.js, que usamos en el backend para generar los AccessToken que el frontend necesita para conectarse al servidor LiveKit. La clase principal que usamos es AccessToken, junto con métodos como addGrant para configurar los permisos del participante.

### typescript y ts-node

Son las herramientas que nos permiten escribir el backend en TypeScript. typescript es el compilador, mientras que ts-node permite ejecutar archivos .ts directamente sin tener que compilarlos primero. Durante el desarrollo usamos ts-node para arrancar el servidor con npm run dev, lo cual nos permite ver los cambios inmediatamente.

### nodemon

Es una herramienta de desarrollo que vigila los archivos del proyecto y reinicia automáticamente el servidor cuando detecta cambios. Esto evita tener que detener y reiniciar manualmente el servidor cada vez que modificamos algo. La configuración está en el script npm run dev del package.json.

### Tipos de TypeScript (@types/express, @types/cors, etc.)

Muchas librerías de JavaScript no incluyen sus propias definiciones de tipos para TypeScript, por lo cual hay que instalar paquetes separados con los tipos. Estos paquetes siguen la convención de empezar con arroba types barra seguido del nombre de la librería original.

Por ejemplo, @types/express provee las definiciones de tipos para Express, @types/cors para cors, @types/bcryptjs para bcryptjs, @types/jsonwebtoken para jsonwebtoken y @types/node para las APIs nativas de Node.js. Estos paquetes están todos en devDependencies, dado que TypeScript solo los necesita durante la compilación.

## Cómo se actualizan las dependencias

A medida que pasa el tiempo, las librerías que usamos van sacando nuevas versiones, ya sea con correcciones de bugs, mejoras de rendimiento, nuevas funcionalidades o parches de seguridad. Mantener las dependencias actualizadas es una práctica importante, aunque también hay que hacerlo con cuidado para no romper la aplicación.

Algunas herramientas que se pueden usar para gestionar actualizaciones son las siguientes.

npm outdated lista las dependencias que tienen versiones más nuevas disponibles, mostrando la versión actual, la versión sugerida y la última versión.

npm update actualiza las dependencias dentro del rango compatible definido en package.json (típicamente cambios menores y de parche).

npm install paquete arroba latest actualiza una dependencia específica a su última versión, aunque sea un cambio mayor que pueda requerir ajustes en el código.

npm audit revisa las dependencias en busca de vulnerabilidades conocidas y sugiere actualizaciones para corregirlas.

Para mediCampo v2, durante el Sprint 3 vamos a incorporar herramientas como Snyk que automatizan este proceso, alertándonos sobre vulnerabilidades y sugiriendo las versiones específicas a las cuales actualizar.

## Recursos para profundizar

Para cada librería específica, su sitio web oficial siempre es el mejor punto de partida. Algunos ejemplos.

react-router-dom tiene su sitio en reactrouter.com con tutoriales completos.

lucide-react tiene su catálogo de íconos en lucide.dev donde se pueden buscar y previsualizar.

livekit tiene su documentación en docs.livekit.io con guías específicas para React.

express tiene su sitio en expressjs.com con la referencia completa de su API.

prisma tiene tutoriales interactivos en prisma.io/docs.

bcryptjs y jsonwebtoken tienen sus repositorios de GitHub con los README documentando su uso básico.

Para descubrir nuevas librerías que podrían ser útiles en el futuro, sitios como npmjs.com (el registro oficial), bestofjs.org (que cura los proyectos más populares por categoría) y awesome-javascript en GitHub (listas curadas de librerías por tema) son excelentes referencias.

Una recomendación práctica es leer siempre los README de las librerías antes de incorporarlas al proyecto, dado que ahí suelen estar las instrucciones de instalación, los ejemplos de uso básico y las advertencias sobre incompatibilidades o consideraciones especiales.
