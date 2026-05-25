# Guía de Estudio para los Integrantes del Equipo — Sprint 2 mediCampo v2

Esta guía está pensada para que cada integrante del equipo pueda llegar a la revisión presencial con el computador y a la interrogación oral con dominio claro de la parte que le corresponde, explicando con seguridad qué hizo, cómo lo hizo, por qué se eligieron ciertas decisiones técnicas y cómo se conecta su trabajo con el de los demás. El documento parte desde un nivel básico, asumiendo que algunos conceptos podrían no estar frescos, y va subiendo gradualmente hasta llegar al detalle específico que se podría preguntar durante la evaluación.

La idea es leer esta guía con calma antes de la revisión, repasar las partes que correspondan al rol asignado, y tener a mano los talking points para usarlos como referencia rápida. Si alguna pregunta sale fuera del libreto, los conceptos básicos cubiertos en las secciones iniciales deberían dar suficiente fundamento para improvisar una respuesta coherente sin perderse en tecnicismos.

## Parte general que todos deben dominar

Antes de entrar en lo específico de cada rol, hay algunos conceptos transversales que cualquiera del equipo podría tener que explicar, ya que la cátedra puede preguntarle a cualquier integrante sobre los aspectos generales del proyecto, sin respetar necesariamente la división de roles que el equipo definió internamente.

### Qué es mediCampo v2 y por qué existe

mediCampo v2 es una plataforma web de telemedicina pensada para zonas rurales de Chile, donde las personas tienen dificultades para acceder a médicos especialistas debido a las grandes distancias geográficas que las separan de los centros urbanos. La plataforma permite que un paciente se registre desde su casa, agende una cita con un médico disponible, espere la aprobación del profesional y, una vez aceptada la cita, se conecte a una videollamada segura para recibir su consulta médica, dejando luego un registro digital de la atención que puede consultar e imprimir posteriormente.

El proyecto nació como una refactorización completa de un prototipo inicial generado con la herramienta Bolt.new, el cual carecía de backend real, de base de datos persistente y de lógica de negocio funcional. Lo que el equipo construyó es una versión profesional y operativa del sistema, separada en frontend (lo que ve el usuario en el navegador) y backend (lo que vive en el servidor), conectados a una base de datos PostgreSQL alojada en la nube de DigitalOcean.

### Cómo está organizado el proyecto a nivel técnico

El proyecto está dividido en dos carpetas principales, esto es, frontend y backend, cada una con su propio package.json y sus propias dependencias, funcionando como dos proyectos npm independientes que se comunican entre sí a través de peticiones HTTP.

El frontend está construido con React, una librería de JavaScript para crear interfaces de usuario, junto con TypeScript para tener control de tipos, Vite como herramienta de compilación rápida, TailwindCSS para los estilos visuales y react-router-dom para manejar la navegación entre las distintas pantallas de la aplicación.

El backend está construido con Node.js como entorno de ejecución, Express.js como framework para crear las rutas HTTP, TypeScript para el control de tipos, Prisma como ORM para hablar con la base de datos PostgreSQL, bcryptjs para cifrar las contraseñas y jsonwebtoken para generar los tokens de autenticación.

Para la videollamada, el sistema usa LiveKit como tecnología de servidor de medios, desplegado en su propio servidor virtual de DigitalOcean (lo que se llama un Droplet), con Caddy gestionando el certificado SSL para que las conexiones sean seguras y DuckDNS proporcionando el subdominio gratuito medicampo-rtc.duckdns.org.

### Qué es Scrum y por qué lo usamos

Scrum es un marco de trabajo ágil para gestionar proyectos de software de manera incremental, dividiendo el trabajo en periodos cortos llamados sprints, donde el equipo se compromete a entregar un conjunto definido de funcionalidades al finalizar cada periodo. La filosofía detrás de Scrum es que en lugar de planificar todo el proyecto al principio (lo cual rara vez funciona porque los requisitos cambian), se planifica solo el siguiente sprint, se ejecuta, se revisa el resultado con los stakeholders y se ajusta el plan para el siguiente periodo.

Los elementos principales de Scrum que usamos en este proyecto son los siguientes. El Product Backlog es la lista completa de todas las historias de usuario del proyecto, ordenadas por prioridad. El Sprint Backlog es el subconjunto de historias que el equipo se comprometió a desarrollar en el sprint actual, junto con las tareas técnicas en que se descomponen. El Daily Scrum es la reunión diaria breve donde cada integrante reporta sus avances, sus próximos pasos y sus bloqueos. El Sprint Review es la presentación del trabajo realizado al final del sprint frente a los stakeholders. La Sprint Retrospective es la reunión interna del equipo donde se reflexiona sobre la dinámica de trabajo y se identifican mejoras para el siguiente periodo.

### Cuáles son los roles en Scrum y cómo los repartimos

En Scrum hay tres roles principales. El Scrum Master, que se encarga de moderar las reuniones, eliminar los obstáculos del equipo y velar por el cumplimiento del marco ágil. El Product Owner, que representa la voz del cliente y prioriza las historias del Backlog. El Equipo de Desarrollo, que es quien efectivamente construye el producto.

En nuestro caso, dado que somos un equipo pequeño de tres personas, Ignacio Ampuero asumió el rol de Scrum Master ad-hoc, mientras que los tres compartimos el rol de Equipo de Desarrollo. El rol de Product Owner es asumido implícitamente por la cátedra evaluadora, ya que es quien define los criterios de aceptación de las historias y entrega la retroalimentación al final de cada sprint.

### Cuáles fueron las historias del Sprint 2

El Sprint 2 abordó dos historias de usuario, esto es, HU3 (Registro e inicio de sesión del médico y de los usuarios) y HU4 (Reserva de teleconsulta con aceptación del médico e ingreso a la videollamada). Ambas historias se complementan entre sí, dado que sin la HU3 no hay usuarios autenticados que puedan agendar citas, y sin la HU4 no hay un mecanismo formal para que un paciente y un médico se encuentren en la sala de videollamada que ya existía desde el Sprint 1.

### Cuál fue el objetivo del Sprint 2

El objetivo formal del Sprint 2 fue habilitar el ciclo completo de acceso y agendamiento de teleconsultas dentro de la plataforma, de modo que un paciente rural pudiera registrarse, iniciar sesión, reservar una consulta con un médico disponible y, una vez aceptada por el profesional, ingresar junto a este a la sala de videollamada construida durante el Sprint 1. Este objetivo se cumplió, dado que al cierre del sprint el flujo end-to-end estaba operativo y demostrable.

