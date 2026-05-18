# Sprint Backlog — mediCampo v2

Documento de registro de tareas, estado y organización por sprint del proyecto mediCampo v2. Cubre las dos iteraciones de desarrollo completadas y el estado actual de cada tarea asociada a cada historia de usuario dentro de sus épicas correspondientes.

---

## Contexto del proyecto

mediCampo v2 es una plataforma de telemedicina orientada a zonas rurales de Chile. Nació como refactorización total de una maqueta generada con Bolt.new, que carecía de backend, persistencia real y lógica de negocio. El objetivo fue construir una arquitectura full-stack real usando Node.js con Express en el backend y React con Vite en el frontend, conectados a una base de datos PostgreSQL gestionada en DigitalOcean.

La organización del trabajo sigue tres épicas que agrupan las historias de usuario por dominio funcional. Las historias de usuario se identifican con el prefijo HU seguido de dos dígitos (HU00 a HU15). Las tareas dentro de cada historia usan el prefijo T más el número de historia y un índice secuencial.

---

## Épica 1 — Acceso, autenticación y gestión de usuarios

Esta épica agrupa todo lo relacionado con la identificación segura de usuarios, la gestión de sesiones y el control de acceso por roles dentro del sistema.

### Sprint 1 — Épica 1

Tarea T00.1 — Inicializar repositorio Git limpio, desvinculado de Bolt.new
Historia: HU00
Estado: completado
El directorio mediCampo-v2 fue reinicializado como repositorio independiente. Se configuró la estructura de carpetas separando backend y frontend como proyectos npm independientes con sus propios archivos package.json y tsconfig.json.

Tarea T00.2 — Configurar servidor base con Express.js y Node.js
Historia: HU00
Estado: completado
Se creó el archivo backend/src/server.ts que inicializa Express, registra los middlewares de CORS y JSON, monta las rutas bajo el prefijo /api y arranca un servidor HTTP en el puerto definido por variable de entorno.

Tarea T00.3 — Aprovisionar base de datos PostgreSQL en DigitalOcean
Historia: HU00
Estado: completado
Se conectó el backend a la instancia de PostgreSQL gestionada de DigitalOcean mediante la variable de entorno DATABASE_URL con soporte SSL requerido. La conexión es gestionada por Prisma ORM a través del singleton en backend/src/config/database.ts. Se usa Docker para que el backend y la base de datos sean portables entre entornos.

Tarea T00.4 — Migrar frontend original de Bolt.new a la carpeta frontend/
Historia: HU00
Estado: completado
Los archivos originales de Bolt.new fueron movidos a la carpeta frontend/ y configurados como proyecto Vite independiente con sus propias dependencias y configuración de TypeScript.

Tarea T00.5 — Configurar variables de entorno y TypeScript en el backend
Historia: HU00
Estado: completado
Se configuró tsconfig.json para el backend, se creó el archivo .env con las variables necesarias (PORT, DATABASE_URL, JWT_SECRET, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL, FRONTEND_URL) y se integraron las herramientas de compilación TypeScript. Pendiente: configuración formal de ESLint, Prettier y Husky para hooks de pre-commit.

Tarea T00.6 — Cargar datos de excel de consultas médicas a la base de datos
Historia: HU00
Estado: pendiente
Los datos de especialidades y médicos actuales provienen del seed.ts. Se requiere un proceso de importación desde el excel de referencia para el entorno real con datos reales de especialistas disponibles.

Tarea T03.1 — Crear esquema Prisma para la entidad User con soporte de roles
Historia: HU03
Estado: completado
El modelo User en backend/prisma/schema.prisma define los campos: id, rut (único), name, email (único), password, role (PATIENT por defecto), specialtyId (relación opcional con Specialty), y los timestamps createdAt y updatedAt.

Tarea T03.2 — Desarrollar endpoint de registro POST /api/auth/register
Historia: HU03
Estado: completado
El endpoint valida que no exista usuario con el mismo email ni RUT, hashea la contraseña con bcryptjs (salt de 10 rondas) y almacena el nuevo usuario. Devuelve el objeto usuario sin el campo password. Implementado en backend/src/controllers/authController.ts delegando la lógica al AuthService en backend/src/services/AuthService.ts.

