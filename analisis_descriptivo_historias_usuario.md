# Análisis Descriptivo de Historias de Usuario — MediCampo

> **Documento:** Análisis del Sprint Backlog actual, avances realizados y backlog futuro.
> **Fecha:** 28/04/2026
> **Propósito:** Documento vivo para seguimiento del progreso del proyecto y planificación de futuros sprints.

---

## 📋 Resumen Ejecutivo

El proyecto **MediCampo** es una plataforma de telemedicina diseñada para conectar pacientes rurales con médicos a través de videollamadas seguras, historial clínico digital, reserva de teleconsultas y panel de administración. Actualmente se encuentra en una etapa avanzada de desarrollo con las historias de usuario base (HU00-HU06) mayormente implementadas, y un conjunto de historias extra (HU07-HU15) en distintas fases de planificación e implementación.

---

## 🟢 HU00: Preparación Técnica

### Estado: ✅ COMPLETADA

### Descripción
Configuración inicial del entorno de desarrollo, repositorio y herramientas (Node.js, Express, Base de Datos, estructura, entre otros).

### Análisis de Implementación en Código

| Tarea | Estado | Evidencia en Código |
|-------|--------|---------------------|
| 1. Inicializar repositorios frontend/backend | ✅ Completo | Estructura de carpetas `backend/` y `frontend/` en raíz del proyecto. Repositorio Git configurado con `.gitignore` en backend. |
| 2. Configurar servidor Express.js + Node.js | ✅ Completo | `backend/src/server.ts`: Servidor Express con CORS, Socket.io, JWT middleware y rutas montadas. |
| 3. PostgreSQL + DigitalOcean + Docker | ✅ Completo | `backend/prisma/schema.prisma`: Conexión PostgreSQL vía `DATABASE_URL`. Prisma ORM configurado. Seed con datos demo en `prisma/seed.ts`. |
| 4. Migrar frontend Vite/React a `frontend/` | ✅ Completo | `frontend/` con Vite, React, TypeScript, TailwindCSS. `frontend/src/main.tsx` con HashRouter y PWA. |
| 5. Variables de entorno, ESLint, Prettier, TypeScript | ✅ Parcial | `backend/.env.example` con variables base. `tsconfig.json` en backend con TypeScript estricto. **No se detectan configuraciones de ESLint ni Prettier.** |
| 6. Cargar datos de Excel a PostgreSQL | ✅ Completo | `backend/prisma/seed.ts`: Carga datos demo (admin, doctores, paciente, especialidades). |

### Observaciones
- ✅ **Repositorio Git**: Inicializado con remote `origin: https://github.com/nemryz/medicampo-v2.git`
- ✅ **TypeScript**: Configurado en backend con `strict: true`
- ⚠️ **ESLint/Prettier**: No se encontraron archivos de configuración (`.eslintrc`, `.prettierrc`). Pendiente de implementar.
- ✅ **Docker**: Mencionado en requerimientos pero no se encontraron `Dockerfile` o `docker-compose.yml` en el código. Pendiente de implementar.
- ✅ **Seed de datos**: Funcional con 4 usuarios demo y 2 especialidades.

---

## 🟢 HU01: Videollamada Segura

### Estado: ✅ COMPLETADA (con mejoras pendientes)

### Descripción
Yo como usuario (paciente rural) necesito realizar una videollamada con un médico, para poder tener una consulta médica y recibir un diagnóstico y tratamiento, con la seguridad de que la información compartida es confidencial.

### Análisis de Implementación en Código

