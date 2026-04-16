# Plan Estratégico y Product Backlog: mediCampo v2

Este documento contiene la organización estructurada de las Épicas, Historias de Usuario y las tareas técnicas de desarrollo necesarias para la construcción de mediCampo en formato Full-Stack (Node.js/Backend y React/Frontend).

---

## Priorización de Desarrollo (Sprint 1)
Dado que las interfaces base para la Videollamada (H3) y el Historial Clínico (H4) fueron generadas de forma preliminar por Bolt.new, la prioridad estricta de ejecución es la siguiente:
1. **H0 (Preparación Técnica)**: Inicializar repositorio Git local limpio (desvinculado de Bolt.new) y configurar Node.js, Express y React en la nueva ruta `mediCampo-v2`.
2. **H1 (Autenticación)**: Desarrollar backend Auth (JWT) e UI interactiva. Sin esto, la seguridad y persistencia fallan.
3. **H2 (Reserva de Cita)**: Crear el agendamiento. Necesario para que la videollamada y el historial estén atados a una cita real, no a datos de prueba.
4. **H3 y H4 (Videollamada e Historial)**: Conectar los mockups existentes (actualmente estáticos) al backend real y a Socket.io.
5. **H5 y H6**: Finalizar notificaciones y panel de administración avanzado.

---
## 1. Épica 1: Acceso y autenticación (Seguridad y gestión de usuarios)
Esta épica agrupa las funcionalidades que permiten a los pacientes y médicos identificarse de forma segura, así como al administrador gestionar las cuentas. Es la base técnica sobre la que se construyen las demás funcionalidades.

### H0: Tareas técnicas de preparación
- **Descripción**: Configuración Inicial del entorno de desarrollo, repositorio y herramientas (Node.js, Express, Base de Datos, estructura fullstack).
- **Tareas Técnicas**:
  - [ ] `T0.1`: Inicializar repositorios para frontend y backend.
  - [ ] `T0.2`: Configurar servidor base con Express.js y Node.js.
  - [ ] `T0.3`: Aprovisionar y conectar servidor con PostgreSQL gestionado en la nube (ej. Azure for Students o DigitalOcean usando créditos de GitHub Student Pack).
  - [ ] `T0.4`: Migrar el frontend original (Vite/React) a la carpeta `frontend/`.
  - [ ] `T0.5`: Configurar variables de entorno, ESLint, Prettier y TypeScript en el backend.

### H1: Registro e inicio de sesión del paciente
- **Descripción**: “Yo como Paciente Rural necesito poder registrarme e iniciar sesión en la plataforma para acceder de forma segura a mis consultas...”.
- **Tareas Técnicas**:
  - [ ] `T1.1`: Crear esquema/modelo de Usuario (RUT, Nombre, Correo, Contraseña encriptada, Rol).
  - [ ] `T1.2`: Desarrollar endpoint de registro (`POST /api/auth/register`) con validaciones.
  - [ ] `T1.3`: Desarrollar endpoint de inicio de sesión (`POST /api/auth/login`) con generación de token JWT.
  - [ ] `T1.4`: Implementar UI iterativa en frontend para Registro y Login.
  - [ ] `T1.5`: Configurar lógica de manejo de sesión en el cliente y caducidad por inactividad.

### H6: Panel de administración
- **Descripción**: “Yo como Administrador del Sistema necesito gestionar usuarios (médicos y pacientes) desde un panel central...”.
- **Tareas Técnicas**:
  - [ ] `T6.1`: Modificar el modelo de Usuario para soportar roles (`Admin`, `Patient`, `Doctor`).
  - [ ] `T6.2`: Crear endpoints CRUD para usuarios orientados a administradores.
  - [ ] `T6.3`: Desarrollar UI del panel de administración en React.
  - [ ] `T6.4`: Implementar middleware de autenticación por rol en el backend para proteger las rutas.
  - [ ] `T6.5`: Crear sistema de auditoría básica (logs) para registrar accesos y modificaciones.

---

## 2. Épica 2: Gestión de la Atención Médica (Reservas y Teleconsultas)
Esta épica contiene las funcionalidades core del sistema, aportando el valor clínico directo (desde la reserva hasta la videollamada y su historial).

### H2: Reserva de Teleconsulta
- **Descripción**: “Yo como Paciente Rural necesito poder agendar una teleconsulta con un médico disponible…”.
- **Tareas Técnicas**:
  - [ ] `T2.1`: Crear modelos de Especialidades, Médicos y Disponibilidad horaria.
  - [ ] `T2.2`: Desarrollar modelos y endpoints para crear una cita (`Appointments`).
  - [ ] `T2.3`: Agregar lógica en el backend para prever choque de citas (prevenir dobles reservas en la misma franja).
  - [ ] `T2.4`: Desarrollar interfaz en React para búsqueda de doctores y visualización de calendario.
  - [ ] `T2.5`: Generar y enviar enlace único a la llamada al confirmar la cita.

### H3: Videollamada Segura *(Prioridad Sprint 1)*
- **Descripción**: “Yo como Paciente Rural necesito realizar una videollamada segura con el médico para recibir consulta...”.
- **Tareas Técnicas**:
  - [ ] `T3.1`: Implementar servidor Socket.io o usar la API de WebRTC/Twilio.
  - [ ] `T3.2`: Integrar interfaz de video usando las cámaras del cliente en React.
  - [ ] `T3.3`: Agregar controles para mutear, apagar cámara y colgar llamada.
  - [ ] `T3.4`: Mostrar indicadores de sesión segura e implementar finalización de sala.

### H4: Historial clínico *(Prioridad Sprint 1)*
- **Descripción**: “Yo como Médico necesito registrar y consultar el historial clínico pos-consulta del paciente...”.
- **Tareas Técnicas**:
  - [ ] `T4.1`: Crear modelo de Historial/Notas Clínicas asociado al paciente y cita.
  - [ ] `T4.2`: Endpoint para obtener citas pasadas y sus diagnósticos.
  - [ ] `T4.3`: Endpoint que reciba la nota clínica y actualice atómicamente el estado de la cita.
  - [ ] `T4.4`: Crear UI en frontend para visualizar ficha clínica e ingresar diagnóstico/observaciones.

### H5: Notificaciones de cita
- **Descripción**: “Yo como Paciente Rural necesito recibir recordatorios automáticos de mi cita...”.
- **Tareas Técnicas**:
  - [ ] `T5.1`: Integrar API de correos (ej. Nodemailer, Resend) o de SMS (Twilio).
  - [ ] `T5.2`: Configurar _Cron Jobs_ en Node.js (ej. `node-cron`) para barrer citas y enviar recordatorios.
  - [ ] `T5.3`: Lógica del algoritmo de notificación (24h antes y 1h antes).
  - [ ] `T5.4`: Añadir configuraciones al perfil del paciente para activar/desactivar notificaciones.

---

## 3. Épica 3: Calidad, operación, rendimiento, seguridad y mejora continua
Orientada a aspectos no funcionales, garantizando escalabilidad, accesibilidad en zona rural con poca conexión, etc.

- **Tareas Estratégicas**:
  - [ ] `TC.1`: Optimizar peso de la aplicación React (Lazy loading, optimización de imágenes).
  - [ ] `TC.2`: Optimizar consultas de la Base de datos con índices y evitar envíos de sobre-data en endpoints.
  - [ ] `TC.3`: Pruebas de resiliencia frente a caídas de conexión durante la videollamada y reconexión automática.