---

## Sección para Ignacio Ampuero (Scrum Master ad-hoc + Infraestructura Backend + LiveKit + DigitalOcean)

### Resumen del rol

Ignacio asumió la coordinación general del equipo en calidad de Scrum Master ad-hoc, junto con la responsabilidad técnica de la infraestructura backend más sensible, esto es, el sistema de autenticación que persiste en el navegador, el sistema de protección de rutas según el rol del usuario, los endpoints de citas que requieren validación de propiedad, la integración con LiveKit para la generación del enlace de sala y la conexión final con el componente de videollamada, además del mantenimiento del despliegue en DigitalOcean durante todo el sprint.

### Conceptos básicos que Ignacio debe dominar

#### Qué es un Scrum Master y qué hace en este equipo

El Scrum Master es la persona dentro del equipo que se asegura de que el marco ágil se cumpla correctamente, moderando las reuniones diarias, ayudando a resolver bloqueos cuando aparecen y manteniendo la trazabilidad escrita de los acuerdos tomados. No es un jefe ni un gerente, sino un facilitador del proceso. En nuestro caso, Ignacio cumplió esta función ordenando los Daily Scrum dentro de los bloques de clase, registrando los reportes individuales y los bloqueos en el documento daily_scrum_sprint2.md, y coordinando las decisiones de reordenamiento cuando alguna tarea se desviaba del plan original.

#### Qué es LiveKit y cómo funciona

LiveKit es un servidor de medios de código abierto que implementa la arquitectura SFU (Selective Forwarding Unit), la cual permite que múltiples participantes intercambien flujos de audio y video en tiempo real de manera eficiente. La diferencia entre SFU y la arquitectura P2P (peer to peer) que usábamos antes con PeerJS es que en P2P cada participante envía su video directamente a cada otro participante, lo cual consume mucho ancho de banda cuando hay varios usuarios, mientras que en SFU cada participante envía su video una sola vez al servidor central, el cual se encarga de retransmitirlo a los demás participantes con la calidad adecuada para cada uno según su conexión.

La conexión a LiveKit se hace mediante WebRTC, que es el estándar web para comunicación en tiempo real entre navegadores. Para que un usuario pueda conectarse, el servidor LiveKit le exige un token JWT firmado con la clave maestra del servidor, el cual contiene los permisos específicos del participante (como canPublish para enviar video, canSubscribe para recibirlo) y una expiración limitada de diez minutos por seguridad.

#### Qué es DigitalOcean y qué hicimos ahí

DigitalOcean es un proveedor de servicios de nube similar a AWS o Azure pero más simple de usar, que ofrece servidores virtuales llamados Droplets y bases de datos administradas. Como equipo usamos los créditos del GitHub Student Pack para acceder a la plataforma sin costo. En nuestro caso desplegamos dos cosas, esto es, la base de datos PostgreSQL administrada (que es donde viven todos los datos de la aplicación) y el Droplet con el servidor LiveKit (que es donde corren las videollamadas).

#### Qué es Docker y por qué lo usamos

Docker es una tecnología de contenedores que permite empaquetar una aplicación junto con todas sus dependencias dentro de una imagen reutilizable, la cual se puede ejecutar de forma idéntica en cualquier máquina sin importar el sistema operativo. Esto nos permite que el servidor LiveKit funcione exactamente igual en el Droplet de DigitalOcean que en el computador local de un desarrollador, evitando los problemas clásicos de en mi máquina funcionaba pero en el servidor no.

#### Qué es Caddy y para qué lo usamos

Caddy es un servidor web moderno que automáticamente gestiona los certificados SSL/TLS necesarios para que un sitio sea accesible mediante HTTPS, conectándose con Let's Encrypt para emitir y renovar los certificados sin intervención manual. Lo usamos como proxy inverso delante del servidor LiveKit, de modo que las conexiones de los usuarios vayan cifradas a través del subdominio medicampo-rtc.duckdns.org.

#### Qué es DuckDNS

DuckDNS es un servicio gratuito de DNS dinámico que permite obtener un subdominio del tipo nombre.duckdns.org apuntando a una dirección IP específica, sin necesidad de comprar un dominio propio. Lo usamos para tener una URL estable y profesional para acceder al servidor LiveKit, esto es, medicampo-rtc.duckdns.org.

#### Qué es un JWT y por qué lo usamos

JWT son las siglas de JSON Web Token, que es un estándar para crear tokens digitales firmados criptográficamente que pueden ser verificados por el servidor sin necesidad de mantener una sesión en memoria. Cuando un usuario inicia sesión, el backend genera un JWT que contiene el id del usuario, su rol y su nombre dentro del payload, lo firma con una clave secreta y lo devuelve al cliente. En las peticiones siguientes, el cliente envía este token en el encabezado Authorization, y el backend verifica la firma para confirmar que el token es válido y no ha sido alterado.

#### Qué es localStorage y cómo lo usamos

localStorage es un almacenamiento del navegador que permite guardar pares clave-valor de forma persistente entre sesiones, esto es, que sobreviven al cierre del navegador. En nuestro caso, usamos localStorage para guardar el token JWT y el objeto usuario bajo las claves medicampo_token y medicampo_user, de modo que cuando el usuario recarga la página, la aplicación puede leer estos valores y restaurar automáticamente la sesión sin necesidad de pedir las credenciales otra vez.

### Tareas técnicas que Ignacio realizó en el Sprint 2

#### T03.6 — AuthContext con persistencia en localStorage

Esta tarea consistió en construir el contexto global de React que mantiene la información del usuario autenticado disponible para toda la aplicación. El AuthContext es básicamente una caja compartida donde se guarda el token JWT y el objeto usuario, junto con los métodos login y logout que permiten modificar este estado. La gracia de usar Context es que cualquier componente de la aplicación puede leer estos datos sin necesidad de recibirlos como props desde un componente padre, evitando lo que en React se conoce como prop-drilling.

La persistencia en localStorage se logró agregando dos efectos secundarios al contexto, esto es, uno que al iniciar la aplicación lee los valores almacenados y restaura la sesión si existen, y otro que cada vez que el método login es llamado, guarda los nuevos valores en localStorage. El método logout limpia el storage llamando a localStorage.removeItem para ambas claves.

Qué decir si preguntan sobre esto: el AuthContext es el cerebro de la autenticación del lado del cliente, mantiene la sesión activa entre recargas y permite que cualquier componente pueda acceder a los datos del usuario actual sin tener que pasarlos manualmente por toda la jerarquía.

#### T03.7 — RoleRoute como guardián de rutas

