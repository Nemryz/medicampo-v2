# Análisis de Roles — mediCampo v2

Este documento describe en detalle los tres roles de usuario del sistema mediCampo v2, sus responsabilidades, permisos, restricciones y la forma en que cada rol está implementado técnicamente en el código. El análisis cubre desde la representación en la base de datos hasta la capa de interfaz de usuario.

---

## Definición de roles en el sistema

El sistema define tres roles de usuario que determinan qué acciones puede ejecutar cada persona y qué información puede visualizar. Los roles son: PATIENT (paciente), DOCTOR (médico) y ADMIN (administrador). Estos valores están almacenados como strings en el campo role del modelo User en la base de datos PostgreSQL.

La asignación de roles sigue las siguientes reglas:
Cualquier persona que se registra a través del formulario público de registro recibe el rol PATIENT por defecto. Este comportamiento está definido en el modelo User de schema.prisma con la directiva @default("PATIENT") y en el método register del AuthService que no acepta el campo role del cuerpo de la petición.

Las cuentas con rol DOCTOR y ADMIN solo pueden ser creadas mediante el script seed en backend/prisma/seed.ts o mediante intervención directa en la base de datos. Esta restricción es intencional para evitar que cualquier usuario pueda auto-asignarse el rol de médico o administrador.

---

## Rol PATIENT — Paciente

El paciente es el usuario final del servicio de telemedicina. Tiene acceso a las funcionalidades orientadas a recibir atención médica, sin poder gestionar otros usuarios ni ver datos ajenos.

Capacidades del rol PATIENT:

Registro e inicio de sesión: puede registrarse mediante el formulario público con sus datos personales. Su contraseña es hasheada con bcryptjs antes de almacenarse. Puede iniciar sesión y recibir un JWT con su información de rol.

Reserva de teleconsulta: puede acceder a la ruta /reserva que está protegida por RoleRoute con el rol PATIENT. Puede ver la lista de médicos disponibles consultando GET /api/appointments/doctors. Puede crear una cita enviando POST /api/appointments/book con el doctorId y la fecha seleccionada. La cita queda en estado PENDING hasta que el médico la confirme.

Visualización de su agenda: el Dashboard del Paciente en DashboardPaciente.tsx llama a GET /api/appointments/my-appointments con el token JWT. El backend filtra las citas por patientId igual al id del usuario autenticado (extraído del campo sub del JWT). El paciente solo ve sus propias citas, nunca las de otros pacientes.

Acceso a la videollamada: cuando una cita está en estado CONFIRMED, el botón "Ingresar a la Sala" en DashboardPaciente.tsx navega al meetingLink de la cita (/room/:roomId). El componente Videollamada.tsx solicita un token a LiveKit. El LiveKitService verifica que el userId del JWT autenticado coincida con el patientId o doctorId de la cita asociada a esa sala. Si no coincide, devuelve error 403 y el paciente no puede entrar.

Visualización del historial clínico: puede acceder a /historial que muestra sus atenciones completadas. Puede ver el detalle de cada consulta con el diagnóstico y la receta. El endpoint GET /api/clinical/patient/:patientId verifica que si el rol es PATIENT, el requesterId sea igual al patientId solicitado. El paciente no puede ver el historial de otro paciente.

Restricciones del rol PATIENT:
No puede acceder a /dashboard-medico ni a /admin. RoleRoute en App.tsx redirige a la raíz si el rol no coincide. No puede guardar fichas clínicas; el endpoint POST /api/clinical/:appointmentId verifica en ClinicalService que la cita tenga al doctorId igual al usuario autenticado, y como el paciente tiene un patientId distinto, la verificación falla con error 403. No puede cambiar el estado de una cita; el endpoint PATCH /api/appointments/:id/status verifica que el userId autenticado sea el doctorId de la cita. No puede ver las estadísticas del sistema; el endpoint GET /api/clinical/admin/stats verifica explícitamente que el rol sea ADMIN.

Experiencia de interfaz diferenciada:
En Videollamada.tsx, la condición user.role === 'DOCTOR' determina qué se renderiza en el panel lateral. El paciente ve el nombre, inicial del médico como avatar y la especialidad, más una nota informativa sobre el cifrado de la llamada. No ve el formulario de ficha clínica.

---

## Rol DOCTOR — Médico

El médico es el profesional de salud que atiende a los pacientes. Tiene capacidades adicionales sobre la gestión de sus citas y es el único rol autorizado para escribir fichas clínicas.

Capacidades del rol DOCTOR:

Visualización de su agenda: el Dashboard del Médico en DashboardMedico.tsx llama al mismo endpoint GET /api/appointments/my-appointments. AppointmentRepository.findByUserId filtra por doctorId cuando el rol es DOCTOR. El médico ve cuatro secciones diferenciadas: consultas confirmadas para hoy, solicitudes pendientes de aprobación, próximas citas confirmadas para fechas futuras y atenciones completadas recientes.

Aprobación y rechazo de citas: el médico puede enviar PATCH /api/appointments/:id/status con el cuerpo { status: "CONFIRMED" } o { status: "CANCELLED" }. AppointmentService.updateAppointmentStatus verifica que exista un appointment con ese id y ese doctorId. Si el médico intenta cambiar el estado de una cita que no le pertenece, recibe error 403. La acción de aceptar genera adicionalmente un window.confirm en el frontend si la cita es para el día actual, ofreciendo navegación directa a la sala.

