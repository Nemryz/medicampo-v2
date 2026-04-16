# Plan: Refinamiento de Flujo y Visibilidad de Citas

## Problema
- **Médico**: Al aceptar una cita futura, esta desaparece del panel (no es hoy ni está pendiente). Al aceptar una de hoy, no es redirigido a la videollamada.
- **Paciente**: Falta claridad informativa sobre cuándo es su cita mientras espera la aprobación.

## Cambios Propuestos

### 1. Dashboard Médico: Gestión y Visibilidad
- **[MODIFICAR] `DashboardMedico.tsx`**:
    - **Nueva Sección**: "Próximas Citas Confirmadas" para mostrar las citas que ya fueron aceptadas pero son para días futuros.
    - **Redirección Directa**: En `handleStatusUpdate`, si la cita que se acaba de aceptar es para **hoy**, el sistema preguntará o redirigirá automáticamente al médico a la sala de video.
    - **Mejora de Filtros**: Ajustar la lógica para que ninguna cita aceptada quede "en el limbo".

### 2. Dashboard Paciente: Claridad en la Espera
- **[MODIFICAR] `DashboardPaciente.tsx`**:
    - **Diseño de Tarjeta**: Mejorar la visualización de las citas `PENDING` para que resalte la fecha y hora de forma prominente, funcionando como una "Ficha de Espera".

### 3. Lógica de Redirección
- **[MODIFICAR] `DashboardMedico.tsx`**: Implementar un pequeño delay o confirmación visual tras aceptar para que el médico sepa que la cita pasó a su agenda de hoy o futura, y ofrecer el botón de "Entrar" de forma inmediata.

## Verificación Plan
- **Prueba 1**: Aceptar una cita de mañana. Verificar que aparezca en la nueva sección de "Próximas Citas".
- **Prueba 2**: Aceptar una cita de hoy. Verificar que el médico sea llevado (o invitado a ir) a la sala de inmediato.

---
**¿Deseas que implemente este refinamiento para que el flujo sea más intuitivo para el médico?**
