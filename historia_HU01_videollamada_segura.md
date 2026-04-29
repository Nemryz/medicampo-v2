# HU01: Videollamada Segura - Analisis y Documentacion Tecnica

## 1. Introduccion y Contexto

El proyecto mediCampo-v2 es una plataforma de telemedicina disenada para conectar pacientes rurales con medicos a traves de videollamadas seguras, historial clinico digital, reserva de teleconsultas y panel de administracion. La historia de usuario HU01, denominada "Videollamada Segura", es una de las historias fundamentales del sistema, ya que representa el nucleo funcional de la plataforma: la capacidad de realizar consultas medicas a distancia con garantias de confidencialidad y seguridad.

La decision de priorizar HU01 desde el inicio del proyecto respondio a la necesidad critica de los pacientes rurales de acceder a atencion medica especializada sin tener que desplazarse grandes distancias. En zonas rurales, donde la conectividad a internet es limitada y la infraestructura de salud es escasa, una videollamada segura y confiable puede marcar la diferencia entre recibir atencion medica oportuna o no recibirla.

Originalmente, el proyecto utilizaba una arquitectura Peer-to-Peer (P2P) para las videollamadas, donde cada participante enviaba su video y audio directamente al otro. Sin embargo, esta arquitectura presentaba problemas de rendimiento en redes inestables, tipicas de zonas rurales, ya que cada participante debia subir su stream a todos los demas, consumiendo ancho de banda de forma proporcional al numero de participantes. La migracion a una arquitectura SFU (Selective Forwarding Unit) proporcionada por LiveKit resolvio estos problemas, ya que el servidor central optimiza el bitrate para cada participante individual, adaptandose a las condiciones de la red de cada uno.

---

## 2. Analisis Detallado de la Historia de Usuario HU01

### 2.1. Descripcion de la Historia

Yo como usuario (paciente rural) necesito realizar una videollamada con un medico, para poder tener una consulta medica y recibir un diagnostico y tratamiento, con la seguridad de que la informacion compartida es confidencial y no puede ser interceptada por terceros.

### 2.2. Criterios de Aceptacion

1. El paciente debe poder iniciar una videollamada con un medico desde su navegador web, sin necesidad de instalar software adicional.
2. La videollamada debe estar protegida por autenticacion: solo usuarios con una cita confirmada pueden acceder a la sala.
3. La transmision de video y audio debe estar cifrada de extremo a extremo.
4. El sistema debe funcionar en conexiones de internet limitadas, tipicas de zonas rurales.
5. El medico debe poder ver y escuchar al paciente, y viceversa.
6. La videollamada debe incluir un chat de texto en tiempo real como canal de respaldo.
7. El sistema debe validar el hardware del usuario (camara y microfono) antes de permitir el ingreso a la sala.
8. Solo los participantes autorizados (medico y paciente asignados a la cita) deben poder acceder a la sala.

### 2.3. Tareas Planificadas para HU01

1. (Backend) Despliegue de LiveKit y configuracion de credenciales (API_KEY y API_SECRET).
2. (Backend) Generacion de tokens de acceso seguros con permisos especificos y tiempo de vida limitado.
3. (Frontend) Integracion del SDK de LiveKit en React para renderizar la sala de videollamada.
4. (Frontend) Implementacion de controles de camara, microfono y finalizacion de llamada.
5. (Frontend) Implementacion de chat de texto en tiempo real durante la videollamada.
6. (Frontend) Implementacion de pantalla de validacion de hardware (PreFlightCheck).
7. (Frontend) Implementacion de sandbox de pruebas (LiveKitTest) para desarrollo y testing.
8. (Frontend) Reduccion de consumo de ancho de banda para conexiones rurales.

---

## 3. Estado Actual de Implementacion

### 3.1. Componentes Implementados y Funcionales

Backend - Controlador LiveKit (livekitController.ts): Implementado y funcional. El controlador recibe los parametros room y identity desde la query string, extrae el userId del token JWT del usuario autenticado, llama a LiveKitService para generar el token y devuelve el token al cliente. Maneja errores con la clase AppError para codigos HTTP apropiados.

