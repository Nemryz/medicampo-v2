# Procedimientos Implementados — mediCampo v2

Este documento describe de forma detallada cada uno de los procedimientos implementados en el sistema, explicando qué hace cada archivo, cómo interactúan entre sí, y el flujo de datos que recorre cada funcionalidad desde el cliente hasta la base de datos.

---

## 1. Arranque del servidor

El archivo de entrada del backend es backend/src/server.ts. Al iniciarse, carga las variables de entorno con dotenv.config(), instancia la aplicación Express y crea un servidor HTTP envolviendo esa instancia. Registra el middleware CORS para permitir peticiones desde cualquier origen (en producción esto debe restringirse con la variable FRONTEND_URL) y el middleware express.json() para parsear el cuerpo de las peticiones.

Luego monta los cuatro grupos de rutas bajo sus prefijos: /api/auth para autenticación, /api/appointments para citas, /api/clinical para fichas clínicas, y /api/livekit para videollamadas. También registra una ruta de salud en la raíz que responde con texto plano para verificar que el servidor está activo.

Instancia la clase SocketConfig pasando el servidor HTTP, que configura Socket.io con JWT de autenticación. Finalmente, escucha en el puerto configurado e implementa un handler para la señal SIGINT que desconecta Prisma limpiamente antes de terminar el proceso.

---

## 2. Gestión de la conexión a la base de datos

El archivo backend/src/config/database.ts implementa el patrón Singleton para la instancia de PrismaClient. La clase Database tiene un campo estático privado instance y un método estático getInstance() que crea la instancia solo si no existe previamente. En entorno de desarrollo, Prisma registra todas las queries y warnings. En producción solo registra errores. El método disconnect() espera que el singleton esté inicializado antes de llamar a $disconnect() para evitar errores al apagar el servidor.

Este patrón asegura que toda la aplicación comparte una única conexión al pool de PostgreSQL, evitando el agotamiento de conexiones en despliegues serverless o con muchas instancias simultáneas.

---

## 3. Configuración de Socket.io

El archivo backend/src/config/socket.ts define la clase SocketConfig que encapsula toda la lógica de WebSockets. El constructor recibe el servidor HTTP, crea la instancia de Server de socket.io con CORS abierto para cualquier origen, y llama a los métodos privados setupMiddleware y setupEvents.

El middleware de Socket.io extrae el token del campo auth.token del handshake de conexión y lo verifica con jwt.verify. Si el token es inválido o falta, rechaza la conexión con un error de autenticación. Si es válido, adjunta el payload decodificado a socket.data.user.

Los eventos configurados son join-room (el cliente envía el ID de sala y su ID de usuario; el servidor une el socket a esa sala y emite user-connected a los demás participantes) y disconnect (registra en consola la desconexión). Esta infraestructura de Socket.io actualmente se usa para notificaciones generales; el flujo de medios de la videollamada fue delegado a LiveKit.

---

## 4. Autenticación de usuarios

El procedimiento de registro comienza cuando el cliente envía POST /api/auth/register con el cuerpo JSON conteniendo rut, name, email y password. La ruta en authRoutes.ts invoca la función register del authController.

El controlador extrae los campos del cuerpo y llama a authService.register(). El AuthService en AuthService.ts verifica primero si existe un usuario con el mismo email mediante userRepository.findByEmail() y luego si existe el RUT con userRepository.findByRut(). Si alguna de estas verificaciones encuentra un usuario, lanza una AppError con código 400. Si no hay duplicados, genera un salt de 10 rondas con bcrypt.genSalt y hashea la contraseña con bcrypt.hash. Llama a userRepository.create() que ejecuta prisma.user.create() y devuelve el nuevo usuario. El controlador destruye el campo password del objeto resultado con desestructuración y responde con estado 201.

El procedimiento de login recibe email y password en POST /api/auth/login. El AuthService busca el usuario por email; si no existe, lanza AppError 400 con el mensaje genérico "Credenciales inválidas" (el mismo mensaje para usuario no encontrado y contraseña incorrecta, por seguridad). Si existe, compara la contraseña con bcrypt.compare. Si no coincide, lanza el mismo error genérico. Si coincide, construye el payload JwtPayload con sub (id del usuario), role y name, y firma el token con jwt.sign usando la configuración JWT_CONFIG (secret y expiresIn de la variable de entorno). Devuelve el token y el usuario sin contraseña.

