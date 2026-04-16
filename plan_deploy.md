# Plan de Despliegue a Producción: mediCampo en la Nube

## Objetivo
Hacer que mediCampo sea accessible desde cualquier dispositivo y red, 24/7, sin necesidad de que tu computador esté encendido.

---

## ¿Qué tenemos disponible del GitHub Student Developer Pack?

| Beneficio | Crédito | Estado |
|---|---|---|
| **DigitalOcean** | $200 (ya activados) | ✅ Disponible |
| **Heroku** | ~$13/mes (12 meses) | 🆕 Reclamar si aplica |
| **Azure** | $100 en créditos | 🆕 Por reclamar |
| **MongoDB Atlas** | $50 en créditos | No necesario (usamos PostgreSQL) |

> [!IMPORTANT]
> **La mejor opción para nosotros es DigitalOcean**, ya que:
> 1. Ya tienes $200 activados y la base de datos PostgreSQL corriendo ahí
> 2. Su App Platform soporta WebSockets nativamente (crítico para nuestro Socket.io de videollamadas)
> 3. El costo estimado mensual del proyecto completo es ~$10-15/mes → con tus créditos tienes 12-15 meses gratis

---

## Arquitectura de Producción

```
[Internet]
    │
    ├── Frontend → DigitalOcean Static Site (Gratis con DO)
    │       URL: https://medicampo-frontend.ondigitalocean.app
    │
    ├── Backend → DigitalOcean App Platform (Node.js + Socket.io)
    │       URL: https://medicampo-api.ondigitalocean.app
    │       WebSockets: wss://medicampo-api.ondigitalocean.app
    │
    └── Database → DigitalOcean Managed PostgreSQL (ya activo)
            Host: db-postgresql-sfo2-46171...
```

---

## Cambios de Código ANTES de Desplegar

### 1. Backend — Variables de entorno de producción
El backend no puede tener URLs hardcodeadas. Necesitamos usar variables de entorno para la URL del frontend (CORS).

#### [MODIFICAR] `backend/src/server.ts`
```typescript
// CORS debe aceptar solo tu dominio real en producción
const io = new Server(httpServer, {
  cors: { 
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
```

#### [NUEVO] `backend/.env.example` (para documentar las variables)
```
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=...
FRONTEND_URL=https://medicampo-frontend.ondigitalocean.app
```

### 2. Frontend — URLs del API deben ser dinámicas
Actualmente el frontend tiene `http://localhost:5000` hardcodeado en múltiples archivos. Hay que centralizarlo.

#### [NUEVO] `frontend/.env` (desarrollo local)
```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

#### [NUEVO] `frontend/.env.production`
```
VITE_API_URL=https://medicampo-api.ondigitalocean.app
VITE_SOCKET_URL=wss://medicampo-api.ondigitalocean.app
```

#### [MODIFICAR] `frontend/src/lib/api.ts` (nuevo archivo central)
```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
```

### 3. Backend — Script de inicio para producción
DigitalOcean necesita un comando `start` que use JavaScript compilado (no ts-node-dev).

#### [MODIFICAR] `backend/package.json`
```json
"scripts": {
  "start": "node dist/src/server.js",
  "build": "tsc",
  "dev": "ts-node-dev src/server.ts"
}
```

---

## Pasos de Despliegue Paso a Paso

### Fase 1: Preparar el Código (local)
1. Crear los archivos `.env` y `.env.production` del frontend
2. Crear `frontend/src/lib/api.ts` y reemplazar todas las URLs hardcodeadas
3. Añadir el script `build` y `start` al `package.json` del backend
4. Hacer commit y push a GitHub

### Fase 2: Desplegar el Backend en DigitalOcean App Platform
1. Ir a [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
2. Clic en **"Create App"**
3. Conectar con tu repositorio de GitHub → seleccionar `medicampo-v2`
4. Configurar el componente:
   - **Source directory:** `backend/`
   - **Run command:** `npm start`
   - **Build command:** `npm run build`
5. Agregar variables de entorno:
   - `DATABASE_URL` → (la cadena de DigitalOcean ya existente)
   - `JWT_SECRET` → (tu clave secreta)
   - `FRONTEND_URL` → (se llenará después de crear el frontend)
6. Clic en **Deploy**

### Fase 3: Desplegar el Frontend
1. En el mismo App de DigitalOcean, agregar un **Static Site**
2. **Source directory:** `frontend/`
3. **Build command:** `npm run build`
4. **Output directory:** `dist`
5. Agregar variable de entorno:
   - `VITE_API_URL` → URL del backend desplegado
   - `VITE_SOCKET_URL` → URL del backend con `wss://`
6. Clic en **Deploy**

### Fase 4: Actualizar CORS del Backend
Una vez que tengas la URL del frontend, actualizar `FRONTEND_URL` en las variables del backend y volver a desplegar.

---

## Costo Estimado Mensual
| Servicio | Plan | Costo/mes |
|---|---|---|
| Backend (App Platform) | Basic (512MB) | $5 |
| Frontend (Static Site) | Static | $0 (Gratis) |
| PostgreSQL | Basic 1GB | $15 → ya tienes |
| **Total** | | **~$5/mes nuevo** |

Con tus $200 de créditos tendrías el backend gratuito por **~40 meses**. La BD PostgreSQL consume los $15/mes de los mismos créditos.

---

## ¿Apruebas este plan para comenzar?

Antes de hacer cualquier despliegue, debo hacer los cambios de código:
1. Centralizar las URL del API con variables de entorno Vite
2. Añadir el script `build` y `start` al backend
3. Hacer el commit final y push a GitHub

¿Quieres que proceda con esos cambios de código primero?
