# Historias de Usuario — mediCampo v2

Este documento registra todas las historias de usuario del proyecto mediCampo v2, organizadas por épica. Cada historia incluye su descripción desde la perspectiva del usuario, las tareas técnicas con su estado actual, los criterios de aceptación verificables y la descripción de cómo está o estará implementada en el código. El documento sirve de base viva para el backlog y para la planificación de futuros sprints.

---

## Épica 1 — Acceso, autenticación y gestión de usuarios

Esta épica cubre la capacidad del sistema para identificar a los usuarios de forma segura, proteger las rutas de la aplicación y dar acceso diferenciado según el rol asignado a cada cuenta.

---

### HU00 — Preparación técnica del entorno full-stack

Como equipo de desarrollo, necesitamos un entorno de trabajo estructurado, con repositorio independiente, backend funcional, conexión a base de datos y herramientas de colaboración, para poder construir todas las demás funcionalidades sobre una base sólida y escalable.

Estado: parcialmente completado

Concepto de implementación: Inicializar repositorios para frontend y backend para mantener el control de versiones y poder trabajar de forma colaborativa, de manera que se gestionen eficientemente los recursos técnicos. Establecer un ambiente de desarrollo local y en servidores que permita el desarrollo, mantenimiento y administración tanto por parte de los desarrolladores como de los administradores. Se contempla el uso de Docker para que el backend, la base de datos y el servidor LiveKit funcionen en cualquier entorno y permitan escalabilidad del proyecto.

Tareas:
- T00.1: Inicializar repositorios para frontend y backend. Completado. El directorio mediCampo-v2 contiene el repositorio Git propio del proyecto con historia de commits independiente.
- T00.2: Configurar servidor base con Express.js y Node.js. Completado. El archivo backend/src/server.ts arranca Express con middlewares de CORS y JSON.
- T00.3: Aprovisionar base de datos PostgreSQL en DigitalOcean usando créditos de GitHub Student Pack. Completado. Se usa Docker para que el backend sea portable. El servidor LiveKit también corre en Docker en un Droplet de DigitalOcean con soporte de subdominios.
- T00.4: Migrar el frontend original de Bolt.new a la carpeta frontend/. Completado. Los archivos React/Vite residen en frontend/ con su propio package.json.
- T00.5: Configurar variables de entorno, ESLint y TypeScript en el backend. Completado. tsconfig.json configurado; dotenv carga las variables al inicio del servidor. Pendiente: integración formal de ESLint/Prettier y Husky para hooks de pre-commit.
- T00.6: Cargar datos del excel de consultas médicas a la base de datos PostgreSQL. Pendiente. Los datos de especialidades y médicos actuales provienen del seed.ts; se requiere un proceso de importación desde el excel de referencia para el entorno real.

Criterios de aceptación:
El servidor backend responde con estado 200 en la ruta raíz. Prisma puede sincronizar el schema con la base de datos remota. El frontend arranca en el puerto 5173 sin errores de compilación. El servidor puede ser iniciado desde Docker sin depender del entorno local de un desarrollador específico.

---

### HU03 — Registro e inicio de sesión del médico y administración de cuentas

Como médico, necesito poder registrarme e iniciar sesión en la plataforma para acceder de forma segura a mis consultas. Como administrador, necesito poder crear y gestionar cuentas de médicos sin que estos deban auto-registrarse, garantizando control sobre quién tiene acceso al sistema con roles privilegiados.

Estado: parcialmente completado

Concepto de implementación: La autenticación funciona mediante el mismo sistema JWT para todos los roles. Los médicos y administradores actuales solo pueden crearse mediante el seed de la base de datos. Se requiere una interfaz en el panel de administración para que el administrador principal pueda registrar nuevas cuentas con rol DOCTOR o ADMIN. El administrador del sistema web gestiona las cuentas y accesos, mientras que el administrador registrado como el primer usuario de la base de datos actúa como superadministrador. El sistema está diseñado para escalar en este sentido sin modificar la arquitectura base.

