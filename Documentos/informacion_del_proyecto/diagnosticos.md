# Diagnósticos de Prueba — mediCampo v2

Este documento registra las pruebas ejecutadas sobre las tareas de cada historia de usuario, organizadas por épica. Cubre los casos de falla encontrados durante el desarrollo, los casos de éxito verificados y los casos de mejora identificados. El objetivo es dejar constancia del proceso de validación del sistema y orientar futuros ciclos de prueba.

---

## Épica 1 — Acceso, autenticación y gestión de usuarios

### HU00 — Preparación técnica del entorno

Prueba T00-P1: Arranque del servidor backend
Tipo: éxito
Descripción: Al ejecutar npx ts-node-dev src/server.ts desde la carpeta backend, el servidor inicia y responde en el puerto 5000. La ruta raíz GET / devuelve el texto "mediCampo API is running with Sockets". Prisma conecta correctamente a la instancia de DigitalOcean y la sincronización del schema con npx prisma db push aplica los modelos sin errores.
Observación: El arranque en modo desarrollo usa ts-node-dev que recarga automáticamente ante cambios. En producción se usa node dist/src/server.js previa compilación con tsc.

Prueba T00-P2: Arranque simultáneo de frontend y backend
Tipo: éxito
Descripción: Con el backend corriendo en el puerto 5000 y el frontend en el 5173, la aplicación carga en el navegador y muestra la pantalla de login. Las peticiones del frontend al backend responden correctamente. El CORS abierto con origen wildcard permite las peticiones en desarrollo local.
Caso de mejora: El CORS con origen wildcard es aceptable en desarrollo pero representa un riesgo en producción. La variable de entorno FRONTEND_URL debe configurarse con el dominio real antes de cada despliegue en DigitalOcean.

Prueba T00-P3: Verificación del schema de base de datos
Tipo: éxito
Descripción: npx prisma db push aplicó los cuatro modelos (Specialty, User, Appointment, ClinicalRecord) correctamente en PostgreSQL. npx prisma studio permite visualizar las tablas creadas y sus columnas.

Prueba T00-P4: Despliegue del backend en Docker
Tipo: éxito
Descripción: Con Docker instalado en el servidor, el comando docker compose up --build levanta el backend y la base de datos en contenedores independientes. Las variables de entorno se leen del archivo .env del servidor. El servidor responde correctamente en el puerto mapeado.
Caso de mejora: El archivo docker-compose.yml contiene valores de configuración que deben migrarse a referencias seguras mediante 1Password (HU11) antes de publicar el repositorio en modo público.

---

### HU03 — Registro e inicio de sesión del médico y administración de cuentas

Prueba T03-P1: Registro con datos válidos
Tipo: éxito
Descripción: POST /api/auth/register con un JSON conteniendo rut, name, email y password devuelve estado 201 y el objeto usuario sin el campo password. El registro queda visible en la base de datos con la contraseña hasheada.

Prueba T03-P2: Registro con email duplicado
Tipo: éxito (comportamiento esperado de falla controlada)
Descripción: Intentar registrar dos usuarios con el mismo email devuelve estado 400 y el mensaje "El usuario con ese correo o RUT ya existe." El sistema no revela si el email existe o si es el RUT el duplicado, usando el mismo mensaje para ambos casos por seguridad.

Prueba T03-P3: Registro con RUT duplicado
Tipo: éxito (comportamiento esperado de falla controlada)
Descripción: Intentar registrar con un RUT ya usado devuelve estado 400 con el mismo mensaje genérico. La verificación en AuthService.register comprueba email primero y luego RUT en consultas separadas.

Prueba T03-P4: Login con credenciales correctas
Tipo: éxito
Descripción: POST /api/auth/login con email y password válidos devuelve estado 200 con un token JWT y el objeto usuario. El token puede decodificarse con la clave JWT_SECRET para verificar los campos sub, role y name.

Prueba T03-P5: Login con contraseña incorrecta
Tipo: éxito (comportamiento esperado de falla controlada)
Descripción: Login con email correcto y contraseña incorrecta devuelve estado 400 con el mensaje "Credenciales inválidas." Este mensaje es idéntico al de email no encontrado, evitando la enumeración de usuarios.

Prueba T03-P6: Login con email inexistente
Tipo: éxito (comportamiento esperado de falla controlada)
Descripción: Login con un email que no existe en la base de datos devuelve estado 400 con el mismo mensaje genérico de credenciales inválidas.

Prueba T03-P7: Persistencia de sesión tras recargar el navegador
Tipo: éxito
Descripción: Tras iniciar sesión, recargar la página (F5) mantiene la sesión activa. El AuthContext lee las claves medicampo_token y medicampo_user de localStorage al montarse y restaura el estado de usuario sin necesidad de volver a hacer login.

