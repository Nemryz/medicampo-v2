# Sprint Retrospective del Sprint 2 — mediCampo v2

Este documento concentra el desarrollo, las conclusiones y los compromisos derivados de la reunión de Sprint Retrospective realizada al cierre del Sprint 2 del proyecto mediCampo v2. Constituye una instancia interna del equipo, separada de la Sprint Review, donde los tres integrantes se reúnen para reflexionar sobre la dinámica de trabajo durante el periodo, identificar las prácticas que funcionaron bien, reconocer los aspectos que generaron fricción y, sumado a lo anterior, acordar acciones concretas de mejora continua que se incorporarán a la forma de trabajar durante el siguiente sprint. La instancia se realizó inmediatamente después de la Sprint Review, en formato cerrado entre Vicente Ramirez, James Honeymann e Ignacio Ampuero, con una duración aproximada de cuarenta minutos.

## Marco general de la retrospectiva

El equipo eligió mantener la estructura clásica de retrospectiva en tres preguntas, esto es, qué cosas hicimos bien y queremos seguir haciendo, qué cosas no funcionaron tan bien y queremos dejar de hacer, qué cosas nuevas queremos empezar a probar para el siguiente sprint. Cada integrante aportó sus observaciones de manera individual primero, durante una ronda de aproximadamente cinco minutos donde cada uno anotó sus ideas en silencio, para luego compartirlas en una conversación abierta donde se buscaron patrones comunes y se priorizaron las acciones de mejora.

La moderación estuvo a cargo de Ignacio Ampuero en su rol de Scrum Master ad-hoc, asegurando que todos los integrantes tuvieran espacio para hablar, evitando que la conversación se desviara hacia discusiones técnicas profundas y manteniendo el foco en la dinámica de proceso más que en las soluciones técnicas específicas. Para favorecer un ambiente de confianza, se acordó explícitamente que los comentarios serían constructivos y orientados a mejorar el funcionamiento del equipo, sin convertirse en críticas personales hacia ningún integrante en particular.

## Qué cosas hicimos bien y queremos seguir haciendo

Los tres integrantes coincidieron en varios aspectos positivos de la dinámica de trabajo durante el sprint, los cuales se documentan a continuación para su reforzamiento durante el siguiente periodo.

La distribución por afinidad técnica funcionó muy bien, ya que cada integrante pudo concentrarse en el área donde se siente más cómodo y productivo, esto es, Vicente en el frontend, James en el backend de autenticación y datos, e Ignacio en la integración y la infraestructura. Esta distribución redujo el tiempo de aprendizaje sobre tecnologías nuevas y permitió que cada uno avanzara a buen ritmo en sus tareas asignadas. Adicionalmente, los espacios de apoyo cruzado funcionaron bien cuando alguien necesitó ayuda puntual sin que esto comprometiera la productividad general.

La estructura de los Daily Scrum dentro de los bloques de clase resultó ser una decisión acertada, ya que aprovechó tiempos que ya estaban reservados para la asignatura, evitando agregar reuniones adicionales fuera del horario académico que pudieran chocar con las cargas de otras materias. El formato de quince minutos al inicio del bloque, seguido del trabajo conjunto durante el resto del tiempo, generó un buen balance entre sincronización y avance efectivo.

La planificación inicial con estimación detallada por tarea y por integrante, realizada durante el Sprint Planning, demostró ser muy útil para mantener el foco durante el sprint. El hecho de tener desde el inicio una lista clara de las diecisiete tareas comprometidas, con sus responsables principales y sus estimaciones de horas, facilitó la toma de decisiones cuando surgieron pequeños desvíos del plan original, dado que el equipo siempre tenía una referencia clara sobre qué priorizar y dónde estaba el margen disponible.

La definición temprana del meetingLink como punto de conexión entre la reserva y la videollamada resultó ser una decisión arquitectónica muy acertada, ya que permitió que las distintas piezas del flujo se construyeran de forma desacoplada pero convergente, sin necesidad de coordinar interfaces complejas entre los componentes. La generación aleatoria del enlace dentro del backend al momento de crear la cita, junto con el almacenamiento en la base de datos como parte del registro, simplificó todo el flujo posterior de validación y de navegación.

La trazabilidad escrita de los Daily Scrum dentro del documento daily_scrum_sprint2.md fue una práctica que el equipo valoró positivamente, dado que permitió retomar el contexto fácilmente entre una reunión y otra, especialmente cuando algún integrante no pudo asistir presencialmente y necesitó ponerse al día con lo conversado. Adicionalmente, este registro escrito resultó útil al momento de redactar la documentación de cierre del sprint, ya que aportó datos concretos sobre los acuerdos y los bloqueos enfrentados.

## Qué cosas no funcionaron tan bien y queremos dejar de hacer

El equipo también identificó algunos aspectos que generaron fricción o que podrían mejorarse para el siguiente sprint, los cuales se documentan honestamente a continuación.