| Componente | Archivo | Estado | Detalle |
|------------|---------|--------|---------|
| Generación de tokens LiveKit | `backend/src/controllers/livekitController.ts` | ✅ Completo | Clase `LiveKitController` con método `getAccessToken`. Usa `livekit-server-sdk`. TTL de 10 minutos. Permisos: `canPublish`, `canSubscribe`, `canPublishData`. |
| Ruta de tokens | `backend/src/routes/livekitRoutes.ts` | ✅ Completo | `GET /api/livekit/token` protegida con middleware `protect` (JWT). |
| Interfaz de videollamada | `frontend/src/components/Videollamada.tsx` | ✅ Completo | Componente `Videollamada` con `<LiveKitRoom>`, controles de micrófono/cámara, chat, ficha clínica lateral. |
| Chat en tiempo real | `frontend/src/components/ChatConsulta.tsx` | ✅ Completo | Hook `useChat` de LiveKit. Mensajería por Data Channel WebRTC. |
| Pre-flight check | `frontend/src/components/PreFlightCheck.tsx` | ✅ Completo | Validación de hardware (cámara/micrófono) antes de entrar a la sala. Soporte para modo "Solo Audio". |
| Sandbox de pruebas | `frontend/src/components/LiveKitTest.tsx` | ✅ Completo | Entorno aislado para probar LiveKit sin depender del flujo de citas real. Ruta `/livekit-test`. |
| Ruteo de sala | `frontend/src/App.tsx` | ✅ Completo | Ruta `/room/:roomId` renderiza `<Videollamada />`. |

### Observaciones
- ✅ **LiveKit SDK**: Integrado correctamente con `@livekit/components-react` y `livekit-client`.
- ✅ **Autenticación**: Middleware `protect` valida JWT antes de generar tokens.
- ✅ **Controles**: Botones para micrófono, cámara, finalizar llamada con feedback visual.
- ✅ **Chat**: Integrado dentro de la videollamada con interfaz de usuario.
- ⚠️ **Pendiente**: Mejora de rendimiento para conexiones rurales (HU07).
- ⚠️ **Pendiente**: Verificación de identidad del paciente antes de ingresar a la sala (HU09).

---

## 🟢 HU02: Historial Clínico

### Estado: ✅ COMPLETADA

### Descripción
Yo como médico necesito guardar notas clínicas del paciente durante la consulta, como el diagnóstico, tratamiento y recomendaciones.

### Análisis de Implementación en Código

| Componente | Archivo | Estado | Detalle |
|------------|---------|--------|---------|
| Modelo Prisma | `backend/prisma/schema.prisma` (modelo `ClinicalRecord`) | ✅ Completo | Relación 1:1 con `Appointment`. Campos: weight, height, bloodPressure, temperature, heartRate, oxygenSat, allergies, symptoms, diagnosis, prescription, observations. |
| Endpoint guardar ficha | `backend/src/controllers/clinicalController.ts` (POST) | ✅ Completo | `POST /api/clinical/:appointmentId` — Guarda/actualiza ficha clínica. Solo DOCTOR. Marca cita como COMPLETED. |
| Endpoint historial paciente | `backend/src/controllers/clinicalController.ts` (GET) | ✅ Completo | `GET /api/clinical/patient/:patientId` — Historial completo del paciente. |
| Endpoint ficha específica | `backend/src/controllers/clinicalController.ts` (GET) | ✅ Completo | `GET /api/clinical/appointment/:appointmentId` — Ficha de cita específica. |
| Interfaz de historial | `frontend/src/components/HistorialClinico.tsx` | ✅ Completo | Vista detalle con reporte médico imprimible y vista lista con historial general. |
| Ficha clínica en videollamada | `frontend/src/components/Videollamada.tsx` | ✅ Completo | Panel lateral con formulario para diagnóstico y prescripción durante la llamada. |

### Observaciones
- ✅ **Modelo de datos**: Completo con signos vitales, síntomas, diagnóstico, prescripción y observaciones.
- ✅ **Seguridad**: Solo el médico asignado a la cita puede guardar/editar la ficha.
- ✅ **Auto-actualización**: Al guardar la ficha, la cita se marca automáticamente como COMPLETED.
- ✅ **Interfaz de impresión**: Botón "Imprimir Receta / Ficha" en la vista detalle.
- ⚠️ **Pendiente**: Formato oficial de receta médica imprimible (HU08).

---

## 🟢 HU03: Registro e Inicio de Sesión

