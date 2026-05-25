# Daily Scrum del Sprint 2 — mediCampo v2

Este documento recoge tanto los lineamientos acordados por el equipo para llevar adelante las reuniones diarias de avance, conocidas en el marco Scrum como Daily Scrum, como también las bitácoras detalladas de cada una de las ocho reuniones efectivamente realizadas durante el periodo del Sprint 2. La fase 2 del marco Scrum, denominada implementación, encuentra en estas instancias su mecanismo principal de sincronización del equipo, ya que permite identificar los avances reales, los bloqueos emergentes y las decisiones tácticas que se deben tomar para sostener el cumplimiento del objetivo del sprint.

## Lineamientos acordados para los Daily Scrum

Antes de iniciar el sprint, el equipo conformado por Vicente Ramirez, James Honeymann e Ignacio Ampuero discutió en conjunto los lineamientos que regirían las reuniones diarias durante todo el periodo, considerando las restricciones reales del calendario académico, las disponibilidades individuales y la necesidad de mantener un ritmo sostenido de avance. Los lineamientos quedaron definidos como sigue, sirviendo de marco para todas las instancias posteriores.

### Frecuencia y duración

Las reuniones diarias se realizan presencialmente dentro de los bloques de clase de la asignatura, esto es, los martes desde las 14:00 hasta las 15:20 y los viernes desde las 15:30 hasta las 16:50, aprovechando los primeros quince minutos de cada sesión para sincronización pura y dejando el resto del bloque para trabajo conjunto en las tareas. De esta manera, se aprovecha al máximo el tiempo común sin necesidad de coordinar nuevos espacios fuera del horario académico. Cuando algún integrante no puede asistir presencialmente, comparte su reporte por mensajería instantánea, dejando constancia escrita de lo conversado.

### Estructura de cada reunión

Cada Daily Scrum sigue el patrón clásico de tres preguntas por integrante, a saber, qué hice desde la reunión anterior, qué haré antes de la próxima reunión y qué bloqueos estoy enfrentando que puedan comprometer el cumplimiento de mi compromiso. La rotación de la palabra se realiza en orden alfabético del nombre de pila para evitar discusiones sobre quién comienza, asegurando además que todos los integrantes tengan voz en cada sesión.

### Reglas de oro acordadas

El equipo acordó cuatro reglas que se respetaron consistentemente durante todo el sprint. La primera regla es que no se resuelven problemas técnicos durante la reunión diaria, sino que se identifican y se programa una conversación posterior con quien corresponda, manteniendo el daily breve y enfocado. La segunda regla es que cualquier modificación al Sprint Backlog debe ser aprobada en conjunto, evitando movimientos unilaterales. La tercera regla es que la persona con bloqueos debe solicitar explícitamente ayuda durante el daily, sin esperar que alguien lo note. La cuarta regla es que los avances se reportan en términos verificables, como pull requests creados, archivos modificados o pruebas ejecutadas, evitando reportes vagos del tipo trabajé en la HU3 sin más detalle.

### Documentación de las reuniones

Cada reunión queda registrada en este mismo documento por parte del Scrum Master ad-hoc, Ignacio Ampuero, capturando los reportes individuales, los acuerdos tomados, los bloqueos identificados y las acciones de seguimiento que quedan pendientes para el siguiente encuentro. El formato se mantiene consistente en todas las entradas para facilitar la lectura posterior.

## Bitácora de las reuniones diarias del Sprint 2

A continuación se presentan las ocho reuniones diarias efectivamente realizadas durante el sprint, en orden cronológico. Cada entrada incluye el día de la semana, el rango horario aproximado, los reportes individuales de cada integrante y los acuerdos tomados al cierre.

### Reunión 1 — Martes, semana 1 del sprint

Horario aproximado: 14:00 a 14:15.
Modalidad: presencial dentro del bloque de clase.
Asistentes: Vicente Ramirez, James Honeymann, Ignacio Ampuero.

