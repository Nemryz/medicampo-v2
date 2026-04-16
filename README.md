# mediCampo - Plataforma de Telemedicina 🏥

mediCampo es una aplicación avanzada *Full-Stack* (WebRTC, Node.js, React) diseñada para gestionar clínicas médicas, agendas de pacientes y proporcionar salas de teleconsulta seguras y encriptadas punto a punto.

Este proyecto ha escalado desde un prototipo local a una **Arquitectura de Producción Distribuidora** completamente desplegada en la nube.

## 🚀 Hitos de Desarrollo Recientes (Sprint 2 - Producción)

La aplicación ha finalizado su transición a un entorno profesional en **DigitalOcean App Platform**, integrando flujos de negocio médicos reales:

- ✅ **H4 - Ficha Clínica Digital y Diagnóstico:** 
  - Sistema de registro médico en tiempo real. Los doctores pueden emitir **Recetas Médicas** y diagnósticos durante la videollamada.
  - Almacenamiento persistente de signos vitales (Presión, Peso, Temperatura) asociados a cada atención.
- ✅ **H5 - Flujo de Aprobación de Citas:** 
  - Motor de estados para las reservas (`PENDING` -> `CONFIRMED`).
  - Panel de gestión para médicos que permite aceptar o rechazar solicitudes de pacientes antes de habilitar la sala de video.
- ✅ **H6 - Despliegue en Producción (Cloud):** 
  - **Backend:** Node.js desplegado como servicio escalable en DigitalOcean.
  - **Frontend:** React (Vite) desplegado como sitio estático de alto rendimiento.
  - **Base de Datos:** PostgreSQL Gestionado con backups y seguridad nativa.
- ✅ **Estabilidad WebRTC Pro:** 
  - Integración de servidores **STUN de Google** para asegurar que la videollamada funcione entre diferentes dispositivos y redes (NAT Traversal).

## 🛠️ Stack Tecnológico Pro

### Backend (API & Real-time)
- **Node.js & Express:** Servidor robusto con middlewares de seguridad.
- **Prisma ORM:** Modelado de datos relacional impecable.
- **PostgreSQL (DigitalOcean):** Persistencia de datos gestionada.
- **Socket.io:** Señalización WebRTC asíncrona y segura.
- **JWT & Bcrypt:** Autenticación de nivel bancario.

### Frontend (Modern UI)
- **React 18 + TypeScript:** Tipado estricto para evitar errores en tiempo de ejecución.
- **Tailwind CSS:** Interfaces "Premium Glassmorphism" altamente responsivas.
- **Lucide-React:** Set de iconos profesionales.
- **PeerJS:** Gestión inteligente de flujos P2P para video y audio.

---

## 💻 Desarrollo Local

Si deseas correr mediCampo en tu entorno local:

### 1. Requisitos
- Node.js (v16+)
- Instancia de PostgreSQL (o usar la de producción configurando el `.env`)

### 2. Configuración
Crea un archivo `.env` en la carpeta `backend/` basado en `.env.example`:
```env
DATABASE_URL="tu_url_de_postgres"
JWT_SECRET="tu_clave_secreta"
PORT=5000
```

### 3. Ejecución
En terminales separadas:

**Backend:**
```bash
cd backend
npm install
npx prisma generate
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Abra `http://localhost:5173` para empezar.

## 📄 Licencia
Este proyecto es una implementación profesional para la gestión de salud digital.