Tarea T03.3 — Desarrollar endpoint de inicio de sesión POST /api/auth/login
Historia: HU03
Estado: completado
El endpoint busca el usuario por email, compara la contraseña usando bcrypt.compare y genera un JWT firmado con la clave secreta. El payload del token incluye el id del usuario (sub), su rol (role) y nombre (name). La configuración del JWT está centralizada en backend/src/config/jwt.ts.

Tarea T03.4 — Implementar UI de registro y login en el frontend
Historia: HU03
Estado: completado
Los componentes frontend/src/components/auth/Login.tsx y frontend/src/components/auth/Register.tsx gestionan los formularios de acceso. El componente App.tsx en frontend/src/App.tsx verifica si el usuario está autenticado y decide si mostrar la pantalla de login o el contenido de la aplicación.

Tarea T03.5 — Configurar manejo de sesión en el cliente
Historia: HU03
Estado: completado
El contexto de autenticación en frontend/src/context/AuthContext.tsx persiste el token JWT y el objeto usuario en localStorage bajo las claves medicampo_token y medicampo_user. Al cargar la aplicación, lee estos valores y restaura la sesión. El método logout limpia el storage y redirige a la raíz.

Tarea T03.6 — Formulario en el panel de administración para crear cuentas de médico
Historia: HU03
Estado: pendiente
Actualmente los médicos solo se crean mediante el script seed en backend/prisma/seed.ts. El administrador necesita un formulario en DashboardAdmin que llame a un endpoint protegido para crear cuentas con rol DOCTOR.

Tarea T03.7 — Diseño con Material UI para pantallas de registro y login
Historia: HU03
Estado: pendiente
Se usará la librería Material UI como referencia de diseño para hacer las pantallas de acceso más profesionales y accesibles para usuarios con baja alfabetización digital.

### Sprint 2 — Épica 1

Tarea T06.1 — Soportar roles Admin, Patient, Doctor en el modelo User
Historia: HU06
Estado: completado
El modelo User en schema.prisma define el campo role como String con valor por defecto PATIENT. Los roles DOCTOR y ADMIN se asignan mediante el script seed en backend/prisma/seed.ts.

Tarea T06.2 — Endpoint de estadísticas del sistema GET /api/clinical/admin/stats
Historia: HU06
Estado: completado
El endpoint ejecuta cinco consultas en paralelo con Promise.all: conteo de usuarios PATIENT, conteo de usuarios DOCTOR, conteo total de citas, conteo de citas COMPLETED y las últimas 10 citas ordenadas por createdAt descendente. El controlador en backend/src/controllers/clinicalController.ts verifica que el rol sea ADMIN antes de devolver los datos.

Tarea T06.3 — UI del panel de administración en React
Historia: HU06
Estado: parcialmente completado
El componente frontend/src/components/dashboards/DashboardAdmin.tsx muestra los KPIs del sistema (total de pacientes, médicos, citas, tasa de cumplimiento) y el log de actividad reciente. La gestión directa de cuentas de médico desde el panel no está completada.

Tarea T06.4 — Middleware de autenticación por rol
Historia: HU06
Estado: completado
El middleware en backend/src/middleware/authMiddleware.ts valida el token Bearer en el header de autorización usando jwt.verify y adjunta el payload decodificado al objeto request. Las rutas protegidas comprueban el rol dentro de los servicios y controladores correspondientes.

Tarea T06.5 — Sistema de auditoría de acciones administrativas
Historia: HU06
Estado: pendiente
No existe un modelo de logs de auditoría en la base de datos. Las acciones del administrador (limpieza de citas, estadísticas consultadas) no quedan registradas. Se requiere un modelo AuditLog con campos userId, action, timestamp y details.

---

## Épica 2 — Gestión de la atención médica

Esta épica cubre el flujo completo de una teleconsulta: desde la reserva de la cita hasta la videollamada y el registro del historial clínico.

### Sprint 1 — Épica 2

Tarea T04.1 — Crear modelos de Specialty y Appointment en Prisma
Historia: HU04
Estado: completado
El modelo Specialty en schema.prisma define id y name (único) con relación a los usuarios doctores. El modelo Appointment define patientId, doctorId, date, status (PENDING por defecto), meetingLink y la relación uno a uno con ClinicalRecord.

