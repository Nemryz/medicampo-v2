# Guías Técnicas para el Equipo de mediCampo v2

Esta carpeta contiene material educativo extenso pensado para que cualquier integrante del equipo pueda estudiar desde lo más básico y entender en profundidad cada una de las tecnologías, librerías y herramientas que componen el proyecto mediCampo v2. La idea es que estos documentos sirvan tanto como preparación para la revisión presencial y la interrogación oral de la cátedra, como también como referencia permanente para el desarrollo de futuros sprints y para la formación técnica general del equipo.

Cada guía está escrita siguiendo el mismo formato que el resto de la documentación del proyecto, esto es, sin negritas ni cursivas, con predominio de comas sobre puntos seguidos, usando conectores variados y sinónimos para que el texto fluya como una conversación natural en lugar de un manual técnico árido. El tono es el de un estudiante de Ingeniería Civil Informática que le está explicando a sus compañeros lo que aprendió mientras construía el proyecto.

## Cómo usar estas guías

Cada documento es autocontenido, esto es, se puede leer de forma independiente sin necesidad de haber leído los anteriores. Sin embargo, los documentos están numerados en un orden que tiene sentido si se quieren leer en secuencia, comenzando por los conceptos más fundamentales y avanzando hacia los más específicos del proyecto.

Si el integrante ya tiene experiencia con algunas tecnologías, puede saltar directamente a los documentos que cubren áreas nuevas. Si el integrante es relativamente nuevo en el desarrollo full-stack, conviene leer los documentos en orden, dado que cada uno asume los conocimientos básicos cubiertos en los anteriores.

Para preparar la revisión presencial específicamente, además de estos documentos conviene revisar también la guía de estudio para los integrantes que está en el archivo guia_estudio_integrantes.md ubicado un nivel arriba (en la carpeta sprint2), la cual contiene talking points específicos y posibles preguntas con respuestas listas para cada integrante según su rol.

## Índice de las guías

### Conceptos fundamentales

01_lenguajes.md cubre los cinco lenguajes que usamos en el proyecto, esto es, JavaScript con su variante tipada TypeScript para la lógica del frontend y del backend, HTML para la estructura de las páginas, CSS para los estilos visuales y SQL para hablar con la base de datos. Explica qué hace cada uno, por qué los necesitamos y cómo se conectan entre sí en el flujo completo de una petición.

### Tecnologías del frontend

02_react.md cubre la librería central del frontend, explicando qué es React, sus conceptos fundamentales como componentes, JSX, props, estado y hooks, y cómo se estructura el código del frontend de mediCampo v2.

03_tailwindcss.md cubre el framework de utilidades CSS que usamos para los estilos visuales, explicando su filosofía atómica, el sistema de diseño con escalas predefinidas para espaciados, colores y tipografía, junto con ejemplos reales del código del proyecto.

### Tecnologías del backend

04_nodejs_express.md cubre el entorno de ejecución de JavaScript del lado del servidor y el framework minimalista que usamos para construir las rutas HTTP. Explica conceptos como rutas, middlewares, request y response, junto con la arquitectura limpia que aplicamos en el backend del proyecto.

05_prisma.md cubre el ORM moderno que usamos para hablar con la base de datos, explicando qué problema resuelve, cómo se define el esquema, cómo funcionan las migraciones y los conceptos básicos del cliente generado.

06_postgresql.md cubre la base de datos relacional que usamos para persistir toda la información del sistema, explicando los conceptos generales de bases relacionales y las características específicas de PostgreSQL que aprovechamos.

### Comunicación en tiempo real

07_livekit_webrtc.md cubre la tecnología que soporta las videollamadas, explicando primero qué es WebRTC como estándar web para comunicación en tiempo real, luego la arquitectura SFU que resuelve los problemas del peer-to-peer puro, y finalmente cómo usamos LiveKit en concreto dentro de mediCampo v2.

### Seguridad

