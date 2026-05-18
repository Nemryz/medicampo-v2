# Casos de Uso del Sistema mediCampo v2
## Enfoque de Trabajo Pesado: Diagrama General y Redacción de Caso de Uso Principal

---

## Contexto previo y propósito del documento

El presente documento aborda dos tareas de análisis y modelado de software correspondientes a la metodología de trabajo pesado, aplicadas sobre el sistema mediCampo v2, una plataforma de telemedicina orientada a la atención médica remota en zonas rurales de Chile, la cual integra videollamadas en tiempo real mediante el protocolo WebRTC a través del servidor de medios LiveKit, gestión de citas médicas con flujo de aprobación, historial clínico digital con constantes vitales y diagnósticos, junto a un control de acceso basado en roles para tres tipos de actores, que son el paciente, el médico y el administrador, todo esto desplegado sobre infraestructura en la nube de DigitalOcean con una base de datos PostgreSQL gestionada mediante el ORM Prisma y un backend Express.js con autenticación JWT.

La primera tarea consiste en elaborar el diagrama general de casos de uso del sistema, representando todos los actores involucrados, las funcionalidades que el sistema expone hacia cada uno de ellos, y las relaciones de inclusión y extensión entre dichos casos de uso, mientras que la segunda tarea consiste en seleccionar la funcionalidad más relevante del sistema desde la perspectiva del valor que entrega al cliente, y redactar su caso de uso de forma completa y detallada, incluyendo actores, precondiciones, flujo principal, flujos alternativos, postcondiciones y reglas de negocio asociadas.

---

## Tarea 1: Diagrama General de Casos de Uso

### 1.1 Identificación de actores

Antes de construir el diagrama, corresponde identificar con precisión los actores que interactúan con el sistema, entendiéndose como actor a todo agente externo, ya sea humano o sistema, que participa en la ejecución de al menos un caso de uso, sin ser parte del sistema modelado en sí mismo.

El primer actor es el Paciente, que corresponde a un usuario registrado con rol PATIENT, cuya función dentro del sistema es solicitar atención médica remota mediante la reserva de citas, participar en la videollamada una vez que la cita ha sido aprobada por el médico, y consultar posteriormente su historial clínico con los diagnósticos y tratamientos emitidos, siendo este actor el receptor final del valor que entrega la plataforma y, por lo tanto, el actor más crítico desde la perspectiva del negocio.

El segundo actor es el Médico, que corresponde a un usuario con rol DOCTOR, creado por el administrador o mediante el proceso de seed de la base de datos, cuya función es revisar las solicitudes de cita entrantes en estado PENDING, aprobarlas o rechazarlas, conectarse a la videollamada cuando la cita está CONFIRMED, atender al paciente mediante video y audio en tiempo real, y registrar la ficha clínica con diagnóstico, receta y signos vitales al finalizar la consulta, siendo este actor el proveedor del servicio médico y el responsable de generar el contenido clínico que le da valor al historial del paciente.

El tercer actor es el Administrador, que corresponde a un usuario con rol ADMIN, creado también mediante el proceso de seed, cuya función es supervisar el estado general de la plataforma a través de un dashboard con indicadores clave de desempeño, y gestionar la limpieza de citas en caso de ser necesario, siendo el actor con el mayor nivel de privilegio dentro del sistema y el responsable de su operación.

El cuarto actor es el Sistema LiveKit, que es un actor externo no humano correspondiente al servidor de medios SFU (Selective Forwarding Unit) desplegado en un Droplet de DigitalOcean bajo el dominio medicampo-rtc.duckdns.org, cuya participación en el sistema es la de gestionar la infraestructura de comunicación en tiempo real basada en WebRTC, recibiendo los tokens de acceso generados por el backend y administrando las salas virtuales a las que se conectan los participantes de cada consulta.

### 1.2 Identificación de casos de uso

A continuación se listan los casos de uso del sistema agrupados por actor iniciador, describiendo brevemente el propósito de cada uno.

