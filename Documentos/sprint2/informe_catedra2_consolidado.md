# Informe Consolidado de la Cátedra 2 — Análisis y Modelamiento de Sistemas

## Proyecto mediCampo v2 — Plataforma de Telemedicina Rural

Equipo de desarrollo: Vicente Ramirez, James Honeymann e Ignacio Ampuero.

Asignatura: Análisis y Modelamiento de Sistemas, nivel 5.

Docente: Magdalena Nieto Gutiérrez.

Fecha de entrega: martes 26 de mayo de 2026 a las 13:00 horas vía CANVAS.

## Sobre este informe

Este documento concentra en un único archivo la totalidad del trabajo realizado por nuestro equipo durante los dos primeros sprints del proyecto mediCampo v2, organizando el contenido según la rúbrica entregada por la cátedra para la evaluación regular. La idea es que cualquier persona que abra este informe pueda recorrer toda la línea de tiempo del proyecto, desde la definición inicial del problema que estamos abordando, pasando por la visión que construimos como equipo, las épicas e historias de usuario que diseñamos en conjunto, hasta llegar a los resultados concretos obtenidos en cada sprint con la evidencia técnica que los respalda.

El informe está dividido en dos grandes partes. La primera parte recoge el contenido del informe de Cátedra 1 corregido, esto es, todo lo relacionado con el Sprint 0 de visión y requisitos y con el Sprint 1 de implementación inicial. La segunda parte recoge el contenido nuevo correspondiente a Cátedra 2, que se concentra en el Sprint 2 donde habilitamos el flujo completo de acceso y agendamiento para los pacientes y los médicos del sistema.

Para que la lectura sea más amena, escribimos este informe como un grupo de estudiantes de Ingeniería Civil Informática que estamos compartiendo nuestra experiencia con el proyecto, explicando las decisiones técnicas con palabras claras y sin esconder los detalles bajo jerga innecesaria, aunque sí manteniendo la rigurosidad propia del trabajo académico.

---

## PARTE 1: Informe de la Cátedra 1 Corregido

Esta primera parte recoge el contenido que entregamos para la Cátedra 1, corregido en función de la retroalimentación recibida y reescrito con el formato consistente del informe completo. Cubre la definición del problema que dio origen al proyecto, los objetivos que nos propusimos, el alcance que asumimos como equipo, las limitaciones que reconocimos, junto con todo el detalle del Sprint 0 y del Sprint 1.

## 1. Descripción del Problema

### 1.1 Planteamiento del problema

En Chile la atención médica está distribuida de manera muy desigual entre las grandes ciudades y las zonas rurales, dado que la mayoría de los especialistas concentra su práctica profesional en las capitales regionales, mientras que las comunidades alejadas dependen casi exclusivamente de la atención primaria que entregan las postas rurales y los consultorios generales. Esta situación, sumada a las distancias geográficas que separan a los habitantes de las localidades más pequeñas de los centros de salud especializados, genera una brecha de acceso a la salud que termina afectando la oportunidad del diagnóstico, la continuidad del tratamiento y, en muchos casos, el bienestar general de las personas que viven en estos territorios.

Adicionalmente, durante los últimos años hemos visto cómo la tecnología ha llegado a casi todos los rincones del país, junto con la masificación de los teléfonos inteligentes y la mejora progresiva de la cobertura de internet móvil, incluso en zonas que antes parecían inaccesibles. Sin embargo, esta llegada de la tecnología no ha venido acompañada de soluciones de telemedicina formales que aprovechen las herramientas disponibles para acercar la salud a las personas, ya que la mayoría de las plataformas existentes están pensadas para entornos urbanos con conexiones rápidas y usuarios con alta alfabetización digital, dejando fuera precisamente al público que más se beneficiaría de un servicio remoto.

### 1.2 Descripción del problema

El problema central que abordamos con el proyecto mediCampo v2 puede expresarse de la siguiente manera, considerando todos los elementos que lo conforman. Los pacientes que viven en zonas rurales de Chile no cuentan con un sistema confiable, accesible y seguro para acceder a consultas médicas con especialistas sin necesidad de trasladarse hasta una capital regional, lo cual genera tres tipos de consecuencias negativas que vale la pena detallar.

En primer lugar, está el costo económico del desplazamiento, ya que viajar desde una localidad rural hasta el centro de salud más cercano puede implicar gastos significativos en transporte, alojamiento y pérdida de jornadas laborales, lo cual termina desalentando que las personas busquen atención preventiva y promueve que solo acudan al médico cuando los síntomas son graves.

En segundo lugar, está el costo de oportunidad en términos de tiempo, ya que un viaje a la ciudad puede consumir uno o varios días completos, especialmente cuando hay que coordinar la cita médica con los horarios de transporte disponibles, lo cual resulta particularmente complicado para personas con responsabilidades familiares o agrícolas que no pueden ausentarse fácilmente de sus tareas habituales.

En tercer lugar, está el costo en salud propiamente tal, ya que la postergación de las consultas médicas por motivos logísticos termina convirtiendo problemas que podrían resolverse fácilmente en cuadros más complejos que requieren intervenciones mayores, lo cual afecta tanto al paciente individualmente como al sistema de salud en su conjunto al saturar los servicios de urgencia con casos que pudieron prevenirse.

### 1.3 Justificación del proyecto

La justificación de mediCampo v2 descansa sobre cuatro pilares que se complementan entre sí. El primero es la viabilidad técnica, dado que las tecnologías necesarias para construir una plataforma de telemedicina robusta están maduras y disponibles, incluyendo frameworks web modernos como React, servidores de medios profesionales como LiveKit, bases de datos relacionales como PostgreSQL y servicios de nube accesibles como DigitalOcean, todo lo cual permite construir el sistema sin necesidad de inventar tecnología desde cero.

El segundo pilar es la viabilidad social, dado que la población objetivo, esto es, los habitantes de zonas rurales, cuenta cada vez con mejor acceso a dispositivos móviles e internet, lo cual permite que un servicio bien diseñado pueda llegar efectivamente a quienes más lo necesitan. Si bien aún existen brechas digitales importantes, el equipo identifica que la tendencia es positiva y que un sistema con interfaces simples y mensajes claros puede ser usado incluso por personas con baja alfabetización digital.

El tercer pilar es la viabilidad económica, dado que una plataforma de telemedicina reduce significativamente los costos por consulta tanto para el paciente como para el sistema de salud, eliminando los desplazamientos y permitiendo que los especialistas atiendan a más personas en menos tiempo. Esta reducción de costos abre la puerta a modelos de financiamiento sostenibles, ya sea mediante alianzas con organismos públicos, convenios con aseguradoras privadas o esquemas mixtos.

El cuarto pilar es la oportunidad académica y formativa que el proyecto representa para nuestro equipo, dado que enfrentar un problema real, con usuarios reales y restricciones reales, nos permite aplicar de manera integrada los conocimientos adquiridos durante la carrera de Ingeniería Civil Informática, incluyendo análisis de requerimientos, diseño de software, arquitectura de sistemas, bases de datos, desarrollo web full-stack, gestión ágil de proyectos y trabajo colaborativo en equipo.

## 2. Objetivos, Alcances y Limitaciones

### 2.1 Objetivo general

Construir una plataforma de telemedicina funcional, segura y accesible, denominada mediCampo v2, que permita a pacientes rurales conectarse con médicos especialistas mediante videollamadas en tiempo real, agendar consultas con un flujo simple y comprensible, y recibir un registro clínico digital de cada atención, todo dentro de un entorno web responsivo que pueda usarse tanto desde computadores personales como desde teléfonos móviles con conexión limitada.

### 2.2 Objetivos específicos

Diseñar la arquitectura técnica completa del sistema, separando claramente el frontend del backend, integrando una base de datos relacional para la persistencia de la información y un servidor de medios para la gestión de las videollamadas, junto con un mecanismo de autenticación que garantice la confidencialidad de los datos sensibles.

Implementar un sistema de autenticación con tres roles diferenciados, esto es, paciente, médico y administrador, donde cada rol tenga acceso únicamente a las funcionalidades que le corresponden, evitando que un usuario pueda ver información o ejecutar operaciones que no le pertenecen.

Construir el módulo de agendamiento de citas que permita al paciente seleccionar un médico disponible, elegir una fecha y un horario, y enviar una solicitud que el médico pueda aceptar o rechazar desde su propio dashboard.

Integrar una solución profesional de videollamadas que soporte audio, video y chat de texto en tiempo real, con adaptación automática a la calidad de la red disponible para que funcione incluso en conexiones rurales lentas.

Construir un sistema de historial clínico digital donde el médico pueda registrar diagnósticos, prescripciones y signos vitales durante o al finalizar la consulta, y donde el paciente pueda consultar posteriormente todas sus atenciones pasadas con la posibilidad de imprimir los documentos.

Habilitar un panel administrativo que permita supervisar el estado general de la plataforma mediante indicadores clave de desempeño, junto con herramientas básicas de mantenimiento operativo.

### 2.3 Alcances del proyecto

El proyecto contempla el desarrollo completo de la plataforma web responsiva, incluyendo tanto la parte que ve el usuario en su navegador (frontend) como la parte que vive en el servidor y gestiona la lógica de negocio y los datos (backend). Asimismo, contempla la configuración y el despliegue del servidor de videollamadas en un entorno productivo accesible públicamente.

El proyecto cubre las funcionalidades centrales que conforman el ciclo de la atención médica virtual, esto es, registro de usuarios, autenticación, agendamiento de citas, videollamada en tiempo real, registro del acto médico y consulta posterior del historial. Adicionalmente, contempla el panel administrativo básico para la supervisión del sistema.

El alcance también incluye toda la documentación técnica del proyecto, las pruebas manuales del flujo completo, junto con la entrega de los artefactos ágiles propios del marco Scrum, incluyendo el Product Backlog, los Sprint Backlogs, los registros de los Daily Scrum, las evidencias de los Sprint Review y las conclusiones de las Sprint Retrospective.

### 2.4 Limitaciones del proyecto

El proyecto no contempla la integración con sistemas externos del sector salud, como FONASA, ISAPRES o el sistema de fichas clínicas público nacional, dado que estas integraciones requieren convenios formales que están fuera del alcance académico del trabajo.

El proyecto no contempla la implementación de notificaciones automáticas por SMS, correo electrónico ni notificaciones push en su versión inicial, aunque la arquitectura está preparada para incorporarlas posteriormente. Estas funcionalidades quedan como pendientes para sprints futuros del proyecto.

El proyecto no contempla la realización de pruebas formales de usabilidad con usuarios reales del segmento objetivo, debido a las restricciones de tiempo, presupuesto y acceso geográfico propias del contexto académico, aunque sí incluye revisiones internas de la experiencia y consideraciones de diseño orientadas al perfil del usuario rural.

El proyecto no contempla certificaciones formales de cumplimiento normativo en materia de salud digital, como la Ley 19.628 sobre Protección de Datos Personales aplicada al sector salud, ni la implementación de respaldo automático geográficamente redundante, aunque sí incluye prácticas de seguridad razonables como el cifrado de contraseñas, el uso de tokens firmados y el almacenamiento sobre infraestructura profesional en la nube.

El proyecto no contempla una aplicación móvil nativa para Android ni para iOS en su versión inicial, dado que la plataforma se entrega como aplicación web responsiva que funciona dentro del navegador del dispositivo móvil. La eventual construcción de aplicaciones nativas queda como mejora futura.

## 3. Sprint 0 — Fase 1 de Scrum: Crear la visión del proyecto

### 3.1 Visión del proyecto

La visión del proyecto mediCampo v2 que construimos como equipo durante el Sprint 0 se formula de la siguiente manera, recogiendo tanto la aspiración de largo plazo como los principios que guían las decisiones de diseño.

Aspiramos a convertir a mediCampo v2 en una herramienta confiable y querida por sus usuarios, que permita a los pacientes rurales de Chile acceder a consultas médicas de calidad sin importar la distancia que los separe del especialista, todo dentro de una experiencia digital simple, segura y respetuosa de su contexto particular, sirviendo como puente entre el conocimiento médico concentrado en las grandes ciudades y las necesidades de salud presentes en cada rincón del país.

Esta visión se sustenta sobre cinco principios que el equipo acordó respetar durante todo el ciclo de desarrollo.

El primer principio es la simplicidad operacional, lo que implica que las interfaces deben tener pocos elementos por pantalla, mensajes claros sin tecnicismos innecesarios y flujos lineales que minimicen la posibilidad de que el usuario se pierda o se confunda.