Tarea T04.2 — Endpoints para crear y consultar citas
Historia: HU04
Estado: completado
POST /api/appointments/book crea una cita generando un meetingLink aleatorio con el formato /room/[hash]. GET /api/appointments/my-appointments devuelve las citas del usuario autenticado filtrando por rol. Implementados en backend/src/controllers/appointmentController.ts.

Tarea T04.3 — Interfaz de reserva con selección de médico, fecha y horario
Historia: HU04
Estado: parcialmente completado
El componente frontend/src/components/ReservaCita.tsx muestra la lista de médicos obtenida del endpoint GET /api/appointments/doctors, un selector de fecha y una cuadrícula de horarios fijos disponibles (09:00, 10:00, 11:30, 14:00, 15:30, 17:00). Los filtros por especialidad y la obtención de horarios desde la base de datos quedan pendientes.

Tarea T04.4 — Endpoint de aceptación y rechazo PATCH /api/appointments/:id/status
Historia: HU04
Estado: completado
AppointmentService verifica que exista una cita con ese id y ese doctorId antes de actualizar el estado. Si el médico intenta cambiar el estado de una cita que no le pertenece recibe error 403. Implementado en backend/src/services/AppointmentService.ts.

Tarea T04.5 — Generar enlace único al confirmar la cita
Historia: HU04
Estado: completado
Al crear la cita en AppointmentService, se genera el meetingLink usando Math.random().toString(36).substring(7) y se almacena en la base de datos. El paciente recibe este link en la respuesta y puede usarlo para acceder a la sala cuando la cita esté confirmada.

Tarea T04.6 — Interfaz del médico para aceptar y rechazar solicitudes
Historia: HU04
Estado: completado
DashboardMedico.tsx en frontend/src/components/dashboards/ muestra las solicitudes PENDING con botones de aceptar y rechazar. La función handleStatusUpdate envía el PATCH y recarga las citas con fetchAppointments.

Tarea T04.7 — Lógica para prevenir choques de citas
Historia: HU04
Estado: pendiente
El sistema crea la cita directamente sin validar si ya existe otra en el mismo horario con el mismo médico. AppointmentService.createAppointment debe verificar antes de crear si ya existe una cita con el mismo doctorId y date. Si existe debe devolver AppError 409 con mensaje de conflicto de horario.

Tarea T04.8 — Horarios dinámicos desde la base de datos
Historia: HU04
Estado: pendiente
Los horarios disponibles están hardcodeados en frontend/src/components/ReservaCita.tsx como array fijo. Se requiere un modelo de disponibilidad en la base de datos que el médico pueda gestionar.

Tarea T01.1 — Implementar servidor de señalización Socket.io
Historia: HU01
Estado: completado (reemplazado posteriormente por LiveKit)
Se configuró Socket.io en backend/src/config/socket.ts con autenticación JWT en el middleware de conexión. Los eventos join-room y user-connected permitían la señalización P2P con PeerJS. Este mecanismo fue reemplazado por LiveKit SFU en el Sprint 2.

Tarea T01.2 — Componente de videollamada en React
Historia: HU01
Estado: completado (evolucionado a LiveKit)
El componente Videollamada.tsx fue construido inicialmente usando PeerJS para la comunicación P2P y luego migrado a los componentes de @livekit/components-react con LiveKitRoom, GridLayout y ParticipantTile.

Tarea T01.3 — Controles de micrófono, cámara y finalización de llamada
Historia: HU01
Estado: completado
El subcomponente ControlesPersonalizados en Videollamada.tsx usa el hook useLocalParticipant de LiveKit para activar y desactivar micrófono y cámara mediante localParticipant.setMicrophoneEnabled y localParticipant.setCameraEnabled. El botón de colgar ejecuta navigate(-1) que cierra la sala.

Tarea T01.4 — Indicadores de sesión segura y calidad de red
Historia: HU01
Estado: completado
El encabezado de la videollamada muestra un ícono de escudo y la leyenda "Cifrado Militar". El componente IndicadorCalidadRed monitorea los eventos RoomEvent.Disconnected, RoomEvent.Reconnecting y RoomEvent.Reconnected de LiveKit para mostrar el estado de la conexión en tiempo real.