Prueba T03-P8: Acceso a ruta protegida sin token
Tipo: éxito (comportamiento esperado de falla controlada)
Descripción: Intentar llamar a GET /api/appointments/my-appointments sin el header Authorization devuelve estado 401 con el mensaje "No autorizado, token faltante". El middleware protect intercepta la petición antes de que llegue al controlador.

Prueba T03-P9: Acceso a ruta protegida con token expirado o modificado
Tipo: éxito (comportamiento esperado de falla controlada)
Descripción: Enviar una petición con un token JWT con firma inválida (modificado manualmente) devuelve estado 401 con el mensaje "No autorizado, token fallido". jwt.verify lanza un error que es capturado en el bloque catch del middleware.

Caso de mejora T03-M1: Validación del formato del RUT chileno
El endpoint de registro acepta cualquier string en el campo rut sin validar el formato (ej. 12.345.678-9). Un RUT con formato incorrecto queda registrado sin problema. Se recomienda agregar validación de formato en el AuthService o mediante un validador de esquema como Zod.

Caso de mejora T03-M2: Caducidad de sesión por inactividad
El token JWT tiene una fecha de expiración pero el frontend no implementa un detector de inactividad. Si el token expira mientras el usuario está activo, la siguiente petición fallará con 401 pero la UI no lo comunica al usuario; simplemente muestra un error. Se recomienda interceptar los errores 401 en apiFetch y ejecutar logout automáticamente.

Caso de mejora T03-M3: Formulario de creación de médicos desde el panel de administración
No existe en la interfaz un formulario para crear cuentas con rol DOCTOR. El administrador debe ejecutar el seed manualmente o modificar la base de datos directamente. Para una operación real, esta funcionalidad es imprescindible (tarea T03.6 pendiente).

---

### HU06 — Panel de administración

Prueba T06-P1: Acceso al panel de administración con rol PATIENT
Tipo: éxito (comportamiento esperado de falla controlada)
Descripción: Un usuario con rol PATIENT que intenta navegar a la ruta /admin es redirigido automáticamente a /dashboard-paciente por el componente RoleRoute. La URL cambia en el navegador y no se renderiza el DashboardAdmin.

Prueba T06-P2: Acceso a estadísticas con rol DOCTOR
Tipo: éxito (comportamiento esperado de falla controlada)
Descripción: Llamar a GET /api/clinical/admin/stats con un token de usuario con rol DOCTOR devuelve estado 403 con el mensaje "Solo administradores pueden ver estadísticas". La verificación en ClinicalController.getAdminStats comprueba el rol antes de llamar al servicio.

Prueba T06-P3: Carga de estadísticas con rol ADMIN
Tipo: éxito
Descripción: El DashboardAdmin.tsx carga correctamente el total de pacientes, médicos, citas y la tasa de cumplimiento. El log de actividad reciente muestra las últimas 10 citas con nombres y estados.

Prueba T06-P4: Limpieza de citas del sistema
Tipo: éxito
Descripción: Al hacer clic en "Limpiar Todas las Citas" y confirmar el diálogo, el endpoint DELETE /api/appointments/all elimina todos los registros. El dashboard se actualiza y muestra los contadores en cero.

Caso de mejora T06-M1: Confirmación destructiva más segura
El botón de limpiar citas usa window.confirm nativo del navegador. Esta forma de confirmación no permite texto personalizado ni segundas confirmaciones. En sistemas médicos donde la pérdida de datos es crítica, se debería implementar un diálogo modal con confirmación por texto (escribir "CONFIRMAR" para proceder).

---

## Épica 2 — Gestión de la atención médica

### HU04 — Reserva de teleconsulta

Prueba T04-P1: Listado de médicos disponibles
Tipo: éxito
Descripción: Al cargar el componente ReservaCita.tsx, realiza GET /api/appointments/doctors y muestra la lista de médicos con rol DOCTOR en la base de datos. Con el seed ejecutado, aparecen Dr. Carlos Martínez (Medicina General) y Dra. Ana Silva (Cardiología).

Prueba T04-P2: Lista vacía cuando no hay médicos registrados
Tipo: éxito (comportamiento de falla controlada)
Descripción: Si la base de datos no tiene usuarios con rol DOCTOR, el endpoint devuelve un array vacío. El componente muestra el mensaje "No hay doctores disponibles" con el ícono de estetoscopio.

