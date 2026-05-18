# Análisis y Expansión del Sprint Backlog V2 (Detallado con Implementaciones Técnicas)

Se hace mención a detalle del progreso de las historias de usuario base de las cuales se desprenden las tareas y funcionalidades implementadas en el proyecto, contrastado directamente con la arquitectura técnica y el código real que reside en los directorios `backend` y `frontend` del entorno de desarrollo. A su vez, se hace mención a las historias que quedan pendientes por implementar. Se busca que este sprint backlog detallado sirva como una documentación técnica profunda, un puente entre los requerimientos ágiles y el código fuente.

# Criterios de Aceptación y Estado de las Historias de Usuario

## HU00: Preparación Técnica

Esta es la configuración inicial del entorno de desarrollo, repositorio y herramientas (Node.js, Express, Base de Datos, estructura, entre otros).

### Concepto para Implementación Expandido

Inicializar repositorios para frontend y backend, manteniendo el control de versiones colaborativo. El uso de Prisma ORM facilita la gestión y migración de la base de datos PostgreSQL alojada en la nube, garantizando persistencia y escalabilidad. La arquitectura fullstack se divide explícitamente en:
- `backend/`: API RESTful construida con Node.js, Express y TypeScript, siguiendo un patrón MVC (Rutas y Controladores).
- `frontend/`: Single Page Application (SPA) en React compilada mediante Vite, con TailwindCSS para la UI.

### Tareas de la HU00 (Detalle Técnico)

1. **Inicializar repositorios**: La separación de carpetas en `cd backend` y `cd frontend` se encuentra establecida en el directorio raíz.
2. **Configurar servidor base**: Implementado en `backend/src/server.ts`, inicializando Express y mapeando los routers.
3. **PostgreSQL y ORM**: El archivo `backend/prisma/schema.prisma` define de forma declarativa la estructura de datos. Contiene los modelos `User`, `Specialty`, `Appointment` y `ClinicalRecord`. La conexión se da mediante el string `DATABASE_URL` del entorno.
4. **Migración del Frontend**: El frontend se inicializó con Vite. El archivo `frontend/src/App.tsx` funciona como el enrutador maestro.
5. **Configuración de variables y TypeScript**: Los archivos `tsconfig.json` en ambas carpetas aseguran el control de tipado. En el backend se utilizan variables de entorno cargadas vía `dotenv`.
6. **Datos pre-cargados**: Persistidos ahora en la base de datos real mediante migraciones de Prisma.

---

## HU01: Videollamada Segura

Yo como usuario (paciente rural) necesito realizar una videollamada con un medico, para poder tener una consulta medica y recibir un diagnostico y tratamiento, con la seguridad de que la informacion compartida es confidencial.

### Concepto para Implementación Expandido

Migración de la lógica Peer-to-Peer a una arquitectura **SFU (Selective Forwarding Unit)** proporcionada por **LiveKit**. Esto resuelve los problemas de rendimiento en redes inestables (rurales), ya que el servidor central optimiza el bitrate para cada participante individual.
El servidor requiere autenticación estricta: un participante no puede conectarse sin un **JWT (JSON Web Token)** válido firmado por el servidor de backend usando credenciales maestras (`API_KEY` y `API_SECRET`).

### Tareas de la HU01 (Detalle Técnico)

1. **(Backend) Despliegue de LiveKit y Credenciales**: Implementado en el archivo `backend/src/controllers/livekitController.ts`. La clase `LiveKitController` genera tokens de acceso.
2. **(Backend) Generación de Tokens Seguros**: El método `getAccessToken` utiliza el SDK `livekit-server-sdk` para inyectar permisos específicos (`canPublish`, `canSubscribe`, `canPublishData`) y devolver el token al cliente con un TTL (Time To Live) de 10 minutos para evitar accesos caducados.
3. **(Frontend) Integración React**: El componente en `frontend/src/components/Videollamada.tsx` y la ruta `/room/:roomId` en `App.tsx` procesan el token y renderizan la interfaz del `<LiveKitRoom />`.
4. **(Frontend) Reducción de Consumo**: LiveKit gestiona automáticamente el escalado de resolución en redes lentas.

---

## HU02: Historial Clínico

Yo como medico necesito guardar notas clinicas del paciente durante la consulta, como el diagnostico, tratamiento y recomendaciones.

### Concepto para Implementación Expandido

El panel médico debe estar disponible durante e inmediatamente después de la videollamada. A nivel base de datos, existe una relación de "uno a uno" entre una `Appointment` (Cita) y un `ClinicalRecord` (Ficha Clínica). Las transacciones deben ser atómicas para asegurar la consistencia.

### Tareas de la HU02 (Detalle Técnico)

