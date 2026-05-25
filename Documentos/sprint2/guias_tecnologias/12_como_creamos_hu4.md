# Cómo Creamos la Historia de Usuario HU4 — Paso a Paso

Este documento explica de forma narrativa cómo abordamos la construcción de la historia de usuario HU4 (Reserva de teleconsulta con aceptación del médico e ingreso a la videollamada), desde la planificación inicial hasta el momento en que el flujo completo end-to-end quedó funcionando. La idea es que cualquier integrante del equipo pueda leer esta guía y entender no solo qué hicimos sino también por qué tomamos cada decisión técnica.

Al igual que la guía de la HU3, esta está escrita como un relato del proceso real, con los detalles técnicos relevantes pero sin caer en jerga innecesaria, para que sea fácil de seguir incluso por quien no participó directamente en cada paso.

## El punto de partida

La HU4 es la pieza que cierra el bucle paciente-médico dentro de la plataforma, esto es, lo que efectivamente conecta a las dos partes para que puedan encontrarse en la sala de videollamada. Sin esta historia, el sistema sería un conjunto de piezas aisladas (autenticación por un lado, videollamada por el otro) sin un mecanismo que las una en un flujo coherente.

Antes de comenzar a programar, conversamos como equipo sobre los detalles del flujo que queríamos construir. La historia base dice que como paciente rural necesitamos poder seleccionar un médico disponible con su especialidad, elegir una fecha y hora de atención disponible y confirmar la reserva para tener una consulta médica programada que el médico pueda aceptar o rechazar.

A partir de esa redacción, descompusimos las preguntas concretas. Cómo va a ver el paciente los médicos disponibles, qué horarios va a poder elegir, qué pasa cuando confirma la reserva, cómo va a ver el médico las solicitudes que le llegan, qué pasa cuando acepta o rechaza, y cómo se conecta todo esto con el componente de videollamada que ya teníamos del Sprint 1.

De estas conversaciones surgieron las diez tareas técnicas que conforman la HU4, las cuales numeramos como T04.1 hasta T04.10.

## Paso 1 — Diseñar los modelos de datos para citas y especialidades (T04.1)

Lo primero, como siempre, era pensar en cómo se iban a representar los datos en la base. La HU4 introduce dos nuevas entidades importantes, esto es, Specialty (las especialidades médicas disponibles) y Appointment (las citas agendadas entre pacientes y médicos).

James trabajó en estos modelos dentro del archivo backend/prisma/schema.prisma. Para Specialty optamos por algo simple, esto es, un id de tipo entero con autoincremento como llave primaria, y un name de tipo string marcado como único para evitar duplicados. Adicionalmente agregamos la relación inversa hacia User, esto es, una lista doctors de tipo User corchete corchete que permite saber qué médicos están asociados a cada especialidad.

Para Appointment el modelo fue más rico. Definimos los siguientes campos. Un id de tipo entero con autoincremento. Un date de tipo DateTime para la fecha y hora de la cita. Un status de tipo string con valor por defecto PENDING, que puede tomar los valores PENDING, CONFIRMED, COMPLETED o CANCELLED. Un meetingLink de tipo string que almacena el identificador único de la sala de videollamada. Dos llaves foráneas patientId y doctorId que apuntan al modelo User. Los timestamps createdAt y updatedAt manejados automáticamente por Prisma.

La parte interesante de Appointment fue cómo modelar las dos relaciones con User. Dado que un usuario puede tener citas tanto como paciente como médico, necesitábamos diferenciar ambas relaciones. Para esto usamos relaciones nominales con la directiva arroba relation seguida de un nombre. La relación desde patientId se llamó PatientAppointments, y la relación desde doctorId se llamó DoctorAppointments. En el modelo User esto se ve como dos campos separados, esto es, patientAppointments con la lista de citas como paciente, y doctorAppointments con la lista de citas como médico.

Adicionalmente agregamos una relación uno a uno con un futuro modelo ClinicalRecord, esto es, una cita puede tener cero o una ficha clínica asociada, dependiendo de si ya fue atendida o no.

Una vez definidos los modelos, James ejecutó npx prisma migrate dev con un nombre descriptivo y Prisma generó la migración SQL correspondiente. Las tablas Specialty y Appointment quedaron creadas en la base de DigitalOcean.