Reporte de Ignacio Ampuero: durante el día anterior se cerró formalmente el Sprint Planning, quedando confirmadas las dos historias de usuario seleccionadas, la lista inicial de diecisiete tareas técnicas y la asignación de responsables. Para esta semana inicial se compromete a comenzar con la implementación del AuthContext en el frontend, junto con el componente RoleRoute en App.tsx, dejando las bases del flujo de autenticación operativas para que sus compañeros puedan engancharse con el backend. No hay bloqueos al momento del reporte.

Reporte de James Honeymann: durante el periodo previo revisó la estructura existente del directorio backend, en particular los archivos de configuración de Prisma y los controladores ya construidos en el Sprint 1, para tener claridad sobre dónde insertar los nuevos endpoints de autenticación. Para esta semana se compromete a tener listo el modelo User en schema.prisma con su migración aplicada, así como el endpoint POST /api/auth/register funcionando correctamente. Como bloqueo, menciona que necesita confirmar la URL de la base de datos remota, ya que el archivo .env del backend no estaba en el repositorio por seguridad.

Reporte de Vicente Ramirez: durante el periodo previo exploró los componentes existentes del frontend para entender la convención visual del proyecto, identificando que se usa TailwindCSS, Lucide React para los íconos y un esquema de color basado en emerald y cyan. Para esta semana se compromete a comenzar con el diseño del Login.tsx, partiendo desde un mockup en papel que ya tiene esbozado. No hay bloqueos al momento del reporte.

Acuerdos del cierre de la reunión: Ignacio comparte por mensajería privada el archivo .env del backend con James para desbloquearlo. James inicia el modelo Prisma de inmediato. Vicente comienza con el Login.tsx. Se acuerda que durante el bloque de hoy se trabajará en paralelo, con disponibilidad cruzada para consultas técnicas entre los tres integrantes.

### Reunión 2 — Viernes, semana 1 del sprint

Horario aproximado: 15:30 a 15:45.
Modalidad: presencial dentro del bloque de clase.
Asistentes: Vicente Ramirez, James Honeymann, Ignacio Ampuero.

Reporte de Ignacio Ampuero: durante el martes terminó la implementación del AuthContext.tsx con persistencia en localStorage bajo las claves medicampo_token y medicampo_user, junto con la restauración de la sesión al cargar la aplicación. Durante los días intermedios, ya en tiempo personal, también construyó el componente RoleRoute en App.tsx, verificando el rol del usuario antes de permitir el acceso a las rutas restringidas. Para los próximos días se compromete a comenzar con el endpoint GET /api/appointments/my-appointments, dependiendo de que James tenga los modelos de Appointment listos para ese momento. No hay bloqueos al momento del reporte.

Reporte de James Honeymann: terminó el modelo User en schema.prisma con todos los campos requeridos, ejecutó la migración en la base de datos de DigitalOcean y construyó tanto el endpoint POST /api/auth/register como el endpoint POST /api/auth/login. Ambos endpoints fueron probados manualmente con Postman, obteniendo respuestas exitosas. Para los próximos días se compromete a iniciar los modelos de Specialty y Appointment, junto con sus migraciones. No hay bloqueos al momento del reporte.

Reporte de Vicente Ramirez: terminó el componente Login.tsx con el formulario funcional, la validación de campos, el manejo de loading y error, junto con el diseño visual completo en TailwindCSS, replicando la estética que se había definido en los mockups iniciales. Lo probó conectándolo con el endpoint de login que James ya tenía listo, confirmando que el flujo funciona end-to-end. Para los próximos días se compromete a iniciar el componente Register.tsx, reusando los patrones visuales del Login. Como bloqueo menor, comenta que el ícono de HeartPulse no estaba importado en el archivo de íconos, situación que ya resolvió por su cuenta.

Acuerdos del cierre de la reunión: James inicia los modelos de Specialty y Appointment durante el fin de semana. Vicente termina el Register durante el fin de semana. Ignacio espera a que James tenga los modelos para iniciar los endpoints de citas. Se confirma que la primera semana del sprint cierra con la HU3 al sesenta por ciento de avance, lo cual está alineado con la planificación inicial.

