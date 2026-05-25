# Resultados del Sprint 2 — mediCampo v2

Este documento sintetiza los resultados efectivamente obtenidos durante el Sprint 2 del proyecto mediCampo v2, junto con la evidencia que respalda el cumplimiento de los compromisos adquiridos al inicio del periodo. Forma parte de la fase 3 del marco Scrum, conocida como revisión, y constituye la base argumental sobre la cual el equipo posteriormente realiza la Sprint Review formal frente a la cátedra. El propósito principal es dejar constancia clara de qué se entregó, cómo se verificó cada entregable y en qué estado quedó la plataforma al cierre del periodo, contrastando lo planificado con lo efectivamente alcanzado.

## Síntesis ejecutiva del Sprint 2

El Sprint 2 cerró cumpliendo de manera satisfactoria su objetivo principal, esto es, habilitar el ciclo completo de acceso y agendamiento de teleconsultas dentro de la plataforma mediCampo v2, permitiendo que un paciente rural se registre, inicie sesión, reserve una consulta y, junto con su médico, ingrese a la sala de videollamada que ya había sido construida durante el Sprint 1. De las diecisiete tareas técnicas comprometidas inicialmente, el equipo logró cerrar quince dentro del periodo, dejando dos pendientes como mejoras incrementales que se trasladaron al Sprint 3 sin afectar el funcionamiento general del flujo.

A nivel de productos entregados, el sprint produjo dos piezas verificables y demostrables. El Producto-1 corresponde al módulo de autenticación con registro, inicio de sesión, persistencia de sesión y protección de rutas por rol. El Producto-2 corresponde al módulo de reserva de teleconsultas con aceptación o rechazo por parte del médico y habilitación del botón de ingreso a la videollamada en ambas vistas. Ambos productos quedaron integrados con el componente de videollamada construido previamente, cerrando el flujo end-to-end de la consulta médica virtual.

## Resultados detallados por historia de usuario

A continuación se presenta el detalle de los resultados obtenidos para cada una de las dos historias de usuario abordadas durante el sprint, junto con los criterios de aceptación verificados y la evidencia técnica que sustenta cada uno.

### Resultados de la HU3 — Registro e inicio de sesión

La historia HU3 quedó completada en sus aspectos centrales, con los siete tareas técnicas comprometidas terminadas y todos los criterios de aceptación principales verificados durante la demostración interna y externa. La autenticación funciona correctamente para los tres roles del sistema, esto es, PATIENT, DOCTOR y ADMIN, aunque actualmente los médicos y administradores solo pueden ser creados mediante el script seed.ts, situación que se planificó como mejora para el Sprint 3.

Criterios de aceptación verificados durante el sprint:

El sistema permite el registro de un nuevo usuario completando los campos nombre completo, RUT, correo electrónico y contraseña, validando que tanto el correo como el RUT sean únicos en la base de datos. Esto se verificó intentando registrar dos veces el mismo correo, obteniendo el mensaje de error esperado desde el backend.

La contraseña se almacena cifrada con bcryptjs y salt de diez rondas, garantizando que aún ante una filtración del contenido de la base no quede expuesta en texto plano. Esto se verificó inspeccionando directamente la tabla User en la base de datos de DigitalOcean, donde el campo password aparece como un hash bcrypt y no como el texto original.

El sistema genera un token JWT firmado al iniciar sesión, conteniendo el identificador del usuario, su rol y su nombre. Esto se verificó decodificando el token retornado por el endpoint /api/auth/login en jwt.io, observando que el payload contiene las claves sub, role y name con los valores correctos.

El frontend persiste el token y el usuario en localStorage bajo las claves medicampo_token y medicampo_user, permitiendo que la sesión sobreviva a recargas del navegador. Esto se verificó recargando la página tras iniciar sesión, comprobando que el usuario permanece autenticado y que el dashboard correspondiente al rol se renderiza inmediatamente.

Las rutas protegidas redirigen al login si el token no existe o si el rol no coincide con el requerido por la vista solicitada. Esto se verificó intentando acceder a /dashboard-medico con una sesión de paciente, observando la redirección automática hacia la página principal o el login según corresponda.

Tareas pendientes derivadas al Sprint 3:

La creación de cuentas de médico desde el panel administrativo quedó pendiente, dado que actualmente los profesionales solo pueden ser cargados mediante el script seed.ts. El equipo decidió postergar esta funcionalidad considerando que dependía de la consolidación previa de la HU3 y que abrir ese frente en paralelo aumentaba el riesgo de retrabajo.