## Paso 2 — Construir el endpoint para crear citas (T04.2)

Con los modelos listos, James desarrolló el endpoint POST /api/appointments/book que permite al paciente crear una nueva cita.

La estructura siguió la misma arquitectura limpia que usamos en la HU3, esto es, ruta en appointmentRoutes.ts, controlador en appointmentController.ts, servicio en AppointmentService.ts y repositorio en AppointmentRepository.ts.

El flujo de creación es el siguiente. El controlador recibe la petición POST con el doctorId y el date en el cuerpo, junto con el patientId que extrae del JWT autenticado mediante req.user. Pasa estos datos al servicio.

El servicio ejecuta dos pasos. Primero genera el meetingLink único combinando Math.random() con toString(36) y substring(7), produciendo una cadena alfanumérica corta del tipo barra room barra abc123. Esta cadena va a ser el identificador de la sala de LiveKit asociada a esta cita.

Segundo, llama al repositorio para crear el registro en la tabla Appointment con todos los datos, esto es, patientId, doctorId, date, meetingLink y el status PENDING por defecto.

El repositorio ejecuta prisma.appointment.create con los datos correspondientes, lo cual internamente genera una sentencia INSERT en PostgreSQL. La cita queda persistida con un id autoincremental y los timestamps automáticos.

El servicio devuelve la cita creada al controlador, y el controlador la responde al cliente con código 201 junto con el meetingLink visible para que el paciente pueda verlo si lo necesita.

James probó el endpoint con Postman enviando peticiones con doctorId y date válidos, verificando que la cita se creaba correctamente y que el meetingLink generado era único en cada petición.

## Paso 3 — Construir el endpoint para listar los médicos disponibles (T04.3)

Para que el paciente pudiera ver qué médicos están disponibles al momento de agendar, necesitábamos un endpoint que devolviera la lista de profesionales con sus especialidades.

James desarrolló GET /api/appointments/doctors, el cual usa prisma.user.findMany con un where filtrando por role igual a DOCTOR, y un include para traer la relación con Specialty anidada en la misma consulta. Esto evita el problema N+1 que ocurriría si tuviéramos que hacer una consulta separada para cada especialidad.

El controlador simplemente delega al servicio, el servicio llama al repositorio y este ejecuta la consulta de Prisma. El resultado se devuelve al cliente como un array de objetos con la estructura corchete llave id, name, specialty dos puntos llave id, name cierra llave cierra llave cierra corchete.

Este endpoint es público en términos de los datos que devuelve, pero requiere autenticación dado que el frontend necesita el token JWT para hacer la petición.

## Paso 4 — Construir el endpoint para listar las citas propias (T04.4)

Aquí entré yo (Ignacio) trabajando en el endpoint GET /api/appointments/my-appointments, que devuelve las citas del usuario autenticado filtrando según su rol.

La lógica es la siguiente. Si el usuario es un paciente (role igual a PATIENT), devolvemos las citas donde patientId coincide con el id del usuario. Si el usuario es un médico (role igual a DOCTOR), devolvemos las citas donde doctorId coincide. Cada cita viene con los datos relacionados de la contraparte, esto es, el paciente ve el nombre y especialidad del médico, mientras que el médico ve el nombre y RUT del paciente.

Construí el método findByUserId en el AppointmentRepository, el cual recibe el id del usuario y su rol como parámetros. Usa un objeto where dinámico que se construye según el rol, y un include que trae las relaciones según corresponda.

El servicio AppointmentService llama a este método del repositorio pasando los datos del usuario autenticado. El controlador devuelve el resultado al cliente.

Probé el endpoint creando algunos usuarios de prueba (un paciente y un médico) y algunas citas entre ellos, verificando que cada uno veía solo las citas que le correspondían y con los datos correctos de la contraparte.

## Paso 5 — Construir el endpoint para aceptar o rechazar citas (T04.5)

Esta tarea también la hice yo, y es una de las más sensibles desde el punto de vista de la seguridad, dado que aquí es donde el médico cambia el estado de una cita.

El endpoint es PATCH /api/appointments/:id/status, donde :id es el identificador de la cita y el cuerpo contiene el nuevo status (CONFIRMED para aceptar o CANCELLED para rechazar).