### Reunión 3 — Martes, semana 2 del sprint

Horario aproximado: 14:00 a 14:20.
Modalidad: presencial dentro del bloque de clase.
Asistentes: Vicente Ramirez, James Honeymann, Ignacio Ampuero.

Reporte de Ignacio Ampuero: como James ya tenía los modelos listos desde el fin de semana, durante el lunes comenzó con el endpoint GET /api/appointments/my-appointments y el endpoint PATCH /api/appointments/:id/status. Ambos están funcionando, aunque aún sin la validación de propiedad estricta para el médico. Para esta semana se compromete a terminar la validación de propiedad en el PATCH, junto con la integración del meetingLink único al crear citas. Como bloqueo, menciona que necesita revisar con James cómo está estructurado el repositorio de appointments, dado que existen métodos relacionados que no están claramente documentados.

Reporte de James Honeymann: terminó los modelos de Specialty y Appointment en schema.prisma, ejecutó la migración correspondiente, construyó el endpoint POST /api/appointments/book con la generación del meetingLink y el endpoint GET /api/appointments/doctors que retorna la lista de profesionales. Ambos endpoints fueron probados manualmente. Para esta semana se compromete a coordinar con Ignacio la consolidación de los endpoints de citas, junto con la documentación inline necesaria. No hay bloqueos al momento del reporte.

Reporte de Vicente Ramirez: terminó el componente Register.tsx con el formulario completo, la lógica de auto-login posterior al registro y el diseño visual armónico con el Login. Probó el flujo completo de registro e inicio de sesión en el navegador, confirmando que la persistencia en localStorage funciona correctamente al recargar la página. Para esta semana se compromete a iniciar el componente DashboardPaciente.tsx, dado que es la siguiente vista que el paciente verá tras iniciar sesión. Como bloqueo, menciona que necesita los datos reales de las citas desde la API, por lo cual depende de que los endpoints de cita estén estables.

Acuerdos del cierre de la reunión: James e Ignacio se reúnen al cierre del bloque de hoy para sincronizar la estructura del repositorio de appointments. Vicente arranca el DashboardPaciente usando datos mock mientras la API se estabiliza, refactorizando hacia datos reales cuando estén disponibles. Se decide cerrar la HU3 a más tardar el viernes de esta semana, dejando el resto del sprint enfocado en la HU4.

### Reunión 4 — Viernes, semana 2 del sprint

Horario aproximado: 15:30 a 15:50.
Modalidad: presencial dentro del bloque de clase, con Ignacio Ampuero conectado por videollamada debido a una evaluación de otra asignatura.
Asistentes: Vicente Ramirez, James Honeymann, Ignacio Ampuero (remoto).

Reporte de Ignacio Ampuero: agregó la validación de propiedad estricta en el endpoint PATCH de actualización de estado, usando appointmentRepository.findByIdAndDoctor para evitar que un médico cambie el estado de citas que no le pertenecen. También integró la generación del meetingLink dentro del AppointmentService, asegurando que cada cita tenga un identificador irrepetible. Para los próximos días se compromete a comenzar el cableado de la navegación al meetingLink desde ambos dashboards, una vez que Vicente tenga los componentes listos. Como bloqueo, comenta que la integración con el componente Videollamada.tsx requiere revisar el manejo de roomId en el frontend, lo cual conversará con Vicente al final del bloque.

Reporte de James Honeymann: completó la documentación inline de los endpoints de citas y revisó con Ignacio la estructura del repositorio, dejándola más clara para futuras tareas. También apoyó a Vicente con la creación de datos seed para que el DashboardPaciente tenga citas reales para mostrar, ejecutando el script seed.ts contra la base de datos de DigitalOcean. Para los próximos días se compromete a apoyar las integraciones que requieran ajustes en el backend, sin frentes propios nuevos. No hay bloqueos al momento del reporte.

