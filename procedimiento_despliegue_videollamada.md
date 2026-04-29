Procedimiento de Despliegue y Configuracion del Sistema de Videollamada en mediCampo

1. Introduccion

Este documento describe el procedimiento completo para desplegar y configurar el sistema de videollamadas de la plataforma mediCampo. El sistema utiliza LiveKit como servidor SFU (Selective Forwarding Unit) para la transmision de video y audio en tiempo real entre medicos y pacientes.

La infraestructura se compone de tres elementos principales. El servidor LiveKit, que actua como intermediario entre los participantes de la videollamada, recibiendo el video y audio de cada uno y reenviandolo a los demas. El backend de mediCampo, que genera los tokens de acceso firmados que permiten a los usuarios conectarse a las salas de videollamada. Y el frontend de mediCampo, que se conecta al servidor LiveKit usando los tokens generados por el backend y renderiza la interfaz de videollamada.

2. Infraestructura Actual

El servidor LiveKit esta alojado en un droplet de DigitalOcean con las siguientes caracteristicas.

Direccion IP: 138.197.205.30
Nombre del droplet: marketplace-s-1vcpu-2gb-sfo2
Sistema Operativo: Ubuntu 22.04.5 LTS con Docker preinstalado
Subdominio DuckDNS: medicampo-rtc.duckdns.org (apunta a la IP 138.197.205.30)
Subdominio TURN: medicampo-turn.duckdns.org (apunta a la IP 138.197.205.30)
Usuario SSH: root (conexion por clave publica)
LiveKit version: 1.11.0
Proxy SSL: Caddy (obtiene certificados SSL automaticamente de Let's Encrypt)

El backend de mediCampo esta desplegado como DigitalOcean Web Service en la URL https://medicampo-api-cvqas.ondigitalocean.app/. Su funcion es proveer la API REST que genera los tokens de LiveKit y maneja la logica de negocio.

El frontend de mediCampo esta desplegado como DigitalOcean Static Site. Su funcion es proveer la interfaz de usuario que se conecta al backend y a LiveKit.

3. Conexion al Servidor LiveKit

3.1. Conexion desde la terminal local

Abra una terminal en su computadora y ejecute el siguiente comando.

ssh root@138.197.205.30

Si es la primera vez que se conecta desde esa computadora, el sistema le preguntara si confia en el servidor. Responda "yes" para continuar.

3.2. Conexion desde la consola web de DigitalOcean

Si no puede conectarse por SSH, puede usar la consola web que DigitalOcean provee desde el panel de control.

Ingrese a https://cloud.digitalocean.com. En el menu izquierdo, haga clic en "Droplets". Seleccione el droplet llamado "marketplace-s-1vcpu-2gb-sfo2" con IP 138.197.205.30. Arriba a la derecha, haga clic en el boton "Console". Se abrira una terminal en el navegador. Ingrese como usuario "root".

4. Estado Actual del Servidor LiveKit

LiveKit ya esta instalado y funcionando en el droplet. A continuacion se detalla la configuracion actual.

4.1. Contenedores Docker en ejecucion

El droplet tiene dos contenedores corriendo.

livekit-server: El servidor de videollamadas LiveKit version 1.11.0.
caddy-server: Proxy reverso que maneja SSL automaticamente.

Para verificar que esten corriendo, ejecute el siguiente comando.

docker ps

4.2. Configuracion de LiveKit

El archivo de configuracion se encuentra en /root/livekit.yaml. Su contenido actual es el siguiente.

port: 7880
rtc:
    use_external_ip: true
keys:
    APIQGDQzr8pgWX4: ly5Xjur3ZqMTSYHkUfxMevKXeg5isvawOodby4fz2luC

La configuracion no incluye SSL directamente porque Caddy actua como proxy reverso manejando SSL en el puerto 443.

4.3. Configuracion de Caddy (SSL)

El archivo de configuracion se encuentra en /root/Caddyfile. Su contenido actual es el siguiente.

 {
    email ignacioampuerochacon@gmail.com
}

medicampo-rtc.duckdns.org {
    reverse_proxy localhost:7880
}

Caddy obtiene certificados SSL automaticamente de Let's Encrypt para el subdominio medicampo-rtc.duckdns.org y redirige el trafico hacia LiveKit en el puerto 7880.

4.4. Puertos del Firewall (UFW)

El firewall UFW esta activo con los siguientes puertos abiertos.

22/tcp para SSH.
80/tcp para HTTP (necesario para la renovacion de certificados SSL).
443/tcp para HTTPS (Caddy con SSL).
7880/tcp para LiveKit HTTP.
7881/tcp para LiveKit WebRTC TCP.
3478/udp para TURN.
50000-60000/udp para WebRTC UDP.

Para verificar el estado del firewall, ejecute el siguiente comando.

ufw status verbose

4.5. Logs de LiveKit

LiveKit inicio correctamente y esta escuchando en los siguientes puertos.

Puerto HTTP: 7880.
Puerto WebRTC TCP: 7881.
Rango ICE UDP: 50000-60000.
IP externa detectada: 138.197.205.30.

Para ver los logs, ejecute el siguiente comando.

docker logs livekit-server

5. Configuracion de las Variables de Entorno en DigitalOcean

5.1. Variables en el Backend

El backend esta desplegado en DigitalOcean como Web Service. Para configurar las variables de entorno, siga estos pasos.

Ingrese a https://cloud.digitalocean.com. En el menu izquierdo, haga clic en "Apps". Seleccione la aplicacion del backend llamada "medicampo-api". Vaya a "Settings" y luego a "Environment Variables". Agregue o verifique que existan las siguientes variables.

LIVEKIT_API_KEY = APIQGDQzr8pgWX4
LIVEKIT_API_SECRET = ly5Xjur3ZqMTSYHkUfxMevKXeg5isvawOodby4fz2luC

Estas claves deben coincidir exactamente con las que estan en el archivo /root/livekit.yaml del droplet. Si las agrego o modifico, redeploye la aplicacion.

5.2. Variables en el Frontend

El frontend esta desplegado como Static Site en DigitalOcean. Para configurar la variable de entorno, siga estos pasos.

Ingrese a https://cloud.digitalocean.com. En el menu izquierdo, haga clic en "Apps". Seleccione la aplicacion del frontend llamada "medicampo-frontend". Vaya a "Settings" y luego a "Environment Variables". Agregue o verifique que exista la siguiente variable.

VITE_LIVEKIT_URL = wss://medicampo-rtc.duckdns.org

Es importante usar el protocolo wss:// (WebSocket Secure) en lugar de ws://, ya que los navegadores modernos bloquean conexiones WebSocket no seguras desde paginas servidas con HTTPS. Si la agrego o modifico, redeploye la aplicacion.

6. Verificacion de que Todo Funcione

6.1. Verificar que el Servidor LiveKit Responda

Desde su computadora local, ejecute el siguiente comando.

curl -s -o /dev/null -w "%{http_code}" https://medicampo-rtc.duckdns.org

Deberia recibir una respuesta "200", lo que indica que Caddy y LiveKit estan funcionando correctamente.

6.2. Verificar la Conexion desde el Frontend

Abra un navegador web y vaya a la URL del frontend de mediCampo. Inicie sesion como paciente o medico. Navegue hasta la ruta /livekit-test. Seleccione "Entrar como Medico" o "Entrar como Paciente". Si la configuracion es correcta, deberia ver la pantalla de validacion de hardware (PreFlightCheck) y luego la sala de videollamada.

6.3. Verificar los Logs del Servidor

Si encuentra problemas, revise los logs del servidor LiveKit con los siguientes comandos.

ssh root@138.197.205.30
docker logs livekit-server

7. Comandos Utiles para el Mantenimiento

Conexion al droplet.

ssh root@138.197.205.30

Verificar contenedores Docker.

docker ps

Ver logs de LiveKit.

docker logs livekit-server

Ver logs de Caddy.

docker logs caddy-server

Ver configuracion de LiveKit.

cat /root/livekit.yaml

Ver configuracion de Caddy.

cat /root/Caddyfile

Ver estado del firewall.

ufw status verbose

Reiniciar LiveKit.

docker restart livekit-server

Reiniciar Caddy.

docker restart caddy-server

Ver certificados SSL.

docker exec caddy-server caddy cert-info

8. Notas Adicionales

Si el droplet se reinicia, los contenedores Docker se iniciaran automaticamente gracias a la politica "restart unless-stopped".

Para actualizar LiveKit a una version mas reciente, ejecute los siguientes comandos.

ssh root@138.197.205.30
docker pull livekit/livekit-server:latest
docker stop livekit-server
docker rm livekit-server
docker run -d --name livekit-server --restart unless-stopped -p 7880:7880 -p 7881:7881/udp -v /root/livekit.yaml:/livekit.yaml livekit/livekit-server:latest --config /livekit.yaml

Para detener el servidor LiveKit.

ssh root@138.197.205.30
docker stop livekit-server

Para ver el uso de recursos del servidor.

ssh root@138.197.205.30
docker stats

Se recomienda monitorear el uso de CPU y RAM del droplet, especialmente si se esperan multiples videollamadas simultaneas. Cada videollamada consume aproximadamente 1-2 Mbps de ancho de banda por participante y 100-200 MB de RAM por sala activa.

9. Proximos Pasos a Realizar

A continuacion se listan las tareas pendientes para mejorar y asegurar el correcto funcionamiento del sistema de videollamadas.

9.1. Verificar la infraestructura de conexion entre medico y paciente

Es necesario probar el flujo completo de conexion entre un medico y un paciente en una cita real, no solo en el sandbox de pruebas. Esto implica verificar que ambos participantes puedan unirse a la misma sala, que los tokens se generen correctamente para cada uno, y que la calidad de la transmision sea aceptable.

9.2. Verificar la generacion y validez de los tokens

Los tokens de LiveKit tienen un tiempo de expiracion. Es necesario verificar que el backend genere tokens con una duracion adecuada para la duracion de las citas medicas, y que el sistema maneje correctamente la renovacion de tokens si la cita se extiende mas alla del tiempo estimado.

9.3. Probar la conexion desde datos moviles

Es fundamental probar la videollamada desde una conexion de datos moviles (4G/5G) para asegurar que la calidad de la transmision sea aceptable en entornos con ancho de banda limitado y latencia variable. Esto incluye probar tanto desde un telefono como desde una computadora conectada a traves de un punto de acceso movil.

9.4. Probar la conexion entre dispositivos moviles y computadoras

Se debe verificar que la videollamada funcione correctamente en las siguientes combinaciones de dispositivos.

Medico desde computadora y paciente desde telefono.
Medico desde telefono y paciente desde computadora.
Ambos desde telefono.
Ambos desde computadora.

9.5. Configurar un servidor TURN para redes restrictivas

Actualmente el sistema no cuenta con un servidor TURN configurado. Esto significa que la videollamada podria no funcionar en redes corporativas, redes de hospitales, o cualquier red que tenga firewalls restrictivos o que use NAT simetrica. Se recomienda configurar un servidor TURN para garantizar la conectividad en estos escenarios.

9.6. Mejorar la interfaz de usuario de la videollamada

Dado que se creo una aplicacion movil, es necesario revisar y mejorar la interfaz de la videollamada para que sea mas intuitiva y funcional en dispositivos moviles. Algunas mejoras potenciales incluyen.

Optimizar los controles de camara y microfono para pantallas tactiles.
Mejorar la visualizacion de la ficha clinica en dispositivos moviles.
Agregar indicadores de calidad de conexion mas visibles.
Implementar un modo de solo audio para cuando el ancho de banda sea limitado.
Mejorar la experiencia de compartir pantalla.
Agregar notificaciones push para cuando una videollamada esta por comenzar.

9.7. Monitoreo y alertas

Implementar un sistema de monitoreo que alerte cuando el servidor LiveKit tenga problemas de rendimiento, cuando el uso de CPU o RAM supere ciertos umbrales, o cuando la conexion se interrumpa. Esto puede hacerse utilizando las herramientas de monitoreo de DigitalOcean o implementando una solucion personalizada.

9.8. Pruebas de carga

Realizar pruebas de carga para determinar cuantas videollamadas simultaneas puede soportar el droplet actual antes de degradar la calidad del servicio. Esto permitira planificar escalamiento futuro si la plataforma crece en usuarios.
