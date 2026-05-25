# Sprint Review del Sprint 2 — mediCampo v2

Este documento recoge el desarrollo formal de la Sprint Review del Sprint 2, evento que cierra la fase 3 del marco Scrum y que tiene como propósito principal presentar el trabajo realizado durante el periodo a los stakeholders clave, en este caso particular representados por la cátedra evaluadora, junto con la obtención de retroalimentación que permita orientar el siguiente sprint hacia donde más valor pueda generarse. La instancia se realizó durante el bloque de clase del viernes correspondiente a la última semana del sprint, inmediatamente después del último Daily Scrum, con los tres integrantes del equipo presentes y conectados al proyector de la sala para mostrar la demostración en vivo.

## Asistentes a la Sprint Review

Por parte del equipo de desarrollo asistieron los tres integrantes del proyecto, esto es, Vicente Ramirez en su rol de líder de frontend y encargado principal de la demostración visual, James Honeymann en su rol de líder de backend y encargado de responder preguntas técnicas sobre los endpoints y la base de datos, e Ignacio Ampuero en su rol de Scrum Master ad-hoc y encargado de la moderación general de la presentación. Por parte de los stakeholders asistieron la profesora titular de la asignatura, junto con sus ayudantes, en su calidad de evaluadores externos del progreso del producto.

## Estructura general de la presentación

La presentación se diseñó para ocupar aproximadamente cuarenta minutos del bloque de clase, distribuyendo el tiempo de manera equilibrada entre la introducción contextual, la demostración en vivo del flujo completo, la explicación técnica de los componentes principales y, finalmente, el espacio de preguntas y retroalimentación abierta. La estructura quedó organizada en seis secciones secuenciales que se detallan a continuación.

### Sección uno — Recordatorio del objetivo y del alcance del sprint

Ignacio Ampuero abrió la presentación recordando brevemente el objetivo formal del Sprint 2, esto es, habilitar el ciclo completo de acceso y agendamiento de teleconsultas para que un paciente rural pudiera registrarse, iniciar sesión, reservar una consulta y entrar junto a su médico a la sala de videollamada construida durante el Sprint 1. Asimismo, se mencionaron las dos historias de usuario seleccionadas, esto es, HU3 referida al registro e inicio de sesión y HU4 referida a la reserva con aceptación e ingreso a la videollamada.

Como parte de este recordatorio, también se hizo mención al contexto del proyecto en su conjunto, destacando que mediCampo v2 es una plataforma de telemedicina orientada a zonas rurales de Chile que nació como refactorización completa de un prototipo inicial generado con Bolt.new, y que durante el Sprint 1 ya se había construido la base técnica del sistema junto con el primer prototipo funcional de la videollamada usando LiveKit como tecnología de Selective Forwarding Unit.

### Sección dos — Demostración en vivo del flujo end-to-end

Vicente Ramirez tomó el control de la presentación para realizar la demostración en vivo del flujo completo, conectando su computador al proyector y abriendo dos navegadores en paralelo, uno con sesión de paciente y otro con sesión de médico, permitiendo así mostrar el flujo desde ambas perspectivas de manera simultánea.

La demostración cubrió los siguientes pasos secuenciales. Primero, se mostró el registro de un nuevo paciente desde la pantalla de Register.tsx, completando los cuatro campos requeridos y observando cómo el sistema lo dejaba autenticado automáticamente tras el registro exitoso. Segundo, se navegó al DashboardPaciente.tsx, comprobando que aparecía la bienvenida personalizada con el nombre del paciente recién creado y el botón Agendar Teleconsulta visible y operativo.

Tercero, se accedió a ReservaCita.tsx, mostrando la lista de tres médicos disponibles con sus respectivas especialidades obtenidas en tiempo real desde la base de datos. Se seleccionó un médico, se eligió una fecha para el día actual y un horario disponible, confirmando la reserva mediante el botón principal. Se mostró la pantalla de confirmación con el ícono de check verde y el mensaje informativo sobre la espera del médico.