Esta tarea consistió en construir un componente de envoltura en React que verifica el rol del usuario autenticado antes de permitir que la ruta solicitada se renderice. El RoleRoute recibe como prop un array de roles permitidos y el componente hijo que se quiere proteger. Si el usuario no está autenticado, redirige al login. Si está autenticado pero su rol no está dentro del array permitido, redirige a la página principal. Si el rol coincide, simplemente renderiza el componente hijo.

Esto se usa en App.tsx para envolver las rutas sensibles, por ejemplo, la ruta /dashboard-medico está envuelta en un RoleRoute que solo permite el rol DOCTOR, mientras que /admin está envuelto en un RoleRoute que solo permite el rol ADMIN.

Qué decir si preguntan sobre esto: el RoleRoute es la primera capa de control de acceso del sistema, pero no es la única, dado que la seguridad real se valida también en el backend en cada endpoint, evitando que alguien que conozca la URL pueda saltarse el frontend.

#### T04.4 — Endpoint GET /api/appointments/my-appointments

Esta tarea consistió en construir un endpoint que retorna las citas del usuario autenticado, filtrando según su rol. Si el usuario es un paciente, devuelve las citas donde el patientId coincide con su id. Si el usuario es un médico, devuelve las citas donde el doctorId coincide con su id. Cada cita viene con los datos relacionados de la contraparte, esto es, el paciente ve el nombre y especialidad del médico, mientras que el médico ve el nombre y RUT del paciente.

Qué decir si preguntan sobre esto: este endpoint es la fuente de datos principal de los dos dashboards (DashboardPaciente y DashboardMedico), permitiendo que cada usuario vea solo las citas que le corresponden sin posibilidad de ver las de otros usuarios.

#### T04.5 — Endpoint PATCH /api/appointments/:id/status

Esta tarea consistió en construir el endpoint que permite al médico cambiar el estado de una cita, ya sea para aceptarla (CONFIRMED) o rechazarla (CANCELLED). La parte importante es la validación de propiedad, esto es, antes de actualizar el registro, el endpoint verifica que la cita exista y que su doctorId coincida con el id del usuario autenticado. Si no coincide, retorna un error 403 Forbidden, evitando que un médico cambie el estado de una cita que no le pertenece.

Qué decir si preguntan sobre esto: este endpoint es donde se materializa el control de acceso del lado del backend, garantizando que aunque alguien intente hacer una petición directa al endpoint con un id de cita ajeno, el sistema rechazará la operación.

#### T04.9 — Generación del meetingLink único

Esta tarea consistió en integrar la lógica que genera el identificador único de la sala de videollamada al momento de crear una cita. La técnica usada es combinar Math.random().toString(36).substring(7), lo cual produce una cadena alfanumérica corta y razonablemente única. Este identificador se almacena en la base de datos como parte del registro de la cita, en el campo meetingLink, con el formato /room/[hash].

Qué decir si preguntan sobre esto: el meetingLink es la pieza que une la cita con la sala de LiveKit, ya que el roomId que LiveKit usa internamente se deriva de este enlace, permitiendo que tanto el paciente como el médico converjan en la misma sala identificada por el mismo hash.

#### T04.10 — Navegación al meetingLink desde ambos dashboards

Esta tarea consistió en cablear los botones de ingreso a la sala tanto en el DashboardPaciente como en el DashboardMedico, usando el hook useNavigate de react-router-dom. Cuando el paciente presiona Ingresar a la Sala o el médico presiona Iniciar, se ejecuta navigate al meetingLink correspondiente, lo cual abre el componente Videollamada.tsx con el roomId correcto en la URL.

Qué decir si preguntan sobre esto: esta es la última pieza del cableado que cierra el bucle paciente-médico, dado que es lo que efectivamente lleva a ambos usuarios al mismo punto del sistema en el momento adecuado.

### Posibles preguntas y respuestas para Ignacio

Pregunta: Cómo asegura el sistema que solo el paciente y el médico de una cita pueden entrar a la sala?
Respuesta: La validación ocurre en dos lugares. Primero, el endpoint /api/livekit/token verifica que el userId del JWT autenticado corresponda al patientId o al doctorId de la cita asociada al roomId solicitado. Si no coincide, retorna un 403 sin entregar el token. Segundo, el servidor LiveKit en sí mismo verifica la firma del token con la clave maestra antes de aceptar la conexión, lo cual añade una segunda barrera.

Pregunta: Por qué eligieron LiveKit en lugar de seguir con PeerJS?
Respuesta: PeerJS implementa una arquitectura peer-to-peer que falla cuando hay redes con NAT estricto o firewalls corporativos, lo cual es muy común en el contexto rural. LiveKit, al ser un servidor SFU centralizado, resuelve este problema dado que todos los participantes se conectan al servidor en lugar de directamente entre ellos, además de permitir adaptación automática de la calidad del video según el ancho de banda disponible.

Pregunta: Cómo persisten los datos del usuario entre sesiones?
Respuesta: Usamos localStorage del navegador para guardar el token JWT y el objeto usuario bajo las claves medicampo_token y medicampo_user. Cuando la aplicación se carga, el AuthContext lee estos valores y restaura la sesión automáticamente. El método logout limpia el storage cuando el usuario cierra sesión.

Pregunta: Qué pasa si el token JWT expira durante el uso?
Respuesta: Cuando alguna petición recibe un 401 Unauthorized, el frontend redirige al usuario a la pantalla de login para que renueve su sesión. Los tokens tienen una duración limitada por seguridad, evitando que un token filtrado pueda usarse indefinidamente.

Pregunta: Cómo desplegaron el servidor LiveKit?
Respuesta: Levantamos un Droplet en DigitalOcean, instalamos Docker, ejecutamos el contenedor oficial de LiveKit con las credenciales API_KEY y API_SECRET configuradas como variables de entorno, configuramos Caddy como proxy inverso con certificado SSL automático de Let's Encrypt, y apuntamos un subdominio gratuito de DuckDNS a la IP del Droplet, esto es, medicampo-rtc.duckdns.org. También abrimos los puertos necesarios en el firewall, principalmente el 443 TCP para WebSocket seguro y el rango 50000 a 60000 UDP para los flujos de medios RTP.

---

## Sección para Vicente Ramirez (Líder de Frontend, Diseño Visual, Dashboards, Flujo de Reserva)

### Resumen del rol