Tareas:
- T03.1: Crear esquema Prisma para la entidad User con soporte de roles. Completado. El modelo User en schema.prisma incluye rut, name, email, password, role y specialtyId.
- T03.2: Endpoint POST /api/auth/register con validaciones. Completado. Valida duplicados de email y RUT, hashea la contraseña, asigna rol PATIENT por defecto.
- T03.3: Endpoint POST /api/auth/login con generación de JWT. Completado. Compara contraseña con bcrypt y genera token JWT con payload sub, role y name.
- T03.4: Interfaz de registro y login en el frontend. Completado. Login.tsx y Register.tsx manejan los formularios y llaman a los endpoints.
- T03.5: Manejo de sesión en el cliente con persistencia en localStorage. Completado. AuthContext.tsx persiste el token y el usuario.
- T03.6: Formulario en el panel de administración para crear cuentas de médico. Pendiente. Actualmente los médicos solo se crean mediante seed.ts.
- T03.7: Interfaces con templates de Material UI para pantallas de registro y login más profesionales. Pendiente. Se usará el repositorio de Figma y la librería Material UI disponible en GitHub como referencia de diseño.

Criterios de aceptación:
Un médico puede iniciar sesión con las credenciales creadas por el administrador. El administrador puede crear una cuenta de médico desde el panel sin acceder directamente a la base de datos. El sistema rechaza el registro si el email o RUT ya existen. El token persiste entre recargas del navegador.

Implementación en el código:
El flujo pasa por Login.tsx en el frontend, fetch al endpoint de auth, authController.ts, AuthService.ts (validaciones y hashing), UserRepository.ts (operaciones con Prisma). La función login del AuthContext llama a localStorage.setItem con las claves medicampo_token y medicampo_user.

---

## Épica 2 — Gestión de la atención médica

Esta épica cubre el ciclo completo de una teleconsulta: agendamiento, videollamada y registro del historial clínico.

---

### HU04 — Reserva de teleconsulta

Como paciente rural, necesito poder seleccionar un médico disponible con su especialidad, elegir una fecha y hora de atención disponible y confirmar la reserva para tener una consulta médica programada que el médico pueda aceptar o rechazar.

Estado: completado con mejoras pendientes

Concepto de implementación: Módulo de agendamiento que conecta especialidades, médicos y disponibilidad horaria. El médico tiene un horario de atención y debe estar disponible para atender teleconsultas. El sistema debe prevenir choques de horarios entre citas. Al confirmar la reserva, se genera un enlace único de sala. El módulo también contempla notificaciones de recordatorio 24 y 1 hora antes de la teleconsulta mediante un cron job en Node.js.

Tareas:
- T04.1: Definir diseño de la interfaz de reserva usando estilos globales y componentes de UI. Completado. ReservaCita.tsx implementa el flujo en tres pasos diferenciados visualmente.
- T04.2: Implementar lista de especialidades y médicos disponibles en el frontend. Completado. El componente obtiene la lista real de médicos desde GET /api/appointments/doctors.
- T04.3: Implementar interfaz de reserva con filtros de especialidad, médico, fecha y hora. Parcialmente completado. Los filtros de especialidad no están implementados; los horarios son fijos.
- T04.4: Crear modelo de citas en Prisma. Completado. El modelo Appointment en schema.prisma define todos los campos necesarios.
- T04.5: Crear endpoint de reserva de teleconsultas POST /api/appointments/book. Completado. AppointmentService.createAppointment genera el meetingLink y crea la cita con estado PENDING.
- T04.6: Crear endpoint de aceptación y rechazo PATCH /api/appointments/:id/status. Completado. El médico puede enviar CONFIRMED o CANCELLED.
- T04.7: Crear interfaz de aceptación y rechazo de teleconsultas para el médico. Completado. DashboardMedico.tsx muestra las solicitudes PENDING con botones de aceptar y rechazar.
- T04.8: Agregar lógica para prevenir choques de citas. Pendiente. El sistema actualmente crea la cita sin verificar si ya existe otra en el mismo horario con el mismo médico.
- T04.9: Generar y enviar enlace único al confirmar la cita. Completado. El meetingLink se genera con Math.random().toString(36).substring(7) y se almacena en la base de datos.
- T04.10: Crear interfaz de visualización del estado de conflicto de horarios. Pendiente.

Criterios de aceptación:
El paciente ve la lista de médicos con su especialidad. Al confirmar, la cita queda en estado PENDING. El médico puede aceptar o rechazar. Al aceptar, el paciente ve el botón "Ingresar a la Sala". El meetingLink es único y almacenado en la base de datos.