La lógica del servicio AppointmentService.updateAppointmentStatus es la siguiente. Primero busco la cita por su id usando un método especial del repositorio llamado findByIdAndDoctor, el cual recibe el id de la cita y el id del médico autenticado, y solo devuelve la cita si efectivamente ese médico es el asignado a esa cita. Si la cita no existe o no le pertenece al médico, retorna null.

Si findByIdAndDoctor devuelve null, lanzo un error 403 Forbidden con un mensaje indicando que la operación no está permitida. Esto evita que un médico autenticado pueda cambiar el estado de citas que no le pertenecen, lo cual sería un agujero de seguridad serio.

Si la cita existe y le pertenece, actualizo el status con prisma.appointment.update y devuelvo la cita actualizada al controlador, que la responde al cliente.

Probé el endpoint con Postman, primero aceptando una cita legítima del médico autenticado para verificar que el cambio se aplicaba correctamente, luego intentando cambiar una cita ajena para verificar que el sistema lo bloqueaba con error 403.

## Paso 6 — Construir el componente ReservaCita en el frontend (T04.6)

Mientras James y yo trabajábamos en el backend, Vicente comenzó la construcción del componente más complejo del sprint, esto es, ReservaCita.tsx, ubicado en frontend/src/components/ReservaCita.tsx.

Vicente partió desde un boceto con tres pasos diferenciados, esto es, selección de especialista, selección de fecha y hora, y confirmación. Cada paso ocupa una columna o sección distinta del layout, con retroalimentación visual clara según el avance del flujo.

La estructura del componente quedó así. En la parte superior, un header con el título Agendar Teleconsulta y un subtítulo explicativo. Debajo, el layout principal dividido en una columna izquierda (un tercio del ancho en desktop) para el primer paso, y una columna derecha (dos tercios del ancho) para los pasos dos y tres apilados.

En el primer paso (columna izquierda), Vicente puso una lista vertical de tarjetas, cada una representando un médico. Cuando el componente se monta, ejecuta una petición GET a /api/appointments/doctors con el token JWT en el header, recibe la lista de médicos y la renderiza. Cada tarjeta muestra el nombre del médico, su especialidad y un avatar circular con un ícono UserIcon. Al hacer clic en una tarjeta, esta se marca como seleccionada cambiando el borde a azul y aplicando un leve efecto de escala.

Mientras la lista está cargando (estado loadingDoctors verdadero), se muestran tres tarjetas placeholder con animación pulse de color gris. Si la lista llega vacía, se muestra un mensaje informativo indicando que no hay médicos disponibles.

En el segundo paso (columna derecha superior), Vicente puso una caja blanca dividida internamente en dos columnas. La primera columna tiene un input nativo de tipo date para seleccionar la fecha, con la propiedad min establecida en el día actual para impedir seleccionar fechas pasadas. La segunda columna tiene una cuadrícula de seis botones con los horarios disponibles (09:00, 10:00, 11:30, 14:00, 15:30, 17:00), los cuales están deshabilitados hasta que se haya seleccionado una fecha. El botón seleccionado se destaca con fondo azul, texto blanco y un leve efecto de escala.

En la parte inferior de la caja (tercer paso), Vicente puso una franja horizontal con un mensaje contextual que cambia según el avance del flujo. Si no hay especialista seleccionado, dice Comienza seleccionando un especialista. Si no hay fecha, dice Selecciona una fecha en el calendario. Si no hay horario, dice Elige tu bloque horario. Cuando los tres están seleccionados, aparece Todo listo para confirmar en color emerald con un ícono CheckCircle2.

A la derecha del mensaje está el botón Confirmar Reserva con fondo de gradiente azul, deshabilitado hasta que los tres pasos estén completos. Al presionarlo, se ejecuta la función handleBooking que construye un objeto con doctorId, date (combinando la fecha y la hora seleccionadas en formato ISO) y lo envía como POST a /api/appointments/book con el token en el header.

Si la petición es exitosa, el componente cambia a un estado de éxito (success igual a true) que renderiza una vista completamente distinta, esto es, una caja centrada con un ícono CheckCircle2 grande en color emerald, el título Solicitud Enviada y un mensaje informativo. Más abajo, en color azul, la indicación Podrás entrar una vez el médico acepte la cita. Bajo el mensaje, un botón Agendar otra cita que resetea el formulario y vuelve al estado inicial.