El segundo principio es la seguridad transparente, lo que implica que el sistema debe proteger la información sensible mediante mecanismos técnicos sólidos, pero también debe comunicar al usuario que su información está siendo cuidada, generando confianza visible mediante íconos, mensajes y certificados.

El tercer principio es la resiliencia ante condiciones adversas, lo que implica que el sistema debe funcionar correctamente incluso cuando la conexión de internet sea inestable o de baja velocidad, adaptándose dinámicamente sin obligar al usuario a configurar parámetros técnicos.

El cuarto principio es la trazabilidad clínica, lo que implica que toda atención médica debe quedar registrada con la información mínima necesaria para que el paciente pueda consultarla posteriormente y, eventualmente, presentarla en otros contextos como farmacias o atenciones de seguimiento.

El quinto principio es la escalabilidad arquitectónica, lo que implica que el sistema debe construirse con una arquitectura que permita crecer hacia más usuarios y más funcionalidades sin necesidad de rehacer las bases técnicas, anticipando que un proyecto exitoso requerirá ampliaciones progresivas.

### 3.2 Stakeholders identificados

Durante el Sprint 0 identificamos a los grupos de interés que se ven afectados por el proyecto, junto con la naturaleza de su relación con la plataforma.

El primer grupo es el de los pacientes rurales, esto es, las personas que viven en zonas alejadas de los centros urbanos y que requieren acceso a consultas médicas con especialistas. Estos son los beneficiarios finales del sistema, cuyas necesidades guían todas las decisiones de diseño.

El segundo grupo es el de los médicos especialistas, esto es, los profesionales que prestan el servicio de atención remota mediante la plataforma. Sus necesidades operacionales determinan cómo se organiza el dashboard del médico, cómo se gestionan las solicitudes de citas y cómo se registra la información clínica.

El tercer grupo es el de los administradores de la plataforma, esto es, las personas responsables de la operación general del sistema, la supervisión de la actividad y la gestión de las cuentas de los profesionales. Sus necesidades determinan las funcionalidades del panel administrativo.

El cuarto grupo es el de la cátedra evaluadora, esto es, la profesora y los ayudantes de la asignatura Análisis y Modelamiento de Sistemas, quienes actúan como stakeholders externos durante el contexto académico del proyecto. Sus expectativas determinan la calidad de la documentación, la profundidad técnica del trabajo y el cumplimiento de los plazos académicos.

## 4. Sprint 0 — Desarrollo de Requisitos: Épicas e Historias de Usuario

### 4.1 Épicas del proyecto

Para organizar las historias de usuario de manera coherente, agrupamos el trabajo en tres grandes épicas que cubren las dimensiones fundamentales del sistema.

La primera épica se denomina Acceso, autenticación y gestión de usuarios, y agrupa todo lo relacionado con la identificación segura de las personas que usan el sistema, la gestión de sus sesiones y el control de los permisos según el rol que les corresponde dentro de la plataforma.

La segunda épica se denomina Gestión de la atención médica, y agrupa todo lo relacionado con el flujo completo de una teleconsulta, desde la reserva de la cita por parte del paciente, pasando por la aceptación o rechazo por parte del médico, la realización de la videollamada propiamente tal, hasta el registro del historial clínico y la consulta posterior del mismo.

La tercera épica se denomina Seguridad del desarrollo y calidad del código, y agrupa todo lo relacionado con las herramientas y prácticas que aseguran que el código que producimos como equipo cumple con estándares razonables de seguridad, calidad y mantenibilidad, incluyendo la gestión segura de credenciales, el análisis estático de vulnerabilidades, la generación automática de pruebas y la detección en tiempo real de patrones inseguros.

### 4.2 Historias de Usuario del Product Backlog completo

A continuación se presenta la totalidad de las historias de usuario que conforman el Product Backlog del proyecto, agrupadas según su épica correspondiente. Cada historia se identifica con el prefijo HU seguido de dos dígitos.

#### Épica 1 — Acceso, autenticación y gestión de usuarios

HU00 — Preparación técnica del entorno full-stack.
Como equipo de desarrollo, necesitamos un entorno de trabajo estructurado, con repositorio independiente, backend funcional, conexión a base de datos y herramientas de colaboración, para poder construir todas las demás funcionalidades sobre una base sólida y escalable.

HU03 — Registro e inicio de sesión del médico y administración de cuentas.
Como médico, necesito poder registrarme e iniciar sesión en la plataforma para acceder de forma segura a mis consultas, y como administrador, necesito poder crear y gestionar cuentas de médicos sin que estos deban auto-registrarse, garantizando control sobre quién tiene acceso al sistema con roles privilegiados.

#### Épica 2 — Gestión de la atención médica

HU01 — Videollamada segura.
Como usuario (paciente rural), necesito realizar una videollamada con un médico para poder tener una consulta médica y recibir un diagnóstico y tratamiento, con la seguridad de que la información compartida es confidencial y no puede ser interceptada por terceros.

HU02 — Historial clínico.
Como médico, necesito guardar notas clínicas del paciente durante la consulta (diagnóstico, tratamiento, recomendaciones) para tener un registro de la consulta y hacer seguimiento del paciente.

HU04 — Reserva de teleconsulta.
Como paciente rural, necesito poder seleccionar un médico disponible con su especialidad, elegir una fecha y hora de atención disponible y confirmar la reserva para tener una consulta médica programada que el médico pueda aceptar o rechazar.

HU05 — Notificaciones de cita.
Como paciente rural, necesito recibir recordatorios automáticos de mi cita, 24 y 1 hora antes de la teleconsulta, para no olvidar conectarme a tiempo.

HU07 — Videollamada de alta disponibilidad.
Como usuario (médico o paciente), necesito que mis videollamadas sean estables y no consuman exceso de recursos de mi dispositivo, incluso con conexiones rurales inestables.

HU08 — Generación y reporte de receta médica imprimible.
Como paciente, necesito poder guardar e imprimir mis recetas y diagnósticos médicos en un formato oficial para presentarlo en farmacias o centros de salud.

HU09 — Sincronización automática de identidad en salas virtuales.
Como médico, necesito saber exactamente quién es el paciente que está en mi sala antes de iniciar la consulta clínica.

HU10 — Experiencia de usuario en dashboards.
Como paciente (usuario), necesito que los paneles de control respondan rápidamente y me redirijan automáticamente al realizar una acción importante (aceptar o finalizar consulta), sin perder el contexto de mi sesión.

HU06 — Panel de administración.
Como administrador del sistema, necesito poder gestionar usuarios (pacientes y médicos), especialidades, médicos y horarios de atención, así como eliminar registros desde el panel central de administración.

#### Épica 3 — Seguridad del desarrollo y calidad del código

HU11 — Integración de 1Password para gestión segura de secretos.
Como desarrollador del sistema, necesito proteger todas las credenciales, claves API y secretos de configuración para que nunca se expongan en el código fuente o repositorio, garantizando la confidencialidad del sistema.

HU12 — Integración de Snyk para escaneo continuo de vulnerabilidades.
Como desarrollador del sistema, necesito detectar proactivamente vulnerabilidades en las dependencias de npm y en las imágenes Docker para mitigar riesgos de seguridad sin salir del editor y antes de que lleguen a producción.

HU13 — Integración de CodeQL para análisis estático avanzado de seguridad.
Como desarrollador del sistema, necesito analizar el código fuente en busca de vulnerabilidades complejas como fallos de control de acceso, inyecciones o fugas de información para garantizar que los endpoints sensibles estén correctamente protegidos.

HU14 — Integración de Keploy para generación automática de pruebas.
Como desarrollador del sistema, necesito acelerar la creación de tests unitarios y de integración para los endpoints y lógica de negocio del sistema para asegurar cobertura de pruebas que reduzca regresiones.

HU15 — Integración de SecureCodeGuard para detección de vulnerabilidades en tiempo real.
Como desarrollador del sistema, necesito recibir alertas instantáneas mientras escribo código sobre posibles vulnerabilidades para mejorar la seguridad del código desde el momento de su creación.

### 4.3 Backlog Priorizado inicial (antes del Sprint 1)

La priorización inicial del Product Backlog se realizó considerando tres criterios principales, esto es, el valor que cada historia entrega al usuario, la dependencia técnica con otras historias y el riesgo asociado a su implementación. El resultado de esta priorización quedó ordenado de mayor a menor prioridad de la siguiente manera.

Prioridad 1 — HU00 Preparación técnica del entorno full-stack, dado que es la base sobre la cual se construye todo lo demás.

Prioridad 2 — HU01 Videollamada segura, dado que es la funcionalidad central del sistema y la que define la propuesta de valor diferencial.

Prioridad 3 — HU07 Videollamada de alta disponibilidad, dado que complementa la HU01 con la robustez técnica necesaria para el contexto rural.

Prioridad 4 — HU02 Historial clínico, dado que da sentido a la videollamada al permitir que la atención quede documentada.

Prioridad 5 — HU09 Sincronización automática de identidad en salas virtuales, dado que asegura que la persona correcta entre a la sala correcta.

Prioridad 6 — HU03 Registro e inicio de sesión, dado que habilita el acceso autenticado al sistema para todos los roles.

Prioridad 7 — HU04 Reserva de teleconsulta, dado que cierra el bucle entre el paciente y el médico permitiéndoles encontrarse en una sala.

Prioridad 8 — HU10 Experiencia de usuario en dashboards, dado que pulir la experiencia mejora la usabilidad general.

Prioridad 9 — HU05 Notificaciones de cita, dado que reduce el ausentismo y mejora la confianza del usuario.

Prioridad 10 — HU06 Panel de administración, dado que habilita la operación supervisada de la plataforma.

Prioridad 11 — HU08 Generación de receta médica imprimible, dado que entrega un producto documental al paciente.

Prioridades 12 a 16 — HU11 a HU15, herramientas de seguridad y calidad del código, que se incorporan progresivamente al final del proyecto.

## 5. Sprint 1 — Fase 2 de Scrum: Sprint Planning

### 5.1 Objetivo del Sprint 1

El objetivo formal que el equipo definió para el Sprint 1 fue el siguiente.

Construir la base técnica completa del proyecto y un primer prototipo funcional de la videollamada con registro clínico asociado, de modo que el equipo pueda demostrar al cierre del sprint que un médico y un paciente pueden conectarse a una sala virtual segura, conversar mediante video y audio en tiempo real, y dejar registrada la información clínica de la consulta dentro de la base de datos del sistema.

### 5.2 Historias seleccionadas para el Sprint 1

A partir del Product Backlog priorizado, seleccionamos para el Sprint 1 las cinco historias de mayor prioridad técnica, esto es, HU00 (Preparación técnica), HU01 (Videollamada segura), HU07 (Videollamada de alta disponibilidad), HU02 (Historial clínico) y HU09 (Sincronización de identidad). Estas cinco historias constituyen el corazón técnico del sistema y, una vez resueltas, permiten que las historias de los sprints siguientes se construyan sobre una base sólida.

La justificación de esta selección descansa sobre tres argumentos principales. El primero es que sin la base técnica de HU00 ninguna otra funcionalidad puede construirse. El segundo es que la videollamada (HU01 y HU07) representa la propuesta de valor diferencial del sistema y, por lo tanto, debe estabilizarse temprano. El tercero es que el historial clínico (HU02) y la sincronización de identidad (HU09) son piezas que se integran directamente con la videollamada y conviene construirlas en conjunto para evitar retrabajo.

### 5.3 Sprint Backlog inicial del Sprint 1

A partir de las cinco historias seleccionadas, descompusimos el trabajo en tareas técnicas accionables con responsables tentativos. El detalle se entrega en la sección siguiente sobre estimación y compromiso.

## 6. Sprint 1 — Estimación y Compromiso

### 6.1 Marco general

La estimación se realizó usando una versión simplificada del Planning Poker, donde cada integrante proponía una cifra en horas para cada tarea, luego conversábamos las diferencias y llegábamos a un consenso. Las tareas técnicas comprometidas para el Sprint 1, junto con su estimación de esfuerzo y su responsable principal, se detallan a continuación.

### 6.2 Tareas de la HU00 — Preparación técnica

T00.1 — Inicializar repositorios para frontend y backend con estructura de carpetas separada. Estimación: 3 horas. Responsable: Ignacio Ampuero.

T00.2 — Configurar el servidor base con Express.js y Node.js, montando los middlewares de CORS y JSON. Estimación: 4 horas. Responsable: James Honeymann.

T00.3 — Aprovisionar la base de datos PostgreSQL en DigitalOcean usando los créditos del GitHub Student Pack. Estimación: 5 horas. Responsable: Ignacio Ampuero.

