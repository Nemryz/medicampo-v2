# Estimación y Compromiso de las Historias de Usuario del Sprint 2 — mediCampo v2

Este documento desglosa cada una de las tareas necesarias para completar las historias de usuario HU3 y HU4 dentro del Sprint 2, junto con la estimación de esfuerzo en horas por tarea y la asignación nominal del responsable principal. El propósito es dejar registro detallado del compromiso adquirido por cada integrante del equipo, así como facilitar la trazabilidad del cumplimiento durante el periodo de trabajo, considerando además que el equipo está conformado por tres personas, a saber, Vicente Ramirez, James Honeymann e Ignacio Ampuero.

## Marco general de la estimación

La técnica utilizada para estimar el esfuerzo fue una versión simplificada del Planning Poker, donde cada integrante propuso una estimación inicial en horas para cada tarea, luego se discutieron las diferencias relevantes y, finalmente, se acordó una cifra de consenso. Las estimaciones consideran el tiempo efectivo de codificación, las pruebas manuales en el navegador y la integración con las piezas existentes, pero excluyen las pausas, las reuniones formales del equipo y los tiempos muertos asociados a cambios de contexto entre asignaturas.

Para la asignación de responsables se siguió un criterio mixto, donde se respetó la afinidad técnica natural de cada integrante con ciertas áreas del proyecto, pero también se distribuyó el trabajo de manera equitativa para evitar cuellos de botella en una sola persona. Es importante destacar que el responsable principal es quien lidera y entrega la tarea, pero los otros dos integrantes participan como apoyo técnico cuando se requiere, ya sea en revisiones de código, pruebas conjuntas o resolución de bloqueos puntuales.

## Capacidad disponible por integrante

Cada uno de los tres miembros del equipo cuenta con una disponibilidad similar dentro del periodo del sprint, compuesta por los dos bloques formales de clase y los espacios de trabajo individual fuera del aula. A continuación se describe la capacidad estimada por persona, tomando como referencia un sprint de cuatro semanas.

Vicente Ramirez aporta aproximadamente treinta horas durante el sprint, distribuidas entre los bloques de clase del martes y viernes, las sesiones individuales en su tiempo libre y las coordinaciones grupales que se realicen por mensajería instantánea.

James Honeymann aporta aproximadamente treinta horas durante el sprint, manteniendo la misma distribución que su compañero, con foco principal en las sesiones de programación pareada para la capa backend y las migraciones de la base de datos.

Ignacio Ampuero aporta aproximadamente treinta horas durante el sprint, sumando además algunas horas adicionales fuera del horario académico para la administración del servidor de LiveKit en DigitalOcean y la coordinación general del equipo en su rol de Scrum Master ad-hoc.

La capacidad total estimada del equipo asciende, por consiguiente, a unas noventa horas conjuntas durante las cuatro semanas del Sprint 2.

## Estimación detallada de la HU3 — Registro e inicio de sesión

A continuación se presenta el desglose de las siete tareas técnicas comprometidas para la historia HU3, junto con la estimación de esfuerzo, la asignación de responsable principal y una breve nota sobre el alcance de cada una.

### T03.1 — Modelo Prisma de la entidad User con roles

Esta tarea requería definir el esquema declarativo del modelo User en el archivo backend/prisma/schema.prisma, incluyendo todos los campos necesarios para soportar la autenticación y la diferenciación por roles, así como ejecutar la migración correspondiente en la base de datos PostgreSQL. El esfuerzo estimado fue de cuatro horas, contemplando tanto la escritura del esquema como la verificación de la sincronización con la base remota.

Responsable principal: James Honeymann.
Estimación: 4 horas.
Estado al cierre del sprint: completada.

### T03.2 — Endpoint POST /api/auth/register

Esta tarea consistía en implementar el endpoint de registro, junto con su validación de duplicados de email y RUT, el cifrado de la contraseña usando bcryptjs con un salt de diez rondas y la persistencia del nuevo usuario en la base de datos. Se incluyó además la separación de responsabilidades entre authController.ts y AuthService.ts.