Si la petición falla, el componente muestra una caja roja translúcida con el mensaje de error retornado por el backend.

Vicente probó el componente conectándolo con los endpoints reales que James y yo habíamos construido, verificando que el flujo completo desde la selección hasta la confirmación funcionaba correctamente.

## Paso 7 — Construir el DashboardMedico (T04.7)

La siguiente pieza grande que Vicente construyó fue el DashboardMedico.tsx en frontend/src/components/dashboards/DashboardMedico.tsx, que es la vista principal del médico tras iniciar sesión.

La estructura del dashboard quedó dividida en cuatro secciones principales. Un header superior con el nombre del médico. Una franja de cuatro tarjetas resumen con KPIs. Una columna izquierda con dos sub-secciones apiladas. Una columna derecha con otras dos sub-secciones apiladas.

El header simplemente muestra Panel Médico seguido del nombre del médico extraído del AuthContext, en color emerald para darle énfasis visual.

La franja de KPIs muestra cuatro cajas con íconos y números. La primera caja es Consultas Hoy con un ícono Clock en azul. La segunda es Por Aprobar con un ícono HeartPulse en amarillo. La tercera es Completadas con un ícono CheckCircle2 en emerald. La cuarta es Próximas con un ícono Calendar en púrpura. Cada caja tiene un fondo de color suave acorde a su categoría.

La columna izquierda tiene dos secciones. La primera, Consultas de Hoy, lista las citas confirmadas para el día actual. Cada cita aparece como una tarjeta con el nombre del paciente, la hora y un botón Iniciar a la derecha (fondo emerald, ícono Video, texto blanco) que ejecuta navigate al meetingLink correspondiente, llevando directamente al componente Videollamada.

La segunda, Solicitudes Pendientes, lista todas las citas en estado PENDING que le han sido asignadas. Cada solicitud aparece como una tarjeta con el nombre del paciente, la fecha y hora, y dos botones a la derecha. El primer botón es verde con un ícono Check para aceptar, el segundo es blanco con borde rojo y un ícono X para rechazar.

La columna derecha también tiene dos secciones. La primera, Próximas Citas Confirmadas, muestra las citas futuras en orden cronológico. La segunda, Atenciones Recientes, muestra las cinco citas más recientes con estado COMPLETED, con enlace al historial clínico de cada paciente.

La lógica detrás de los botones de aceptar y rechazar es la función handleStatusUpdate, que recibe el id de la cita, el nuevo status (CONFIRMED o CANCELLED), la fecha y el meetingLink. Ejecuta una petición PATCH a /api/appointments/{id}/status con el cuerpo conteniendo el status. Si la petición es exitosa, verifica adicionalmente si la cita es para el día actual y si el status fue CONFIRMED. En ese caso, despliega un cuadro de diálogo nativo del navegador (window.confirm) preguntando si el médico quiere ingresar de inmediato a la sala. Si el médico confirma, se ejecuta navigate al meetingLink, abriendo el componente Videollamada con el roomId correcto. Si no confirma, simplemente se recarga la lista de citas.

Vicente probó el dashboard creando un usuario médico de prueba, dándole varias citas de pacientes con distintos estados y fechas, y verificando que cada sección mostraba las citas correctas y que los botones de acción funcionaban como esperaba.

## Paso 8 — Construir el DashboardPaciente (T04.8)

Vicente también construyó el DashboardPaciente.tsx en frontend/src/components/dashboards/DashboardPaciente.tsx, que es la vista principal del paciente tras iniciar sesión.

El header muestra la bienvenida personalizada con el primer nombre del paciente (extraído del AuthContext y usando split para obtener solo la primera palabra). El nombre se renderiza con un gradiente de azul a índigo para darle énfasis visual.

A la derecha del header está el botón principal Agendar Teleconsulta, con fondo azul, ícono CalendarPlus a la izquierda, texto blanco y un efecto de elevación al hacer hover. Al presionarlo, ejecuta navigate apuntando a barra reserva, lo cual lleva al componente ReservaCita.