T00.4 — Migrar el frontend original de Bolt.new a la carpeta frontend con su propio package.json y configuración de Vite. Estimación: 3 horas. Responsable: Vicente Ramirez.

T00.5 — Configurar las variables de entorno y TypeScript en el backend, junto con dotenv para cargarlas al inicio del servidor. Estimación: 3 horas. Responsable: James Honeymann.

### 6.3 Tareas de la HU01 — Videollamada segura

T01.1 — Implementar el servidor de señalización inicial con Socket.io para soportar la fase exploratoria con PeerJS. Estimación: 6 horas. Responsable: Ignacio Ampuero.

T01.2 — Construir el componente de videollamada en React con la primera versión basada en PeerJS. Estimación: 8 horas. Responsable: Vicente Ramirez.

T01.3 — Implementar los controles de micrófono, cámara y finalización de llamada dentro del componente. Estimación: 4 horas. Responsable: Vicente Ramirez.

T01.4 — Agregar indicadores de sesión segura y calidad de red mediante un componente IndicadorCalidadRed. Estimación: 4 horas. Responsable: Vicente Ramirez.

### 6.4 Tareas de la HU07 — Videollamada de alta disponibilidad

T07.1 — Desplegar el servidor LiveKit en un Droplet independiente de DigitalOcean con Docker y configuración SSL mediante Caddy. Estimación: 10 horas. Responsable: Ignacio Ampuero.

T07.2 — Crear el endpoint GET /api/livekit/token en el backend que valide la pertenencia del usuario a la cita y genere el AccessToken firmado. Estimación: 5 horas. Responsable: James Honeymann.

T07.3 — Refactorizar el frontend reemplazando PeerJS por la librería @livekit/components-react. Estimación: 8 horas. Responsable: Vicente Ramirez.

T07.4 — Habilitar la reconexión automática y la adaptación de bitrate mediante adaptiveStream y dynacast. Estimación: 4 horas. Responsable: Ignacio Ampuero.

### 6.5 Tareas de la HU02 — Historial clínico

T02.1 — Diseñar el modelo Prisma ClinicalRecord asociado al Appointment, incluyendo los campos de constantes vitales y los textuales del acto médico. Estimación: 4 horas. Responsable: James Honeymann.

T02.2 — Construir el endpoint POST /api/clinical/:appointmentId que guarde la ficha y marque la cita como completada de forma secuencial. Estimación: 5 horas. Responsable: James Honeymann.

T02.3 — Construir los endpoints GET para consultar el historial del paciente y la ficha de una cita específica. Estimación: 4 horas. Responsable: James Honeymann.

T02.4 — Construir el formulario de ficha clínica dentro del panel lateral de Videollamada.tsx, visible solo para el rol DOCTOR. Estimación: 6 horas. Responsable: Vicente Ramirez.

### 6.6 Tareas de la HU09 — Sincronización de identidad

T09.1 — Crear el endpoint GET /api/appointments/room/:roomId que mapee la sala con la cita asociada. Estimación: 3 horas. Responsable: Ignacio Ampuero.

T09.2 — Cargar las identidades del paciente y del médico en el panel lateral de la videollamada según el rol del usuario conectado. Estimación: 4 horas. Responsable: Vicente Ramirez.

### 6.7 Resumen de carga estimada

Sumando todas las tareas comprometidas, el total de horas estimadas para el Sprint 1 fue de aproximadamente 93 horas distribuidas entre los tres integrantes. Vicente Ramirez asumió alrededor de 34 horas concentradas en el frontend, James Honeymann asumió alrededor de 25 horas concentradas en el backend de datos, e Ignacio Ampuero asumió alrededor de 34 horas concentradas en infraestructura y videollamada. Las cifras son consistentes con la capacidad estimada del equipo en torno a 95 horas conjuntas para el periodo.

## 7. Sprint 1 — Fase 3 de Scrum: Lineamientos del Daily Scrum

### 7.1 Acuerdos para las reuniones diarias

Las reuniones diarias del Sprint 1 se realizaron dentro de los bloques de clase, esto es, los martes desde las 14:00 hasta las 15:20 y los viernes desde las 15:30 hasta las 16:50, aprovechando los primeros quince minutos de cada bloque para sincronización y dejando el resto del tiempo para trabajo conjunto. Cada reunión siguió el formato clásico de las tres preguntas por integrante, esto es, qué hice desde la última reunión, qué haré antes de la próxima, y qué bloqueos enfrento. La rotación de la palabra se realizó en orden alfabético del nombre de pila para evitar discusiones sobre quién comienza.

El Sprint 1 tuvo ocho reuniones diarias durante las cuatro semanas del periodo, manteniendo una bitácora escrita en cada una donde quedaron registrados los reportes individuales, los acuerdos tomados y los bloqueos identificados. Las reuniones funcionaron como mecanismo de sincronización efectivo y permitieron mantener el ritmo de avance durante todo el sprint sin desvíos significativos del plan original.

### 7.2 Síntesis de los acuerdos más relevantes

Durante el sprint, el equipo decidió en conjunto reemplazar PeerJS por LiveKit como tecnología base para la videollamada, dado que las pruebas con PeerJS en redes con NAT estricto fallaban consistentemente. Esta decisión fue tomada durante la cuarta reunión diaria y reordenó el resto del sprint para acomodar la migración.

También durante el sprint, el equipo acordó dividir las responsabilidades de infraestructura entre Ignacio Ampuero (servidor LiveKit, despliegue, certificados SSL) y James Honeymann (base de datos, endpoints backend, modelos Prisma), liberando a Vicente Ramirez para concentrarse en el frontend completo, dado que la complejidad de los componentes de React justificaba dedicación exclusiva.

Finalmente, el equipo acordó establecer la práctica de programación pareada para los puntos de integración entre el frontend y el backend, especialmente durante la conexión del componente de videollamada con el endpoint de tokens de LiveKit, lo cual evitó varios problemas de incompatibilidad de datos que habrían generado retrabajo significativo.

## 8. Sprint 1 — Entregables Técnicos

### 8.1 Entregable de la HU01 + HU07 — Componente de Videollamada

El primer entregable técnico del Sprint 1 corresponde al componente Videollamada.tsx ubicado en frontend/src/components/Videollamada.tsx, junto con el endpoint /api/livekit/token implementado en backend/src/controllers/livekitController.ts y el servidor LiveKit desplegado en medicampo-rtc.duckdns.org.

La interfaz visible para el usuario presenta una sala de video con dos cuadros lado a lado en escritorio (uno por participante), controles inferiores para activar o desactivar micrófono y cámara, un botón de colgar que cierra la sala y regresa al dashboard, un indicador de calidad de red en la parte superior derecha que cambia de color según el estado de la conexión, y una leyenda Cifrado Militar con un escudo que comunica al usuario que la sesión está protegida.

El flujo técnico ocurre de la siguiente forma. El usuario llega al componente con una URL del tipo /room/:roomId. El componente PreFlightCheck verifica los permisos de cámara y micrófono. Una vez aprobado el chequeo, el frontend solicita un token al endpoint /api/livekit/token. El backend verifica que el usuario autenticado tenga una cita asignada a la sala solicitada, genera un AccessToken firmado con la API_KEY y API_SECRET de LiveKit, y lo devuelve. El frontend usa el token para conectarse al servidor LiveKit mediante WebSocket seguro y comienza a publicar y recibir flujos de audio y video.

### 8.2 Entregable de la HU02 — Historial Clínico

El segundo entregable técnico corresponde al componente HistorialClinico.tsx ubicado en frontend/src/components/HistorialClinico.tsx, junto con el panel lateral integrado dentro de Videollamada.tsx para el médico, los endpoints implementados en backend/src/controllers/clinicalController.ts y el modelo ClinicalRecord definido en backend/prisma/schema.prisma.

Durante la videollamada, el médico ve un panel lateral derecho con un formulario que tiene los campos de diagnóstico y prescripción, junto con los campos de constantes vitales como peso, talla, presión arterial, temperatura, frecuencia cardíaca y saturación de oxígeno. Al hacer clic en el botón Finalizar Consulta, los datos se envían al endpoint POST /api/clinical/:appointmentId, el backend ejecuta un upsert en la tabla ClinicalRecord y actualiza el estado de la cita a COMPLETED.

Después de la consulta, el paciente puede acceder a /historial donde ve la lista de sus atenciones completadas con sus diagnósticos y recetas asociadas, junto con la opción de imprimir el documento desde el navegador.

## 9. Sprint 1 — Fase 4 de Scrum: Resultados de la Revisión

### 9.1 Resultados obtenidos en el Sprint 1

El Sprint 1 cerró con todas las tareas técnicas comprometidas en estado completado en sus aspectos centrales, dejando solo algunas mejoras incrementales como pendientes para el Sprint 2. El equipo logró validar que el flujo de videollamada funciona correctamente entre dos usuarios reales (un médico y un paciente) conectados desde dos navegadores distintos, con video bidireccional, audio full duplex, chat de texto y registro clínico funcional.

El servidor LiveKit quedó desplegado de forma estable en DigitalOcean con SSL gestionado por Caddy y soporte para subdominios mediante DuckDNS. Las pruebas manuales realizadas durante la última semana del sprint confirmaron que la latencia se mantiene en rangos aceptables (menos de 150 milisegundos) y que la reconexión automática funciona correctamente cuando la conexión se interrumpe brevemente.

### 9.2 Evidencia de los productos del Sprint 1

El Producto-1 del Sprint 1 quedó representado por el componente de videollamada con sus controles de hardware, indicador de calidad de red, sala segura con cifrado y soporte para chat de texto. Este producto puede demostrarse en vivo abriendo dos navegadores en paralelo, simulando la entrada de un médico y un paciente a la misma sala identificada por un roomId compartido.

El Producto-2 del Sprint 1 quedó representado por el módulo de historial clínico, que incluye tanto el formulario de registro dentro de la videollamada como la vista de consulta posterior del historial. Este producto puede demostrarse completando una consulta, guardando la ficha clínica y luego navegando al historial del paciente para confirmar que la información quedó persistida correctamente.

## 10. Sprint 1 — Sprint Review

La Sprint Review del Sprint 1 se realizó durante el bloque de clase del viernes de la última semana, presentando ante la cátedra el flujo completo de la videollamada con registro clínico. La demostración se ejecutó en vivo con dos navegadores en paralelo y mostró el ciclo completo desde la conexión hasta el guardado de la ficha.

La retroalimentación recibida fue mayoritariamente positiva, valorando especialmente la calidad técnica del despliegue de LiveKit, la robustez del flujo de tokens y la integración fluida entre la videollamada y el panel lateral de ficha clínica. Como sugerencias, la cátedra recomendó trabajar en la usabilidad de las interfaces para el siguiente sprint, dado que el flujo actual asumía que el usuario ya estaba dentro de la sala sin contemplar el acceso desde el momento del registro o del agendamiento.

Esta retroalimentación fue lo que nos motivó a priorizar las historias HU3 (Registro e inicio de sesión) y HU4 (Reserva de teleconsulta) para el Sprint 2, cerrando así el flujo de extremo a extremo de cara al usuario final.

## 11. Sprint 1 — Fase 5 de Scrum: Sprint Retrospective

### 11.1 Qué cosas hicimos bien

El equipo coincidió en que la decisión de migrar de PeerJS a LiveKit fue acertada, aunque generó retrabajo en el medio del sprint. Asimismo, la división temprana de responsabilidades por afinidad técnica permitió que cada integrante avanzara con buen ritmo sin necesidad de aprender tecnologías nuevas. La programación pareada para los puntos de integración entre frontend y backend evitó problemas serios de incompatibilidad.

### 11.2 Qué cosas no funcionaron tan bien

La estimación inicial subestimó la complejidad del despliegue del servidor LiveKit, especialmente en lo relativo a la configuración del firewall del Droplet para los puertos UDP necesarios. Esto generó algunas horas adicionales de trabajo durante la primera semana. También se identificó que algunas decisiones técnicas se tomaron sin documentar el razonamiento, lo cual dificultó posteriormente reconstruir por qué se eligieron ciertas alternativas.

### 11.3 Qué cosas queremos probar para el siguiente sprint

El equipo acordó incorporar las siguientes prácticas para el Sprint 2: documentar las decisiones técnicas relevantes dentro del propio Sprint Backlog, agregar un colchón explícito de tiempo para imprevistos en la estimación inicial, y programar al menos una sesión de validación integral en la mitad del sprint para detectar problemas con tiempo de corrección.

---

## PARTE 2: Informe de la Cátedra 2