Reporte de Vicente Ramirez: terminó la primera versión del DashboardPaciente.tsx con la lista de citas próximas, el diseño diferenciado según el estado, el botón de agendamiento y el acceso al historial clínico. Probó la integración con los endpoints reales y todo funcionó correctamente, con datos que persisten entre recargas gracias al backend. Para los próximos días se compromete a iniciar el componente ReservaCita.tsx, dado que es la pieza más compleja del frontend en este sprint. Como bloqueo, menciona que necesita confirmar cuáles son los bloques horarios disponibles, decisión que se posterga para el próximo daily.

Acuerdos del cierre de la reunión: la HU3 se da por cerrada en sus aspectos centrales, dejando la creación de cuentas de médico desde el panel admin como pendiente menor para el Sprint 3. Vicente comienza el ReservaCita usando bloques horarios fijos predefinidos (09:00, 10:00, 11:30, 14:00, 15:30, 17:00) acordados por consenso. Ignacio coordina con Vicente al cierre del bloque de hoy para revisar el manejo de roomId.

### Reunión 5 — Martes, semana 3 del sprint

Horario aproximado: 14:00 a 14:15.
Modalidad: presencial dentro del bloque de clase.
Asistentes: Vicente Ramirez, James Honeymann, Ignacio Ampuero.

Reporte de Ignacio Ampuero: durante el fin de semana revisó con Vicente el flujo de navegación al meetingLink, confirmando que la estrategia más limpia era usar useNavigate de react-router-dom para llevar al usuario directo al componente Videollamada.tsx. Esa integración ya está cableada y funcionando, tanto desde el botón Ingresar a la Sala del paciente como desde el botón Iniciar del médico. Para esta semana se compromete a apoyar a Vicente en la finalización del ReservaCita y el DashboardMedico, sin tomar nuevos frentes propios, dado que sus tareas individuales están terminadas. No hay bloqueos al momento del reporte.

Reporte de James Honeymann: durante el fin de semana hizo limpieza del seed de la base de datos, agregando más médicos y especialidades para que el flujo de reserva tenga variedad al momento de la demostración. También revisó las pruebas manuales del endpoint PATCH, confirmando que el rechazo funciona correctamente. Para esta semana se compromete a apoyar las pruebas integrales del flujo completo paciente-médico, sin tomar nuevos frentes. No hay bloqueos al momento del reporte.

Reporte de Vicente Ramirez: durante el fin de semana avanzó la primera versión del componente ReservaCita.tsx con el layout de tres pasos, la integración con el endpoint de doctores y la lógica de selección de especialista, fecha y horario. Falta refinar la pantalla de confirmación de éxito y ajustar algunos detalles visuales menores. Para esta semana se compromete a terminar el ReservaCita y a iniciar el DashboardMedico.tsx, que es la pieza más extensa del sprint. Como bloqueo, comenta que necesita confirmar cómo se manejan las solicitudes pendientes desde el lado del médico, lo cual revisarán con Ignacio durante el bloque de hoy.

Acuerdos del cierre de la reunión: Vicente termina el ReservaCita y arranca el DashboardMedico en paralelo. Ignacio y James se mantienen disponibles para resolver dudas o apoyar en debugging cuando surja. Se programa una sesión informal el miércoles por la tarde para integración cruzada, fuera del bloque de clase, en formato remoto vía videollamada.

### Reunión 6 — Viernes, semana 3 del sprint

Horario aproximado: 15:30 a 15:50.
Modalidad: presencial dentro del bloque de clase.
Asistentes: Vicente Ramirez, James Honeymann, Ignacio Ampuero.

Reporte de Ignacio Ampuero: durante la sesión informal del miércoles ayudó a Vicente a depurar un problema con la pantalla de éxito del ReservaCita, donde el meetingLink no se mostraba correctamente al usuario porque el estado se reseteaba antes de tiempo. Ya quedó resuelto. Para los próximos días se compromete a comenzar la preparación de los documentos de cierre del sprint, incluyendo los entregables técnicos y la base del Sprint Review, considerando que la próxima semana es la última. No hay bloqueos al momento del reporte.