Registro del historial clínico: el médico puede abrir el formulario de ficha clínica en el panel lateral de Videollamada.tsx. Al enviar el formulario, POST /api/clinical/:appointmentId ejecuta ClinicalService.saveClinicalRecord que verifica doble autorización: primero que el appointmentId tenga un doctorId igual al userId autenticado (en AppointmentRepository.findByIdAndDoctor), y luego guarda o actualiza el registro con upsert. Este doble control garantiza que ningún médico pueda escribir la ficha de una cita que no le corresponde.

Visualización del historial de sus pacientes: puede acceder a /historial/:appointmentId para ver el detalle de las atenciones de sus pacientes. El control de acceso en ClinicalService.getPatientHistory no restringe a los DOCTOR, solo a los PATIENT.

Restricciones del rol DOCTOR:
No puede acceder a /dashboard-paciente ni a /admin. No puede reservar citas (la ruta /reserva está restringida a PATIENT). No puede eliminar citas masivamente; el endpoint DELETE /api/appointments/all requiere rol ADMIN.

Experiencia de interfaz diferenciada:
En Videollamada.tsx, el panel lateral renderiza el formulario médico con textareas para diagnosis y prescription. Los campos se ligan al estado formData con onChange y se envían al guardar. Solo el DOCTOR ve el nombre completo y RUT del paciente en el panel; el paciente ve el nombre y especialidad del médico.

---

## Rol ADMIN — Administrador

El administrador gestiona la operación global de la plataforma. Tiene acceso a estadísticas del sistema y puede ejecutar operaciones de mantenimiento que ningún otro rol puede realizar.

Capacidades del rol ADMIN:

Visualización de estadísticas globales: el endpoint GET /api/clinical/admin/stats está restringido al rol ADMIN mediante la verificación explícita en ClinicalController: if (req.user.role !== 'ADMIN') res.status(403). El dashboard muestra el total de pacientes (countByRole PATIENT), total de médicos (countByRole DOCTOR), total de citas (countAll) y tasa de cumplimiento (completedAppointments / totalAppointments). También muestra el log de las últimas 10 citas con nombres de paciente y médico.

Limpieza del sistema: el endpoint DELETE /api/appointments/all llama a AppointmentService.deleteAllAppointments que verifica role !== 'ADMIN' y lanza AppError 403 si no corresponde. Si el rol es correcto, ejecuta prisma.appointment.deleteMany() sin condición, eliminando todos los registros de citas del sistema.

Visualización del historial: puede acceder a /historial para ver el historial clínico de cualquier paciente mediante /historial/:appointmentId. La verificación en ClinicalService.getPatientHistory permite el acceso a roles distintos de PATIENT.

Restricciones del rol ADMIN:
No puede escribir fichas clínicas; la verificación en ClinicalService.saveClinicalRecord comprueba que el userId sea el doctorId de la cita, lo que un administrador nunca sería. No puede entrar a salas de videollamada de citas que no le pertenecen; LiveKitService verifica que el userId sea patientId o doctorId. No puede crear cuentas de médico desde la interfaz (esta funcionalidad está pendiente de implementación).

---

## Control de acceso multicapa

El sistema implementa control de acceso en tres capas independientes que se complementan para garantizar que cada usuario solo pueda acceder a lo que le corresponde.

Capa 1 — Interfaz de usuario (frontend):
El componente RoleRoute en App.tsx verifica el rol del usuario antes de renderizar la ruta. Si el rol no coincide con el array permitido, redirige con Navigate. Esta capa proporciona la experiencia visual correcta pero no puede ser la única barrera de seguridad, ya que un atacante podría ignorar el frontend.

Capa 2 — Middleware HTTP (backend):
El middleware protect en authMiddleware.ts verifica la firma del JWT en cada petición protegida. Sin token válido, la petición recibe 401 y nunca llega al controlador. Esta capa garantiza que el usuario esté autenticado.

Capa 3 — Lógica de negocio (servicios y repositorios):
Los servicios verifican permisos específicos de operación. AppointmentService.updateAppointmentStatus verifica que el doctorId coincida. ClinicalService.saveClinicalRecord verifica que el appointment pertenezca al médico. ClinicalService.getPatientHistory restringe a PATIENT para ver solo su propio historial. ClinicalController.getAdminStats verifica role === ADMIN. AppointmentService.deleteAllAppointments verifica role === ADMIN. LiveKitService.getAccessToken verifica que el userId sea parte de la cita de la sala solicitada.

Esta arquitectura de tres capas garantiza que incluso si alguien obtuviera un JWT válido de otro usuario del mismo rol, los controles de la capa de negocio impedirían acciones no autorizadas sobre datos ajenos.

---

## Estado de la gestión de roles en el Sprint actual

El siguiente análisis identifica las funcionalidades de gestión de roles que están pendientes de implementación para completar el control de acceso descrito en el backlog original:

Creación de médicos desde el panel de administración: actualmente los médicos solo se pueden crear mediante el script seed. El administrador no tiene un formulario en la interfaz para crear cuentas con rol DOCTOR.

Desactivación de cuentas: no existe un campo isActive o similar en el modelo User. No es posible suspender temporalmente una cuenta sin eliminarla.

Asignación de especialidades desde el panel: el administrador no puede asignar o cambiar la especialidad de un médico desde la interfaz. Esto se hace únicamente a través del seed o modificación directa en la base de datos.

Gestión de disponibilidad del médico: los bloques horarios disponibles para reservar están hardcodeados en ReservaCita.tsx en la función getAvailableTimes. No existe un módulo donde el médico pueda definir sus horarios de atención reales, lo que significa que los pacientes pueden intentar reservar en horarios que el médico no está disponible.

Auditoría de acciones: el modelo de datos no incluye una tabla de logs de auditoría. No se registran en la base de datos las acciones realizadas por los administradores ni los intentos de acceso fallidos.