Prueba T04-P3: Reserva de cita con todos los campos seleccionados
Tipo: éxito
Descripción: Seleccionar médico, fecha y hora y hacer clic en "Confirmar Reserva" ejecuta POST /api/appointments/book. La respuesta devuelve el appointment creado con estado PENDING y el meetingLink generado. La interfaz muestra la pantalla de confirmación "Solicitud Enviada".

Prueba T04-P4: Intento de reserva sin seleccionar todos los campos
Tipo: éxito (comportamiento de falla controlada)
Descripción: El botón "Confirmar Reserva" tiene la propiedad disabled cuando selectedDoctor, selectedDate o selectedTime son nulos. El texto de guía bajo el formulario indica qué paso falta completar.

Prueba T04-P5: Doble reserva en el mismo médico y horario
Tipo: falla (comportamiento no deseado sin control)
Descripción: Es posible crear dos citas con el mismo médico, la misma fecha y la misma hora. El sistema no valida choques de horario. Ambas citas quedan en estado PENDING con meetingLinks diferentes. El médico recibirá dos solicitudes y tendrá que rechazar una manualmente.
Corrección requerida: AppointmentService.createAppointment debe verificar antes de crear si ya existe una cita con el mismo doctorId y date. Si existe, debe devolver AppError 409 con mensaje de conflicto de horario. Tarea T04.7 pendiente.

Prueba T04-P6: Verificación del meetingLink generado
Tipo: éxito
Descripción: El meetingLink generado tiene el formato /room/[7 caracteres alfanuméricos]. Al navegar a esa URL desde el Dashboard del Paciente (cuando la cita está CONFIRMED), el componente Videollamada.tsx extrae el roomId de los parámetros de la ruta usando useParams.

Caso de mejora T04-M1: Horarios dinámicos desde la base de datos
Los horarios disponibles en ReservaCita.tsx están hardcodeados como array fijo. No reflejan la disponibilidad real del médico. Si un médico trabaja hasta las 13:00, los pacientes aún verán y podrán seleccionar horarios de tarde. Se requiere un modelo de disponibilidad en la base de datos (tarea T04.8 pendiente).

---

### HU01 — Videollamada segura

Prueba T01-P1 (PeerJS): Conexión entre dos dispositivos en la misma red local
Tipo: éxito inicial con limitaciones
Descripción: Con la arquitectura PeerJS, dos ventanas en el mismo equipo podían conectarse usando el servidor de señalización gratuito de PeerJS Cloud. La conexión establecía video y audio entre ambas.
Limitación encontrada: Al probar entre dos dispositivos en redes distintas (4G y WiFi), la conexión fallaba en el 60% de los casos por bloqueo de NAT. El servidor gratuito de PeerJS Cloud mostraba latencias de 2-5 segundos en el establecimiento de la conexión.

Prueba T01-P2 (PeerJS): Recarga de la página durante la videollamada
Tipo: falla
Descripción: Al recargar la página durante una videollamada con PeerJS, el sitio mostraba error 404 porque el servidor de sitios estáticos de DigitalOcean no podía resolver la ruta /room/:roomId directamente. El error 404 interrumpía la sesión completamente.
Corrección aplicada: Se cambió BrowserRouter por HashRouter en frontend/src/main.tsx. Las rutas pasan a usar el formato /#/room/:roomId que siempre carga el index.html primero, sin depender del servidor para resolver rutas dinámicas.

Prueba T01-P3 (LiveKit): Conexión entre móvil 4G y PC con WiFi
Tipo: éxito
Descripción: Con LiveKit SFU, la conexión entre un dispositivo móvil con datos móviles y un PC en WiFi doméstico se estableció en menos de 3 segundos. El servidor SFU actúa de intermediario, eliminando la necesidad de conexión directa entre dispositivos.

Prueba T01-P4 (LiveKit): Reconexión automática ante pérdida temporal de red
Tipo: éxito
Descripción: Al simular pérdida de conexión (modo avión del teléfono por 5 segundos y luego reconexión), LiveKit detectó la desconexión con el evento RoomEvent.Disconnected y reinició la conexión automáticamente al restaurar la red. El indicador IndicadorCalidadRed mostró el estado "Mala" durante la interrupción y "Buena" al reconectar.

Prueba T01-P5: Permisos de cámara y micrófono bloqueados en Chrome
Tipo: falla inicial, corrección exitosa
Descripción: En algunos dispositivos Android, Chrome solicita los permisos de cámara y micrófono la primera vez, pero si el usuario los deniega accidentalmente y recarga, el navegador no vuelve a preguntar y muestra un error genérico. El componente original no guiaba al usuario para rehabilitar los permisos.
Corrección aplicada: El componente PreFlightCheck.tsx detecta el error de permisos denegados y activa el estado isBlocked, mostrando instrucciones visuales paso a paso para que el usuario haga clic en el candado de la URL y rehabilite los permisos manualmente. También implementa un fallback de solo audio si la cámara falla pero el micrófono está disponible.