Backend - Servicio LiveKit (LiveKitService.ts): Implementado y funcional. La clase LiveKitService implementa la interfaz ILiveKitService. Lee las credenciales LIVEKIT_API_KEY y LIVEKIT_API_SECRET desde las variables de entorno. Crea un AccessToken con identity del participante, TTL de 10 minutos y grants para roomJoin, canPublish, canSubscribe y canPublishData. Valida que los parametros obligatorios esten presentes y que las claves API esten configuradas. Adicionalmente, verifica que el usuario autenticado este asignado a la cita asociada a la sala antes de generar el token, excepto para el sandbox de pruebas (test-room-livekit).

Backend - Interfaz ILiveKitService: Implementada. Define el contrato con el metodo getAccessToken(roomName, participantName, userId?) que retorna una promesa con un objeto { token: string }.

Backend - Ruta LiveKit (livekitRoutes.ts): Implementada y funcional. Expone el endpoint GET /api/livekit/token protegido con el middleware de autenticacion JWT. Incluye un wrapper de compatibilidad de tipos para AuthRequest.

Frontend - Componente Videollamada (Videollamada.tsx): Implementado y funcional. Renderiza la sala de LiveKit con LiveKitRoom, RoomAudioRenderer, GridLayout y ParticipantTile. Incluye controles personalizados para microfono, camara y finalizacion de llamada. Muestra panel lateral con ficha clinica para el medico y resumen para el paciente. Integra el componente ChatConsulta. Obtiene el token de LiveKit desde el backend y los datos de la cita desde el endpoint de appointments. Incluye las siguientes mejoras implementadas:

- Adaptive streaming con adaptiveStream: true y dynacast: true para reducir el consumo de ancho de banda en conexiones limitadas.
- Codec VP9 para mejor compresion de video en redes lentas.
- DTX (Discontinuous Transmission) y RED (Redundant Audio Data) para optimizar la transmision de audio.
- Indicador de calidad de red en tiempo real que monitorea el estado de la conexion y los tracks de los participantes.
- Logica de reconexion automatica con hasta 3 intentos y backoff exponencial.
- Pantalla de error de conexion con boton de reintento manual.
- Limpieza de conexiones al desmontar el componente, incluyendo desconexion de LiveKit y detencion de tracks de media.

Frontend - Controles Personalizados (ControlesPersonalizados): Implementado y funcional. Botones para activar/desactivar microfono y camara con feedback visual de colores (verde para activo, rojo para inactivo). Boton para finalizar la llamada. Muestra estado de carga mientras se inicializa el participante.

Frontend - Indicador de Calidad de Red (IndicadorCalidadRed): Implementado y funcional. Componente que se suscribe a los eventos de LiveKit (Disconnected, Reconnecting, Reconnected) y monitorea periodicamente el estado de los tracks de video de los participantes remotos para estimar la calidad de la conexion. Muestra un icono de Wifi con color verde (buena), amarillo (regular) o rojo (mala) y un indicador de desconexion.

Frontend - Chat de Consulta (ChatConsulta.tsx): Implementado y funcional. Utiliza el hook useChat de LiveKit para la mensajeria en tiempo real a traves del Data Channel de WebRTC. Los mensajes son efimeros y se sincronizan automaticamente con todos los participantes de la sala.

Frontend - Validacion de Hardware (PreFlightCheck.tsx): Implementado y funcional. Solicita permisos de camara y microfono al usuario. Si la camara falla, intenta solo audio. Si ambos fallan, muestra instrucciones para desbloquear permisos manualmente. Muestra vista previa del video local si esta disponible. Boton para ingresar a la sala solo cuando el audio esta disponible.

Frontend - Sandbox de Pruebas (LiveKitTest.tsx): Implementado y funcional. Permite probar la videollamada sin depender del flujo de citas real. Ofrece dos perfiles preconfigurados: Doctor y Paciente. Genera un roomId de prueba y redirige a la interfaz de videollamada.