---

## 5. Middleware de autenticación HTTP

El middleware protect en backend/src/middleware/authMiddleware.ts opera sobre cada ruta protegida. Extrae el token del header Authorization verificando que comience con "Bearer". Si no hay token, responde con 401. Si hay token, lo verifica con jwt.verify y adjunta el payload como JwtPayload a req.user. Si la verificación falla (token expirado, firma inválida), responde con 401. Si todo es correcto, llama a next() pasando el control al controlador correspondiente.

---

## 6. Gestión de citas

El procedimiento de obtener doctores disponibles es el más simple: GET /api/appointments/doctors llama a userRepository.findDoctors() que ejecuta prisma.user.findMany con el filtro role igual a DOCTOR y selecciona solo id, name y specialty. Esto evita exponer contraseñas u otros datos sensibles.

El procedimiento de creación de cita recibe doctorId y date del cuerpo. El AppointmentService genera el meetingLink con el patrón /room/ seguido de un string aleatorio de base 36 de 7 caracteres. Llama a appointmentRepository.create() que ejecuta prisma.appointment.create con el estado PENDING e incluye en la respuesta los datos del doctor y paciente relacionados.

El procedimiento de consulta de mis citas determina el filtro según el rol del usuario autenticado: si es DOCTOR filtra por doctorId, si es PATIENT filtra por patientId. El resultado incluye datos del doctor, paciente y diagnóstico del historial clínico, ordenados por fecha ascendente.

El procedimiento de obtener cita por sala busca en la base de datos el appointment cuyo meetingLink coincide con /room/:roomId e incluye el objeto completo del doctor, paciente y historial clínico. Este endpoint es usado por el componente Videollamada.tsx para mostrar los datos de la consulta al entrar a la sala.

El procedimiento de actualización de estado recibe el nuevo estado en el cuerpo. AppointmentService verifica que exista una cita con ese id y ese doctorId (solo el médico asignado puede cambiar el estado de su cita). Si no existe esa combinación, lanza AppError 403. Si existe, llama a appointmentRepository.updateStatus() que ejecuta prisma.appointment.update.

El procedimiento de eliminación masiva de citas verifica que el rol del usuario sea ADMIN antes de llamar a appointmentRepository.deleteAll() que ejecuta prisma.appointment.deleteMany sin condición, eliminando todos los registros.

---

## 7. Gestión de fichas clínicas

El procedimiento de guardado de ficha clínica recibe el appointmentId en la ruta y el cuerpo con los campos médicos. ClinicalService.saveClinicalRecord primero verifica mediante appointmentRepository.findByIdAndDoctor que el doctor autenticado sea el asignado a esa cita. Si no lo es, lanza AppError 403. Si la verificación pasa, ejecuta clinicalRecordRepository.upsert que usa prisma.clinicalRecord.upsert: si ya existe un registro para ese appointmentId lo actualiza, si no lo crea. Luego marca la cita como COMPLETED mediante prisma.appointment.update en markAppointmentCompleted. Esta operación no es atómica a nivel de transacción de base de datos, pero se ejecuta de forma secuencial en el mismo request.

El procedimiento de consulta de historial del paciente primero verifica que un paciente solo pueda ver su propio historial (compara requesterId con patientId si el rol es PATIENT). Los doctores y administradores pueden ver el historial de cualquier paciente. Devuelve las citas con estado COMPLETED incluyendo el ClinicalRecord y los datos del médico.

El procedimiento de consulta de ficha por cita busca el ClinicalRecord por appointmentId único e incluye mediante relaciones anidadas los datos del paciente y del médico. Si no existe el registro, lanza AppError 404.

El procedimiento de estadísticas administrativas ejecuta cinco promesas en paralelo con Promise.all: conteo de usuarios PATIENT, conteo de usuarios DOCTOR, conteo total de citas, conteo de citas COMPLETED y las últimas 10 citas ordenadas por createdAt descendente con datos de paciente y médico.