### Estado: ✅ COMPLETADA

### Descripción
Yo como usuario (médico) necesito poder registrarme e iniciar sesión en la plataforma para acceder de forma segura a mis consultas.

### Análisis de Implementación en Código

| Componente | Archivo | Estado | Detalle |
|------------|---------|--------|---------|
| Endpoint registro | `backend/src/controllers/authController.ts` (register) | ✅ Completo | `POST /api/auth/register` — Crea usuario con rol PATIENT por defecto. Hash de contraseña con bcryptjs. |
| Endpoint login | `backend/src/controllers/authController.ts` (login) | ✅ Completo | `POST /api/auth/login` — Verifica credenciales, devuelve JWT con payload {sub, role, name}. |
| Middleware de autenticación | `backend/src/middleware/authMiddleware.ts` | ✅ Completo | Middleware `protect` que verifica JWT en header Authorization. |
| Rutas protegidas | `frontend/src/App.tsx` (RoleRoute) | ✅ Completo | Componente `RoleRoute` que verifica `user.role` y redirige si no tiene permisos. |
| Contexto de autenticación | `frontend/src/context/AuthContext.tsx` | ✅ Completo | AuthProvider con login, logout, persistencia en localStorage. |
| Interfaz Login | `frontend/src/components/auth/Login.tsx` | ✅ Completo | Formulario con email/contraseña, diseño dark premium. |
| Interfaz Register | `frontend/src/components/auth/Register.tsx` | ✅ Completo | Formulario con nombre, RUT, email, contraseña. Auto-login tras registro. |

### Observaciones
- ✅ **Roles implementados**: PATIENT, DOCTOR, ADMIN.
- ✅ **JWT**: Token con expiración de 1 día.
- ✅ **Persistencia de sesión**: Token y usuario guardados en localStorage.
- ✅ **Rutas protegidas por rol**: PACIENTE no puede acceder a dashboard médico, etc.
- ⚠️ **Pendiente**: Interfaz de administración para crear médicos y administradores (HU06).
- ⚠️ **Pendiente**: El registro solo crea pacientes por defecto. No hay flujo para registro de médicos desde el frontend.

---

## 🟢 HU04: Reserva de Teleconsultas

### Estado: 🟡 PARCIALMENTE COMPLETADA

### Descripción
Yo como paciente rural necesito poder agendar una teleconsulta con un médico disponible.

### Análisis de Implementación en Código

| Tarea | Estado | Evidencia en Código |
|-------|--------|---------------------|
| 1. Diseño interfaz de reserva | ✅ Completo | `frontend/src/components/ReservaCita.tsx` — UI con selección de médico, fecha y hora. |
| 2. Lista de especialidades y médicos | ✅ Completo | Endpoint `GET /api/appointments/doctors` devuelve doctores con especialidad. Frontend consume y muestra. |
| 3. Interfaz con filtros | ✅ Completo | Selector de médico (paso 1), fecha y hora (paso 2). |
| 4. Modelo de reserva en Prisma | ✅ Completo | Modelo `Appointment` con patientId, doctorId, date, status, meetingLink. |
| 5. Endpoint de reserva | ✅ Completo | `POST /api/appointments/book` — Crea cita con estado PENDING y genera meetingLink. |
| 6. Endpoint aceptación/rechazo | ✅ Completo | `PATCH /api/appointments/:id/status` — Solo el médico asignado puede cambiar estado. |
| 7. Interfaz aceptación/rechazo médico | ✅ Completo | `DashboardMedico.tsx` — Botones ✓ y ✗ para aceptar/rechazar citas pendientes. |
| 8. Lógica para evitar choque de citas | ❌ Pendiente | No se encontró validación de horarios superpuestos en `appointmentController.ts`. |
| 9. Generar enlace único | ✅ Completo | `meetingLink: /room/${Math.random().toString(36).substring(7)}` al crear la cita. |
| 10. Interfaz para choque de citas | ❌ Pendiente | Marcado como pendiente en el backlog original. |

