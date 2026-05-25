# Guía sobre Docker, DigitalOcean, Caddy y DuckDNS en mediCampo v2

Este documento explica desde lo más básico qué son las cuatro herramientas que componen nuestra infraestructura de despliegue, esto es, Docker para empaquetar la aplicación, DigitalOcean como proveedor de nube, Caddy como servidor web con SSL automático y DuckDNS para tener un subdominio gratuito. La idea es que cualquier integrante del equipo entienda no solo qué hace cada herramienta sino también cómo se combinan para que mediCampo v2 funcione en un servidor real accesible desde internet.

## El problema de desplegar una aplicación

Antes de hablar de las herramientas específicas, conviene entender el problema general que viene a resolver el despliegue. Cuando estamos desarrollando una aplicación, esta corre en nuestro propio computador, esto es, en localhost, donde solo nosotros tenemos acceso. Para que otras personas puedan usarla, necesitamos poner esa aplicación en algún lugar accesible desde internet, con una dirección estable, suficiente capacidad para atender a múltiples usuarios y mecanismos para mantenerla funcionando 24 horas al día.

Esto plantea varios desafíos. Necesitamos un servidor con conexión a internet permanente, esto es, una máquina que esté siempre encendida y conectada. Necesitamos asegurar que la aplicación corra de la misma manera en el servidor que en nuestros computadores, evitando el clásico problema de en mi máquina funciona pero en el servidor no. Necesitamos un nombre de dominio para que los usuarios accedan a la aplicación con una URL legible en lugar de una dirección IP numérica. Necesitamos un certificado SSL para que la conexión sea segura mediante HTTPS, lo cual es un requisito moderno tanto por seguridad como porque los navegadores marcan los sitios sin HTTPS como inseguros.

Para resolver todos estos problemas, en mediCampo v2 usamos una combinación de Docker, DigitalOcean, Caddy y DuckDNS. Veamos cada una.

## Docker

### Qué es Docker

Docker es una tecnología creada en 2013 que permite empaquetar aplicaciones junto con todas sus dependencias dentro de unidades portables llamadas contenedores. La idea fundamental es que un contenedor incluye no solo el código de la aplicación, sino también el sistema operativo, las librerías, las herramientas y la configuración necesaria para que la aplicación funcione, todo dentro de una imagen reutilizable que se puede ejecutar de forma idéntica en cualquier máquina que tenga Docker instalado.

Antes de Docker, desplegar aplicaciones era complicado dado que cada servidor podía tener versiones distintas del sistema operativo, librerías diferentes instaladas o configuraciones específicas que afectaban el comportamiento del software. Con Docker, este problema desaparece, dado que el contenedor lleva todo consigo y se ejecuta dentro de un entorno aislado.

### Conceptos básicos de Docker

Una imagen es como una plantilla o molde, esto es, un archivo que contiene el sistema operativo, las dependencias y el código de la aplicación. Las imágenes son estáticas e inmutables, una vez creadas no cambian.

Un contenedor es una instancia en ejecución de una imagen, esto es, lo que se obtiene cuando se levanta una imagen. Múltiples contenedores pueden ejecutarse simultáneamente a partir de la misma imagen.

Un Dockerfile es un archivo de texto con instrucciones para construir una imagen. Define qué imagen base usar, qué archivos copiar, qué comandos ejecutar y qué configuraciones aplicar.

Docker Compose es una herramienta que permite definir y ejecutar múltiples contenedores como una sola aplicación, usando un archivo docker-compose.yml. Es ideal cuando una aplicación tiene varios componentes (por ejemplo, un servidor web, una base de datos y un caché), dado que se pueden levantar todos juntos con un solo comando.

Un volumen es una forma de persistir datos fuera del contenedor, dado que los contenedores por defecto pierden todos sus cambios cuando se detienen. Los volúmenes permiten que la información sobreviva al ciclo de vida del contenedor.

Una red es la forma en que los contenedores se comunican entre sí. Docker crea redes virtuales aisladas donde los contenedores pueden hablarse usando los nombres de los servicios.