Vicente asumió el liderazgo del frontend del proyecto, encargándose de la construcción de todos los componentes visuales que el usuario ve en su navegador, esto es, las pantallas de Login y Register para entrar al sistema, los dashboards diferenciados para el paciente y el médico, y el componente de reserva de cita con su flujo de tres pasos. Toda esta construcción se realizó usando React con TypeScript como base, junto con TailwindCSS para los estilos y Lucide React para los íconos vectoriales.

### Conceptos básicos que Vicente debe dominar

#### Qué es React y por qué lo usamos

React es una librería de JavaScript creada por Facebook (ahora Meta) para construir interfaces de usuario mediante componentes reutilizables. La idea central es que en lugar de manipular directamente el DOM del navegador, se describe la interfaz como una jerarquía de componentes y React se encarga de actualizar el DOM cuando los datos cambian. Esto hace que el código sea más mantenible y que las interfaces sean más predecibles.

En nuestro caso usamos React porque es el estándar de facto para aplicaciones web modernas, tiene una comunidad enorme con muchísimas librerías compatibles, y se integra muy bien con TypeScript y con el ecosistema de Vite que usamos para compilar el proyecto.

#### Qué es TypeScript

TypeScript es un superset de JavaScript que añade un sistema de tipos estáticos, esto es, permite declarar qué tipo tiene cada variable, parámetro de función o propiedad de un objeto. La gracia es que el compilador de TypeScript detecta errores antes de ejecutar el código, evitando errores comunes como llamar a una función con argumentos del tipo equivocado. Al final, el código TypeScript se compila a JavaScript estándar para que el navegador lo entienda.

#### Qué es TailwindCSS

TailwindCSS es un framework de CSS basado en utilidades, lo cual significa que en lugar de escribir clases CSS personalizadas, se usan clases predefinidas directamente en el HTML para aplicar estilos. Por ejemplo, en lugar de crear una clase .boton-primario en un archivo CSS aparte, se aplican directamente las clases bg-blue-600 text-white px-4 py-2 rounded en el botón. Esto acelera mucho el desarrollo porque se evita el ida y vuelta entre archivos HTML y CSS, y mantiene los estilos cerca del componente al que pertenecen.

Las clases de Tailwind siguen una lógica predecible. Por ejemplo, bg- es para colores de fondo, text- es para colores y tamaños de texto, p- es para padding, m- es para margin, rounded- es para esquinas redondeadas, hover: es para estados de hover y así sucesivamente.

#### Qué es Lucide React

Lucide React es una librería de íconos vectoriales (en formato SVG) que se integra como componentes de React. Cada ícono se importa por su nombre, por ejemplo import Mail from lucide-react, y se usa como un componente normal con props para personalizar el tamaño y el color. En nuestro proyecto usamos íconos como HeartPulse (el latido del corazón para el logo), Mail (correo), Lock (candado), User (usuario), Calendar (calendario), Clock (reloj), CheckCircle2 (check verde), Video (videollamada), Stethoscope (estetoscopio) y muchos más.

#### Qué es react-router-dom

react-router-dom es una librería que permite manejar la navegación entre las distintas pantallas de una aplicación de React sin recargar la página completa, lo cual se conoce como Single Page Application o SPA. Define rutas asociadas a componentes, por ejemplo la ruta / muestra la pantalla principal, la ruta /reserva muestra el componente ReservaCita, y la ruta /room/:roomId muestra el componente Videollamada con un parámetro variable.

#### Qué es un componente de React y cómo se construye

Un componente de React es una función de JavaScript (o TypeScript) que retorna JSX, que es una sintaxis que mezcla HTML con JavaScript dentro del mismo archivo. Cada componente puede recibir datos desde fuera mediante props, mantener su propio estado interno mediante el hook useState, y reaccionar a eventos del usuario como clics o cambios de texto.

Por ejemplo, el componente Login.tsx es una función que retorna el JSX del formulario de inicio de sesión, mantiene en su estado interno el email y la contraseña que el usuario va escribiendo, y cuando el usuario presiona el botón Iniciar Sesión, ejecuta una función que envía una petición HTTP al backend.

#### Qué son los hooks de React

Los hooks son funciones especiales de React que permiten usar características como el estado o los efectos secundarios dentro de componentes funcionales. Los más comunes que usamos en este proyecto son los siguientes.

useState permite declarar una variable de estado, esto es, un valor que cuando cambia hace que el componente se vuelva a renderizar. Por ejemplo, const [email, setEmail] = useState('') declara una variable email que comienza vacía y una función setEmail que la actualiza.

useEffect permite ejecutar código en momentos específicos del ciclo de vida del componente, como cuando se monta por primera vez, cuando cambia algún valor o cuando se desmonta. Por ejemplo, useEffect(() => fetchDoctors(), []) ejecuta fetchDoctors una sola vez al montar el componente porque el array de dependencias está vacío.

useNavigate del react-router-dom devuelve una función que permite redirigir al usuario a otra ruta de la aplicación de forma programática. Por ejemplo, navigate('/dashboard-paciente') redirige al dashboard del paciente.

### Componentes que Vicente construyó en el Sprint 2

#### T03.4 — Login.tsx

Este componente es la pantalla por la que el usuario entra al sistema. Está ubicado en frontend/src/components/auth/Login.tsx. La interfaz tiene un fondo oscuro con dos gradientes circulares de colores emerald y cyan que dan una sensación moderna. En el centro hay una caja con efecto glassmorphism (translúcida con desenfoque del fondo) que contiene el ícono HeartPulse arriba, el título Bienvenido de vuelta y un formulario con dos campos, esto es, correo electrónico y contraseña, junto con un botón principal Iniciar Sesión.

Cuando el usuario completa los campos y presiona el botón, el componente ejecuta una petición HTTP de tipo POST al endpoint /api/auth/login enviando el correo y la contraseña en el cuerpo. Si el backend responde con éxito (status 200), el componente recibe el token JWT y el objeto usuario, los pasa al método login del AuthContext, y la aplicación redirige automáticamente al dashboard correspondiente al rol del usuario. Si el backend responde con error, se muestra una caja roja con el mensaje de error específico.

Qué decir si preguntan sobre esto: el Login es la puerta de entrada del sistema, está diseñado con una estética minimalista y moderna que transmite confianza, y se integra con el AuthContext mediante el método login para iniciar la sesión globalmente.

#### T03.5 — Register.tsx

Este componente es la pantalla para crear una cuenta nueva. Está ubicado en frontend/src/components/auth/Register.tsx. Mantiene la misma identidad visual del Login pero con cuatro campos en lugar de dos, esto es, Nombre Completo, RUT, Correo Electrónico y Contraseña. El gradiente del fondo se invierte respecto al Login (cyan arriba, emerald abajo) para diferenciar las pantallas pero manteniendo la coherencia.