### Observaciones
- ✅ **Flujo completo**: Paciente agenda → Médico acepta/rechaza → Enlace único generado.
- ✅ **Dashboard médico**: Muestra citas de hoy, pendientes, futuras y completadas.
- ✅ **Dashboard paciente**: Muestra citas próximas con estado y botón para ingresar a sala.
- ⚠️ **Pendiente crítico**: No hay validación de choque de horarios. Un paciente podría agendar múltiples citas en el mismo horario con diferentes médicos, o un médico podría tener citas superpuestas.
- ⚠️ **Pendiente**: Horarios fijos (`getAvailableTimes()` devuelve array estático). No hay gestión de disponibilidad real del médico.

---

## 🔴 HU05: Notificaciones de Cita

### Estado: ❌ NO IMPLEMENTADA

### Descripción
Yo como paciente rural necesito recibir recordatorios automáticos de mi cita, 24 y 1 hora antes de la teleconsulta.

### Análisis de Implementación en Código

| Tarea | Estado | Observación |
|-------|--------|-------------|
| 1. Integrar API de correos (Nodemailer/Resend) | ❌ Pendiente | No se encontró configuración de Nodemailer ni dependencia en `package.json`. |
| 2. Crear cron job para envío de notificaciones | ❌ Pendiente | No existe carpeta `backend/src/jobs/` ni configuración de cron. |
| 3. Lógica de notificación 24h y 1h antes | ❌ Pendiente | No implementado. |
| 4. Interfaz de recordatorio de citas | ❌ Pendiente | No implementado. |
| 5. Configuración perfil paciente para notificaciones | ❌ Pendiente | No implementado. |

### Observaciones
- ❌ **Sin implementación**: Ninguna de las 5 tareas tiene código asociado.
- ⚠️ **Dependencia**: Para implementar se necesita añadir `node-cron` o `node-schedule` y un servicio de correos (Nodemailer, Resend, SendGrid).
- ⚠️ **Prioridad**: Funcionalidad crítica para reducir ausentismo en teleconsultas.

---

## 🟡 HU06: Panel de Administración

### Estado: 🟡 PARCIALMENTE COMPLETADA

### Descripción
Yo como administrador del sistema necesito poder gestionar usuarios (pacientes y médicos), especialidades, médicos y horarios de atención.

### Análisis de Implementación en Código

| Tarea | Estado | Evidencia en Código |
|-------|--------|---------------------|
| 1. Modelo de Usuario con roles | ✅ Completo | `schema.prisma`: `role String @default("PATIENT")` con valores PATIENT, DOCTOR, ADMIN. |
| 2. Endpoints CRUD para usuarios (admin) | ❌ Pendiente | No existen rutas específicas para administración de usuarios. |
| 3. UI del panel de administración | ✅ Parcial | `DashboardAdmin.tsx` — Muestra estadísticas (pacientes, doctores, citas, tasa de cumplimiento). |
| 4. Middleware de autenticación por rol | ✅ Parcial | `authMiddleware.ts` — Verifica JWT pero no tiene middleware específico de verificación de rol ADMIN. Se verifica inline en los controladores. |
| 5. Sistema de auditoría básica (logs) | ❌ Pendiente | No se encontró modelo `AuditLog` ni sistema de logging de accesos. |
| 6. Interfaz de administración en React | ✅ Parcial | DashboardAdmin con KPIs, barra de progreso y actividad reciente. |
| 7. Eliminación de citas | ✅ Completo | Endpoint `DELETE /api/appointments/all` protegido para ADMIN. Botón "Limpiar Todas las Citas" en DashboardAdmin. |

### Observaciones
- ✅ **Estadísticas**: Endpoint `GET /api/clinical/admin/stats` devuelve totalPatients, totalDoctors, totalAppointments, completedAppointments, recentAppointments.
- ⚠️ **Pendiente**: No hay CRUD de usuarios (crear/editar/eliminar médicos, pacientes).
- ⚠️ **Pendiente**: No hay gestión de especialidades ni horarios de atención.
- ⚠️ **Pendiente**: No hay sistema de auditoría/logs.
- ⚠️ **Pendiente**: El middleware de roles es básico (solo verifica JWT, no hay middleware específico `requireRole('ADMIN')`).