### Sprint 2 — Épica 2

Tarea T02.1 — Crear modelo ClinicalRecord asociado al Appointment
Historia: HU02
Estado: completado
El modelo ClinicalRecord en schema.prisma almacena los campos de constantes vitales (weight, height, bloodPressure, temperature, heartRate, oxygenSat), allergies, symptoms, diagnosis, prescription y observations. Tiene relación uno a uno con Appointment mediante appointmentId único.

Tarea T02.2 — Endpoint para guardar ficha clínica y marcar cita como completada
Historia: HU02
Estado: completado
POST /api/clinical/:appointmentId verifica que el doctor autenticado sea el asignado a la cita mediante appointmentRepository.findByIdAndDoctor, crea o actualiza el ClinicalRecord mediante upsert y cambia el estado de la cita a COMPLETED. Implementado en ClinicalService y ClinicalRecordRepository.

Tarea T02.3 — Endpoints para consultar historial y fichas clínicas
Historia: HU02
Estado: completado
GET /api/clinical/patient/:patientId devuelve las citas completadas del paciente incluyendo el ClinicalRecord con verificación de que un PATIENT solo puede ver su propio historial. GET /api/clinical/appointment/:appointmentId devuelve la ficha clínica de una cita específica con datos del médico y paciente anidados.

Tarea T02.4 — Formulario de ficha clínica en el panel de videollamada
Historia: HU02
Estado: parcialmente completado
El panel derecho de Videollamada.tsx muestra un formulario al doctor con campos para diagnóstico (diagnosis) y prescripción (prescription). Los campos de constantes vitales que el modelo de base de datos sí soporta (weight, height, bloodPressure, temperature, heartRate, oxygenSat) no están expuestos en la interfaz.

Tarea T07.1 — Desplegar servidor LiveKit en DigitalOcean
Historia: HU07
Estado: completado
Se configuró un Droplet independiente de DigitalOcean con el servidor LiveKit corriendo en Docker. El acceso se habilitó bajo el subdominio medicampo-rtc.duckdns.org con certificado SSL gestionado por Caddy. Se abrieron los puertos TCP 443, UDP 443, UDP 3478 y el rango UDP 50000-60000 en el firewall.

Tarea T07.2 — Crear endpoint /api/livekit/token en el backend
Historia: HU07
Estado: completado
El endpoint GET /api/livekit/token valida el JWT del usuario, verifica que el usuario tenga una cita asociada a la sala solicitada, genera un AccessToken firmado con la API_KEY y API_SECRET de LiveKit con permisos de publicación y suscripción y un TTL de 10 minutos, y lo devuelve al cliente. Implementado en LiveKitService y livekitController.

Tarea T07.3 — Refactorizar frontend con @livekit/components-react
Historia: HU07
Estado: completado
Videollamada.tsx fue reescrito para usar los hooks y componentes de LiveKit. Incluye el PreFlightCheck para validar hardware, la petición del token al backend con 3 reintentos y backoff progresivo, la conexión al servidor con LiveKitRoom, la renderización de participantes con GridLayout y ParticipantTile, y el chat en tiempo real con ChatConsulta.

Tarea T07.4 — Reconexión automática y adaptación de bitrate
Historia: HU07
Estado: completado
La opción adaptiveStream de LiveKitRoom activa la adaptación automática de calidad según el ancho de banda. La lógica de reconexión manual en fetchToken reintenta hasta 3 veces con delays progresivos de 2, 4 y 6 segundos ante errores de token.

Tarea T08.1 — Layout CSS para impresión del historial clínico
Historia: HU08
Estado: completado
El componente frontend/src/components/HistorialClinico.tsx incluye estilos con clases no-print para ocultar controles de navegación al imprimir. El diseño del reporte médico (cabecera con gradiente, secciones de datos del paciente y médico, signos vitales, diagnóstico y receta) está optimizado para formato papel.

Tarea T08.2 — Funcionalidad de impresión nativa del navegador
Historia: HU08
Estado: completado
El botón "Imprimir Receta / Ficha" en HistorialClinico.tsx llama a window.print() que abre el diálogo de impresión nativo del sistema operativo.