Implementación en el código:
ReservaCita.tsx en frontend/src/components/ gestiona el flujo de tres pasos. AppointmentRepository.create en backend/src/repositories/ ejecuta prisma.appointment.create. El estado PENDING es el valor por defecto en schema.prisma. DashboardMedico.tsx en frontend/src/components/dashboards/ muestra las solicitudes con handleStatusUpdate que llama al endpoint PATCH.

---

### HU01 — Videollamada segura

Como usuario (paciente rural), necesito realizar una videollamada con un médico para poder tener una consulta médica y recibir un diagnóstico y tratamiento, con la seguridad de que la información compartida es confidencial y no puede ser interceptada por terceros.

Estado: completado

Concepto de implementación: La sala de telemedicina se implementa mediante LiveKit, que genera tokens de acceso para cada usuario. Cada sala tiene un identificador único vinculado a la cita en la base de datos. El acceso está protegido por autenticación JWT: solo el médico y el paciente asignados a una cita pueden obtener el token de LiveKit para esa sala. El servidor LiveKit corre en un Droplet de DigitalOcean bajo el dominio medicampo-rtc.duckdns.org, con certificado SSL gestionado por Caddy y Docker como mecanismo de despliegue. El servidor de encriptación de las salas debe ser iniciado manualmente desde la terminal del servidor con npm run dev; la generación de los hashes de sala es responsabilidad del servidor LiveKit y su clave API/Secret que se configuran como variables de entorno en el backend.

Tareas:
- T01.1: Implementar servidor de señalización. Completado. Inicialmente con Socket.io y PeerJS; reemplazado por LiveKit SFU en el sprint 2.
- T01.2: Componente de videollamada con control de hardware en React. Completado. Videollamada.tsx usa LiveKitRoom con GridLayout y ParticipantTile de @livekit/components-react.
- T01.3: Controles de micrófono, cámara y finalización de llamada. Completado. ControlesPersonalizados usa useLocalParticipant de LiveKit.
- T01.4: Indicadores de sesión segura y finalización de sala. Completado. El encabezado muestra el escudo, "Cifrado Militar" y el IndicadorCalidadRed.
- T01.5: Mantener el servidor LiveKit desplegado con SSL y subdominio. Completado. Docker gestiona el servidor en el Droplet de DigitalOcean.
- T01.6: Integrar las credenciales de LiveKit con el frontend mediante variables de entorno. Completado. VITE_LIVEKIT_URL en el archivo .env del frontend apunta al servidor.

Criterios de aceptación:
El paciente y el médico pueden verse y escucharse mutuamente. Los botones de micrófono y cámara desactivan el hardware en tiempo real. El botón de colgar cierra la sala y regresa al dashboard. Un usuario sin cita asignada a la sala no puede obtener el token de acceso.

Flujo completo implementado:
El paciente hace clic en "Ingresar a la Sala" en DashboardPaciente.tsx (navega a /room/:roomId). Videollamada.tsx muestra PreFlightCheck.tsx para verificar hardware. Tras pasar el check, fetchToken llama a GET /api/livekit/token. El backend verifica que el userId tenga una cita con ese roomId mediante LiveKitService, genera el AccessToken y lo devuelve. Videollamada.tsx renderiza LiveKitRoom con el token y la URL del servidor SFU. El video y audio fluyen a través del servidor LiveKit de DigitalOcean.

---

### HU07 — Videollamada de alta disponibilidad

Como usuario (médico/paciente), necesito que mis videollamadas sean estables y no consuman exceso de recursos de mi dispositivo, incluso con conexiones rurales inestables.

Estado: completado

Concepto de implementación: Módulo de mejora de la videollamada que baja la latencia y los costos mediante la arquitectura SFU de LiveKit. Mejora la calidad de la experiencia del usuario y la persistencia de la videollamada entre paciente y médico. Esta historia surge como mejora de la arquitectura original P2P (PeerJS) que fallaba en redes con NAT o firewall. Se considera una historia de no funcionalidad que optimiza lo ya implementado.

Tareas:
- T07.1: Investigar LiveKit SFU y reemplazar PeerJS. Completado. El componente Videollamada.tsx fue reescrito para usar @livekit/components-react.
- T07.2: Mantener el servidor LiveKit en una red privada con acceso seguro por certificado digital. Completado. Caddy gestiona SSL en el Droplet de DigitalOcean.
- T07.3: Integrar credenciales LiveKit con el sistema de autenticación. Completado. LiveKitService verifica el JWT de la aplicación antes de generar el token de LiveKit.
- T07.4: Implementar controles de videollamada en React. Completado. ControlesPersonalizados con useLocalParticipant.
- T07.5: Optimizar el consumo de recursos para conexiones rurales. Parcialmente completado. AdaptiveStream y dynacast están activados en LiveKitRoom; la reducción de resolución mínima para redes muy lentas queda pendiente.

