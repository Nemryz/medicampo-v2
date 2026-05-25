# Guía sobre React en mediCampo v2

Este documento explica desde lo más básico qué es React, por qué es la pieza central del frontend de mediCampo v2 y cómo se usa concretamente dentro del proyecto. La idea es que cualquier integrante del equipo pueda leer esta guía y comprender los conceptos fundamentales, sin importar si ya tenía experiencia previa con React o si recién está conociendo la librería. Está escrita con un tono conversacional, evitando la jerga innecesaria pero entrando en el detalle suficiente para que cada concepto quede claro.

## Qué es React y por qué existe

React es una librería de JavaScript creada por Facebook (ahora llamada Meta) en 2013 para construir interfaces de usuario, esto es, todo lo que un usuario ve y toca cuando interactúa con una aplicación web. Surgió como respuesta a un problema concreto que enfrentaban los ingenieros de Facebook al construir interfaces complejas, donde mantener el estado de la página (los datos que se muestran, las animaciones, los formularios) en sincronía con lo que el usuario veía se volvía cada vez más difícil a medida que la aplicación crecía.

La idea fundamental de React es darle la vuelta al problema, esto es, en lugar de manipular directamente el DOM (la estructura de elementos HTML que el navegador renderiza) cada vez que algo cambia, se describe cómo debería verse la interfaz para un estado dado y React se encarga de actualizar el DOM cuando ese estado cambia. Esta inversión de control simplifica enormemente el desarrollo, dado que el programador piensa en términos de qué quiere mostrar, no de cómo cambiar lo que se está mostrando.

A día de hoy, React es la librería de interfaces más popular del mundo, usada por sitios tan diversos como Facebook, Instagram, Netflix, Airbnb, Discord y miles de aplicaciones empresariales. Su éxito se explica por la combinación de buena arquitectura, ecosistema gigantesco de librerías compatibles, comunidad muy activa y respaldo de una empresa grande como Meta.

## Conceptos fundamentales de React

### Componentes

El concepto central de React son los componentes, que son piezas reutilizables de interfaz que encapsulan tanto la apariencia visual como el comportamiento. Cada componente es una función de JavaScript (o TypeScript) que devuelve la descripción de cómo debe verse esa parte de la interfaz, escrita usando una sintaxis llamada JSX que mezcla HTML con JavaScript dentro del mismo archivo.

Por ejemplo, un componente básico podría verse así. Imaginemos que queremos crear un saludo, entonces escribimos una función llamada Saludo que recibe el nombre del usuario como prop y devuelve un h1 con el texto Hola seguido del nombre. Después, en otro lugar de la aplicación, podemos usar ese componente escribiendo Saludo nombre=Juan, lo cual hará que React renderice Hola Juan en la pantalla.

La belleza de los componentes es su composición, esto es, podemos construir componentes pequeños y simples, y combinarlos para formar componentes más grandes y complejos. Por ejemplo, una pantalla completa como el DashboardPaciente se compone internamente de un Navbar, un Header, una lista de TarjetaCita y un botón AgendarTeleconsulta, donde cada uno es un componente más pequeño que se puede entender de forma aislada.

### JSX

JSX es la sintaxis especial de React que permite escribir lo que parece HTML directamente dentro de JavaScript. Por ejemplo, podemos escribir const elemento es igual a div Hola mundo div barra, y eso se trata como una expresión válida de JavaScript que representa un elemento de la interfaz.

Hay algunas diferencias entre JSX y HTML puro que vale la pena mencionar. Primero, los atributos usan camelCase en lugar de minúsculas con guiones, esto es, escribimos onClick en lugar de onclick. Segundo, la palabra clave class se reemplaza por className, dado que class es una palabra reservada de JavaScript. Tercero, las etiquetas que no tienen contenido deben cerrarse explícitamente con una barra, esto es, br barra en lugar de simplemente br. Cuarto, podemos insertar expresiones de JavaScript dentro del JSX usando llaves, esto es, div Hola { nombre } div barra interpola el valor de la variable nombre.

### Props

Las props (abreviación de properties, propiedades en inglés) son la forma en que un componente padre le pasa datos a un componente hijo. Funcionan de manera similar a los atributos HTML, esto es, cuando usamos un componente escribimos los atributos directamente y el componente los recibe como un objeto en su parámetro de entrada.

