# Plan de Emergencia: Estabilidad de Producción y Conectividad

## Problema Detectado
El error 404 y la pantalla en blanco ocurren porque los sitios estáticos (como el de DigitalOcean) no saben cómo manejar las rutas de React como `/room/xxx` al recargar la página. Además, esto puede estar bloqueando la entrada del médico a la sala.

## Cambios Propuestos

### 1. Cambio a HashRouter (Solución para el 404)
- **[MODIFICAR] `main.tsx`**: Cambiar `BrowserRouter` por `HashRouter`. 
    - Esto cambiará los links a un formato `dominio.com/#/room/xxx`.
    - **Ventaja**: Garantiza que nunca más veas un error 404 al recargar el navegador, ya que el servidor siempre cargará la página principal primero.

### 2. Sincronización de Enlaces
- **[MODIFICAR] `Videollamada.tsx`**: Asegurar que la redirección tras finalizar la cita use el nuevo formato de rutas.
- **[MODIFICAR] `DashboardMedico.tsx` y `DashboardPaciente.tsx`**: Validar que los botones de "Entrar" funcionen correctamente con el sistema de hashes.

### 3. Mejora de Conectividad (WebRTC)
- **[MODIFICAR] `Videollamada.tsx`**: Añadir una configuración más explícita para PeerJS para evitar fallos de conexión entre distintos dispositivos y asegurar que el "signaling" sea robusto.

## Verificación

1. **Prueba de Recarga**: Entrar a una sala y darle a F5. Ya no debe aparecer 404.
2. **Prueba de Conexión**: Validar que al pulsar "Iniciar Consulta", el médico entre directamente a la misma sala donde espera el paciente.

---
**¿Aprobado para proceder con este arreglo de emergencia y dejar el sistema funcionando al 100%?**
