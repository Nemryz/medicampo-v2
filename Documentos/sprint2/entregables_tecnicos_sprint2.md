# Entregables Técnicos del Sprint 2 — mediCampo v2

Este documento concentra la descripción detallada de los bocetos e interfaces que conforman los entregables técnicos del Sprint 2, organizados según las dos historias de usuario que dieron origen a los productos comprometidos por el equipo. Cada entregable se documenta a partir del componente real implementado en el código fuente del proyecto, referenciando los archivos .tsx donde reside cada pieza y describiendo de forma exhaustiva la estructura visual, los elementos interactivos, la jerarquía tipográfica, la paleta de colores y los estados visuales que el usuario puede observar durante su interacción con la plataforma.

El propósito principal es dejar registro técnico y descriptivo de las interfaces que efectivamente se construyeron, de modo que cualquier persona ajena al equipo, sea esta un evaluador académico o un desarrollador entrante al proyecto, pueda comprender cómo se materializaron las historias de usuario en pantallas concretas. La descripción se realiza con un nivel de detalle suficiente para reconstruir mentalmente la interfaz sin necesidad de levantar el sistema, aunque siempre será preferible ejecutar el proyecto localmente para una verificación visual directa.

## Producto-1 — Interfaz de Registro e Inicio de Sesión (HU3)