Debajo del header está la sección Tu Agenda Próxima dentro de una caja blanca grande con esquinas redondeadas con radio aún mayor (rounded-corchete 2 rem corchete). El encabezado de la caja muestra un ícono Video en azul, el título y el contador total de citas próximas.

El cuerpo de la caja renderiza las citas activas. La lógica filtra del array de citas obtenido del endpoint las que están en estado CONFIRMED o PENDING (excluyendo las COMPLETED o CANCELLED). El renderizado aplica un diseño diferenciado según el estado, esto es, las tarjetas PENDING tienen fondo amarillo translúcido con borde punteado y un badge superior con el texto Esperando Médico en color amarillo oscuro. Las tarjetas CONFIRMED tienen fondo blanco con borde sólido y un badge verde con el texto Confirmada.

Cada tarjeta muestra una sección lateral izquierda con la fecha destacada (mes en azul, día grande en negro, hora en gris pequeño) y la información del médico (nombre y especialidad) en el resto del ancho. A la derecha de cada tarjeta CONFIRMED aparece el botón Ingresar a la Sala con fondo emerald, texto blanco, ícono Video. Al presionarlo, ejecuta navigate al meetingLink correspondiente.

Cuando la lista de citas está vacía, aparece un mensaje centrado dentro de un recuadro punteado con el ícono HeartPulse grande en gris claro y el texto No tienes teleconsultas agendadas actualmente, invitando implícitamente al usuario a usar el botón de agendamiento.

Vicente probó el dashboard creando un paciente de prueba, agendando algunas citas y verificando los distintos estados visuales, junto con el flujo de navegación al ReservaCita y a la videollamada.

## Paso 9 — Integrar la generación del meetingLink (T04.9)

Esta tarea fue mía y consistió en asegurar que cada cita tuviera un identificador único de sala generado de forma consistente.

La lógica ya estaba en el método createAppointment del AppointmentService (lo había hecho James en la tarea T04.2), pero yo lo revisé para asegurar que el meetingLink se generaba con suficiente unicidad. La técnica usada fue combinar Math.random().toString(36).substring(7), lo cual produce una cadena alfanumérica corta y aleatoria.

Math.random() devuelve un número aleatorio entre 0 y 1. toString(36) lo convierte a un string en base 36, esto es, usando dígitos y letras de la A a la Z. substring(7) toma desde el séptimo carácter en adelante, descartando el 0 punto del inicio.

El resultado es algo como abc123def, que combinado con el prefijo barra room barra queda como barra room barra abc123def. Este es el meetingLink que se almacena en la base de datos y se usa como roomId en LiveKit.

Verifiqué con pruebas manuales que dos citas creadas consecutivamente generaban links distintos, lo cual confirmaba que no había colisiones al menos en escenarios típicos. Para producción seria se podría mejorar usando librerías como nanoid o uuid que garantizan unicidad criptográfica, pero para el contexto académico esta solución era suficiente.

## Paso 10 — Cablear la navegación al meetingLink (T04.10)

La última pieza del puzzle era asegurar que tanto el botón Iniciar del médico como el botón Ingresar a la Sala del paciente efectivamente llevaran al componente Videollamada con el roomId correcto.

Esto se hizo usando el hook useNavigate de react-router-dom. En cada botón, el handler onClick ejecuta navigate pasando el meetingLink correspondiente. Por ejemplo, navigate(apt.meetingLink) donde apt es la cita actual.

Como el componente Videollamada está mapeado en App.tsx a la ruta /room/:roomId, y como el meetingLink tiene el formato /room/abc123, la navegación funciona directamente sin necesidad de transformaciones adicionales. El componente Videollamada usa useParams para extraer el roomId de la URL y lo usa para solicitar el token de LiveKit y conectarse a la sala.

Verifiqué que tanto desde el dashboard del médico como desde el dashboard del paciente, los botones llevaran al mismo componente con el mismo roomId, lo cual garantizaba que ambos terminaban en la misma sala virtual.

## Pruebas integradas end-to-end

Una vez que las diez tareas estaban completas, hicimos la prueba más importante de todo el sprint, esto es, la prueba integrada end-to-end del flujo completo de la HU4, conectando todo con la HU3 y la videollamada del Sprint 1.