Criterios de aceptación:
La videollamada funciona entre un móvil con 4G y un PC con WiFi. La calidad se degrada automáticamente si el ancho de banda es insuficiente. Si la conexión se pierde temporalmente, el sistema muestra reconexión automática.

---

### HU02 — Historial clínico

Como médico, necesito guardar notas clínicas del paciente durante la consulta (diagnóstico, tratamiento, recomendaciones) para tener un registro de la consulta y hacer seguimiento del paciente.

Estado: completado

Concepto de implementación: El historial clínico se guarda en la base de datos en una tabla ClinicalRecord asociada al paciente y a la cita (relación uno a uno con Appointment). Se implementó un panel lateral dentro de la videollamada donde el médico puede registrar la información clínica sin interrumpir la conexión de video.

Tareas:
- T02.1: Crear modelo ClinicalRecord en Prisma asociado al Appointment. Completado. El modelo define campos de constantes vitales y campos textuales del acto médico.
- T02.2: Endpoint para obtener citas pasadas y diagnósticos. Completado. GET /api/clinical/patient/:patientId devuelve citas COMPLETED con su ClinicalRecord.
- T02.3: Endpoint para guardar la nota clínica y actualizar el estado de la cita. Completado. POST /api/clinical/:appointmentId guarda la ficha y marca la cita como COMPLETED de forma secuencial.
- T02.4: Interfaz de ficha clínica disponible para el médico durante la videollamada. Completado. El panel lateral de Videollamada.tsx renderiza el formulario solo para usuarios con role DOCTOR.

Criterios de aceptación:
El médico puede ingresar diagnóstico y prescripción desde la videollamada. Al guardar, la cita cambia a estado COMPLETED. El paciente puede ver la ficha completa en el historial. El paciente puede imprimir el documento con el botón de impresión.

---

### HU08 — Generación y reporte de receta médica imprimible

Como paciente, necesito poder guardar e imprimir mis recetas y diagnósticos médicos en un formato oficial para presentarlo en farmacias o centros de salud.

Estado: parcialmente completado

Concepto de implementación: Vista estilo "documento oficial" optimizada para la impresión directa desde el navegador y para descarga como PDF. El diseño debe usar fuentes limpias y legibles (serif), márgenes amplios de al menos 2.5 cm, espaciado interlineado 1.5x y tipografía de tamaño 12pt para cuerpo y 16-18pt para títulos. El encabezado debe incluir el logo de mediCampo y el número de folio. Los botones de acción deben estar fuera del área de impresión para no aparecer en el documento final. Se usarán las librerías html2canvas.js y jsPDF para la generación del PDF.

Tareas:
- T08.1: Diseñar layout CSS para impresión con media print. Completado. HistorialClinico.tsx incluye el reporte con formato de certificado médico y clases no-print para ocultar controles de navegación.
- T08.2: Integrar funcionalidad nativa de navegador para imprimir. Completado. El botón "Imprimir Receta / Ficha" ejecuta window.print().
- T08.3: Asegurar correcta visualización de datos en la impresión. Completado. El documento impreso muestra nombre del médico, paciente, RUT, especialidad, signos vitales, diagnóstico y receta.
- T08.4: Rediseñar el layout del documento usando fuentes serif, márgenes amplios y tipografía estándar médica. Pendiente. El diseño actual usa el sistema de clases Tailwind sin la especificación tipográfica formal.
- T08.5: Integrar html2canvas.js y jsPDF para generación y descarga de PDF. Pendiente.
- T08.6: Implementar botón de descarga como PDF independiente del botón de impresión. Pendiente.
- T08.7: Crear cron job en el backend para generar el PDF y enviarlo al paciente por correo electrónico. Pendiente.
- T08.8: Mejorar la UI del módulo de impresión/descarga para que sea más clara en dispositivos móviles. Pendiente.

Criterios de aceptación:
Al hacer clic en imprimir, se abre el diálogo de impresión del sistema operativo. El documento muestra todos los datos del acto médico. Los botones de navegación no aparecen en la impresión. El paciente puede descargar el documento como PDF sin instalar software adicional.

---