Por ejemplo, si tenemos un componente Boton que recibe el texto y una función onClick, podemos usarlo así, esto es, Boton texto=Confirmar onClick={confirmarReserva} barra. Dentro del componente Boton, podemos acceder a esas props a través del parámetro de la función, esto es, function Boton({ texto, onClick }) { return button onClick=onClick texto button barra }.

Es importante destacar que las props son inmutables desde la perspectiva del componente hijo, esto es, el hijo no debe modificarlas, sino solo leerlas. Si el hijo necesita modificar algo, debe usar una función que el padre le haya pasado como prop, manteniendo así el flujo unidireccional de datos que caracteriza a React.

### Estado

El estado es la información interna de un componente que puede cambiar con el tiempo y que, cuando cambia, hace que el componente se vuelva a renderizar para reflejar el nuevo valor. Para manejar el estado en componentes funcionales, React provee el hook useState.

El uso típico es declarar el estado con una desestructuración, esto es, const corchete email coma setEmail cierra corchete es igual a useState (cadena vacía). Esto crea dos cosas, esto es, la variable email que contiene el valor actual del estado, y la función setEmail que permite actualizar ese valor. Cuando llamamos a setEmail con un nuevo valor, React se encarga de volver a renderizar el componente con el valor actualizado.

Por ejemplo, en el componente Login.tsx tenemos múltiples estados, esto es, email para el correo que el usuario va escribiendo, password para la contraseña, error para los mensajes de error y loading para indicar si la petición está en curso. Cada vez que cualquiera de estos valores cambia, el componente se vuelve a renderizar y la interfaz se actualiza automáticamente.

### Hooks

Los hooks son funciones especiales de React (todas empiezan con la palabra use) que permiten que los componentes funcionales accedan a características avanzadas como el estado, los efectos secundarios o el contexto. Son una de las características más importantes de React moderno, introducidas en la versión 16.8 para reemplazar las clases que se usaban anteriormente.

Los hooks más importantes que usamos en nuestro proyecto son los siguientes.

useState permite declarar variables de estado dentro de un componente, como ya se explicó arriba.

useEffect permite ejecutar código en momentos específicos del ciclo de vida del componente, como cuando se monta por primera vez, cuando alguna dependencia cambia o cuando se desmonta. Por ejemplo, en DashboardPaciente.tsx usamos useEffect para cargar las citas del paciente al montar el componente, ejecutando una sola vez la petición a la API gracias a que pasamos un array vacío como dependencias.

useContext permite acceder a un Context global desde cualquier componente, sin necesidad de pasarlo como prop a través de toda la jerarquía. Lo usamos para acceder al AuthContext que contiene la información del usuario autenticado.

useNavigate (del react-router-dom) devuelve una función que permite redirigir al usuario a otra ruta de la aplicación de forma programática. Lo usamos cuando, por ejemplo, queremos llevar al médico directamente a la sala de videollamada después de aceptar una cita.

useParams (también del react-router-dom) permite acceder a los parámetros variables de la URL. Por ejemplo, cuando la ruta es /room/:roomId, useParams nos da acceso al valor específico de roomId que el usuario está visitando.

### Context

El Context es una característica de React que permite compartir datos entre múltiples componentes sin tener que pasarlos manualmente como props a través de cada nivel de la jerarquía. Es ideal para datos globales como el tema visual, el idioma o la información del usuario autenticado.

En nuestro proyecto usamos el Context para el AuthContext, esto es, un contenedor global que mantiene el token JWT y el objeto usuario disponibles para toda la aplicación. Cualquier componente puede leer el usuario actual usando useContext, sin importar dónde esté ubicado en la jerarquía.

### Renderizado condicional

El renderizado condicional es la técnica de mostrar diferentes contenidos en la interfaz según el estado actual de la aplicación. Se logra usando operadores de JavaScript dentro del JSX, principalmente el operador ternario o el operador AND.

Por ejemplo, en ReservaCita.tsx mostramos diferentes pantallas según si la reserva fue exitosa o no, esto es, si success es verdadero entonces se renderiza la pantalla de confirmación, de lo contrario se renderiza el formulario de reserva. En el código se ve algo así como llave si success entonces JSX de éxito de lo contrario JSX de formulario.