### 3.2. Componentes Pendientes de Implementar

No quedan tareas pendientes de HU01. Todas las tareas planificadas en el backlog han sido implementadas:

1. Despliegue de LiveKit y credenciales: Completado. Las variables LIVEKIT_API_KEY y LIVEKIT_API_SECRET estan configuradas en el entorno.
2. Generacion de tokens seguros: Completado. LiveKitService genera tokens con TTL de 10 minutos y permisos especificos.
3. Integracion React: Completado. Videollamada.tsx utiliza LiveKitRoom con todos los componentes necesarios.
4. Controles de camara/microfono: Completado. ControlesPersonalizados permite activar/desactivar hardware.
5. Chat en tiempo real: Completado. ChatConsulta.tsx utiliza useChat de LiveKit.
6. Validacion de hardware: Completado. PreFlightCheck.tsx valida camara y microfono antes de ingresar.
7. Sandbox de pruebas: Completado. LiveKitTest.tsx permite pruebas aisladas.
8. Reduccion de consumo para conexiones rurales: Completado. Se implemento adaptiveStream, dynacast, codec VP9, DTX y RED en las opciones de LiveKitRoom.
9. Verificacion de identidad en la sala: Completado. LiveKitService verifica que el usuario autenticado este asignado a la cita antes de generar el token.
10. Limpieza de conexiones al desmontar: Completado. El useEffect de cleanup desconecta LiveKit y detiene tracks de media.
11. Reconexion automatica: Completado. Logica con hasta 3 intentos y backoff exponencial.
12. Indicador de calidad de red: Completado. IndicadorCalidadRed monitorea la conexion en tiempo real.

---

## 4. Principios Detras de la Creacion de HU01

### 4.1. Principio de Seguridad por Diseno

HU01 fue creada bajo el principio de que la seguridad debe estar integrada en la arquitectura desde el inicio, no agregada como una capa posterior. Esto se manifiesta en varias decisiones de diseno:

Cada sala de videollamada tiene un identificador unico generado aleatoriamente al crear la cita, lo que hace practicamente imposible que un tercero adivine la URL de una sala.

El acceso a la sala requiere un token JWT firmado por el servidor con credenciales maestras (API_KEY y API_SECRET), que solo el backend conoce. El frontend nunca tiene acceso a estas credenciales.

El token tiene un tiempo de vida limitado de 10 minutos, lo que reduce la ventana de exposicion en caso de que un token sea interceptado.

Los permisos del token son especificos: canPublish para enviar audio y video, canSubscribe para recibir audio y video de otros participantes, y canPublishData para enviar mensajes de chat. Esto sigue el principio de minimo privilegio.

Adicionalmente, se implemento la verificacion de que el usuario que solicita el token sea el paciente o medico asignado a la cita asociada a la sala. Si el usuario no tiene una cita valida para esa sala, el backend rechaza la solicitud con un error 403.

### 4.2. Principio de Resiliencia en Conexiones Limitadas

HU01 fue disenada considerando que los usuarios finales son pacientes rurales con conexiones de internet potencialmente inestables. Esto se refleja en:

La migracion de arquitectura P2P a SFU (Selective Forwarding Unit), donde el servidor central recibe un unico stream de cada participante y lo distribuye a los demas. Esto reduce el ancho de banda de subida requerido, que es tipicamente el cuello de botella en conexiones asimetricas.

La pantalla de PreFlightCheck que valida el hardware antes de ingresar a la sala, evitando que el usuario entre a una videollamada sin microfono funcional.

El modo "Solo Audio" que permite al usuario participar en la consulta aunque su camara no este disponible, garantizando que al menos la comunicacion verbal sea posible.

La configuracion de adaptiveStream y dynacast en LiveKitRoom, que permite al servidor SFU ajustar automaticamente la calidad del video segun el ancho de banda disponible de cada participante.

El uso del codec VP9, que ofrece mejor compresion que H264, reduciendo el consumo de ancho de banda hasta en un 50% para la misma calidad de video.