### HU09 — Sincronización automática de identidad en salas virtuales

Como médico, necesito saber exactamente quién es el paciente que está en mi sala antes de iniciar la consulta clínica.

Estado: completado

Concepto de implementación: El sistema vincula el Room ID de la videollamada con el registro de la cita en la base de datos, asegurando que el médico ve la identidad del paciente antes de comenzar. La verificación de identidad ocurre en el entorno de pre-sala (PreFlightCheck) que se configura para establecer mejor la conexión entre ambas partes.

Tareas:
- T09.1: Crear endpoint GET /api/appointments/room/:roomId para mapear la sala con la cita. Completado. AppointmentRepository.findByMeetingLink busca por el link completo e incluye datos relacionados.
- T09.2: Desplegar bloqueos visuales hasta que ambas partes estén autenticadas. Completado. PreFlightCheck bloquea la entrada sin permisos de audio; el token de LiveKit solo se otorga a usuarios con cita asignada.
- T09.3: Mostrar información del paciente en la pantalla del médico dentro de la llamada. Completado. El panel de ficha clínica muestra nombre y RUT del paciente leídos del estado appointment.
- T09.4: Cambios en Videollamada.tsx para mostrar información del paciente al médico. Completado. El panel lateral renderiza appointment.patient.name y appointment.patient.rut para el médico.
- T09.5: Mejorar UI de la sala virtual en el entorno móvil y de navegador. Pendiente. La vista móvil de la videollamada tiene el panel lateral como drawer deslizable pero la experiencia puede mejorar.

Criterios de aceptación:
El médico ve el nombre completo y RUT del paciente en el panel lateral. El paciente ve el nombre y especialidad de su médico. Un usuario externo sin cita asignada no puede obtener el token de acceso a LiveKit.

---

### HU05 — Notificaciones de cita

Como paciente rural, necesito recibir recordatorios automáticos de mi cita, 24 y 1 hora antes de la teleconsulta, para no olvidar conectarme a tiempo.

Estado: pendiente

Concepto de implementación: Sistema automatizado de correos electrónicos que se enviarán a los pacientes para recordarles sus citas, con la finalidad de evitar el ausentismo en las teleconsultas. Se implementará mediante un cron job en el servidor Node.js que barre las citas próximas y envía los correos utilizando Nodemailer o Resend como proveedor de correo transaccional.

Tareas:
- T05.1: Integrar API de correos (Nodemailer o Resend) o de SMS. Pendiente.
- T05.2: Crear el cron job para el envío de notificaciones de recordatorio barriendo citas próximas. Pendiente.
- T05.3: Crear la lógica del algoritmo de notificación para ejecutarse 24 y 1 hora antes de cada cita. Pendiente.
- T05.4: Crear la interfaz de confirmación de recordatorio en el frontend. Pendiente.
- T05.5: Añadir configuraciones al perfil del paciente para activar o desactivar notificaciones. Pendiente.

Criterios de aceptación que deberán cumplirse:
El paciente recibe un correo 24 horas antes de su cita confirmada. El paciente recibe un segundo correo 1 hora antes. El sistema no envía recordatorios si la cita fue cancelada. El paciente puede desactivar los recordatorios desde su perfil.

---

### HU06 — Panel de administración

Como administrador del sistema, necesito poder gestionar usuarios (pacientes y médicos), especialidades, médicos y horarios de atención, así como eliminar registros desde el panel central de administración.

Estado: parcialmente completado

Concepto de implementación: Centro de control administrativo protegido por el middleware de roles para la moderación del sistema. El administrador puede ver estadísticas globales y realizar operaciones de mantenimiento. La funcionalidad de gestión completa de usuarios (creación, desactivación, asignación de especialidades) está pendiente.

Tareas:
- T06.1: Soportar roles Admin, Patient, Doctor en el modelo User. Completado. El campo role en schema.prisma acepta los tres valores.
- T06.2: Crear endpoints CRUD para usuarios orientados a administradores. Parcialmente completado. Las estadísticas están implementadas; el CRUD de usuarios no.
- T06.3: Crear UI del panel de administración en React. Parcialmente completado. DashboardAdmin.tsx muestra KPIs y log de actividad; la gestión de cuentas no está completada.
- T06.4: Implementar middleware de autenticación por rol en el backend. Completado. El middleware protect valida el JWT y los servicios verifican el rol específico.
- T06.5: Crear sistema de auditoría básica (logs) para registrar accesos y modificaciones. Pendiente.
- T06.6: Crear interfaz de administración de usuarios en React. Pendiente. Incluye creación de médicos, activación y desactivación de cuentas.
- T06.7: Implementar sistema de eliminación de citas registradas con interfaz en el frontend. Completado. El endpoint DELETE /api/appointments/all y el botón "Limpiar Todas las Citas" en DashboardAdmin.tsx están implementados y conectados en tiempo real a la base de datos de DigitalOcean.