Tarea T08.3 — Generación de PDF descargable del reporte médico
Historia: HU08
Estado: pendiente
Actualmente solo se soporta impresión directa mediante window.print(). La generación de un archivo PDF descargable requiere una librería como jsPDF o una solución de renderizado en el servidor.

Tarea T09.1 — Endpoint para mapear roomId con cita en la base de datos
Historia: HU09
Estado: completado
GET /api/appointments/room/:roomId busca la cita cuyo meetingLink coincida con /room/:roomId e incluye los datos del paciente y médico. Implementado en AppointmentRepository.findByMeetingLink.

Tarea T09.2 — Carga de identidades en el panel lateral de la videollamada
Historia: HU09
Estado: completado
Cuando Videollamada.tsx recibe la cita, el médico ve el nombre completo y RUT del paciente en el panel lateral y el paciente ve el nombre y especialidad del médico. La condición user.role === 'DOCTOR' en Videollamada.tsx determina qué datos se muestran a cada participante.

Tarea T05.1 — Sistema de notificaciones de recordatorio de cita
Historia: HU05
Estado: pendiente
Integración de Nodemailer o Resend para enviar recordatorios de cita por correo electrónico 24 horas y 1 hora antes de la consulta. Requiere configurar un proveedor de correo transaccional y un sistema de cron jobs en Node.js ejecutándose junto al servidor.

Tarea T10.1 — Redirección automática tras aceptar cita de hoy en el Dashboard del Médico
Historia: HU10
Estado: parcialmente completado
Al aceptar una cita programada para el día actual, el frontend muestra un window.confirm preguntando si el médico quiere entrar ahora. Si confirma, navega al meetingLink. La redirección automática garantizada sin diálogo nativo queda pendiente.

Tarea T10.2 — Diseño diferenciado de tarjetas de cita en el Dashboard del Paciente
Historia: HU10
Estado: completado
Las tarjetas PENDING en DashboardPaciente.tsx tienen fondo amarillo con borde punteado y mensaje "El médico confirmará pronto". Las tarjetas CONFIRMED tienen fondo blanco con borde sólido y el mensaje "Todo listo para la cita". El badge de estado usa colores diferenciados por tipo.

Tarea T10.3 — Limpieza de recursos de media al salir de la videollamada
Historia: HU10
Estado: completado
El useEffect de cleanup en Videollamada.tsx ejecuta roomRef.current.disconnect() para cerrar la conexión de LiveKit y detiene los tracks de media activos con track.stop() para liberar la cámara y el micrófono del sistema operativo al desmontar el componente.

Tarea TC.1 — Soporte de HashRouter para rutas dinámicas en producción
Historia: HU10
Estado: completado
El uso de HashRouter en frontend/src/main.tsx resolvió los errores 404 al recargar páginas con rutas dinámicas en el hosting estático de DigitalOcean. Las rutas usan el formato /#/room/:roomId que siempre carga el index.html primero.

Tarea TC.2 — Optimización de consultas a la base de datos
Historia: HU02
Estado: completado
Los repositorios usan select específicos en las relaciones de Prisma para evitar over-fetching. Las citas incluyen datos del doctor y paciente en una sola consulta con include, evitando consultas N+1.

Tarea TC.3 — Resiliencia frente a caídas de conexión en videollamada
Historia: HU07
Estado: completado
El componente Videollamada.tsx monitorea los eventos de sala de LiveKit. La lógica de fetchToken implementa reintentos automáticos con backoff progresivo. El cleanup al desmontar el componente desconecta la sala y detiene los tracks de media activos.

---

## Épica 3 — Seguridad del desarrollo y calidad del código

Esta épica agrupa las herramientas y prácticas de seguridad en el proceso de desarrollo. Cubre la gestión segura de credenciales, el análisis estático de vulnerabilidades, las pruebas automatizadas y la detección en tiempo real de malas prácticas de seguridad. Todas las tareas de esta épica están pendientes de ejecución y corresponden al siguiente ciclo de trabajo.

### Sprint 3 (planificado)

Tarea T11.1 — Instalar y autenticar la extensión 1Password for VS Code
Historia: HU11
Estado: pendiente
Instalar la extensión desde el marketplace de VS Code y autenticarla con la cuenta de 1Password del equipo.

