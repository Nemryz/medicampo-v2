# Sprint Backlog del Sprint 2 — mediCampo v2

Este documento concentra la totalidad de las tareas que el equipo se comprometió a desarrollar durante el Sprint 2 del proyecto mediCampo v2, organizadas a partir de las dos historias de usuario priorizadas desde el Product Backlog inicial. Las historias seleccionadas corresponden a HU3, que cubre el registro y el inicio de sesión tanto para los médicos como para los pacientes, y HU4, que abarca la reserva de la teleconsulta desde el lado del paciente, la opción de aceptación o rechazo desde el lado del médico, junto con la habilitación del botón de ingreso a la videollamada en ambas vistas. Toda la información presentada acá responde al avance real del trabajo realizado, contrastado con el código que reside en los directorios backend y frontend del repositorio del proyecto.

## Contexto del Sprint 2

El Sprint 2 se desarrolló como continuación natural del Sprint 1, en el cual se había construido la base técnica del sistema, incluyendo la configuración del entorno full-stack y el primer prototipo funcional de la videollamada con LiveKit. Durante el Sprint 2 el foco se desplazó hacia la capa de acceso y agendamiento, dado que sin un sistema robusto de autenticación y sin la capacidad de reservar citas la videollamada carecía de un flujo completo de cara al usuario final, es decir, no existía un camino end-to-end por el cual un paciente rural pudiera llegar hasta el médico de manera autónoma.

El equipo de desarrollo, conformado por Vicente Ramirez, James Honeymann e Ignacio Ampuero, decidió enfocar el sprint en el cierre del ciclo paciente-médico que va desde el registro inicial de la cuenta, pasando por la elección del especialista y la confirmación del horario, hasta el momento exacto en que ambas partes ven habilitado el botón para iniciar la sesión de video. De esta forma, el Producto-1 quedó asociado a la HU3, mientras que el Producto-2 quedó vinculado con la HU4.

## Historia de Usuario HU3: Registro e inicio de sesión del médico y de los usuarios

Como usuario del sistema, sea este un paciente rural o un profesional de la salud, necesito poder registrarme en la plataforma e iniciar sesión de forma segura para acceder a las funcionalidades correspondientes a mi rol, garantizando además que la información sensible viaje cifrada y que el sistema rechace cualquier intento de acceso con credenciales incorrectas.

Esta historia surge porque sin un mecanismo de identidad confiable no es posible asociar una cita a un paciente real, ni tampoco proteger los datos clínicos del paciente frente a accesos indebidos, ni autorizar al médico para ver únicamente las consultas que le corresponden. Asimismo, la presencia de un campo de rol diferenciado dentro de la base de datos permite que la misma plataforma sirva por igual a pacientes, médicos y administradores, sin necesidad de mantener tres flujos paralelos.

### Criterios de aceptación de la HU3

El sistema permite el registro de un nuevo usuario completando los campos nombre completo, RUT, correo electrónico y contraseña, donde el RUT se valida como único en la base de datos al igual que el correo electrónico. La contraseña se almacena cifrada mediante bcryptjs con un salt de diez rondas, de modo que aún ante una eventual filtración del contenido de la tabla User las contraseñas no queden expuestas en texto plano. El sistema genera un token JWT firmado con la clave secreta del servidor en cada inicio de sesión exitoso, conteniendo dentro del payload el identificador del usuario, su rol y su nombre. El frontend persiste el token y el objeto usuario en localStorage bajo las claves medicampo_token y medicampo_user, permitiendo que la sesión sobreviva a recargas del navegador. Las rutas privadas del frontend redirigen al login si el token no existe o ha caducado, y los componentes de envoltura RoleRoute restringen el acceso a las vistas según el rol del usuario autenticado.

### Tareas técnicas asociadas a la HU3

T03.1 — Diseñar el modelo Prisma de la entidad User con soporte de roles diferenciados, definiendo los campos id, rut único, name, email único, password cifrado, role como String con valor por defecto PATIENT y la relación opcional con Specialty mediante specialtyId, además de los timestamps automáticos createdAt y updatedAt. Esta tarea quedó implementada en el archivo backend/prisma/schema.prisma y fue una pieza clave para sostener todo el control de acceso posterior.