Criterios de aceptación:
El administrador puede ver el total de pacientes, médicos y citas del sistema. El administrador puede limpiar todas las citas del sistema de pruebas. El panel es inaccesible para usuarios con rol PATIENT o DOCTOR. El administrador puede crear cuentas de médico desde la interfaz.

---

### HU10 — Experiencia de usuario en dashboards

Como paciente (usuario), necesito que los paneles de control respondan rápidamente y me redirijan automáticamente al realizar una acción importante (aceptar o finalizar consulta), sin perder el contexto de mi sesión.

Estado: parcialmente completado

Concepto de implementación: Mejoras iterativas en las redirecciones de la SPA (Single Page Application) de navegador para evitar pantallas en negro o blanco, refrescos innecesarios y pérdida de contexto de la sesión. El sistema de rutas está implementado mediante React Router con HashRouter. Las mejoras se aplican tanto en la vista de navegador como en el entorno móvil.

Tareas:
- T10.1: Implementar redirección instantánea tras aceptar citas de hoy en Dashboard Médico. Parcialmente completado. Se implementó el window.confirm, pero la redirección automática garantizada queda pendiente.
- T10.2: Mejorar diseño de tarjeta en espera en Dashboard Paciente. Completado. Las tarjetas PENDING tienen diseño diferenciado con fondo amarillo y mensaje informativo.
- T10.3: Limpieza de estado y cierre de conexiones al desmontar componentes de llamadas. Completado. El useEffect de cleanup en Videollamada.tsx desconecta la sala de LiveKit y detiene los tracks de media.

Criterios de aceptación:
Al aceptar una cita de hoy, el médico puede entrar directamente a la sala. Las tarjetas de cita pendiente muestran claramente que el médico debe confirmar. Al salir de la videollamada, todos los recursos de cámara y micrófono son liberados.

---

## Épica 3 — Seguridad del desarrollo y calidad del código

Esta épica agrupa las herramientas y prácticas de seguridad en el proceso de desarrollo. Cubre la gestión segura de credenciales, el análisis estático de vulnerabilidades, las pruebas automatizadas y la detección en tiempo real de malas prácticas de seguridad en el código fuente.

---

### HU11 — Integración de 1Password para gestión segura de secretos

Como desarrollador del sistema, necesito proteger todas las credenciales, claves API y secretos de configuración (LiveKit, base de datos, Nodemailer) para que nunca se expongan en el código fuente o repositorio, garantizando la confidencialidad del sistema.

Estado: pendiente

Concepto de implementación: Se integrará la extensión 1Password for VS Code en el entorno de desarrollo. Esta herramienta detecta automáticamente secretos en texto plano (como LIVEKIT_API_KEY, claves de firma JWT, URI de PostgreSQL) y permite guardarlos en una bóveda segura, reemplazándolos en el código por referencias op://. De esta forma se evita la filtración accidental de credenciales al repositorio y se centraliza su gestión, incluso en archivos como .env o docker-compose.yml.

Tareas:
- T11.1: Instalar la extensión 1Password for VS Code desde el marketplace y autenticarla con la cuenta de 1Password. Pendiente.
- T11.2: Configurar una bóveda específica para el proyecto y almacenar todos los secretos actuales: LIVEKIT_API_KEY y LIVEKIT_SECRET, DATABASE_URL de PostgreSQL, JWT_SECRET y credenciales de la API de correo. Pendiente.
- T11.3: Reemplazar en los archivos de configuración (backend/.env, docker-compose.yml) los valores en texto plano por referencias secretas del formato op://. Pendiente.
- T11.4: Verificar que la extensión resalta automáticamente cualquier nueva clave que se escriba en el código. Pendiente.
- T11.5: Documentar el procedimiento para que cualquier nuevo desarrollador configure 1Password y acceda a los secretos necesarios. Pendiente.

