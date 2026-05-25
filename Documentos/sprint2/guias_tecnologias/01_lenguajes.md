# Guía sobre los Lenguajes Usados en mediCampo v2

Este documento explica desde cero qué son los lenguajes de programación que usamos en el proyecto mediCampo v2, comenzando por los conceptos más generales y avanzando hacia los detalles específicos que se aplican dentro del código. La idea es que cualquier integrante del equipo pueda leer esta guía y entender qué es cada lenguaje, para qué sirve, qué problema resuelve y cómo se usa concretamente dentro del proyecto. Está pensada como material de estudio, escrita con un tono cercano que evita la jerga innecesaria pero que mantiene la rigurosidad propia del trabajo académico.

## Por qué necesitamos varios lenguajes

Cuando se construye una aplicación web moderna como mediCampo v2, no basta con un solo lenguaje, dado que cada parte del sistema tiene necesidades distintas y, por lo mismo, se usa el lenguaje que mejor se adapta a esa parte. En nuestro proyecto convivieron principalmente cuatro lenguajes que se complementan entre sí, esto es, JavaScript junto con su variante tipada TypeScript para la lógica tanto del frontend como del backend, HTML para la estructura de las páginas, CSS para los estilos visuales y SQL para hablar con la base de datos. Cada uno tiene su propio rol y, en conjunto, permiten que el sistema funcione de manera coherente desde el navegador del usuario hasta el servidor remoto donde viven los datos.

## JavaScript

### Qué es JavaScript

JavaScript es un lenguaje de programación que nació en 1995 dentro del navegador Netscape, con el objetivo inicial de permitir que las páginas web tuvieran cierta interactividad, esto es, que pudieran responder a clics del usuario, validar formularios o mostrar mensajes dinámicos sin tener que recargar la página completa cada vez. Con los años, el lenguaje evolucionó muchísimo, dejando atrás aquella imagen de lenguaje juguete que tenía al principio y convirtiéndose en uno de los lenguajes más populares del mundo, usado hoy en día tanto para construir interfaces web como para servidores backend, aplicaciones móviles, herramientas de línea de comandos e incluso videojuegos.

JavaScript se ejecuta dentro de motores específicos que interpretan el código y lo traducen a instrucciones que la máquina puede entender. El motor más famoso es V8, creado por Google para el navegador Chrome, el cual también es la base de Node.js, que es el entorno que permite ejecutar JavaScript fuera del navegador.

### Por qué lo usamos en mediCampo v2

Usamos JavaScript (o más precisamente, su variante TypeScript) tanto en el frontend como en el backend del proyecto. En el frontend, JavaScript es el único lenguaje de programación que los navegadores entienden de forma nativa, por lo cual cualquier lógica interactiva que queramos ejecutar en el navegador del usuario tiene que estar escrita en JavaScript. En el backend, elegimos JavaScript (a través de Node.js) porque nos permite usar el mismo lenguaje en ambas capas del sistema, lo cual reduce la curva de aprendizaje del equipo, permite reusar código entre ambos lados y facilita la coordinación entre los integrantes.

### Conceptos básicos de JavaScript

Para entender cómo funciona JavaScript dentro de nuestro proyecto, conviene recordar algunos conceptos fundamentales del lenguaje.

Las variables son contenedores con nombre donde guardamos valores que cambian o se usan a lo largo del código. JavaScript moderno usa principalmente las palabras let y const para declarar variables, donde let permite reasignar el valor más adelante mientras que const indica que el valor no debe cambiar después de su asignación inicial. Por ejemplo, const email = juan@correo.com declara una variable inmutable, mientras que let contador = 0 declara una que se puede incrementar después.

Las funciones son bloques de código reutilizables que reciben datos de entrada (parámetros), ejecutan ciertas operaciones y opcionalmente devuelven un resultado. En JavaScript moderno se usan tanto las funciones tradicionales como las funciones flecha (arrow functions) que tienen una sintaxis más compacta. Por ejemplo, const sumar = (a, b) => a + b define una función flecha que recibe dos números y devuelve su suma.

Los objetos son colecciones de pares clave-valor que permiten agrupar datos relacionados bajo una misma estructura. Por ejemplo, const usuario = { nombre: Juan, edad: 30, email: juan@correo.com } crea un objeto con tres propiedades. Los objetos son fundamentales en JavaScript porque casi todo en el lenguaje es un objeto.

Los arreglos son listas ordenadas de elementos, útiles cuando queremos guardar una colección de valores del mismo tipo o naturaleza. Por ejemplo, const especialidades = [Medicina General, Cardiología, Pediatría] crea un arreglo con tres especialidades.