La implementacion de DTX (Discontinuous Transmission) y RED (Redundant Audio Data) para optimizar la transmision de audio en condiciones de red adversas.

El indicador de calidad de red que permite al usuario saber en tiempo real si su conexion es buena, regular o mala.

La logica de reconexion automatica con hasta 3 intentos y backoff exponencial, que permite recuperarse de cortes de conexion sin intervencion del usuario.

### 4.3. Principio de Separacion de Responsabilidades

HU01 separa claramente las responsabilidades entre backend y frontend:

El backend es responsable de la autenticacion, autorizacion y generacion de tokens. No maneja la transmision de video ni audio.

El frontend es responsable de la captura de medios, la renderizacion de la sala y la interaccion con el usuario. No maneja claves secretas ni logica de autenticacion.

LiveKit (el servidor SFU) es responsable de la mezcla y distribucion de streams. No almacena informacion de usuarios ni historial de consultas.

### 4.4. Principio de Experiencia de Usuario Consistente

HU01 fue disenada para proporcionar una experiencia de usuario consistente independientemente del rol:

El medico ve un panel de ficha clinica donde puede tomar notas y guardar el diagnostico durante la llamada.

El paciente ve un resumen de la consulta con los datos del medico y la especialidad.

Ambos roles tienen acceso al chat de texto como canal de respaldo.

Ambos roles tienen controles para activar/desactivar microfono y camara.

Ambos roles ven el indicador de calidad de red en la barra superior.

---

## 5. Arquitectura de HU01

### 5.1. Arquitectura General

La videollamada segura se implementa mediante una arquitectura de tres componentes:

El servidor LiveKit, desplegado en DigitalOcean, actua como SFU (Selective Forwarding Unit). Recibe los streams de video y audio de cada participante y los reenvia a los demas participantes de la sala. No almacena los streams, solo los retransmite en tiempo real.

El backend de mediCampo actua como emisor de tokens. Cuando un usuario autenticado solicita un token, el backend verifica que el usuario tenga una cita valida para esa sala y genera un token firmado con las credenciales maestras de LiveKit.

El frontend en React actua como cliente. Captura el video y audio del usuario mediante la API getUserMedia del navegador, se conecta al servidor LiveKit usando el token, y renderiza los streams de los participantes.

### 5.2. Flujo de la Videollamada

El flujo completo de una videollamada sigue esta secuencia:

El paciente agenda una cita a traves del modulo de reserva (HU04). El sistema genera un enlace unico de sala (meetingLink) y lo asocia a la cita en la base de datos.

El medico acepta la cita desde su dashboard, cambiando el estado de PENDING a CONFIRMED.

Cuando llega la hora de la consulta, el paciente o el medico acceden al enlace de la sala desde su dashboard.

El frontend muestra la pantalla de PreFlightCheck, que solicita permisos de camara y microfono al usuario.

Una vez que el hardware esta validado, el frontend solicita un token al backend mediante GET /api/livekit/token?room=roomId&identity=userName.

El backend verifica el JWT del usuario mediante el middleware protect, extrae el userId del token, y llama a LiveKitService.getAccessToken.

LiveKitService verifica en la base de datos que el usuario tenga una cita asignada a esa sala. Si no la tiene, rechaza la solicitud con error 403.

Si la verificacion es exitosa, LiveKitService genera un AccessToken con los permisos correspondientes y lo devuelve.

El frontend recibe el token y se conecta al servidor LiveKit usando LiveKitRoom con opciones de adaptive streaming.

Una vez conectado, el usuario puede ver y escuchar a los otros participantes, usar el chat de texto, y el medico puede guardar la ficha clinica.

El indicador de calidad de red monitorea la conexion en tiempo real. Si la conexion se pierde, el sistema intenta reconectar automaticamente hasta 3 veces.

Al finalizar, cualquiera de los participantes puede colgar, lo que desconecta a todos de la sala. Al desmontar el componente, se limpian las conexiones y se detienen los tracks de media.

### 5.3. Componentes Tecnicos

