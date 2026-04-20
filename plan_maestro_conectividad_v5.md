# Plan Maestro: Conectividad en Tiempo Real (V5)

## Objetivo
Eliminar la latencia en el encendido de cámara/micro y asegurar que la conexión entre médico y paciente sea instantánea y robusta, eliminando la dependencia de servidores gratuitos externos que son lentos.

## Cambios Propuestos

### 1. Servidor de Señalización Propio (Backend)
- **[MODIFICAR] `backend/package.json`**: Instalar `peer`.
- **[MODIFICAR] `backend/src/server.ts`**: Integrar un servidor PeerJS propio dentro de nuestra API.
    - **Ventaja**: El "saludo" entre médico y paciente ocurrirá en NUESTRO servidor en DigitalOcean, no en una nube compartida gratuita. La velocidad aumentará drásticamente.

### 2. Infraestructura TURN (Garantía de Conexión)
- **[MODIFICAR] `frontend/src/components/Videollamada.tsx`**: Configurar servidores **TURN** (OpenRelay Project).
    - **Explicación**: El 30% de las veces, el video falla o es lento por firewalls. Los servidores TURN actúan como "puentes" de alta velocidad cuando la conexión directa P2P está bloqueada. Es el estándar de oro en telemedicina.

### 3. Optimización de Hardware (Frontend)
- **[MODIFICAR] `frontend/src/components/Videollamada.tsx`**: 
    - **Pre-warming**: Iniciar la captura de cámara milisegundos antes del handshake de red.
    - **Constraints Óptimas**: Configurar una resolución equilibrada (720p) para que el video cargue rápido incluso en conexiones 4G/móviles.

### 4. Limpieza y Push Final
- Se guardarán todos los avances de la V4 (redirecciones, dashboard corregido) y se subirá todo este "Master Plan" a GitHub y DigitalOcean.

## Verificación Plan
- **Prueba de Stress**: Conectar un móvil con 4G y un PC. La cámara debe encenderse en < 2 segundos.
- **Prueba de Estabilidad**: Recargar la página durante la llamada. La reconexión debe ser automática y veloz.

---
**¿Aprobado este Plan Maestro para llevar la conectividad de MediCampo al siguiente nivel profesional?**