Las promesas son un mecanismo de JavaScript para manejar operaciones asíncronas, esto es, aquellas que toman tiempo en completarse como las peticiones a un servidor o las lecturas de archivos. Una promesa representa un valor que aún no está disponible pero que estará en algún momento futuro. En JavaScript moderno se usa la sintaxis async/await para trabajar con promesas de manera más legible, similar al código sincrónico tradicional.

### JavaScript dentro de mediCampo v2

En el frontend de mediCampo v2, JavaScript (a través de TypeScript y React) maneja toda la interactividad de la interfaz, esto es, los formularios donde el paciente ingresa sus datos, los botones que disparan acciones, las transiciones visuales entre pantallas y las peticiones a la API del backend. Por ejemplo, cuando el paciente presiona el botón Confirmar Reserva en el componente ReservaCita.tsx, una función de JavaScript construye un objeto con los datos de la cita, ejecuta una petición HTTP al backend usando fetch y maneja la respuesta para mostrar la pantalla de éxito o un mensaje de error según corresponda.

En el backend, JavaScript a través de Node.js y Express maneja todas las rutas HTTP que responden a las peticiones del frontend, ejecuta la lógica de negocio (como validar credenciales o crear citas) y se comunica con la base de datos PostgreSQL a través de Prisma. Por ejemplo, cuando llega una petición POST a /api/auth/login, una función de JavaScript busca al usuario en la base, compara la contraseña con bcryptjs, genera un JWT con jsonwebtoken y devuelve el token al cliente.

## TypeScript

### Qué es TypeScript

TypeScript es un lenguaje de programación creado por Microsoft en 2012 que se construye sobre JavaScript, agregándole un sistema de tipos estáticos. La idea fundamental es que mientras JavaScript es un lenguaje dinámico donde los tipos de las variables se determinan en tiempo de ejecución, TypeScript permite declarar los tipos de antemano y verifica que el código sea consistente antes de ejecutarlo. Esto se conoce técnicamente como tipado estático y aporta muchas ventajas, especialmente en proyectos medianos o grandes donde varios desarrolladores trabajan en el mismo código.

Es importante entender que TypeScript no reemplaza a JavaScript, sino que lo extiende. De hecho, TypeScript se compila a JavaScript antes de ejecutarse, lo cual significa que el código TypeScript se transforma en código JavaScript equivalente, el cual es lo que finalmente corre en el navegador o en Node.js. Esta compilación elimina las anotaciones de tipo y aplica algunas transformaciones para asegurar la compatibilidad con las distintas versiones de JavaScript.

### Por qué lo usamos en mediCampo v2

Elegimos TypeScript por varias razones que se complementan entre sí. La primera es la detección temprana de errores, dado que el compilador identifica inconsistencias de tipo antes de ejecutar el código, evitando errores comunes como pasar un string donde se esperaba un número o acceder a una propiedad que no existe en un objeto. La segunda razón es el autocompletado mejorado, dado que el editor de código (como Visual Studio Code) puede sugerir con precisión qué propiedades tiene un objeto, qué argumentos espera una función o qué métodos están disponibles para una variable, lo cual acelera mucho el desarrollo. La tercera razón es la documentación implícita, dado que los tipos sirven como una forma de documentación que vive dentro del propio código, permitiendo que cualquier integrante entienda rápidamente qué espera y qué devuelve cada pieza.

### Conceptos básicos de TypeScript

Los tipos primitivos son los tipos más simples del lenguaje, esto es, string para texto, number para números, boolean para verdadero o falso, null para ausencia intencional de valor y undefined para variables sin asignar. Por ejemplo, let nombre: string = Juan declara una variable que solo puede contener texto.

Las interfaces son contratos que definen la forma que debe tener un objeto, esto es, qué propiedades debe tener y de qué tipo es cada una. Por ejemplo, interface Usuario { id: number, name: string, email: string } define la estructura que cualquier objeto de tipo Usuario debe respetar.

Los tipos personalizados se crean con la palabra type y permiten dar nombre a estructuras de tipos complejas. Por ejemplo, type Rol = PATIENT o DOCTOR o ADMIN define un tipo que solo acepta uno de esos tres valores específicos.

Los genéricos permiten escribir funciones o componentes que trabajan con distintos tipos manteniendo la información de tipo. Por ejemplo, function primero T (arreglo: T[]): T { return arreglo[0] } define una función que toma un arreglo de cualquier tipo T y devuelve el primer elemento del mismo tipo.