La gracia del Register es que cuando el usuario completa el formulario y presiona Registrarse, no solo se ejecuta la petición POST a /api/auth/register, sino que inmediatamente después se ejecuta una segunda petición a /api/auth/login con las mismas credenciales recién creadas, dejando al usuario autenticado sin necesidad de pedirle que ingrese sus datos otra vez. Esto reduce la fricción para el paciente rural que podría no entender por qué tendría que iniciar sesión inmediatamente después de registrarse.

Qué decir si preguntan sobre esto: el Register tiene auto-login posterior al registro para optimizar la experiencia del usuario, especialmente pensando en el público objetivo que tiene baja alfabetización digital.

#### T04.6 — ReservaCita.tsx

Este componente es donde el paciente agenda una nueva teleconsulta. Está ubicado en frontend/src/components/ReservaCita.tsx. La interfaz tiene un layout dividido en tres pasos visualmente diferenciados.

El primer paso ocupa la columna izquierda y muestra una lista de tarjetas con los médicos disponibles, cada una con su nombre y especialidad. Las tarjetas se obtienen al cargar el componente mediante una petición GET a /api/appointments/doctors. Al hacer clic en una tarjeta, esta se marca como seleccionada con un borde azul y un leve efecto de escala.

El segundo paso ocupa la columna derecha superior y permite elegir la fecha de la consulta mediante un input nativo de tipo date, con un mínimo establecido en el día actual para impedir seleccionar fechas pasadas.

El tercer paso ocupa la columna derecha inferior y muestra una cuadrícula con los seis horarios disponibles, esto es, 09:00, 10:00, 11:30, 14:00, 15:30 y 17:00. Los botones están deshabilitados hasta que el usuario haya seleccionado una fecha, y el botón seleccionado se destaca con fondo azul y un efecto de escala.

Cuando los tres pasos están completos, se habilita el botón Confirmar Reserva. Al presionarlo, se ejecuta una petición POST a /api/appointments/book con el doctorId, la fecha y la hora seleccionadas. Si todo va bien, la pantalla cambia a un estado de éxito con un check verde grande y el mensaje Solicitud Enviada, junto con la indicación de que debe esperar la confirmación del médico.

Qué decir si preguntan sobre esto: el ReservaCita guía al paciente paso a paso con retroalimentación visual constante, asegurándose de que no pueda enviar la solicitud hasta tener todos los datos completos.

#### T04.7 — DashboardMedico.tsx

Este componente es la vista principal del médico tras iniciar sesión. Está ubicado en frontend/src/components/dashboards/DashboardMedico.tsx. La interfaz tiene un header con el nombre del médico en color emerald, una franja superior con cuatro tarjetas resumen (Consultas Hoy, Por Aprobar, Completadas, Próximas) y dos columnas principales.

La columna izquierda tiene dos secciones apiladas. La primera es Consultas de Hoy, donde aparecen las citas confirmadas para el día actual con un botón Iniciar a la derecha que lleva directamente a la sala. La segunda es Solicitudes Pendientes, donde aparecen las citas en estado PENDING con dos botones de acción, esto es, un botón verde con un check para aceptar, y un botón blanco con borde rojo y una X para rechazar.

La columna derecha tiene dos secciones también apiladas. La primera es Próximas Citas Confirmadas con las citas futuras en orden cronológico. La segunda es Atenciones Recientes con las últimas cinco citas completadas, cada una con enlace al historial clínico del paciente.

Cuando el médico acepta una cita programada para hoy, aparece un cuadro de diálogo nativo del navegador preguntando si quiere entrar de inmediato a la sala. Si confirma, se ejecuta navigate al meetingLink correspondiente, abriendo el componente Videollamada con el roomId correcto.

Qué decir si preguntan sobre esto: el DashboardMedico organiza la información en bloques claros según la prioridad temporal de las citas, permitiendo al médico identificar de un vistazo qué acciones puede tomar en cada momento.

#### T04.8 — DashboardPaciente.tsx

Este componente es la vista principal del paciente tras iniciar sesión. Está ubicado en frontend/src/components/dashboards/DashboardPaciente.tsx. La interfaz tiene un header con la bienvenida personalizada al paciente y un botón prominente Agendar Teleconsulta a la derecha.

Bajo el header hay una sección llamada Tu Agenda Próxima dentro de una caja blanca grande. Las tarjetas de cita tienen un diseño diferenciado según el estado, esto es, las tarjetas PENDING tienen fondo amarillo translúcido con borde punteado y un badge Esperando Médico, mientras que las tarjetas CONFIRMED tienen fondo blanco con borde sólido y un badge verde Confirmada junto con el botón Ingresar a la Sala.

Cada tarjeta muestra la fecha destacada en su sección izquierda (mes en azul, día grande en negro, hora en gris pequeño) y la información del médico con su especialidad en el resto del ancho.

Cuando no hay citas próximas, aparece un mensaje centrado con el ícono HeartPulse grande y el texto No tienes teleconsultas agendadas actualmente, invitando implícitamente al usuario a usar el botón de agendamiento.

Qué decir si preguntan sobre esto: el DashboardPaciente prioriza la próxima cita del usuario y usa colores claros y diferenciados para que el estado de cada cita sea reconocible de un vistazo, incluso para usuarios con baja alfabetización digital.

### Posibles preguntas y respuestas para Vicente

Pregunta: Por qué eligieron TailwindCSS en lugar de CSS tradicional o styled-components?
Respuesta: TailwindCSS nos permitió iterar muy rápido en el diseño visual sin tener que mantener archivos CSS separados, y como todas las clases son atómicas y predecibles, dos integrantes pueden trabajar en el mismo componente sin pisarse los estilos. Además, el bundle final es pequeño porque Tailwind elimina automáticamente las clases no usadas.

Pregunta: Cómo asegura el frontend que el paciente no vea las citas de otros pacientes?
Respuesta: El endpoint GET /api/appointments/my-appointments filtra automáticamente las citas por el id del usuario autenticado extraído del JWT, de modo que el backend nunca envía citas ajenas al frontend. Pero como capa adicional, las rutas protegidas con RoleRoute aseguran que solo los pacientes accedan al DashboardPaciente y solo los médicos accedan al DashboardMedico.

Pregunta: Qué pasa si la API tarda mucho en responder durante el registro?
Respuesta: Mientras la petición está en curso, el botón muestra un ícono de loading girando en lugar del texto, y el botón queda deshabilitado para evitar dobles envíos. Si la respuesta nunca llega, eventualmente el navegador genera un error de timeout y el componente muestra el mensaje de error correspondiente.

