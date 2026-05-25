# Sprint Planning del Sprint 2 — mediCampo v2

Este documento sintetiza la actividad de planificación y estimación que el equipo realizó previo al arranque formal del Sprint 2, recogiendo los acuerdos centrales sobre el objetivo del periodo, la selección de las historias de usuario priorizadas a partir del Product Backlog y la construcción inicial del Sprint Backlog. El propósito principal es dejar constancia de las decisiones tomadas en conjunto entre Vicente Ramirez, James Honeymann e Ignacio Ampuero, de manera que cualquier integrante futuro del proyecto, o bien la cátedra que evalúa el avance del producto, pueda reconstruir el razonamiento detrás de las prioridades elegidas.

## Antecedentes que dieron pie al Sprint 2

Al cerrar el Sprint 1 el equipo tenía a su disposición la base técnica del proyecto operando de extremo a extremo, con el repositorio inicializado, el servidor Express funcionando, la base de datos PostgreSQL conectada a través de Prisma y, además, un primer prototipo del componente de videollamada utilizando LiveKit como tecnología de Selective Forwarding Unit. Sin embargo, esa pieza tecnológica vivía en un vacío funcional, ya que no existía aún un mecanismo formal para que un paciente real pudiera acceder al sistema, agendar una consulta, ni encontrarse con un médico real en la sala. En otras palabras, el flujo era técnicamente viable pero operacionalmente inaccesible.

A su vez, durante la revisión final del Sprint 1, recogida en el documento sprint_Backlog.md que ya existía en la carpeta versiones_anteriores, se identificó que las historias siguientes en la lista de prioridades correspondían precisamente a aquellas que cerraban este vacío de cara al usuario. Por consiguiente, el ejercicio de planificación del Sprint 2 partió desde una base sólida, esto es, sabíamos qué teníamos hecho, qué nos faltaba, y por qué resultaba urgente atender el flujo de acceso y agendamiento antes de seguir profundizando en otras áreas como notificaciones, panel administrativo o impresión de recetas.

## Objetivo del Sprint 2

El equipo definió, tras una conversación abierta entre los tres integrantes, el siguiente objetivo formal para el sprint que se iniciaba.

Habilitar el ciclo completo de acceso y agendamiento de teleconsultas dentro de la plataforma mediCampo v2, de modo que un paciente rural pueda registrarse en el sistema, iniciar sesión de forma segura, reservar una consulta con un médico disponible y, una vez aceptada por el profesional, ingresar junto a este a la sala de videollamada que ya fue construida durante el Sprint 1.

Este objetivo fue elegido porque condensaba en una sola declaración el cierre del bucle paciente-médico, evitaba la dispersión del esfuerzo en frentes paralelos y, sumado a lo anterior, generaba un entregable demostrable de extremo a extremo que la cátedra podría evaluar sin necesidad de explicaciones intermedias sobre piezas faltantes. Para cumplir con la consigna era imprescindible cubrir tanto la autenticación, dado que sin identidad no hay cita, como el agendamiento, ya que sin un compromiso bilateral no se justifica abrir una sala segura.

## Selección de historias de usuario desde el Product Backlog priorizado

El Product Backlog vigente al inicio del sprint contenía las historias HU00 hasta HU10 con distinto grado de avance, según consta en el documento informacion_del_proyecto/historias_de_usuario.md. La priorización ya estaba reflejada implícitamente en el sprint_Backlog.md anterior, donde se observaba que las historias HU01 (videollamada segura), HU07 (alta disponibilidad), HU02 (historial clínico) y HU09 (sincronización de identidad) habían avanzado de manera significativa en el Sprint 1, mientras que HU03 y HU04 quedaban como las siguientes en la lista, junto con HU05 (notificaciones), HU06 (panel de administración) y HU10 (experiencia de dashboards).

Tras analizar los tiempos disponibles, la complejidad técnica involucrada y la dependencia que existía entre piezas, el equipo seleccionó dos historias para llevar adelante el sprint, considerando que ambas se complementaban entre sí y, además, sumaban un alcance suficiente para llenar el tiempo del periodo sin sobrecargar la carga de trabajo individual.