Criterios de aceptación:
Ningún secreto en texto plano debe existir en el repositorio. La extensión alerta cuando se detecta un secreto sin protección. Cualquier nuevo miembro del equipo puede configurar el entorno de desarrollo siguiendo la documentación de 1Password.

---

### HU12 — Integración de Snyk para escaneo continuo de vulnerabilidades

Como desarrollador del sistema, necesito detectar proactivamente vulnerabilidades en las dependencias de npm y en las imágenes Docker para mitigar riesgos de seguridad sin salir del editor y antes de que lleguen a producción.

Estado: pendiente

Concepto de implementación: Se integrará la extensión Snyk en VS Code, que realiza análisis estático (SAST), de composición de software (SCA) y escaneo de configuraciones de infraestructura como código. Analizará automáticamente los archivos package.json del backend y frontend, así como los Dockerfile del proyecto. Alertará sobre versiones con CVEs conocidas y sugerirá las actualizaciones exactas necesarias.

Tareas:
- T12.1: Instalar la extensión Snyk en VS Code y autenticarse con una cuenta gratuita o de equipo. Pendiente.
- T12.2: Ejecutar un escaneo inicial del proyecto para obtener un informe de vulnerabilidades actuales en dependencias de Node.js. Pendiente.
- T12.3: Analizar los Dockerfile del backend y del servidor LiveKit para identificar imágenes base inseguras. Pendiente.
- T12.4: Configurar la extensión para realizar escaneos automáticos al abrir el proyecto o modificar los archivos de dependencias. Pendiente.
- T12.5: Incorporar en el flujo de desarrollo la revisión periódica de avisos de Snyk y la actualización de paquetes vulnerables como parte de la definición de "Done" en los sprints. Pendiente.

Criterios de aceptación:
El equipo conoce el estado actual de vulnerabilidades en todas las dependencias. Las vulnerabilidades de severidad alta o crítica se corrigen antes de desplegar a producción. Los Dockerfile usan imágenes base sin vulnerabilidades críticas conocidas.

---

### HU13 — Integración de CodeQL para análisis estático avanzado de seguridad

Como desarrollador del sistema, necesito analizar el código fuente en busca de vulnerabilidades complejas como fallos de control de acceso, inyecciones o fugas de información para garantizar que los endpoints sensibles (admin, historial clínico, videollamada) estén correctamente protegidos.

Estado: pendiente

Concepto de implementación: Se utilizará la extensión CodeQL de GitHub para ejecutar consultas avanzadas de seguridad sobre el código. Se aplicarán las consultas de la suite Security Extended para examinar los middleware de autenticación por roles, los endpoints REST de pacientes y médicos, y la lógica de acceso a salas de videollamada. La herramienta mostrará flujos de datos inseguros directamente en el editor.

Tareas:
- T13.1: Instalar la extensión CodeQL en VS Code y vincularla con el repositorio del proyecto. Pendiente.
- T13.2: Seleccionar la base de consultas de seguridad Extended para JavaScript/TypeScript. Pendiente.
- T13.3: Ejecutar análisis completo del backend focalizándose en: control de acceso en rutas de administración, validación de propiedad en acceso a historiales clínicos, y manejo de entrada de usuario en formularios de registro y agendamiento. Pendiente.
- T13.4: Revisar los hallazgos, corregir los verdaderos positivos y documentar las excepciones. Pendiente.
- T13.5: Incorporar CodeQL como paso previo a la creación de Pull Requests o en revisiones manuales periódicas. Pendiente.

Criterios de aceptación:
Ningún flujo de datos inseguro de severidad alta existe en los endpoints de admin, historial y videollamada. Los controles de acceso por rol verificados por CodeQL no presentan bypasses. Los hallazgos del análisis están documentados con su estado de resolución.

---

### HU14 — Integración de Keploy para generación automática de pruebas

Como desarrollador del sistema, necesito acelerar la creación de tests unitarios y de integración para los endpoints y lógica de negocio del sistema para asegurar cobertura de pruebas que reduzca regresiones y valide las reglas críticas (choques de horario, autorización, flujo de cita).

Estado: pendiente

Concepto de implementación: Mediante la extensión Keploy Unit Test Generator con IA se generarán suites de prueba para los controladores más importantes del backend. La herramienta analizará funciones de TypeScript y creará archivos de test en Jest que cubren casos de éxito, error y límites. Esto permitirá contar rápidamente con una red de seguridad para los endpoints de reserva de teleconsultas (HU04), historial clínico (HU02) y autenticación (HU03).

