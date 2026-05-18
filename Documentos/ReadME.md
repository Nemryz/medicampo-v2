# Documentos — mediCampo v2

Este directorio centraliza toda la documentación del proyecto mediCampo v2. Los archivos están organizados en tres subcarpetas según su propósito.

---

## Estructura

### informacion_del_proyecto/

Documentos de análisis, planificación y seguimiento del proyecto. Son la base de referencia para entender qué se construyó, por qué y en qué estado se encuentra cada funcionalidad.

- [historias_de_usuario.md](informacion_del_proyecto/historias_de_usuario.md) — Todas las historias de usuario (HU00–HU15) organizadas por épica, con tareas, criterios de aceptación y estado.
- [sprint_backlog.md](informacion_del_proyecto/sprint_backlog.md) — Registro de tareas por sprint con referencia a la historia de usuario correspondiente.
- [diagnosticos.md](informacion_del_proyecto/diagnosticos.md) — Casos de prueba ejecutados: éxitos, fallas corregidas y casos de mejora identificados.
- [analisis_de_roles.md](informacion_del_proyecto/analisis_de_roles.md) — Capacidades, restricciones y control de acceso de los roles PATIENT, DOCTOR y ADMIN.
- [mapas_de_empatia.md](informacion_del_proyecto/mapas_de_empatia.md) — Mapas de empatía de los tres tipos de usuario del sistema.
- [procedimientos_hechos.md](informacion_del_proyecto/procedimientos_hechos.md) — Descripción detallada de cada procedimiento implementado en el código, desde el arranque del servidor hasta el historial clínico.

---

### implementacion/

Guías y documentos técnicos orientados al despliegue y la configuración del sistema en servidores.

- [guia_despliegue_videollamada.md](implementacion/guia_despliegue_videollamada.md) — Guía paso a paso para desplegar el servidor LiveKit en DigitalOcean.
- [procedimiento_despliegue_videollamada.md](implementacion/procedimiento_despliegue_videollamada.md) — Procedimiento detallado de despliegue de la videollamada con configuración de Caddy, Docker y DuckDNS.
- [refactorizacion_solid.md](implementacion/refactorizacion_solid.md) — Documentación de la refactorización de la arquitectura del backend hacia el modelo SOLID.

---

### versiones_anteriores/

Versiones anteriores de documentos que fueron reemplazadas por los archivos en informacion_del_proyecto/. Se conservan como referencia histórica.

- [sprint_Backlog.md](versiones_anteriores/sprint_Backlog.md)
- [sprint_Backlog_v2.md](versiones_anteriores/sprint_Backlog_v2.md)
- [mapas_empatia.md](versiones_anteriores/mapas_empatia.md)
- [historia_HU01_videollamada_segura.md](versiones_anteriores/historia_HU01_videollamada_segura.md)
- [analisis_descriptivo_historias_usuario.md](versiones_anteriores/analisis_descriptivo_historias_usuario.md)