Casos de uso del Paciente:

UC01 Registrarse en el sistema, que representa el proceso de creación de una cuenta de tipo PATIENT mediante formulario con RUT, nombre completo, correo electrónico y contraseña, almacenando la contraseña hasheada con bcryptjs en la base de datos PostgreSQL.

UC02 Iniciar sesion, que representa el proceso de autenticación mediante correo y contraseña, validando las credenciales contra la base de datos y emitiendo un token JWT firmado con una clave secreta y una expiración de diez minutos, el cual debe incluirse en el encabezado Authorization de todas las peticiones posteriores.

UC03 Reservar teleconsulta, que representa el flujo mediante el cual el paciente selecciona un médico de la lista disponible, elige una fecha y uno de los horarios fijos predefinidos, y envía la solicitud al backend, el cual crea la cita en estado PENDING en la base de datos.

UC04 Consultar mis citas, que representa la visualización del listado de citas del paciente filtradas por su identificador, mostrando el estado actual de cada una, la fecha, el nombre del médico y la especialidad.

UC05 Ingresar a sala de videollamada, que representa el flujo de acceso a la sala de consulta virtual, el cual requiere que la cita esté en estado CONFIRMED, que el sistema valide que el paciente es efectivamente el asignado a esa cita, que se ejecute el pre-check de hardware para verificar el acceso a cámara y micrófono, y que se genere y consuma el token de acceso LiveKit para conectarse a la sala WebRTC.

UC06 Consultar historial clinico, que representa la visualización del registro de citas completadas con sus fichas clínicas asociadas, incluyendo diagnóstico, tratamiento, receta y signos vitales ingresados por el médico durante la consulta.

UC07 Imprimir documento clinico, que representa la generación de un documento imprimible con los datos de la consulta, formateado para uso médico con los datos del paciente, del médico y el contenido clínico completo.

Casos de uso del Médico:

UC02 Iniciar sesion, compartido con el Paciente y el Administrador.

UC08 Consultar solicitudes de cita, que representa la visualización de las citas en estado PENDING asignadas al médico, desde las cuales puede decidir aprobar o rechazar cada solicitud.

UC09 Aprobar o rechazar cita, que representa la acción del médico de cambiar el estado de una cita de PENDING a CONFIRMED o a CANCELLED, actualizando el registro en la base de datos mediante el endpoint PATCH /api/appointments/:id/status.

UC05 Ingresar a sala de videollamada, compartido con el Paciente, con la diferencia de que el médico tiene acceso al panel lateral de ficha clínica dentro de la sala.

UC10 Registrar ficha clinica, que representa el flujo mediante el cual el médico ingresa diagnóstico, receta y signos vitales durante o al finalizar la videollamada, enviando los datos al endpoint POST /api/clinical/:appointmentId, el cual ejecuta un upsert en la tabla ClinicalRecord y marca la cita como COMPLETED.

Casos de uso del Administrador:

UC02 Iniciar sesion, compartido.

UC11 Ver estadisticas de la plataforma, que representa el acceso al dashboard administrativo con KPIs del sistema, incluyendo total de pacientes, médicos, citas completadas, tasa de cumplimiento y el log de las últimas diez citas.

UC12 Eliminar todas las citas, que representa la operación de limpieza masiva del historial de citas mediante el endpoint DELETE /api/appointments/all, disponible exclusivamente para el rol ADMIN.

UC13 Consultar historial clinico de cualquier paciente, que es una extensión del UC06 disponible también para el Administrador, quien puede acceder a los registros de cualquier paciente sin restricción de propiedad.

### 1.3 Relaciones entre casos de uso