Pregunta: Cómo se comunican los componentes entre sí?
Respuesta: Usamos React Context para los datos globales como la sesión del usuario, esto es, el AuthContext expone el usuario y el token a cualquier componente que lo necesite. Para los datos específicos de una pantalla, los componentes hacen sus propias peticiones a la API mediante fetch dentro de useEffect.

Pregunta: Qué pasa cuando el paciente refresca la página estando dentro del flujo de reserva?
Respuesta: Si el flujo no había sido confirmado, las selecciones se pierden porque están guardadas en el estado del componente, no en localStorage. La cita solo se persiste cuando se presiona Confirmar Reserva. El AuthContext sí restaura la sesión, dado que el token y el usuario se mantienen en localStorage.

---

## Sección para James Honeymann (Backend de Autenticación, Modelos Prisma, Repositorios, Servicios y Migraciones)

### Resumen del rol

James asumió la construcción del backend en sus capas más fundamentales, esto es, los modelos de Prisma que definen la estructura de la base de datos, los endpoints REST de autenticación que permiten registrar e iniciar sesión, los endpoints de citas relacionados con la creación y el listado de doctores, los repositorios que hablan con la base de datos y los servicios que contienen la lógica de negocio. Adicionalmente, fue responsable de coordinar las migraciones de Prisma para sincronizar el esquema con la instancia de PostgreSQL alojada en DigitalOcean.

### Conceptos básicos que James debe dominar

#### Qué es Node.js

Node.js es un entorno de ejecución de JavaScript fuera del navegador, esto es, permite correr código JavaScript en el servidor en lugar de solo en el cliente. Esto nos da la ventaja de poder usar el mismo lenguaje tanto en el frontend como en el backend, lo cual reduce la curva de aprendizaje del equipo y permite reusar conocimiento entre ambas capas.

#### Qué es Express.js

Express es un framework minimalista para Node.js que facilita la creación de servidores HTTP y APIs REST. Permite definir rutas asociadas a funciones handler, registrar middlewares para procesar las peticiones antes de que lleguen a los handlers, y gestionar las respuestas de manera estructurada. En nuestro proyecto, todas las rutas del backend están definidas usando Express.

#### Qué es una API REST

REST son las siglas de Representational State Transfer, que es un estilo arquitectónico para construir APIs web. La idea es que las URLs identifican recursos (por ejemplo /api/appointments es el recurso citas) y los verbos HTTP indican qué operación se quiere hacer sobre ese recurso, esto es, GET para leer, POST para crear, PATCH para actualizar parcialmente, PUT para reemplazar y DELETE para eliminar. Las respuestas suelen ir en formato JSON.

#### Qué es Prisma y por qué lo usamos

Prisma es un ORM (Object-Relational Mapping) moderno para Node.js que permite trabajar con la base de datos usando objetos de JavaScript en lugar de escribir SQL a mano. La estructura de la base se define en un archivo llamado schema.prisma usando una sintaxis declarativa, y a partir de ahí Prisma genera automáticamente el cliente que se usa desde el código para hacer consultas.

Las ventajas son varias. Primero, los modelos están tipados, esto es, TypeScript sabe qué campos tiene cada entidad y avisa de inmediato si se intenta acceder a un campo inexistente. Segundo, las relaciones entre tablas se manejan de manera intuitiva con la notación de objetos anidados. Tercero, las migraciones se generan automáticamente comparando el estado actual del esquema con el último estado aplicado.

#### Qué es PostgreSQL

PostgreSQL es un sistema de gestión de bases de datos relacional de código abierto, conocido por ser robusto, estandarizado y altamente confiable. Lo elegimos porque está soportado nativamente por DigitalOcean como base de datos administrada, lo cual significa que DigitalOcean se encarga de los respaldos, las actualizaciones de seguridad y la alta disponibilidad sin que tengamos que preocuparnos por la operación.

#### Qué es bcryptjs y para qué se usa

bcryptjs es una librería que implementa el algoritmo de hashing bcrypt para contraseñas. La gracia es que en lugar de guardar la contraseña en texto plano en la base de datos (lo cual sería un riesgo de seguridad enorme), se aplica una función de hash que la transforma en una cadena irreversible. Cuando el usuario inicia sesión, no se compara la contraseña original, sino que se aplica la misma función de hash a lo que ingresó y se compara el resultado con lo que está almacenado.

El parámetro de salt rounds (en nuestro caso 10) controla qué tan costoso es computacionalmente generar el hash, esto es, mientras más alto el número, más segura es la contraseña pero más lenta es la operación. El 10 es un balance razonable entre seguridad y rendimiento.

#### Qué es jsonwebtoken y para qué se usa

jsonwebtoken es una librería que implementa el estándar JWT, permitiendo generar y verificar tokens firmados. En el endpoint de login, después de validar las credenciales del usuario, se llama a jwt.sign con el payload (id, rol, nombre) y la clave secreta del servidor, lo cual produce el token que se envía al cliente. En las peticiones siguientes, el cliente envía el token y el backend lo verifica con jwt.verify usando la misma clave secreta.

#### Qué es una migración de base de datos

Una migración es un script que describe un cambio en la estructura de la base de datos, por ejemplo crear una tabla nueva, agregar una columna a una tabla existente o modificar el tipo de un campo. Prisma genera estas migraciones automáticamente con el comando prisma migrate dev cuando detecta cambios en el archivo schema.prisma, y las guarda en la carpeta prisma/migrations como archivos SQL versionados.

La ventaja de tener migraciones versionadas es que cualquier desarrollador puede aplicar todas las migraciones a una base nueva y obtener exactamente el mismo esquema que tiene producción, sin necesidad de reconstruir manualmente la estructura. Además, las migraciones se pueden aplicar incrementalmente cuando se desplliega un cambio a producción.

### Tareas técnicas que James realizó en el Sprint 2

#### T03.1 — Modelo Prisma de User con roles

Esta tarea consistió en definir la estructura de la tabla User en el archivo backend/prisma/schema.prisma. Los campos incluidos son id (entero autoincremental, llave primaria), rut (string único), name (string), email (string único), password (string que almacena el hash), role (string con valor por defecto PATIENT), specialtyId (entero opcional con relación a Specialty para los médicos), createdAt y updatedAt (timestamps automáticos).