Prueba T01-P6: Acceso a sala de videollamada sin cita asignada
Tipo: éxito (comportamiento de falla controlada)
Descripción: Intentar acceder a la ruta /room/abcdef con un usuario que no tiene una cita con ese meetingLink devuelve error 403 del endpoint de LiveKit token con el mensaje "No tienes una cita asignada a esta sala." El componente Videollamada.tsx muestra la pantalla de error de conexión con el botón de reintentar.

Prueba T01-P7: Acceso a sala de pruebas
Tipo: éxito
Descripción: La sala test-room-livekit está exenta de la verificación de cita asignada en LiveKitService. Al navegar a /livekit-test, el componente LiveKitTest.tsx puede conectarse directamente a esa sala de pruebas para verificar que el servidor LiveKit está operativo sin necesidad de crear una cita.

Prueba T01-P8: Calidad de video adaptativa con conexión lenta
Tipo: éxito parcial
Descripción: Con la opción adaptiveStream activada en LiveKitRoom, el servidor SFU ajusta automáticamente la resolución del video enviado al cliente según su ancho de banda. En una conexión 4G lenta, el video se degrada a menor resolución pero continúa transmitiendo sin cortes. El IndicadorCalidadRed refleja el degradamiento con el estado "Regular" o "Mala".

Caso de mejora T01-M1: Sala de espera virtual para el paciente
Cuando el paciente entra a la sala antes que el médico, ve la pantalla de video vacía con el indicador de sincronización. No existe una pantalla de sala de espera explícita que le informe que el médico aún no se ha conectado. Se recomienda mostrar un mensaje de espera con el nombre del médico mientras no hay participantes remotos en la sala.

Caso de mejora T01-M2: Grabación de consultas
LiveKit soporta grabación mediante el servicio Egress. Actualmente esta funcionalidad no está configurada ni expuesta en la interfaz. Para cumplimiento médico y resolución de disputas, la grabación de consultas es una funcionalidad valiosa.

---

### HU07 — Videollamada de alta disponibilidad con LiveKit SFU

Prueba T07-P1: Generación de token con cita asignada
Tipo: éxito
Descripción: Llamar a GET /api/livekit/token?room=abcdef&identity=Juan con el token JWT de un usuario que tiene una cita con meetingLink que contiene "abcdef" devuelve el AccessToken de LiveKit. El token tiene validez de 10 minutos.

Prueba T07-P2: Generación de token sin cita asignada
Tipo: éxito (comportamiento de falla controlada)
Descripción: Llamar al endpoint con un roomId para el que el usuario no tiene cita asignada devuelve estado 403 con el mensaje "No tienes una cita asignada a esta sala." La consulta en LiveKitService busca un Appointment con meetingLink que contenga el roomId y cuyo patientId o doctorId sea el userId del token.

Prueba T07-P3: SSL del servidor LiveKit
Tipo: falla inicial, corrección exitosa
Descripción: El servidor LiveKit en medicampo-rtc.duckdns.org no tenía certificado SSL válido inicialmente. Chrome bloqueaba la conexión WebSocket wss:// silenciosamente sin mostrar un error claro al usuario. Al abrir el dominio del servidor LiveKit en el navegador, el mensaje de "Conexión no segura" confirmaba que Caddy no había obtenido el certificado de Let's Encrypt.
Corrección aplicada: Se configuró Caddy correctamente con el dominio DuckDNS y se ejecutó docker logs caddy para verificar que el certificado SSL fue emitido correctamente por Let's Encrypt. Tras la corrección, el candado verde aparece al visitar el dominio.

Prueba T07-P4: Apertura de puertos en firewall de DigitalOcean
Tipo: falla inicial, corrección exitosa
Descripción: Con el servidor LiveKit instalado pero los puertos UDP 50000-60000 cerrados en el firewall del Droplet, la señalización WebSocket conectaba correctamente pero el video nunca aparecía. Los logs del navegador mostraban que el track de video era recibido pero no renderizado.
Corrección aplicada: Se abrieron los puertos en el panel de Firewall de DigitalOcean: TCP 443 para la señalización, UDP 443 para HTTP/3, UDP 3478 para TURN y el rango UDP 50000-60000 para los flujos de media. Tras abrir los puertos, el video apareció inmediatamente.