Backend:

LiveKitService es la clase que encapsula la logica de generacion de tokens. Lee las variables de entorno LIVEKIT_API_KEY y LIVEKIT_API_SECRET. Verifica que el usuario autenticado este asignado a la cita asociada a la sala consultando la base de datos. Crea un AccessToken con identity del participante, TTL de 10 minutos y grants especificos. Implementa la interfaz ILiveKitService para permitir inyeccion de dependencias y pruebas unitarias.

livekitController es el controlador que maneja la peticion HTTP. Extrae los parametros room y identity de la query string, extrae el userId del token JWT del usuario autenticado, llama a LiveKitService y devuelve el token en formato JSON. Maneja errores con la clase AppError para codigos HTTP apropiados.

livekitRoutes define la ruta GET /api/livekit/token y aplica el middleware de autenticacion JWT. Incluye un wrapper de compatibilidad de tipos para manejar AuthRequest.

Frontend:

Videollamada.tsx es el componente principal que renderiza la sala. Utiliza LiveKitRoom de @livekit/components-react como contenedor principal con opciones de adaptive streaming (adaptiveStream, dynacast, codec VP9, DTX, RED). Dentro, utiliza RoomAudioRenderer para el audio, GridLayout y ParticipantTile para el video de los participantes. Incluye ControlesPersonalizados para microfono, camara y finalizacion. Muestra un panel lateral con la ficha clinica o resumen segun el rol del usuario. Incluye el componente IndicadorCalidadRed en la barra superior. Implementa logica de reconexion automatica con hasta 3 intentos y backoff exponencial. Implementa limpieza de conexiones al desmontar el componente.

IndicadorCalidadRed es un componente que se suscribe a los eventos de LiveKit (Disconnected, Reconnecting, Reconnected) y monitorea periodicamente el estado de los tracks de video de los participantes remotos. Muestra un icono de Wifi con color indicativo de la calidad.

ControlesPersonalizados es un subcomponente que gestiona el hardware del usuario. Utiliza el hook useLocalParticipant para acceder al estado del microfono y camara. Proporciona botones con feedback visual de colores.

ChatConsulta.tsx es un componente independiente que gestiona la mensajeria de texto. Utiliza el hook useChat de LiveKit que se comunica por el Data Channel de WebRTC.

PreFlightCheck.tsx es la pantalla de validacion de hardware. Solicita permisos de camara y microfono, muestra vista previa del video local, y permite al usuario ingresar a la sala solo cuando el audio esta disponible.

LiveKitTest.tsx es un sandbox de pruebas que permite probar la videollamada sin depender del flujo de citas real.

---

## 6. Importancia de HU01 dentro del Codigo

### 6.1. Nucleo Funcional del Sistema

HU01 representa el nucleo funcional de mediCampo. Sin la videollamada segura, la plataforma perderia su proposito fundamental: conectar pacientes rurales con medicos a distancia. Todas las demas historias de usuario (HU02 Historial Clinico, HU04 Reserva de Citas, HU09 Sincronizacion de Identidad) dependen de HU01 para entregar valor al usuario final.

### 6.2. Dependencias con Otras Historias

HU01 tiene dependencias directas con:

HU04 (Reserva de Teleconsultas): La videollamada solo puede ocurrir si existe una cita confirmada. El enlace de la sala se genera al crear la cita.

HU02 (Historial Clinico): La ficha clinica se guarda durante la videollamada. El panel lateral en Videollamada.tsx permite al medico tomar notas mientras consulta.

HU03 (Registro e Inicio de Sesion): Solo usuarios autenticados pueden acceder a las salas. El middleware protect verifica el JWT antes de generar tokens.

HU09 (Sincronizacion de Identidad): La verificacion de que el usuario que ingresa a la sala es realmente el paciente asignado a la cita ya esta implementada dentro de HU01, eliminando la dependencia externa.

HU07 (Videollamada de Alta Disponibilidad): Las mejoras de rendimiento para conexiones rurales (adaptiveStream, dynacast, VP9, DTX, RED) ya estan implementadas dentro de HU01, eliminando la dependencia externa.