Cuarto, se cambió al segundo navegador donde estaba la sesión del médico, se mostró el DashboardMedico.tsx con la nueva solicitud pendiente recién aparecida en la sección correspondiente, junto con los botones de aceptación verde y rechazo rojo. Se presionó el botón verde de aceptación, mostrando el cuadro de diálogo nativo del navegador que preguntaba al médico si quería ingresar de inmediato a la sala, dado que la cita era para el día actual.

Quinto, se confirmó el ingreso desde el lado del médico, observando cómo el navegador redirigió automáticamente al componente Videollamada.tsx con la pantalla de PreFlightCheck verificando los permisos de cámara y micrófono. Sexto, se volvió al primer navegador con la sesión del paciente, refrescando el dashboard para mostrar cómo el badge de la cita había cambiado de Esperando Médico (amarillo) a Confirmada (verde), apareciendo además el botón Ingresar a la Sala.

Séptimo, se presionó el botón de ingreso desde el lado del paciente, observando cómo el segundo navegador también pasaba por el PreFlightCheck y luego entraba al mismo LiveKitRoom donde ya estaba esperando el médico. La demostración cerró con ambos participantes viéndose y escuchándose mutuamente en la sala, validando que el flujo completo funciona de extremo a extremo sin intervención manual del administrador.

### Sección tres — Explicación técnica de los componentes principales

James Honeymann tomó la palabra para explicar las piezas técnicas que sustentan el flujo demostrado, comenzando por la capa de datos. Mostró el archivo backend/prisma/schema.prisma proyectándolo en el muro de la sala, destacando los tres modelos clave para el Sprint 2, esto es, User con sus campos id, rut, name, email, password cifrado, role y specialtyId opcional; Specialty con sus campos id y name únicos; y Appointment con sus campos patientId, doctorId, date, status, meetingLink y la relación uno a uno con ClinicalRecord.

A continuación explicó los seis endpoints REST que soportan el flujo, mostrando brevemente el código del authController.ts y del appointmentController.ts, comentando cómo la separación entre controladores, servicios y repositorios mantiene la arquitectura limpia y testeable. Destacó el uso de bcryptjs para el cifrado de contraseñas, jsonwebtoken para la firma de los tokens JWT, junto con la validación de propiedad en el endpoint PATCH que evita que un médico cambie el estado de citas que no le pertenecen.

Ignacio Ampuero complementó la explicación técnica describiendo la integración con LiveKit, mostrando cómo el meetingLink generado al crear la cita se convierte en el roomId de la sala virtual, cómo el endpoint /api/livekit/token valida que el usuario tenga efectivamente una cita asignada a esa sala antes de entregarle el token JWT firmado con la clave maestra de LiveKit, y cómo este mecanismo asegura que ningún tercero pueda colarse a una sala simplemente conociendo el roomId.

### Sección cuatro — Métricas y estado de cumplimiento

Ignacio Ampuero presentó las métricas globales del sprint, recordando que de las diecisiete tareas técnicas comprometidas inicialmente, el equipo logró cerrar quince dentro del periodo, dejando dos pendientes como mejoras incrementales que se trasladaron al Sprint 3. Esto arroja un porcentaje de cumplimiento del Sprint Backlog de aproximadamente ochenta y ocho por ciento, lo cual se considera satisfactorio para el alcance comprometido.

Asimismo, se mencionó que la capacidad total estimada del equipo era de noventa horas conjuntas, contra una estimación inicial de setenta y nueve horas comprometidas, dejando un margen de once horas para absorber imprevistos. Durante el sprint se utilizaron aproximadamente ocho horas de ese margen en correcciones puntuales y pruebas integrales adicionales, manteniendo un colchón razonable hasta el cierre.

### Sección cinco — Tareas pendientes y plan para el siguiente sprint

Se presentaron las dos tareas que quedaron pendientes al cierre del Sprint 2, esto es, la creación de cuentas de médico desde el panel administrativo (que pertenece a la HU3) y la validación estricta de choques de horarios entre citas del mismo médico (que pertenece a la HU4). Junto con estas, se mencionó que la obtención dinámica de los bloques horarios desde la base de datos también queda como mejora para el Sprint 3.