Prueba T07-P5: Propagación del dominio DuckDNS
Tipo: falla inicial, resolución con espera
Descripción: Inmediatamente después de configurar DuckDNS para apuntar a la IP del Droplet, ping medicampo-rtc.duckdns.org aún devolvía la IP anterior. Hubo un período de espera de 5-10 minutos para que el cambio se propagara en los servidores DNS. Verificación: ping al dominio debe devolver la IP correcta del Droplet.

Caso de mejora T07-M1: Puertos UDP del firewall de DigitalOcean
El servidor LiveKit requiere que el rango de puertos UDP 50000-60000 esté abierto en el firewall del Droplet. Si estos puertos no están abiertos, el video no fluye aunque el chat sí funciona. El error se manifiesta como "pantalla vacía" a pesar de que el WebSocket de señalización sí conecta. La verificación es abrir la consola del navegador y buscar errores de conexión 1006 o mensajes de "connection failed" en la pestaña Network.

---

### HU02 — Historial clínico

Prueba T02-P1: Guardado de ficha clínica por el médico
Tipo: éxito
Descripción: El médico completa los campos diagnosis y prescription en el panel lateral de la videollamada y hace clic en "Finalizar Consulta". El frontend envía POST /api/clinical/:appointmentId con el cuerpo JSON. La respuesta devuelve el ClinicalRecord creado y la UI navega automáticamente al dashboard con navigate(-1).

Prueba T02-P2: Verificación de que la cita cambia a COMPLETED
Tipo: éxito
Descripción: Tras guardar la ficha clínica, el endpoint ClinicalService.saveClinicalRecord ejecuta la actualización de estado de la cita a COMPLETED de forma secuencial. Al recargar el dashboard del médico, la cita aparece en la sección de "Atenciones Recientes" y no en "Solicitudes Pendientes" ni "Consultas de Hoy".

Prueba T02-P3: Intento de guardar ficha por un médico que no es el asignado
Tipo: éxito (comportamiento de falla controlada)
Descripción: Llamar a POST /api/clinical/:appointmentId con el token de un médico diferente al asignado a esa cita devuelve estado 403 con el mensaje "No tienes acceso a esta cita". AppointmentRepository.findByIdAndDoctor busca la cita con el id y el doctorId del token; si no coinciden, devuelve null y ClinicalService lanza AppError 403.

Prueba T02-P4: Visualización del historial desde el Dashboard del Paciente
Tipo: éxito
Descripción: Las citas con estado COMPLETED aparecen en la sección "Tu Historial Médico" del DashboardPaciente.tsx. Al hacer clic en una cita, navega a /historial/:appointmentId donde HistorialClinico.tsx muestra el reporte completo con todos los datos registrados.

Prueba T02-P5: Historial vacío cuando no hay consultas completadas
Tipo: éxito (comportamiento de falla controlada)
Descripción: Si el paciente no tiene citas completadas, la sección de historial no se renderiza en el dashboard (la condición past.length > 0 lo omite). En la vista de /historial sin appointmentId, se muestra el mensaje "Aún no tienes atenciones registradas" con el botón de reserva.

Prueba T02-P6: Doble guardado de ficha (actualización)
Tipo: éxito
Descripción: Si el médico guarda la ficha y luego accede nuevamente a la misma cita para corregir algo, el endpoint ejecuta upsert (actualización si existe, creación si no). El registro existente se actualiza con los nuevos valores.

Caso de mejora T02-M1: Campos de constantes vitales en el formulario de videollamada
El modelo ClinicalRecord en schema.prisma define campos para peso, talla, presión arterial, temperatura, frecuencia cardíaca y saturación de oxígeno, pero el formulario en Videollamada.tsx solo expone diagnosis y prescription. El médico no puede registrar las constantes vitales desde la interfaz de la videollamada.

Caso de mejora T02-M2: Edición de ficha clínica ya guardada
Una vez que el médico finaliza la consulta y la ficha queda guardada, no hay botón en la interfaz para editarla. El upsert del backend sí soporta actualización, pero la UI no expone esta funcionalidad. Un médico que cometió un error en el diagnóstico no puede corregirlo sin intervención directa en la base de datos.

---

### HU08 — Receta médica imprimible

Prueba T08-P1: Formato de impresión en Chrome
Tipo: éxito
Descripción: Al hacer clic en "Imprimir Receta", Chrome abre el diálogo de impresión con la vista previa del documento. Los botones de navegación con la clase no-print no aparecen en la vista previa. El encabezado con gradiente, la información del médico y paciente, y la receta se muestran correctamente.

Prueba T08-P2: Formato de impresión en Firefox
Tipo: éxito con diferencia visual menor
Descripción: En Firefox, el fondo con gradiente del encabezado se imprime en escala de grises si el usuario no ha habilitado la impresión de fondos en las preferencias del navegador. El texto sigue siendo legible. Se recomienda agregar estilos específicos para impresión en blanco y negro como fallback.