### Resultados de la HU4 — Reserva de teleconsulta con aceptación e ingreso a la videollamada

La historia HU4 quedó completada en sus aspectos críticos, con las diez tareas técnicas comprometidas terminadas y todos los criterios de aceptación esenciales verificados durante la demostración. El paciente puede reservar una cita, el médico puede aceptarla o rechazarla, ambos pueden ingresar a la videollamada cuando la cita está confirmada y el sistema mantiene la trazabilidad completa de la cita en la base de datos. Las dos mejoras pendientes corresponden a la validación estricta de choques de horarios y a la obtención dinámica de los bloques horarios desde la base de datos.

Criterios de aceptación verificados durante el sprint:

El paciente accede al módulo de reserva desde su dashboard mediante el botón Agendar Teleconsulta, ve la lista real de médicos obtenida desde el endpoint GET /api/appointments/doctors junto con su especialidad. Esto se verificó observando que la lista renderizada en ReservaCita.tsx coincide con los registros de la tabla User filtrados por rol DOCTOR en la base de datos.

Al confirmar la reserva mediante el botón Confirmar Reserva, el sistema crea un registro en la tabla Appointment con estado PENDING y genera un meetingLink único usando Math.random().toString(36).substring(7), almacenando el enlace en la base. Esto se verificó inspeccionando la tabla Appointment tras una reserva exitosa, observando el registro nuevo con el campo status en PENDING, el campo meetingLink con el formato /room/[hash] y la fecha y hora correctas.

El paciente recibe una pantalla de confirmación visual donde se le indica que el médico debe aceptar la solicitud antes de habilitar el botón de ingreso. Esto se verificó observando que tras presionar Confirmar Reserva aparece la pantalla con el ícono CheckCircle2 en verde, el mensaje Solicitud Enviada y la nota informativa Podrás entrar una vez el médico acepte la cita.

El médico, al iniciar sesión, accede a su dashboard donde encuentra la sección de Solicitudes Pendientes con todas las citas que le han sido asignadas en estado PENDING. Esto se verificó iniciando sesión como un médico al cual se le había agendado una cita desde el paciente, observando que efectivamente aparece en la lista correspondiente con el nombre del paciente, la fecha y la hora.

Al aceptar una solicitud, el sistema envía PATCH /api/appointments/:id/status con el valor CONFIRMED, actualizando el estado en la base de datos. Esto se verificó presionando el botón verde de aceptación y comprobando que la cita desaparece de Solicitudes Pendientes y aparece en Próximas Citas Confirmadas o en Consultas de Hoy según la fecha.

Al aceptar una cita programada para el día actual, el sistema despliega un cuadro de diálogo nativo preguntando si el médico desea ingresar de inmediato a la sala. Esto se verificó programando una cita para el día actual desde el lado del paciente y luego aceptándola desde el lado del médico, observando que efectivamente aparece el cuadro de diálogo del navegador con el mensaje esperado.

El paciente, una vez su cita ha sido confirmada por el médico, ve actualizada la tarjeta correspondiente en su dashboard, cambiando el badge amarillo de Esperando Médico por uno verde de Confirmada junto con el botón Ingresar a la Sala. Esto se verificó refrescando el dashboard del paciente tras la aceptación, observando que efectivamente el badge cambió de color y apareció el botón de ingreso.

Ambos usuarios convergen en la misma sala identificada por el meetingLink único almacenado en la base. Esto se verificó simulando la entrada simultánea desde dos navegadores distintos (uno con la sesión del médico y otro con la sesión del paciente), comprobando que ambos llegan al componente Videollamada.tsx con el mismo roomId y pueden verse y escucharse mutuamente.

Tareas pendientes derivadas al Sprint 3:

La validación estricta de choques de horarios entre citas del mismo médico quedó pendiente. Actualmente el sistema permite crear dos citas con el mismo médico en el mismo horario, situación que se debe corregir agregando una verificación previa en AppointmentService.createAppointment.

La obtención dinámica de los bloques horarios desde la base de datos también quedó pendiente. Actualmente los seis bloques disponibles (09:00, 10:00, 11:30, 14:00, 15:30 y 17:00) están hardcodeados en el frontend, situación que se debe corregir creando un modelo de disponibilidad por médico en Prisma.

## Evidencia del Producto-1 — Módulo de Autenticación