### Cómo usamos Docker en mediCampo v2

En nuestro proyecto usamos Docker principalmente para desplegar el servidor LiveKit en el Droplet de DigitalOcean. La razón es que LiveKit tiene varias dependencias específicas (Go, librerías de WebRTC) que serían complicadas de instalar y mantener directamente en el servidor, mientras que con Docker simplemente bajamos la imagen oficial y la ejecutamos.

El archivo docker-compose.yml en el Droplet de LiveKit define dos servicios principales, esto es, el contenedor de LiveKit usando la imagen oficial livekit/livekit-server, y el contenedor de Caddy usando la imagen oficial caddy. Ambos comparten una red virtual donde se pueden comunicar entre sí, con Caddy recibiendo las peticiones HTTPS del exterior y reenviándolas al puerto interno de LiveKit.

La gracia de este enfoque es que actualizar LiveKit es trivial. Cuando sale una nueva versión, simplemente cambiamos el tag de la imagen en el archivo docker-compose.yml, ejecutamos docker compose pull para descargar la nueva versión y docker compose up minus d para reiniciar el contenedor con la nueva imagen. Todo el resto de la configuración se mantiene intacto.

### Comandos básicos de Docker

Algunos comandos que conviene conocer.

docker pull imagen descarga una imagen desde un registro como Docker Hub.

docker run opciones imagen ejecuta un contenedor a partir de una imagen.

docker ps lista los contenedores que están corriendo actualmente.

docker logs contenedor muestra los logs de un contenedor específico.

docker compose up minus d levanta todos los servicios definidos en un docker-compose.yml en modo detached (en segundo plano).

docker compose down detiene y elimina los servicios.

docker compose logs minus f muestra los logs de los servicios en tiempo real.

## DigitalOcean

### Qué es DigitalOcean

DigitalOcean es un proveedor de servicios de computación en la nube fundado en 2011, conocido por su enfoque en la simplicidad y la accesibilidad para desarrolladores individuales y equipos pequeños. A diferencia de gigantes como AWS o Azure que ofrecen cientos de servicios complejos, DigitalOcean se concentra en un catálogo más reducido de servicios bien diseñados y con interfaces claras.

Los servicios principales de DigitalOcean que usamos en mediCampo v2 son los Droplets (servidores virtuales) y las Managed Databases (bases de datos administradas), ambos cubiertos por los créditos del GitHub Student Pack que tenemos como estudiantes.

### Qué es un Droplet

Un Droplet es la palabra que DigitalOcean usa para referirse a sus servidores virtuales. Técnicamente es una máquina virtual con su propio sistema operativo (típicamente Ubuntu en nuestro caso), su propia dirección IP pública y recursos asignados (CPU, memoria RAM, almacenamiento, ancho de banda).

Para mediCampo v2 tenemos un Droplet dedicado al servidor LiveKit, con especificaciones modestas suficientes para el proyecto académico, esto es, 2 vCPU, 2 GB de memoria RAM, 50 GB de disco SSD y 2 TB de transferencia mensual. Este servidor corre Ubuntu 22.04 LTS y tiene Docker instalado para ejecutar los contenedores.

### Qué es una Managed Database

Una Managed Database es una base de datos donde DigitalOcean se encarga de toda la operación técnica, dejándonos solo la responsabilidad de definir el esquema y usarla desde nuestra aplicación. En mediCampo v2 tenemos una instancia de PostgreSQL administrada que sirve como base principal de toda la información del sistema.

Las ventajas de usar una base administrada en lugar de instalarla en nuestro propio Droplet son varias, esto es, respaldos automáticos diarios, actualizaciones de seguridad sin intervención manual, monitoreo del rendimiento, alta disponibilidad opcional y configuración optimizada para producción. Todo esto sin tener que ser expertos en administración de bases de datos.

### Cómo nos conectamos a los servicios

A nuestro Droplet nos conectamos mediante SSH, esto es, un protocolo seguro que permite ejecutar comandos remotamente en el servidor desde nuestra propia terminal. Esto nos da acceso completo al servidor como si estuviéramos sentados frente a él, permitiendo instalar software, modificar configuraciones, ver logs y administrar los contenedores Docker.

