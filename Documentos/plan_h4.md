# Propuesta de Arquitectura y Mejoras: H4 (Historial Clínico)

Este documento detalla los pasos técnicos y las expansiones de valor propuestos para llevar a cabo la Historia de Usuario 4 (H4), la cual le da el peso científico y administrativo a la plataforma.

## 📝 Objetivo de H4 Original
Construir el modelo de Base de Datos para guardar diagnósticos, y crear el panel lateral para que el médico anote información de salud mientras transcurre la videollamada, cambiando el estado de la cita.

---

## ⚡ Mejoras Propuestas (Potencialización del Módulo)
Para que esto no sea un simple "Block de notas", propongo incorporar las siguientes características de alto nivel que transformarán mediCampo en una plataforma clínica competitiva:

> [!TIP]
> **1. Generación Automática de Recetas Web (Digital Prescriptions)**
> En vez de solo escribir texto plano, separaremos la Ficha en `Diagnóstico` y `Prescripción`. Al terminar la llamada, el sistema enviará por correo (H5) o liberará automáticamente en el perfil del paciente una Receta Digital profesional con la firma del médico.

> [!TIP]
> **2. Reactividad en Tiempo Real (Socket.io Bridge)**
> Ya que tenemos los canales P2P abiertos, agregaremos un estado en la pantalla del Paciente que diga *"El Doctor está escribiendo tu receta..."* en tiempo real, brindando tranquilidad durante la consulta.

> [!TIP]
> **3. Histórico Consolidado**
> Cuando un médico abra el panel para atender a un paciente, no solo verá un cuadro en blanco. Verá una línea de tiempo horizontal con el historial de **citas anteriores** de ese usuario (incluso si se trató con otro doctor), permitiendo una visión holística de salud.

---

## User Review Required
Por favor revisa la estructura de base de datos que planeo inyectar en DigitalOcean y dame tu "Ok" o cuéntame si quieres añadir algo más (ej. formato de alergias, peso, edad).

### [Prisma ORM - Nuevos Modelos]

#### [MODIFICAR] `schema.prisma`
```prisma
// Nuevo modelo que estará enganchado a cada Appointment (1:1)
model ClinicalRecord {
  id            Int         @id @default(autoincrement())
  appointmentId Int         @unique
  appointment   Appointment @relation(fields: [appointmentId], references: [id])
  
  symptoms      String      // Lo que dice el paciente
  diagnosis     String      // Lo que concluye el médico
  prescription  String?     // Medicamentos detallados
  observations  String?     // Notas privadas
  
  createdAt     DateTime    @default(now())
}
```

### [Backend - Node.js]
#### [NUEVO] `src/controllers/clinicalController.ts`
Desarrollo de los endpoints que guardarán la información de forma encriptada, asegurandose de que **sólo** el doctor asignado a esa sala pueda escribir la ficha del paciente.

### [Frontend - React]
#### [MODIFICAR] `Videollamada.tsx`
Convertiré el cuadrado actual (estático) de "Detalles Médicos" en un formulario interactivo. Si el rol es DOCTOR, arrojará inputs de texto. Si el rol es PACIENTE, arrojará el historial consolidado de lecturas anteriores.

#### [MODIFICAR] `HistorialClinico.tsx`
Esta pantalla gigante mostrará las tarjetas de todas las atenciones médicas del pasado con opción a descargar las recetas generadas.

## Open Questions

1. ¿Te parece bien el modelo de base de datos propuesto y separar la Prescripción del Diagnóstico?
2. ¿Deseas que incluya algún campo de constantes vitales obligatorias previo a la receta (Ej: Peso, Presión, Edad)?
3. **¿Apruebas este plan para comenzar a programarlo?**
