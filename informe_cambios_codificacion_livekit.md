# Informe de Cambios: Integración de LiveKit en MediCampo

Este informe detalla las modificaciones a realizar en el código base de MediCampo para integrar la infraestructura de LiveKit que hemos configurado exitosamente.

---

## 1. Configuración de Entorno (Credenciales Vitales)

Deben agregarse las siguientes variables al archivo `backend/.env` y, opcionalmente, al `frontend/.env` (solo la URL):

*   **LIVEKIT_URL**: `wss://medicampo-rtc.duckdns.org`
*   **LIVEKIT_API_KEY**: `APIQGDQzr8pgWX4`
*   **LIVEKIT_API_SECRET**: `ly5Xjur3ZqMTSYHkUfxMevKXeg5isvawOodby4fz2luC`

---

## 2. Cambios en el Backend (API de Express)

### A. Generador de Access Tokens
Crearemos un controlador dedicado para LiveKit que utilice la librería `livekit-server-sdk`.
*   **Lógica**: Al recibir una solicitud, el servidor verificará el JWT del usuario y generará un token que le da acceso a una "Room" (ID de la cita médica).
*   **Archivo**: `backend/src/controllers/livekitController.ts` [NUEVO]

### B. Rutas de Acceso
Expondremos un nuevo endpoint para que el frontend solicite los tokens.
*   **Ruta**: `GET /api/livekit/token?room=CITA_ID&username=NOMBRE`
*   **Archivo**: `backend/src/routes/livekitRoutes.ts` [NUEVO]

---

## 3. Cambios en el Frontend (React + Vite)

### A. Reemplazo de Lógica en Videollamada
Modificaremos el componente actual para eliminar la dependencia de `PeerJS`.
*   **Uso de Hooks**: Implementaremos `useToken` para obtener el acceso y el componente `<LiveKitRoom>` para envolver la interfaz.
*   **Componentes de UI**: Usaremos `<VideoConference />` o una combinación de `<ParticipantTile />` para mostrar al médico y al paciente.
*   **Archivo**: `frontend/src/components/Videollamada.tsx` [MODIFICAR]

### B. Implementación de Chat en Tiempo Real
Aprovecharemos el Data Channel de LiveKit para el chat de la consulta.
*   **Lógica**: Uso del hook `useChat` para enviar y recibir mensajes de texto de forma instantánea.
*   **Archivo**: `frontend/src/components/ChatConsulta.tsx` [NUEVO]

---

## 4. Limpieza y Optimización

*   **Eliminación de PeerJS**: Se removerán todas las referencias a `peerjs` y el servidor de señalización interno de Express, reduciendo el consumo de memoria del backend.
*   **Simplificación de Sockets**: `Socket.io` se mantendrá solo para notificaciones generales, delegando toda la lógica de tiempo real de la consulta a LiveKit.

---

## 5. Flujo de Funcionamiento Post-Cambios

1.  **Inicio**: El Médico y el Paciente entran a la sala de espera.
2.  **Autenticación**: El frontend solicita un Token a la API de MediCampo.
3.  **Conexión**: Con el Token, el navegador se conecta directamente al servidor `medicampo-rtc.duckdns.org`.
4.  **Consulta**: Se inicia el video, el audio y el chat de forma simultánea y segura.

---
**Nota final**: La infraestructura ya está lista para recibir estas conexiones. No se requieren más cambios en el servidor de DigitalOcean.
