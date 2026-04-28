# Guía Maestra: Implementación de Permisos WebRTC en MediCampo

Este documento es una hoja de ruta detallada para asegurar el acceso a dispositivos (cámara/micro) en entornos de alta seguridad (Chrome Android/Windows).

---

## PASO 1: Garantizar el Entorno Seguro (HTTPS)
WebRTC **solo** funciona bajo `https://`. Si el sitio no tiene un certificado SSL válido, el navegador bloqueará la cámara automáticamente sin preguntar.
- **Acción**: Verificar que el dominio en DigitalOcean tenga el candado verde activo.
- **Nota**: El plugin PWA que instalamos exige HTTPS para funcionar.

## PASO 2: Implementación de la "Llamada por Gesto"
Los navegadores modernos bloquean cualquier intento de abrir la cámara que no provenga de un clic real del usuario.
- **Instrucción**: El componente `PreFlightCheck` debe ser el encargado de lanzar el primer `getUserMedia`.
- **Código Correcto**:
  ```javascript
  // Siempre llamar dentro de una función de evento (onClick o useEffect de montaje)
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  ```

## PASO 3: Gestión de Estados de Permiso
Antes de fallar, debemos preguntar al sistema en qué estado estamos. Esto permite mostrar mensajes personalizados.

### Pasos para el Chequeo Proactivo:
1.  Consultar el estado con `navigator.permissions.query`.
2.  Si el estado es `'prompt'`: Significa que es la primera vez, el popup aparecerá.
3.  Si el estado es `'granted'`: Todo listo, podemos proceder directamente.
4.  Si el estado es `'denied'`: El usuario bloqueó el acceso previamente.

## PASO 4: Protocolo de Recuperación en Android/PC
Cuando el estado es `'denied'`, el popup **no aparecerá**. Debemos guiar al usuario manualmente:
1.  **Instrucción Visual**: Mostrar un gráfico o texto que diga: *"Haz clic en el candado 🔒 junto a la URL"*.
2.  **Reset**: El usuario debe cambiar "Bloquear" por "Permitir" en ese menú.
3.  **Refresco**: La página debe recargarse para que el cambio surta efecto.

## PASO 5: Configuración del Servidor (DigitalOcean)
Asegurar que el servidor no esté filtrando el hardware.
- **Acción**: Configurar Caddy o Nginx para incluir la cabecera:
  `Permissions-Policy: camera=(self), microphone=(self)`
- **Por qué**: Si esta cabecera falta o está mal configurada, el navegador denegará el acceso por "Policy Violation" aunque el usuario diga que sí.

## PASO 6: Persistencia mediante PWA
El último paso para que los permisos "no se olviden" es la instalación.
1.  **Iconos**: Asegurar que los iconos en `/public` son válidos (192px y 512px).
2.  **Instalación**: Al abrir MediCampo desde el icono del escritorio, el navegador le otorga permisos de "App Nativa", que son mucho más duraderos.

---
### Checklist de Verificación Final:
- [ ] ¿El sitio es HTTPS?
- [ ] ¿Hay iconos en la carpeta /public?
- [ ] ¿El PreFlightCheck se lanza con un clic o al cargar?
- [ ] ¿Existe el botón para entrar solo con audio?

---
*Documento de Referencia Técnica - MediCampo v2*