Reporte de James Honeymann: apoyó la integración del DashboardPaciente con el endpoint de citas, confirmando que el badge de estado cambia correctamente cuando una cita pasa de PENDING a CONFIRMED tras la aceptación del médico. También revisó manualmente el escenario de rechazo, validando que la cita cambia a CANCELLED y desaparece de la sección de próximas. Para los próximos días se compromete a documentar los endpoints en un README breve dentro del directorio backend, para facilitar la entrega final. No hay bloqueos al momento del reporte.

Reporte de Vicente Ramirez: terminó el ReservaCita.tsx, incluyendo la pantalla de confirmación de éxito con el meetingLink visible al usuario y el botón para agendar otra cita. También avanzó la primera mitad del DashboardMedico.tsx, con la sección de consultas del día y la de solicitudes pendientes. Falta terminar la sección de próximas citas confirmadas y la de atenciones recientes con enlace al historial. Para los próximos días se compromete a cerrar el DashboardMedico y a hacer una pasada de ajustes responsive en todas las vistas. Como bloqueo, comenta que el diseño en mobile aún tiene algunos detalles por pulir, especialmente en el grid de horarios.

Acuerdos del cierre de la reunión: Vicente cierra el DashboardMedico durante el fin de semana y la primera mitad de la próxima. Ignacio comienza a preparar la documentación de cierre. James queda en disponibilidad para apoyar las pruebas finales. Se acuerda que el martes de la última semana se hará una primera pasada de demo completa del flujo end-to-end, para detectar problemas con tiempo.

### Reunión 7 — Martes, semana 4 del sprint

Horario aproximado: 14:00 a 14:30.
Modalidad: presencial dentro del bloque de clase, con demo en vivo del flujo completo.
Asistentes: Vicente Ramirez, James Honeymann, Ignacio Ampuero.

Reporte de Ignacio Ampuero: avanzó significativamente en la documentación de cierre, redactando borradores del sprint_backlog_sprint2.md, el sprint_planning_sprint2.md y la estructura del estimacion_compromiso_sprint2.md. Para esta semana final se compromete a terminar todos los documentos de cierre, incluyendo el sprint_review_sprint2.md y el sprint_retrospective_sprint2.md. Como bloqueo, menciona que necesita las capturas de pantalla finales de las interfaces para incluirlas en el entregable, dependiendo de que Vicente termine los ajustes visuales.

Reporte de James Honeymann: completó la documentación de los endpoints en el README del backend, agregando ejemplos de payloads y respuestas para cada uno. También ejecutó una limpieza completa de la base de datos seed, dejando un set consistente de pacientes, médicos y especialidades para la demostración. Para esta semana se compromete a apoyar la demo completa que se realizará a continuación dentro de este mismo bloque, sin tomar nuevos frentes. No hay bloqueos al momento del reporte.

Reporte de Vicente Ramirez: cerró el DashboardMedico.tsx con todas las secciones funcionales, incluyendo la sección de consultas del día con el botón Iniciar, las solicitudes pendientes con los botones de aceptar y rechazar, las próximas citas confirmadas en formato cronológico y las atenciones recientes con enlace al historial. También hizo la pasada de ajustes responsive en todas las vistas. Para esta semana final se compromete a una segunda pasada de pulido visual y a apoyar la demo. No hay bloqueos al momento del reporte.

Demo del flujo completo realizada durante el bloque: el equipo ejecutó en vivo el escenario completo, partiendo desde el registro de un nuevo paciente, su inicio de sesión, la reserva de una cita con un médico disponible, el cierre de sesión, el inicio de sesión del médico, la aceptación de la cita pendiente, el reingreso del paciente y, finalmente, el ingreso simultáneo de ambos a la sala de videollamada. La demo se ejecutó sin errores en el flujo principal, validando que el sprint está prácticamente cerrado.