Responsable principal: James Honeymann.
Estimación: 5 horas.
Estado al cierre del sprint: completada.

### T03.3 — Endpoint POST /api/auth/login con generación de JWT

Esta tarea cubría la implementación del endpoint de inicio de sesión, la comparación segura de contraseñas con bcrypt.compare, la generación del token JWT firmado con la clave secreta del servidor y el retorno tanto del token como del objeto usuario al cliente. La configuración del JWT quedó centralizada en backend/src/config/jwt.ts.

Responsable principal: James Honeymann.
Estimación: 4 horas.
Estado al cierre del sprint: completada.

### T03.4 — Interfaz de Login.tsx

Esta tarea cubrió el diseño y la implementación del formulario de inicio de sesión, con su validación de campos, el manejo de los estados de loading y error, junto con la integración con el AuthContext para iniciar la sesión tras una respuesta exitosa del backend. El diseño visual incluyó los gradientes con TailwindCSS, el ícono de HeartPulse y los efectos de focus para los inputs.

Responsable principal: Vicente Ramirez.
Estimación: 6 horas.
Estado al cierre del sprint: completada.

### T03.5 — Interfaz de Register.tsx

Esta tarea consistía en construir el formulario de registro con los cuatro campos requeridos, esto es, nombre completo, RUT, correo electrónico y contraseña, junto con la lógica de auto-login posterior al registro exitoso. El diseño mantuvo coherencia visual con la pantalla de login, utilizando los mismos componentes de Lucide React y los mismos patrones de TailwindCSS.

Responsable principal: Vicente Ramirez.
Estimación: 6 horas.
Estado al cierre del sprint: completada.

### T03.6 — AuthContext con persistencia en localStorage

Esta tarea cubrió la implementación del contexto global de autenticación en React, persistiendo el token y el usuario en localStorage bajo las claves medicampo_token y medicampo_user, restaurando la sesión al cargar la aplicación y exponiendo los métodos login y logout al resto de la SPA.

Responsable principal: Ignacio Ampuero.
Estimación: 3 horas.
Estado al cierre del sprint: completada.

### T03.7 — RoleRoute como guardián de rutas

Esta tarea consistía en construir el componente de envoltura RoleRoute en App.tsx, que verifica el rol del usuario autenticado antes de permitirle navegar a las vistas restringidas, redirigiendo al login o a la página principal cuando el rol no coincide con el requerido.

Responsable principal: Ignacio Ampuero.
Estimación: 3 horas.
Estado al cierre del sprint: completada.

Subtotal de horas estimadas para la HU3: 31 horas.

## Estimación detallada de la HU4 — Reserva de teleconsulta

A continuación se presenta el desglose de las diez tareas técnicas comprometidas para la historia HU4, manteniendo el mismo formato de presentación que en la sección anterior.

### T04.1 — Modelos Prisma de Specialty y Appointment

Esta tarea cubrió la definición de los esquemas declarativos para las entidades Specialty y Appointment, incluyendo las relaciones nominales DoctorAppointments y PatientAppointments que permiten búsquedas bidireccionales eficientes, junto con la migración a la base de datos.

Responsable principal: James Honeymann.
Estimación: 5 horas.
Estado al cierre del sprint: completada.

### T04.2 — Endpoint POST /api/appointments/book

Esta tarea consistía en construir el endpoint de creación de cita, incluyendo la generación del meetingLink único, la asignación del estado PENDING por defecto y la persistencia del registro en la tabla Appointment, todo dentro del patrón Service-Repository.

Responsable principal: James Honeymann.
Estimación: 5 horas.
Estado al cierre del sprint: completada.

### T04.3 — Endpoint GET /api/appointments/doctors