Prueba T08-P3: Impresión cuando la cita no tiene todos los campos
Tipo: éxito (comportamiento graceful ante datos faltantes)
Descripción: Si el médico no registró los signos vitales (peso, presión, temperatura), el documento impreso muestra "—" en esos campos. El texto de la receta muestra "No se emitieron medicamentos en esta consulta" si el campo prescription está vacío. La ausencia de datos no genera errores en la interfaz.

---

### HU09 — Sincronización de identidad en salas

Prueba T09-P1: Carga de datos de la cita al entrar a la sala
Tipo: éxito
Descripción: Al cargar Videollamada.tsx con un roomId válido, la petición a GET /api/appointments/room/:roomId devuelve los datos del médico y el paciente. El médico ve el nombre y RUT del paciente en el panel lateral y el paciente ve el nombre y especialidad del médico.

Prueba T09-P2: Sala con roomId inválido o inexistente
Tipo: éxito (comportamiento de falla controlada)
Descripción: Si el roomId no corresponde a ninguna cita, el endpoint devuelve 404 y el estado appointment permanece null. La UI muestra "Cargando..." en los campos de nombre del paciente y médico. El token de LiveKit tampoco se otorga si no existe la cita, por lo que la videollamada no inicia.

---

### HU10 — Experiencia de usuario en dashboards

Prueba T10-P1: Redirección tras aceptar cita de hoy
Tipo: parcialmente exitoso
Descripción: Al aceptar una cita programada para el día actual, el frontend muestra un window.confirm preguntando si el médico quiere entrar ahora. Si confirma, navega al meetingLink. Si cancela, el dashboard se recarga con fetchAppointments para mostrar el estado actualizado. La redirección funciona cuando el médico confirma el diálogo, pero si cancela no hay ningún feedback visual adicional de que la cita quedó confirmada.

Prueba T10-P2: Visualización diferenciada de citas PENDING en el paciente
Tipo: éxito
Descripción: Las tarjetas de citas PENDING en DashboardPaciente.tsx tienen fondo amarillo con borde punteado y muestran el mensaje "El médico confirmará pronto" con el ícono de alerta. Las tarjetas CONFIRMED tienen fondo blanco con borde sólido y el mensaje "Todo listo para la cita". La diferenciación visual es clara para el usuario.

Prueba T10-P3: Limpieza de recursos al salir de la videollamada
Tipo: éxito
Descripción: Al hacer clic en el botón de colgar (PhoneOff) o al navegar fuera de la sala, el useEffect de cleanup en Videollamada.tsx ejecuta roomRef.current.disconnect() para cerrar la conexión de LiveKit. Luego intenta detener los tracks de media activos con track.stop() para liberar la cámara y el micrófono del sistema operativo. El ícono de cámara activa en la barra del navegador desaparece tras salir de la sala.

Prueba T10-P4: Navegación con HashRouter
Tipo: éxito
Descripción: Con HashRouter en frontend/src/main.tsx, todas las rutas tienen el prefijo #/ (ej. /#/dashboard-paciente, /#/room/abcdef). Al recargar la página en cualquier ruta, el servidor siempre sirve el index.html y la aplicación React resuelve la ruta internamente. No se producen más errores 404 en producción al recargar páginas con rutas dinámicas.

---

## Épica 3 — Seguridad del desarrollo y calidad del código

Las historias de usuario HU11 a HU15 corresponden a herramientas de seguridad que no han sido implementadas aún. Los diagnósticos de esta sección describen el estado de partida del sistema antes de la integración de cada herramienta y los criterios que se usarán para validar su correcta incorporación. Los casos de éxito solo podrán verificarse una vez que las tareas de cada historia sean ejecutadas en el Sprint 3.

---

### HU11 — Integración de 1Password para gestión segura de secretos

Diagnóstico de partida T11-D1: Exposición de secretos en archivos de configuración
Tipo: estado inicial sin control
Descripción: En el estado actual del proyecto, los archivos backend/.env y docker-compose.yml contienen los valores de configuración sensibles en texto plano. Las claves de la API de LiveKit, la URI de conexión a PostgreSQL, el JWT_SECRET y cualquier credencial de correo transaccional están almacenadas directamente en el archivo sin referencia a ningún gestor de secretos. Si un desarrollador sube accidentalmente el archivo .env al repositorio público, todos los secretos quedan expuestos.
Riesgo identificado: Las credenciales de la base de datos de DigitalOcean y del servidor LiveKit permitirían a un atacante acceder a los registros médicos de los pacientes y suplantar salas de videollamada.