La integración entre frontend y backend se realizó algo tarde dentro del sprint, recién durante la segunda semana, lo cual generó algún retrabajo cuando se descubrieron incompatibilidades menores en el formato de los datos retornados por la API respecto a lo que el frontend esperaba. Vicente comentó que en algunos casos tuvo que ajustar componentes que ya consideraba terminados porque la estructura del JSON de respuesta difería ligeramente de la asumida inicialmente. James reconoció que pudo haber compartido ejemplos de payloads antes para evitar estos malentendidos.

La comunicación asincrónica por mensajería instantánea durante los fines de semana fue útil pero a veces se diluyó cuando alguien hacía una pregunta y los otros no respondían pronto. En al menos dos ocasiones esto generó horas perdidas porque un integrante tuvo que esperar para resolver un bloqueo en lugar de seguir avanzando. Ignacio reconoció que como Scrum Master pudo haber sido más activo recordando al equipo revisar los mensajes durante el fin de semana, especialmente cuando alguien explícitamente solicitaba ayuda.

La validación manual del flujo end-to-end se hizo solo durante la última semana del sprint, lo cual implicó cierto riesgo, ya que si hubieran aparecido problemas grandes en ese momento habría sido difícil corregirlos a tiempo. Afortunadamente la primera pasada de demo durante el martes de la última semana no reveló problemas críticos, pero el equipo coincidió en que en el siguiente sprint sería conveniente hacer validaciones parciales más frecuentes a lo largo del periodo, no solo al final.

Algunas tareas quedaron asignadas con estimaciones algo optimistas, especialmente las del frontend, donde Vicente tuvo que invertir más horas de las planificadas en pulir detalles visuales y ajustes responsive. Esto no comprometió el cierre del sprint pero generó algo de carga adicional al cierre. El equipo coincidió en que para futuros sprints sería bueno agregar un colchón explícito de tiempo de pulido visual y de pruebas integrales, en lugar de asumir que estos tiempos se absorberían dentro de las estimaciones por tarea.

El equipo no documentó suficientemente los criterios de aceptación específicos por tarea al inicio del sprint, dejando algunos puntos como entendimiento implícito entre los integrantes. Esto no generó problemas mayores porque la comunicación informal funcionó bien, pero al momento de redactar la documentación de cierre algunos detalles tuvieron que reconstruirse desde el código, lo cual hubiera sido más fácil si estuvieran escritos desde el principio.

## Qué cosas nuevas queremos empezar a probar para el siguiente sprint

A partir de las reflexiones anteriores, el equipo acordó incorporar las siguientes prácticas nuevas durante el Sprint 3, con el objetivo de mejorar la dinámica de trabajo y reducir las fricciones identificadas.

Implementar un contrato explícito de los endpoints REST antes de comenzar el desarrollo de cada historia de usuario, documentando en formato breve (puede ser una sección dentro del sprint_backlog del próximo sprint) los payloads de entrada, las respuestas esperadas y los códigos de error posibles para cada endpoint. Esto permitirá que el frontend pueda comenzar a trabajar contra mocks consistentes con el backend final, evitando los ajustes tardíos que generaron retrabajo durante el Sprint 2.

Programar al menos una sesión de validación integral durante la segunda semana del sprint, en lugar de esperar hasta la última semana. La idea es que esta sesión funcione como una mini-demo interna donde el equipo recorra todo el flujo construido hasta ese momento, identificando problemas con tiempo suficiente para corregirlos antes del cierre. La sesión puede realizarse durante el bloque de clase del viernes de la segunda semana, dejando los últimos quince minutos para esta validación.

Acordar de manera explícita los horarios de disponibilidad por mensajería durante los fines de semana, evitando situaciones donde alguien quede bloqueado esperando una respuesta. Cada integrante compartirá durante el Daily Scrum del viernes su disponibilidad para el fin de semana, de modo que los demás sepan a quién pueden recurrir y en qué momentos.

Agregar un colchón explícito de pulido visual y de pruebas integrales al final de cada sprint, equivalente al diez por ciento del tiempo total estimado, considerando que estas tareas suelen tomar más tiempo del previsto y que su importancia es alta para la calidad final del entregable. Este colchón se incorporará desde la planificación, evitando que aparezca como sobrecarga al cierre del sprint.

Documentar los criterios de aceptación específicos por tarea desde el inicio del sprint, dentro del propio Sprint Backlog. La idea es que cada tarea técnica incluya no solo su descripción, su estimación y su responsable, sino también una lista breve de los puntos verificables que permiten dar la tarea por terminada, evitando ambigüedades sobre cuándo una pieza está realmente lista.

Incorporar al menos un diagrama visual de arquitectura general dentro de la documentación del proyecto, respondiendo a la sugerencia recibida durante la Sprint Review por parte de la cátedra evaluadora. El diagrama puede ser construido con herramientas como Excalidraw o Draw.io, mostrando las capas principales del sistema (frontend, backend, base de datos, servidor de LiveKit) junto con las relaciones entre ellas.

## Acciones concretas comprometidas para el Sprint 3

Para que las nuevas prácticas no queden solo como buenas intenciones, el equipo asignó responsables específicos para cada una de las acciones acordadas, dejándolas como tareas concretas con plazos definidos.

