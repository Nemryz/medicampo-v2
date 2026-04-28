# Mapas de Empatía  

## 1. Paciente (Rural)

### ¿Qué piensa y siente?
- Siente un enorme alivio al saber que no tiene que viajar largas horas desde su zona rural hasta el centro médico para una consulta de rutina.
- Piensa que la tecnología puede ser intimidante; teme apretar el botón equivocado y perder su cita o sus antecedentes.
- Siente tranquilidad cuando percibe que la videollamada es estable a pesar de que su internet residencial no es el mejor.

### ¿Qué ve?
- Ve un entorno digital que en ocasiones le resulta un poco ajeno o complejo.
- Ve su panel de "Próximas Citas" (Dashboard Paciente) y una sala de espera visualmente clara que le indica cuándo el médico se ha conectado.
- Observa su receta médica e historial con un diseño oficial y profesional, listo para ser impreso fácilmente en su casa o en la junta de vecinos.

### ¿Qué oye?
- Oye a sus vecinos quejarse de lo difícil que es conseguir hora presencial en la posta o consultorio rural.
- Oye recomendaciones de sus familiares más jóvenes sobre cómo usar "el celular" para pedir ayuda médica.
- Oye el tono de notificación o lee el SMS/correo electrónico que le avisa 24h y 1h antes de su teleconsulta, recordándole que debe conectarse.

### ¿Qué dice y hace?
- Pide ayuda a sus hijos o nietos para agendar la cita o recordar su contraseña, aunque la plataforma busca ser intuitiva.
- Se conecta desde su teléfono móvil o un computador básico, buscando ansiosamente el botón de "Ingresar a Sala" apenas se habilita la hora.
- Al finalizar, descarga o imprime directamente (`Ctrl + P`) la receta médica para llevarla a la farmacia local.

### ¿Qué le duele? (Esfuerzos / Frustraciones)
- La inestabilidad de su señal de internet y el miedo a que se corte la videollamada a la mitad (frustración mitigada por la tecnología SFU de LiveKit).
- Tener que recordar contraseñas largas o entender términos médicos complejos en la plataforma.
- El miedo constante a olvidar la fecha y hora exacta de su cita y perder su cupo.

### ¿A qué aspira? (Resultados / Beneficios)
- Su mayor aspiración es recibir atención médica de calidad, cálida y oportuna sin tener que salir de su comunidad.
- Quiere tener un registro claro, rápido y comprensible de qué medicamentos debe tomar y cómo seguir su tratamiento.

. . . . . . . . . . . . . . 

## 2. Médico

### ¿Qué piensa y siente?
- Siente la inmensa responsabilidad de dar un diagnóstico clínico preciso a pesar de no poder palpar ni examinar físicamente al paciente.
- Piensa que la telemedicina es el futuro, pero necesita que el software no entorpezca ni ralentice su flujo de atención habitual.
- Valora la inmediatez y alivio de tener el formulario de la ficha clínica en la misma pantalla de la videollamada.

### ¿Qué ve?
- Ve un panel de control (Dashboard Médico) ordenado con la lista exacta de sus pacientes agendados para el día de hoy.
- Ve una interfaz de videollamada dividida: a un lado el rostro del paciente, y al otro un formulario clínico dinámico para anotar signos vitales (presión, peso) y diagnóstico.
- Observa que la identidad del paciente está verificada y sincronizada por la base de datos apenas entra a la sala.

### ¿Qué oye?
- Oye de sus colegas que otros sistemas de telemedicina son desastrosos porque obligan a abrir ventanas separadas para el video y para la ficha electrónica.
- Oye las inquietudes y síntomas de los pacientes rurales, a veces con ruido de estática de fondo.
- Escucha la urgencia institucional de descongestionar las salas de urgencia físicas atendiendo casos menores online.

### ¿Qué dice y hace?
- Revisa las citas pendientes en su calendario virtual antes de comenzar su turno.
- "Acepta" la cita en el sistema y es redirigido automáticamente a la sala de videollamada segura sin tiempos de carga extra.
- Llena la ficha clínica y redacta la prescripción médica en tiempo real, haciendo clic en "Guardar y Finalizar" para actualizar automáticamente la base de datos y dar por terminada la consulta.

### ¿Qué le duele? (Esfuerzos / Frustraciones)
- El ausentismo o impuntualidad de los pacientes, que le hace perder bloques valiosos de su agenda diaria.
- El tiempo muerto invertido en labores administrativas (buscar fichas antiguas, llenar papeles dobles).
- La frustración técnica si el paciente se desconecta justo en el momento de explicarle la dosis de un medicamento.

### ¿A qué aspira? (Resultados / Beneficios)
- Aspira a atender de forma rápida y eficiente, logrando un equilibrio perfecto entre la calidez del trato humano y la eficiencia tecnológica.
- Desea que el paciente reciba su receta médica de forma inmediata e imprimible, asegurando así la adherencia al tratamiento.

. . . . . . . .

## 3. Administrador del Sistema

### ¿Qué piensa y siente?
- Siente la presión constante de mantener la plataforma operativa (uptime) para que ni médicos ni pacientes sufran interrupciones críticas.
- Piensa prioritariamente en la seguridad: sabe que maneja datos muy sensibles (RUTs, historiales médicos) y confía en el sistema JWT y los roles estrictos del backend.
- Siente que debe mantener la disciplina y el orden en el agendamiento para evitar choques de horarios y reclamos cruzados.

### ¿Qué ve?
- Ve una vista global (Dashboard Admin) que monitorea el flujo de usuarios, las citas creadas y la disponibilidad general.
- Ve paneles de control CRUD (Crear, Leer, Actualizar, Borrar) para gestionar altas y bajas de médicos, especialidades y pacientes.
- Observa los "Logs de auditoría" o registros internos para rastrear comportamientos inusuales o errores en el sistema.

### ¿Qué oye?
- Oye constantes requerimientos de soporte técnico cuando un paciente olvida su clave o un médico tiene problemas de acceso.
- Escucha las directrices administrativas del centro de salud indicando qué nuevas especialidades médicas se deben incorporar al sistema.
- Oye sugerencias y reclamos sobre la UI (interfaz de usuario) o la velocidad de carga de la plataforma.

### ¿Qué dice y hace?
- Crea cuentas oficiales y seguras para los nuevos doctores, asignándoles meticulosamente su especialidad y horario en la base de datos.
- Actúa como soporte: cancela citas de forma manual o forzada si un médico reporta licencia médica de urgencia en el último minuto.
- Supervisa técnicamente que el servidor de LiveKit y los procesos automatizados (recordatorios de correo) estén ejecutándose sin fallas.

### ¿Qué le duele? (Esfuerzos / Frustraciones)
- Tener que invertir tiempo corrigiendo errores humanos u operativos (como dobles reservas debido a fallas humanas).
- El pánico ante un riesgo de vulnerabilidad de seguridad, como que un usuario sin privilegios intente acceder a rutas de administración.
- Recibir quejas directas por lentitud del servidor o caídas de conectividad que a veces escapan a su control.

### ¿A qué aspira? (Resultados / Beneficios)
- Aspira a poseer una plataforma 100% automatizada, robusta y "a prueba de errores", donde las moderaciones manuales sean mínimas.
- Quiere tener a su disposición métricas claras de uso que demuestren el éxito y la estabilidad de la plataforma bajo su gestión.