---

## 8. Generación de tokens LiveKit

El procedimiento de token LiveKit recibe los parámetros room e identity (o roomName y username como alias) del query string. LiveKitService.getAccessToken valida que ambos estén presentes y que las variables de entorno LIVEKIT_API_KEY y LIVEKIT_API_SECRET estén configuradas.

Si el roomName no es el sala de pruebas (test-room-livekit), el servicio consulta la base de datos buscando un Appointment cuyo meetingLink contenga el roomName y cuyo patientId o doctorId coincida con el userId autenticado. Si no encuentra coincidencia, lanza AppError 403, impidiendo que usuarios externos accedan a salas ajenas.

Luego crea un AccessToken de la librería livekit-server-sdk con identity (nombre del participante) y ttl de 10 minutos. Agrega los grants: roomJoin (puede entrar), room (nombre de la sala), canPublish (puede enviar audio y video), canSubscribe (puede recibir) y canPublishData (puede enviar datos de chat). Convierte el token a JWT firmado y lo devuelve.

---

## 9. Flujo completo de la videollamada en el frontend

El componente Videollamada.tsx coordina varios subcomponentes y fases de conexión. Al montarse, verifica si el usuario pasó el PreFlightCheck (estado isReady). Si no, muestra el PreFlightCheck.

El PreFlightCheck en PreFlightCheck.tsx llama a navigator.mediaDevices.getUserMedia solicitando cámara y micrófono. Si falla, reintenta solo con audio. Si falla también el audio, activa el modo isBlocked y muestra instrucciones visuales. Si al menos el audio está disponible, habilita el botón de entrar. Al hacer clic, llama a la prop onReady() del componente padre que cambia isReady a true.

Cuando isReady es verdadero, Videollamada.tsx ejecuta el hook fetchToken que llama al endpoint /api/livekit/token con el roomId de la URL y el nombre del usuario autenticado. Almacena el token en el estado livekitToken. Simultáneamente, obtiene los datos de la cita llamando a /api/appointments/room/:roomId y los almacena en el estado appointment.

Con el token disponible, renderiza el componente LiveKitRoom de @livekit/components-react pasando el token, la serverUrl (la URL del servidor LiveKit en DigitalOcean), y las opciones de adaptiveStream y dynacast para optimización de ancho de banda. Dentro de LiveKitRoom se renderizan: EscenarioVideo (los videos de los participantes con GridLayout y ParticipantTile), RoomAudioRenderer (el audio de los participantes remotos), ControlesPersonalizados (botones de micrófono, cámara y colgar) y ChatConsulta (el panel de chat).

El panel derecho muestra contenido diferenciado por rol: si el usuario es DOCTOR muestra el formulario de ficha clínica con los campos diagnosis y prescription; si es PATIENT muestra el nombre y especialidad del médico. Al enviar el formulario, Videollamada.tsx llama a POST /api/clinical/:appointmentId y si la respuesta es exitosa ejecuta navigate(-1) para salir de la sala.

---

## 10. Chat de la consulta

El componente ChatConsulta.tsx usa el hook useChat de @livekit/components-react. Este hook se conecta al Data Channel de WebRTC de LiveKit, que es un canal de datos paralelo al de audio y video. Los mensajes enviados con send(message) se distribuyen a todos los participantes de la sala en tiempo real. Los mensajes recibidos se acumulan en el array chatMessages. Los mensajes son efímeros: desaparecen al cerrar la sesión. El componente distingue los mensajes propios (msg.from.isLocal) de los ajenos para alinearlos y colorearlos de forma diferente.

---

## 11. Gestión del contexto de autenticación en el frontend

El AuthContext en frontend/src/context/AuthContext.tsx usa el mecanismo Context de React para proveer el estado de sesión a toda la aplicación. Al montarse, lee localStorage buscando medicampo_token y medicampo_user. Si ambos existen y el user es JSON válido, restaura la sesión. El estado loading permanece true durante esta carga inicial para evitar parpadeos de interfaz.