Acción uno: Ignacio Ampuero se compromete a redactar el contrato de endpoints REST para las historias seleccionadas del Sprint 3, antes del inicio del primer Daily Scrum del nuevo sprint. El documento se ubicará dentro de la carpeta correspondiente al Sprint 3 con un nombre similar a contrato_endpoints_sprint3.md.

Acción dos: James Honeymann se compromete a moderar la sesión de validación integral durante la segunda semana del Sprint 3, llevando un guion previamente preparado con los pasos del flujo a validar. La sesión se programará dentro del bloque del viernes correspondiente.

Acción tres: Vicente Ramirez se compromete a llevar adelante la incorporación del colchón de pulido visual desde la planificación del Sprint 3, asegurando que las estimaciones contemplen este tiempo adicional para tareas frontend. Esta consideración se reflejará en el documento de estimación correspondiente.

Acción cuatro: Ignacio Ampuero se compromete a coordinar la creación del primer diagrama de arquitectura general del proyecto durante las dos primeras semanas del Sprint 3, idealmente usando Excalidraw o una herramienta similar. El diagrama se exportará como imagen y se incluirá dentro de la documentación correspondiente.

Acción cinco: los tres integrantes se comprometen a compartir su disponibilidad de fin de semana durante cada Daily Scrum del viernes, dejándolo como práctica permanente a partir del Sprint 3. Esta acción no requiere un responsable único, sino que es una práctica colectiva.

Acción seis: los tres integrantes se comprometen a incluir los criterios de aceptación específicos por cada tarea técnica desde la elaboración del Sprint Backlog del Sprint 3, mejorando así la trazabilidad del cumplimiento durante el periodo.

## Reflexiones finales del equipo

Al cierre de la retrospectiva, los tres integrantes manifestaron su satisfacción general con el resultado del Sprint 2 y con la dinámica de trabajo durante el periodo. Reconocieron que el cumplimiento del ochenta y ocho por ciento del Sprint Backlog es una marca alta, especialmente considerando la carga académica paralela de otras asignaturas y las restricciones temporales propias del calendario universitario. Asimismo, valoraron el clima de colaboración mutuo, la disposición a ayudarse cuando alguien tuvo bloqueos y la transparencia con que cada uno reportó sus avances y dificultades durante los Daily Scrum.

Vicente Ramirez destacó que el sprint le permitió consolidar significativamente sus habilidades en React con TypeScript y TailwindCSS, especialmente en la construcción de componentes complejos como ReservaCita.tsx y DashboardMedico.tsx, donde tuvo que manejar múltiples estados y lógicas condicionales coordinadas.

James Honeymann comentó que la experiencia de trabajar con Prisma como ORM le resultó muy productiva, valorando especialmente la capacidad de Prisma para sincronizar el esquema con la base de datos remota mediante migraciones declarativas, además de la integración limpia con TypeScript. Mencionó también que la separación entre controladores, servicios y repositorios resultó muy útil para mantener el código testeable y mantenible.

Ignacio Ampuero, en su rol de Scrum Master ad-hoc, reflexionó sobre el desafío de moderar las reuniones y mantener al equipo enfocado sin entrar él mismo a resolver los problemas técnicos durante el daily. Reconoció que en algunas ocasiones cedió a la tentación de proponer soluciones cuando hubiera sido más adecuado dejar que el equipo las propusiera por sí mismo, área de mejora personal que se propone trabajar durante el Sprint 3.

## Mejora continua como cierre

El equipo coincidió en que la práctica de la Sprint Retrospective es valiosa no solo para mejorar la dinámica de trabajo, sino también para reforzar el sentido de pertenencia y colaboración entre los integrantes, dado que abre un espacio honesto para conversar sobre el proceso sin que se sienta como una crítica negativa. Por consiguiente, se reafirma el compromiso de mantener esta instancia al cierre de cada sprint del proyecto, dejándola como práctica permanente del equipo hasta el cierre del semestre.

Las mejoras a la experiencia de usuario, mencionadas también como sección requerida de esta retrospectiva siguiendo el feedback recogido en la Cátedra 1, se reflejan en las acciones acordadas para el Sprint 3 que tocan directamente la usabilidad de las interfaces. Específicamente, el compromiso de revisar el contraste de elementos secundarios en pantallas móviles, junto con la incorporación de notificaciones explícitas al paciente cuando su cita es rechazada, junto con la programación de sesiones de pruebas de usabilidad con usuarios externos al equipo, responden directamente al feedback recibido sobre cómo el producto puede acercarse mejor al perfil del paciente rural con baja alfabetización digital, perfil que constituye el público objetivo central del proyecto mediCampo v2.

## Documentos relacionados

Para revisar el detalle de los acuerdos formales tomados durante el sprint y los avances reportados en cada Daily Scrum, dirigirse al archivo daily_scrum_sprint2.md. Para conocer la presentación formal realizada a la cátedra y la retroalimentación recibida desde el lado externo, consultar sprint_review_sprint2.md. Para los resultados técnicos obtenidos y la evidencia que sustenta el cumplimiento del sprint, ver resultados_sprint2.md.
