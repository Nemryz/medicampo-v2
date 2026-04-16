# mediCampo - Plataforma de Telemedicina 🏥

mediCampo es una aplicación avanzada *Full-Stack* (WebRTC, Node.js, React) diseñada para gestionar clínicas médicas, agendas de pacientes y proporcionar salas de teleconsulta seguras y encriptadas punto a punto.

Este proyecto ha finalizado su **Primer Ciclo de Desarrollo (Sprint 1)**, implementando una arquitectura profesional basándose en infraestructura de DigitalOcean.

## 🚀 Avances Actuales (Primer Ciclo)

La aplicación ya ha abandonado el estado de maqueta y ahora consta de implementaciones reales asíncronas y conectividad de bases de datos:

- ✅ **H0 - Arquitectura Base:** 
  - Migración exitosa de esquemas desde `bolt.new` a un entorno local robusto con cliente (`Vite/React`) y servidor (`Node.js/Express`).
  - Implementación de **Prisma ORM** para las consultas rápidas a Base de Datos.
- ✅ **H1 - Autenticación Segura (JWT):** 
  - Interfaces de **glassmorphism premium** (`Login` y `Register`).
  - Creación de encriptado de contraseñas usando `bcryptjs` e intercambio de tokens por `localStorage`. Control de acceso estricto en el backend con Middlewares.
- ✅ **H2 - Reserva de Teleconsulta:** 
  - Creación de Rutas con React (`react-router-dom`) y modelos estructurales para *Pacientes*, *Médicos*, *Especialidades* y *Citas* alojados directamente en un Cluster asíncrono gestionado de **PostgreSQL en DigitalOcean**.
- ✅ **H3 - Motor de Videollamada (WebRTC):** 
  - Transformación del `server.ts` a un receptor de **Socket.io**.
  - Puesta en marcha de la sala de videollamadas con acceso verificado usando **PeerJS** para inyectar un flujo local Peer-to-Peer (`P2P`), solicitando componentes de hardware (`navigator.mediaDevices`).
  - Sala de espera lógica integrada para el rol *Paciente*.

## 🛠️ Tecnologías Empleadas

### Backend (API)
- **Node.js + Express:** Lógica enrutadora.
- **Prisma ORM:** Manejo de datos y sincronización ágil.
- **PostgreSQL:** Base de datos relacional (alojada en DigitalOcean).
- **Socket.io:** WebSockets para el "Signal Server" de la llamada.
- **Bcrypt & JWT:** Criptografía de datos seguros.

### Frontend (User Interface)
- **React + TypeScript (Vite):** Aplicación de una sola página ultra rápida.
- **Tailwind CSS:** Diseño UI con sombreadores avanzados e iterativos.
- **Lucide-React:** Set de iconografías.
- **PeerJS:** Encapsulador para la API WebRTC nativa Web.

---

## 🏃 Instrucciones para Ejecución Local

Para correr este proyecto en modo desarrollo con las vistas de React y su propio servidor Node, se requieren dos terminales separadas ubicadas dentro de la raíz de la carpeta base del proyecto:

### 1. Iniciar Servidor (Node / Prisma)
Usa los scripts especiales alojados en el `package.json` para encender el servidor y sincronizar tablas.
```bash
cd backend
npm install
npm run db:push
npm run dev
```

### 2. Iniciar Frontend (Vite)
Abre otra terminal:
```bash
cd frontend
npm install
npm run dev
```
Entra a `http://localhost:5173`. Tu aplicación requerirá ingresar cuenta para probar los flujos seguros de citas y WebRTC.