Existen relaciones de inclusion que representan comportamiento obligatorio compartido, siendo la más relevante la que vincula UC05 con el caso de uso Verificar autorizacion de sala, el cual incluye la consulta al endpoint GET /api/appointments/room/:roomId para confirmar que el usuario que intenta ingresar es efectivamente el paciente o el médico asignado a esa cita, además de la relación de inclusión entre UC05 y Ejecutar pre-check de hardware, que valida el acceso a dispositivos de captura antes de conectar al servidor WebRTC, y la inclusión de UC05 y UC10 en el caso Generar token LiveKit, que invoca el endpoint GET /api/livekit/token para obtener el AccessToken firmado con las credenciales de la API de LiveKit.

Existe también una relación de extension entre UC10 y UC07, ya que una vez registrada la ficha clínica y completada la cita, el paciente puede extender su consulta del historial hacia la impresión del documento clínico, siendo este último un comportamiento opcional que se activa bajo condición explícita del usuario.

### 1.4 Representacion textual del diagrama

La siguiente representación en texto estructurado modela el diagrama general de casos de uso del sistema mediCampo v2, siguiendo la notación estándar de UML para diagramas de casos de uso, donde los actores se ubican al exterior del límite del sistema y los casos de uso al interior, con las relaciones indicadas mediante etiquetas.

```
+-----------------------------------------------------------------------+
|                     SISTEMA mediCampo v2                              |
|                                                                       |
|   (UC01 Registrarse)                                                  |
|   (UC02 Iniciar sesion)                                               |
|   (UC03 Reservar teleconsulta)                                        |
|   (UC04 Consultar mis citas)                                          |
|   (UC05 Ingresar a sala de videollamada)                              |
|       includes --> (Verificar autorizacion de sala)                   |
|       includes --> (Ejecutar pre-check de hardware)                   |
|       includes --> (Generar token LiveKit)                            |
|   (UC06 Consultar historial clinico)                                  |
|       extends  <-- (UC07 Imprimir documento clinico)                  |
|   (UC08 Consultar solicitudes de cita)                                |
|   (UC09 Aprobar o rechazar cita)                                      |
|   (UC10 Registrar ficha clinica)                                      |
|       includes --> (Generar token LiveKit)                            |
|   (UC11 Ver estadisticas de la plataforma)                            |
|   (UC12 Eliminar todas las citas)                                     |
|   (UC13 Consultar historial de cualquier paciente)                    |
|                                                                       |
+-----------------------------------------------------------------------+

Paciente  ----  UC01, UC02, UC03, UC04, UC05, UC06, UC07
Medico    ----  UC02, UC08, UC09, UC05, UC10
Admin     ----  UC02, UC11, UC12, UC13
LiveKit   ----  Generar token LiveKit (actor externo receptor)
```

---

## Tarea 2: Redaccion del Caso de Uso de la Funcionalidad Principal

### 2.A Recordatorio de funcionalidades del software y objetivo del sistema

mediCampo v2 es una plataforma de telemedicina diseñada para resolver el problema de acceso a atención médica en comunidades rurales y zonas de difícil desplazamiento en Chile, donde la distancia geográfica y la escasez de especialistas impide a los pacientes recibir atención oportuna, siendo el objetivo del sistema conectar a pacientes con médicos especialistas mediante consultas médicas remotas de calidad clínica equivalente a una atención presencial, todo dentro de un entorno digital seguro, accesible desde dispositivos móviles y web.

Las funcionalidades que conforman el sistema son las siguientes, enumeradas en orden de dependencia funcional dentro del flujo de uso:

La autenticacion y gestion de usuarios es la base del sistema, implementada con JWT y bcryptjs, con tres roles diferenciados, PATIENT, DOCTOR y ADMIN, donde cada rol determina las rutas accesibles, las operaciones permitidas y los datos visibles, siendo el control de acceso aplicado en tres capas, la interfaz de usuario, el middleware de autenticación del backend, y la capa de servicios que verifica el rol y la propiedad del recurso antes de ejecutar operaciones.

La reserva de teleconsultas permite al paciente solicitar una cita con un médico específico en una fecha y horario determinado, generando un registro en la base de datos con estado PENDING que queda pendiente de aprobación por parte del médico seleccionado, siendo este el punto de entrada al flujo de valor principal del sistema.