Una vez definido el modelo en el schema, se ejecuta prisma migrate dev para que Prisma genere la migración SQL correspondiente y la aplique en la base de datos de DigitalOcean. A partir de ese momento, el cliente de Prisma queda tipado con la estructura del modelo y se puede usar desde el código backend para hacer consultas como prisma.user.findUnique o prisma.user.create.

Qué decir si preguntan sobre esto: el modelo User es la base del sistema de autenticación y de los roles diferenciados, dado que el campo role determina qué puede hacer cada usuario dentro de la aplicación.

#### T03.2 — Endpoint POST /api/auth/register

Esta tarea consistió en implementar el endpoint que crea una nueva cuenta de usuario. La lógica está dividida en tres capas siguiendo el patrón de arquitectura limpia, esto es, el controlador (authController.ts) recibe la petición HTTP y delega al servicio, el servicio (AuthService.ts) contiene la lógica de validación y orquestación, y el repositorio (UserRepository.ts) ejecuta las operaciones contra Prisma.

El flujo es el siguiente. Primero, el servicio valida que no exista otro usuario con el mismo correo ni con el mismo RUT, consultando el repositorio. Si alguno existe, lanza un error con código 409 Conflict. Segundo, hashea la contraseña con bcryptjs usando 10 rounds de salt. Tercero, llama al repositorio para crear el nuevo registro con el rol PATIENT por defecto. Cuarto, retorna el objeto usuario sin el campo password para no exponer el hash.

Qué decir si preguntan sobre esto: el endpoint de registro implementa la separación de capas para mantener el código mantenible, valida la unicidad de los identificadores únicos y cifra la contraseña antes de persistirla.

#### T03.3 — Endpoint POST /api/auth/login

Esta tarea consistió en implementar el endpoint de inicio de sesión. El flujo es el siguiente. Primero, busca al usuario por correo en la base de datos. Si no existe, retorna un error 401 Unauthorized con un mensaje genérico (no se especifica si el problema es el email o la contraseña para evitar dar pistas a un atacante). Segundo, compara la contraseña recibida con el hash almacenado usando bcrypt.compare. Si no coincide, retorna el mismo error 401. Tercero, genera el token JWT firmado con la clave secreta del servidor, incluyendo en el payload el id del usuario (sub), su rol (role) y su nombre (name). Cuarto, devuelve el token junto con el objeto usuario al cliente.

La configuración del JWT, esto es, la clave secreta y la duración, está centralizada en backend/src/config/jwt.ts para facilitar cambios futuros.

Qué decir si preguntan sobre esto: el endpoint de login compara la contraseña ingresada con el hash almacenado, genera un JWT firmado y lo devuelve al cliente para que lo use en las peticiones siguientes.

#### T04.1 — Modelos Prisma de Specialty y Appointment

Esta tarea consistió en definir las tablas que soportan el agendamiento de citas. La tabla Specialty es simple, esto es, tiene id (entero autoincremental) y name (string único), junto con una relación inversa a User para los médicos asociados.

La tabla Appointment es más compleja. Tiene id, date (timestamp con la fecha y hora de la cita), status (string con valor por defecto PENDING), meetingLink (string que almacena el enlace único de la sala), createdAt y updatedAt. Tiene tres relaciones, esto es, patientId (entero que apunta a User), doctorId (entero que apunta a User) y una relación uno a uno con ClinicalRecord. Las relaciones nominales DoctorAppointments y PatientAppointments permiten distinguir desde el lado del User si la lista de citas que se quiere obtener es de las atendidas como médico o de las recibidas como paciente.

Una vez definidos los modelos, se ejecutó la migración correspondiente para aplicar los cambios en la base de datos de DigitalOcean.

Qué decir si preguntan sobre esto: los modelos de Specialty y Appointment soportan el flujo completo de agendamiento, con relaciones nominales que permiten consultar las citas desde cualquiera de los dos lados, esto es, paciente o médico.

#### T04.2 — Endpoint POST /api/appointments/book

Esta tarea consistió en implementar el endpoint que crea una nueva cita en el sistema. El flujo es el siguiente. Primero, el controlador recibe el doctorId y la fecha desde el cuerpo de la petición, junto con el patientId que se extrae del JWT autenticado. Segundo, el servicio genera el meetingLink único combinando Math.random().toString(36).substring(7). Tercero, el repositorio crea el registro en la tabla Appointment con estado PENDING por defecto. Cuarto, retorna la cita creada junto con su meetingLink al cliente.

Qué decir si preguntan sobre esto: el endpoint de book crea la cita en estado pendiente y genera el meetingLink único en el mismo paso, dejando la cita lista para ser aprobada por el médico.

#### T04.3 — Endpoint GET /api/appointments/doctors

Esta tarea consistió en implementar el endpoint que retorna la lista de todos los profesionales con rol DOCTOR junto con su especialidad anidada. La consulta usa prisma.user.findMany con un where que filtra por role igual a DOCTOR, y un include que trae la especialidad relacionada en la misma consulta para evitar el problema N+1.

Qué decir si preguntan sobre esto: el endpoint de doctors alimenta la grilla de selección del componente ReservaCita en el frontend, permitiendo que el paciente vea solo a los profesionales disponibles con su especialidad correspondiente.

### Posibles preguntas y respuestas para James

Pregunta: Por qué usaron Prisma en lugar de un ORM tradicional como Sequelize o TypeORM?
Respuesta: Prisma tiene varias ventajas. Primero, su sintaxis declarativa en el schema.prisma es mucho más legible que las anotaciones de TypeORM o las definiciones de Sequelize. Segundo, el cliente generado es completamente tipado con TypeScript, lo cual nos da autocompletado y detección temprana de errores. Tercero, el sistema de migraciones es automático y versionado, lo cual facilita la colaboración en equipo.

Pregunta: Cómo se asegura de que las contraseñas no se filtren?
Respuesta: Las contraseñas se cifran con bcryptjs con 10 rounds de salt antes de almacenarse, lo cual significa que aunque alguien accediera al contenido de la tabla User, no podría recuperar las contraseñas originales. Además, los endpoints que retornan datos del usuario nunca incluyen el campo password en la respuesta.

Pregunta: Por qué eligieron PostgreSQL en lugar de MongoDB o MySQL?
Respuesta: PostgreSQL es una base de datos relacional robusta y altamente estandarizada, lo cual encaja con la naturaleza estructurada de los datos de mediCampo (usuarios, citas, fichas clínicas), donde las relaciones entre entidades son claras. MongoDB sería mejor para datos no estructurados o documentos variables, que no es nuestro caso. Además, DigitalOcean ofrece PostgreSQL administrado nativamente, lo cual simplifica la operación.

