# Mapas de Empatía — mediCampo v2

Este documento describe el perfil de cada tipo de usuario de la plataforma mediCampo desde una perspectiva de diseño centrado en la persona. Cada mapa identifica lo que el usuario piensa, siente, dice y hace en el contexto del sistema, así como sus dolores y ganancias esperadas. La información se derivó de los documentos de análisis de roles, el plan estratégico y la evolución de las historias de usuario a lo largo de los dos sprints de desarrollo.

---

## Mapa de Empatía 1 — Paciente Rural

Perfil: Persona que vive en una zona con acceso limitado a centros de salud presenciales. Puede tener baja alfabetización digital. Usa un dispositivo móvil con conexión 4G o WiFi doméstico de baja velocidad. La atención médica presencial implica desplazamientos largos o costosos.

QUE PIENSA Y SIENTE

El paciente siente incertidumbre respecto a si podrá conectarse correctamente a la videollamada. Teme que el médico no se conecte a tiempo o que la llamada se corte sin haber recibido la atención. Le genera ansiedad no saber si su cita fue aceptada o ignorada. Confía más en el sistema cuando ve confirmaciones visuales claras del estado de su solicitud. La idea de tener un documento imprimible de la receta médica le transmite seguridad porque puede presentarlo físicamente en una farmacia o un consultorio secundario.

QUE DICE Y HACE

El paciente selecciona un médico de la lista disponible en el módulo de reserva, elige la fecha y la hora que le acomoda y envía la solicitud. Entra al Dashboard del Paciente para revisar si su cita fue confirmada. Cuando la cita tiene estado CONFIRMED, ve habilitado el botón "Ingresar a la Sala" y hace clic en él. Antes de entrar a la videollamada, pasa por el PreFlightCheck donde comprueba su cámara y micrófono. Durante la consulta, observa el panel lateral derecho que muestra el nombre y especialidad de su médico. Tras la consulta, navega al historial para ver el diagnóstico y la receta, y usa el botón de impresión para guardar el documento.

DOLORES (LO QUE LE FRUSTRA)

El paciente no puede cancelar una cita pendiente por su cuenta si cambia de opinión. Los horarios de atención disponibles son fijos y no reflejan la disponibilidad real del médico, lo que puede llevar a seleccionar un horario que el doctor no puede atender. Si el navegador bloquea la cámara o el micrófono, el mensaje de error técnico no siempre es comprensible para un usuario sin experiencia digital. Cuando la cita está en estado PENDING, el paciente no tiene información sobre cuánto tiempo tardará el médico en responder.

GANANCIAS (LO QUE ESPERA OBTENER)

Acceder a una consulta médica desde su teléfono sin moverse de su zona. Recibir un diagnóstico escrito y una receta que pueda imprimir. Saber en todo momento el estado de su cita mediante badges visuales diferenciados (Esperando Médico en amarillo, Confirmada en verde, Completada en azul). Sentirse seguro al ver el indicador de conexión cifrada durante la videollamada.

COMO LO ATIENDE EL SISTEMA

La pantalla de reserva en ReservaCita.tsx está dividida en tres pasos guiados: selección del especialista, selección de fecha y hora, y confirmación. El badge de estado en DashboardPaciente.tsx usa colores y textos diferenciados para cada estado del ciclo de vida de la cita. El PreFlightCheck en PreFlightCheck.tsx detecta si la cámara fue bloqueada y muestra un mensaje de instrucciones paso a paso para rehabilitar los permisos. La vista de HistorialClinico.tsx genera un reporte con formato de documento médico oficial que es imprimible directamente desde el navegador.

---

## Mapa de Empatía 2 — Médico

Perfil: Profesional de salud que atiende pacientes mediante la plataforma. Puede trabajar desde una clínica rural o desde su casa. Maneja herramientas digitales con mayor fluidez que el paciente promedio. Necesita eficiencia para gestionar múltiples citas sin perder información clínica importante.

QUE PIENSA Y SIENTE

El médico siente la necesidad de tener control sobre su agenda. Le incomoda que los pacientes puedan reservar en cualquier horario sin verificación de disponibilidad real. Valora que pueda revisar el historial del paciente antes de iniciar la consulta. Se preocupa por la privacidad de la información médica que registra durante la llamada. Le importa que el sistema no interrumpa la videollamada mientras completa la ficha clínica.

QUE DICE Y HACE