08_autenticacion_jwt_bcryptjs.md cubre cómo funciona la autenticación en el sistema, explicando el problema general de la autenticación, cómo bcryptjs resuelve el almacenamiento seguro de contraseñas, y cómo JWT permite mantener la sesión sin necesidad de estado en el servidor.

### Infraestructura

09_docker_digitalocean_caddy_duckdns.md cubre las cuatro herramientas que componen nuestra infraestructura de despliegue, esto es, Docker para empaquetar la aplicación en contenedores reutilizables, DigitalOcean como proveedor de servicios de nube, Caddy como servidor web con gestión automática de certificados SSL, y DuckDNS para tener un subdominio gratuito apuntando a nuestro servidor.

### Librerías complementarias

10_librerias_complementarias.md cubre las demás librerías importantes que usamos en el proyecto más allá de los frameworks principales, esto es, lucide-react para los íconos, react-router-dom para el enrutamiento, los SDKs de LiveKit, las herramientas de Vite y TypeScript, junto con las librerías auxiliares del backend como cors, dotenv y los tipos de TypeScript.

### Guías paso a paso

11_como_creamos_hu3.md narra el proceso completo que seguimos para construir la historia HU3 (Registro e inicio de sesión), explicando cada una de las siete tareas técnicas con el contexto de las decisiones tomadas y las pruebas integradas que validaron el cierre de la historia.

12_como_creamos_hu4.md narra el proceso completo que seguimos para construir la historia HU4 (Reserva de teleconsulta con aceptación e ingreso a la videollamada), explicando cada una de las diez tareas técnicas con el contexto de las decisiones tomadas y las pruebas integradas end-to-end que validaron el flujo completo del bucle paciente-médico.

## Recomendaciones para estudiar

Una sugerencia práctica para aprovechar mejor estas guías es leerlas con el código real del proyecto abierto en otra pestaña, esto es, ir verificando en los archivos .ts y .tsx mencionados que efectivamente las explicaciones se corresponden con lo que está escrito. Esto fortalece el aprendizaje y permite hacerse una idea concreta de cómo se ve cada concepto en la práctica.

Otra sugerencia es no intentar memorizar al pie de la letra cada palabra, sino entender los conceptos detrás de cada decisión técnica. La cátedra valora más la capacidad de razonar sobre el sistema que la habilidad de recitar líneas de código exactas, por lo cual conviene priorizar el entendimiento de los principios generales por sobre los detalles específicos de implementación.

Una tercera sugerencia es discutir las guías entre integrantes del equipo, esto es, leerlas en grupo y conversar sobre las dudas que vayan surgiendo. La explicación oral entre compañeros suele consolidar el aprendizaje mucho más que la lectura individual.

Una cuarta sugerencia es complementar la lectura de estas guías con los recursos externos que cada una recomienda al final, especialmente las documentaciones oficiales de las tecnologías. Estas guías son un punto de partida y un resumen del conocimiento aplicado en el proyecto, pero no reemplazan la profundidad que ofrece la documentación oficial completa.

## Total de contenido

Las guías suman varios documentos extensos cubriendo desde lo básico hasta los detalles específicos del proyecto. Si bien la lectura completa puede tomar varias horas, vale la pena hacerla con calma, dado que el conocimiento adquirido será útil mucho más allá del contexto académico inmediato.

Si surge alguna duda específica que no esté cubierta en las guías, conviene plantearla en el grupo del equipo para resolverla colectivamente, dado que probablemente sea útil para todos. Toda la información adicional que se vaya generando puede incorporarse a estas guías para mantenerlas actualizadas y completas.

## Cierre

Mucho éxito a quienes usen estas guías. Construir mediCampo v2 ha sido un proceso de aprendizaje significativo para todo el equipo, y esperamos que este material refleje fielmente todo lo que aprendimos en el camino, sirviendo como puente entre el código del proyecto y los conceptos generales de la ingeniería de software moderna.

Equipo de mediCampo v2.
Vicente Ramirez, James Honeymann, Ignacio Ampuero.
Análisis y Modelamiento de Sistemas.