---

## 📋 HISTORIAS DE USUARIO EXTRA

---

## 🟡 HU07: Videollamada de Alta Disponibilidad

### Estado: 🟡 PARCIALMENTE COMPLETADA

### Descripción
Yo como usuario (médico/paciente) necesito que mis videollamadas sean estables y no consuman exceso de recursos.

### Análisis de Implementación en Código

| Tarea | Estado | Observación |
|-------|--------|-------------|
| 1. Optimizar con LiveKit (SFU) | ✅ Completo | Migración de PeerJS a LiveKit completada. Arquitectura SFU implementada. |
| 2. Mantener servidor LiveKit desplegado | ✅ Parcial | Controlador configurado. Pendiente verificar despliegue en DigitalOcean con Docker. |
| 3. Integrar credenciales LiveKit con frontend | ✅ Completo | `VITE_LIVEKIT_URL` en variables de entorno. Token generado vía backend. |
| 4. Controles de videollamada en React | ✅ Completo | `ControlesPersonalizados` en `Videollamada.tsx` con micrófono, cámara, colgar. |
| 5. Bajar consumo para conexiones rurales | ❌ Pendiente | No se encontró lógica específica de adaptación de bitrate para redes lentas. |

### Observaciones
- ✅ **LiveKit SFU**: Implementado y funcional.
- ✅ **Sandbox de pruebas**: `LiveKitTest.tsx` para pruebas aisladas.
- ⚠️ **Pendiente**: Optimización de streaming para conexiones de bajo ancho de banda (adaptative bitrate).

---

## 🔴 HU08: Generación y Reporte de Receta Médica Imprimible

### Estado: ❌ NO IMPLEMENTADA (solo vista previa básica)

### Descripción
Yo como paciente necesito poder guardar e imprimir mis recetas y diagnósticos médicos en un formato oficial.

### Análisis de Implementación en Código

| Tarea | Estado | Observación |
|-------|--------|-------------|
| 1. Diseñar layout de receta médica | ❌ Pendiente | `HistorialClinico.tsx` tiene vista detalle pero no es formato oficial de receta. |
| 2. Integrar funcionalidad de impresión/descarga | ✅ Parcial | Botón "Imprimir Receta / Ficha" usa `window.print()`. No hay descarga PDF. |
| 3. Visualización correcta del documento | ❌ Pendiente | No hay estilos `@media print` específicos para formato oficial. |
| 4. Cron job para generar PDF y enviar por correo | ❌ Pendiente | No implementado. |
| 5. Interfaz de administración | ❌ Pendiente | No implementado. |
| 6. Refactorizar backend (SOLID) | ✅ Completo | Implementado el 28/04/2026. Se crearon interfaces, repositorios, servicios y controladores separados. Arquitectura en capas con inyección de dependencias. Build compila sin errores. |
| 7. Mejorar UI para impresión/descarga | ❌ Pendiente | No implementado. |

### Observaciones
- ✅ **Vista previa básica**: `HistorialClinico.tsx` muestra diagnóstico, prescripción y datos del paciente.
- ⚠️ **Pendiente**: Diseño oficial tipo receta médica con márgenes, fuentes serif, encabezado/pie de página.
- ⚠️ **Pendiente**: Descarga como PDF (requiere html2canvas.js + jsPDF o similar).
- ⚠️ **Pendiente**: Estilos `@media print` para ocultar botones y navbar.

---

## 🟡 HU09: Sincronización Automática de Identidad en Salas Virtuales

### Estado: 🟡 PARCIALMENTE COMPLETADA

### Descripción
Yo como médico necesito saber exactamente quién es el paciente que está en mi sala antes de iniciar la consulta.