Acuerdos del cierre de la reunión: Ignacio termina toda la documentación durante la semana. Vicente hace la última pasada de pulido visual. James apoya con pruebas en distintos navegadores. Se confirma que el viernes se realizará la Sprint Review formal con presentación a la cátedra, seguida de la Sprint Retrospective interna del equipo.

### Reunión 8 — Viernes, semana 4 del sprint

Horario aproximado: 15:30 a 15:45.
Modalidad: presencial dentro del bloque de clase, previo a la Sprint Review.
Asistentes: Vicente Ramirez, James Honeymann, Ignacio Ampuero.

Reporte de Ignacio Ampuero: terminó todos los documentos de cierre, incluyendo sprint_backlog_sprint2.md, sprint_planning_sprint2.md, estimacion_compromiso_sprint2.md, daily_scrum_sprint2.md, entregables_tecnicos_sprint2.md, resultados_sprint2.md, sprint_review_sprint2.md y sprint_retrospective_sprint2.md. Todos quedaron alojados en la carpeta Documentos/sprint2 del repositorio. Para hoy se compromete a moderar tanto la Sprint Review como la Sprint Retrospective al cierre de la presentación oficial. No hay bloqueos al momento del reporte.

Reporte de James Honeymann: confirmó que la base de datos seed está en estado óptimo para la demo, con tres médicos de distintas especialidades, varios pacientes registrados y algunas citas en distintos estados para mostrar todos los escenarios. Probó el flujo en Chrome, Firefox y Edge sin encontrar problemas. Para hoy se compromete a apoyar la Sprint Review respondiendo preguntas técnicas sobre el backend si surgen del jurado. No hay bloqueos al momento del reporte.

Reporte de Vicente Ramirez: hizo la última pasada de pulido visual, ajustando los espaciados en mobile y corrigiendo dos detalles menores de tipografía. También preparó las capturas de pantalla finales y se las pasó a Ignacio para los documentos de cierre. Para hoy se compromete a liderar la parte de demostración visual durante la Sprint Review, mostrando en vivo el flujo completo desde la perspectiva del paciente y del médico. No hay bloqueos al momento del reporte.

Acuerdos del cierre de la reunión: la Sprint Review se realiza inmediatamente después de esta reunión, dentro del mismo bloque de clase. La Sprint Retrospective se realiza al cierre de la Sprint Review, en formato cerrado entre los tres integrantes. El equipo se da por satisfecho con el cumplimiento del objetivo del sprint, dejando solo dos tareas menores como pendientes para el Sprint 3, esto es, la creación de cuentas de médico desde el panel admin y la validación estricta de choques de horarios.

## Patrones recurrentes observados durante el sprint

Al revisar las ocho reuniones en conjunto se observan algunos patrones que vale la pena destacar para futuros sprints. En primer lugar, el equipo aprovechó consistentemente los espacios entre reuniones de clase para trabajar de forma asincrónica, lo cual permitió mantener el ritmo de avance pese a la limitada cantidad de tiempo presencial. En segundo lugar, los bloqueos identificados durante los dailies se resolvieron casi todos dentro del mismo bloque de clase o, a más tardar, en la sesión informal del miércoles, evitando que se acumularan hacia el siguiente daily. En tercer lugar, la rotación de la palabra en orden alfabético del nombre de pila funcionó bien como mecanismo neutral, evitando discusiones sobre quién comienza la ronda.

## Documentos relacionados

Para revisar el detalle de cada tarea comprometida durante el sprint y su estado al cierre, dirigirse al archivo sprint_backlog_sprint2.md. Para conocer la estimación específica por tarea e integrante, consultar estimacion_compromiso_sprint2.md. Para acceder a los entregables técnicos generados, revisar entregables_tecnicos_sprint2.md. Para los resultados finales del sprint, ver resultados_sprint2.md. Para la presentación formal al stakeholder y la retroalimentación obtenida, dirigirse a sprint_review_sprint2.md, mientras que las reflexiones internas del equipo se encuentran en sprint_retrospective_sprint2.md.