T03.2 — DeRegister.tsx con un formulario que solicite nombre completo, RUT, correo y contraseña, valide los campos del cliente y, tras un registro exitoso, ejecute automáticamente un segundo llamado al endpoint de login para que el usuario quede autenticado sin necesidad de ingresar nuevamente sus credenciales.

T03.6 — Implementar el AuthContext.tsx que persista el token y el objeto usuario en localStorage bajo las claves medicampo_token y medicampo_user, lea estos valores al cargar la aplicación para restaurar la sesión y exponga los métodos login y logout al resto de la SPA, evitando así el prop-drilling.

T03.7 — Integrar el componente RoleRoute en App.tsx como guardián de rutas, verificando el rol del usuario autenticado antes de permitirle navegar a las vistas restringidas, de manera que un usuario con rol PATIENT no pueda entrar a las rutas pensadas para DOCTOR ni viceversa.sarrollar el endpoint POST /api/auth/register que reciba los datos del nuevo usuario, valide que no exista previamente otro registro con el mismo correo ni con el mismo RUT, hashee la contraseña usando bcryptjs y guarde el objeto en la base de datos retornando todos los campos del usuario menos el password. El endpoint quedó implementado en authController.ts y delega la lógica de negocio al AuthService.ts, manteniendo la separación de responsabilidades.

T03.3 — Desarrollar el endpoint POST /api/auth/login que busque el usuario por correo electrónico, compare la contraseña ingresada con la versión cifrada mediante bcrypt.compare y, ante una coincidencia válida, genere un token JWT firmado con la clave secreta del servidor, retornando dicho token junto con el objeto usuario al cliente. La configuración del JWT quedó centralizada en backend/src/config/jwt.ts.

T03.4 — Construir la interfaz de Login.tsx con un formulario que solicite correo y contraseña, valide los campos antes de enviarlos, muestre los mensajes de error que retorne el backend y, ante una respuesta exitosa, invoque al método login del AuthContext para iniciar la sesión, redirigiendo al dashboard correspondiente al rol del usuario.

T03.5 — Construir la interfaz de

### Estado al cierre del Sprint 2 para la HU3

La historia quedó completada en sus aspectos centrales, dado que tanto el registro como el inicio de sesión funcionan correctamente, los roles son respetados por el sistema de rutas y la sesión persiste entre recargas. Quedó pendiente, no obstante, la creación de cuentas de médico desde el panel del administrador, pues actualmente los profesionales son cargados mediante el script seed de Prisma, situación que se abordará en sprints posteriores.

## Historia de Usuario HU4: Reserva de teleconsulta desde el paciente, aceptación desde el médico e ingreso a la videollamada para ambos

Como paciente rural, necesito poder seleccionar un médico disponible con su especialidad, elegir una fecha y un horario que se ajusten a mi disponibilidad y confirmar la reserva para que la cita quede registrada en el sistema en estado pendiente. Por su parte, el médico necesita ver en su panel las solicitudes recibidas, junto con la información del paciente, para poder aceptarlas o rechazarlas según corresponda. Una vez confirmada la cita, ambos usuarios deben encontrar habilitado el botón de ingreso a la sala de video en el momento en que la consulta esté próxima a iniciarse.

Esta historia es la columna vertebral del flujo médico-paciente, ya que sin ella la videollamada construida en el Sprint 1 carecería de un mecanismo para que las personas se encuentren dentro de la sala correcta. Al completar esta funcionalidad el sistema deja de ser un conjunto de piezas aisladas y comienza a comportarse como una plataforma integrada de telemedicina, donde el ciclo completo de la atención puede ejecutarse sin intervención manual del administrador.

### Criterios de aceptación de la HU4