### Análisis de Implementación en Código

| Tarea | Estado | Observación |
|-------|--------|-------------|
| 1. Endpoint GET /api/appointments/room/:roomId | ✅ Completo | `appointmentController.ts` — `getAppointmentByRoomId` mapea sala con cita. |
| 2. Bloqueos visuales mientras se espera confirmación | ✅ Parcial | `PreFlightCheck.tsx` — Validación de hardware. No hay verificación de identidad del paciente. |
| 3. Mostrar información del paciente al médico | ✅ Completo | `Videollamada.tsx` — Panel lateral muestra nombre y RUT del paciente. |
| 4. Cambios en sala virtual React | ✅ Completo | `Videollamada.tsx` — Muestra datos del paciente en ficha clínica. |
| 5. Mejorar UI para sincronización de identidad | ❌ Pendiente | No implementado. |
| 6. Mejorar UI para móvil/navegador | ❌ Pendiente | No implementado. |

### Observaciones
- ✅ **Endpoint de mapeo**: Funcional. Permite obtener datos de la cita a partir del roomId.
- ✅ **Información visible**: El médico ve nombre y RUT del paciente durante la llamada.
- ⚠️ **Pendiente**: Verificación de que el usuario que solicita el token es realmente el paciente asignado a la cita.
- ⚠️ **Pendiente**: Pantalla de carga/bloqueo hasta que ambas partes estén autenticadas.

---

## 🟡 HU10: Experiencia de Usuario en Dashboards

### Estado: 🟡 PARCIALMENTE COMPLETADA

### Descripción
Yo como paciente necesito que los paneles de control respondan rápidamente y redirijan automáticamente.

### Análisis de Implementación en Código

| Tarea | Estado | Observación |
|-------|--------|-------------|
| 1. Redirección instantánea tras aceptar citas de hoy | ✅ Completo | `DashboardMedico.tsx` — `handleStatusUpdate` redirige a sala si la cita es hoy. |
| 2. Mejorar diseño tarjeta "en espera" | ✅ Parcial | `DashboardPaciente.tsx` — Tarjetas con estado PENDING tienen estilo diferenciado. |
| 3. Limpieza de estado al desmontar componentes | ❌ Pendiente | No se encontró lógica de cleanup en `Videollamada.tsx` al desmontar. |

### Observaciones
- ✅ **Redirecciones**: Implementadas con `useNavigate` de React Router.
- ✅ **Estados visuales**: Badges de colores para cada estado (CONFIRMED, PENDING, COMPLETED, CANCELLED).
- ⚠️ **Pendiente**: Cleanup de conexiones WebRTC/LiveKit al salir de la sala.
- ⚠️ **Pendiente**: Mejora de skeletons y estados de carga.

---

## 🔴 HU11: Integración de 1Password para Gestión Segura de Secretos

### Estado: ❌ NO IMPLEMENTADA

### Descripción
Proteger todas las credenciales, claves API y secretos de configuración.

### Tareas Pendientes
1. ❌ Instalar extensión 1Password for VS Code.
2. ❌ Configurar bóveda específica para el proyecto.
3. ❌ Reemplazar valores en texto plano por referencias `op://`.
4. ❌ Verificar detección automática de nuevas claves.
5. ❌ Documentar procedimiento en README.

---

## 🔴 HU12: Integración de Snyk para Escaneo Continuo de Vulnerabilidades

### Estado: ❌ NO IMPLEMENTADA

### Descripción
Detectar proactivamente vulnerabilidades en dependencias de npm y Docker.

### Tareas Pendientes
1. ❌ Instalar extensión Snyk en VS Code.
2. ❌ Ejecutar escaneo inicial del proyecto.
3. ❌ Analizar Dockerfile para imágenes base inseguras.
4. ❌ Configurar escaneos automáticos.
5. ❌ Incorporar revisión periódica en definición de "Done".

---

## 🔴 HU13: Integración de CodeQL para Análisis Estático Avanzado

