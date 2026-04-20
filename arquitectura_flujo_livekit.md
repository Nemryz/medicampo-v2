# Arquitectura y Flujo de Funcionamiento: MediCampo LiveKit SFU

Este documento describe el flujo lógico y técnico del sistema de videollamadas tras la migración de PeerJS (P2P) a LiveKit (SFU).

---

## 1. El Cambio: P2P vs SFU (Justificación Técnica)

### Sistema Anterior (PeerJS / P2P)
*   **Funcionamiento**: Los navegadores intentaban conectarse directamente entre sí.
*   **Problema**: Si uno de los usuarios tenía una conexión inestable o estaba tras un firewall corporativo, la llamada fallaba. El consumo de CPU subía exponencialmente con cada participante extra.

### Sistema Actual (LiveKit / SFU)
*   **Funcionamiento**: Todos los participantes se conectan a un servidor central inteligente (Selective Forwarding Unit).
*   **Beneficio**: El servidor gestiona el ancho de banda. Si un usuario tiene internet lento, el servidor le envía una versión de menor resolución sin afectar al otro. Es **estable, seguro y escalable**.

---

## 2. Flujo de Operación (Paso a Paso)

### Fase 1: Solicitud de Acceso (Backend)
1.  El Frontend detecta que el usuario entró a una ruta de videollamada (`/videocall/:roomId`).
2.  Envía una petición `GET` a `/api/livekit/token`.
3.  El **Backend** valida la sesión del usuario (SOLID: Responsabilidad de Seguridad).
4.  Se genera un **JWT firmado** con la `API_SECRET` que contiene los permisos del usuario.

### Fase 2: Establecimiento de Conexión (Infraestructura)
1.  El Frontend recibe el token y lo entrega al componente `<LiveKitRoom />`.
2.  El componente abre un **WebSocket Seguro (WSS)** contra `medicampo-rtc.duckdns.org`.
3.  El servidor LiveKit valida la firma del token. Si es correcto, el usuario entra a la sala.

### Fase 3: Intercambio de Medios y Datos (Frontend)
1.  **Video/Audio**: Se inicia el flujo mediante `GridLayout` (SOLID: Responsabilidad de Interfaz).
2.  **Chat**: Se abre un canal de datos paralelo para mensajes instantáneos mediante `ChatConsulta`.
3.  **Optimización**: El servidor SFU monitorea la calidad y ajusta el flujo en tiempo real.

### Fase 4: Finalización y Persistencia
1.  El Médico completa la ficha clínica en el panel lateral.
2.  Al presionar "Guardar", se envía la información a la API de MediCampo (PostgreSQL).
3.  Se ejecuta `navigate(-1)`, lo que destruye los componentes de LiveKit y cierra las conexiones automáticamente.

---

## 3. Guía de Mantenimiento y Modificación

### ¿Cómo modificar el comportamiento?
*   **Cambiar duración de sesiones**: Edita el `ttl` en `livekitController.ts`.
*   **Añadir grabación**: Se debe configurar el componente `Egress` en el servidor LiveKit y añadir un endpoint en el backend.
*   **Cambiar calidad de video**: Se puede ajustar en las opciones del componente `LiveKitRoom` en el frontend.

---
**Principios SOLID Aplicados**: 
*   **S**: El backend solo emite tokens, no procesa video.
*   **O**: El sistema es abierto para añadir nuevos tipos de participantes (ej. especialistas invitados) sin modificar la base.
*   **L**: `ChatConsulta` y `Videollamada` son intercambiables y no dependen de implementaciones internas de red.