El Producto-1 quedó representado por el conjunto de componentes y endpoints que habilitan el registro e inicio de sesión de los usuarios. La evidencia técnica de su funcionamiento se documenta a continuación.

Componentes frontend implementados y operativos:
- frontend/src/components/auth/Login.tsx — pantalla de inicio de sesión con formulario, validaciones, manejo de loading y error, integración con AuthContext.
- frontend/src/components/auth/Register.tsx — pantalla de registro con formulario, validaciones, auto-login posterior al registro.
- frontend/src/context/AuthContext.tsx — contexto global con persistencia en localStorage, métodos login y logout, restauración de sesión.
- frontend/src/App.tsx — enrutador principal con RoleRoute como guardián de rutas según el rol del usuario.

Endpoints backend implementados y operativos:
- POST /api/auth/register — validación de duplicados, cifrado con bcryptjs, persistencia en base.
- POST /api/auth/login — verificación de credenciales con bcrypt.compare, generación de JWT firmado.

Pruebas manuales realizadas y exitosas:
Registro de un nuevo paciente con datos válidos, registro con email duplicado (error esperado), registro con RUT duplicado (error esperado), inicio de sesión con credenciales válidas, inicio de sesión con contraseña incorrecta (error esperado), persistencia de la sesión tras recargar la página, cierre de sesión y limpieza de localStorage, intento de acceso a ruta protegida sin sesión (redirección al login), intento de acceso a ruta protegida con rol incorrecto (redirección a la página principal).

Métricas relevantes del Producto-1:
- Total de archivos modificados o creados: 8 archivos en frontend, 6 archivos en backend, 1 archivo de migración Prisma.
- Total de líneas de código aproximadas: alrededor de 600 líneas considerando frontend y backend.
- Tiempo total invertido: aproximadamente 31 horas distribuidas entre los tres integrantes.

## Evidencia del Producto-2 — Módulo de Reserva y Videollamada

El Producto-2 quedó representado por el conjunto de componentes y endpoints que habilitan la reserva de teleconsultas, la aceptación o rechazo por parte del médico y el ingreso simultáneo de ambas partes a la videollamada. La evidencia técnica de su funcionamiento se documenta a continuación.

Componentes frontend implementados y operativos:
- frontend/src/components/ReservaCita.tsx — pantalla de reserva con tres pasos diferenciados, lista de doctores, selector de fecha y horario, pantalla de confirmación de éxito.
- frontend/src/components/dashboards/DashboardPaciente.tsx — dashboard con citas próximas, badge diferenciado según estado, botón de agendamiento, botón de ingreso a sala.
- frontend/src/components/dashboards/DashboardMedico.tsx — dashboard con cuatro secciones (consultas de hoy, solicitudes pendientes, próximas citas, atenciones recientes), botones de aceptación y rechazo.
- frontend/src/components/Videollamada.tsx — componente preexistente del Sprint 1 que recibe a ambos usuarios en la sala correcta gracias al meetingLink.

Endpoints backend implementados y operativos:
- POST /api/appointments/book — creación de cita con meetingLink único.
- GET /api/appointments/doctors — listado de profesionales disponibles.
- GET /api/appointments/my-appointments — citas del usuario autenticado filtradas por rol.
- PATCH /api/appointments/:id/status — actualización del estado de la cita con validación de propiedad.

Pruebas manuales realizadas y exitosas:
Reserva exitosa de una cita con fecha futura, reserva exitosa de una cita para el día actual, visualización de la cita con badge PENDING en el dashboard del paciente, visualización de la solicitud en el dashboard del médico, aceptación de la solicitud por el médico, cambio del badge a CONFIRMED en el dashboard del paciente, ingreso del paciente a la sala mediante el botón Ingresar a la Sala, ingreso del médico a la sala mediante el botón Iniciar (para citas de hoy), encuentro simultáneo de ambos usuarios dentro de la misma sala, rechazo de una solicitud por parte del médico, cambio del estado a CANCELLED y eliminación de la cita de la sección de próximas en el dashboard del paciente.

Métricas relevantes del Producto-2:
- Total de archivos modificados o creados: 4 archivos en frontend, 8 archivos en backend, 1 archivo de migración Prisma.
- Total de líneas de código aproximadas: alrededor de 1100 líneas considerando frontend y backend.
- Tiempo total invertido: aproximadamente 48 horas distribuidas entre los tres integrantes.

## Estado de la base de datos al cierre del sprint