### Manejo de eventos

React maneja los eventos del usuario (clics, cambios de texto, envíos de formulario) de manera similar a HTML pero con algunas diferencias. Los eventos en JSX usan camelCase, esto es, onClick en lugar de onclick, onChange en lugar de onchange, onSubmit en lugar de onsubmit. Los handlers son funciones de JavaScript que reciben un objeto evento del cual se pueden extraer datos relevantes como el valor de un input.

Por ejemplo, para manejar el cambio de texto en un input, escribimos input onChange={(e) => setEmail(e.target.value)} barra. Cada vez que el usuario escribe algo, se dispara onChange, recibimos el evento e, accedemos al nuevo valor con e.target.value y actualizamos el estado con setEmail.

## React dentro de mediCampo v2

### Estructura del frontend

El frontend de mediCampo v2 vive en la carpeta frontend/ y está organizado de la siguiente manera. La carpeta src/ contiene todo el código fuente, dividido en subcarpetas según el tipo de archivo. La subcarpeta components/ contiene todos los componentes reutilizables, organizados a su vez en subcarpetas temáticas como auth/ para los componentes de autenticación y dashboards/ para los dashboards diferenciados por rol. La subcarpeta context/ contiene los contextos globales como AuthContext. La subcarpeta lib/ contiene utilidades como la configuración de las llamadas a la API.

El archivo App.tsx es el componente raíz de la aplicación, donde se definen todas las rutas con react-router-dom y se aplican los guardianes de rutas con RoleRoute. El archivo main.tsx es el punto de entrada que monta la aplicación dentro del div con id root del index.html.

### Componentes principales construidos

A lo largo del Sprint 2 construimos varios componentes que conviene listar para tener una visión clara del trabajo realizado. Login.tsx es la pantalla de inicio de sesión con su formulario y manejo de estados. Register.tsx es la pantalla de registro con auto-login posterior. ReservaCita.tsx es la pantalla de reserva con el flujo de tres pasos. DashboardPaciente.tsx es el panel del paciente con sus citas próximas. DashboardMedico.tsx es el panel del médico con las cuatro secciones diferenciadas.

Todos estos componentes siguen los mismos patrones, esto es, usan hooks de React para manejar estado y efectos, aplican estilos con clases de TailwindCSS, importan íconos de Lucide React y se comunican con el backend mediante fetch contra los endpoints de la API.

### Flujo de datos típico en nuestro proyecto

Para entender cómo fluyen los datos en un componente típico de mediCampo v2, conviene seguir el ejemplo del DashboardPaciente. Cuando el componente se monta por primera vez, useEffect dispara una función que ejecuta una petición GET a /api/appointments/my-appointments con el token JWT en el header de autorización. Mientras la petición está en curso, el estado loading es verdadero y el componente muestra un mensaje Cargando.

Cuando la respuesta llega, los datos se guardan en el estado appointments mediante setAppointments, lo cual hace que el componente se vuelva a renderizar mostrando la lista de citas. La interfaz aplica un renderizado condicional según el estado de cada cita, esto es, las tarjetas PENDING se muestran con un diseño diferenciado respecto a las CONFIRMED.

Cuando el usuario presiona el botón Agendar Teleconsulta, el handler onClick ejecuta navigate apuntando a la ruta /reserva, lo cual desmonta el DashboardPaciente y monta el componente ReservaCita en su lugar.

## Recursos para profundizar en React

Para los integrantes del equipo que quieran aprender más sobre React, el sitio oficial react.dev tiene la documentación más actualizada y de mejor calidad, con tutoriales interactivos y ejemplos prácticos. También hay cursos gratuitos en plataformas como freeCodeCamp y YouTube en español que cubren desde lo más básico hasta temas avanzados. La comunidad de React en español es muy activa, con grupos en Discord y Telegram donde se pueden hacer preguntas y aprender de otros desarrolladores.

Una recomendación práctica es construir pequeños proyectos personales después de leer esta guía, dado que la mejor forma de aprender React (como cualquier tecnología) es escribiendo código real y enfrentando los problemas que surgen en la práctica. Algunos proyectos típicos para empezar son una lista de tareas, un contador, una calculadora simple o un consumidor de una API pública como la de Pokémon.