A nuestra base de datos administrada nos conectamos desde el backend usando la cadena de conexión PostgreSQL configurada en la variable de entorno DATABASE_URL. La conexión siempre va cifrada mediante SSL.

El panel web de DigitalOcean nos da acceso visual a todos los recursos, incluyendo gráficos de rendimiento, configuración de firewall, gestión de respaldos y muchas otras funcionalidades administrativas.

## Caddy

### Qué es Caddy

Caddy es un servidor web moderno escrito en Go, lanzado en 2015, conocido por su simplicidad de configuración y especialmente por su gestión automática de certificados SSL/TLS. A diferencia de servidores web tradicionales como Nginx o Apache, Caddy fue diseñado desde el principio para que obtener HTTPS sea trivial.

Antes de Caddy, configurar HTTPS en un sitio requería varios pasos manuales, esto es, generar la clave privada, generar la solicitud de certificado, validar la propiedad del dominio ante una autoridad certificadora, instalar el certificado en el servidor, configurar el servidor para usar el certificado, y repetir todo el proceso cuando el certificado expirara. Caddy automatiza todo esto, dado que se integra con Let's Encrypt (una autoridad certificadora gratuita) y obtiene los certificados automáticamente al levantar el sitio.

### Cómo funciona Caddy en mediCampo v2

En el Droplet de LiveKit, Caddy actúa como proxy inverso entre internet y el servidor LiveKit. Los usuarios externos hacen sus peticiones HTTPS a https barra barra medicampo-rtc.duckdns.org, las cuales llegan a Caddy en el puerto 443. Caddy gestiona el handshake SSL/TLS con el cliente usando su certificado, descifra la petición, y la reenvía al contenedor de LiveKit en el puerto interno 7880 a través de la red Docker.

La configuración de Caddy vive en un archivo llamado Caddyfile, que es notablemente más simple que las configuraciones equivalentes en Nginx o Apache. Para mediCampo v2 el archivo es básicamente algo así, esto es, una línea con medicampo-rtc.duckdns.org y dentro de las llaves la directiva reverse_proxy seguida del nombre interno del servicio Docker de LiveKit en el puerto 7880.

La magia ocurre la primera vez que se levanta Caddy. Al detectar el dominio medicampo-rtc.duckdns.org, Caddy automáticamente contacta a Let's Encrypt, valida que el dominio efectivamente apunta a la IP del Droplet (mediante un challenge HTTP), descarga el certificado y lo configura para usar. Adicionalmente, Caddy se encarga de renovar el certificado automáticamente cada 60 días, antes de que expire la duración de 90 días que Let's Encrypt otorga.

### Beneficios de usar Caddy

Configuración simple, dado que el Caddyfile es mucho más legible que las configuraciones tradicionales.

HTTPS automático, sin tener que tocar manualmente los certificados.

HTTP/2 y HTTP/3 habilitados por defecto, lo cual mejora el rendimiento.

Compresión automática de respuestas.

Logs estructurados que facilitan el debugging.

## DuckDNS

### Qué es DuckDNS

DuckDNS es un servicio gratuito de DNS dinámico que permite obtener un subdominio del tipo nombre.duckdns.org apuntando a una dirección IP específica. Es ideal para proyectos personales, académicos o pequeños donde no se quiere o no se puede comprar un dominio propio.

DNS son las siglas de Domain Name System, esto es, el sistema que traduce los nombres de dominio legibles (como google.com) a las direcciones IP numéricas (como 142.250.79.78) que las computadoras usan para encontrarse en internet. Cuando un usuario escribe un dominio en su navegador, el navegador consulta servidores DNS para obtener la IP correspondiente y luego se conecta a esa IP.

Normalmente, para tener un dominio propio uno tiene que comprarlo a un registrador como GoDaddy, Namecheap o NIC Chile, pagando una cuota anual. Para proyectos pequeños esto puede ser un costo innecesario, especialmente si solo necesitamos una URL estable para acceder a un servidor.

