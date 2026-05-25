# Guía sobre LiveKit y WebRTC en mediCampo v2

Este documento explica desde lo más básico qué es LiveKit, cómo funciona la tecnología WebRTC que está debajo, por qué los elegimos para construir las videollamadas de mediCampo v2 y cómo se integran concretamente con el resto del sistema. La idea es que cualquier integrante del equipo entienda los conceptos detrás de las comunicaciones en tiempo real por internet, incluso si nunca antes había trabajado con esta clase de tecnología.

## El problema de las videollamadas por internet

Para entender por qué necesitamos tecnologías especializadas como LiveKit, conviene primero pensar en el desafío que representa transmitir video y audio en tiempo real entre dos personas a través de internet.

Cuando hacemos una petición HTTP normal a un servidor (como cuando cargamos una página web o enviamos un formulario), el navegador establece una conexión, envía la petición, recibe la respuesta y cierra la conexión. Este modelo funciona muy bien para intercambios cortos de datos, pero es completamente inadecuado para transmitir video, dado que el video requiere flujos continuos de datos a velocidades altas y constantes, con latencias muy bajas para que la conversación se sienta natural.

Adicionalmente, las videollamadas tienen requisitos específicos. La latencia debe mantenerse por debajo de 200 milisegundos para que la conversación se sienta fluida, idealmente bajo 150 milisegundos. La pérdida de paquetes debe ser tolerada con mecanismos de recuperación, dado que internet no garantiza la entrega ordenada ni completa de cada paquete. El ancho de banda debe adaptarse a las condiciones cambiantes de la red, bajando la resolución cuando la conexión es mala y subiéndola cuando mejora.

Por todas estas razones, las videollamadas no se construyen sobre HTTP, sino sobre tecnologías especializadas como WebRTC.

## Qué es WebRTC

WebRTC son las siglas de Web Real-Time Communication, esto es, comunicación en tiempo real para la web. Es un estándar abierto desarrollado conjuntamente por Google, Mozilla y Opera a partir de 2011, que permite a los navegadores comunicarse directamente entre sí para intercambiar audio, video y datos arbitrarios, sin necesidad de plugins ni aplicaciones externas.

La gran innovación de WebRTC fue traer las capacidades de comunicación en tiempo real (que antes requerían instalar software propietario como Skype o Flash) directamente al navegador, expuestas a través de APIs de JavaScript que cualquier desarrollador puede usar. Esto democratizó las videollamadas y abrió la puerta a aplicaciones como Google Meet, Discord, Zoom (en su versión web) y muchas otras.

### Cómo funciona WebRTC

WebRTC funciona estableciendo conexiones directas entre los participantes (peer to peer) usando protocolos especializados. El proceso simplificado tiene varios pasos.

Paso uno, cada participante captura su audio y video desde la cámara y el micrófono del dispositivo mediante la API navigator.mediaDevices.getUserMedia.

Paso dos, los participantes necesitan encontrarse en la red. Como cada uno está en una conexión distinta, posiblemente detrás de routers con NAT (Network Address Translation), necesitan ayuda para descubrir cómo conectarse. Esto se hace mediante servidores STUN (Session Traversal Utilities for NAT) que les dicen cuál es su dirección IP pública.

Paso tres, los participantes intercambian información de configuración mediante un proceso llamado signaling. Esta información incluye detalles técnicos como los codecs de audio y video que cada uno soporta, sus direcciones IP candidatas y otros parámetros. El signaling no es parte de WebRTC en sí mismo, sino que cada aplicación debe implementarlo, típicamente usando WebSockets.

Paso cuatro, una vez intercambiada la información, los participantes intentan establecer una conexión directa. Si la red lo permite, la conexión se establece punto a punto y los flujos de audio y video viajan directamente entre los navegadores. Si los routers o firewalls bloquean la conexión directa, se usa un servidor TURN (Traversal Using Relays around NAT) que actúa como intermediario, retransmitiendo los datos entre los participantes.

Paso cinco, una vez establecida la conexión, los datos viajan usando protocolos optimizados para tiempo real como SRTP (Secure Real-time Transport Protocol) para los flujos de medios y SCTP para los datos arbitrarios.

### El problema del peer-to-peer puro

Si bien la idea de conexiones directas entre navegadores es elegante, en la práctica tiene varios problemas que se vuelven críticos para una aplicación como mediCampo v2.

