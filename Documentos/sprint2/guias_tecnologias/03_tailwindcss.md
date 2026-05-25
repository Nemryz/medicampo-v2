# Guía sobre TailwindCSS en mediCampo v2

Este documento explica desde lo más básico qué es TailwindCSS, por qué lo elegimos para construir los estilos visuales del frontend de mediCampo v2 y cómo se usa concretamente dentro del código de cada componente. La idea es que cualquier integrante del equipo entienda no solo qué hace cada clase, sino también cuál es la filosofía detrás de este framework y por qué resulta tan productivo en proyectos de este tipo.

## Qué es TailwindCSS

TailwindCSS es un framework de CSS creado por Adam Wathan en 2017, que propone una manera distinta de escribir estilos en comparación con el enfoque tradicional. En lugar de definir clases personalizadas con nombres semánticos como .boton-primario o .tarjeta-paciente y luego aplicar reglas CSS sobre esas clases en un archivo separado, TailwindCSS provee miles de clases utilitarias atómicas, esto es, clases pequeñas que aplican una sola propiedad CSS cada una, las cuales se combinan directamente en el HTML para construir cualquier diseño deseado.

Por ejemplo, en el enfoque tradicional con CSS, escribiríamos algo como esto. Primero, en un archivo CSS aparte definimos la clase .boton-azul con propiedades como background-color azul, color blanco, padding 12 píxeles, border-radius 8 píxeles. Luego, en el HTML aplicamos esa clase con class igual a boton-azul al elemento botón.

En el enfoque de TailwindCSS, en cambio, escribimos directamente las utilidades en el HTML, esto es, className igual a bg-blue-600 text-white p-3 rounded-lg. Cada una de esas clases es una utilidad atómica predefinida que aplica una sola propiedad CSS específica, sin necesidad de crear archivos CSS personalizados.

## Por qué lo elegimos para mediCampo v2

La decisión de usar TailwindCSS en lugar de CSS tradicional o de otras alternativas como CSS Modules o styled-components se basó en varias razones que se complementan entre sí.

La primera razón es la velocidad de iteración, dado que no hay que andar saltando entre archivos HTML y CSS para hacer cambios visuales. Cuando queremos ajustar el padding de un botón, simplemente cambiamos el número de la clase directamente en el componente y vemos el resultado de inmediato.

La segunda razón es la consistencia visual, dado que las utilidades de Tailwind están basadas en un sistema de diseño coherente, con escalas predefinidas para los espaciados, los tamaños de tipografía, los colores y las sombras. Esto evita que terminemos con cinco tonos distintos de azul o con diez tamaños de padding ligeramente diferentes a lo largo de la aplicación.

La tercera razón es el rendimiento, dado que Tailwind incluye un mecanismo llamado purge o JIT (Just-In-Time) que elimina automáticamente todas las clases no utilizadas durante la compilación, dejando un bundle CSS final muy pequeño, típicamente entre 5 y 10 kilobytes, comparado con los cientos de kilobytes de frameworks completos como Bootstrap.

La cuarta razón es la mantenibilidad, dado que dos integrantes pueden trabajar en el mismo componente sin pisarse los estilos, esto es, los estilos están encapsulados dentro de cada componente y no afectan a otros componentes del sistema.

La quinta razón es la documentación, dado que Tailwind tiene una documentación oficial excepcional con buscador incorporado, lo cual hace que aprender y consultar las clases sea rapidísimo.

## Conceptos básicos del sistema de diseño

### Escala de espaciados

Tailwind usa una escala numérica para los espaciados (padding, margin, gap) donde cada número corresponde a una cantidad fija de píxeles. La escala estándar es la siguiente, esto es, 0 corresponde a 0 píxeles, 1 corresponde a 4 píxeles, 2 corresponde a 8 píxeles, 3 corresponde a 12 píxeles, 4 corresponde a 16 píxeles, 5 corresponde a 20 píxeles, 6 corresponde a 24 píxeles, 8 corresponde a 32 píxeles, 10 corresponde a 40 píxeles, 12 corresponde a 48 píxeles, 16 corresponde a 64 píxeles y así sucesivamente.

Las clases de espaciado siguen un patrón consistente, esto es, p- para padding (en todos los lados), px- para padding horizontal (izquierda y derecha), py- para padding vertical (arriba y abajo), pt- para padding-top, pb- para padding-bottom, pl- para padding-left y pr- para padding-right. La misma lógica aplica para margin con m-, mx-, my-, mt-, mb-, ml- y mr-.