La gestion del flujo de citas por parte del médico le permite revisar sus solicitudes pendientes, aceptar o rechazar cada una de ellas, y en caso de aceptación, se habilita el acceso a la sala de videollamada correspondiente tanto para el médico como para el paciente, siendo este paso de aprobación el que da inicio a la consulta efectiva.

La realizacion de teleconsulta mediante videollamada es la funcionalidad central y de mayor valor del sistema, implementada sobre el servidor de medios LiveKit con protocolo WebRTC, donde paciente y médico se conectan a una sala virtual identificada por un roomId vinculado a la cita en la base de datos, con soporte para video bidireccional, audio, chat mediante Data Channel, indicadores de calidad de red en tiempo real, y adaptación dinámica de la calidad del stream según el ancho de banda disponible mediante AdaptiveStream y Dynacast, siendo esta funcionalidad la que justifica la existencia de toda la arquitectura del sistema y el elemento por el cual el cliente estaría dispuesto a pagar.

El registro de la ficha clinica durante o al final de la consulta permite al médico documentar el diagnóstico, la prescripción farmacológica, los signos vitales del paciente y las observaciones clínicas relevantes, almacenando estos datos en la tabla ClinicalRecord vinculada a la cita correspondiente, y marcando la cita como COMPLETED al momento de guardar, siendo este registro el producto documental que el sistema genera a partir de la consulta y que constituye el valor clínico tangible para el paciente.

El historial clinico digital permite al paciente acceder a todas sus consultas completadas con sus fichas clínicas asociadas, incluyendo diagnóstico, tratamiento, alergias, signos vitales y la posibilidad de imprimir documentos clínicos formateados, siendo este historial el repositorio longitudinal de la salud del paciente dentro del sistema y uno de los elementos diferenciadores frente a soluciones informales de atención remota.

El dashboard administrativo permite al administrador monitorear el estado de la plataforma mediante indicadores clave como el número total de pacientes, médicos y citas, la tasa de cumplimiento de consultas y el log de actividad reciente, siendo esta funcionalidad la que le otorga al operador de la plataforma la visibilidad necesaria para tomar decisiones de gestión.

### 2.B Caso de uso UC05-UC10: Realizar Teleconsulta con Videollamada y Registro de Ficha Clinica

Este es el caso de uso de la funcionalidad más relevante del sistema mediCampo v2, siendo aquella por la cual el cliente estaría dispuesto a pagar, puesto que representa la entrega de valor central del producto, es decir, la consulta médica remota completa, desde la conexión a la sala virtual hasta la documentación clínica del encuentro, todo dentro de una misma experiencia fluida y técnicamente sólida.

La selección de esta funcionalidad se fundamenta en que, sin la videollamada con registro clínico integrado, el sistema se reduce a una agenda de citas sin valor diferencial, y es precisamente la combinación de la comunicación en tiempo real con la generación de documentación clínica dentro del mismo flujo lo que convierte a mediCampo en una herramienta de telemedicina real y no simplemente en un sistema de agendamiento remoto.

#### Identificacion del caso de uso

Nombre: Realizar Teleconsulta con Videollamada y Registro de Ficha Clinica

Identificador: UC-TELE-01

Version: 1.0

Fecha: 2026-05-18

Autor: Documento generado para la asignatura de Ingenieria de Software, en el contexto del proyecto mediCampo v2.

#### Actores

Actor principal: Medico, que es el profesional de salud que conduce la consulta, examina al paciente de forma remota y genera el registro clínico al finalizar.

Actor secundario: Paciente, que es el usuario que recibe la atención médica, participa en la videollamada y espera el diagnóstico y la prescripción.

Actor soporte: Sistema LiveKit, que es el servidor de medios externo que gestiona la sala WebRTC, enruta los flujos de audio y video entre los participantes, y valida los tokens de acceso generados por el backend.

#### Descripcion general

