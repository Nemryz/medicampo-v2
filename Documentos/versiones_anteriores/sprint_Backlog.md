# Análisis del Sprint Backlog actual, junto a los avances realizados de antemano, para determinar que se debe hacer para actualizar el backlog futuro. 

Se hace mención a detalle del progreso de las historias de usuario base de las cuales se desprenden las tareas y funcionalidades implementadas en el proyecto. A su vez, se hace mención a las historias que quedan pendientes por implementar y que se deben agregar al backlog futuro. Se busca que el sprint backlog sea un documento vivo que permita el seguimiento del progreso del proyecto y que a su vez, sirva como base para la planificación de futuros sprints.

# Criterios de aceptacion 

Las historias de usuario base son:

## HU00: Preparacion tecnica

Esta es la configuración inicial del entorno de desarrollo, repositorio y herramientas (Node.js, Express, Base de Datos, estructura, entre otros)

## Concepto para implementación

Inicializar repositorios para frontend y backend, para asi mantener el control de versiones y poder trabajar de forma colaborativa, de manera que se pueda gestionar de forma eficiente y ordenada los recursos técnicos y las tareas de los desarrolladores. Además de establecer un ambiente de desarrollo en las computadoras locales y los servidores que permita el desarrollo, mantenimiento y administración del sistema, tanto por parte de los desarrolladores, como por parte de los administradores. Por último, establecer un sistema que permita trabajar de forma colaborativa en el desarrollo, mantenimiento y administración del sistema.

## Tareas de la HU00

1. Inicializar repositorios para frontend y backend.

2. Configurar servidor base con Express.js y Node.js. 

3. Aprovisionar y conectar servidor con PostgreSQL gestionado en la nube DigitalOcean usando créditos de GitHub Student Pack. (Es base dado que permite la persistencia de los datos y las operaciones de los usuarios). Se debe tener en cuenta el uso de docker para que funcione en cualquier lugar, y, además, permitir escalabilidad del proyecto. Se usará Docker además para el servidor de backend y, además, para el servidor de LiveKit que permitirá el funcionamiento de la videollamada, especialmente en la parte de los subdominios para que se pueda acceder a la sala de videollamada mediante un enlace único.

4. Migrar el frontend original (Vite/React) a la carpeta `frontend/`. (Es base dado que permite trabajar de forma colaborativa, de manera que se pueda gestionar de forma eficiente y ordenada los recursos técnicos y las tareas de los desarrolladores). 

5. Configurar variables de entorno, ESLint, Prettier y TypeScript en el backend. Se usará EsLint para tener un orden en el código del servidor, TypeScript para tener un control de tipos y, además, Prettier para tener un orden en el código del servidor. Se debe tener en cuenta el uso de herramientas como nodemon para que el servidor se reinicie automáticamente cuando se realizan cambios en el código, de modo que se pueda trabajar de forma colaborativa, de manera que se pueda gestionar de forma eficiente y ordenada los recursos técnicos y las tareas de los desarrolladores. Además, se debe tener en cuenta el uso de herramientas como Husky para que se pueda tener un control de versiones y poder gestionar de forma eficiente y ordenada los recursos técnicos y las tareas de los desarrolladores. 

6. Cargar los datos que se tienen en el excel de consultas médicas a la base de datos de PostgreSQL. Aunque estos datos son estáticos, se preve a futuro que sea dinámico, dado que se planea incluir nuevas consultas médicas.

## HU01: Videollamada Segura

Yo como usuario (paciente rural) necesito realizar una videollamada con un medico, para poder tener una consulta medica y recibir un diagnostico y tratamiento, con la seguridad de que la informacion compartida es confidencial y no puede ser interceptada por terceros.

### Concepto para implementación

La implementación de la sala de telemedicina será usada por medio de la librería LiveKit, la cual permite generar tokens de acceso, los cuales serán usados por los usuarios para conectarse a una sala.

Se debe tener en cuenta la implementación de un nuevo usuario (administrador de la sala) el cual será usado para generar los tokens de acceso, los cuales se deben generar por medio de un backend. Este backend debe estar protegido por medio de un middleware de autenticación por rol. 