1. **(Backend) Modelo Prisma**: El modelo `ClinicalRecord` en `schema.prisma` guarda los signos vitales (`weight`, `height`, `bloodPressure`, `temperature`), así como el historial (`symptoms`, `diagnosis`, `prescription`).
2. **(Backend) Endpoints de Clínica**: Los archivos `clinicalRoutes.ts` y `clinicalController.ts` gestionan el guardado (POST) y la consulta (GET) de las fichas clínicas asociadas a un `appointmentId`.
3. **(Frontend) Interfaz Historial**: La ruta `/historial/:appointmentId` (en `App.tsx`) renderiza el componente `HistorialClinico.tsx` para revisar las notas anteriores.

---

## HU03: Registro e inicio de sesión del médico (y usuarios)

Yo como usuario (médico) necesito poder registrarme e iniciar sesión en la plataforma para acceder de forma segura a mis consultas.

### Concepto para Implementación Expandido

Sistema robusto de control de acceso. Cada usuario posee un `role` (PATIENT, DOCTOR, ADMIN) definido en Prisma. El frontend implementa rutas protegidas que leen un JWT provisto al hacer login.

### Tareas de la HU03 (Detalle Técnico)

1. **(Backend) Registro y Login**: Implementado en `authRoutes.ts` y `authController.ts`. Usando `bcryptjs` para cifrar contraseñas y `jsonwebtoken` para firmar sesiones.
2. **(Frontend) Rutas Protegidas**: El componente de envoltura `RoleRoute` en `App.tsx` restringe el paso. Si un `PATIENT` intenta ir a `/dashboard-medico`, es expulsado a la página principal.
3. **(Frontend) Contexto Global**: Se utiliza el contexto `AuthContext` en React para propagar la sesión a toda la SPA sin necesidad de prop-drilling.

---

## HU04: Reserva de Teleconsultas

Yo como paciente rural necesito poder agendar una teleconsulta con un médico disponible.

### Concepto para Implementación Expandido

Gestión de la tabla `Appointment`, cruzando las disponibilidades de `User` (role = DOCTOR) con las peticiones de `User` (role = PATIENT).

### Tareas de la HU04 (Detalle Técnico)

1. **(Frontend) Diseño de Reserva**: Implementado en el componente `ReservaCita.tsx` que es servido en la ruta `/reserva`.
2. **(Backend) Modelos Relacionales**: `schema.prisma` crea relaciones nominales como `DoctorAppointments` y `PatientAppointments` para permitir búsquedas bidireccionales eficientes.
3. **(Backend) Endpoint de Citas**: `appointmentRoutes.ts` y `appointmentController.ts` manejan el ciclo de vida de la cita (estado PENDING, CONFIRMED, COMPLETED).
4. *(Pendiente)* Algoritmo avanzado para chequeo estricto de choques horarios (solapamientos).

---

## HU05: Notificaciones de cita

Yo como paciente rural necesito recibir recordatorios automáticos de mi cita, 24 y 1 hora antes.

### Tareas de la HU05 (Detalle Técnico - Pendientes)

*Nota: Esta funcionalidad se encuentra en diseño arquitectónico. Su implementación requerirá:*
1. **[PENDIENTE]** Crear una carpeta `backend/src/jobs` para tareas cron.
2. **[PENDIENTE]** Configurar un transpondedor SMPT (Nodemailer) asociado a una cuenta de correo corporativa.
3. **[PENDIENTE]** Desplegar lógica que filtre en Prisma `Appointment` con estado `CONFIRMED` cuya fecha (`date`) encaje en los rangos establecidos y disparar notificaciones.

---

## HU06: Panel de Administración

Yo como administrador del sistema necesito poder gestionar usuarios, especialidades y citas.

### Tareas de la HU06 (Detalle Técnico)

1. **(Frontend) Dashboard UI**: Existe el componente base `DashboardAdmin.tsx` renderizado en `/admin` accesible solo por cuentas con rol `ADMIN`.
2. **[PENDIENTE]** Endpoints CRUD completos en el backend para moderar y editar cuentas pre-existentes o forzar la cancelación de citas (`status = CANCELLED`).
3. **[PENDIENTE]** Logs de auditoría en la base de datos (Ej. modelo `AuditLog`).

---

## HU07: Videollamada de Alta Disponibilidad

*Nota: Parcialmente resuelta por los avances de HU01, pero como épica dedicada a optimización continua.*

### Tareas de la HU07 (Detalle Técnico)

1. **(Backend) LiveKit Controller**: `backend/src/controllers/livekitController.ts` configurado.
2. **(Frontend) Sandbox**: Se implementó una ruta dedicada `/livekit-test` cargando el componente `LiveKitTest.tsx` para facilitar a los desarrolladores el testeo aislado del SFU sin necesidad de generar una cita en base de datos.
3. **[PENDIENTE]** Mejoras en la renderización UI para conexiones de muy bajo ancho de banda.

---

## HU08: Generación y Reporte de Receta Médica Imprimible

