# Tareas de Ejecución: Sprint 1 (Migración y Autenticación)

## H0: Preparación Técnica (Entorno Limpio)
- [x] Migrar estructura básica del frontend de Bolt.new hacia `mediCampo-v2/frontend`.
- [x] Inicializar y configurar Git (nuevo repositorio, desvinculado de Bolt.new).
- [x] Inicializar Node.js en `mediCampo-v2/backend` (`npm init -y`).
- [x] Configurar TypeScript, Express.js y entorno base.
- [x] Instalar Prisma ORM y dependencias base (`bcryptjs`, `jsonwebtoken`, `dotenv`).

## H1: Registro e inicio de sesión del Paciente
- [x] Configurar esquema Prisma para la entidad `User`.
- [x] Autenticación de registro (`POST /api/auth/register`).
- [x] Autenticación de inicio de sesión (`POST /api/auth/login`).
- [x] Frontend: Crear UI iterativa interactiva conectada al backend.
- [x] Frontend: Guardar Token y verificar sesiones.

## H2: Reserva de Teleconsulta
- [x] Configurar esquema Prisma para `Appointment` y Especialidades.
- [x] Desarrollar lógica de citas.
- [x] Frontend: Integración visual del calendario de horas disponibles.

## H3: Videollamada (Telemedicina)
- [x] Backend: Integrar y configurar Socket.io o PeerJS server para WebRTC.
- [x] Frontend: Componente de videollamada con control de dispositivos de hardware.a de citas.
- [x] Frontend: Integración visual del calendario de horas disponibles.
