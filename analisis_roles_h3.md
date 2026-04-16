# Análisis de Roles y Funciones Faltantes: Videollamada (H3) y Plataforma

Tras implementar el motor base de WebRTC y Socket.io, la infraestructura técnica funciona impecablemente. Sin embargo, para que `mediCampo` sea una plataforma apta para operar en entornos médicos reales, la Historia de Usuario 3 (H3) y la orquestación general necesitan evolucionar y adaptarse según el **Rol del Usuario**.

A continuación, evalúo detalladamente qué es lo que nos falta por implementar basándome en los tres perfiles clave de la plataforma:

## 1. Perspectiva del Paciente 👨‍⚕️
Actualmente el paciente puede ver la pantalla de cámara, pero la experiencia no controla el flujo de la cita. 

**Funcionalidades por agregar:**
- **Salas de Espera Virtuales**: El paciente no debería ver directamente su propia cámara a pantalla completa si el médico no se ha conectado aún. Debe existir un lobby de espera (*"Aguarde, el Dr. Martínez se conectará en breve..."*).
- **Control de Acceso Dinámico**: Ahora mismo usamos un id fijo (`medicampo-test-room`). Debemos programar que el componente lea el `meetingLink` único asigando en la Cita desde la base de datos PostgreSQL, evitando que otro paciente entre a tu consulta privada por accidente.

## 2. Perspectiva del Doctor 🩺
El doctor posee la máxima autoridad dentro de la consulta clínica. Su interfaz de videollamada no puede ser idéntica a la del paciente.

**Funcionalidades por agregar:**
- **Finalización de Cita y Lógica en DB**: Cuando el Doctor presione el botón "Finalizar Llamada", el frontend debe enviar una señal al servidor para cambiar el estado de la cita en PostgreSQL de `CONFIRMED` a `COMPLETED`. 
- **Integración In-Call del Historial (H4)**: El médico necesita poder abrir un panel lateral **durante** la videollamada para redactar la receta o leer los síntomas del paciente sin que se le apague la cámara.
- **Autoridad de Sesión**: Controles de arbitraje para silenciar el micrófono del paciente o aceptar/denegar su entrada desde la Sala de Espera.

## 3. Perspectiva del Administrador 🛡️
Un rol que suele olvidarse en las videollamadas médicas. El administrador jamás debe poder "entrar y mirar" la sesión clínica para proteger la confidencialidad médico-paciente (HIPAA compliance), pero DEBE tener métricas.

**Funcionalidades por agregar:**
- **Panel de Monitorización (Logs)**: Una vista exclusiva de Admin que detalle qué videollamadas están activas ahora mismo, qué salas de Socket.io existen, o si ocurrió un error en los servidores P2P.
- **Gestión Post-Llamada**: Capacidad de resolver conflictos si un paciente reclama que "el doctor nunca se conectó al enlace de la llamada" viendo el historial real de conexiones.

---

> [!WARNING]
> **El mayor desafío técnico a abordar ahora:**
> La asignación dinámica de salas. Necesitamos unir H2 (Reserva) con H3 (Video). Es decir, que el usuario en el Home no haga clic en "Cita Cualquiera", sino que haga clic en su tarjeta de "Cita a las 14:00" y eso lo redirija a un endpoint tipo `/room/ID-UNICO-DE-LA-CITA`, y que el backend verifique: *"¿Es este usuario el paciente de esta cita? Sí -> Déjalo pasar al canal de video"*.

**Conclusión / Plan de Acción**
Para completar verdaderamente H3 e insertar los cimientos de la futura H4, propongo:
1. Crear el sistema dinámico de URLs de Sala en React (Routing `/:roomId`).
2. Enseñar al Socket.io a verificar la identidad JWT antes de conectar el video.
3. Desarrollar la Sala de Espera para los perfiles de Rol "Paciente".