Yo como Paciente necesito poder guardar e imprimir mis recetas y diagnósticos médicos en un formato oficial.

### Tareas de la HU08 (Detalle Técnico - Pendientes)

1. **[PENDIENTE] (Frontend)**: Alterar `HistorialClinico.tsx` para inyectar un `@media print` en `index.css` o usar librerías nativas de PDF en JS.
2. **[PENDIENTE] (Frontend)**: Crear un diseño oficial de receta, ocultando la Sidebar o Navbar de `App.tsx` al presionar Imprimir.
3. **[PENDIENTE] (Backend)**: Funcionalidad de descarga en PDF directo del servidor.

---

## HU09: Sincronización Automática de Identidad en Salas Virtuales

Yo como médico necesito saber exactamente quién es el paciente que está en mi sala antes de iniciar.

### Tareas de la HU09 (Detalle Técnico)

1. **(Backend) Mapeo de Sala**: Se previó la creación de endpoints en `appointmentController.ts` que validen si un usuario que solicita un token de LiveKit (vía `livekitController.ts`) está formalmente asignado al `roomId`.
2. **(Frontend) Restricción Visual**: Modificar `<Videollamada />` para no activar `canPublish` hasta que el endpoint confirme la identidad.
3. **[PENDIENTE]** Renderizar tarjetas con resumen del paciente dentro de la videollamada para conocimiento del doctor.

---

## HU10: Experiencia de Usuario en Dashboards

Yo como paciente (usuario) necesito que los paneles de control respondan rápidamente y me redirijan automáticamente.

### Tareas de la HU10 (Detalle Técnico)

1. **(Frontend) Redireccionamientos Ágiles**: El uso de `useNavigate` de `react-router-dom` dentro de `DashboardMedico.tsx` para transitar hacia `/room/:roomId` tras aceptar.
2. **(Frontend) Componentes Desacoplados**: Carpetas como `frontend/src/dashboards` alojan `DashboardPaciente.tsx` separando lógicamente las vistas, previniendo el re-render masivo del árbol DOM.
3. **[PENDIENTE]** Refactorizar el "skeleton loading" de las tarjetas de estado de espera.

---
---

# Bibliografía Técnica y de Código

Esta sección documenta los archivos exactos del entorno `mediCampo-v2` inspeccionados para conformar este backlog, sirviendo como mapa de navegación para desarrolladores entrantes.

1. **Archivo**: `backend/prisma/schema.prisma`
   - **Descripción**: El núcleo del modelo de datos. Define con claridad las tablas de PostgreSQL necesarias para todas las historias de negocio.
   - **Extracción de Código**: Se evidenciaron los modelos formales `User`, `Specialty`, `Appointment` y `ClinicalRecord`, incluyendo las relaciones `relation("DoctorAppointments")`.

2. **Archivo**: `backend/src/controllers/livekitController.ts`
   - **Descripción**: Controlador que resuelve las historias **HU01** y **HU07**. Su diseño sigue SOLID delegando generación de JWT al SDK de LiveKit.
   - **Extracción de Código**: El método `getAccessToken(req, res)` procesa la sala y usuario, usa `new AccessToken(apiKey, apiSecret)` y le inyecta permisos con `at.addGrant({ roomJoin: true, canPublish: true })`.

3. **Archivo**: `frontend/src/App.tsx`
   - **Descripción**: Enrutador principal de la SPA en React. Resuelve el marco operativo de las **HU03**, **HU04**, y **HU10**.
   - **Extracción de Código**: Se observó el componente `<RoleRoute>` que hace las veces de "Guardián de Rutas" verificando `user.role` (PATIENT, DOCTOR, ADMIN). También se mapeó la estructura de importaciones de componentes clave (`Navbar`, `Login`, `DashboardPaciente`).

4. **Archivos de Backend General**: `backend/src/controllers/*` y `backend/src/routes/*`
   - **Descripción**: Estructura de Controladores REST que apoya la arquitectura modular de las funcionalidades de Autenticación, Citas y Fichas Clínicas.
   - **Extracción de Código**: Existen en el directorio archivos como `appointmentController.ts`, `authController.ts`, y `clinicalController.ts` que demuestran una separación limpia de las responsabilidades solicitadas en el backlog.

5. **Archivos de Frontend General**: `frontend/src/components/*`
   - **Descripción**: Módulo de componentes visuales que encajan con la **HU01**, **HU02** y **HU04**.
   - **Extracción de Código**: Incluye componentes robustos y de gran peso en bytes (`HistorialClinico.tsx`, `ReservaCita.tsx`, `Videollamada.tsx` y `ChatConsulta.tsx`), verificando la existencia de la interfaz implementada.

> Este documento fue redactado asegurando que no se ha modificado el `sprint_Backlog.md` original, sino que funciona como una expansión técnica profunda para apoyar la planificación de Sprints y auditoría de código futura.