El uso de esta librería de telemedicina debe estar asociado a la reserva de una teleconsulta, de modo que el médico pueda iniciar la videollamada en el momento indicado, además, antes de eso poder aceptarla para que el paciente pueda ingresar a la sala.

Dado que cada sala tiene un registro único de sesión, esto se debe al servidor encriptado del hash 256 que genera la librería de livekit para cada sala, esto hace que la sala sea única y no pueda ser accedida por terceros. Pero el servidor posee encriptado de la computadora desde el docker del líder de equipo, por lo tanto, para que la generación de la encriptación de las salas y además, el inicio y activación del código de encriptación debe ser realizado por medio de la terminal con el comando npm run dev. Y, además por medio del servidor de Docker que permita la creación del subdominio del dominio registrado en Duck, de modo que permita que la creación de las videollamadas y el chat de voz sea persistente y no ejecute cambios dado el énfasis de persistencia de los datos dentro de la conexión de la sala única.

## HU02: Historial Clínico

Yo como medico necesito guardar notas clinicas del paciente durante la consulta, como el diagnostico, tratamiento y recomendaciones, para poder tener un registro de la consulta y poder hacer seguimiento del paciente.

### Concepto para implementación

El historial clinico se guardara en la base de datos, en una tabla asociada al paciente y a la cita. Se debe tener en cuenta la implementación de un nuevo modelo en prisma para el historial clinico, el cual debe estar asociado al paciente y a la cita.

Se debe tener en cuenta la implementación de un nuevo endpoint en el backend para obtener las citas pasadas del paciente y sus diagnosticos, y un endpoint para guardar la nota clinica y actualizar el estado de la cita. Esta historia de usuario se debe implementar por medio de una interfaz que se encuentre disponible para el medico durante la videollamada, con el fin de poder tener un registro de la consulta y poder hacer seguimiento del paciente.

## HU03: Registro e inicio de sesión del médico

Yo como usuario (médico) necesito poder registrarme e iniciar sesión en la plataforma para acceder de forma segura a mis consultas. Esta historia de usuario usará el código que funciona de modo que solo se debe encargar de implementar la interfaz para el médico y el endpoint correspondiente. En esta historia de usuario se debe tener en cuenta la implementación de un nuevo modelo en prisma para el historial clinico, el cual debe estar asociado al paciente y a la cita. Además, se debe considerar la creacion y registro de nuevos usuarios por parte de la zona de registrarse que quedará conectado a la base de datos de forma permanente hasta que el servidor decida la conexión, si este entra en mantenimiento. 

Considerar que el registro de médicos y admnistradores debe ser asociado desde la base de datos como administrador número uno, y, la de administrador del sistema web, como administrador de las cuentas y accesos. Por esta razón, se debe implementar una interfaz para el administrador del sistema web, la cual permitirá y estará siempre disponible para la creación y registro de nuevas cuentas, siempre y cuando el servidor tenga conexión a la base de datos.

Desde este punto se puede ver que el sistema está diseñado para ser escalable. De esta forma se asocia una mejora al servidor, y, además, una mejora dentro del frontend para establecer algo más profesional.

Para encontrar templates de interfaces en el frontend se debe usar el repositorio de figma y la libreria Material UI que esta en GitHub.

## HU04: Reserva de Teleconsultas

Yo como paciente rural necesito poder agendar una teleconsulta con un médico disponible. 

Para ello, se debe tener en cuenta que hay una lista de especialidades disponibles y una lista de médicos disponibles para cada especialidad. El médico debe tener un horario de atención y debe estar disponible para atender teleconsultas. El paciente debe poder ver las teleconsultas disponibles y agendar una teleconsulta.

## Conceptos de la HU04

Es un módulo de agendamiento que permite a los pacientes agendar teleconsultas con médicos disponibles. Para ello, se debe tener en cuenta que hay una lista de especialidades disponibles y una lista de médicos disponibles para cada especialidad. El médico debe tener un horario de atención y debe estar disponible para atender teleconsultas. El paciente debe poder ver las teleconsultas disponibles y agendar una teleconsulta. Además, el médico debe poder aceptar o rechazar la teleconsulta. Se debe prevenir choques de horarios entre citas y además, se deben enviar notificaciones de recordatorio de citas 24 y 1 hora antes de la teleconsulta. (esto último se debe implementar mediante un cron job en el servidor de node.js)

