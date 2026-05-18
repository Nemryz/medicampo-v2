# Guia de Despliegue y Configuracion de Videollamada en mediCampo

## 1. Introduccion

Este documento describe el procedimiento completo para configurar y desplegar el sistema de videollamadas de mediCampo. La plataforma utiliza LiveKit como servidor SFU (Selective Forwarding Unit) para la transmision de video y audio en tiempo real.

Para que las videollamadas funcionen correctamente, se requieren tres componentes:

El servidor LiveKit, que actua como intermediario entre los participantes de la videollamada. Este servidor recibe el video y audio de cada participante y los reenvia a los demas.

El backend de mediCampo, que genera los tokens de acceso firmados que permiten a los usuarios conectarse a las salas de videollamada.

El frontend de mediCampo, que se conecta al servidor LiveKit usando los tokens generados por el backend y renderiza la interfaz de videollamada.

---

## 2. Infraestructura Actual del Proyecto

A continuacion se describe la infraestructura real con la que cuenta el proyecto actualmente:

Servidor LiveKit (Droplet en DigitalOcean):
  Direccion IP: 138.197.205.30
  Nombre del droplet: marketplace-s-1vcpu-2gb-sfo2
  Sistema Operativo: Ubuntu 22.04.5 LTS con Docker preinstalado
  Subdominio DuckDNS: medicampo-rtc.duckdns.org (apunta a la IP 138.197.205.30)
  Subdominio TURN: medicampo-turn.duckdns.org (apunta a la IP 138.197.205.30)
  Usuario SSH: root (conexion por clave publica)
  LiveKit version: 1.11.0
  Proxy SSL: Caddy (obtiene certificados SSL automaticamente)

Backend de mediCampo (DigitalOcean Web Service):
  URL: https://medicampo-api-cvqas.ondigitalocean.app/
  IP: 162.159.140.98
  Funcion: API REST que genera los tokens de LiveKit y maneja la logica de negocio

Frontend de mediCampo (DigitalOcean Static Site):
  Funcion: Interfaz de usuario que se conecta al backend y a LiveKit

Base de Datos:
  Estado: Configurada y operativa

---

## 3. Conectarse al Droplet via SSH

### 3.1. Conexion desde la terminal local

Abra una terminal en su computadora y ejecute:

ssh root@138.197.205.30

Si es la primera vez que se conecta desde esta computadora, le preguntara si confia en el servidor. Responda "yes".

### 3.2. Conexion desde la consola web de DigitalOcean

Si no puede conectarse por SSH, puede usar la consola web:

1. Ve a https://cloud.digitalocean.com
2. En el menu izquierdo, haz clic en "Droplets"
3. Selecciona el droplet "marketplace-s-1vcpu-2gb-sfo2" (IP: 138.197.205.30)
4. Arriba a la derecha, haz clic en "Console"
5. Se abrira una terminal en el navegador. Ingresa como usuario "root"

---

## 4. Estado Actual del Servidor LiveKit

LiveKit ya esta instalado y funcionando en el droplet. A continuacion se detalla la configuracion actual.

### 4.1. Contenedores Docker en ejecucion

El droplet tiene dos contenedores corriendo:

- livekit-server: El servidor de videollamadas LiveKit version 1.11.0
- caddy-server: Proxy reverso que maneja SSL automaticamente

Para verificar que esten corriendo:

docker ps

### 4.2. Configuracion de LiveKit

Archivo de configuracion: /root/livekit.yaml

Contenido actual:

port: 7880
rtc:
    use_external_ip: true
keys:
    APIQGDQzr8pgWX4: ly5Xjur3ZqMTSYHkUfxMevKXeg5isvawOodby4fz2luC

Nota: La configuracion no incluye SSL directamente porque Caddy actua como proxy reverso manejando SSL en el puerto 443.

### 4.3. Configuracion de Caddy (SSL)

Archivo de configuracion: /root/Caddyfile

Contenido actual:

 {
    email ignacioampuerochacon@gmail.com
}

medicampo-rtc.duckdns.org {
    reverse_proxy localhost:7880
}

Caddy obtiene certificados SSL automaticamente de Let's Encrypt para el subdominio medicampo-rtc.duckdns.org y redirige el trafico hacia LiveKit en el puerto 7880.

### 4.4. Puertos del Firewall (UFW)

El firewall UFW esta activo con los siguientes puertos abiertos:

22/tcp - SSH
80/tcp - HTTP (para renovacion de SSL)
443/tcp - HTTPS (Caddy con SSL)
7880/tcp - LiveKit HTTP
7881/tcp - LiveKit WebRTC TCP
3478/udp - TURN
50000-60000/udp - WebRTC UDP

### 4.5. Logs de LiveKit