El caso de uso describe el proceso completo mediante el cual un médico y un paciente se conectan a una sala de videollamada asociada a una cita médica previamente confirmada, realizan la consulta médica en tiempo real con soporte de video, audio y chat, y al finalizar el médico registra la ficha clínica con diagnóstico y tratamiento, lo que marca la cita como completada y habilita al paciente para visualizar su historial actualizado.

#### Precondiciones

La primera precondición es que debe existir una cita en la base de datos con estado CONFIRMED, vinculando al médico y al paciente que van a participar, con un campo meetingLink que contiene el identificador de la sala LiveKit, siendo este el roomId que ambos actores utilizarán para solicitar su token de acceso y conectarse al servidor de medios.

La segunda precondición es que ambos actores, médico y paciente, deben estar autenticados en el sistema con un token JWT válido, ya que el endpoint de generación de tokens LiveKit requiere autenticación y verifica que el identity del solicitante corresponda al patientId o al doctorId registrados en la cita.

La tercera precondición es que el dispositivo del actor debe contar con acceso funcional a cámara y micrófono, verificados mediante el pre-check de hardware que se ejecuta antes de la conexión efectiva a LiveKit, ya que sin estos dispositivos la consulta no puede realizarse.

La cuarta precondición es que el servidor LiveKit debe estar operativo y accesible en la dirección wss://medicampo-rtc.duckdns.org, con los puertos 443 TCP para la señalización WebSocket segura, 7881 TCP para el transporte WebRTC sobre TCP, y el rango 50000 a 60000 UDP para los flujos de medios RTP habilitados en el firewall del Droplet de DigitalOcean.

#### Flujo principal de eventos

Paso 1, el paciente accede a la sección de mis citas en su dashboard y visualiza la cita en estado CONFIRMED, viendo el nombre del médico, la especialidad y la fecha de la consulta, junto a un botón habilitado con el texto Ingresar a la Sala.

Paso 2, el paciente hace clic en Ingresar a la Sala, lo que desencadena la navegación hacia la ruta /room/:roomId dentro de la aplicación React, donde roomId corresponde al valor del campo meetingLink de la cita en la base de datos.

Paso 3, el componente Videollamada.tsx solicita al backend la información de la cita mediante GET /api/appointments/room/:roomId, y el backend ejecuta la consulta en la base de datos para verificar que el userId del token JWT coincide con el patientId o el doctorId de esa cita, devolviendo los datos de identificación del participante remoto, es decir, el médico ve el nombre y RUT del paciente, y el paciente ve el nombre y especialidad del médico.

Paso 4, el componente PreFlightCheck.tsx se renderiza en pantalla y solicita permisos de cámara y micrófono al navegador o al sistema operativo móvil mediante la API navigator.mediaDevices.getUserMedia, mostrando una previsualización del video local para que el actor confirme que sus dispositivos funcionan correctamente.

Paso 5, el actor confirma que el audio y el video funcionan y hace clic en el botón de continuar del pre-check, lo que invoca el callback onReady() que dispara la solicitud de token LiveKit.

Paso 6, el frontend realiza una petición GET /api/livekit/token?room=:roomId&identity=:userId al backend, el cual ejecuta la lógica del LiveKitService, que verifica nuevamente que el userId es uno de los dos participantes autorizados de la cita, y genera un AccessToken firmado con la API Key y el API Secret del servidor LiveKit, con los grants roomJoin, canPublish y canSubscribe habilitados y una expiración de diez minutos.

Paso 7, el frontend recibe el token y llama a room.connect(LIVEKIT_URL, token), lo que inicia el handshake WebSocket con el servidor LiveKit en wss://medicampo-rtc.duckdns.org, y una vez establecida la conexión, el servidor LiveKit valida el token, ubica al participante en la sala indicada y comienza a intercambiar los flujos de medios RTP mediante el protocolo SRTP sobre los puertos UDP del rango configurado.