### Primera historia seleccionada — HU3

Se eligió la HU3, denominada Registro e inicio de sesión del médico y de los usuarios, como Producto-1 del sprint. La justificación para su priorización descansa sobre tres pilares fundamentales, los cuales se detallan a continuación. El primero es la inevitabilidad técnica, porque ninguna otra funcionalidad del sistema puede operar sin un mecanismo confiable de identidad, ni siquiera el agendamiento, dado que las citas se asocian al userId del paciente y del médico autenticados. El segundo es la seguridad de los datos clínicos, ya que sin autenticación con roles diferenciados cualquier visitante anónimo podría acceder a información sensible. El tercero es la consistencia con la arquitectura full-stack que se viene construyendo, donde el JWT firmado por el backend se convierte en la llave que abre el resto de las rutas protegidas.

### Segunda historia seleccionada — HU4

Se eligió la HU4, denominada Reserva de teleconsulta con aceptación del médico e ingreso a la videollamada, como Producto-2 del sprint. La selección obedece a que esta historia transforma la videollamada existente en una funcionalidad útil para el negocio, conecta la base de datos con la interfaz de usuario y, asimismo, demuestra de manera tangible el valor del sistema para el paciente rural objetivo. Adicionalmente, la HU4 cierra el ciclo del Sprint 1, donde la videollamada ya estaba funcionando pero carecía de un mecanismo para que las personas se encontraran dentro de la sala correcta de forma automática. Al sumar esta historia, el sistema deja de ser un conjunto de piezas aisladas y comienza a comportarse como una plataforma integrada de telemedicina.

### Historias descartadas para este sprint

El equipo evaluó también incluir la HU5, relativa a notificaciones automáticas de recordatorio, así como la HU6 sobre el panel completo de administración, pero ambas fueron postergadas conscientemente. La HU5 fue descartada porque requería integrar un proveedor de correo transaccional externo (Nodemailer o Resend), configurar un cron job en Node.js y testear el envío en un entorno productivo, lo cual aumentaba el riesgo de no terminar el sprint a tiempo. La HU6, por su parte, fue postergada porque la creación de médicos desde el panel administrativo dependía de la HU3 ya estabilizada, y abrir ese frente en paralelo generaba riesgo de retrabajo si el sistema de autenticación cambiaba durante el desarrollo.

## Construcción inicial del Sprint Backlog

Una vez acordadas las dos historias seleccionadas, el equipo descompuso cada una en tareas técnicas accionables, asignando un identificador único a cada una con el formato T seguido del número de historia y un índice secuencial. La lista inicial de tareas comprometidas quedó conformada por siete tareas para la HU3 y diez tareas para la HU4, sumando un total de diecisiete piezas de trabajo distribuidas entre los tres integrantes del equipo.

La descomposición se realizó usando como insumo el documento sprint_Backlog.md que ya existía en versiones_anteriores, refinando las descripciones y agregando el detalle técnico necesario para que cualquier integrante pudiera tomar una tarea y comenzar a trabajar sin necesidad de ampliar el contexto. Para mayor claridad, las tareas quedaron divididas según si pertenecían al ámbito backend, al frontend o si requerían colaboración entre ambos, lo cual facilitó la asignación posterior por especialidad.

### Backlog inicial agrupado por capa técnica

En el ámbito backend quedaron las tareas T03.1 (modelo Prisma de User), T03.2 (endpoint de registro), T03.3 (endpoint de login), T04.1 (modelos Prisma de Specialty y Appointment), T04.2 (endpoint de creación de cita), T04.3 (endpoint de listado de doctores), T04.4 (endpoint de citas propias), T04.5 (endpoint de actualización de estado) y T04.9 (generación del meetingLink único). Estas piezas requerían trabajar sobre TypeScript, Express, Prisma y la base de datos PostgreSQL.