LiveKit inicio correctamente y esta escuchando en:

- Puerto HTTP: 7880
- Puerto WebRTC TCP: 7881
- Rango ICE UDP: 50000-60000
- IP externa detectada: 138.197.205.30

Para ver los logs:

docker logs livekit-server

---

## 5. Configuracion de las Variables de Entorno en DigitalOcean

### 5.1. Variables en el Backend (DigitalOcean Web Service)

El backend esta desplegado en DigitalOcean como Web Service en la URL https://medicampo-api-cvqas.ondigitalocean.app/.

Debe configurar las siguientes variables de entorno en el panel de DigitalOcean:

1. Ve a https://cloud.digitalocean.com
2. En el menu izquierdo, haz clic en "Apps"
3. Selecciona la aplicacion del backend "medicampo-api"
4. Ve a "Settings" > "Environment Variables"
5. Agrega o verifica que existan estas variables:

LIVEKIT_API_KEY=APIQGDQzr8pgWX4
LIVEKIT_API_SECRET=ly5Xjur3ZqMTSYHkUfxMevKXeg5isvawOodby4fz2luC

Estas claves deben coincidir exactamente con las que estan en el archivo /root/livekit.yaml del droplet.

6. Si las agregaste o modificaste, redeploya la aplicacion.

### 5.2. Variables en el Frontend (DigitalOcean Static Site)

El frontend esta desplegado como Static Site en DigitalOcean. Debe configurar la siguiente variable de entorno:

1. Ve a https://cloud.digitalocean.com
2. En el menu izquierdo, haz clic en "Apps"
3. Selecciona la aplicacion del frontend
4. Ve a "Settings" > "Environment Variables"
5. Agrega o verifica que exista:

VITE_LIVEKIT_URL=wss://medicampo-rtc.duckdns.org

Es importante usar el protocolo wss:// (WebSocket Secure) en lugar de ws://, ya que los navegadores modernos bloquean conexiones WebSocket no seguras desde paginas servidas con HTTPS.

6. Si la agregaste o modificaste, redeploya la aplicacion.

---

## 6. Verificacion de que Todo Funcione

### 6.1. Verificar que el Servidor LiveKit Responda

Desde su computadora local, ejecute:

curl -s -o /dev/null -w "%{http_code}" https://medicampo-rtc.duckdns.org

Deberia recibir una respuesta "200", lo que indica que Caddy y LiveKit estan funcionando correctamente.

### 6.2. Verificar la Conexion desde el Frontend

1. Abra un navegador web y vaya a la URL del frontend de mediCampo.
2. Inicie sesion como paciente o medico.
3. Navegue hasta el sandbox de pruebas de LiveKit. La ruta es /livekit-test.
4. Seleccione "Entrar como Medico" o "Entrar como Paciente".
5. Si la configuracion es correcta, deberia ver la pantalla de validacion de hardware (PreFlightCheck) y luego la sala de videollamada.

### 6.3. Verificar los Logs del Servidor

Si encuentra problemas, revise los logs del servidor LiveKit:

ssh root@138.197.205.30
docker logs livekit-server

---

## 7. Comandos Utiles para el Mantenimiento

Conexion al droplet:

ssh root@138.197.205.30

Verificar contenedores Docker:

docker ps

Ver logs de LiveKit:

docker logs livekit-server

Ver logs de Caddy:

docker logs caddy-server

Ver configuracion de LiveKit:

cat /root/livekit.yaml

Ver configuracion de Caddy:

cat /root/Caddyfile

Ver estado del firewall:

ufw status verbose

Reiniciar LiveKit:

docker restart livekit-server

Reiniciar Caddy:

docker restart caddy-server

Ver certificados SSL:

docker exec caddy-server caddy cert-info

---

## 8. Notas Adicionales

Si el droplet se reinicia, los contenedores Docker se iniciaran automaticamente.

Para actualizar LiveKit a una version mas reciente:

ssh root@138.197.205.30
docker pull livekit/livekit-server:latest
docker stop livekit-server
docker rm livekit-server
docker run -d --name livekit-server --restart unless-stopped -p 7880:7880 -p 7881:7881/udp -v /root/livekit.yaml:/livekit.yaml livekit/livekit-server:latest --config /livekit.yaml

Para detener el servidor LiveKit:

ssh root@138.197.205.30
docker stop livekit-server

Para ver el uso de recursos del servidor:

ssh root@138.197.205.30
docker stats

Se recomienda monitorear el uso de CPU y RAM del droplet, especialmente si se esperan multiples videollamadas simultaneas. Cada videollamada consume aproximadamente 1-2 Mbps de ancho de banda por participante y 100-200 MB de RAM por sala activa.