### Estado: ❌ NO IMPLEMENTADA

### Descripción
Analizar código fuente en busca de vulnerabilidades complejas.

### Tareas Pendientes
1. ❌ Instalar extensión CodeQL en VS Code.
2. ❌ Seleccionar base de datos de consultas de seguridad.
3. ❌ Ejecutar análisis completo del backend.
4. ❌ Revisar hallazgos y corregir verdaderos positivos.
5. ❌ Incorporar CodeQL como paso previo a Pull Requests.

---

## 🔴 HU14: Integración de Keploy para Generación Automática de Pruebas

### Estado: ❌ NO IMPLEMENTADA

### Descripción
Acelerar la creación de tests unitarios y de integración.

### Tareas Pendientes
1. ❌ Instalar extensión Keploy en VS Code.
2. ❌ Generar pruebas para controlador de agendamiento.
3. ❌ Generar pruebas para controlador de historial clínico.
4. ❌ Generar pruebas de integración para autenticación.
5. ❌ Revisar y ejecutar pruebas generadas.
6. ❌ Integrar tests en flujo de trabajo (Husky/GitHub Actions).

---

## 🔴 HU15: Integración de SecureCodeGuard para Detección en Tiempo Real

### Estado: ❌ NO IMPLEMENTADA

### Descripción
Recibir alertas instantáneas mientras se escribe código sobre posibles vulnerabilidades.

### Tareas Pendientes
1. ❌ Instalar extensión SecureCodeGuard en VS Code.
2. ❌ Configurar reglas de análisis para TypeScript y React.
3. ❌ Revisar componentes actuales del frontend.
4. ❌ Atender alertas durante desarrollo de nuevas características.
5. ❌ Ajustar configuración para balance entre rigurosidad y productividad.

---

## 📊 TABLA RESUMEN DE ESTADO GENERAL

| Historia de Usuario | Estado | Progreso |
|---------------------|--------|----------|
| **HU00** — Preparación Técnica | ✅ Completada | ~90% |
| **HU01** — Videollamada Segura | ✅ Completada | ~90% |
| **HU02** — Historial Clínico | ✅ Completada | ~95% |
| **HU03** — Registro e Inicio de Sesión | ✅ Completada | ~90% |
| **HU04** — Reserva de Teleconsultas | 🟡 Parcial | ~75% |
| **HU05** — Notificaciones de Cita | ❌ No implementada | 0% |
| **HU06** — Panel de Administración | 🟡 Parcial | ~50% |
| **HU07** — Videollamada Alta Disponibilidad | 🟡 Parcial | ~60% |
| **HU08** — Receta Médica Imprimible | ❌ No implementada | ~10% |
| **HU09** — Sincronización Identidad Salas | 🟡 Parcial | ~50% |
| **HU10** — UX en Dashboards | 🟡 Parcial | ~60% |
| **HU11** — 1Password Secretos | ❌ No implementada | 0% |
| **HU12** — Snyk Vulnerabilidades | ❌ No implementada | 0% |
| **HU13** — CodeQL Análisis Estático | ❌ No implementada | 0% |
| **HU14** — Keploy Pruebas Automáticas | ❌ No implementada | 0% |
| **HU15** — SecureCodeGuard | ❌ No implementada | 0% |

---

## 🎯 RECOMENDACIONES PARA EL BACKLOG FUTURO

### Prioridad Alta (Sprint Inmediato)
1. **HU05 — Notificaciones de Cita**: Implementar sistema de recordatorios por correo electrónico. Crítico para reducir ausentismo.
2. **HU04 — Validación de choque de horarios**: Implementar lógica para evitar citas superpuestas.
3. **HU06 — CRUD de usuarios para administradores**: Permitir crear/editar médicos y administradores desde el panel.

### Prioridad Media (Siguientes Sprints)
4. **HU08 — Receta Médica Imprimible**: Formato oficial con descarga PDF.
5. **HU09 — Verificación de identidad en salas**: Validar que el paciente que ingresa es el asignado a la cita.
6. **HU10 — Cleanup de conexiones**: Liberar recursos WebRTC al salir de la sala.