En el ámbito frontend quedaron las tareas T03.4 (interfaz de Login), T03.5 (interfaz de Register), T03.6 (AuthContext con localStorage), T03.7 (RoleRoute como guardián), T04.6 (componente ReservaCita), T04.7 (DashboardMedico), T04.8 (DashboardPaciente) y T04.10 (navegación al meetingLink desde ambos dashboards). Estas piezas requerían trabajar sobre React, Vite, TailwindCSS y react-router-dom.

## Capacidad estimada del equipo

El equipo cuenta con tres integrantes activos, esto es, Vicente Ramirez, James Honeymann e Ignacio Ampuero, cada uno con una disponibilidad semanal compuesta por dos bloques de clase formal más algunos tiempos libres acordados de forma asincrónica. Los bloques de clase oficialmente reservados para el proyecto corresponden al martes de 14:00 a 15:20, lo cual equivale a una hora y veinte minutos por sesión, y al viernes de 15:30 a 16:50 horas, también con una hora y veinte minutos disponibles. Considerando un sprint de cuatro semanas, la capacidad total comprometida por integrante en bloques de clase asciende aproximadamente a diez horas y cuarenta minutos, a lo cual se suman entre quince y veinte horas de trabajo individual asincrónico durante el periodo, según la carga académica de cada uno.

De este modo, la capacidad estimada del equipo completo para el Sprint 2 se calcula en torno a noventa horas de trabajo conjunto, considerando los tres integrantes y todas las modalidades de colaboración. Esta cifra fue contrastada con la complejidad estimada de las diecisiete tareas comprometidas, arrojando un margen razonable para absorber imprevistos sin comprometer el cierre del sprint, lo cual finalmente se cumplió con quince tareas terminadas y dos diferidas como mejoras menores hacia el Sprint 3.

## Roles asumidos durante el sprint

Por acuerdo tácito derivado de la afinidad técnica de cada integrante con ciertas áreas del proyecto, el equipo distribuyó las responsabilidades de la siguiente manera. Ignacio Ampuero asumió el rol de Scrum Master ad-hoc, junto con el liderazgo técnico de la infraestructura backend, la integración con LiveKit y el despliegue en DigitalOcean. Vicente Ramirez asumió el liderazgo del frontend, encargándose principalmente del diseño visual con TailwindCSS, la construcción de los componentes de las dashboards y la integración del flujo de reserva. James Honeymann asumió el desarrollo de la capa de autenticación en el backend, los modelos de Prisma asociados, los repositorios y servicios que soportan a los endpoints, junto con la coordinación de las migraciones de base de datos.

Esta distribución se mantuvo flexible durante todo el sprint, permitiendo que los integrantes apoyaran tareas fuera de su área cuando alguno enfrentaba bloqueos, tal como se documenta en las notas del archivo daily_scrum_sprint2.md.

## Compromiso final del equipo

Al cerrar la sesión de Sprint Planning, los tres integrantes manifestaron de forma explícita su compromiso con el objetivo definido, junto con el alcance de las dos historias seleccionadas y la lista inicial de diecisiete tareas técnicas. Asimismo, se acordó que cualquier modificación al backlog durante el sprint debía pasar por una breve conversación grupal, evitando cambios unilaterales que pudieran descalibrar la estimación inicial. Por último, se fijó el ritmo de las daily meetings dentro de los bloques de clase del martes y el viernes, dejando la posibilidad de coordinaciones complementarias por mensajería instantánea cuando alguna tarea lo requiriera con urgencia.

## Documentos relacionados

Para revisar el contenido completo del Sprint Backlog construido tras esta planificación, dirigirse al archivo sprint_backlog_sprint2.md. Para profundizar en la estimación detallada por tarea y por integrante, junto con la asignación específica de responsables, consultar el documento estimacion_compromiso_sprint2.md. Para conocer los avances reportados durante el periodo y los acuerdos tomados en las reuniones diarias, revisar daily_scrum_sprint2.md. Toda la documentación se encuentra alojada dentro de la carpeta Documentos/sprint2 del repositorio del proyecto.