Por ejemplo, className igual a p-4 aplica 16 píxeles de padding en los cuatro lados del elemento. className igual a px-6 py-3 aplica 24 píxeles de padding horizontal y 12 píxeles de padding vertical. className igual a mt-8 aplica 32 píxeles de margin solo arriba.

### Escala de colores

Tailwind define una paleta de colores con múltiples tonalidades para cada color. Los colores principales incluyen slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink y rose. Cada color tiene tonalidades del 50 al 950, donde 50 es el más claro y 950 es el más oscuro, con el 500 como tonalidad media.

Las clases de color siguen el patrón esto es, bg- para color de fondo, text- para color de texto, border- para color de borde. Por ejemplo, className igual a bg-emerald-500 aplica un verde esmeralda medio como color de fondo. className igual a text-gray-600 aplica un gris oscuro como color de texto. className igual a border-blue-200 aplica un azul claro como color de borde.

En mediCampo v2 usamos principalmente los colores emerald y cyan para las pantallas de autenticación (Login y Register), el color blue para los acentos del flujo de reserva, el color yellow para los estados pendientes, el color red para errores y acciones de rechazo y los colores gray para elementos neutros y textos.

### Tipografía

Tailwind controla la tipografía con varias familias de clases. Para el tamaño de fuente usamos text-xs (12 píxeles), text-sm (14 píxeles), text-base (16 píxeles), text-lg (18 píxeles), text-xl (20 píxeles), text-2xl (24 píxeles), text-3xl (30 píxeles), text-4xl (36 píxeles) y así hasta tamaños muy grandes.

Para el peso de la fuente usamos font-thin, font-light, font-normal, font-medium, font-semibold, font-bold y font-extrabold, que corresponden a los valores 100, 300, 400, 500, 600, 700 y 800 del peso CSS.

Para la alineación usamos text-left, text-center, text-right y text-justify. Para la altura de línea usamos leading-tight, leading-normal y leading-relaxed.

Por ejemplo, className igual a text-2xl font-bold text-gray-800 aplica un título grande, en negrita y de color gris muy oscuro.

### Layout con Flexbox y Grid

Tailwind tiene clases para usar tanto Flexbox como Grid, los dos sistemas modernos de layout en CSS.

Para Flexbox, las clases principales son flex (activa flexbox), flex-row o flex-col (dirección horizontal o vertical), items-start, items-center, items-end (alineación cruzada), justify-start, justify-center, justify-between, justify-around (alineación principal) y gap-4 (separación entre elementos).

Por ejemplo, className igual a flex items-center justify-between gap-4 crea un contenedor flexbox donde los elementos están centrados verticalmente, distribuidos con espacio entre ellos y con 16 píxeles de separación.

Para Grid, las clases principales son grid (activa grid), grid-cols-3 (define tres columnas) y gap-6 (separación entre celdas).

Por ejemplo, className igual a grid grid-cols-2 sm dos puntos grid-cols-3 lg dos puntos grid-cols-4 gap-4 crea una grilla que tiene 2 columnas en móvil, 3 columnas en pantallas medianas y 4 columnas en pantallas grandes.

### Diseño responsivo

Tailwind aplica un enfoque mobile first, esto es, las clases base aplican a todas las pantallas y los prefijos sm dos puntos, md dos puntos, lg dos puntos y xl dos puntos sobrescriben los estilos para pantallas más grandes. Los breakpoints estándar son sm para 640 píxeles, md para 768 píxeles, lg para 1024 píxeles y xl para 1280 píxeles.

Por ejemplo, className igual a text-base md dos puntos text-lg lg dos puntos text-xl hace que el texto sea de tamaño base en móvil, lg en tabletas y xl en escritorio.

### Estados interactivos

Tailwind soporta estados interactivos mediante prefijos como hover dos puntos, focus dos puntos, active dos puntos y disabled dos puntos.

Por ejemplo, className igual a bg-blue-600 hover dos puntos bg-blue-700 transition cambia el color de fondo de azul a azul más oscuro cuando el usuario pasa el cursor por encima, con una transición suave.

### Bordes, sombras y esquinas redondeadas

Tailwind tiene utilidades para todos los detalles visuales típicos. Para bordes usamos border (borde de 1 píxel en los cuatro lados), border-2 (2 píxeles), border-t (solo arriba), border-blue-500 (color del borde). Para sombras usamos shadow-sm, shadow, shadow-md, shadow-lg, shadow-xl, shadow-2xl que aplican sombras de distinta intensidad. Para esquinas redondeadas usamos rounded-sm, rounded, rounded-md, rounded-lg, rounded-xl, rounded-2xl, rounded-3xl, rounded-full que aplican distintos radios.