Primero, registramos un paciente nuevo desde cero usando el Register. Verificamos que el AuthContext lo dejaba autenticado y nos llevaba al DashboardPaciente.

Segundo, presionamos Agendar Teleconsulta y entramos al ReservaCita. Seleccionamos un médico de la lista (que James había precargado en el seed con tres médicos de distintas especialidades). Elegimos una fecha para el día actual. Seleccionamos un horario. Presionamos Confirmar Reserva. Verificamos que la pantalla cambiaba al estado de éxito con el mensaje correspondiente.

Tercero, volvimos al DashboardPaciente y verificamos que la nueva cita aparecía como tarjeta amarilla con el badge Esperando Médico, sin el botón de ingreso.

Cuarto, cerramos sesión y entramos como el médico al que le habíamos agendado la cita. En el DashboardMedico, verificamos que la solicitud aparecía en la sección Solicitudes Pendientes.

Quinto, presionamos el botón verde de aceptar. Como la cita era para el día actual, apareció el cuadro de diálogo del navegador preguntando si queríamos ingresar de inmediato. Confirmamos.

Sexto, el navegador redirigió al componente Videollamada. El PreFlightCheck verificó cámara y micrófono. Una vez aprobado, el componente solicitó el token de LiveKit, se conectó al servidor y mostró la sala vacía esperando al otro participante.

Séptimo, abrimos otro navegador (en modo incógnito para tener una sesión separada), iniciamos sesión como el paciente. En el DashboardPaciente verificamos que la cita ahora aparecía como tarjeta blanca con el badge verde Confirmada y el botón Ingresar a la Sala visible.

Octavo, presionamos el botón Ingresar a la Sala. El navegador navegó al mismo componente Videollamada con el mismo roomId. El PreFlightCheck verificó cámara y micrófono. Solicitó el token de LiveKit, se conectó al servidor y entró a la sala donde estaba esperando el médico.

Noveno, verificamos que ambos navegadores se veían y se escuchaban mutuamente, con video bidireccional y audio funcionando correctamente. El panel lateral del médico mostraba el formulario de ficha clínica, mientras que el del paciente mostraba el chat y la información del médico.

Décimo, probamos también el escenario de rechazo. Creamos otra cita desde el paciente, volvimos al médico y presionamos el botón rojo de rechazar. Verificamos que la cita cambiaba a estado CANCELLED y desaparecía de la sección de próximas en el dashboard del paciente.

Todos los escenarios funcionaron como esperábamos. Con esto dimos por cerrada la HU4 en sus aspectos centrales, dejando solo la validación estricta de choques de horarios y la obtención dinámica de los bloques horarios como mejoras menores para el Sprint 3.

## Aprendizajes que dejó la HU4

Construir esta historia nos dejó varios aprendizajes valiosos.

Primero, la integración con piezas existentes (como el componente Videollamada del Sprint 1) requiere planificación cuidadosa. La decisión arquitectónica del meetingLink como puente entre la cita y la sala fue clave para que esta integración fluyera sin problemas.

Segundo, los componentes complejos con múltiples pasos como el ReservaCita se vuelven mucho más manejables si se descomponen visualmente en secciones diferenciadas. Los tres pasos del ReservaCita, con su mensaje contextual cambiante, guían al usuario sin que pueda perderse.

Tercero, la validación de propiedad en los endpoints sensibles (como el PATCH de aceptar o rechazar) es crítica. Es fácil olvidar este detalle y dejar agujeros de seguridad sin querer.

Cuarto, el uso de relaciones nominales en Prisma (DoctorAppointments y PatientAppointments) resultó muy elegante para resolver el caso donde dos llaves foráneas apuntan al mismo modelo desde distintos roles. Es una característica que vale la pena recordar para futuros proyectos.

Quinto, las pruebas end-to-end con dos navegadores en paralelo son la mejor forma de validar flujos colaborativos como el de paciente-médico. Probar cada lado aisladamente no garantiza que la convergencia en la sala funcione, dado que es justamente en ese punto donde aparecen los problemas más sutiles.

Sexto, decisiones aparentemente menores como el auto-login después del registro o el cuadro de diálogo nativo al aceptar citas de hoy hacen una gran diferencia en la experiencia del usuario. Vale la pena pensar en estos detalles aunque no estén explícitos en la historia base.