Tarea T11.2 — Configurar bóveda del proyecto y migrar secretos actuales
Historia: HU11
Estado: pendiente
Crear una bóveda específica para mediCampo y almacenar todos los secretos actuales: la clave y secreto de la API de LiveKit, la URI de PostgreSQL, el JWT_SECRET y las credenciales de la API de correo transaccional.

Tarea T11.3 — Reemplazar valores en texto plano por referencias op://
Historia: HU11
Estado: pendiente
Modificar los archivos backend/.env y docker-compose.yml para usar referencias secretas del formato op:// en lugar de los valores en texto plano actuales.

Tarea T11.4 — Verificar detección automática de secretos en el editor
Historia: HU11
Estado: pendiente
Confirmar que la extensión resalta automáticamente cualquier nueva clave que se escriba en el código y que los archivos de configuración no contienen secretos en texto plano.

Tarea T11.5 — Documentar el proceso de configuración para nuevos desarrolladores
Historia: HU11
Estado: pendiente
Redactar las instrucciones para que un nuevo miembro del equipo configure 1Password y acceda a los secretos necesarios sin necesidad de recibir archivos .env por canales inseguros.

Tarea T12.1 — Instalar la extensión Snyk en VS Code y autenticarse
Historia: HU12
Estado: pendiente
Instalar la extensión Snyk desde el marketplace y autenticarla con cuenta gratuita o de equipo. El plan gratuito cubre análisis de dependencias y código para repositorios open source.

Tarea T12.2 — Ejecutar escaneo inicial del proyecto y registrar hallazgos
Historia: HU12
Estado: pendiente
Ejecutar un escaneo completo del proyecto para obtener un informe base de vulnerabilidades actuales en dependencias de Node.js en el backend y el frontend.

Tarea T12.3 — Analizar Dockerfile del backend y del servidor LiveKit
Historia: HU12
Estado: pendiente
Identificar imágenes base con vulnerabilidades conocidas en los Dockerfile y actualizar a versiones seguras.

Tarea T12.4 — Configurar escaneos automáticos al modificar dependencias
Historia: HU12
Estado: pendiente
Activar la configuración de Snyk para que realice escaneos automáticos al abrir el proyecto o al modificar package.json o package-lock.json.

Tarea T12.5 — Incorporar revisión de Snyk en la definición de hecho del sprint
Historia: HU12
Estado: pendiente
Establecer que antes de cerrar cualquier sprint se revisan los avisos de Snyk y se actualizan los paquetes con vulnerabilidades de severidad alta o crítica.

Tarea T13.1 — Instalar la extensión CodeQL y vincularla al repositorio
Historia: HU13
Estado: pendiente
Instalar la extensión CodeQL de GitHub en VS Code y vincularla con el repositorio del proyecto en GitHub.

Tarea T13.2 — Seleccionar la suite de consultas Security Extended para TypeScript
Historia: HU13
Estado: pendiente
Configurar la base de consultas de seguridad Extended para JavaScript y TypeScript, que incluye análisis de flujos de datos, inyecciones y problemas de control de acceso.

Tarea T13.3 — Ejecutar análisis completo del backend con foco en control de acceso
Historia: HU13
Estado: pendiente
Ejecutar el análisis concentrándose en los middleware de autenticación por roles, los endpoints REST de administración, historial clínico y generación de tokens LiveKit. Revisar que ningún endpoint sensible sea accesible sin validación correcta.

Tarea T13.4 — Revisar hallazgos, corregir positivos verdaderos y documentar excepciones
Historia: HU13
Estado: pendiente
Revisar cada hallazgo de CodeQL, aplicar las correcciones necesarias en el código y documentar las excepciones justificadas con comentarios inline.

Tarea T13.5 — Incorporar CodeQL como paso previo a Pull Requests
Historia: HU13
Estado: pendiente
Establecer el análisis de CodeQL como revisión obligatoria antes de fusionar cambios en la rama principal del repositorio, ya sea mediante GitHub Actions o revisión manual documentada.

Tarea T14.1 — Instalar Keploy en VS Code y configurar Jest en el proyecto
Historia: HU14
Estado: pendiente
Instalar la extensión Keploy Unit Test Generator en VS Code. Configurar Jest como framework de testing en el backend con los scripts npm test correspondientes.