Tareas:
- T14.1: Instalar la extensión Keploy en VS Code y configurar Jest como framework de testing en el proyecto. Pendiente.
- T14.2: Generar pruebas unitarias para el controlador de agendamiento de citas, incluyendo validación de fechas, prevención de choques y estados de la cita. Pendiente.
- T14.3: Generar pruebas para el controlador de historial clínico verificando permisos de médico y asociación con el paciente correcto. Pendiente.
- T14.4: Generar pruebas de integración para los endpoints de autenticación (registro e inicio de sesión de médicos y pacientes). Pendiente.
- T14.5: Revisar las pruebas generadas, ajustar aserciones y ejecutarlas para comprobar que pasan correctamente. Pendiente.
- T14.6: Integrar la ejecución de tests en el flujo de trabajo con Husky como pre-commit o en GitHub Actions. Pendiente.

Criterios de aceptación:
Los controladores de citas, historial clínico y autenticación tienen cobertura de tests de al menos un caso de éxito y un caso de error por endpoint. Los tests pasan en el entorno de integración continua. Un nuevo desarrollador puede ejecutar los tests con npm test sin configuración adicional.

---

### HU15 — Integración de SecureCodeGuard para detección de vulnerabilidades en tiempo real

Como desarrollador del sistema, necesito recibir alertas instantáneas mientras escribo código sobre posibles vulnerabilidades (XSS, inyecciones, validaciones faltantes) y obtener correcciones automáticas para mejorar la seguridad del código desde el momento de su creación.

Estado: pendiente

Concepto de implementación: La extensión SecureCodeGuard se integrará en el entorno de desarrollo para analizar en tiempo real los archivos TypeScript, JavaScript y React. Subrayará patrones inseguros (uso de eval, concatenación en queries, falta de sanitización de HTML) y sugerirá correcciones con IA. Se aplicará especialmente en los componentes de registro de médicos, formularios de agendamiento y la generación de recetas médicas (HU08), donde un descuido puede introducir una vulnerabilidad explotable.

Tareas:
- T15.1: Instalar SecureCodeGuard en VS Code y autenticarla con la cuenta del equipo. Pendiente.
- T15.2: Configurar las reglas de análisis para TypeScript y React (JSX/TSX). Pendiente.
- T15.3: Revisar los componentes actuales del frontend: formulario de registro e inicio de sesión (HU03), formulario de reserva de teleconsultas (HU04) y plantilla de receta médica imprimible (HU08). Aplicar correcciones sugeridas por la extensión. Pendiente.
- T15.4: Durante el desarrollo de nuevas características, atender las alertas emergentes y aplicar los snippets de corrección para interiorizar patrones seguros. Pendiente.
- T15.5: Ajustar la configuración si se detectan falsos positivos recurrentes, manteniendo balance entre rigurosidad y productividad. Pendiente.

Criterios de aceptación:
Los formularios de registro y agendamiento no tienen advertencias de XSS o inyección en SecureCodeGuard. Los nuevos componentes desarrollados son revisados por la extensión antes de ser confirmados al repositorio. El equipo tiene un proceso documentado para responder a las alertas de seguridad en tiempo real.

---

## Resumen del estado actual por historia

HU00 — Preparación técnica: parcialmente completado (pendiente Docker completo, datos del excel)
HU03 — Registro e inicio de sesión del médico: parcialmente completado (pendiente creación de médicos desde admin)
HU04 — Reserva de teleconsulta: completado con limitaciones (pendiente prevención de choques, horarios dinámicos)
HU01 — Videollamada segura: completado
HU07 — Videollamada de alta disponibilidad: completado (optimización de recursos para redes muy lentas pendiente)
HU02 — Historial clínico: completado
HU08 — Receta médica imprimible: parcialmente completado (pendiente PDF y diseño tipográfico formal)
HU09 — Sincronización de identidad en salas: completado
HU05 — Notificaciones de cita: pendiente
HU06 — Panel de administración: parcialmente completado
HU10 — Experiencia de usuario en dashboards: parcialmente completado
HU11 — 1Password para secretos: pendiente
HU12 — Snyk para vulnerabilidades de dependencias: pendiente
HU13 — CodeQL para análisis estático: pendiente
HU14 — Keploy para generación de pruebas: pendiente
HU15 — SecureCodeGuard para detección en tiempo real: pendiente