### Prioridad Baja (Mejora Continua)
7. **HU11 a HU15**: Herramientas de seguridad y calidad de código (1Password, Snyk, CodeQL, Keploy, SecureCodeGuard).
8. **ESLint/Prettier**: Configurar herramientas de formato y linting faltantes.
9. **Docker**: Crear Dockerfile y docker-compose.yml para backend y LiveKit.
10. **Tests**: Implementar suite de pruebas con Jest.

---

## 🔍 DETALLES TÉCNICOS ADICIONALES

### Backend — Estructura de Archivos
```
backend/
├── .env.example              # Variables de entorno (plantilla)
├── package.json              # Dependencias: express, prisma, bcryptjs, jsonwebtoken, livekit-server-sdk, socket.io
├── tsconfig.json             # TypeScript strict mode
├── prisma/
│   ├── schema.prisma         # Modelos: User, Specialty, Appointment, ClinicalRecord
│   └── seed.ts               # Datos demo (admin, doctores, paciente)
└── src/
    ├── server.ts             # Express + Socket.io + Rutas
    ├── config/               # Vacío
    ├── controllers/
    │   ├── authController.ts       # register, login
    │   ├── appointmentController.ts # CRUD citas
    │   ├── clinicalController.ts   # Fichas clínicas + stats admin
    │   └── livekitController.ts    # Tokens LiveKit
    ├── middleware/
    │   └── authMiddleware.ts       # protect (JWT verification)
    ├── models/               # Vacío
    └── routes/
        ├── authRoutes.ts           # /api/auth
        ├── appointmentRoutes.ts    # /api/appointments
        ├── clinicalRoutes.ts       # /api/clinical
        └── livekitRoutes.ts        # /api/livekit
```

### Frontend — Estructura de Archivos
```
frontend/
├── package.json              # Dependencias: react, livekit, tailwindcss, etc.
├── src/
│   ├── main.tsx              # Entry point con HashRouter + AuthProvider + PWA
│   ├── App.tsx               # Enrutador principal con RoleRoute
│   ├── index.css             # Design tokens + TailwindCSS
│   ├── context/
│   │   └── AuthContext.tsx   # Estado global de autenticación
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.tsx     # Inicio de sesión
│   │   │   └── Register.tsx  # Registro de usuarios
│   │   ├── dashboards/
│   │   │   ├── DashboardPaciente.tsx  # Panel paciente
│   │   │   ├── DashboardMedico.tsx    # Panel médico
│   │   │   └── DashboardAdmin.tsx     # Panel administrador
│   │   ├── Videollamada.tsx  # Sala de videollamada LiveKit
│   │   ├── ReservaCita.tsx   # Agendamiento de citas
│   │   ├── HistorialClinico.tsx  # Historial médico + receta
│   │   ├── ChatConsulta.tsx  # Chat en tiempo real
│   │   ├── PreFlightCheck.tsx # Validación de hardware
│   │   ├── LiveKitTest.tsx   # Sandbox de pruebas
│   │   └── Navbar.tsx        # Barra de navegación
│   ├── lib/
│   │   └── api.ts            # Cliente API centralizado
│   ├── types/
│   │   └── index.ts          # Tipos TypeScript
│   └── data/
│       └── mockData.ts       # Datos mock (obsoleto, usar API)
```

---

## 📈 MÉTRICAS DEL PROYECTO

- **Total Historias de Usuario**: 16 (HU00-HU15)
- **Completadas**: 4 (HU00, HU01, HU02, HU03)
- **Parcialmente Completadas**: 4 (HU04, HU06, HU07, HU09, HU10)
- **No Implementadas**: 7 (HU05, HU08, HU11, HU12, HU13, HU14, HU15)
- **Progreso General**: ~45%

---

*Documento generado el 28/04/2026. Este es un documento vivo que debe actualizarse conforme avance el proyecto.*