### 6.3. Impacto en la Experiencia de Usuario

HU01 tiene el impacto mas directo en la experiencia de usuario de toda la plataforma. Una videollamada que funciona mal, se corta frecuentemente o tiene baja calidad de audio/video genera una experiencia negativa que puede llevar al abandono de la plataforma. Por esta razon, la calidad de la implementacion de HU01 es critica para la adopcion del sistema.

### 6.4. Complejidad Tecnica

HU01 es tecnicamente la historia de usuario mas compleja del proyecto, ya que involucra:

Integracion con un servicio externo (LiveKit) que requiere configuracion de servidor, credenciales y dominio.

Manejo de streams de video y audio en tiempo real, con requisitos de baja latencia.

Gestion de permisos de hardware del navegador, que varian segun el sistema operativo y el navegador.

Adaptacion a diferentes condiciones de red, desde conexiones de fibra optica hasta conexiones moviles 3G en zonas rurales.

Sincronizacion de estado entre multiples participantes en tiempo real.

Verificacion de identidad contra la base de datos antes de permitir el acceso a la sala.

Manejo de reconexiones y recuperacion de errores de red.

---

## 7. Por Que HU01 es Prioritario

### 7.1. Valor Directo para el Usuario Final

HU01 entrega valor directo al usuario final desde el momento de su implementacion. Un paciente rural puede, desde el primer dia, agendar y realizar una consulta medica a distancia. Ninguna otra historia de usuario tiene un impacto tan inmediato y tangible en la vida de los usuarios.

### 7.2. Habilitador de Otras Funcionalidades

HU01 es un habilitador para otras funcionalidades del sistema. Sin la videollamada, el historial clinico (HU02) no tendria contexto de uso, la reserva de citas (HU04) no tendria un proposito claro, y la sincronizacion de identidad (HU09) no tendria sentido. HU01 es la base sobre la que se construyen las demas historias.

### 7.3. Diferenciador del Proyecto

La videollamada segura es el principal diferenciador de mediCampo frente a otras soluciones de salud digital. Mientras que muchas plataformas ofrecen agendamiento de citas o historial clinico, pocas ofrecen una videollamada integrada, segura y optimizada para conexiones rurales. HU01 es lo que hace unico al proyecto.

### 7.4. Requisito para Validacion con Usuarios Reales

Para realizar pruebas con usuarios reales (pacientes y medicos), la videollamada debe estar funcionando. Sin HU01, no es posible hacer sesiones de validacion, obtener feedback de usuarios, ni demostrar el valor del proyecto a stakeholders. HU01 es un requisito para salir del entorno de desarrollo y entrar en produccion.

### 7.5. Complejidad y Riesgo Tecnico

HU01 es la historia de usuario con mayor complejidad tecnica y, por lo tanto, con mayor riesgo de retrasos o problemas tecnicos. Abordarla primero permite identificar y resolver problemas de integracion, rendimiento y seguridad en una etapa temprana, cuando los cambios son menos costosos.

---

## 8. Pendientes Identificados en HU01

Tras el analisis completo del codigo fuente y la implementacion de las mejoras, todos los pendientes identificados originalmente en HU01 han sido resueltos:

### 8.1. Optimizacion de Ancho de Banda para Conexiones Rurales

Estado: COMPLETADO.

Se implementaron las siguientes optimizaciones en las opciones de LiveKitRoom:

adaptiveStream: true permite al servidor SFU ajustar automaticamente la calidad del video segun el ancho de banda disponible de cada participante.

dynacast: true permite enviar multiples capas de calidad de video (simulcast) para que el servidor SFU pueda elegir la capa adecuada para cada receptor.

videoCodec: 'vp9' utiliza el codec VP9 que ofrece mejor compresion que H264, reduciendo el consumo de ancho de banda hasta en un 50% para la misma calidad de video.

dtx: true (Discontinuous Transmission) reduce el consumo de ancho de banda de audio durante los silencios.

