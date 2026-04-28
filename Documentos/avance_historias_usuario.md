# Reporte de Avance: Historias de Usuario (HU 1 a 6) y Nuevas Propuestas

A continuación, se detalla el progreso de las historias de usuario base (HU 1 a 6), con sus respectivas tareas, descripciones y conceptos, y se proponen nuevas historias de usuario considerando las recientes mejoras arquitectónicas y funcionales implementadas en mediCampo v2.

---

## 📊 Avance de Historias de Usuario Base (HU 1 - 6)

### HU1: Registro e inicio de sesión del paciente
- **Descripción:** "Yo como Paciente Rural necesito poder registrarme e iniciar sesión en la plataforma para acceder de forma segura a mis consultas."
- **Concepto:** Implementación de un sistema de autenticación seguro basado en JWT, integración con base de datos mediante Prisma y protección de rutas en el frontend.
- **Estado:** ✅ Completado
- **Tareas:**
  - [x] T1.1: Crear esquema/modelo de Usuario (RUT, Nombre, Correo, Contraseña encriptada, Rol).
  - [x] T1.2: Desarrollar endpoint de registro (`POST /api/auth/register`) con validaciones.
  - [x] T1.3: Desarrollar endpoint de inicio de sesión (`POST /api/auth/login`) con generación de token JWT.
  - [x] T1.4: Implementar UI iterativa en frontend para Registro y Login.
  - [x] T1.5: Configurar lógica de manejo de sesión en el cliente y caducidad por inactividad.

### HU2: Reserva de Teleconsulta
- **Descripción:** "Yo como Paciente Rural necesito poder agendar una teleconsulta con un médico disponible."
- **Concepto:** Módulo de agendamiento que conecta especialidades, médicos y disponibilidad horaria, previniendo choques de horarios.
- **Estado:** ✅ Completado
- **Tareas:**
  - [x] T2.1: Crear modelos de Especialidades, Médicos y Disponibilidad horaria en Prisma.
  - [x] T2.2: Desarrollar modelos y endpoints para crear una cita (Appointments).
  - [x] T2.3: Agregar lógica en el backend para prever choque de citas.
  - [x] T2.4: Desarrollar interfaz en React para búsqueda de doctores y visualización de calendario.
  - [x] T2.5: Generar y enviar enlace único a la llamada al confirmar la cita.

### HU3: Videollamada Segura
- **Descripción:** "Yo como Paciente Rural necesito realizar una videollamada segura con el médico para recibir consulta."
- **Concepto:** Implementación de sala de telemedicina inicialmente concebida con P2P (PeerJS) y evolucionada para soportar interacción en tiempo real.
- **Estado:** ✅ Completado (con mejoras posteriores, ver HU7)
- **Tareas:**
  - [x] T3.1: Implementar servidor para comunicación RTC.
  - [x] T3.2: Integrar interfaz de video usando las cámaras del cliente en React.
  - [x] T3.3: Agregar controles para mutear, apagar cámara y colgar llamada.
  - [x] T3.4: Mostrar indicadores de sesión segura e implementar finalización de sala.

### HU4: Historial Clínico
- **Descripción:** "Yo como Médico necesito registrar y consultar el historial clínico pos-consulta del paciente."
- **Concepto:** Panel clínico dentro de la llamada para registro de síntomas, signos vitales y diagnóstico, sincronizado de forma atómica con PostgreSQL.
- **Estado:** ✅ Completado
- **Tareas:**
  - [x] T4.1: Crear modelo de Historial/Notas Clínicas asociado al paciente y cita.
  - [x] T4.2: Endpoint para obtener citas pasadas y sus diagnósticos.
  - [x] T4.3: Endpoint que reciba la nota clínica y actualice atómicamente el estado de la cita.
  - [x] T4.4: Crear UI en frontend para visualizar ficha clínica e ingresar diagnóstico/observaciones.

### HU5: Notificaciones de Cita
- **Descripción:** "Yo como Paciente Rural necesito recibir recordatorios automáticos de mi cita."
- **Concepto:** Sistema automatizado de correos/SMS mediante Cron Jobs para evitar el ausentismo en las teleconsultas.
- **Estado:** ⏳ Pendiente / En Desarrollo
- **Tareas:**
  - [ ] T5.1: Integrar API de correos (ej. Nodemailer, Resend) o de SMS.
  - [ ] T5.2: Configurar Cron Jobs en Node.js para barrer citas y enviar recordatorios.
  - [ ] T5.3: Lógica del algoritmo de notificación (24h antes y 1h antes).
  - [ ] T5.4: Añadir configuraciones al perfil del paciente para activar/desactivar notificaciones.

