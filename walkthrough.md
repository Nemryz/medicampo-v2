# Walkthrough: mediCampo Full-Stack (Sprint 1)

Hemos migrado exitosamente la maqueta original de `Bolt.new` hacia un repositorio Full-Stack estructurado, finalizando con éxito las Historias de Usuario H0, H1, y H2.

## Cambios Realizados

> [!TIP]
> **Arquitectura Dividida**: Ahora cuentas con una carpeta `frontend/` que corre Vite/React y un `backend/` impulsado por Node.js, Express y Prisma ORM, ambos inicializados independientemente mediante npm.

### Backend (Node.js + Prisma)
Se configuró tu base de datos **PostgreSQL en DigitalOcean** mediante la cadena segura (SSL requerido). 
- **Esquemas creados**: `User`, `Specialty`, `Appointment`. Estas tablas guardarán tu información real.
- **Flujos Auth (`/api/auth`)**: Contraseñas encriptadas con _bcryptjs_ e inicio de sesión seguro usando _jsonwebtoken_.
- **Flujos Citas (`/api/appointments`)**: Endpoints protegidos para bloquear turnos e instanciar consultas médicas.

### Frontend (React + Tailwind)
El Frontend cuenta con un rediseño radical para aportar valor _Premium_ exigido por el mercado de salud digital.

- **Autenticación (Glassmorphism)**: 
  - `Login.tsx`: Intefaz dinámica oscura con _mesh gradient_, reflejos de cristal y retroalimentación interactiva para iniciar sesión.
  - `Register.tsx`: Captura de datos (RUT, Nombre, Email, Password) y auto-login transicional.
- **Auth Context**: Un vigilante silencioso en React que verifica la persistencia del Token JWT en localStorage. Si expira o sales de la aplicación, te cerrará sesión automáticamente.
- **Reserva de Teleconsulta (H2)**:
  - `ReservaCita.tsx`: Nueva vista en la barra de navegación que permite listar especialidades, abrir un calendario reactivo del día y separar bloques horarios, con una vista de "Cita Confirmada" automatizada al finalizar.

### El Motor de la Videollamada (H3)
Acabamos de evolucionar la pantalla estática de video original de Bolt.new hacia una experiencia WebRTC completa de punta a punta:

1. **Backend Socket.io**: Tu archivo `server.ts` dejó de ser un simple servidor y ahora es un centro neurálgico de red que escucha conexiones de websockets en tiempo real. Actúa de intermediario para notificar quién se conectó.
2. **WebRTC P2P**: El nuevo componente `Videollamada.tsx` extrae permisos nativos de _Cámara y Micrófono_. Gracias a `PeerJS`, encripta el video y lo envía por un túnel P2P directamente al médico.
3. **UI Dinámica**: Integramos un estado de "Esperando Usuario" en bucle mientras la otra persona se conecta y un reloj medidor local.

## Verificación de Resultados

Puedes arrancar simultáneamente el frontend y backend para atestiguar los cambios:

1. **Terminal 1 (Backend)**: 
   ```bash
   cd backend
   npx prisma db push
   npm install ts-node-dev -D
   npx ts-node-dev src/server.ts
   ```
2. **Terminal 2 (Frontend)**:
   ```bash
   cd frontend
   npm run dev
   ```

Abre `http://localhost:5173`. Tu aplicación ya no te dejará entrar libremente; ¡pondrá a prueba el inicio de sesión que acabamos de construir!

> [!NOTE]
> Lo siguiente será entrar a H3 (Videollamada en sí misma) usando la base segura de citas que gestionamos recién.