Esta tarea cubrió la implementación del endpoint que retorna la lista de profesionales con rol DOCTOR junto con su especialidad anidada, alimentando así la grilla de selección del paciente en el componente de reserva.

Responsable principal: James Honeymann.
Estimación: 3 horas.
Estado al cierre del sprint: completada.

### T04.4 — Endpoint GET /api/appointments/my-appointments

Esta tarea consistía en construir el endpoint que retorna las citas del usuario autenticado, filtrando por rol de modo que el paciente vea las suyas y el médico vea las que le fueron asignadas, con todos los datos relacionados de la contraparte.

Responsable principal: Ignacio Ampuero.
Estimación: 4 horas.
Estado al cierre del sprint: completada.

### T04.5 — Endpoint PATCH /api/appointments/:id/status

Esta tarea cubrió el endpoint de actualización del estado de la cita, junto con la validación de propiedad mediante appointmentRepository.findByIdAndDoctor, asegurando que un médico solo pudiera cambiar el estado de las citas que le pertenecen.

Responsable principal: Ignacio Ampuero.
Estimación: 4 horas.
Estado al cierre del sprint: completada.

### T04.6 — Componente ReservaCita.tsx

Esta tarea consistía en construir la interfaz de reserva del paciente, con el layout dividido en tres pasos diferenciados visualmente, la lista de especialistas obtenida desde la API, el selector de fecha con input nativo, la cuadrícula de horarios disponibles, junto con la pantalla de confirmación de éxito.

Responsable principal: Vicente Ramirez.
Estimación: 8 horas.
Estado al cierre del sprint: completada.

### T04.7 — Componente DashboardMedico.tsx

Esta tarea cubrió la construcción del dashboard del médico, con sus cuatro secciones diferenciadas, esto es, las consultas del día, las solicitudes pendientes, las próximas citas confirmadas y las atenciones recientes, junto con la lógica de aceptación o rechazo de solicitudes y el cuadro de diálogo de ingreso inmediato a la sala.

Responsable principal: Vicente Ramirez.
Estimación: 8 horas.
Estado al cierre del sprint: completada.

### T04.8 — Componente DashboardPaciente.tsx

Esta tarea consistía en construir el dashboard del paciente, mostrando sus citas próximas con diseño diferenciado según el estado, el botón de agendamiento y el acceso al historial clínico de las consultas pasadas.

Responsable principal: Vicente Ramirez.
Estimación: 6 horas.
Estado al cierre del sprint: completada.

### T04.9 — Generación del meetingLink único

Esta tarea cubrió la integración de la lógica de generación del meetingLink dentro del AppointmentService, usando la combinación de Math.random con toString(36) y substring(7), asegurando la unicidad del identificador para la sala de LiveKit asociada.

Responsable principal: Ignacio Ampuero.
Estimación: 2 horas.
Estado al cierre del sprint: completada.

### T04.10 — Navegación al meetingLink desde los dashboards

Esta tarea consistía en cablear los botones de ingreso a la sala tanto en el dashboard del paciente como en el del médico, usando useNavigate de react-router-dom para redirigir al componente Videollamada.tsx con el roomId derivado del meetingLink almacenado en la base de datos.

Responsable principal: Ignacio Ampuero.
Estimación: 3 horas.
Estado al cierre del sprint: completada.

Subtotal de horas estimadas para la HU4: 48 horas.

## Resumen de carga por integrante

A continuación se sintetiza la carga total estimada por integrante, sumando las horas comprometidas en ambas historias de usuario.

Vicente Ramirez asumió un total de 28 horas estimadas, concentradas principalmente en el frontend, con las tareas T03.4, T03.5, T04.6, T04.7 y T04.8, todas relacionadas con la construcción de los componentes visuales y la integración del flujo de reserva.

James Honeymann asumió un total de 26 horas estimadas, concentradas principalmente en el backend de autenticación y la capa de datos, con las tareas T03.1, T03.2, T03.3, T04.1, T04.2 y T04.3, todas relacionadas con los modelos Prisma y los endpoints REST.