### Tareas de la HU04 

1. (frontend) Definir el diseño de la interfaz de reserva de teleconsultas, usando los estilos globales y componentes de UI disponibles.

2. (frontend) Implementar la lista de especialidades disponibles y la lista de médicos disponibles para cada especialidad.

3. (frontend) Implementar la interfaz de reserva de teleconsultas con los filtros correspondientes (especialidad, médico, fecha, hora).

4. (backend) Crear el modelo de reserva de teleconsultas en prisma.

5. (backend) Crear el endpoint de reserva de teleconsultas.

6. (backend) Crear el endpoint de aceptación y rechazo de teleconsultas.

7. (frontend) Crear la interfaz de aceptación y rechazo de teleconsultas para el médico. 

8. (backend) Agregar la lógica en el backend para prever el choque de citas. 

9. (backend) Generar y enviar enlace único a la llamada al confirmar la cita. 

10. (frontend) Crear la interfaz de la lógica en el backend para prever el choque de citas. [este esta pendiente por el momento]

## HU05: Notificaciones de cita 

Yo como paciente rural necesito recibir recordatorios automáticos de mi cita, 24 y 1 hora antes de la teleconsulta, para poder tener un registro de la cita y poder hacer seguimiento del paciente.  

## Conceptos de la HU05

Es un módulo de notificaciones que permite a los pacientes recibir recordatorios automáticos de sus citas, 24 y 1 hora antes de la teleconsulta. Para ello, se debe tener en cuenta que hay una lista de citas disponibles y una lista de médicos disponibles para cada especialidad. 

Se debe prevenir choques de horarios entre citas y además, se deben enviar notificaciones de recordatorio de citas 24 y 1 hora antes de la teleconsulta. (esto último se debe implementar mediante un cron job en el servidor de node.js)

Este es un sistema automatizado de correos electrónicos que se enviarán a los pacientes para recordarles sus citas. Con la finalidad de evitar el ausentismo en las teleconsultas.

### Tareas de la HU05

1. (backend) Integrar API de correos (ej. Nodemailer, Resend) o de SMS. [este esta pendiente por el momento]

2. (backend) Crear el cron job para el envío de notificaciones de recordatorio de citas para barrer citas y enviar los correos electrónicos. [este esta pendiente por el momento]

3. Crear la lógica del algoritmo de notificación para que se ejecute cada 24 y 1 hora antes de la cita. [este esta pendiente por el momento]

4. (frontend) Crear la interfaz de recordatorio de citas. [este esta pendiente por el momento]

5. Añadir configuraciones al perfil del paciente para activar/desactivar notificaciones. [este esta pendiente por el momento]

## HU06: Panel de Administración

Yo como administrador del sistema necesito poder gestioanr usuarios (pacientes y médicos), especialidades, médicos y horarios de atención, así como eliminar especialidades, médicos y horarios de atención desde el panel central de la administración interno. 

## Conceptos de la HU06

Centro de control administrativo protegido por el middleware de roles para la moderación del sistema. 

### Tareas de la HU06

1. (backend) Modificar el modelo de Usuario para soportar roles (Admin, Patient, Doctor). 

2. (backend) Crear endpoints CRUD para usuarios orientados a administradores.

3. (frontend) Crear UI del panel de administración en React.

4. (backend) Implementar middleware de autenticación por rol en el backend.

5. (backend) Crear sistema de auditoría básica (logs) para registrar accesos y modificaciones.

6. (frontend) Crear la interfaz de administración en React.

7. (backend & frontend) Implementar un sistema de eliminación de citas registradas para evitar conexión involuntaria con el servidor y su respectiva conexión. Por tanto, se debe crear un nuevo endpoint en el servidor para la eliminación de citas y la interfaz en el frontend para la eliminación de citas. Ademas de la modificación de los modelos pertinentes en el servidor para que se pueda gestionar la eliminación de citas. Además, de que debe estar conectado en tiempo real a la base de datos en Digital Ocean. 

# [HISTORIAS DE USUARIO EXTRA A IMPLEMENTAR POSTERIOR AL TRABAJO PLANTEADO EN EL SPRINT_BACKLOG.MD] | Algunos están hecho