El primer problema es la incompatibilidad con NAT estricto. Muchas redes corporativas, redes móviles y conexiones de hogares rurales usan NAT en configuraciones que impiden las conexiones directas entre peers. Si bien los servidores STUN ayudan en muchos casos, hay configuraciones donde simplemente no es posible establecer la conexión directa.

El segundo problema es el consumo de ancho de banda en llamadas con más de dos participantes. En una llamada peer-to-peer pura, cada participante envía su video a cada otro participante, lo cual significa que con cinco participantes cada uno está enviando cuatro copias de su video al mismo tiempo, multiplicando el consumo de banda. Esto se vuelve insostenible para conexiones limitadas.

El tercer problema es la falta de control. Sin un servidor centralizado, no hay una forma fácil de grabar las llamadas, moderar el contenido, gestionar permisos o integrar funciones avanzadas como compartir pantalla.

Para resolver estos problemas, surgieron las arquitecturas SFU.

## Qué es un SFU

SFU son las siglas de Selective Forwarding Unit, esto es, una unidad de reenvío selectivo. La idea es muy simple, esto es, en lugar de que los participantes se conecten directamente entre sí, todos se conectan a un servidor central que actúa como intermediario inteligente. Cada participante envía su flujo de video y audio una sola vez al servidor, y el servidor se encarga de retransmitirlo a los demás participantes con la calidad adecuada para cada uno según su conexión.

Las ventajas del SFU sobre el peer-to-peer puro son varias. La primera es que el ancho de banda de subida de cada participante se reduce drásticamente, dado que solo envía una copia de su video al servidor. La segunda es que el servidor puede adaptar la calidad de cada flujo según la conexión del receptor, enviando video en alta resolución a quien tiene buena conexión y en baja resolución a quien tiene conexión lenta. La tercera es que el servidor puede gestionar funcionalidades adicionales como grabación, transcripción, moderación y autenticación.

La desventaja es que ahora se necesita un servidor centralizado con capacidad suficiente para manejar todos los flujos, lo cual implica costos de infraestructura.

## Qué es LiveKit

LiveKit es una plataforma de código abierto que implementa una arquitectura SFU de alta calidad, junto con SDKs (Software Development Kits) para múltiples lenguajes que facilitan integrar videollamadas en cualquier aplicación. Fue fundada en 2021 y rápidamente se ha posicionado como una de las opciones más populares para aplicaciones de comunicación en tiempo real, usada por empresas como OpenAI (para las llamadas de voz de ChatGPT), Spotify y muchas otras.

Las características principales de LiveKit son las siguientes.

Servidor SFU escalable escrito en Go, capaz de manejar miles de participantes concurrentes en una sola instancia.

SDKs oficiales para JavaScript/TypeScript (web), iOS, Android, React Native, Flutter, Unity y otros, lo cual permite construir clientes para todas las plataformas usando la misma infraestructura.

Mecanismos avanzados de adaptación de calidad como AdaptiveStream y Dynacast, que ajustan automáticamente la resolución y el bitrate según las condiciones de cada conexión.

Autenticación basada en tokens JWT firmados, lo cual permite control granular sobre quién puede entrar a cada sala y qué puede hacer dentro.

Componentes prediseñados para React (la librería @livekit/components-react) que simplifican enormemente la construcción de interfaces de videollamada.

Soporte para grabación, transmisión a plataformas externas (RTMP), agentes inteligentes y muchas otras funcionalidades avanzadas.

Código abierto bajo licencia Apache 2.0, lo cual permite auto-hospedar el servidor sin costos de licencias.

## Por qué elegimos LiveKit para mediCampo v2

La decisión de usar LiveKit en lugar de otras alternativas se basó en varias razones específicas a nuestro contexto.

La primera razón es el contexto rural de nuestros usuarios. Las conexiones en zonas rurales suelen ser inestables y de baja velocidad, con NAT estricto típico de las redes móviles. El SFU de LiveKit resuelve estos problemas elegantemente, dado que centraliza la conexión a través del servidor en lugar de depender de conexiones directas entre los participantes.

La segunda razón es la robustez de la adaptación de calidad. LiveKit ajusta automáticamente la calidad del video según las condiciones de cada conexión, priorizando que la comunicación nunca se corte por sobre la calidad máxima del video. Para nuestro caso de uso (consulta médica), esto es ideal, dado que es preferible un video de menor calidad que una llamada que se interrumpe.