Al finalizar el sprint, la base de datos PostgreSQL en DigitalOcean contiene los siguientes datos generados durante el periodo, considerando tanto los registros del seed como los creados durante las pruebas manuales.

En la tabla User existen los registros iniciales del seed, esto es, un usuario ADMIN con credenciales de prueba, tres usuarios DOCTOR distribuidos entre las especialidades de Medicina General, Cardiología y Pediatría, junto con varios usuarios PATIENT registrados durante las pruebas. Todos los registros poseen el campo password cifrado, los timestamps createdAt y updatedAt correctamente seteados, y el rol asignado según corresponda.

En la tabla Specialty existen las tres especialidades iniciales, cada una con su id autoincremental y su nombre único, asociadas a los doctores correspondientes mediante la relación nominal.

En la tabla Appointment existen los registros generados durante las pruebas, distribuidos entre los estados PENDING, CONFIRMED, COMPLETED y CANCELLED, cada uno con su meetingLink único, sus campos patientId y doctorId apuntando correctamente a las relaciones nominales DoctorAppointments y PatientAppointments, y los timestamps correctos.

## Métricas globales del Sprint 2

A nivel agregado, el Sprint 2 produjo las siguientes métricas que sirven como referencia para futuros sprints.

Total de tareas técnicas comprometidas inicialmente: 17.
Total de tareas técnicas completadas dentro del periodo: 15.
Total de tareas técnicas diferidas al Sprint 3: 2.
Porcentaje de cumplimiento del Sprint Backlog: aproximadamente 88 por ciento.
Total de historias de usuario completadas: 2 (HU3 con un pendiente menor y HU4 con dos pendientes menores).
Total de horas estimadas inicialmente: 79 horas.
Capacidad total estimada del equipo: 90 horas.
Margen disponible al iniciar: 11 horas.
Margen efectivamente utilizado en imprevistos: aproximadamente 8 horas.

## Validación del cumplimiento del Objetivo del Sprint

Para verificar formalmente el cumplimiento del objetivo del sprint, el equipo ejecutó una validación de extremo a extremo durante la última semana del periodo, simulando el flujo completo desde la perspectiva de un usuario externo. La validación consistió en los siguientes pasos secuenciales.

Paso uno: se registró un nuevo paciente con datos ficticios desde la pantalla de Register.tsx, comprobando que el sistema lo creó correctamente y lo dejó autenticado sin necesidad de un nuevo login. Resultado: exitoso.

Paso dos: se navegó al DashboardPaciente.tsx, comprobando que no hay citas iniciales y que el botón Agendar Teleconsulta está visible y operativo. Resultado: exitoso.

Paso tres: se accedió a ReservaCita.tsx, se seleccionó un médico, una fecha futura y un horario disponible, y se confirmó la reserva. Resultado: exitoso, con la pantalla de confirmación visible y la cita creada en la base de datos.

Paso cuatro: se cerró la sesión del paciente, se inició sesión como el médico al cual se le había hecho la reserva, comprobando que la cita aparece en la sección de Solicitudes Pendientes del DashboardMedico.tsx. Resultado: exitoso.

Paso cinco: se aceptó la solicitud mediante el botón verde de aceptación, comprobando que la cita pasa a la sección correspondiente según su fecha (Consultas de Hoy o Próximas Citas Confirmadas). Resultado: exitoso.

Paso seis: se cerró la sesión del médico, se inició nuevamente sesión como el paciente, comprobando que el badge de la cita cambió a Confirmada y apareció el botón Ingresar a la Sala. Resultado: exitoso.

Paso siete: ambas sesiones (paciente y médico) ingresaron simultáneamente a la sala desde dos navegadores distintos, comprobando que se encuentran dentro del mismo LiveKitRoom, se ven y se escuchan mutuamente. Resultado: exitoso, con video y audio bidireccionales funcionando correctamente.

La validación cubrió todos los pasos críticos del flujo, confirmando que el objetivo del sprint quedó plenamente alcanzado.

## Documentos relacionados

Para profundizar en el detalle de cada tarea técnica completada, consultar sprint_backlog_sprint2.md. Para la planificación previa y la justificación de los productos seleccionados, dirigirse a sprint_planning_sprint2.md. Para la presentación formal del trabajo a la cátedra y la retroalimentación obtenida, ver sprint_review_sprint2.md. Para las reflexiones internas del equipo sobre el proceso y las oportunidades de mejora identificadas, consultar sprint_retrospective_sprint2.md.