### Cómo usamos DuckDNS en mediCampo v2

Para mediCampo v2 registramos el subdominio medicampo-rtc.duckdns.org en DuckDNS, apuntando a la IP pública del Droplet donde corre LiveKit. Este subdominio es lo que el frontend usa para conectarse al servidor LiveKit, esto es, wss://medicampo-rtc.duckdns.org.

El proceso es simple. Primero creamos una cuenta gratuita en duckdns.org. Luego elegimos un nombre de subdominio disponible (en nuestro caso medicampo-rtc) y lo asociamos a la IP del Droplet. DuckDNS genera un token único que se puede usar para actualizar la IP automáticamente si esta cambia (aunque las IPs de Droplets de DigitalOcean son estables y no necesitan actualización dinámica).

### Limitaciones a tener en cuenta

DuckDNS es perfecto para proyectos académicos o personales pero tiene algunas limitaciones que vale la pena mencionar.

El subdominio es siempre nombre.duckdns.org, esto es, no podemos elegir el dominio raíz. Esto significa que no podemos tener algo como medicampo.cl con DuckDNS.

DuckDNS es un servicio operado por voluntarios, por lo cual no ofrece garantías de servicio (SLA) como un proveedor comercial. Para producción seria conviene usar un dominio propio.

Algunos sistemas corporativos o instituciones pueden bloquear los subdominios .duckdns.org como medida de seguridad, dado que también pueden ser usados por actores maliciosos.

Para futuras versiones de mediCampo destinadas a uso real, conviene migrar a un dominio propio (por ejemplo medicampo.cl o medicampo.com) registrado en un proveedor estándar, lo cual cuesta entre 10 y 20 dólares al año.

## Cómo se conectan las cuatro herramientas

Para visualizar cómo se combinan las cuatro tecnologías, sigamos el recorrido completo de una petición de videollamada.

El usuario abre la aplicación mediCampo v2 en su navegador y entra a una videollamada. El frontend de React intenta conectarse al servidor LiveKit en la URL wss://medicampo-rtc.duckdns.org.

El navegador hace una consulta DNS para resolver medicampo-rtc.duckdns.org. DuckDNS responde con la IP pública del Droplet de DigitalOcean donde está el servidor LiveKit.

El navegador establece una conexión WebSocket segura (WSS) a esa IP en el puerto 443. La petición llega al Droplet.

En el Droplet, Caddy está escuchando en el puerto 443. Caddy gestiona el handshake TLS usando el certificado SSL emitido por Let's Encrypt para el dominio medicampo-rtc.duckdns.org.

Una vez establecida la conexión segura, Caddy reenvía la petición al contenedor Docker de LiveKit que está corriendo internamente en el puerto 7880.

LiveKit verifica el token JWT que el cliente envió, ubica al participante en la sala correspondiente y comienza a intercambiar los flujos de medios.

Todo este recorrido sucede en milisegundos y es completamente transparente para el usuario, quien solo ve que su videollamada funciona.

## Recursos para profundizar

Para los integrantes que quieran aprender más sobre cada herramienta, las documentaciones oficiales son los mejores puntos de partida.

Para Docker, docker.com tiene tutoriales interactivos y la documentación oficial. El libro Docker Deep Dive de Nigel Poulton es muy recomendado para quienes quieren entender los conceptos a fondo.

Para DigitalOcean, la sección Community en digitalocean.com tiene miles de tutoriales prácticos sobre administración de servidores, despliegue de aplicaciones y configuración de redes. Es una de las mejores fuentes de tutoriales prácticos en internet.

Para Caddy, caddyserver.com tiene una documentación clara con ejemplos prácticos para los casos de uso más comunes.

Para DuckDNS, el sitio duckdns.org tiene instrucciones simples para configurar el servicio con distintos sistemas operativos.

Una recomendación práctica es instalar Docker Desktop en el propio computador y experimentar con contenedores localmente antes de tocar el servidor de producción, dado que es la forma más segura de aprender sin riesgo de romper algo importante.