Criterio de validación T11-V1: Verificar que ningún archivo del repositorio contiene secretos en texto plano
Después de ejecutar T11.1 a T11.3, una búsqueda en el repositorio con grep de patrones como LIVEKIT_API_KEY, DATABASE_URL o jwt_secret no debe encontrar ningún valor en texto plano en los archivos rastreados por git. Solo deben aparecer referencias del formato op://.

Criterio de validación T11-V2: Confirmar que un nuevo desarrollador puede configurar el entorno sin recibir el .env por canales inseguros
Un nuevo miembro del equipo, con acceso a la bóveda de 1Password y siguiendo la documentación generada en T11.5, debe poder levantar el entorno de desarrollo sin que ninguna persona le envíe credenciales por correo, chat u otro canal sin cifrar.

---

### HU12 — Integración de Snyk para escaneo continuo de vulnerabilidades

Diagnóstico de partida T12-D1: Estado de dependencias sin análisis de seguridad
Tipo: estado inicial sin control
Descripción: Actualmente no se ejecuta ninguna herramienta de análisis de dependencias en el proyecto. El backend usa paquetes como jsonwebtoken, bcryptjs, express, prisma y livekit-server-sdk cuyas versiones no han sido auditadas desde la instalación inicial. El frontend usa @livekit/components-react, react y otros paquetes cuyo estado de seguridad es desconocido. Tampoco se han revisado los Dockerfile del backend y del servidor LiveKit para identificar imágenes base con CVEs conocidas.
Riesgo identificado: Una dependencia con una vulnerabilidad de ejecución remota de código o escalada de privilegios puede comprometer el servidor aunque el código propio esté bien escrito.

Criterio de validación T12-V1: Obtener un informe inicial limpio de vulnerabilidades críticas
Después de ejecutar T12.1 y T12.2, el informe de Snyk no debe reportar ninguna vulnerabilidad de severidad crítica o alta en las dependencias del backend ni del frontend. Las vulnerabilidades de severidad media o baja quedan documentadas para revisión periódica.

Criterio de validación T12-V2: Confirmar que los Dockerfile usan imágenes base sin vulnerabilidades críticas
Después de ejecutar T12.3, las imágenes base usadas en los Dockerfile del proyecto no deben tener vulnerabilidades de severidad crítica o alta registradas en la base de datos de CVEs consultada por Snyk.

---

### HU13 — Integración de CodeQL para análisis estático avanzado de seguridad

Diagnóstico de partida T13-D1: Endpoints sensibles sin análisis de flujo de datos
Tipo: estado inicial sin control
Descripción: El sistema implementa control de acceso en tres capas (RoleRoute, middleware protect, servicios), pero estas capas no han sido auditadas mediante análisis estático de flujo de datos. Es posible que existan rutas de código donde una combinación de parámetros permita saltarse una verificación. Los endpoints más críticos que requieren análisis son: GET /api/clinical/admin/stats (verificación de rol ADMIN), POST /api/clinical/:appointmentId (verificación de doctorId), GET /api/livekit/token (verificación de pertenencia a la cita) y DELETE /api/appointments/all (verificación de rol ADMIN).
Riesgo identificado: Un flujo de datos inseguro detectado por CodeQL en alguno de estos endpoints podría permitir que un usuario sin permisos acceda a fichas clínicas o genere tokens de LiveKit para salas ajenas.

Criterio de validación T13-V1: Ningún flujo de datos inseguro de severidad alta en los endpoints críticos
Después de ejecutar T13.1 a T13.3, el análisis de CodeQL con la suite Security Extended no debe reportar ninguna vulnerabilidad de severidad alta o crítica en los endpoints de administración, historial clínico y generación de tokens. Los hallazgos de severidad media deben quedar documentados con su plan de corrección.

Criterio de validación T13-V2: Bypasses de control de rol verificados como inexistentes
El análisis debe confirmar que no existe ningún camino en el grafo de flujo del programa que permita que una petición llegue a los controladores de administrador o de historial sin pasar por las verificaciones de rol y de propiedad implementadas en los servicios.

---

### HU14 — Integración de Keploy para generación automática de pruebas

Diagnóstico de partida T14-D1: Ausencia de cobertura de tests en el proyecto
Tipo: estado inicial sin control
Descripción: El proyecto mediCampo v2 no tiene ningún archivo de test implementado. No existe una configuración de Jest, Vitest ni ningún otro framework de testing en los archivos package.json del backend o del frontend. Las validaciones realizadas durante el desarrollo fueron todas manuales mediante herramientas como Postman o la propia interfaz de usuario. Esto significa que cualquier cambio en el código puede introducir regresiones sin que ningún sistema automático lo detecte.
Riesgo identificado: La ausencia de tests automatizados en los controladores de citas, historial clínico y autenticación hace que cambios en AppointmentService, ClinicalService o AuthService puedan romper la lógica de negocio sin activar ninguna alerta.