Ignacio Ampuero asumió un total de 25 horas estimadas, distribuidas entre la infraestructura de autenticación, los endpoints de cita más sensibles y la integración con el componente de videollamada existente, con las tareas T03.6, T03.7, T04.4, T04.5, T04.9 y T04.10. Adicionalmente, dedicó tiempo extra a la coordinación del equipo como Scrum Master ad-hoc, así como al mantenimiento del servidor LiveKit en DigitalOcean.

El total de horas estimadas comprometidas asciende a 79 horas, dejando un margen de aproximadamente 11 horas frente a la capacidad total del equipo de 90 horas, lo cual permitía absorber imprevistos sin comprometer el cierre del sprint.

## Compromiso individual del equipo

Cada integrante manifestó de forma explícita su compromiso con las tareas asignadas, así como con los plazos acordados. Los compromisos quedaron registrados de la siguiente manera para que sirvieran como referencia durante todo el sprint.

Vicente Ramirez se comprometió a terminar las pantallas de Login y Register dentro de la primera semana, los dashboards de paciente y médico en la segunda y tercera semana, junto con el componente de reserva en la tercera semana, dejando la cuarta semana para pulir detalles visuales, ajustes de responsive design y revisiones de accesibilidad.

James Honeymann se comprometió a tener los modelos Prisma y los endpoints de autenticación funcionando durante la primera semana, los endpoints de citas en la segunda semana y, asimismo, apoyar a sus compañeros en la integración frontend-backend durante la tercera y cuarta semana, asistiendo a las revisiones técnicas que fueran necesarias.

Ignacio Ampuero se comprometió a entregar el AuthContext y el RoleRoute durante la primera semana, los endpoints de citas más sensibles en la segunda semana, las integraciones con el componente de videollamada existente en la tercera semana y, además, mantener el servidor de LiveKit operativo durante todo el periodo. En su rol de coordinador, también se comprometió a moderar las reuniones diarias y a llevar el registro de los acuerdos en el documento daily_scrum_sprint2.md.

## Riesgos identificados y planes de mitigación

Durante la sesión de estimación se identificaron tres riesgos principales que podrían afectar el cumplimiento del sprint, junto con sus respectivos planes de mitigación.

El primer riesgo es la coincidencia con periodos de evaluaciones de otras asignaturas, lo cual podría reducir la disponibilidad efectiva de algún integrante en alguna semana específica. El plan de mitigación es la flexibilidad en el reordenamiento de tareas según la carga semanal real, permitiendo que un integrante adelante trabajo en semanas más libres y otro compense después.

El segundo riesgo es la dependencia entre el frontend y el backend, dado que los componentes visuales no pueden integrarse hasta que los endpoints estén disponibles. El plan de mitigación es priorizar la construcción de los modelos Prisma y los endpoints durante la primera semana, de modo que el frontend tenga datos reales con los cuales trabajar desde la segunda semana, evitando el bloqueo por mocks intermedios.

El tercer riesgo es la complejidad de la integración con el componente de videollamada existente, especialmente en lo relativo al manejo del meetingLink y la navegación al roomId correcto. El plan de mitigación es la asignación de las tareas T04.9 y T04.10 al integrante con mayor familiaridad con LiveKit, esto es, Ignacio Ampuero, junto con sesiones de programación pareada con Vicente Ramirez para asegurar la consistencia entre el backend y el frontend.

## Documentos relacionados

Para revisar el contenido completo del Sprint Backlog construido tras esta planificación, dirigirse al archivo sprint_backlog_sprint2.md. Para conocer el detalle de las reuniones diarias realizadas durante el sprint y los acuerdos tomados, consultar el documento daily_scrum_sprint2.md. Para revisar los resultados finales obtenidos y la evidencia de los productos entregados, dirigirse a resultados_sprint2.md y entregables_tecnicos_sprint2.md.