El médico entra al Dashboard del Médico y revisa la sección de solicitudes pendientes de aprobación. Acepta o rechaza cada cita usando los botones de acción. Cuando acepta una cita programada para el día, el sistema le pregunta si desea entrar a la sala inmediatamente. En la videollamada, abre el panel derecho con la ficha clínica y completa los campos de diagnóstico y prescripción. Al hacer clic en "Finalizar Consulta", los datos se envían al endpoint POST /api/clinical/:appointmentId y la cita cambia automáticamente a estado COMPLETED.

DOLORES (LO QUE LE FRUSTRA)

No puede ver el historial médico completo del paciente desde dentro de la videollamada. El formulario actual solo tiene dos campos visibles (diagnóstico y prescripción) sin los campos de constantes vitales expuestos en la interfaz, aunque el modelo de base de datos los soporta. No puede modificar una ficha clínica guardada si cometió un error. No tiene vista semanal de su agenda; solo ve las citas de hoy y las futuras en grupos separados. Los horarios disponibles para los pacientes están hardcodeados en el frontend sin reflejar su disponibilidad real.

GANANCIAS (LO QUE ESPERA OBTENER)

Gestionar las solicitudes de cita sin necesidad de llamadas telefónicas. Tener toda la información del paciente en pantalla durante la consulta. Registrar el diagnóstico y la receta sin interrumpir la conexión de video. Saber que los datos clínicos están guardados de forma segura en la base de datos y que solo él puede escribirlos para la cita que le corresponde.

COMO LO ATIENDE EL SISTEMA

El DashboardMedico.tsx organiza las citas en cuatro secciones separadas: consultas de hoy (CONFIRMED para la fecha actual), solicitudes pendientes (PENDING de cualquier fecha), próximas citas confirmadas (CONFIRMED para fechas futuras) y atenciones completadas recientes. El método handleStatusUpdate envía el PATCH /api/appointments/:id/status al backend y, si la cita es de hoy y fue confirmada, ofrece navegación directa a la sala. El panel de ficha clínica en Videollamada.tsx es visible solo para usuarios con role igual a DOCTOR, y la verificación de autorización se repite en el backend mediante AppointmentRepository.findByIdAndDoctor antes de aceptar cualquier escritura clínica.

---

## Mapa de Empatía 3 — Administrador del Sistema

Perfil: Persona técnica o directiva responsable de la operación general de la plataforma. No participa en las consultas médicas. Necesita visibilidad sobre el estado del sistema para detectar problemas, medir el uso y mantener la integridad de los datos.

QUE PIENSA Y SIENTE

El administrador siente la necesidad de tener métricas claras del sistema sin tener que consultar la base de datos directamente. Le preocupa que existan citas huérfanas o datos inconsistentes que afecten la operación. Valora que el sistema le permita limpiar el entorno de pruebas sin tener que intervenir la base de datos manualmente. Entiende que no debe tener acceso al contenido de las videollamadas por confidencialidad médico-paciente.

QUE DICE Y HACE

El administrador accede al DashboardAdmin y observa los cuatro KPIs principales: total de pacientes, total de médicos, total de citas y tasa de cumplimiento (citas completadas sobre total). Revisa el log de actividad reciente que muestra las últimas diez citas con nombres de paciente y médico, fecha y estado. Si necesita reiniciar el sistema de pruebas, usa el botón "Limpiar Todas las Citas" que llama al endpoint DELETE /api/appointments/all.

DOLORES (LO QUE LE FRUSTRA)

No puede crear cuentas de médico desde el panel; los médicos deben registrarse usando el seed de la base de datos o mediante intervención directa. No puede activar ni desactivar cuentas de usuario. No tiene visibilidad de qué salas de videollamada están activas en tiempo real. No puede ver logs de errores del servidor LiveKit desde la interfaz.

GANANCIAS (LO QUE ESPERA OBTENER)

Tener una visión rápida del estado operativo del sistema. Poder limpiar datos de prueba sin acceso directo a la base de datos. Confiar en que los datos de las fichas clínicas solo pueden ser escritos por el médico correspondiente y no por administradores.

COMO LO ATIENDE EL SISTEMA

El endpoint GET /api/clinical/admin/stats en ClinicalService.getAdminStats ejecuta cinco consultas en paralelo con Promise.all: countByRole PATIENT, countByRole DOCTOR, countAll de citas, countByStatus COMPLETED y findRecent(10) de citas recientes. El acceso a este endpoint está protegido por el middleware protect y el controlador verifica que el rol del usuario sea ADMIN antes de devolver los datos. El botón de limpieza del sistema llama al endpoint DELETE /api/appointments/all que en AppointmentService.deleteAllAppointments también verifica el rol ADMIN antes de ejecutar el deleteMany de Prisma.