red: true (Redundant Audio Data) envia paquetes de audio redundantes para recuperar perdidas de paquetes en redes inestables.

Adicionalmente, se implemento el componente IndicadorCalidadRed que monitorea la calidad de la conexion en tiempo real y muestra un indicador visual al usuario.

### 8.2. Verificacion de Identidad en la Sala

Estado: COMPLETADO.

Se modifico LiveKitService.getAccessToken para recibir el userId del usuario autenticado. Antes de generar el token, el servicio consulta la base de datos para verificar que exista una cita donde el usuario (como paciente o medico) este asignado a la sala solicitada. Si no existe una cita valida, el servicio rechaza la solicitud con un error 403.

La interfaz ILiveKitService se actualizo para incluir el parametro opcional userId en el metodo getAccessToken.

El controlador livekitController extrae el userId del token JWT del usuario autenticado y lo pasa al servicio.

### 8.3. Limpieza de Conexiones al Desmontar

Estado: COMPLETADO.

Se agrego un useEffect de cleanup en Videollamada.tsx que:

Desconecta la sala de LiveKit llamando a room.disconnect() si existe una conexion activa.

Detiene todos los tracks de media activos (camara y microfono) para liberar los recursos del navegador.

Maneja errores de forma segura, sin lanzar excepciones si no hay conexion activa.

### 8.4. Manejo de Errores de Red

Estado: COMPLETADO.

Se implemento logica de reconexion automatica con las siguientes caracteristicas:

Hasta 3 intentos de reconexion cuando falla la obtencion del token.

Backoff exponencial: el tiempo de espera entre reintentos aumenta progresivamente (2 segundos, 4 segundos, 6 segundos).

Pantalla de estado "Reconectando..." que muestra el numero de intento actual.

Pantalla de error de conexion con boton de reintento manual cuando se agotan los intentos.

Manejo del evento onError de LiveKitRoom que detecta perdidas de conexion durante la llamada y activa la reconexion.

---

## 9. Estructura de Archivos Relacionados con HU01

Backend:

backend/src/controllers/livekitController.ts - Controlador que maneja la generacion de tokens con verificacion de identidad.
backend/src/services/LiveKitService.ts - Servicio que implementa la logica de generacion de tokens y verificacion de citas.
backend/src/interfaces/ILiveKitService.ts - Interfaz que define el contrato del servicio con userId opcional.
backend/src/routes/livekitRoutes.ts - Ruta que expone el endpoint de tokens con wrapper de tipos.

Frontend:

frontend/src/components/Videollamada.tsx - Componente principal de la sala de videollamada con adaptive streaming, reconexion y cleanup.
frontend/src/components/PreFlightCheck.tsx - Pantalla de validacion de hardware.
frontend/src/components/ChatConsulta.tsx - Componente de chat en tiempo real.
frontend/src/components/LiveKitTest.tsx - Sandbox de pruebas para desarrolladores.

---

## 10. Conclusion

La historia de usuario HU01 (Videollamada Segura) es el corazon funcional del proyecto mediCampo-v2. Su implementacion actual es completa y robusta, cubriendo todos los aspectos planificados en el backlog: autenticacion segura mediante tokens JWT, transmision de video y audio en tiempo real a traves de LiveKit, chat de texto como canal de respaldo, validacion de hardware antes del ingreso, sandbox de pruebas para desarrollo, optimizacion de ancho de banda para conexiones rurales, verificacion de identidad en la sala, limpieza de conexiones al desmontar, y manejo de errores de red con reconexion automatica.

Todas las tareas planificadas para HU01 han sido implementadas y verificadas. El proyecto compila sin errores tanto en backend como en frontend. Las funcionalidades de videollamada y audio continuan operando correctamente.

HU01 es prioritaria porque entrega valor directo al usuario final, habilita otras funcionalidades del sistema, diferencia al proyecto de otras soluciones, es requisito para validacion con usuarios reales, y presenta la mayor complejidad tecnica del proyecto, lo que hace recomendable abordarla tempranamente.