Paso 8, el componente GridLayout renderiza un ParticipantTile por cada participante conectado a la sala, mostrando el video local en la esquina inferior derecha y el video remoto ocupando el área principal de la pantalla, con los controles de micrófono, cámara y colgar en la barra inferior.

Paso 9, la consulta médica se desarrolla en tiempo real, con video bidireccional, audio full-duplex gestionado por LiveKit, y la posibilidad de intercambiar mensajes de texto mediante el Data Channel WebRTC que alimenta el componente ChatConsulta.tsx, mientras el componente IndicadorCalidadRed monitorea la latencia y la pérdida de paquetes en segundo plano y muestra un indicador visual en pantalla.

Paso 10, el médico, que cuenta con un panel lateral visible solo para su rol, completa el formulario de ficha clínica con los campos de diagnóstico en el campo diagnosis y prescripción en el campo prescription, con soporte para alergias, observaciones adicionales y constantes vitales como peso, talla, presión arterial, temperatura, frecuencia cardíaca y saturación de oxígeno.

Paso 11, el médico hace clic en el botón Guardar Ficha, lo que desencadena una petición POST /api/clinical/:appointmentId con el cuerpo del formulario en formato JSON, y el backend ejecuta ClinicalService.upsertRecord, que verifica que el userId del token sea igual al doctorId de la cita, realiza un upsert en la tabla ClinicalRecord vinculada al appointmentId, y actualiza el estado de la cita de CONFIRMED a COMPLETED en la tabla Appointment.

Paso 12, el backend responde con HTTP 200 y los datos de la ficha guardada, el médico es redirigido automáticamente a /dashboard-medico, y la sala LiveKit es desconectada mediante room.disconnect(), liberando los recursos del servidor de medios.

Paso 13, el paciente puede ahora acceder a /historial y visualizar la cita recién completada con todos los datos clínicos registrados por el médico, con la opción de imprimir el documento mediante window.print() en un formato optimizado para uso médico.

#### Flujos alternativos

Flujo alternativo A, fallo en el pre-check de hardware, en el paso 4, si el navegador deniega el permiso de cámara o micrófono, o si no se detecta ningún dispositivo de captura, el componente PreFlightCheck muestra un mensaje de error indicando el motivo específico del fallo, y ofrece un botón para reintentar la solicitud de permisos, permaneciendo bloqueado el acceso a la sala hasta que los dispositivos estén disponibles y funcionales.

Flujo alternativo B, token JWT expirado al solicitar token LiveKit, en el paso 6, si el token JWT del usuario ha expirado antes de la solicitud, el backend devuelve HTTP 401 Unauthorized, y el frontend redirige al usuario a la pantalla de login para que renueve su sesión, debiendo luego reiniciar el flujo desde el paso 1.

Flujo alternativo C, desconexion durante la videollamada, en el paso 7 o posterior, si la conexión con el servidor LiveKit se interrumpe por inestabilidad de red, el componente Videollamada detecta el evento de desconexión emitido por el SDK de LiveKit, muestra la pantalla de Reconectando con un indicador de progreso, e intenta reconectarse automáticamente hasta tres veces con intervalos crecientes de dos, cuatro y ocho segundos, y si los tres intentos fallan, redirige al usuario a su dashboard con un mensaje de error explicativo, sin perder los datos de la ficha clínica que el médico haya podido guardar previamente.

Flujo alternativo D, el médico abandona la sala sin guardar la ficha clinica, en el paso 10 o 11, si el médico cierra la sala o navega fuera sin haber guardado la ficha, la cita permanece en estado CONFIRMED y no se genera ningún ClinicalRecord asociado, debiendo el médico reingresar a la sala o contactar al administrador para resolver la situación, siendo este un caso de manejo pendiente en la versión actual del sistema.

Flujo alternativo E, usuario no autorizado intenta acceder a la sala, en el paso 3, si el userId del token JWT no coincide ni con el patientId ni con el doctorId de la cita consultada, el backend devuelve HTTP 403 Forbidden y el frontend muestra un mensaje de acceso denegado, redirigiendo al usuario a su dashboard sin permitir el acceso a la sala.