El método login limpia primero cualquier sesión anterior de localStorage antes de guardar la nueva, evitando estados mixtos entre sesiones. El método logout limpia el storage y redirige a la raíz con window.location.href para forzar una recarga completa del árbol de componentes. El método getToken lee directamente de localStorage en lugar del estado interno para garantizar que siempre devuelva el valor más actual.

---

## 12. Sistema de rutas con control de rol

El componente App.tsx define las rutas protegidas usando el componente auxiliar RoleRoute. Este componente recibe un array de roles permitidos y el elemento a renderizar. Lee el usuario del contexto de autenticación; si no hay usuario o su rol no está en el array permitido, redirige a la raíz con Navigate.

Las rutas son: /dashboard-paciente solo para PATIENT, /dashboard-medico solo para DOCTOR, /admin solo para ADMIN, /reserva solo para PATIENT, /historial para PATIENT, DOCTOR y ADMIN, /historial/:appointmentId abierta para cualquier usuario autenticado, /livekit-test sin restricción de rol (sandbox de pruebas), y /room/:roomId donde Videollamada gestiona internamente el acceso. Cualquier ruta no reconocida redirige al dashboard del rol del usuario autenticado.

La aplicación usa HashRouter en main.tsx en lugar de BrowserRouter para garantizar compatibilidad con el hosting de sitios estáticos de DigitalOcean, que no puede reescribir URLs dinámicas del lado del servidor.

---

## 13. Schema de base de datos y datos semilla

El schema de Prisma define cuatro modelos. Specialty tiene id y name único con relación uno a muchos con User. User tiene los campos identificadores (rut, email únicos), name, password hasheada, role como string y la relación opcional con Specialty mediante specialtyId. Un usuario con rol DOCTOR puede tener asociada una especialidad. Las relaciones con Appointment se declaran como dos listas separadas (patientAppointments y doctorAppointments) usando nombres de relación explícitos para que Prisma pueda distinguir las dos claves foráneas al mismo modelo.

Appointment tiene las relaciones con paciente y médico, la fecha de la cita, el estado (PENDING, CONFIRMED, COMPLETED, CANCELLED) y el meetingLink. La relación con ClinicalRecord es uno a uno opcional.

ClinicalRecord almacena las constantes vitales como campos opcionales (Float para peso, talla, temperatura y saturación de oxígeno; String para presión arterial; Int para frecuencia cardíaca) y los campos textuales del acto médico (symptoms obligatorio, diagnosis obligatorio, prescription y observations opcionales, allergies opcional).

El script seed.ts crea las especialidades "Medicina General" y "Cardiología" y crea cuatro cuentas de usuario usando upsert (idempotente): una cuenta admin, dos médicos y un paciente, todos con contraseña medicampo123 hasheada. Este script se ejecuta con prisma db seed durante el setup inicial o el despliegue en DigitalOcean.

---

## 14. Configuración del frontend para producción

El archivo frontend/src/lib/api.ts exporta API_URL y SOCKET_URL que leen las variables de entorno Vite (VITE_API_URL y VITE_SOCKET_URL). En desarrollo local apuntan a http://localhost:5000 y en producción a los dominios de DigitalOcean. La función apiFetch es un wrapper de fetch que agrega automáticamente el header Content-Type: application/json y el Authorization: Bearer [token] leído de localStorage. Esto centraliza la lógica de autenticación de peticiones y evita duplicar el manejo del token en cada componente.

---

## 15. Indicador de calidad de red en videollamada

El componente IndicadorCalidadRed en Videollamada.tsx usa el hook useRoomContext de LiveKit para acceder al objeto Room en tiempo real. Registra listeners en los eventos RoomEvent.Disconnected, RoomEvent.Reconnecting y RoomEvent.Reconnected para actualizar el estado de calidad. Adicionalmente, un intervalo de 5 segundos revisa los tracks de video de los participantes remotos: si hay tracks con isMuted activo (indicador de problemas de ancho de banda), degrada la calidad mostrada. El componente muestra el ícono y etiqueta correspondientes: Buena (verde), Regular (ámbar), Mala (rojo) o Desconectado (gris).