Criterio de validación T14-V1: Suite de tests ejecutable con npm test
Después de ejecutar T14.1 a T14.5, el comando npm test desde la carpeta backend debe ejecutar la suite de Jest y mostrar el resultado de los tests generados por Keploy. Al menos los controladores de agendamiento, historial clínico y autenticación deben tener cobertura de un caso de éxito y un caso de error por endpoint.

Criterio de validación T14-V2: Los tests bloquean commits con regresiones
Después de ejecutar T14.6, al intentar hacer un commit que introduce un error en AppointmentService o ClinicalService (por ejemplo eliminando una verificación de autorización), Husky debe ejecutar los tests y bloquear el commit si alguno falla.

---

### HU15 — Integración de SecureCodeGuard para detección de vulnerabilidades en tiempo real

Diagnóstico de partida T15-D1: Formularios sin revisión de seguridad en tiempo real
Tipo: estado inicial sin control
Descripción: Los componentes actuales Login.tsx, Register.tsx, ReservaCita.tsx y HistorialClinico.tsx fueron construidos sin una herramienta de análisis de seguridad en tiempo real. Es posible que existan patrones como interpolación sin sanitización en el HTML, uso de innerHTML, concatenación de strings en parámetros de consulta o ausencia de atributos autocomplete adecuados que una herramienta de análisis estático podría detectar. Actualmente ninguna alerta emerge mientras se desarrolla o modifica estos componentes.
Riesgo identificado: Un componente React que use dangerouslySetInnerHTML sin sanitización previa o que concatene parámetros de usuario en una URL sin codificación puede introducir una vulnerabilidad XSS que un atacante aprovecharía para robar el token JWT del localStorage.

Criterio de validación T15-V1: Formularios de registro y agendamiento sin advertencias de XSS o inyección
Después de ejecutar T15.1 a T15.3, SecureCodeGuard no debe reportar ninguna advertencia activa de XSS, inyección de código o falta de sanitización en Login.tsx, Register.tsx ni ReservaCita.tsx. Las advertencias resueltas quedan documentadas junto con la corrección aplicada.

Criterio de validación T15-V2: Nuevos componentes revisados antes de confirmar al repositorio
Durante el desarrollo de HU03.6 (formulario de creación de médicos desde el panel) y HU05 (sistema de notificaciones), los nuevos archivos TypeScript y React deben ser revisados por SecureCodeGuard antes de hacer commit. El equipo documenta el proceso de atención a alertas de seguridad en tiempo real como parte de la definición de hecho del sprint.

---

## Resumen de casos por categoría

Casos de éxito verificados: Las funcionalidades de autenticación, reserva de citas, videollamada con LiveKit, historial clínico con impresión, sincronización de identidad en salas y control de acceso por rol funcionan correctamente según las pruebas ejecutadas durante los sprints 1 y 2.

Casos de falla encontrados y corregidos: El error 404 al recargar páginas con rutas dinámicas (resuelto con HashRouter). Los permisos de cámara bloqueados sin guía al usuario (resuelto con PreFlightCheck y modo de solo audio). La falla de conexión P2P en redes distintas (resuelto migrando a LiveKit SFU). Los puertos UDP cerrados en el firewall de DigitalOcean (resuelto configurando las reglas de firewall). El certificado SSL faltante en el servidor LiveKit (resuelto configurando Caddy correctamente).

Casos de falla sin corrección: La doble reserva en el mismo médico y horario (tarea T04.7 pendiente). La cancelación de citas por el paciente (funcionalidad no implementada).

Casos de mejora pendientes: Validación del formato de RUT. Detección y manejo automático de expiración del token JWT en el frontend. Horarios de disponibilidad dinámicos desde la base de datos. Formulario ampliado con constantes vitales en la videollamada. Sala de espera virtual para el paciente antes de que conecte el médico. Edición de fichas clínicas ya guardadas. Creación de cuentas de médico desde el panel de administración. Generación de PDF descargable del reporte médico.

Diagnósticos de seguridad pendientes de validación (Sprint 3): Gestión de secretos con 1Password (HU11). Escaneo de dependencias con Snyk (HU12). Análisis de flujo de datos con CodeQL (HU13). Generación de tests automatizados con Keploy (HU14). Detección de vulnerabilidades en tiempo real con SecureCodeGuard (HU15).