#### Postcondiciones

La postcondición exitosa es que la cita queda registrada con estado COMPLETED en la tabla Appointment, se ha creado o actualizado un ClinicalRecord con los datos clínicos de la consulta, el paciente puede visualizar la ficha en su historial clínico, la sala LiveKit ha sido desconectada y sus recursos liberados, y el médico ha sido redirigido a su dashboard donde puede ver la cita en el historial de consultas realizadas.

La postcondición de fallo es que si la ficha no fue guardada antes de la desconexión, la cita permanece en estado CONFIRMED sin ClinicalRecord asociado, requiriendo intervención manual para su resolución.

#### Reglas de negocio

La primera regla de negocio establece que solamente el médico asignado a la cita puede registrar la ficha clínica correspondiente, siendo esta verificación ejecutada en la capa de servicios del backend mediante la comparación entre el userId del token JWT y el doctorId del registro de la cita, garantizando que ningún otro actor pueda crear diagnósticos en nombre de un médico ajeno.

La segunda regla de negocio establece que una cita solo puede accederse mediante la sala de videollamada si su estado es CONFIRMED, siendo el estado PENDING insuficiente para habilitar el ingreso, ya que implica que el médico aún no ha aprobado la solicitud.

La tercera regla de negocio establece que el token de acceso a la sala LiveKit tiene una validez de diez minutos desde su emisión, siendo necesario generar un nuevo token si la conexión se interrumpe y supera este plazo, lo cual implica que el flujo de reconexión debe considerar una nueva solicitud al endpoint de tokens antes de intentar reconectarse al servidor de medios.

La cuarta regla de negocio establece que el registro de la ficha clínica es atómico respecto al cambio de estado de la cita, es decir, ambas operaciones, el upsert del ClinicalRecord y el update del Appointment a COMPLETED, deben completarse juntas o no completarse ninguna, garantizando la consistencia entre el estado de la cita y la existencia del registro clínico asociado.

La quinta regla de negocio establece que el paciente solo puede visualizar su propio historial clínico, siendo el filtro de propiedad aplicado en el servicio ClinicalService que verifica que el patientId de los registros solicitados coincide con el userId del token del solicitante, con la excepción del rol ADMIN que puede consultar cualquier historial.

#### Requerimientos no funcionales asociados

El tiempo de establecimiento de la llamada desde que el pre-check es completado hasta que los streams de video son visibles debe ser inferior a cinco segundos en condiciones de red con latencia menor a 150 milisegundos, siendo este un requisito de usabilidad crítico para la experiencia de la teleconsulta.

La calidad de la videollamada debe adaptarse automáticamente al ancho de banda disponible mediante los mecanismos AdaptiveStream y Dynacast de LiveKit, priorizando la continuidad de la comunicación sobre la calidad máxima del video, especialmente en conexiones rurales con baja velocidad.

La ficha clínica debe persistir de forma segura en la base de datos PostgreSQL de DigitalOcean con una política de respaldo que garantice la disponibilidad de los registros médicos, dado que estos constituyen documentación clínica con relevancia legal para el paciente y el profesional de salud.

---

## Cierre del documento

El presente análisis cubre las dos tareas de trabajo pesado solicitadas, entregando primero el diagrama general de casos de uso del sistema mediCampo v2 con sus cuatro actores, trece casos de uso identificados, y las relaciones de inclusión y extensión entre ellos, y luego la redacción completa del caso de uso UC-TELE-01 correspondiente a la funcionalidad de mayor valor del sistema, que es la teleconsulta con videollamada y registro de ficha clínica, desarrollada con el nivel de detalle técnico que exige el enfoque de trabajo pesado, incluyendo los flujos principales, los flujos alternativos, las pre y postcondiciones, y las reglas de negocio que gobiernan su comportamiento dentro del contexto de la arquitectura implementada.