Asimismo, se adelantó el alcance preliminar del Sprint 3, que se enfocará probablemente en la HU5 (notificaciones automáticas de recordatorio de cita) y la HU6 (panel completo de administración con gestión CRUD de usuarios), considerando que la HU3 y la HU4 ya están operativas en sus aspectos centrales.

### Sección seis — Espacio de preguntas y retroalimentación

El espacio final de la presentación se abrió al jurado evaluador para preguntas y comentarios, donde se generaron varias intervenciones que vale la pena documentar para su seguimiento posterior. Las preguntas y observaciones recibidas se sintetizan a continuación.

## Retroalimentación recibida durante la Sprint Review

La cátedra evaluadora entregó retroalimentación valiosa que el equipo recogió íntegramente para considerar tanto en la planificación del Sprint 3 como en futuras iteraciones del producto. A continuación se presenta el resumen de los comentarios recibidos, agrupados por área temática.

### Sobre la calidad visual de las interfaces

La cátedra valoró positivamente la calidad estética de las pantallas mostradas, destacando especialmente la coherencia visual entre el Login y el Register, junto con el uso de gradientes y efectos sutiles que generan una sensación moderna y profesional. Asimismo, se reconoció el cuidado en la diferenciación visual de los estados de las tarjetas de citas en los dashboards (pendiente amarillo versus confirmada verde), lo cual facilita la comprensión rápida por parte del usuario.

Como mejora sugerida, la cátedra recomendó revisar el contraste de algunos elementos secundarios, especialmente en pantallas de dispositivos móviles, donde los textos en gris claro podrían resultar difíciles de leer para personas con baja agudeza visual. El equipo tomó nota de esta observación para considerarla en la fase de pulido del Sprint 3.

### Sobre la robustez del flujo de aceptación

La cátedra preguntó qué ocurre si el médico rechaza una solicitud, observando que en la demostración solo se mostró el escenario de aceptación. Vicente Ramirez respondió mostrando en vivo el flujo de rechazo, donde el botón rojo cambia el estado de la cita a CANCELLED y la cita desaparece de la sección de próximas en el dashboard del paciente, apareciendo en cambio en la sección de citas pasadas con el badge Rechazada.

Como mejora sugerida, la cátedra recomendó implementar una notificación explícita al paciente cuando su cita es rechazada, de modo que sepa que debe agendar nuevamente con otro médico o en otro horario sin tener que descubrirlo por inferencia visual. Esta sugerencia se incorporó al backlog del Sprint 3, alineándose además con la HU5 de notificaciones que ya estaba planificada.

### Sobre la seguridad del sistema

La cátedra preguntó cómo se asegura que un usuario malicioso no pueda colarse a una sala de videollamada conociendo simplemente el meetingLink. Ignacio Ampuero respondió explicando que el endpoint /api/livekit/token valida que el JWT del usuario corresponda a un paciente o médico efectivamente asignado a la cita cuyo meetingLink coincide con el roomId solicitado, retornando un error 403 ante cualquier intento de un tercero. Adicionalmente, el servidor de LiveKit verifica la firma del token con la clave maestra antes de permitir la conexión, lo cual añade una segunda barrera de seguridad.

La cátedra valoró positivamente la respuesta, sugiriendo además incorporar en futuros sprints una funcionalidad de auditoría que registre los intentos de acceso fallidos a las salas, junto con la identidad del usuario que intentó el acceso indebido. Esta sugerencia se anotó para evaluación dentro del Sprint 3 como parte del refuerzo del panel administrativo (HU6).

### Sobre la experiencia de uso del paciente rural

La cátedra preguntó si el equipo había validado el flujo con usuarios reales, considerando que el público objetivo es un paciente rural con posible baja alfabetización digital. El equipo reconoció honestamente que aún no se ha realizado validación con usuarios reales debido a las restricciones temporales y geográficas del proyecto académico, pero que la decisión de mantener las pantallas con pocos campos, mensajes claros y botones grandes responde justamente a esta consideración.