### HU6: Panel de Administración
- **Descripción:** "Yo como Administrador del Sistema necesito gestionar usuarios (médicos y pacientes) desde un panel central."
- **Concepto:** Centro de control administrativo protegido por middleware de roles para la moderación del sistema.
- **Estado:** ⏳ Pendiente / En Desarrollo
- **Tareas:**
  - [ ] T6.1: Modificar el modelo de Usuario para soportar roles (Admin, Patient, Doctor).
  - [ ] T6.2: Crear endpoints CRUD para usuarios orientados a administradores.
  - [ ] T6.3: Desarrollar UI del panel de administración en React.
  - [ ] T6.4: Implementar middleware de autenticación por rol en el backend.
  - [ ] T6.5: Crear sistema de auditoría básica (logs) para registrar accesos y modificaciones.

---

## 🚀 Nuevas Historias de Usuario (Basadas en Mejoras del Sistema)

Considerando la maduración de la arquitectura y la migración desde un entorno de prueba a una solución robusta (con LiveKit, PostgreSQL, Prisma, etc.), se establecen las siguientes nuevas Historias de Usuario:

### HU7: Videollamada de Alta Disponibilidad (Migración a LiveKit SFU)
- **Descripción:** "Yo como Usuario (Médico/Paciente) necesito que mis videollamadas sean estables y no consuman exceso de recursos de mi dispositivo, incluso con conexiones rurales inestables."
- **Concepto:** Reemplazo de la arquitectura PeerJS (P2P) por un servidor LiveKit (SFU) para que un servidor central gestione y optimice el ancho de banda y la calidad de video.
- **Tareas:**
  - [x] T7.1: Desplegar servidor LiveKit y configurar credenciales.
  - [x] T7.2: Crear endpoint en Node.js `/api/livekit/token` para generar JWT firmados de acceso a salas.
  - [x] T7.3: Refactorizar frontend (`Videollamada.tsx`) utilizando los componentes de `@livekit/components-react`.
  - [x] T7.4: Implementar lógica de reconexión y adaptación de bitrate según conexión del cliente.

### HU8: Generación y Reporte de Receta Médica Imprimible
- **Descripción:** "Yo como Paciente necesito poder guardar e imprimir mis recetas y diagnósticos médicos en un formato oficial para presentarlo en farmacias o centros de salud."
- **Concepto:** Creación de una vista estilo "documento oficial" optimizada para la impresión directa desde el navegador.
- **Tareas:**
  - [x] T8.1: Diseñar layout CSS específico para impresión (`@media print`).
  - [x] T8.2: Integrar funcionalidad nativa de navegador para activar diálogo de impresión (`Ctrl + P`).
  - [x] T8.3: Asegurar la correcta visualización de los datos del médico y el paciente en la receta impresa.

### HU9: Sincronización Automática de Identidad en Salas Virtuales
- **Descripción:** "Yo como Médico necesito saber exactamente quién es el paciente que está en mi sala antes de iniciar la consulta clínica."
- **Concepto:** Vincular el Room ID de la videollamada con el registro exacto de la base de datos de la cita, previniendo conexiones erróneas.
- **Tareas:**
  - [x] T9.1: Crear endpoint `GET /api/appointments/room/:roomId` para mapear el identificador de red con el registro relacional.
  - [x] T9.2: Desplegar bloqueos visuales o pantallas de carga hasta que ambas partes estén autenticadas.
  - [x] T9.3: Mostrar información resumida del paciente en la pantalla del médico dentro de la llamada.

### HU10: Experiencia de Usuario Fluida en Dashboards
- **Descripción:** "Yo como Usuario necesito que los paneles de control respondan rápidamente y me redirijan automáticamente al realizar una acción importante (como aceptar o finalizar una consulta)."
- **Concepto:** Mejoras iterativas en las redirecciones y manejo del estado global de React para evitar pantallas en blanco, refrescos innecesarios y pérdida de contexto de la sesión.
- **Tareas:**
  - [ ] T10.1: Implementar redirección instantánea tras aceptar citas de hoy (Dashboard Médico).
  - [ ] T10.2: Mejorar diseño de tarjeta "en espera" en Dashboard Paciente.
  - [x] T10.3: Limpieza de estado y cierre de conexiones al desmontar componentes de llamadas.