## HU07:Videollamada de Alta Disponibilidad

Yo como usuario (médico/paciente) necesito que mis videollamadas sean estables y no consuman exceso de recursos de mi dispositivo, incluso con conexiones rurales inestables.

## Conceptos de la HU07

Es un módulo de videollamada que permite a los pacientes tener videollamadas con médicos disponibles. Con este sistema se preve bajar la latencia y los costos de la videollamada, además de mejorar la calidad de la videollamada. Mejorando en el proceso la experiencia del usuario, y, la persistencia de la videollamada entre paciente y médico. Podría considerarse una No funcionalidad, ya que, en el proyecto inicial se tenía en mente una solución de menor escalabilidad, pero, que cumplía con lo propuesto. No obstante, dado que el proyecto se encuentra en desarrollo, se implementará esta mejora para optimizar la experiencia del usuario y del personal médico.

### Tareas de la HU07

1. (backend) Dado que se reemplazo PeerJS por LiveKit (SFU). Se busca optimizar la banda ancha de consumo de una conexión. Por lo mismo, se recomienda investigar sobre las tecnologías de LiveKit, y, basándose en esto, definir una arquitectura que permita lograr el objetivo planteado en la HU07.

2. (backend) Mantener desplegado el servidor de LiveKit, idealmente en una red privada virtual o en un servidor que permita el acceso remoto por parte de los usuarios. Por medio, del sisema de credenciales y autentificación de un certificado digital para que los navegadores de los usuarios puedan acceder a la videollamada de forma segura. Este certificado debe estar asociado al dominio de la aplicación. 

3. (backend) Integrar las credenciales de LiveKit con el frontend, y, además, permitir el acceso a la videollamada por medio del sistema de autentificación de la aplicación.

4. (frontend) Implementar los controles de la videollamada en React. 

5. (frontend) Mostrar la videollamada en React. Se debe bajar el consumo de recursos para que funcione en conexiones rurales. [este esta pendiente por el momento]

## HU08 Generación y Reporte de Receta Médica Imprimible

Yo como Paciente necesito poder guardar e imprimir mis recetas y diagnósticos médicos en un formato oficial para presentarlo en farmacias o centros de salud.

## Conceptos de la HU08

Se debe crear una vista estilo "documento oficial" optimizada para la impresión directa desde el navegador. Para ello, se deben considerar los siguientes aspectos: 

1. Diseño del documento: Usar fuentes limpias y legibles (serif), márgenes amplios (al menos 2.5 cm), espaciado interlineado (1.5x) y tipografía de tamaño adecuado (12pt para cuerpo, 16-18pt para títulos). Incluir encabezado y pie de página (que no se impriman en la vista previa pero sí en el documento final) para mostrar el logo, título y número de página. Evitar colores de fondo o decoraciones pesadas, usar solo líneas divisorias sutiles (border-top) para separar secciones. Asegurar que el ancho del contenido sea fijo (ej. 16cm) para simular papel A4 y evitar roturas de línea inconsistentes. [este esta pendiente por el momento]

2. Datos a mostrar: Identificación del paciente (nombre,rut, dirección, etc.). [este esta pendiente por el momento]

3. Diagnóstico médico: Fecha, motivo de la consulta, diagnóstico (ej: Diabetes Mellitus tipo 2), tratamiento (medicamentos, dosis, frecuencia, duración), recomendaciones adicionales (dieta, ejercicios, seguimiento), fecha de control y firma digital del médico. [este esta pendiente por el momento]

4. Botones de acción: Los botones de "Imprimir" y "Descargar" deben estar fuera del área de impresión (position: absolute) para que no aparezcan en el documento final. [este esta pendiente por el momento]

5. Impresión y descarga: Debe existir un botón para imprimir el documento y otro para descargarlo como PDF. (esto último [se debe implementar mediante un cron job en el servidor de node.js]) [este esta pendiente por el momento]

### Tareas de la HU08

1. (frontend) Diseñar el layout de la receta médica en React. [este esta pendiente por el momento]. Se usará la librería html2canvas.js y jsPDF para generar el PDF. Además, se debe tomar en cuenta los conceptos dados en esta HU para el diseño del layout de la receta médica. 