La tercera razón es la integración con React. La librería @livekit/components-react provee componentes listos para usar como LiveKitRoom, GridLayout, ParticipantTile y muchos hooks que encapsulan toda la complejidad técnica detrás de APIs simples. Esto nos permitió implementar la videollamada en pocas horas en lugar de semanas.

La cuarta razón es el control sobre la infraestructura. Al ser código abierto y poder auto-hospedar el servidor, mantenemos control total sobre los datos sensibles, sin depender de un proveedor externo que pudiera tener acceso a las conversaciones médicas.

La quinta razón es el costo. Auto-hospedar LiveKit en un Droplet de DigitalOcean nos cuesta mucho menos que usar servicios SaaS de videollamada por minuto facturado.

## Cómo funciona LiveKit en mediCampo v2

### Arquitectura general

En mediCampo v2 tenemos LiveKit desplegado en su propio Droplet de DigitalOcean, separado del servidor que corre el backend de la aplicación. La razón de esta separación es que el tráfico de videollamadas tiene requisitos muy distintos al tráfico de API (mucho ancho de banda, conexiones de larga duración, puertos UDP específicos) y conviene aislarlo en su propia máquina.

El servidor LiveKit es accesible bajo el subdominio medicampo-rtc.duckdns.org, con un certificado SSL gestionado automáticamente por Caddy. Los puertos abiertos en el firewall del Droplet incluyen el 443 TCP para WebSocket seguro (la señalización), el 443 UDP para WebRTC sobre QUIC (algunas conexiones modernas), el 3478 UDP para STUN y el rango 50000 a 60000 UDP para los flujos de medios RTP.

### El flujo completo de una videollamada

Para entender cómo se conecta todo en la práctica, sigamos paso a paso el flujo completo de una videollamada entre un paciente y un médico.

Paso uno, el paciente y el médico ya tienen una cita confirmada en la base de datos. La cita tiene un campo meetingLink con un identificador único, por ejemplo /room/abc123. Este identificador es el que LiveKit usará como roomId para la sala virtual.

Paso dos, uno de los dos (digamos el médico) presiona el botón Iniciar en su DashboardMedico. El frontend ejecuta navigate al meetingLink, lo cual abre el componente Videollamada.tsx con el roomId en la URL.

Paso tres, el componente Videollamada.tsx muestra primero la pantalla PreFlightCheck.tsx, que verifica que el navegador tenga permisos de cámara y micrófono, y permite al usuario ver una previsualización de su propio video. Esto se hace usando la API navigator.mediaDevices.getUserMedia que es parte estándar de WebRTC.

Paso cuatro, una vez el usuario aprueba el chequeo, el frontend hace una petición GET al endpoint /api/livekit/token de nuestro backend, pasando el roomId y el identity (que es el id del usuario autenticado).

Paso cinco, el backend (en livekitController.ts) valida que el usuario autenticado mediante JWT tenga efectivamente una cita asignada a esa sala. Si la validación es exitosa, usa el SDK livekit-server-sdk para generar un AccessToken firmado con la API_KEY y API_SECRET del servidor LiveKit. El token incluye los permisos específicos del participante (canPublish para enviar video, canSubscribe para recibirlo) y una duración limitada de diez minutos.

Paso seis, el backend devuelve el token al frontend, el cual lo guarda en memoria.

Paso siete, el componente Videollamada.tsx usa el componente LiveKitRoom de @livekit/components-react pasándole la URL del servidor LiveKit y el token. Internamente, este componente abre una conexión WebSocket segura al servidor LiveKit en medicampo-rtc.duckdns.org, envía el token para autenticarse y establece los canales WebRTC para los flujos de medios.

Paso ocho, el servidor LiveKit verifica el token, ubica al participante en la sala correspondiente al roomId, y le notifica a los otros participantes ya conectados que alguien nuevo se ha unido. Los flujos de audio y video comienzan a fluir a través del servidor SFU, con el video local del médico viajando hacia el servidor y desde allí hacia el paciente, y viceversa.

Paso nueve, los componentes GridLayout y ParticipantTile de @livekit/components-react se encargan de renderizar los videos en la pantalla, ajustando el layout automáticamente según la cantidad de participantes conectados.

Paso diez, durante la llamada, el componente IndicadorCalidadRed monitorea los eventos RoomEvent.Disconnected, RoomEvent.Reconnecting y RoomEvent.Reconnected del SDK de LiveKit para mostrar el estado de la conexión al usuario en tiempo real.