Tarea T14.2 — Generar pruebas unitarias para el controlador de agendamiento
Historia: HU14
Estado: pendiente
Usar Keploy para generar tests que cubran la validación de fechas, la prevención de choques de horario y las transiciones de estado de la cita (PENDING a CONFIRMED, CONFIRMED a COMPLETED o CANCELLED).

Tarea T14.3 — Generar pruebas para el controlador de historial clínico
Historia: HU14
Estado: pendiente
Generar tests que verifiquen que el médico solo puede guardar fichas de sus propias citas y que un paciente solo puede ver su propio historial.

Tarea T14.4 — Generar pruebas de integración para los endpoints de autenticación
Historia: HU14
Estado: pendiente
Generar tests que cubran el registro con datos válidos, el registro con email duplicado, el login con credenciales correctas y el login con contraseña incorrecta.

Tarea T14.5 — Revisar y ejecutar las pruebas generadas
Historia: HU14
Estado: pendiente
Revisar las aserciones generadas por Keploy, ajustar los casos de prueba a los datos del seed y ejecutar la suite para confirmar que todos pasan correctamente.

Tarea T14.6 — Integrar ejecución de tests con Husky como pre-commit
Historia: HU14
Estado: pendiente
Configurar Husky para que ejecute automáticamente los tests antes de cada commit. Si algún test falla, el commit se bloquea hasta que se corrija el problema.

Tarea T15.1 — Instalar SecureCodeGuard en VS Code y autenticarla
Historia: HU15
Estado: pendiente
Instalar la extensión SecureCodeGuard desde el marketplace de VS Code y autenticarla con la cuenta del equipo.

Tarea T15.2 — Configurar reglas de análisis para TypeScript y React
Historia: HU15
Estado: pendiente
Activar el conjunto de reglas para TypeScript, JavaScript y JSX/TSX para que la extensión analice tanto el backend como el frontend del proyecto.

Tarea T15.3 — Revisar los componentes existentes con SecureCodeGuard
Historia: HU15
Estado: pendiente
Revisar los componentes Login.tsx y Register.tsx (HU03), el formulario ReservaCita.tsx (HU04) y la plantilla HistorialClinico.tsx (HU08). Aplicar las correcciones sugeridas por la extensión sobre patrones inseguros detectados.

Tarea T15.4 — Atender alertas emergentes durante el desarrollo de nuevas características
Historia: HU15
Estado: pendiente
Durante la implementación de HU03.6 (formulario de creación de médicos) y HU05 (notificaciones), usar SecureCodeGuard para validar que los nuevos componentes no introducen vulnerabilidades XSS, inyección o falta de sanitización.

Tarea T15.5 — Ajustar configuración para reducir falsos positivos
Historia: HU15
Estado: pendiente
Revisar las alertas recurrentes que resulten ser falsos positivos y ajustar la configuración de la extensión para mantener un balance entre rigurosidad y productividad del equipo.

---

## Tareas pendientes identificadas

Las siguientes tareas fueron planificadas pero no completadas al cierre del Sprint 2:

T05.1 — Sistema de notificaciones (HU05): integración de Nodemailer o Resend para enviar recordatorios de cita por correo electrónico 24 y 1 hora antes de la consulta. Requiere configurar un proveedor de correo transaccional y un sistema de cron jobs en Node.js.

T06.5 — Sistema de auditoría (HU06): logs de acceso y modificaciones administrativas almacenados en base de datos con modelo AuditLog.

T10.1 — Redirección automática tras aceptar cita de hoy (HU10): actualmente se muestra un window.confirm pero la redirección automática garantizada no está implementada.

Cancelación de citas desde el Dashboard del Paciente (HU04): el paciente no puede cancelar una cita pendiente por iniciativa propia.

Gestión de disponibilidad del médico (HU04): los horarios disponibles están hardcodeados en el frontend, no provienen de la base de datos.

CRUD completo de usuarios desde el panel de administración (HU03, HU06): crear médicos desde el panel, activar y desactivar cuentas.

Todas las tareas de la Épica 3 (HU11 a HU15): herramientas de seguridad y calidad pendientes de integración en el Sprint 3.
