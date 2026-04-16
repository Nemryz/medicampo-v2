# Plan Sprint 2: Funcionalidades a Completar y Mejorar

## Estado Actual (Lo que tenemos)
- ✅ Autenticación (Login/Registro) con JWT
- ✅ Tres dashboards distintos (Paciente, Médico, Admin)
- ✅ Reserva de citas conectada a PostgreSQL en DigitalOcean  
- ✅ Motor WebRTC (PeerJS + Socket.io) funcional
- ✅ Modelo `ClinicalRecord` con constantes vitales en la BD

---

## Bugs y Mejoras Críticas (Prioritarias) 🔴

### 1. Flujo de Videollamada — Conexión Bidireccional (Paciente ↔ Médico)
**Problema actual:** Ambos tienen botones de "Entrar" pero no se conectan a la *misma* sala porque usan rutas distintas y no leen el `meetingLink` de la cita en la BD.

**Lo que hay que hacer:**
- El Dashboard del Paciente debe mostrar un botón **"Entrar a Consulta"** en la cita `CONFIRMED` que lea el `meetingLink` real desde la BD (ej. `/room/abc1234`)
- El Dashboard del Médico debe mostrar el mismo link para que ambos ingresen a la misma URL
- El componente `Videollamada.tsx` ya lee el `:roomId` de la URL — solo falta que ambos usen el mismo link

### 2. Panel de Diagnóstico del Médico (En la Videollamada)
**Problema actual:** El panel derecho en la videollamada muestra datos estáticos mock — no tiene formulario real.

**Lo que hay que hacer:**
- Si el usuario es `DOCTOR`: panel lateral con formulario (constantes vitales + síntomas + diagnóstico + receta)
- Si el usuario es `PATIENT`: panel lateral muestra solo "Sala de Espera" y nombre del médico
- Al hacer clic en **"Guardar Ficha"**, llama al endpoint `POST /api/clinical/:appointmentId`
- Al finalizar la llamada, pregunta si desea guardar la ficha antes de salir

### 3. Lista de Doctores Reales en Paciente
**Problema actual:** Al reservar, aparecen los doctores reales de la BD si `role: 'DOCTOR'` — pero si la BD no tiene doctores cargados, sale una lista vacía.

**Esto ya debería funcionar** con el seed creado (2 doctores: Dr. Carlos y Dra. Ana). Verificar que la sesión del paciente (`paciente@medicampo.cl`) carga los doctores correctamente.

---

## Funcionalidades Nuevas Sugeridas (Por Rol) 🟡

### Paciente
| # | Funcionalidad | Valor |
|---|---|---|
| A | **Ver ficha clínica de consultas pasadas** — al hacer clic en una cita completada, ver el diagnóstico y receta | ★★★ Alto |
| B | **Cancelar una cita** pendiente desde el dashboard | ★★★ Alto |
| C | **Perfil personal** — cambiar nombre, e-mail, contraseña | ★★ Medio |
| D | **Buscar doctores por especialidad** en el formulario de reserva | ★★ Medio |
| E | **Notificación sonora/visual** cuando el médico se conecta a la sala | ★★ Medio |

### Médico
| # | Funcionalidad | Valor |
|---|---|---|
| F | **Agenda completa** — no solo citas de hoy, sino visión semanal con calendario | ★★★ Alto |
| G | **Historial del Paciente** — al ver un paciente, ver sus consultas previas (incluso con otros médicos) | ★★★ Alto |
| H | **Gestión de Disponibilidad** — bloquear horarios, definir días de atención | ★★ Medio |
| I | **Editar ficha clínica guardada** si cometió un error | ★★ Medio |
| J | **Vista previa de Receta** en formato limpio (descargable como PDF) | ★ Bajo |

### Administrador
| # | Funcionalidad | Valor |
|---|---|---|
| K | **Listado de todos los usuarios** — filtrable por rol, con búsqueda | ★★★ Alto |
| L | **Crear cuenta de Médico** desde el panel Admin (sin que el médico se registre solo) | ★★★ Alto |
| M | **Activar/Desactivar cuentas** — suspender un médico sin eliminarlo | ★★ Medio |
| N | **Asignar especialidades** a un médico desde el panel | ★★ Medio |
| O | **Log de llamadas activas** — ver qué salas de Socket.io están abiertas ahora | ★ Bajo |

---

## Priorización Sugerida para el Sprint 2

```
Semana 1: Bugs Críticos (1, 2, 3 de arriba)
Semana 2: A + B + F + G + K + L  (alto impacto para demo universitaria)
Semana 3: C + H + J (pulido visual)
```

> [!IMPORTANT]
> **Para entregar el proyecto con valor clínico real**, los puntos 1, 2, A, F y L son los que harán que tu evaluador entienda el sistema en segundos. Los demás son detalles que sumarán nota pero no son bloqueantes.

## ¿Por cuál quieres que empecemos?
Puedes responder con:
- `"todos"` — ejecutar todo en orden de prioridad
- `"1 y 2"` — solo los bugs del flujo de video y diagnóstico
- `"A, K, L"` — funcionalidades específicas