Esta segunda parte recoge el contenido nuevo correspondiente a la Cátedra 2, que se concentra en el Sprint 2 donde habilitamos el flujo completo de acceso y agendamiento de teleconsultas dentro de la plataforma. Cubre la presentación del Backlog Priorizado actualizado, la planificación del Sprint 2, la estimación detallada de las tareas, los registros del Daily Scrum, los entregables técnicos, los resultados obtenidos, la Sprint Review con la retroalimentación recibida y la Sprint Retrospective con las mejoras identificadas, incluyendo la sección obligatoria sobre Mejoras en la Experiencia de Usuario basadas en el feedback de la Cátedra 1.

## 12. Presentación del Backlog Priorizado (actualizado tras el Sprint 1)

### 12.1 Backlog Priorizado vigente al inicio del Sprint 2

Tras el cierre del Sprint 1, donde quedaron completadas las historias HU00 (Preparación técnica), HU01 (Videollamada segura), HU07 (Videollamada de alta disponibilidad), HU02 (Historial clínico) y HU09 (Sincronización de identidad), el Product Backlog se actualizó retirando estas historias de la lista activa y reordenando las restantes según las prioridades vigentes para el Sprint 2.

El Backlog Priorizado que el equipo presentó al inicio del Sprint 2 quedó conformado por las siguientes historias, en orden de mayor a menor prioridad para el periodo entrante.

Prioridad 1 — HU03 Registro e inicio de sesión del médico y administración de cuentas.
Como médico, necesito poder registrarme e iniciar sesión en la plataforma para acceder de forma segura a mis consultas, y como administrador, necesito poder crear y gestionar cuentas de médicos sin que estos deban auto-registrarse. Esta historia se priorizó como la más alta dado que sin un mecanismo confiable de identidad ninguna otra funcionalidad puede operar de forma segura.

Prioridad 2 — HU04 Reserva de teleconsulta.
Como paciente rural, necesito poder seleccionar un médico disponible, elegir una fecha y hora de atención disponible y confirmar la reserva para tener una consulta médica programada que el médico pueda aceptar o rechazar. Esta historia se priorizó como la segunda más alta dado que cierra el bucle paciente-médico al permitir que ambos converjan en una sala compartida.

Prioridad 3 — HU10 Experiencia de usuario en dashboards.
Como paciente (usuario), necesito que los paneles de control respondan rápidamente y me redirijan automáticamente al realizar una acción importante, sin perder el contexto de mi sesión. Esta historia agrupa mejoras incrementales que pulen la experiencia general.

Prioridad 4 — HU05 Notificaciones de cita.
Como paciente rural, necesito recibir recordatorios automáticos de mi cita, 24 y 1 hora antes de la teleconsulta, para no olvidar conectarme a tiempo. Esta historia mejora la conversión de las citas agendadas en consultas efectivamente realizadas.

Prioridad 5 — HU06 Panel de administración.
Como administrador del sistema, necesito poder gestionar usuarios, especialidades, médicos y horarios, así como eliminar registros desde el panel central. Esta historia profesionaliza la operación de la plataforma.

Prioridad 6 — HU08 Generación y reporte de receta médica imprimible.
Como paciente, necesito poder guardar e imprimir mis recetas y diagnósticos médicos en un formato oficial. Esta historia entrega un producto documental tangible al paciente.

Prioridades 7 a 11 — HU11 a HU15, herramientas de seguridad y calidad del código, que conforman la épica 3 y se planifican para sprints posteriores.

### 12.2 Justificación de la priorización

La priorización refleja un equilibrio entre tres consideraciones. La primera es la dependencia técnica, dado que HU03 y HU04 son requisitos previos para varias historias posteriores, especialmente para HU05, HU06 y HU08, que asumen usuarios autenticados y citas existentes en la base de datos.

La segunda consideración es el valor para el usuario final, dado que cerrar el bucle de acceso y agendamiento durante el Sprint 2 transforma el sistema de un conjunto de piezas técnicas aisladas en una plataforma usable de extremo a extremo, lo cual es crítico para poder mostrar avance significativo a la cátedra evaluadora y para tener una base sobre la cual seguir construyendo las funcionalidades complementarias.

La tercera consideración es la complejidad técnica relativa, dado que el equipo evaluó que HU03 y HU04 tenían una complejidad manejable para un sprint de cuatro semanas con tres integrantes, mientras que historias como HU05 (notificaciones) o HU08 (impresión de PDF) tenían dependencias externas adicionales (proveedor de correo, librerías de PDF) que aumentaban el riesgo de no terminar a tiempo.

## 13. Sprint 2 — Fase 1 de Scrum: Sprint Planning

### 13.1 Antecedentes que dieron pie al Sprint 2

Al cerrar el Sprint 1, teníamos la base técnica del proyecto funcionando completamente, con el repositorio inicializado, el servidor Express operativo, la base de datos PostgreSQL conectada mediante Prisma y el primer prototipo funcional de la videollamada usando LiveKit. Sin embargo, esa pieza tecnológica vivía en un vacío funcional, dado que no existía aún un mecanismo formal para que un paciente real pudiera acceder al sistema, agendar una consulta y encontrarse con un médico real en la sala. En otras palabras, el flujo era técnicamente viable pero operacionalmente inaccesible para un usuario externo.

A su vez, durante la revisión final del Sprint 1 identificamos que las historias siguientes en la lista de prioridades correspondían precisamente a aquellas que cerraban este vacío de cara al usuario. Por consiguiente, el ejercicio de planificación del Sprint 2 partió desde una base sólida, esto es, sabíamos qué teníamos hecho, qué nos faltaba y por qué resultaba urgente atender el flujo de acceso y agendamiento antes de seguir profundizando en otras áreas.

### 13.2 Objetivo del Sprint 2

El objetivo formal que el equipo definió para el Sprint 2 fue el siguiente.

Habilitar el ciclo completo de acceso y agendamiento de teleconsultas dentro de la plataforma mediCampo v2, de modo que un paciente rural pueda registrarse en el sistema, iniciar sesión de forma segura, reservar una consulta con un médico disponible y, una vez aceptada por el profesional, ingresar junto a este a la sala de videollamada que ya fue construida durante el Sprint 1.

Este objetivo fue elegido porque condensaba en una sola declaración el cierre del bucle paciente-médico, evitaba la dispersión del esfuerzo en frentes paralelos y, sumado a lo anterior, generaba un entregable demostrable de extremo a extremo que la cátedra podría evaluar sin necesidad de explicaciones intermedias sobre piezas faltantes.

### 13.3 Selección de historias para el Sprint 2

A partir del Backlog Priorizado actualizado, el equipo seleccionó las dos historias de mayor prioridad para llevar adelante el Sprint 2, esto es, HU03 (Registro e inicio de sesión) como Producto-1, y HU04 (Reserva de teleconsulta) como Producto-2. Ambas historias se complementan entre sí y, además, suman un alcance suficiente para llenar el tiempo del periodo sin sobrecargar la carga individual de cada integrante.

### 13.4 Historias descartadas para este sprint

El equipo evaluó también incluir la HU5 (notificaciones) y la HU6 (panel completo de administración), pero ambas fueron postergadas conscientemente. La HU5 fue descartada porque requería integrar un proveedor de correo transaccional externo, configurar un cron job y testear el envío en un entorno productivo, lo cual aumentaba el riesgo de no terminar el sprint a tiempo. La HU6 fue postergada porque la creación de médicos desde el panel administrativo dependía de la HU3 ya estabilizada, y abrir ese frente en paralelo generaba riesgo de retrabajo.

### 13.5 Construcción inicial del Sprint Backlog

Una vez acordadas las dos historias seleccionadas, descompusimos cada una en tareas técnicas accionables, asignando un identificador único a cada una con el formato T seguido del número de historia y un índice secuencial. La lista inicial de tareas comprometidas quedó conformada por siete tareas para la HU3 y diez tareas para la HU4, sumando un total de diecisiete piezas de trabajo distribuidas entre los tres integrantes del equipo.

### 13.6 Capacidad estimada del equipo

La capacidad disponible se estimó en alrededor de noventa horas conjuntas para el Sprint 2, considerando los bloques de clase (martes 14:00 a 15:20 y viernes 15:30 a 16:50 durante cuatro semanas) más los espacios autónomos de trabajo individual de cada integrante. Esta cifra se contrastó con la complejidad estimada de las diecisiete tareas comprometidas, dejando un margen razonable para absorber imprevistos.

### 13.7 Roles asumidos durante el sprint

Ignacio Ampuero asumió el rol de Scrum Master ad-hoc junto con el liderazgo técnico de la infraestructura backend, la integración con LiveKit y el mantenimiento del despliegue en DigitalOcean. Vicente Ramirez asumió el liderazgo del frontend, encargándose principalmente del diseño visual con TailwindCSS, la construcción de los componentes de los dashboards y la integración del flujo de reserva. James Honeymann asumió el desarrollo de la capa de autenticación en el backend, los modelos Prisma asociados, los repositorios y servicios que soportan los endpoints, junto con la coordinación de las migraciones de base de datos.

## 14. Sprint 2 — Estimación y Compromiso

### 14.1 Marco general

La estimación se realizó con la misma técnica simplificada del Planning Poker, donde cada integrante propuso una cifra inicial, conversamos las diferencias y llegamos a un consenso. Las estimaciones consideran el tiempo efectivo de codificación, las pruebas manuales en el navegador y la integración con las piezas existentes, pero excluyen las pausas, las reuniones formales y los tiempos muertos entre asignaturas.

### 14.2 Estimación detallada de la HU3

T03.1 — Modelo Prisma de User con roles. Estimación: 4 horas. Responsable: James Honeymann. Estado al cierre: completada.

T03.2 — Endpoint POST /api/auth/register con validaciones y cifrado bcryptjs. Estimación: 5 horas. Responsable: James Honeymann. Estado al cierre: completada.

T03.3 — Endpoint POST /api/auth/login con generación de JWT. Estimación: 4 horas. Responsable: James Honeymann. Estado al cierre: completada.

T03.4 — Interfaz de Login.tsx con formulario, validaciones y manejo de estados. Estimación: 6 horas. Responsable: Vicente Ramirez. Estado al cierre: completada.

T03.5 — Interfaz de Register.tsx con formulario completo y auto-login posterior. Estimación: 6 horas. Responsable: Vicente Ramirez. Estado al cierre: completada.

T03.6 — AuthContext con persistencia en localStorage. Estimación: 3 horas. Responsable: Ignacio Ampuero. Estado al cierre: completada.

T03.7 — RoleRoute como guardián de rutas según rol. Estimación: 3 horas. Responsable: Ignacio Ampuero. Estado al cierre: completada.

Subtotal de horas estimadas para la HU3: 31 horas.

### 14.3 Estimación detallada de la HU4

T04.1 — Modelos Prisma de Specialty y Appointment con relaciones. Estimación: 5 horas. Responsable: James Honeymann. Estado al cierre: completada.

T04.2 — Endpoint POST /api/appointments/book con generación del meetingLink. Estimación: 5 horas. Responsable: James Honeymann. Estado al cierre: completada.

T04.3 — Endpoint GET /api/appointments/doctors. Estimación: 3 horas. Responsable: James Honeymann. Estado al cierre: completada.

T04.4 — Endpoint GET /api/appointments/my-appointments filtrado por rol. Estimación: 4 horas. Responsable: Ignacio Ampuero. Estado al cierre: completada.

T04.5 — Endpoint PATCH /api/appointments/:id/status con validación de propiedad. Estimación: 4 horas. Responsable: Ignacio Ampuero. Estado al cierre: completada.

T04.6 — Componente ReservaCita.tsx con flujo de tres pasos. Estimación: 8 horas. Responsable: Vicente Ramirez. Estado al cierre: completada.

T04.7 — Componente DashboardMedico.tsx con cuatro secciones diferenciadas. Estimación: 8 horas. Responsable: Vicente Ramirez. Estado al cierre: completada.

T04.8 — Componente DashboardPaciente.tsx con badges diferenciados. Estimación: 6 horas. Responsable: Vicente Ramirez. Estado al cierre: completada.

T04.9 — Generación del meetingLink único en el AppointmentService. Estimación: 2 horas. Responsable: Ignacio Ampuero. Estado al cierre: completada.

T04.10 — Navegación al meetingLink desde ambos dashboards usando useNavigate. Estimación: 3 horas. Responsable: Ignacio Ampuero. Estado al cierre: completada.

Subtotal de horas estimadas para la HU4: 48 horas.

### 14.4 Resumen de carga por integrante

Vicente Ramirez asumió un total de 28 horas estimadas, concentradas en el frontend con las tareas T03.4, T03.5, T04.6, T04.7 y T04.8.