El primer producto técnico entregable corresponde al módulo completo de autenticación, conformado por dos pantallas principales que comparten una identidad visual coherente, esto es, la pantalla de Login y la pantalla de Register. Ambas piezas están construidas con React, TypeScript y TailwindCSS, residiendo en los archivos frontend/src/components/auth/Login.tsx y frontend/src/components/auth/Register.tsx respectivamente. La paleta de colores utilizada se basa en un fondo oscuro principal (#0A0F1C) sobre el cual se proyectan gradientes radiales en tonalidades emerald y cyan, generando una atmósfera tecnológica y moderna que apela a la idea de salud conectada.

### Pantalla de Inicio de Sesión

La pantalla de Login.tsx ocupa la totalidad del viewport con un fondo de color casi negro, sobre el cual se aplican dos gradientes circulares desenfocados, uno ubicado en la esquina superior izquierda con tonalidad emerald y otro en la esquina inferior derecha con tonalidad cyan, ambos con efecto blur de alta intensidad que produce un brillo difuso. El gradiente superior posee además una animación pulse sutil, generando una sensación de respiración visual que mantiene la pantalla viva durante la espera del usuario.

En el centro del viewport se ubica un contenedor principal con ancho máximo de aproximadamente cuatrocientos píxeles, fondo blanco translúcido con efecto glassmorphism (white/5 con backdrop-blur-2xl), borde sutil y sombra profunda. Este contenedor presenta esquinas redondeadas con radio amplio (rounded-3xl), generando una pieza visualmente flotante sobre el fondo oscuro.

En la parte superior del contenedor se ubica un ícono circular con gradiente de emerald a cyan, conteniendo el ícono HeartPulse de Lucide React en color blanco, simbolizando el latido vital de la plataforma de salud. Bajo el ícono aparece el título principal con la leyenda Bienvenido de vuelta en tipografía bold de tamaño tres extra large, seguido del subtítulo Tu salud conectada desde cualquier lugar en tipografía gris suave.

El formulario propiamente tal incluye dos campos verticales con espaciado consistente. El primer campo es el Correo Electrónico, con un label de tipografía mediana y color gris, junto con un input que tiene un ícono de Mail posicionado a la izquierda dentro del propio campo, fondo translúcido, borde sutil y placeholder de ejemplo juan@ejemplo.com. El input cambia de color en el ícono lateral cuando el usuario hace focus, transicionando del gris al emerald.

El segundo campo es la Contraseña, manteniendo la misma estructura visual del campo anterior, pero con un ícono de Lock a la izquierda y placeholder de ocho puntos suspensivos. Ambos campos poseen efectos de focus con ring de color emerald translúcido, otorgando retroalimentación visual al usuario sobre la posición del cursor.

Bajo el formulario se ubica el botón principal de envío, ocupando todo el ancho del contenedor, con fondo de gradiente emerald a cyan, texto blanco bold, sombra de color emerald translúcida y un efecto de scale al hacer clic. Cuando la petición está en curso, el botón muestra un ícono Loader2 girando en lugar del texto y la flecha de envío. Cuando está en estado normal, muestra el texto Iniciar Sesión junto con un ícono ArrowRight que se desplaza ligeramente a la derecha al hacer hover.

Al pie del contenedor se incluye un mensaje de invitación al registro, con el texto No tienes una cuenta? seguido de un botón en línea con la leyenda Regístrate aquí en color emerald, el cual al ser presionado cambia la vista al componente Register.tsx mediante la función onSwitchToRegister recibida por props.

En el caso de que el endpoint de autenticación retorne un error, sobre el formulario aparece una caja con fondo rojo translúcido, borde sutil rojo y texto rojo, conteniendo el mensaje específico de error retornado por el backend (por ejemplo, Credenciales incorrectas). Esta caja aparece con una animación de fade-in y zoom-in suave, atrayendo la atención del usuario sin resultar agresiva.

### Pantalla de Registro

La pantalla de Register.tsx mantiene la misma identidad visual del Login, pero con algunos ajustes para acomodar los campos adicionales que requiere la creación de una nueva cuenta. El contenedor principal tiene un ancho ligeramente mayor (max-w-lg en lugar de max-w-md) y un padding vertical adicional para acomodar las cuatro entradas del formulario.

Los gradientes de fondo invierten su posición respecto al Login, ubicándose el cyan en la esquina superior derecha y el emerald en la esquina inferior izquierda, generando una sensación de variación entre ambas pantallas pero manteniendo la coherencia visual. El ícono superior también invierte el gradiente, yendo de cyan a emerald, sutilmente diferenciando esta vista de la anterior.

El título principal cambia a Crea tu cuenta con el subtítulo Únete a mediCampo y recibe atención donde estés, alineando el copy con el valor central del producto, esto es, llevar atención médica a zonas rurales.

El formulario presenta cuatro campos en orden secuencial. El primero es el Nombre Completo con un ícono User a la izquierda, placeholder Juan Pérez. El segundo es el RUT con un ícono FileText a la izquierda, placeholder 12345678-9 para guiar el formato esperado. El tercero es el Correo Electrónico con un ícono Mail, manteniendo la misma estructura del Login. El cuarto es la Contraseña con un ícono Lock, igual al campo del Login.

Todos los campos usan el mismo patrón visual de focus con ring cyan translúcido, manteniendo la coherencia con el ícono superior que también está en tonalidad cyan dominante. El botón principal sigue el mismo patrón del Login, pero invirtiendo el gradiente del fondo (de cyan a emerald), reforzando la idea de que esta es la pantalla complementaria.

Al pie del contenedor aparece la invitación inversa, con el texto Ya tienes cuenta? seguido del botón Inicia Sesión aquí en color cyan, que al ser presionado regresa al componente Login.tsx mediante la función onSwitchToLogin recibida por props.

El flujo de registro incluye una lógica especial al obtener una respuesta exitosa del endpoint POST /api/auth/register, ya que automáticamente ejecuta un segundo llamado al endpoint POST /api/auth/login con las mismas credenciales recién creadas, permitiendo que el usuario quede autenticado sin necesidad de ingresar nuevamente sus datos. Esta optimización de la experiencia mejora la conversión inicial y reduce la fricción para el paciente rural.

### Comportamientos transversales del Producto-1

Tanto el Login como el Register comparten varios comportamientos visuales que vale la pena destacar. Las cajas de error usan animaciones de fade-in y zoom-in para llamar la atención sin sobresaltar al usuario. Los botones principales tienen un estado deshabilitado con opacidad reducida cuando la petición está en curso, evitando dobles envíos. El ícono Loader2 aparece girando dentro del botón cuando hay una operación en proceso, dando retroalimentación visual continua al usuario.

La persistencia de la sesión se maneja a través del AuthContext en frontend/src/context/AuthContext.tsx, que almacena el token JWT y el objeto usuario bajo las claves medicampo_token y medicampo_user dentro del localStorage del navegador. Al recargar la página, el contexto restaura automáticamente la sesión leyendo estos valores, evitando que el usuario tenga que volver a autenticarse cada vez que vuelva a la plataforma. El método logout limpia el storage y redirige a la raíz, cerrando la sesión de forma limpia.

## Producto-2 — Interfaz de Reserva de Teleconsulta con Aceptación e Inicio de Videollamada (HU4)

El segundo producto técnico entregable corresponde al módulo completo de reserva y gestión de teleconsultas, conformado por tres pantallas principales que cubren los tres roles activos del flujo, esto es, la pantalla de Reserva desde la perspectiva del paciente, el Dashboard del Médico para aceptar o rechazar solicitudes y el Dashboard del Paciente para visualizar el estado de sus citas y entrar a la sala una vez confirmadas. Adicionalmente, ambos roles convergen en el componente de Videollamada cuando la cita está confirmada, momento en el cual aparece el botón de inicio en ambas vistas simultáneamente.

Las pantallas residen en los archivos frontend/src/components/ReservaCita.tsx, frontend/src/components/dashboards/DashboardMedico.tsx y frontend/src/components/dashboards/DashboardPaciente.tsx. La paleta visual cambia respecto al Producto-1, usando ahora fondos claros con acentos azules, verdes y amarillos según el estado de las citas, generando una atmósfera más operacional propia de una plataforma de gestión profesional.

### Pantalla de Reserva de Cita

El componente ReservaCita.tsx presenta un layout dividido en tres pasos claramente diferenciados visualmente, ocupando el ancho completo de la pantalla con un máximo de aproximadamente mil píxeles centrados. El fondo principal es blanco con paddings amplios y separación generosa entre secciones.

En la parte superior se ubica el header con el título Agendar Teleconsulta en tipografía bold de tamaño grande (text-3xl o text-4xl), junto con el subtítulo Selecciona al especialista y el horario que mejor te acomode en tipografía gris suave. La alineación cambia de centrada en mobile a alineada a la izquierda en desktop, adaptándose al espacio disponible.

El primer paso ocupa la columna izquierda del layout (un tercio del ancho en desktop) y muestra una lista vertical de tarjetas de especialistas. Cada tarjeta presenta el nombre del médico en tipografía bold, su especialidad asociada en tipografía menor con un ícono Stethoscope a la izquierda, y un avatar circular con un ícono UserIcon que cambia de color cuando la tarjeta está seleccionada. Las tarjetas no seleccionadas tienen borde gris suave y fondo blanco, mientras que la tarjeta seleccionada tiene borde azul, fondo azul translúcido y un leve efecto de escala (scale-[1.02]) que la hace destacar visualmente.

Mientras la lista está cargando desde el endpoint GET /api/appointments/doctors, aparecen tres tarjetas placeholder con animación pulse de color gris claro, dando retroalimentación visual sobre el estado de la carga. Si no hay médicos disponibles, aparece un mensaje centrado con el ícono Stethoscope en gris suave y el texto No hay doctores disponibles.

El segundo y tercer paso comparten la columna derecha del layout (dos tercios del ancho en desktop), dentro de una caja blanca con borde sutil, esquinas redondeadas con radio amplio (rounded-3xl) y sombra ligera. La caja se divide internamente en dos columnas, la primera para la selección de la fecha mediante un input nativo de tipo date con un mínimo establecido en el día actual (impidiendo la selección de fechas pasadas), y la segunda para la selección del horario mediante una cuadrícula de botones con los seis bloques disponibles, esto es, 09:00, 10:00, 11:30, 14:00, 15:30 y 17:00.

Los botones de horario están deshabilitados hasta que el usuario haya seleccionado una fecha, pasando de opacidad completa a opacidad reducida según el estado del flujo. El botón seleccionado tiene fondo azul, texto blanco, sombra azul translúcida y un efecto de escala (scale-105) que lo destaca claramente sobre los demás botones, que mantienen fondo gris muy claro con texto gris oscuro y borde gris suave.

En la parte inferior de la caja se ubica una franja horizontal con el mensaje contextual que cambia según el avance del flujo. Si no se ha seleccionado un especialista, dice Comienza seleccionando un especialista. Si no se ha seleccionado fecha, dice Selecciona una fecha en el calendario. Si no se ha seleccionado horario, dice Elige tu bloque horario. Cuando todo está completo, aparece el mensaje Todo listo para confirmar en color emerald con un ícono CheckCircle2 a la izquierda, junto con el botón Confirmar Reserva habilitado a la derecha.

El botón Confirmar Reserva es el más prominente de la pantalla, con fondo de gradiente azul, texto blanco bold, sombra azul translúcida y un ícono ChevronRight que se desplaza a la derecha al hacer hover. Cuando la petición está en curso, el botón muestra el texto Guardando junto con un ícono de loading.

Al completarse exitosamente la reserva, la pantalla cambia completamente al estado de éxito, mostrando una caja centrada con un ícono CheckCircle2 grande en color emerald, el título Solicitud Enviada en tipografía bold, junto con el mensaje informativo Tu propuesta de teleconsulta ha sido enviada con éxito. El médico recibirá una notificación para confirmarla pronto. Más abajo, en color azul cursivado, aparece la indicación Podrás entrar una vez el médico acepte la cita, dejando claro al paciente que aún debe esperar la confirmación. Bajo el mensaje se ubica el botón Agendar otra cita, que resetea el formulario y vuelve al estado inicial del flujo.

### Pantalla del Dashboard Médico

El componente DashboardMedico.tsx presenta un layout dividido en dos columnas principales, con un header superior y una franja de estadísticas resumidas. El fondo es blanco con cajas internas que tienen sombras suaves y esquinas redondeadas, manteniendo la estética profesional.

El header muestra el título Panel Médico seguido del nombre del médico en color emerald, junto con el subtítulo Gestiona tus consultas y visibilidad de agenda en tipografía gris. Bajo el header se ubica una franja de cuatro cajas resumen, cada una con un ícono representativo, un valor numérico grande y una etiqueta descriptiva. Las cajas son Consultas Hoy (ícono Clock en azul), Por Aprobar (ícono HeartPulse en amarillo), Completadas (ícono CheckCircle2 en emerald) y Próximas (ícono Calendar en púrpura). Cada caja tiene un fondo de color suave acorde a su categoría, con borde blanco y sombra ligera.

La columna izquierda del cuerpo principal contiene dos secciones apiladas verticalmente. La primera sección es Consultas de Hoy, encabezada con un ícono Clock en color emerald y el título correspondiente. Si no hay consultas para hoy, aparece el mensaje gris No hay consultas confirmadas para hoy. Si hay consultas, se muestra una lista de tarjetas con el nombre del paciente en tipografía bold, la hora de la cita en formato HH:mm hrs en tipografía gris pequeña y un botón Iniciar a la derecha con fondo emerald, texto blanco bold y un ícono Video a la izquierda. Este botón ejecuta navigate al meetingLink correspondiente, llevando al médico directamente a la sala de videollamada.

La segunda sección de la columna izquierda es Solicitudes Pendientes, encabezada con un ícono HeartPulse en color amarillo. Si no hay solicitudes, aparece el mensaje gris No tienes solicitudes por aprobar. Si hay solicitudes, se muestra una lista de tarjetas con borde y fondo en tonalidad amarilla suave, conteniendo el nombre del paciente, la fecha y hora de la cita solicitada, y dos botones de acción a la derecha. El primer botón tiene fondo emerald con un ícono Check en blanco para aceptar la solicitud, y el segundo botón tiene fondo blanco con borde rojo y un ícono X en rojo para rechazar la solicitud. Al presionar cualquiera de los dos botones, se ejecuta handleStatusUpdate enviando el PATCH al endpoint correspondiente.

La columna derecha del cuerpo principal contiene dos secciones también apiladas verticalmente. La primera sección es Próximas Citas Confirmadas, encabezada con un ícono Calendar en color púrpura. Esta lista muestra las citas con fecha posterior al día actual y estado CONFIRMED, presentando el nombre del paciente y la fecha de la cita en formato corto con un ícono Clock a la derecha. Las tarjetas tienen borde púrpura muy suave y efecto hover que destaca un fondo púrpura translúcido al pasar el cursor.

La segunda sección de la columna derecha es Atenciones Recientes, encabezada con un ícono FileText en gris. Esta lista muestra las cinco citas más recientes con estado COMPLETED, presentando el nombre del paciente con un ícono ChevronRight a la derecha. Al hacer clic en cualquier tarjeta, se ejecuta navigate al historial clínico correspondiente, llevando al médico a la vista detallada de la consulta pasada.

Cuando el médico acepta una cita programada para el día actual, aparece un cuadro de diálogo nativo del navegador con el mensaje Cita aceptada para hoy. ¿Deseas ingresar a la sala de video ahora? con los botones Aceptar y Cancelar. Si el médico confirma, se ejecuta navigate(meetingLink) llevándolo directamente al componente Videollamada.tsx, con lo cual se cierra el ciclo de aceptación y entrada en una sola acción fluida.

### Pantalla del Dashboard Paciente

El componente DashboardPaciente.tsx presenta un layout similar al del médico pero con énfasis en la próxima cita del paciente y un botón prominente para agendar una nueva teleconsulta. El header muestra la bienvenida personalizada con el primer nombre del paciente en un gradiente de azul a índigo, junto con el subtítulo Control de tus atenciones médicas y resultados.

A la derecha del header se ubica el botón Agendar Teleconsulta con fondo azul, texto blanco bold, ícono CalendarPlus a la izquierda y un efecto de elevación al hacer hover. Este botón es el llamado a la acción principal de la pantalla, llevando al paciente al componente ReservaCita.tsx.

Bajo el header se ubica la sección Tu Agenda Próxima dentro de una caja blanca grande con esquinas redondeadas con radio aún mayor (rounded-[2rem]). El encabezado de la caja muestra un ícono Video en azul junto con el título y el contador total de citas próximas. El cuerpo de la caja presenta las citas activas, sean confirmadas o pendientes.

Las tarjetas de cita tienen un diseño diferenciado según el estado. Las tarjetas PENDING tienen fondo amarillo translúcido con borde amarillo punteado y un badge superior con el texto Esperando Médico en color amarillo oscuro. Las tarjetas CONFIRMED tienen fondo blanco con borde sutil y un badge verde con el texto Confirmada. Cada tarjeta muestra una sección lateral izquierda con la fecha destacada (mes en azul, día en negro de tamaño grande y hora en gris pequeño), junto con la información del médico, su especialidad y el botón de acción.

El botón de acción cambia según el estado. Si la cita está pendiente, no aparece botón (el paciente solo puede esperar). Si la cita está confirmada, aparece el botón Ingresar a la Sala con fondo emerald, texto blanco bold y un ícono Video a la izquierda, ejecutando navigate al meetingLink correspondiente al ser presionado.

Cuando no hay citas próximas, aparece un mensaje centrado dentro de un recuadro punteado con el ícono HeartPulse grande en gris claro y el texto No tienes teleconsultas agendadas actualmente, invitando implícitamente al usuario a usar el botón de agendamiento del header.

### Componente de Videollamada (punto de convergencia de ambos roles)

Una vez que la cita ha sido confirmada y cualquiera de los dos usuarios presiona su respectivo botón de ingreso (Iniciar en el caso del médico o Ingresar a la Sala en el caso del paciente), ambos convergen en el mismo componente Videollamada.tsx ubicado en frontend/src/components/Videollamada.tsx.

El componente carga inicialmente la pantalla PreFlightCheck.tsx, donde se verifica el acceso al hardware del usuario (cámara y micrófono), se obtienen los permisos del navegador y se muestra una vista previa del video local. Una vez superada esta verificación, el componente solicita el token de LiveKit al endpoint GET /api/livekit/token, validando que el usuario tenga una cita asignada a la sala solicitada. Si la validación es exitosa, se renderiza el LiveKitRoom con la URL del servidor SFU y el token obtenido.

La interfaz de la videollamada presenta un encabezado superior con un escudo y la leyenda Cifrado Militar reforzando la sensación de seguridad, junto con el indicador de calidad de red en tiempo real que cambia entre los estados Buena (verde), Regular (ámbar), Mala (rojo) y Desconectado (gris), según los eventos de RoomEvent.Disconnected, RoomEvent.Reconnecting y RoomEvent.Reconnected reportados por LiveKit.

El cuerpo principal muestra el GridLayout con los ParticipantTile de cada usuario conectado, ajustándose automáticamente al número de participantes presentes. En el caso de una consulta uno a uno entre médico y paciente, se muestran dos cuadros lado a lado en desktop y apilados verticalmente en mobile.

Los controles inferiores incluyen los botones de Mic, Cámara y Colgar, construidos dentro del subcomponente ControlesPersonalizados que usa el hook useLocalParticipant de LiveKit para activar o desactivar el hardware en tiempo real. El botón de colgar ejecuta navigate(-1) cerrando la sala y regresando al dashboard correspondiente.

A la derecha de la sala se ubica un panel lateral que cambia su contenido según el rol del usuario. Si el usuario es DOCTOR, el panel muestra la ficha clínica del paciente con campos para diagnóstico, prescripción y observaciones, junto con el botón Guardar Ficha que persiste los datos al backend mediante POST /api/clinical/:appointmentId. Si el usuario es PATIENT, el panel muestra el nombre del médico, su especialidad y el chat de la consulta.

## Mapa de navegación entre los componentes

Para facilitar la comprensión del flujo completo, a continuación se sintetiza el camino que recorre cada rol dentro del sistema.

El paciente parte desde Login.tsx o Register.tsx, llega al DashboardPaciente.tsx, presiona Agendar Teleconsulta y entra a ReservaCita.tsx donde elige especialista, fecha y horario. Tras confirmar, regresa al dashboard donde su nueva cita aparece con badge amarillo de Esperando Médico. Una vez que el médico la acepta, el badge cambia a verde Confirmada y aparece el botón Ingresar a la Sala que lo lleva al componente Videollamada.tsx.

El médico parte desde Login.tsx, llega al DashboardMedico.tsx donde ve las solicitudes pendientes, presiona el botón de aceptación verde para una solicitud específica, confirma el cuadro de diálogo si la cita es para hoy y entra automáticamente al componente Videollamada.tsx, donde se encuentra con el paciente esperando dentro de la misma sala identificada por el meetingLink único.

## Archivos del repositorio que conforman los entregables

Para verificación directa en el código, los archivos exactos involucrados en los entregables del Sprint 2 son los siguientes.

Para el Producto-1 — Autenticación:
- frontend/src/components/auth/Login.tsx
- frontend/src/components/auth/Register.tsx
- frontend/src/context/AuthContext.tsx
- frontend/src/App.tsx (con RoleRoute)
- backend/src/controllers/authController.ts
- backend/src/services/AuthService.ts
- backend/src/repositories/UserRepository.ts
- backend/src/routes/authRoutes.ts
- backend/src/config/jwt.ts
- backend/prisma/schema.prisma (modelo User)

Para el Producto-2 — Reserva y Videollamada:
- frontend/src/components/ReservaCita.tsx
- frontend/src/components/dashboards/DashboardPaciente.tsx
- frontend/src/components/dashboards/DashboardMedico.tsx
- frontend/src/components/Videollamada.tsx
- frontend/src/components/PreFlightCheck.tsx
- backend/src/controllers/appointmentController.ts
- backend/src/services/AppointmentService.ts
- backend/src/repositories/AppointmentRepository.ts
- backend/src/routes/appointmentRoutes.ts
- backend/src/controllers/livekitController.ts
- backend/src/services/LiveKitService.ts
- backend/prisma/schema.prisma (modelos Specialty y Appointment)

## Documentos relacionados

Para conocer el detalle de cada tarea técnica que produjo estos entregables, consultar sprint_backlog_sprint2.md. Para la planificación previa y la justificación de los productos seleccionados, dirigirse a sprint_planning_sprint2.md. Para los resultados finales obtenidos y la evidencia presentada al cierre del sprint, revisar resultados_sprint2.md y sprint_review_sprint2.md.