El paciente accede al módulo de reserva desde su dashboard mediante el botón Agendar Teleconsulta, visualiza la lista de médicos disponibles obtenida desde el endpoint GET /api/appointments/doctors junto con la especialidad de cada uno, selecciona el especialista deseado y luego escoge una fecha en el calendario, lo cual habilita la cuadrícula de horarios disponibles. Al confirmar la reserva mediante el botón Confirmar Reserva, el sistema crea un registro en la tabla Appointment con estado PENDING y genera de forma automática un meetingLink único usando Math.random().toString(36).substring(7), almacenando dicho enlace en la base de datos. El paciente recibe una pantalla de confirmación visual donde se le indica que el médico debe aceptar la solicitud antes de habilitar el botón de ingreso.

El médico, al iniciar sesión, accede a su dashboard donde encuentra una sección de Solicitudes Pendientes que muestra todas las citas con estado PENDING que le han sido asignadas, con la información del paciente solicitante, la fecha y el horario propuestos. Los botones de aceptación, representados con el ícono de check verde, y de rechazo, representados con el ícono de cruz roja, llaman al endpoint PATCH /api/appointments/:id/status enviando CONFIRMED o CANCELLED según corresponda. Al aceptar una cita programada para el día actual, el sistema despliega un cuadro de diálogo nativo del navegador preguntando al médico si desea ingresar de inmediato a la sala, en cuyo caso ejecuta navigate(meetingLink) y abre el componente Videollamada.tsx.

El paciente, una vez su cita ha sido confirmada por el médico, ve actualizada la tarjeta correspondiente en su dashboard, cambiando el badge amarillo de Esperando Médico por un badge verde de Confirmada, junto con el botón Ingresar a la Sala que lo redirige al mismo componente de videollamada. De esta forma ambos usuarios convergen en la misma sala identificada por el meetingLink único almacenado en la base de datos.

### Tareas técnicas asociadas a la HU4

T04.1 — Diseñar los modelos Prisma de Specialty y Appointment, definiendo en el primero los campos id y name único con relación a los usuarios doctores, y en el segundo los campos patientId, doctorId, date, status como String con valor por defecto PENDING, meetingLink y la relación uno a uno con ClinicalRecord. El archivo schema.prisma quedó actualizado con las relaciones nominales DoctorAppointments y PatientAppointments para permitir búsquedas bidireccionales eficientes.

T04.2 — Desarrollar el endpoint POST /api/appointments/book que reciba el doctorId y la fecha de la cita, genere el meetingLink con el formato /room/[hash], cree el registro en la tabla Appointment con estado PENDING por defecto y devuelva la cita creada junto con su enlace de sala. Implementado en AppointmentService dentro de backend/src/services.

T04.3 — Desarrollar el endpoint GET /api/appointments/doctors que retorne la lista de profesionales con rol DOCTOR junto con su especialidad anidada, alimentando así la grilla de selección del paciente.

T04.4 — Desarrollar el endpoint GET /api/appointments/my-appointments que retorne las citas del usuario autenticado, filtrando por rol de modo que el paciente vea las suyas y el médico vea las que le fueron asignadas, con todos los datos relacionados de la contraparte.

T04.5 — Desarrollar el endpoint PATCH /api/appointments/:id/status que reciba el nuevo estado, verifique que el médico autenticado sea efectivamente el asignado a la cita mediante appointmentRepository.findByIdAndDoctor y, ante una validación exitosa, actualice el campo status a CONFIRMED o CANCELLED. Si la cita no le pertenece, el endpoint retorna un error 403.

T04.6 — Construir el componente ReservaCita.tsx con un layout dividido en tres pasos diferenciados visualmente, donde el primero muestra la lista de especialistas como tarjetas seleccionables, el segundo despliega un calendario con la fecha y una cuadrícula de horarios fijos (09:00, 10:00, 11:30, 14:00, 15:30, 17:00), y el tercero permite la confirmación final con el botón Confirmar Reserva. La pantalla de éxito muestra el ícono de CheckCircle2 junto con el mensaje Solicitud Enviada y la indicación de que el médico debe aceptar antes de habilitar el ingreso.