## Ejemplos reales de mediCampo v2

### El botón principal de Login

En el componente Login.tsx, el botón Iniciar Sesión tiene las siguientes clases, esto es, w-full mt-8 py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover dos puntos from-emerald-400 hover dos puntos to-cyan-400 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500 barra 25 transition-all duration-300 flex items-center justify-center space-x-2 group active dos puntos scale-corchete punto 98 corchete disabled dos puntos opacity-70 disabled dos puntos cursor-not-allowed.

Desglosando cada parte. w-full hace que el botón ocupe todo el ancho disponible. mt-8 le da 32 píxeles de margen arriba. py-3.5 px-4 aplica padding vertical de 14 píxeles y horizontal de 16 píxeles. bg-gradient-to-r from-emerald-500 to-cyan-500 crea un fondo con gradiente horizontal de verde a cyan. hover dos puntos from-emerald-400 hover dos puntos to-cyan-400 cambia el gradiente a tonos más claros al pasar el cursor. text-white pone el texto blanco. font-semibold lo pone en peso semi-bold. rounded-xl redondea las esquinas. shadow-lg shadow-emerald-500 barra 25 aplica una sombra grande con tinte verde translúcido. transition-all duration-300 hace que todas las transiciones sean suaves de 300 milisegundos. flex items-center justify-center space-x-2 centra el contenido horizontal y verticalmente con separación entre elementos. active dos puntos scale-corchete punto 98 corchete encoge ligeramente el botón al hacer clic. disabled dos puntos opacity-70 disabled dos puntos cursor-not-allowed ajusta la apariencia cuando el botón está deshabilitado.

Como se puede ver, lo que con CSS tradicional habría requerido escribir una clase personalizada con quizás 15 reglas, en Tailwind se logra directamente con clases utilitarias en el JSX.

### La tarjeta de cita pendiente en el dashboard

En el DashboardPaciente.tsx, las tarjetas de citas pendientes usan clases como bg-yellow-50 barra 30 border-yellow-100 border-dashed rounded-corchete 1 punto 5 rem corchete p-6 transition-all duration-300, lo cual crea una tarjeta con fondo amarillo muy claro y translúcido, borde amarillo claro punteado, esquinas redondeadas amplias, padding interno generoso y transiciones suaves para cualquier cambio.

### El gradiente de fondo del Login

El fondo oscuro del Login con sus dos gradientes circulares se construye con elementos absolutamente posicionados que tienen clases como absolute top-corchete menos 10 por ciento corchete left-corchete menos 10 por ciento corchete w-corchete 40vw corchete h-corchete 40vw corchete rounded-full bg-emerald-600 barra 20 blur-corchete 120 píxeles corchete mix-blend-screen animate-pulse pointer-events-none.

Esto posiciona el elemento absolutamente fuera del viewport visible (con valores negativos), le da dimensiones relativas al viewport (40vw significa 40 por ciento del ancho de la pantalla), lo hace circular con rounded-full, le aplica un color verde translúcido al 20 por ciento de opacidad, le pone un desenfoque masivo de 120 píxeles, lo combina con la pantalla usando mix-blend-screen, le aplica una animación pulse y desactiva los eventos de puntero para que no interfiera con los clics.

## Recomendaciones para trabajar con TailwindCSS

Una recomendación práctica es tener siempre abierta la documentación oficial de Tailwind en tailwindcss.com, dado que tiene un buscador rápido donde se puede encontrar cualquier clase. Otra recomendación es instalar la extensión Tailwind CSS IntelliSense en Visual Studio Code, la cual ofrece autocompletado inteligente de todas las clases disponibles y muestra previsualizaciones del color al pasar el cursor por encima.

Cuando una combinación de clases se repite mucho en el código, conviene extraer ese patrón como un componente reutilizable de React en lugar de copiar y pegar las clases. Por ejemplo, si todas las tarjetas siguen el mismo patrón visual, conviene crear un componente Tarjeta que encapsule esas clases y exponga las variaciones como props.

Para los integrantes que quieran profundizar, el sitio tailwindcss.com tiene tutoriales en video oficiales del creador del framework, junto con ejemplos de componentes prediseñados en tailwindui.com (algunos gratuitos y otros pagados) que sirven como inspiración para construir interfaces propias.