2. (frontend) Integrar funcionalidades nativa de navegador para activar diálogo de impresión y descarga del documento. Se usará la librería html2canvas.js con el cuál se planeará en escritorio utilizar las configuración 'Ctrl + P', mientras en móvil imprimible desde el navegador. 'Print' y 'Share/Export' (estos dos últimos se ejecutarán usando librerías de react/js).[este esta pendiente por el momento].

3. Asegurar la correcta visualización del documento, especialmente de los datos del médico al momento de la impresión. Por ejemplo, que el contenido se ajuste al ancho de la página, que no haya cortes de línea inesperados, etc. [este esta pendiente por el momento]

4. (backend) Crear un cron job para generar un documento PDF de la receta médica y enviarlo al paciente por correo electrónico. [este esta pendiente por el momento]

5. (frontend) Crear la interfaz de administración en React. [este esta pendiente por el momento]

6. (backend) Refactorizar el código del backend para que cumpla con las buenas prácticas de programación, SOLID, etc. [este esta pendiente por el momento]

7. Mejorar la UI de la aplicación para que sea más atractiva y fácil de usar en el concepto de impresión/descarga. [este esta pendiente por el momento]

## HU09: Sincronización Automática de Identidad en Salas Virtuales

Yo como médico necesito saber exactamente quién es el paceinte que está en mi sala antes de iniciar la consulta clínica. 

## Conceptos de la HU09

Actualmente, el sistema permite el acceso a salas virtuales mediante un enlace, pero no hay una verificación de identidad que asegure que el paciente que se encuentra en la sala es realmente quien debe estar ahí. Por lo mismo, se busca implementar una forma de verificar la identidad del paciente antes de que pueda ingresar a la sala virtual.

Se puede saber quien accede mediante el inicio de sesión del usuario. Por lo tanto, se debe implementar un sistema que permita verificar la identidad del paciente antes de que pueda ingresar a la sala virtual, mencionando en el entorno de entrada pre-sala configurado para establecer mejor la conexión entre ambos (Paciente-Médico), ese entorno fue configurado para mejorar el sistema de conexión para establecer mejor el sistema de comunicación.

### Tareas de la HU09

1. Crear endpoint 'GET /api/appointments/room/:roomId' para mapear el identificador de la sala con el de la cita.

2. Desplegar bloqueos visuales o pantallas de carga mientras se espera la confirmación de la identidad del usuario. Y, hasta que ambas partes estén autentificadas, la sala no debe comenzar a transmitir.

3. Mostrar información resumida del paciente en la pantalla del médico dentro de la llamada. 

4. (frontend) Realizar cambios en la sala virtual de react (React.tsx) para que se pueda mostrar la información del paciente en la pantalla del médico dentro de la llamada.

5. (frontend) Mejorar la UI de la aplicación para que sea más atractiva y fácil de usar en el concepto de sincronización automática de identidad en salas virtuales.

6. Mejorar la interfaz de usuario dentro de la app móvil y del navegador desde la visión del navegador en el entorno de móvil.

## HU10: Experiencia de Usuario en Dashboards

Yo como paciente (usuario) necesito que los paneles de control respondan rápidamente y me redirijan automáticamente al realizar una acción importante, sea esta como aceptar o finalizar la consulta, entre otros conceptos. 

Esto se usará mediante el sistema de rutas que está implementado mediante React Router (para la SPA de navegador y la app móvil en Ionic) y con la base de datos relacional PostgreSQL. 

## Conceptos de la HU10

Estas son mejoras iterativas en las redirecciones de la SPA de navegador y la app móvil en Ionic para que respondan más rápidamente y me redirijan automáticamente a la sección pertinente para que pueda volver a retomar mi rutina sin perder tiempo. Este manejo del estado global de React es para evitar pantallas en negro, blanco, refrescos innecesarios, pérdida de contexto de la sesión, entre otros.

### Tareas de la HU10

1. Implementar redirección instantánea tras aceptar citas de hoy (Dashboard médico) y dirigirse a la sala virtual.

2. Mejorar diseño de tarjeta "en espera" en el dashboard paciente. Actualmente se ve un poco desordenado y poco estético.

3. Limpieza de Estado y cierra de conexiones al desmontar componentes de llamadas. 