T04.7 — Construir el componente DashboardMedico.tsx con cuatro secciones diferenciadas, a saber, las consultas del día con el botón Iniciar para entrar inmediatamente a la sala, las solicitudes pendientes con los botones de aceptación y rechazo, las próximas citas confirmadas en formato cronológico y las atenciones recientes con enlace al historial clínico de cada paciente.

T04.8 — Construir el componente DashboardPaciente.tsx que muestre las citas próximas con un diseño diferenciado según el estado, donde las tarjetas PENDING aparecen con fondo amarillo y borde punteado junto con el mensaje El médico confirmará pronto, mientras que las tarjetas CONFIRMED aparecen con fondo blanco y borde sólido junto con el botón Ingresar a la Sala que redirige al meetingLink correspondiente.

T04.9 — Integrar la generación y el almacenamiento del meetingLink único al momento de crear la cita, usando una función que combine Math.random() con toString(36) y substring(7), asegurando que cada cita posea un identificador irrepetible que sirva como base para la sala de LiveKit asociada.

T04.10 — Conectar el botón Ingresar a la Sala del paciente y el botón Iniciar del médico con el componente Videollamada.tsx a través de useNavigate de react-router-dom, garantizando que ambos lleguen al mismo roomId derivado del meetingLink almacenado.

### Estado al cierre del Sprint 2 para la HU4

La historia quedó completada en sus aspectos críticos, esto es, el paciente puede reservar, el médico puede aceptar o rechazar, ambos pueden ingresar a la videollamada cuando la cita está confirmada y el sistema mantiene la trazabilidad completa de la cita en la base de datos. Quedaron como mejoras pendientes la validación estricta de choques de horarios entre citas del mismo médico, así como la obtención dinámica de los bloques horarios desde la base de datos, dado que actualmente vienen como un array fijo dentro del componente frontend.

## Definición de Hecho del Sprint 2

Para que cualquier tarea pudiera considerarse efectivamente terminada dentro del Sprint 2, el equipo acordó que se debían cumplir simultáneamente las siguientes condiciones, sin excepciones. En primer lugar, el código asociado debía estar versionado en el repositorio Git correspondiente, con un commit descriptivo que permitiera trazar el cambio en el historial. En segundo lugar, la funcionalidad debía haber sido probada manualmente en el entorno local de desarrollo, ejecutando los servidores backend y frontend simultáneamente y comprobando el flujo completo desde el navegador. En tercer lugar, los criterios de aceptación de la historia padre debían estar verificados uno por uno, marcando explícitamente cuáles habían quedado cubiertos. Por último, cualquier cambio que afectara la estructura de la base de datos debía estar reflejado en una migración de Prisma debidamente aplicada en la instancia de PostgreSQL alojada en DigitalOcean.

## Métricas resumidas del Sprint 2

El sprint cerró con un total de diecisiete tareas técnicas comprometidas, distribuidas entre las dos historias de usuario seleccionadas, de las cuales quince quedaron completadas dentro del periodo y dos pasaron al backlog del Sprint 3 como mejoras incrementales. La capacidad total estimada del equipo fue de aproximadamente noventa horas de trabajo conjunto, considerando los bloques de clase y los espacios autónomos, lo que arroja una velocidad efectiva consistente con la complejidad técnica esperada. El detalle desagregado por integrante y por tarea se encuentra documentado en el archivo estimacion_compromiso_sprint2.md, dentro de esta misma carpeta.

## Referencias cruzadas

Para profundizar en la planificación previa al inicio del sprint, así como en la definición del objetivo y la selección de las historias, se puede consultar el documento sprint_planning_sprint2.md. Para la trazabilidad del avance diario y los acuerdos tomados durante el periodo, está disponible el archivo daily_scrum_sprint2.md. La evidencia gráfica y descriptiva de las interfaces resultantes se encuentra en entregables_tecnicos_sprint2.md. Los resultados finales y la presentación al stakeholder se reflejan en los documentos resultados_sprint2.md y sprint_review_sprint2.md, mientras que las reflexiones del equipo sobre la dinámica de trabajo se recogen en sprint_retrospective_sprint2.md.