Como mejora sugerida, la cátedra recomendó incorporar pruebas de usabilidad con al menos dos usuarios externos al equipo antes del cierre del proyecto, idealmente con perfiles distintos al perfil técnico de los desarrolladores. El equipo tomó nota de esta observación, planificando una sesión de pruebas con familiares o conocidos durante el Sprint 3 que cumplan con un perfil más cercano al usuario objetivo.

### Sobre la documentación técnica del proyecto

La cátedra valoró positivamente la profundidad de la documentación interna del proyecto, destacando los archivos disponibles en la carpeta Documentos del repositorio, particularmente los documentos historias_de_usuario.md y sprint_backlog.md que mantienen la trazabilidad completa del progreso. Asimismo, se reconoció el esfuerzo de mantener los documentos de versiones anteriores accesibles para fines de auditoría histórica.

Como mejora sugerida, se recomendó incorporar diagramas visuales (de arquitectura, de flujo y de modelo de datos) que complementen la documentación textual, facilitando la comprensión para nuevos miembros del equipo o evaluadores externos. El equipo tomó nota de esta sugerencia, planificando la incorporación de al menos un diagrama de arquitectura general durante el Sprint 3.

### Sobre el cumplimiento del objetivo del sprint

La cátedra confirmó verbalmente que el objetivo del Sprint 2 se considera plenamente cumplido, destacando que el flujo end-to-end demostrado en vivo evidencia el cierre del bucle paciente-médico de forma operativa y demostrable. Asimismo, se reconoció que los dos pendientes derivados al Sprint 3 (creación de médicos desde admin y validación de choques de horarios) corresponden a mejoras incrementales que no comprometen el funcionamiento general del sistema.

## Compromisos asumidos por el equipo tras la Sprint Review

Tras recibir la retroalimentación, el equipo asumió de forma explícita los siguientes compromisos para incorporar en la planificación del Sprint 3, dejándolos consignados aquí para su seguimiento.

Primero, revisar el contraste de los elementos secundarios en pantallas móviles durante la fase de pulido visual, especialmente en los textos en gris claro que podrían resultar difíciles de leer.

Segundo, implementar la notificación al paciente cuando su cita es rechazada por el médico, alineando esta mejora con la HU5 de notificaciones automáticas.

Tercero, evaluar la incorporación de un sistema de auditoría básico para los intentos de acceso indebido a las salas de videollamada, como parte del refuerzo del panel administrativo en la HU6.

Cuarto, programar al menos una sesión de pruebas de usabilidad con usuarios externos al equipo durante el Sprint 3, considerando perfiles más cercanos al usuario objetivo.

Quinto, incorporar al menos un diagrama visual de arquitectura general dentro de la documentación del proyecto, facilitando la comprensión para evaluadores y nuevos integrantes potenciales.

## Cierre de la Sprint Review

La Sprint Review cerró formalmente con el agradecimiento por parte del equipo a la cátedra evaluadora por su tiempo y retroalimentación, junto con el reconocimiento mutuo entre los integrantes del equipo por el trabajo conjunto realizado durante el sprint. La sesión dejó al equipo con una sensación de cumplimiento, dado que el objetivo principal del periodo se alcanzó plenamente y la retroalimentación recibida fue constructiva y orientada a mejoras incrementales del producto, sin críticas de fondo a la arquitectura o al enfoque elegido.

Inmediatamente después de la Sprint Review, los tres integrantes se retiraron a un espacio más reducido para realizar la Sprint Retrospective, cuyo desarrollo y conclusiones quedan registrados en el documento sprint_retrospective_sprint2.md ubicado en esta misma carpeta.

## Documentos relacionados

Para revisar el detalle de los resultados obtenidos y la evidencia técnica que sustentó la demostración, dirigirse a resultados_sprint2.md. Para acceder a la descripción detallada de las interfaces que conforman los entregables, consultar entregables_tecnicos_sprint2.md. Para conocer las reflexiones internas del equipo sobre el proceso, las oportunidades de mejora identificadas y los compromisos asumidos para el siguiente sprint, revisar sprint_retrospective_sprint2.md.
