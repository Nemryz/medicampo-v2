# Diagnóstico de Fallas: MediCampo LiveKit SFU

Si ambos usuarios se conectan pero la pantalla permanece vacía, el problema no es de lógica de programación (el código está bien), sino de **comunicación entre capas**. Aquí están las causas técnicas posibles y cómo solucionarlas.

---

## 1. Fallas en la Infraestructura (DigitalOcean)

### A. Bloqueo de Puertos (Firewall)
LiveKit no es como una web normal; necesita muchos "caminos" abiertos.
*   **TCP 443**: Para la señalización (WSS).
*   **UDP 443**: Para el protocolo HTTP/3 (más rápido).
*   **UDP 3478**: Para el protocolo TURN (ayuda a saltar firewalls).
*   **UDP 50000-60000**: **CRÍTICO**. Estos son los puertos por donde viaja el video real. Si están cerrados, verás el chat pero nunca el video.
*   **Solución**: En el panel de DigitalOcean, asegúrate de que el Firewall tenga estas reglas de entrada.

### B. Caddy y Certificados SSL
Si el certificado SSL de `medicampo-rtc.duckdns.org` no es válido, el navegador **bloqueará silenciosamente** la conexión WebSocket.
*   **Verificación**: Abre en tu navegador `https://medicampo-rtc.duckdns.org`. Si aparece un candado verde o un mensaje de LiveKit, está bien. Si aparece "Conexión no segura", Caddy falló.
*   **Comando en el servidor**: `docker logs caddy` para ver errores de Let's Encrypt.

---

## 2. Fallas en el Cliente (Navegador)

### A. Consola de Desarrollador (F12)
Este es el lugar más importante. Si "no aparece nada", abre la consola (pestaña 'Console' y 'Network'):
*   **Error 400 en /api/livekit/token**: El frontend no está enviando bien los parámetros (ya lo corregimos en el código, pero verifica si persiste).
*   **Error 1006 / Connection Failed**: El navegador no puede llegar al servidor `wss://`.
*   **Mixed Content**: Si tu frontend corre en `http://localhost` y el servidor es `wss://`, algunos navegadores bloquean la conexión. Usa Chrome o Edge para mejores resultados en desarrollo.

### B. Caché de Vite
Vite es muy agresivo con el caché de las variables `.env`.
*   **Solución**: Detén el frontend, borra la carpeta `node_modules/.vite` (si existe) y corre `npm run dev` de nuevo.

---

## 3. Fallas en el Dominio (DuckDNS)

### A. Propagación de DNS
A veces DuckDNS tarda unos minutos en apuntar a tu nueva IP de DigitalOcean.
*   **Verificación**: Ejecuta `ping medicampo-rtc.duckdns.org` en tu terminal. Debe devolver la IP de tu Droplet (`138.197.205.30`).

---

## 4. Por qué el cambio fue necesario (Recordatorio)
PeerJS fallaba porque dependía de que los usuarios tuvieran puertos abiertos en sus casas. LiveKit soluciona esto usando un servidor central, pero ese servidor **debe ser accesible**. 

### Próximos Pasos Recomendados:
1.  Verificar que `https://medicampo-rtc.duckdns.org` cargue en el navegador.
2.  Revisar errores en la consola F12 del navegador.
3.  Asegurar que los puertos UDP 50000-60000 estén abiertos en DigitalOcean.