### TypeScript dentro de mediCampo v2

En nuestro proyecto, TypeScript está presente tanto en el frontend como en el backend. En el frontend, lo usamos a través de archivos .tsx (que son archivos TypeScript con soporte para JSX, la sintaxis especial de React). Por ejemplo, en el componente DashboardMedico.tsx definimos una interfaz Appointment que describe la estructura de los datos de una cita, asegurando que cuando trabajemos con esa información, el editor nos avise si intentamos acceder a una propiedad que no existe.

En el backend, usamos archivos .ts para los controladores, servicios y repositorios. Por ejemplo, en authController.ts el tipo Request de Express está completamente tipado, lo cual nos permite saber exactamente qué propiedades tiene el objeto req sin tener que adivinar.

Adicionalmente, gracias a Prisma, los modelos de la base de datos también están tipados automáticamente, esto es, cuando hacemos prisma.user.findUnique, el resultado tiene el tipo User con todos los campos del modelo, evitando errores al acceder a campos inexistentes.

## HTML

### Qué es HTML

HTML son las siglas de HyperText Markup Language, esto es, lenguaje de marcado de hipertexto. Es el lenguaje fundamental de la web, encargado de definir la estructura y el contenido de las páginas, esto es, qué elementos contiene cada página y cómo se relacionan entre sí. HTML no es un lenguaje de programación en el sentido estricto, dado que no tiene lógica condicional, bucles ni variables, sino que es un lenguaje de marcado que usa etiquetas para describir cada parte del contenido.

Cada etiqueta HTML tiene un significado semántico, por ejemplo, h1 indica un título principal, p indica un párrafo, a indica un enlace, img indica una imagen y form indica un formulario. Los navegadores leen el HTML, construyen el árbol DOM (Document Object Model) y renderizan la página visualmente según las etiquetas encontradas.

### HTML dentro de mediCampo v2

En nuestro proyecto, no escribimos HTML directamente en la mayoría de los casos, sino que usamos JSX dentro de los componentes de React. JSX es una sintaxis que mezcla HTML con JavaScript dentro del mismo archivo, lo cual permite generar el HTML de forma dinámica según el estado de la aplicación.

Por ejemplo, en Login.tsx encontramos código como div className=contenedor form onSubmit=handleSubmit input type=email button type=submit, lo cual al final se traduce a HTML real cuando React renderiza el componente en el navegador. Las etiquetas que usamos son las mismas de HTML, pero con algunas diferencias menores en JSX, esto es, class se escribe className porque class es una palabra reservada de JavaScript, y los atributos usan camelCase en lugar de minúsculas con guiones.

Hay un único archivo HTML real en el frontend, esto es, index.html, el cual contiene el esqueleto mínimo de la página y un div con id root donde React monta toda la aplicación. Esto es típico de las Single Page Applications, donde el servidor solo entrega un HTML inicial casi vacío y JavaScript se encarga del resto.

## CSS

### Qué es CSS

CSS son las siglas de Cascading Style Sheets, esto es, hojas de estilo en cascada. Es el lenguaje que define cómo se ven las páginas HTML, controlando aspectos como los colores, las tipografías, los espaciados, los tamaños, las animaciones y la disposición de los elementos en la pantalla. Sin CSS, las páginas se verían como documentos planos en blanco y negro con tipografía por defecto, mientras que con CSS pueden adoptar cualquier aspecto visual imaginable.

CSS funciona mediante selectores y propiedades. Los selectores identifican qué elementos del HTML se quieren estilizar (por ejemplo, todos los párrafos, o un elemento con cierta clase), y las propiedades definen qué aspecto visual aplicar a esos elementos (por ejemplo, color rojo, fuente Arial, margen de 20 píxeles). La palabra cascada hace referencia a cómo se resuelven los conflictos cuando múltiples reglas aplican al mismo elemento, siguiendo un sistema de especificidad y orden.

### CSS dentro de mediCampo v2

En nuestro proyecto no escribimos CSS tradicional desde cero, dado que usamos TailwindCSS, que es un framework de CSS basado en clases utilitarias. Lo que esto significa en la práctica es que en lugar de escribir reglas CSS personalizadas en archivos separados, aplicamos clases predefinidas directamente en las etiquetas HTML/JSX.

Por ejemplo, en lugar de escribir un CSS como .boton-azul { background-color: blue; color: white; padding: 12px; border-radius: 8px } y luego aplicar class=boton-azul al botón, simplemente escribimos className=bg-blue-600 text-white p-3 rounded-lg directamente en el botón. Cada una de esas clases es una utilidad atómica que aplica una sola propiedad CSS específica.