James Honeymann asumió un total de 26 horas estimadas, concentradas en el backend de autenticación y la capa de datos con las tareas T03.1, T03.2, T03.3, T04.1, T04.2 y T04.3.

Ignacio Ampuero asumió un total de 25 horas estimadas, distribuidas entre la infraestructura de autenticación, los endpoints de citas más sensibles y la integración con el componente de videollamada con las tareas T03.6, T03.7, T04.4, T04.5, T04.9 y T04.10. Adicionalmente, dedicó tiempo extra a la coordinación del equipo como Scrum Master ad-hoc.

El total de horas estimadas comprometidas asciende a 79 horas, dejando un margen de 11 horas frente a la capacidad total del equipo de 90 horas para absorber imprevistos sin comprometer el cierre del sprint.

### 14.5 Compromiso individual del equipo

Vicente Ramirez se comprometió a terminar las pantallas de Login y Register dentro de la primera semana, los dashboards del paciente y del médico en la segunda y tercera semana, el componente de reserva en la tercera semana, dejando la cuarta semana para pulir detalles visuales, ajustes responsive y revisiones de accesibilidad.

James Honeymann se comprometió a tener los modelos Prisma y los endpoints de autenticación funcionando durante la primera semana, los endpoints de citas en la segunda semana y, asimismo, apoyar a sus compañeros en la integración frontend-backend durante la tercera y cuarta semana, asistiendo a las revisiones técnicas que fueran necesarias.

Ignacio Ampuero se comprometió a entregar el AuthContext y el RoleRoute durante la primera semana, los endpoints de citas más sensibles en la segunda semana, las integraciones con el componente de videollamada existente en la tercera semana y, además, mantener el servidor de LiveKit operativo durante todo el periodo. En su rol de coordinador, también se comprometió a moderar las reuniones diarias y a llevar el registro de los acuerdos.

### 14.6 Riesgos identificados y mitigaciones

El primer riesgo identificado fue la coincidencia con periodos de evaluaciones de otras asignaturas, lo cual podría reducir la disponibilidad efectiva de algún integrante en alguna semana específica. La mitigación acordada fue la flexibilidad en el reordenamiento de tareas según la carga semanal real.

El segundo riesgo fue la dependencia entre frontend y backend, dado que los componentes visuales no pueden integrarse hasta que los endpoints estén disponibles. La mitigación fue priorizar la construcción de los modelos Prisma y los endpoints durante la primera semana, de modo que el frontend tuviera datos reales con los cuales trabajar desde la segunda semana.

El tercer riesgo fue la complejidad de la integración con el componente de videollamada existente, especialmente en lo relativo al manejo del meetingLink y la navegación al roomId correcto. La mitigación fue asignar las tareas T04.9 y T04.10 al integrante con mayor familiaridad con LiveKit, esto es, Ignacio Ampuero, junto con sesiones de programación pareada con Vicente Ramirez.

## 15. Sprint 2 — Fase 2 de Scrum (Implementación): Lineamientos del Daily Scrum

### 15.1 Lineamientos acordados para las reuniones diarias

Antes de iniciar el sprint, el equipo acordó los lineamientos que regirían las reuniones diarias, considerando las restricciones reales del calendario académico y las disponibilidades individuales.

Frecuencia y duración: las reuniones se realizan presencialmente dentro de los bloques de clase, esto es, los martes desde las 14:00 hasta las 15:20 y los viernes desde las 15:30 hasta las 16:50, aprovechando los primeros quince minutos de cada sesión para sincronización pura y dejando el resto del bloque para trabajo conjunto. Cuando algún integrante no puede asistir presencialmente, comparte su reporte por mensajería instantánea.

Estructura de cada reunión: cada Daily Scrum sigue el patrón clásico de tres preguntas por integrante, esto es, qué hice desde la reunión anterior, qué haré antes de la próxima reunión y qué bloqueos estoy enfrentando. La rotación de la palabra se realiza en orden alfabético del nombre de pila para evitar discusiones sobre quién comienza.

Reglas de oro acordadas: no se resuelven problemas técnicos durante la reunión diaria sino que se identifican y se programa una conversación posterior, cualquier modificación al Sprint Backlog debe ser aprobada en conjunto, la persona con bloqueos debe solicitar explícitamente ayuda durante el daily, y los avances se reportan en términos verificables como pull requests creados, archivos modificados o pruebas ejecutadas.

Documentación de las reuniones: cada reunión queda registrada por parte del Scrum Master ad-hoc, Ignacio Ampuero, capturando los reportes individuales, los acuerdos tomados, los bloqueos identificados y las acciones de seguimiento pendientes para el siguiente encuentro.

### 15.2 Bitácora resumida de las ocho reuniones diarias

A continuación se resumen las ocho reuniones diarias realizadas durante las cuatro semanas del Sprint 2.

#### Reunión 1 — Martes, semana 1

En la primera reunión del sprint, el equipo confirmó las asignaciones iniciales y comenzó el trabajo en paralelo. Ignacio comprometió la implementación del AuthContext y el RoleRoute para la primera semana. James comprometió el modelo User en Prisma y el endpoint de registro para los próximos días, aunque mencionó como bloqueo inicial que necesitaba la URL de la base de datos remota, situación que Ignacio resolvió compartiendo el archivo .env por canal privado. Vicente comprometió comenzar el componente Login.tsx con base en los mockups que ya tenía esbozados.

#### Reunión 2 — Viernes, semana 1

En la segunda reunión, Ignacio reportó tener listo el AuthContext con persistencia en localStorage y el RoleRoute funcionando. James reportó tener listos el modelo User y los endpoints de registro y login, probados manualmente con Postman. Vicente reportó tener listo el componente Login.tsx con integración funcional al endpoint de login. El equipo se comprometió a avanzar durante el fin de semana con los modelos de Specialty y Appointment, el componente Register.tsx y el inicio de los endpoints de citas. La HU3 quedó al 60 por ciento de avance al cierre de la semana.

#### Reunión 3 — Martes, semana 2

En la tercera reunión, James reportó tener listos los modelos de Specialty y Appointment con sus migraciones, junto con los endpoints POST de creación de cita y GET de listado de doctores. Ignacio reportó haber comenzado con los endpoints GET de citas propias y PATCH de actualización de estado, aunque sin la validación de propiedad estricta aún. Vicente reportó tener listo el componente Register.tsx con auto-login posterior. El equipo decidió cerrar la HU3 a más tardar el viernes de esa semana, dejando el resto del sprint enfocado en la HU4.

#### Reunión 4 — Viernes, semana 2

En la cuarta reunión, con Ignacio conectado por videollamada debido a una evaluación de otra asignatura, el equipo confirmó que Ignacio había agregado la validación de propiedad en el PATCH y la generación del meetingLink en el AppointmentService. James completó la documentación de los endpoints y apoyó a Vicente con la creación de datos seed. Vicente terminó la primera versión del DashboardPaciente.tsx. La HU3 se dio por cerrada en sus aspectos centrales, dejando solo la creación de cuentas de médico desde el admin como pendiente menor para el Sprint 3.

#### Reunión 5 — Martes, semana 3

En la quinta reunión, Ignacio confirmó tener cableada la navegación al meetingLink desde ambos dashboards. James se concentró en la limpieza del seed agregando más médicos y especialidades para tener variedad en la demo. Vicente avanzó la primera versión del componente ReservaCita.tsx con el layout de tres pasos. Se programó una sesión informal el miércoles por la tarde para integración cruzada en formato remoto.

#### Reunión 6 — Viernes, semana 3

En la sexta reunión, Ignacio comentó haber apoyado a Vicente en la depuración de un problema con la pantalla de éxito del ReservaCita. James reportó haber apoyado las pruebas integrales del flujo. Vicente reportó tener cerrado el ReservaCita y avanzada la primera mitad del DashboardMedico. El equipo acordó que el martes de la última semana se haría una primera pasada de demo completa para detectar problemas con tiempo.

#### Reunión 7 — Martes, semana 4

En la séptima reunión, el equipo ejecutó la primera demo completa del flujo end-to-end durante el bloque, partiendo desde el registro de un nuevo paciente hasta el ingreso simultáneo de ambos a la sala de videollamada. La demo se ejecutó sin errores en el flujo principal. Vicente confirmó tener cerrado el DashboardMedico con todas las secciones funcionales. Ignacio reportó avance significativo en la documentación de cierre. James completó la documentación de los endpoints en el README del backend.

#### Reunión 8 — Viernes, semana 4

En la octava reunión, previa a la Sprint Review, el equipo confirmó que toda la documentación de cierre estaba terminada, que la base de datos seed estaba en estado óptimo y que el pulido visual final estaba terminado. Se acordó que la Sprint Review se realizaría inmediatamente después de esta reunión, dentro del mismo bloque de clase, y que la Sprint Retrospective se realizaría al cierre de la Sprint Review en formato cerrado entre los tres integrantes.

### 15.3 Patrones observados durante el sprint

Al revisar las ocho reuniones en conjunto se observan algunos patrones que vale la pena destacar. El equipo aprovechó consistentemente los espacios entre reuniones para trabajar de forma asincrónica, lo cual permitió mantener el ritmo de avance pese a la limitada cantidad de tiempo presencial. Los bloqueos identificados durante los dailies se resolvieron casi todos dentro del mismo bloque de clase o, a más tardar, en la sesión informal del miércoles, evitando que se acumularan hacia el siguiente daily. La rotación de la palabra en orden alfabético funcionó bien como mecanismo neutral, evitando discusiones sobre quién comienza la ronda.

## 16. Sprint 2 — Entregables Técnicos

Esta sección describe los bocetos e interfaces que conforman los entregables técnicos del Sprint 2, organizados según las dos historias de usuario que dieron origen a los productos comprometidos. Cada entregable se documenta a partir del componente real implementado en el código fuente del proyecto, referenciando los archivos donde reside cada pieza y describiendo la estructura visual, los elementos interactivos y los estados que el usuario puede observar durante su interacción con la plataforma.

### 16.1 Producto-1 — Interfaz de Registro e Inicio de Sesión (HU3)

El primer producto técnico entregable corresponde al módulo completo de autenticación, conformado por dos pantallas principales que comparten una identidad visual coherente, esto es, la pantalla de Login y la pantalla de Register. Ambas piezas están construidas con React, TypeScript y TailwindCSS, residiendo en los archivos frontend/src/components/auth/Login.tsx y frontend/src/components/auth/Register.tsx respectivamente.

#### Pantalla de Inicio de Sesión

