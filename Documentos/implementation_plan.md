# Migración mediCampo a Full-Stack y Desarrollo de Nuevas Historias

Actualmente las maquetas de `mediCampo` (el frontend original descargado de bolt.new) se encuentran hechas bajo un entorno `Vite` con `React`, `TypeScript` y visualización básica (sin conectar a modelo de negocio en backend). Nuestro objetivo es movernos al entorno `mediCampo-v2` creando una arquitectura Full-Stack formal usando Node.js, y preparando todas las funcionalidades dictaminadas en el Product Backlog.

## User Review Required

> [!NOTE]
> **Alojamiento en la Nube y Base de Datos (GitHub Student Developer Pack):** Dado que Supabase, Render y Vercel no serán utilizados, aprovecharemos los beneficios del GitHub Student Pack. Utilizaremos **DigitalOcean** (el cual otorga $200 de crédito) o **Microsoft Azure for Students** (otorga $100 de crédito) para alojar todo de forma gratuita para este proyecto universitario. Desplegaremos una base de datos **PostgreSQL** administrada, alojaremos el servidor de Node.js (Backend) mediante un servicio de contenedores o App Platform, y presentaremos el Frontend ahí mismo. El backend manejará la autenticación sin dependencias de terceros usando JWT y Prisma ORM.

> [!IMPORTANT]
> **Videollamada en Crudo (WebRTC/Socket.io) vs Servicio (Twilio/Daily):** Considerando el acceso a herramientas usando GitHub Student Developer Pack, podemos usar servidores gratuitos u opciones robustas. La forma más didáctica para el proyecto es inicializar un servidor `Socket.io` y `PeerJS` localmente para comunicación en las videollamadas. ¿Estás de acuerdo con este enfoque?

## Proposed Changes

### Orden de Ejecución de Historias
Dado que H3 y H4 ya tienen maquetas funcionales hechas por Bolt.new de antemano, el orden de ataque priorizará solidificar la infraestructura:
1. **H0**: Crear repositorio Git nuevo y limpio de forma local (desvinculando Bolt.new) y migrar código a un entorno full-stack.
2. **H1**: Desarrollar lógica principal de Autenticación y flujos de pacientes.
3. **H2**: Lógica de base de datos para agendamiento.
4. **H3/H4**: Reestructurar maquetas visuales hacia un consumo dinámico con el backend propio.

A continuación el desglose técnico de los requerimientos y artefactos para arrancar con el Backlog.
### Configuración del Entorno (H0)
- Inicializar `backend` con Node.js, Express y TypeScript.
- Inicializar y mover los archivos viejos (`/src` y configuraciones) a la carpeta `frontend/`.
- Habilitar Concurrencia y Scripts base.
#### [NEW] backend/package.json
#### [NEW] backend/src/server.ts
#### [NEW] backend/tsconfig.json

### Backend - Acceso y Autenticación (H1, H6)
- Creación de Controladores y Modelos de Usuarios y Roles de Autenticación.
- Uso de `bcryptjs` y `jsonwebtoken`.
- Rutas protegidas para el Administrador.
#### [NEW] backend/src/models/User.ts
#### [NEW] backend/src/controllers/authController.ts
#### [NEW] backend/src/routes/authRoutes.ts

### Gestión de Atención Médica y Videollamada (H2, H3, H4)
- Manejador de Socket.io y WebRTC para las salas.
- Modelos de base de datos para la `Cita(Appointment)` y el `HistorialClinico(MedicalHistory)`.
- En el frontend, implementar las vistas ya existentes (como `Videollamada.tsx` original) para usar variables reales provenientes del servidor.
#### [NEW] backend/src/models/Appointment.ts
#### [NEW] backend/src/models/MedicalHistory.ts
#### [NEW] backend/src/controllers/appointmentController.ts
#### [MODIFY] frontend/src/components/Videollamada.tsx

## Decisiones de Arquitectura Tomadas

1. **GitHub Student Developer Pack:** Se optará por un despliegue en **DigitalOcean** (App Platform + Managed PostgreSQL) o **Azure App Service**, lo cual será suficiente y sobrado para sostener un entorno de 1 o 2 dispositivos conectados simultáneamente como requiere el marco de la universidad sin usar Render/Vercel/Supabase.
2. **Prisma ORM:** Integraremos Prisma para comunicarnos eficientemente desde Node.js con nuestra base de datos PostgreSQL hospedada en la nube.

## Verification Plan

### Automated Tests
- Arrancaremos el servidor frontend y backend usando una terminal paralela.
- Crearemos `console.logs` y pequeños scripts automáticos para asegurar la creación del usuario (H1).

### Manual Verification
- Visualizaremos el Layout desde un entorno local probando la creación de credenciales.
- Se realizarán pruebas abriendo 2 navegadores simulando un "Médico" y un "Paciente" y efectuando el flujo exacto dictado en la H3.