Esta forma de trabajar acelera mucho el desarrollo, dado que no hay que andar saltando entre archivos HTML y CSS, ni inventar nombres para cada clase, ni preocuparse por que dos componentes pisen los estilos entre sí. Los detalles específicos de TailwindCSS se cubren en su propia guía.

## SQL

### Qué es SQL

SQL son las siglas de Structured Query Language, esto es, lenguaje de consulta estructurado. Es el lenguaje estándar para hablar con las bases de datos relacionales, permitiendo crear, leer, actualizar y eliminar registros, así como definir la estructura de las tablas y las relaciones entre ellas. SQL fue creado en los años 70 y, pese a su antigüedad, sigue siendo el lenguaje dominante en el mundo de las bases de datos relacionales hasta el día de hoy.

Las operaciones más comunes de SQL son CREATE para crear estructuras como tablas o bases, SELECT para leer datos, INSERT para agregar registros nuevos, UPDATE para modificar registros existentes, DELETE para eliminar registros y DROP para eliminar estructuras completas. Cada una de estas operaciones se construye como una sentencia que describe declarativamente qué se quiere hacer, dejando que el motor de la base se encargue de la forma más eficiente de ejecutarla.

### SQL dentro de mediCampo v2

En nuestro proyecto usamos PostgreSQL como base de datos, la cual entiende SQL estándar. Sin embargo, no escribimos SQL directamente en el código del backend, dado que usamos Prisma como ORM (Object-Relational Mapping), el cual traduce nuestras operaciones de JavaScript a consultas SQL automáticamente.

Por ejemplo, cuando escribimos prisma.user.findUnique donde email es juan@correo.com, internamente Prisma ejecuta una consulta SQL del tipo SELECT estrella FROM Usuario WHERE email igual a juan@correo.com. Si bien no escribimos esa consulta directamente, la base de datos sí la recibe y la procesa exactamente como lo haría con cualquier sistema basado en SQL puro.

SQL aparece directamente solo en los archivos de migración que Prisma genera automáticamente cuando hacemos cambios en el esquema. Estos archivos están en la carpeta prisma/migrations y contienen las sentencias SQL que se aplican a la base para crear o modificar las tablas. Por ejemplo, cuando definimos un nuevo modelo en schema.prisma y ejecutamos prisma migrate dev, se genera un archivo .sql con las sentencias CREATE TABLE correspondientes.

## Resumen visual de cómo se conectan los lenguajes

Para entender cómo se entrelazan los lenguajes en el flujo completo de mediCampo v2, conviene seguir mentalmente el recorrido de una petición típica.

El paciente abre la aplicación en su navegador y ve el HTML inicial (index.html) que carga el bundle de JavaScript compilado desde TypeScript. React monta los componentes (que mezclan JSX con JavaScript) y aplica los estilos definidos en las clases de TailwindCSS (que son CSS). El paciente completa el formulario de login y presiona el botón.

JavaScript en el navegador construye una petición HTTP con los datos del formulario y la envía al backend. El backend, escrito en TypeScript que corre sobre Node.js, recibe la petición a través de Express, valida los datos, llama a Prisma con una sentencia JavaScript que internamente se traduce a SQL, la base de datos PostgreSQL procesa la consulta y devuelve el resultado. El backend genera un JWT, lo envía como respuesta al navegador, y el navegador (con JavaScript) lo guarda en localStorage y redirige al dashboard correspondiente.

Como se puede ver, los cinco lenguajes (JavaScript/TypeScript, HTML, CSS, SQL) trabajan en conjunto durante cada interacción del usuario, cada uno aportando lo suyo dentro de la capa que le corresponde.

## Recomendaciones para quienes quieren profundizar

Para los integrantes del equipo que quieran profundizar en alguno de estos lenguajes después del cierre del proyecto, hay recursos accesibles y gratuitos disponibles. Para JavaScript y TypeScript, la documentación oficial de MDN Web Docs es excelente, así como el curso oficial de TypeScript en typescriptlang.org. Para HTML y CSS, MDN también es la referencia obligada, junto con el sitio web.dev de Google. Para SQL, PostgreSQL tiene su propia documentación muy completa en postgresql.org/docs, y hay tutoriales interactivos en sitios como sqlbolt.com o sqlzoo.net.

La buena noticia es que todos estos lenguajes tienen comunidades enormes y muchísimos recursos en español, por lo cual aprender más sobre ellos es completamente factible incluso fuera del contexto académico.