Pregunta: Qué pasa si dos pacientes intentan agendar al mismo médico en el mismo horario?
Respuesta: En la versión actual del sistema esto no está validado, dado que la validación de choques de horarios quedó como tarea pendiente para el Sprint 3. Actualmente la base de datos aceptaría ambas citas, generando un conflicto que el médico tendría que resolver manualmente rechazando una. Para el Sprint 3 vamos a agregar una validación en AppointmentService.createAppointment que verifique si ya existe otra cita con el mismo doctorId y la misma fecha antes de crear el registro.

Pregunta: Cómo funcionan las migraciones de Prisma?
Respuesta: Cuando se hace un cambio en el archivo schema.prisma, se ejecuta el comando prisma migrate dev seguido de un nombre descriptivo del cambio. Prisma compara el esquema actual con el último aplicado, genera un archivo SQL con las diferencias en la carpeta prisma/migrations y lo aplica automáticamente a la base de datos. Esto deja un historial versionado de todos los cambios, permitiendo que cualquier desarrollador (o el ambiente de producción) replique exactamente el mismo esquema.

Pregunta: Qué información va en el payload del JWT?
Respuesta: El payload del JWT contiene tres datos del usuario, esto es, el id (en el campo estándar sub que significa subject), el rol (PATIENT, DOCTOR o ADMIN) y el nombre. Estos datos permiten que el backend identifique al usuario en cada petición sin tener que consultar la base de datos, lo cual es muy eficiente.

---

## Recomendaciones generales para la interrogación

### Cómo responder cuando no se sabe la respuesta exacta

Si la cátedra pregunta algo específico que no se recuerda con precisión, es mejor responder honestamente que pretender saber. Una buena estrategia es decir: "Esa decisión específica no la recuerdo en este momento, pero el principio que aplicamos fue X" donde X es el concepto general que rige esa área. Esto demuestra que el integrante entiende el qué y el por qué aunque no recuerde el cómo exacto.

### Cómo conectar el trabajo individual con el del equipo

Cuando se hable del propio trabajo, conviene siempre mencionar cómo se conecta con lo que hicieron los compañeros. Por ejemplo, Vicente puede decir "el formulario de Login se integra con el endpoint que construyó James, y luego pasa los datos al AuthContext que implementó Ignacio". Esto refuerza la idea de que el equipo trabajó coordinadamente y demuestra que cada integrante entendió el sistema completo, no solo su pieza aislada.

### Qué hacer durante la demo en vivo

Durante la demostración en vivo, Vicente debería liderar la parte visual mostrando el flujo end-to-end con dos navegadores en paralelo (uno como paciente, otro como médico). James debería estar disponible para abrir el código del backend si la cátedra pregunta por algún endpoint específico, mostrando los archivos de los controladores, servicios o repositorios correspondientes. Ignacio debería estar disponible para responder preguntas sobre el despliegue, LiveKit o el flujo de autenticación general.

### Material impreso para llevar el día de la revisión

Según la rúbrica, hay que llevar impreso el Product Backlog inicial y el Sprint Backlog. El Product Backlog inicial está en el documento sprint_planning_sprint2.md dentro de la sección de Backlog Priorizado, mientras que el Sprint Backlog está en sprint_backlog_sprint2.md. También conviene llevar el informe consolidado informe_catedra2_consolidado.md aunque sea solo el índice y las secciones más importantes, para tener referencia rápida.

### Glosario rápido de términos que pueden surgir

API: Application Programming Interface, esto es, el conjunto de endpoints que el backend expone para que el frontend los consuma.
Backend: la parte del sistema que vive en el servidor y maneja la lógica de negocio y los datos.
Bcryptjs: librería que cifra contraseñas con un algoritmo seguro.
Caddy: servidor web que automatiza los certificados SSL.
Componente: pieza reusable de React que renderiza una parte de la interfaz.
Docker: tecnología de contenedores para empaquetar aplicaciones con sus dependencias.
DuckDNS: servicio gratuito de DNS dinámico.
Endpoint: una URL específica del backend que responde a una petición HTTP.
Frontend: la parte del sistema que el usuario ve en su navegador.
Hook: función especial de React para acceder a características como el estado.
JWT: JSON Web Token, estándar para tokens digitales firmados.
LiveKit: servidor de medios SFU para videollamadas en tiempo real.
localStorage: almacenamiento persistente del navegador.
Middleware: función que procesa una petición HTTP antes del handler principal.
Migración: script versionado que describe un cambio en la estructura de la base.
ORM: Object-Relational Mapping, herramienta que mapea objetos a tablas.
PostgreSQL: base de datos relacional de código abierto.
Prisma: ORM moderno para Node.js con esquema declarativo.
Props: datos que un componente padre pasa a un componente hijo en React.
React: librería de JavaScript para construir interfaces de usuario.
Repository: capa que abstrae las operaciones contra la base de datos.
REST: estilo arquitectónico para APIs web basado en recursos y verbos HTTP.
Scrum: marco de trabajo ágil para gestionar proyectos.
Service: capa que contiene la lógica de negocio entre el controlador y el repositorio.
SFU: Selective Forwarding Unit, arquitectura centralizada para videollamadas.
Sprint: periodo de trabajo definido dentro del marco Scrum.
TailwindCSS: framework CSS basado en utilidades atómicas.
TypeScript: superset de JavaScript con tipos estáticos.
WebRTC: estándar web para comunicación en tiempo real entre navegadores.

---

## Cierre

Esta guía cubre el conocimiento mínimo que cada integrante debe dominar para defender su parte con seguridad durante la revisión presencial y la interrogación oral. Lo importante no es memorizar al pie de la letra cada palabra, sino entender los conceptos detrás de cada decisión técnica, de modo que se pueda explicar con palabras propias por qué se hizo de cierta forma y cómo se conecta con el resto del sistema.

La cátedra valora más la capacidad de razonar sobre el sistema que la habilidad de recitar líneas de código exactas, por lo cual conviene priorizar el entendimiento de los principios generales (qué es una API REST, qué es un JWT, qué es una migración) por sobre los detalles específicos de implementación (cuál es el nombre exacto de tal método). Si los principios están claros, los detalles específicos se pueden inferir o consultar rápidamente durante la presentación.

Mucha suerte para el equipo en la revisión.

Equipo: Vicente Ramirez, James Honeymann, Ignacio Ampuero.
Asignatura: Análisis y Modelamiento de Sistemas.
Nivel: 5.
Docente: Magdalena Nieto Gutiérrez.