La pantalla de Login.tsx ocupa la totalidad del viewport con un fondo de color casi negro (#0A0F1C), sobre el cual se aplican dos gradientes circulares desenfocados, uno ubicado en la esquina superior izquierda con tonalidad emerald y otro en la esquina inferior derecha con tonalidad cyan, ambos con efecto blur de alta intensidad que produce un brillo difuso. El gradiente superior posee además una animación pulse sutil, generando una sensación de respiración visual que mantiene la pantalla viva durante la espera del usuario.

En el centro del viewport se ubica un contenedor principal con ancho máximo de aproximadamente cuatrocientos píxeles, fondo blanco translúcido con efecto glassmorphism, borde sutil y sombra profunda. Este contenedor presenta esquinas redondeadas con radio amplio, generando una pieza visualmente flotante sobre el fondo oscuro.

En la parte superior del contenedor se ubica un ícono circular con gradiente de emerald a cyan, conteniendo el ícono HeartPulse de Lucide React en color blanco, simbolizando el latido vital de la plataforma de salud. Bajo el ícono aparece el título principal con la leyenda Bienvenido de vuelta en tipografía grande, seguido del subtítulo Tu salud conectada desde cualquier lugar en tipografía gris suave.

El formulario incluye dos campos verticales. El primer campo es el Correo Electrónico, con un ícono de Mail posicionado a la izquierda dentro del propio campo, fondo translúcido, borde sutil y placeholder de ejemplo juan@ejemplo.com. El input cambia de color en el ícono lateral cuando el usuario hace focus, transicionando del gris al emerald.

El segundo campo es la Contraseña, manteniendo la misma estructura visual del campo anterior, pero con un ícono de Lock a la izquierda y placeholder de ocho puntos suspensivos. Ambos campos poseen efectos de focus con ring de color emerald translúcido.

Bajo el formulario se ubica el botón principal de envío, ocupando todo el ancho del contenedor, con fondo de gradiente emerald a cyan, texto blanco, sombra de color emerald translúcida y un efecto de escala al hacer clic. Cuando la petición está en curso, el botón muestra un ícono Loader2 girando en lugar del texto y la flecha de envío.

Al pie del contenedor se incluye un mensaje de invitación al registro, con el texto No tienes una cuenta? seguido de un botón en línea con la leyenda Regístrate aquí en color emerald, el cual cambia la vista al componente Register.tsx al ser presionado.

#### Pantalla de Registro

La pantalla de Register.tsx mantiene la misma identidad visual del Login, pero con algunos ajustes para acomodar los campos adicionales que requiere la creación de una nueva cuenta. El contenedor principal tiene un ancho ligeramente mayor y un padding vertical adicional para acomodar las cuatro entradas del formulario.

Los gradientes de fondo invierten su posición respecto al Login, ubicándose el cyan en la esquina superior derecha y el emerald en la esquina inferior izquierda, generando una sensación de variación entre ambas pantallas. El ícono superior también invierte el gradiente, yendo de cyan a emerald.

El título principal cambia a Crea tu cuenta con el subtítulo Únete a mediCampo y recibe atención donde estés, alineando el copy con el valor central del producto, esto es, llevar atención médica a zonas rurales.

El formulario presenta cuatro campos en orden secuencial. El primero es el Nombre Completo con un ícono User a la izquierda. El segundo es el RUT con un ícono FileText a la izquierda, junto con un placeholder 12345678-9 para guiar el formato esperado. El tercero es el Correo Electrónico con un ícono Mail. El cuarto es la Contraseña con un ícono Lock.

Todos los campos usan el mismo patrón visual de focus con ring cyan translúcido. El botón principal sigue el mismo patrón del Login, pero invirtiendo el gradiente del fondo. Al pie del contenedor aparece la invitación inversa, con el texto Ya tienes cuenta? seguido del botón Inicia Sesión aquí en color cyan.

El flujo de registro incluye una lógica especial al obtener una respuesta exitosa del endpoint POST /api/auth/register, ya que automáticamente ejecuta un segundo llamado al endpoint POST /api/auth/login con las mismas credenciales recién creadas, permitiendo que el usuario quede autenticado sin necesidad de ingresar nuevamente sus datos. Esta optimización mejora la conversión inicial y reduce la fricción para el paciente rural.

### 16.2 Producto-2 — Interfaz de Reserva y Videollamada (HU4)

El segundo producto técnico entregable corresponde al módulo completo de reserva y gestión de teleconsultas, conformado por tres pantallas principales que cubren los tres roles activos del flujo, esto es, la pantalla de Reserva desde la perspectiva del paciente, el Dashboard del Médico para aceptar o rechazar solicitudes y el Dashboard del Paciente para visualizar el estado de sus citas. Adicionalmente, ambos roles convergen en el componente de Videollamada cuando la cita está confirmada.

Las pantallas residen en los archivos frontend/src/components/ReservaCita.tsx, frontend/src/components/dashboards/DashboardMedico.tsx y frontend/src/components/dashboards/DashboardPaciente.tsx. La paleta visual cambia respecto al Producto-1, usando ahora fondos claros con acentos azules, verdes y amarillos según el estado de las citas.

#### Pantalla de Reserva de Cita

El componente ReservaCita.tsx presenta un layout dividido en tres pasos claramente diferenciados visualmente, ocupando el ancho completo de la pantalla con un máximo de aproximadamente mil píxeles centrados. El fondo principal es blanco con paddings amplios y separación generosa entre secciones.

En la parte superior se ubica el header con el título Agendar Teleconsulta y el subtítulo Selecciona al especialista y el horario que mejor te acomode en tipografía gris suave.

El primer paso ocupa la columna izquierda del layout (un tercio del ancho en desktop) y muestra una lista vertical de tarjetas de especialistas. Cada tarjeta presenta el nombre del médico, su especialidad asociada con un ícono Stethoscope a la izquierda, y un avatar circular con un ícono UserIcon que cambia de color cuando la tarjeta está seleccionada. Las tarjetas no seleccionadas tienen borde gris suave y fondo blanco, mientras que la tarjeta seleccionada tiene borde azul, fondo azul translúcido y un leve efecto de escala que la hace destacar visualmente.

Mientras la lista está cargando desde el endpoint GET /api/appointments/doctors, aparecen tres tarjetas placeholder con animación pulse. Si no hay médicos disponibles, aparece un mensaje centrado con el ícono Stethoscope en gris suave y el texto No hay doctores disponibles.

El segundo y tercer paso comparten la columna derecha del layout (dos tercios del ancho en desktop), dentro de una caja blanca con borde sutil, esquinas redondeadas y sombra ligera. La caja se divide internamente en dos columnas, la primera para la selección de la fecha mediante un input nativo de tipo date con un mínimo establecido en el día actual, y la segunda para la selección del horario mediante una cuadrícula de botones con los seis bloques disponibles, esto es, 09:00, 10:00, 11:30, 14:00, 15:30 y 17:00.

Los botones de horario están deshabilitados hasta que el usuario haya seleccionado una fecha. El botón seleccionado tiene fondo azul, texto blanco, sombra azul translúcida y un efecto de escala que lo destaca claramente sobre los demás botones, que mantienen fondo gris muy claro con texto gris oscuro y borde gris suave.

En la parte inferior de la caja se ubica una franja horizontal con el mensaje contextual que cambia según el avance del flujo. Si no se ha seleccionado un especialista, dice Comienza seleccionando un especialista. Si no se ha seleccionado fecha, dice Selecciona una fecha en el calendario. Si no se ha seleccionado horario, dice Elige tu bloque horario. Cuando todo está completo, aparece el mensaje Todo listo para confirmar en color emerald con un ícono CheckCircle2 a la izquierda, junto con el botón Confirmar Reserva habilitado a la derecha.

Al completarse exitosamente la reserva, la pantalla cambia al estado de éxito, mostrando una caja centrada con un ícono CheckCircle2 grande en color emerald, el título Solicitud Enviada, junto con el mensaje informativo. Más abajo, en color azul, aparece la indicación Podrás entrar una vez el médico acepte la cita, dejando claro al paciente que aún debe esperar la confirmación.

#### Pantalla del Dashboard Médico

El componente DashboardMedico.tsx presenta un layout dividido en dos columnas principales, con un header superior y una franja de estadísticas resumidas. El fondo es blanco con cajas internas que tienen sombras suaves y esquinas redondeadas.

El header muestra el título Panel Médico seguido del nombre del médico en color emerald. Bajo el header se ubica una franja de cuatro cajas resumen con un ícono representativo, un valor numérico grande y una etiqueta descriptiva en cada una, esto es, Consultas Hoy (ícono Clock en azul), Por Aprobar (ícono HeartPulse en amarillo), Completadas (ícono CheckCircle2 en emerald) y Próximas (ícono Calendar en púrpura).

La columna izquierda contiene dos secciones apiladas verticalmente. La primera sección es Consultas de Hoy, mostrando las citas confirmadas del día con el botón Iniciar a la derecha que ejecuta navigate al meetingLink correspondiente. La segunda sección es Solicitudes Pendientes, mostrando las citas en estado PENDING con dos botones de acción, esto es, un botón con fondo emerald y un ícono Check en blanco para aceptar, y un botón con fondo blanco y borde rojo con un ícono X en rojo para rechazar.

La columna derecha contiene dos secciones apiladas también verticalmente. La primera es Próximas Citas Confirmadas mostrando las citas futuras en orden cronológico. La segunda es Atenciones Recientes mostrando las cinco citas más recientes con estado COMPLETED, con enlace directo al historial clínico de cada paciente.

Cuando el médico acepta una cita programada para el día actual, aparece un cuadro de diálogo nativo del navegador con el mensaje Cita aceptada para hoy. Deseas ingresar a la sala de video ahora?, ofreciendo navegación directa al componente Videollamada.tsx si el médico confirma.

#### Pantalla del Dashboard Paciente

El componente DashboardPaciente.tsx presenta un layout similar al del médico pero con énfasis en la próxima cita y un botón prominente para agendar una nueva teleconsulta. El header muestra la bienvenida personalizada con el primer nombre del paciente en un gradiente de azul a índigo.

A la derecha del header se ubica el botón Agendar Teleconsulta con fondo azul, texto blanco, ícono CalendarPlus a la izquierda y un efecto de elevación al hacer hover. Este botón es el llamado a la acción principal de la pantalla.

Bajo el header se ubica la sección Tu Agenda Próxima dentro de una caja blanca grande con esquinas redondeadas con radio aún mayor. Las tarjetas de cita tienen un diseño diferenciado según el estado, esto es, las tarjetas PENDING tienen fondo amarillo translúcido con borde amarillo punteado y un badge con el texto Esperando Médico, mientras que las tarjetas CONFIRMED tienen fondo blanco con borde sutil y un badge verde con el texto Confirmada.

Cada tarjeta muestra una sección lateral izquierda con la fecha destacada, junto con la información del médico, su especialidad y el botón de acción. Si la cita está pendiente, no aparece botón. Si la cita está confirmada, aparece el botón Ingresar a la Sala con fondo emerald, texto blanco y un ícono Video a la izquierda.

Cuando no hay citas próximas, aparece un mensaje centrado dentro de un recuadro punteado con el ícono HeartPulse grande en gris claro y el texto No tienes teleconsultas agendadas actualmente.

#### Componente de Videollamada (punto de convergencia)

Una vez que la cita ha sido confirmada y cualquiera de los dos usuarios presiona su respectivo botón de ingreso, ambos convergen en el mismo componente Videollamada.tsx. El componente carga inicialmente la pantalla PreFlightCheck para verificar el acceso al hardware del usuario, luego solicita el token de LiveKit al endpoint correspondiente, y finalmente renderiza el LiveKitRoom con la URL del servidor y el token obtenido.

La interfaz presenta un encabezado superior con un escudo y la leyenda Cifrado Militar, junto con el indicador de calidad de red en tiempo real. El cuerpo principal muestra el GridLayout con los ParticipantTile de cada usuario conectado. Los controles inferiores incluyen los botones de Mic, Cámara y Colgar. A la derecha de la sala se ubica un panel lateral que cambia su contenido según el rol del usuario, mostrando la ficha clínica si es DOCTOR o la información del médico y el chat si es PATIENT.

### 16.3 Mapa de navegación entre los componentes

Para facilitar la comprensión del flujo completo, a continuación se sintetiza el camino que recorre cada rol dentro del sistema.

El paciente parte desde Login.tsx o Register.tsx, llega al DashboardPaciente.tsx, presiona Agendar Teleconsulta y entra a ReservaCita.tsx donde elige especialista, fecha y horario. Tras confirmar, regresa al dashboard donde su nueva cita aparece con badge amarillo de Esperando Médico. Una vez que el médico la acepta, el badge cambia a verde Confirmada y aparece el botón Ingresar a la Sala que lo lleva al componente Videollamada.tsx.

El médico parte desde Login.tsx, llega al DashboardMedico.tsx donde ve las solicitudes pendientes, presiona el botón de aceptación verde para una solicitud específica, confirma el cuadro de diálogo si la cita es para hoy y entra automáticamente al componente Videollamada.tsx, donde se encuentra con el paciente esperando dentro de la misma sala identificada por el meetingLink único.

### 16.4 Archivos del repositorio que conforman los entregables

Para verificación directa en el código, los archivos exactos involucrados en los entregables del Sprint 2 son los siguientes.

Para el Producto-1 (Autenticación): frontend/src/components/auth/Login.tsx, frontend/src/components/auth/Register.tsx, frontend/src/context/AuthContext.tsx, frontend/src/App.tsx, backend/src/controllers/authController.ts, backend/src/services/AuthService.ts, backend/src/repositories/UserRepository.ts, backend/src/routes/authRoutes.ts, backend/src/config/jwt.ts y backend/prisma/schema.prisma con el modelo User.

Para el Producto-2 (Reserva y Videollamada): frontend/src/components/ReservaCita.tsx, frontend/src/components/dashboards/DashboardPaciente.tsx, frontend/src/components/dashboards/DashboardMedico.tsx, frontend/src/components/Videollamada.tsx, frontend/src/components/PreFlightCheck.tsx, backend/src/controllers/appointmentController.ts, backend/src/services/AppointmentService.ts, backend/src/repositories/AppointmentRepository.ts, backend/src/routes/appointmentRoutes.ts, backend/src/controllers/livekitController.ts, backend/src/services/LiveKitService.ts y backend/prisma/schema.prisma con los modelos Specialty y Appointment.

## 17. Sprint 2 — Fase 3 de Scrum: Resultados de la Revisión del Sprint 2

### 17.1 Síntesis ejecutiva del Sprint 2

El Sprint 2 cerró cumpliendo de manera satisfactoria su objetivo principal, esto es, habilitar el ciclo completo de acceso y agendamiento de teleconsultas dentro de la plataforma. De las diecisiete tareas técnicas comprometidas inicialmente, el equipo logró cerrar quince dentro del periodo, dejando dos pendientes como mejoras incrementales que se trasladaron al Sprint 3 sin afectar el funcionamiento general del flujo.

A nivel de productos entregados, el sprint produjo dos piezas verificables y demostrables. El Producto-1 corresponde al módulo de autenticación con registro, inicio de sesión, persistencia de sesión y protección de rutas por rol. El Producto-2 corresponde al módulo de reserva de teleconsultas con aceptación o rechazo por parte del médico y habilitación del botón de ingreso a la videollamada en ambas vistas. Ambos productos quedaron integrados con el componente de videollamada construido previamente, cerrando el flujo de extremo a extremo de la consulta médica virtual.

### 17.2 Resultados detallados de la HU3

La historia HU3 quedó completada en sus aspectos centrales, con los siete tareas técnicas comprometidas terminadas y todos los criterios de aceptación principales verificados durante la demostración interna y externa. La autenticación funciona correctamente para los tres roles del sistema, aunque actualmente los médicos y administradores solo pueden ser creados mediante el script seed.ts, situación que se planificó como mejora para el Sprint 3.

Criterios de aceptación verificados: el sistema permite el registro de un nuevo usuario completando los cuatro campos requeridos, valida que el correo y el RUT sean únicos, almacena la contraseña cifrada con bcryptjs, genera un token JWT firmado al iniciar sesión, persiste el token en localStorage permitiendo que la sesión sobreviva a recargas, y las rutas protegidas redirigen al login si el token no existe o si el rol no coincide.

Tarea pendiente derivada al Sprint 3: la creación de cuentas de médico desde el panel administrativo quedó pendiente, dado que actualmente los profesionales solo pueden ser cargados mediante el script seed.

### 17.3 Resultados detallados de la HU4

La historia HU4 quedó completada en sus aspectos críticos, con las diez tareas técnicas comprometidas terminadas y todos los criterios de aceptación esenciales verificados. El paciente puede reservar, el médico puede aceptar o rechazar, ambos pueden ingresar a la videollamada cuando la cita está confirmada y el sistema mantiene la trazabilidad completa de la cita en la base de datos.

Criterios de aceptación verificados: el paciente accede al módulo de reserva, ve la lista real de médicos obtenida desde la API junto con sus especialidades, confirma la reserva creando una cita en estado PENDING con meetingLink único, recibe la pantalla de confirmación visual, el médico ve las solicitudes pendientes en su dashboard, acepta o rechaza mediante los botones correspondientes actualizando el estado a CONFIRMED o CANCELLED, el sistema despliega un cuadro de diálogo cuando la cita es para hoy ofreciendo ingreso inmediato, el paciente ve actualizada la tarjeta con el badge correcto y el botón habilitado, y ambos usuarios convergen en la misma sala identificada por el meetingLink.

Tareas pendientes derivadas al Sprint 3: la validación estricta de choques de horarios entre citas del mismo médico, y la obtención dinámica de los bloques horarios desde la base de datos en lugar de tenerlos hardcodeados en el frontend.

### 17.4 Evidencia del Producto-1

El Producto-1 quedó representado por el conjunto de componentes y endpoints que habilitan el registro e inicio de sesión. Las pruebas manuales realizadas y exitosas incluyen el registro de un nuevo paciente con datos válidos, el registro con email duplicado generando el error esperado, el registro con RUT duplicado generando el error esperado, el inicio de sesión con credenciales válidas, el inicio de sesión con contraseña incorrecta generando el error esperado, la persistencia de la sesión tras recargar la página, el cierre de sesión limpiando localStorage, el intento de acceso a ruta protegida sin sesión redirigiendo al login, y el intento de acceso a ruta protegida con rol incorrecto redirigiendo a la página principal.

Métricas relevantes: 8 archivos modificados en frontend, 6 archivos en backend, 1 archivo de migración Prisma, aproximadamente 600 líneas de código y 31 horas de trabajo distribuidas.

### 17.5 Evidencia del Producto-2

El Producto-2 quedó representado por el conjunto de componentes y endpoints que habilitan la reserva, la aceptación y el ingreso a la videollamada. Las pruebas manuales realizadas y exitosas incluyen la reserva exitosa de cita con fecha futura, la reserva exitosa de cita para el día actual, la visualización con badge PENDING en el dashboard del paciente, la visualización de la solicitud en el dashboard del médico, la aceptación de la solicitud, el cambio del badge a CONFIRMED, el ingreso del paciente a la sala, el ingreso del médico a la sala, el encuentro simultáneo de ambos usuarios dentro de la misma sala, el rechazo de una solicitud cambiando el estado a CANCELLED, y la desaparición de la cita rechazada de la sección de próximas en el dashboard del paciente.

Métricas relevantes: 4 archivos modificados en frontend, 8 archivos en backend, 1 archivo de migración Prisma, aproximadamente 1100 líneas de código y 48 horas de trabajo distribuidas.

### 17.6 Métricas globales del Sprint 2

Total de tareas técnicas comprometidas inicialmente: 17. Total de tareas técnicas completadas dentro del periodo: 15. Total de tareas diferidas al Sprint 3: 2. Porcentaje de cumplimiento del Sprint Backlog: aproximadamente 88 por ciento. Total de horas estimadas inicialmente: 79 horas. Capacidad total estimada del equipo: 90 horas. Margen disponible al iniciar: 11 horas. Margen efectivamente utilizado en imprevistos: aproximadamente 8 horas.

### 17.7 Validación del cumplimiento del Objetivo del Sprint

Para verificar formalmente el cumplimiento del objetivo, el equipo ejecutó una validación de extremo a extremo durante la última semana, simulando el flujo completo desde la perspectiva de un usuario externo. La validación cubrió los siete pasos secuenciales del flujo, esto es, registrar un nuevo paciente, navegar al dashboard, acceder a la reserva, completar y confirmar la cita, cerrar sesión, iniciar sesión como médico, aceptar la solicitud, cerrar sesión, iniciar sesión nuevamente como paciente, ingresar a la sala y, finalmente, simular la entrada simultánea de ambos. Todos los pasos resultaron exitosos, confirmando que el objetivo del sprint quedó plenamente alcanzado.

## 18. Sprint 2 — Sprint Review

### 18.1 Asistentes a la Sprint Review

Por parte del equipo de desarrollo asistieron los tres integrantes, esto es, Vicente Ramirez en su rol de líder de frontend y encargado principal de la demostración visual, James Honeymann en su rol de líder de backend y encargado de responder preguntas técnicas, e Ignacio Ampuero en su rol de Scrum Master ad-hoc y encargado de la moderación general. Por parte de los stakeholders asistieron la profesora titular de la asignatura junto con sus ayudantes, en su calidad de evaluadores externos.

### 18.2 Estructura de la presentación

La presentación se diseñó para ocupar aproximadamente cuarenta minutos del bloque de clase, distribuyendo el tiempo entre seis secciones secuenciales, esto es, el recordatorio del objetivo y del alcance del sprint, la demostración en vivo del flujo end-to-end, la explicación técnica de los componentes principales, las métricas y el estado de cumplimiento, las tareas pendientes y el plan para el siguiente sprint, y finalmente el espacio de preguntas y retroalimentación abierta.

### 18.3 Demostración en vivo del flujo end-to-end

Vicente Ramirez tomó el control de la presentación para realizar la demostración en vivo, conectando su computador al proyector y abriendo dos navegadores en paralelo, uno con sesión de paciente y otro con sesión de médico, permitiendo así mostrar el flujo desde ambas perspectivas simultáneamente.

La demostración cubrió los siguientes pasos secuenciales: registro de un nuevo paciente desde Register.tsx con auto-login posterior, navegación al DashboardPaciente.tsx para verificar la bienvenida personalizada, acceso a ReservaCita.tsx con la lista de tres médicos de distintas especialidades, selección de un médico junto con fecha y horario para el día actual, confirmación de la reserva con pantalla de éxito, cambio al segundo navegador con sesión de médico para mostrar la nueva solicitud pendiente, aceptación de la solicitud mediante el botón verde, confirmación del cuadro de diálogo para ingresar a la sala, ingreso al PreFlightCheck con verificación de cámara y micrófono, regreso al primer navegador con sesión de paciente para mostrar el cambio del badge a Confirmada y la aparición del botón Ingresar a la Sala, ingreso del paciente a la sala mediante el botón, encuentro simultáneo de ambos participantes dentro del mismo LiveKitRoom con video y audio bidireccionales funcionando correctamente.

### 18.4 Explicación técnica de los componentes

James Honeymann tomó la palabra para explicar las piezas técnicas que sustentan el flujo demostrado, mostrando el archivo schema.prisma con los tres modelos clave (User, Specialty, Appointment), los seis endpoints REST implementados, junto con el uso de bcryptjs para cifrado, jsonwebtoken para firma de tokens y la validación de propiedad en el endpoint PATCH.

Ignacio Ampuero complementó describiendo la integración con LiveKit, mostrando cómo el meetingLink generado al crear la cita se convierte en el roomId de la sala virtual, cómo el endpoint /api/livekit/token valida que el usuario tenga efectivamente una cita asignada antes de entregar el token JWT firmado, y cómo este mecanismo asegura que ningún tercero pueda colarse a una sala simplemente conociendo el roomId.

### 18.5 Retroalimentación recibida durante la Sprint Review

La cátedra evaluadora entregó retroalimentación valiosa que el equipo recogió íntegramente para considerar en la planificación del Sprint 3. A continuación se sintetizan los comentarios recibidos, agrupados por área temática.

Sobre la calidad visual de las interfaces: la cátedra valoró positivamente la calidad estética de las pantallas mostradas, destacando especialmente la coherencia visual entre el Login y el Register, junto con el uso de gradientes y efectos sutiles que generan una sensación moderna y profesional. Asimismo, se reconoció el cuidado en la diferenciación visual de los estados de las tarjetas de citas en los dashboards. Como mejora sugerida, recomendaron revisar el contraste de algunos elementos secundarios, especialmente en pantallas de dispositivos móviles, donde los textos en gris claro podrían resultar difíciles de leer para personas con baja agudeza visual.

Sobre la robustez del flujo de aceptación: la cátedra preguntó qué ocurre si el médico rechaza una solicitud, observando que en la demostración solo se mostró el escenario de aceptación. Vicente respondió mostrando en vivo el flujo de rechazo. Como mejora sugerida, recomendaron implementar una notificación explícita al paciente cuando su cita es rechazada, de modo que sepa que debe agendar nuevamente sin tener que descubrirlo por inferencia visual.

Sobre la seguridad del sistema: la cátedra preguntó cómo se asegura que un usuario malicioso no pueda colarse a una sala conociendo simplemente el meetingLink. Ignacio respondió explicando el doble mecanismo de validación, esto es, el endpoint del token verifica la pertenencia y el servidor de LiveKit verifica la firma. La cátedra valoró positivamente la respuesta, sugiriendo además incorporar en futuros sprints una funcionalidad de auditoría que registre los intentos de acceso fallidos.

Sobre la experiencia de uso del paciente rural: la cátedra preguntó si el equipo había validado el flujo con usuarios reales del segmento objetivo. El equipo reconoció honestamente que aún no se ha realizado validación con usuarios reales. Como mejora sugerida, recomendaron incorporar pruebas de usabilidad con al menos dos usuarios externos al equipo antes del cierre del proyecto.

Sobre la documentación técnica: la cátedra valoró positivamente la profundidad de la documentación interna del proyecto. Como mejora sugerida, recomendaron incorporar diagramas visuales que complementen la documentación textual, facilitando la comprensión para nuevos miembros del equipo o evaluadores externos.

Sobre el cumplimiento del objetivo del sprint: la cátedra confirmó verbalmente que el objetivo del Sprint 2 se considera plenamente cumplido, destacando que el flujo end-to-end demostrado en vivo evidencia el cierre del bucle paciente-médico de forma operativa y demostrable.

### 18.6 Compromisos asumidos por el equipo tras la Sprint Review

Tras recibir la retroalimentación, el equipo asumió de forma explícita los siguientes compromisos para incorporar en la planificación del Sprint 3.

Primero, revisar el contraste de los elementos secundarios en pantallas móviles durante la fase de pulido visual, especialmente en los textos en gris claro.

Segundo, implementar la notificación al paciente cuando su cita es rechazada por el médico, alineando esta mejora con la HU5 de notificaciones automáticas.

Tercero, evaluar la incorporación de un sistema de auditoría básico para los intentos de acceso indebido a las salas de videollamada, como parte del refuerzo del panel administrativo.

Cuarto, programar al menos una sesión de pruebas de usabilidad con usuarios externos al equipo durante el Sprint 3, considerando perfiles más cercanos al usuario objetivo.

Quinto, incorporar al menos un diagrama visual de arquitectura general dentro de la documentación del proyecto, facilitando la comprensión para evaluadores y nuevos integrantes potenciales.

## 19. Sprint 2 — Fase 4 de Scrum: Sprint Retrospective

### 19.1 Marco general de la retrospectiva

La Sprint Retrospective se realizó inmediatamente después de la Sprint Review, en formato cerrado entre Vicente Ramirez, James Honeymann e Ignacio Ampuero, con una duración aproximada de cuarenta minutos. El equipo eligió mantener la estructura clásica de tres preguntas, esto es, qué hicimos bien y queremos seguir haciendo, qué no funcionó tan bien y queremos dejar de hacer, qué queremos empezar a probar para el siguiente sprint.

### 19.2 Qué cosas hicimos bien

La distribución por afinidad técnica funcionó muy bien, ya que cada integrante pudo concentrarse en el área donde se siente más cómodo y productivo, reduciendo el tiempo de aprendizaje sobre tecnologías nuevas y permitiendo que cada uno avanzara a buen ritmo en sus tareas asignadas.

La estructura de los Daily Scrum dentro de los bloques de clase resultó ser una decisión acertada, ya que aprovechó tiempos que ya estaban reservados para la asignatura, evitando agregar reuniones adicionales fuera del horario académico.

La planificación inicial con estimación detallada por tarea y por integrante, realizada durante el Sprint Planning, demostró ser muy útil para mantener el foco durante el sprint y facilitar la toma de decisiones cuando surgieron pequeños desvíos del plan original.

La definición temprana del meetingLink como punto de conexión entre la reserva y la videollamada resultó ser una decisión arquitectónica muy acertada, ya que permitió que las distintas piezas del flujo se construyeran de forma desacoplada pero convergente.

La trazabilidad escrita de los Daily Scrum permitió retomar el contexto fácilmente entre una reunión y otra, especialmente cuando algún integrante no pudo asistir presencialmente.

### 19.3 Qué cosas no funcionaron tan bien

La integración entre frontend y backend se realizó algo tarde dentro del sprint, lo cual generó algún retrabajo cuando se descubrieron incompatibilidades menores en el formato de los datos retornados por la API.

La comunicación asincrónica por mensajería instantánea durante los fines de semana fue útil pero a veces se diluyó cuando alguien hacía una pregunta y los otros no respondían pronto, generando horas perdidas por bloqueos no resueltos a tiempo.

La validación manual del flujo end-to-end se hizo solo durante la última semana, lo cual implicó cierto riesgo si hubieran aparecido problemas grandes en ese momento.

Algunas tareas quedaron con estimaciones algo optimistas, especialmente las del frontend, donde Vicente tuvo que invertir más horas de las planificadas en pulir detalles visuales y ajustes responsive.

El equipo no documentó suficientemente los criterios de aceptación específicos por tarea al inicio del sprint, dejando algunos puntos como entendimiento implícito entre los integrantes.

### 19.4 Qué cosas queremos probar para el siguiente sprint

Implementar un contrato explícito de los endpoints REST antes de comenzar el desarrollo de cada historia de usuario, documentando los payloads de entrada, las respuestas esperadas y los códigos de error posibles.

Programar al menos una sesión de validación integral durante la segunda semana del sprint, en lugar de esperar hasta la última semana.

Acordar de manera explícita los horarios de disponibilidad por mensajería durante los fines de semana, evitando bloqueos por espera de respuesta.

Agregar un colchón explícito de pulido visual y de pruebas integrales al final de cada sprint, equivalente al diez por ciento del tiempo total estimado.

Documentar los criterios de aceptación específicos por tarea desde el inicio del sprint, dentro del propio Sprint Backlog.

Incorporar al menos un diagrama visual de arquitectura general dentro de la documentación del proyecto.

### 19.5 Acciones concretas comprometidas para el Sprint 3

Acción uno: Ignacio Ampuero se compromete a redactar el contrato de endpoints REST para las historias seleccionadas del Sprint 3, antes del inicio del primer Daily Scrum del nuevo sprint.

Acción dos: James Honeymann se compromete a moderar la sesión de validación integral durante la segunda semana del Sprint 3, llevando un guion previamente preparado.

Acción tres: Vicente Ramirez se compromete a incorporar el colchón de pulido visual desde la planificación del Sprint 3.

Acción cuatro: Ignacio Ampuero se compromete a coordinar la creación del primer diagrama de arquitectura general durante las dos primeras semanas del Sprint 3.

Acción cinco: los tres integrantes se comprometen a compartir su disponibilidad de fin de semana durante cada Daily Scrum del viernes.

Acción seis: los tres integrantes se comprometen a incluir los criterios de aceptación específicos por cada tarea técnica desde la elaboración del Sprint Backlog del Sprint 3.

### 19.6 Mejoras en la Experiencia de Usuario basadas en el feedback de la Cátedra 1

Esta sección recoge específicamente las mejoras en la experiencia de usuario que el equipo se compromete a implementar, basándose tanto en la retroalimentación recibida durante la Cátedra 1 como en las observaciones surgidas en la Sprint Review del Sprint 2. La inclusión de esta sección es una exigencia explícita de la rúbrica de evaluación y refleja la importancia que la cátedra otorga a la dimensión de usabilidad dentro del proyecto.

Mejora 1 — Contraste y legibilidad en pantallas móviles. Durante la Cátedra 1 se recibió retroalimentación sobre la dificultad de lectura de algunos textos secundarios en dispositivos móviles, especialmente aquellos en tonalidades grises claras sobre fondos también claros. El equipo se compromete a revisar todas las pantallas del sistema durante el Sprint 3 para ajustar el contraste de los elementos secundarios, aplicando como referencia los lineamientos de accesibilidad WCAG 2.1 nivel AA, esto es, una proporción mínima de contraste de 4.5 a 1 para texto normal y 3 a 1 para texto de mayor tamaño.

Mejora 2 — Mensajes claros y sin tecnicismos. Durante la Cátedra 1 se identificó que algunos mensajes de error eran demasiado técnicos para un usuario rural con baja alfabetización digital. El equipo se compromete a revisar todos los mensajes de error del sistema durante el Sprint 3, reemplazándolos por versiones más comprensibles que expliquen al usuario qué pasó y qué puede hacer para resolverlo, evitando términos como token expirado, JWT inválido o error 401 que no aportan información útil al usuario final.

Mejora 3 — Confirmaciones visuales claras en cada paso del flujo. Durante la Cátedra 1 se observó que algunos pasos críticos del flujo carecían de retroalimentación visual suficiente, dejando al usuario con la duda de si la acción que acaba de ejecutar tuvo efecto o no. El equipo se compromete a incorporar confirmaciones visuales explícitas en todos los puntos críticos del flujo durante el Sprint 3, especialmente en las acciones de guardar ficha clínica, agendar cita y cerrar sesión, usando ya sea modales de confirmación, toasts informativos o cambios de estado visibles.

Mejora 4 — Notificación al paciente cuando su cita es rechazada. Durante la Sprint Review del Sprint 2 surgió la observación de que el paciente no recibe ninguna comunicación explícita cuando el médico rechaza su solicitud de cita, dejándolo en una situación donde debe descubrir por inferencia visual que su cita no será atendida. El equipo se compromete a implementar durante el Sprint 3 una notificación visual explícita en el dashboard del paciente, junto con un mensaje claro que le indique que puede intentar agendar con otro médico o en otro horario.

Mejora 5 — Pruebas de usabilidad con usuarios externos al equipo. Durante la Sprint Review del Sprint 2 se sugirió que el equipo realizara pruebas con usuarios reales del segmento objetivo. El equipo se compromete a programar al menos dos sesiones de prueba con familiares o conocidos que tengan un perfil más cercano al usuario rural, durante el Sprint 3, recogiendo sus impresiones sobre la facilidad de uso del sistema y aplicando las correcciones que surjan como prioritarias.

Mejora 6 — Incorporación de un onboarding inicial. Como complemento de las mejoras anteriores, el equipo evaluará durante el Sprint 3 la incorporación de un onboarding inicial breve que se muestre la primera vez que un usuario acceda al sistema, explicando los conceptos básicos del flujo (cómo agendar, cómo entrar a la sala, dónde encontrar el historial) mediante un wizard simple de tres pasos. Esta mejora responde tanto al feedback recibido como al principio de diseño centrado en el usuario rural que el equipo definió durante el Sprint 0.

### 19.7 Reflexiones finales del equipo

Al cierre de la retrospectiva, los tres integrantes manifestaron su satisfacción general con el resultado del Sprint 2 y con la dinámica de trabajo durante el periodo. Reconocieron que el cumplimiento del ochenta y ocho por ciento del Sprint Backlog es una marca alta, especialmente considerando la carga académica paralela de otras asignaturas. Asimismo, valoraron el clima de colaboración mutuo, la disposición a ayudarse cuando alguien tuvo bloqueos y la transparencia con que cada uno reportó sus avances y dificultades durante los Daily Scrum.

Vicente Ramirez destacó que el sprint le permitió consolidar significativamente sus habilidades en React con TypeScript y TailwindCSS, especialmente en la construcción de componentes complejos como ReservaCita.tsx y DashboardMedico.tsx.

James Honeymann comentó que la experiencia de trabajar con Prisma como ORM le resultó muy productiva, valorando especialmente la sincronización del esquema con la base de datos mediante migraciones declarativas y la integración limpia con TypeScript.

Ignacio Ampuero, en su rol de Scrum Master ad-hoc, reflexionó sobre el desafío de moderar las reuniones manteniendo al equipo enfocado sin entrar él mismo a resolver los problemas técnicos durante el daily, área de mejora personal que se propone trabajar durante el Sprint 3.

El equipo coincidió en que la práctica de la Sprint Retrospective es valiosa no solo para mejorar la dinámica de trabajo, sino también para reforzar el sentido de pertenencia y colaboración entre los integrantes, abriendo un espacio honesto para conversar sobre el proceso. Por consiguiente, se reafirma el compromiso de mantener esta instancia al cierre de cada sprint del proyecto, dejándola como práctica permanente del equipo hasta el cierre del semestre.

---

## Cierre del informe

Este informe consolidado deja constancia del trabajo realizado por el equipo durante los dos primeros sprints del proyecto mediCampo v2, recogiendo tanto el contenido corregido de la Cátedra 1 como el contenido nuevo correspondiente a la Cátedra 2. La documentación se mantiene en formato vivo dentro del repositorio del proyecto, permitiendo su actualización progresiva a medida que avanza el desarrollo durante los sprints posteriores.

Como equipo, esperamos que este documento sirva tanto como evidencia del cumplimiento de los compromisos académicos como guía de referencia para futuros integrantes del proyecto o para cualquier persona externa que desee comprender la trazabilidad completa del trabajo realizado. La construcción de mediCampo v2 ha sido una experiencia formativa significativa para los tres integrantes del equipo, integrando conocimientos de varias áreas de la carrera de Ingeniería Civil Informática dentro de un proyecto con propósito social claro, esto es, acercar la salud a quienes viven más lejos de ella.

## Documentos relacionados dentro del repositorio

Para profundizar en el detalle de los entregables del Sprint 2, los documentos individuales se encuentran disponibles dentro de la carpeta Documentos/sprint2/ del repositorio, incluyendo sprint_backlog_sprint2.md, sprint_planning_sprint2.md, estimacion_compromiso_sprint2.md, daily_scrum_sprint2.md, entregables_tecnicos_sprint2.md, resultados_sprint2.md, sprint_review_sprint2.md y sprint_retrospective_sprint2.md.

Para la documentación complementaria del proyecto, incluyendo los mapas de empatía, el análisis de roles, los casos de uso y los procedimientos técnicos, dirigirse a la carpeta Documentos/informacion_del_proyecto/ y a la carpeta Documentos/implementacion/ del repositorio. La carpeta Documentos/versiones_anteriores/ conserva las versiones previas de los documentos para fines de auditoría histórica.

Equipo: Vicente Ramirez, James Honeymann, Ignacio Ampuero.
Asignatura: Análisis y Modelamiento de Sistemas.
Nivel: 5.
Docente: Magdalena Nieto Gutiérrez.
Fecha de entrega: martes 26 de mayo de 2026 a las 13:00 horas.