Paso once, cuando alguien presiona el botón de colgar (la función disconnect del room), el SDK cierra la conexión WebSocket, libera los recursos de medios y retorna al usuario al dashboard. El otro participante recibe el evento de desconexión y ve cómo el video del otro desaparece de su pantalla.

### Los componentes principales del SDK

La librería @livekit/components-react expone varios componentes y hooks que usamos en Videollamada.tsx.

LiveKitRoom es el componente padre que establece la conexión con el servidor. Recibe la URL del servidor, el token y opciones de conexión, y dentro de él se renderizan los demás componentes que necesitan acceso a la sala.

RoomAudioRenderer es un componente invisible que se encarga de reproducir todos los flujos de audio remotos. Sin él, no se escucharía el audio de los otros participantes.

GridLayout organiza automáticamente los participantes en una grilla responsiva que se adapta al espacio disponible y al número de participantes.

ParticipantTile renderiza un participante individual, mostrando su video, su nombre y los indicadores de estado del audio.

useTracks es un hook que devuelve los tracks (audio, video, screen share) de todos los participantes conectados, permitiendo construir layouts personalizados si los componentes prediseñados no se ajustan a las necesidades.

useLocalParticipant es un hook que da acceso al participante local (el usuario actual), permitiendo controlar su micrófono, cámara y otros aspectos.

useRoomContext es un hook que da acceso al objeto Room completo, donde se pueden suscribir a eventos avanzados.

## Cómo desplegamos LiveKit

El despliegue del servidor LiveKit en DigitalOcean lo hizo Ignacio durante el Sprint 1, siguiendo los pasos que se documentan a continuación.

Paso uno, se creó un Droplet en DigitalOcean con Ubuntu 22.04 y especificaciones modestas (2 vCPU, 2 GB de RAM, 50 GB de disco), suficientes para las pruebas del proyecto académico.

Paso dos, se instalaron Docker y Docker Compose en el servidor mediante el script oficial de Docker.

Paso tres, se creó un archivo docker-compose.yml con dos servicios, esto es, el servidor LiveKit (usando la imagen oficial livekit/livekit-server) y Caddy (para gestionar el certificado SSL).

Paso cuatro, se creó un archivo de configuración livekit.yaml con los parámetros del servidor, incluyendo las claves API_KEY y API_SECRET, los puertos a usar, las opciones de RTC y la configuración del TURN.

Paso cinco, se configuró Caddy con un Caddyfile que define el dominio medicampo-rtc.duckdns.org y enruta las peticiones HTTPS al servidor LiveKit en el puerto interno 7880.

Paso seis, se configuró DuckDNS con un subdominio gratuito apuntando a la IP pública del Droplet.

Paso siete, se abrieron los puertos necesarios en el firewall de DigitalOcean (443 TCP, 443 UDP, 3478 UDP y el rango 50000-60000 UDP).

Paso ocho, se levantó la infraestructura con docker compose up minus d, y se verificó que Caddy había obtenido el certificado SSL automáticamente de Let's Encrypt.

Paso nueve, desde el backend de la aplicación se configuraron las variables de entorno LIVEKIT_API_KEY, LIVEKIT_API_SECRET y LIVEKIT_URL apuntando al servidor desplegado.

A partir de ahí, el sistema quedó listo para que cualquier usuario autenticado pudiera obtener tokens y conectarse a las salas virtuales.

## Recursos para profundizar

Para los integrantes que quieran aprender más sobre LiveKit y WebRTC, la documentación oficial de LiveKit en docs.livekit.io es excelente, con guías paso a paso, ejemplos de código y videos explicativos. Para WebRTC en general, el sitio webrtc.org tiene tutoriales introductorios, y la documentación de MDN sobre las APIs de WebRTC es muy completa.

Para entender la teoría detrás de las comunicaciones en tiempo real, el libro High Performance Browser Networking de Ilya Grigorik (disponible gratuitamente en hpbn.co) tiene capítulos muy buenos sobre WebRTC, los protocolos que usa y los desafíos del diseño de aplicaciones en tiempo real.

Una recomendación práctica es jugar con los ejemplos oficiales de LiveKit que vienen en su repositorio de GitHub, dado que muchos de ellos se pueden ejecutar localmente sin necesidad de desplegar un servidor propio.
