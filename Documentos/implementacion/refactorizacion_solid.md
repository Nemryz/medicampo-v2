# Refactorización de la Arquitectura del Backend bajo Principios SOLID

## 1. Introducción y Contexto

El proyecto mediCampo-v2 es una plataforma de telemedicina que permite la gestión de citas médicas, fichas clínicas y videollamadas en tiempo real. Originalmente, el backend estaba construido con una arquitectura plana donde los controladores concentraban tanto la lógica HTTP como la lógica de negocio y el acceso a datos. Esto generaba código acoplado, difícil de mantener, probar y extender.

Se realizó un análisis de la estructura completa del proyecto, tanto backend como frontend, para determinar si era necesario aplicar una refactorización basada en los principios SOLID en este momento o si era preferible postergarla. La decisión fue ejecutarla de inmediato, dado que el proyecto se encuentra en una etapa temprana de desarrollo donde los cambios son menos costosos y el beneficio a futuro es significativo.

Este documento detalla el análisis realizado, las violaciones identificadas, la nueva arquitectura implementada, los cambios específicos en cada archivo y una fundamentación técnica sobre por qué las funcionalidades existentes, incluyendo videollamada y audio, continúan operando correctamente.

---

## 2. Análisis de Violaciones a Principios SOLID en la Arquitectura Original

### 2.1. Violación del Principio de Responsabilidad Única (S)

Los controladores originales mezclaban múltiples responsabilidades en un mismo archivo. Por ejemplo, authController.ts manejaba registro, login y también contenía lógica de validación de datos, manejo de errores y acceso directo a la base de datos a través de Prisma. Esto viola el principio de responsabilidad única, que establece que una clase o módulo debe tener una sola razón para cambiar.

En el caso de appointmentController.ts, el archivo contenía lógica para crear citas, consultar doctores, actualizar estados, eliminar registros y también generaba enlaces de reunión de forma inline. Cualquier cambio en la lógica de negocio de las citas requería modificar el controlador, y cualquier cambio en la forma de exponer los endpoints también requería modificar el mismo archivo.

### 2.2. Violación del Principio de Abierto/Cerrado (O)

La arquitectura original no permitía extender funcionalidades sin modificar el código existente. Si se necesitaba agregar un nuevo tipo de autenticación, por ejemplo, autenticación por huella digital o por código QR, habría que modificar directamente el controlador de autenticación. No existía una interfaz o abstracción que permitiera añadir nuevas estrategias sin alterar el código ya probado.

### 2.3. Violación del Principio de Segregación de Interfaces (I)

No existían interfaces definidas para los servicios. Los controladores dependían directamente de implementaciones concretas, lo que significa que cualquier cambio en la implementación de un servicio obligaba a modificar el controlador. Tampoco había contratos claros que definieran qué métodos debía exponer cada servicio.

### 2.4. Violación del Principio de Inversión de Dependencias (D)

Los controladores instanciaban directamente las dependencias que necesitaban, como el cliente de Prisma o el generador de tokens JWT. Esto creaba un acoplamiento fuerte entre las capas. Por ejemplo, si se cambiaba la librería de JWT de jsonwebtoken a otra alternativa, habría que modificar todos los archivos que la usaban directamente.

---

## 3. Nueva Arquitectura Implementada

La refactorización reorganizó el backend en cinco capas bien definidas, cada una con una responsabilidad específica y dependencias invertidas.

### 3.1. Capa de Interfaces (interfaces/)

Se crearon interfaces para cada servicio del sistema. Estas interfaces definen contratos claros que las implementaciones deben cumplir. Los controladores ahora dependen de estas interfaces, no de las implementaciones concretas.

Archivos creados:
- IAuthService.ts: Define el contrato para el servicio de autenticación, con los métodos register y login.
- IAppointmentService.ts: Define el contrato para el servicio de citas, con métodos para crear, consultar, actualizar y eliminar citas.
- IClinicalService.ts: Define el contrato para el servicio de fichas clínicas, incluyendo la gestión de historiales y estadísticas.
- ILiveKitService.ts: Define el contrato para el servicio de videollamadas, con el método para obtener tokens de acceso.
- IRepository.ts: Define una interfaz genérica para repositorios, estableciendo operaciones CRUD base.

### 3.2. Capa de Repositorios (repositories/)

Los repositorios encapsulan todo el acceso a la base de datos. Cada repositorio se especializa en una entidad del dominio y contiene únicamente consultas a la base de datos, sin lógica de negocio.

Archivos creados o refactorizados:
- UserRepository.ts: Maneja operaciones de base de datos para usuarios, como búsqueda por email, RUT, ID, y conteo por rol.
- AppointmentRepository.ts: Maneja operaciones de base de datos para citas, incluyendo creación, búsqueda por usuario, por enlace de reunión, y actualización de estados.
- ClinicalRecordRepository.ts: Maneja operaciones de base de datos para fichas clínicas, incluyendo creación o actualización (upsert), búsqueda por cita, e historial de pacientes.

Cada repositorio recibe el cliente de Prisma por inyección en el constructor, con un valor por defecto que usa la instancia singleton de la base de datos.

### 3.3. Capa de Servicios (services/)

Los servicios contienen la lógica de negocio de la aplicación. Cada servicio implementa la interfaz correspondiente y utiliza repositorios para acceder a los datos. Los servicios son responsables de validar reglas de negocio, coordinar operaciones entre múltiples repositorios y lanzar errores con códigos HTTP apropiados.

Archivos creados:
- AuthService.ts: Implementa IAuthService. Maneja el registro de usuarios con verificación de duplicados por email y RUT, hashing de contraseñas con bcrypt, y login con generación de tokens JWT.
- AppointmentService.ts: Implementa IAppointmentService. Maneja la creación de citas con generación de enlaces de reunión, consulta de citas por usuario y rol, actualización de estados con verificación de permisos, y eliminación masiva solo para administradores.
- ClinicalService.ts: Implementa IClinicalService. Maneja el guardado de fichas clínicas con verificación de que la cita pertenezca al doctor, consulta de historiales con control de acceso, y generación de estadísticas globales.
- LiveKitService.ts: Implementa ILiveKitService. Maneja la generación de tokens de acceso para videollamadas, con validación de parámetros y verificación de configuración del servidor.

### 3.4. Capa de Controladores (controllers/)

Los controladores se redujeron a su mínima expresión: solo manejan la interacción HTTP, extrayendo datos de request, llamando al servicio correspondiente y devolviendo la respuesta adecuada. Toda la lógica de negocio fue movida a los servicios.

Archivos refactorizados:
- authController.ts: Solo contiene las funciones register y login, que delegan en AuthService.
- appointmentController.ts: Contiene las funciones para el manejo de citas, delegando en AppointmentService.
- clinicalController.ts: Contiene las funciones para fichas clínicas, delegando en ClinicalService.
- livekitController.ts: Contiene la función para obtener tokens, delegando en LiveKitService.

### 3.5. Capa de Configuración (config/)

Se centralizaron las configuraciones del sistema en archivos específicos.

Archivos creados o refactorizados:
- database.ts: Mantiene la configuración de Prisma como singleton.
- jwt.ts: Centraliza la configuración de JWT, incluyendo la clave secreta, el tiempo de expiración y la interfaz del payload.
- socket.ts: Encapsula toda la configuración de Socket.io, incluyendo el middleware de autenticación y el manejo de eventos de sala.

### 3.6. Middleware

- authMiddleware.ts: Se simplificó para que solo valide tokens JWT. Ahora usa la configuración centralizada de jwt.ts y expone la interfaz AuthRequest para tipado correcto en los controladores.

---

## 4. Cambios Específicos en Archivos Existentes

### 4.1. server.ts

Antes: El archivo server.ts contenía la configuración de Socket.io inline, mezclada con la configuración del servidor Express y las rutas.

Después: La configuración de Socket.io se movió a config/socket.ts. El server.ts ahora solo importa las rutas, crea el servidor HTTP, aplica middleware global y pasa el servidor HTTP a la clase SocketConfig. Se agregó un manejador de señal SIGINT para desconectar la base de datos gracefulmente.

### 4.2. authMiddleware.ts

Antes: El middleware de autenticación usaba JWT_CONFIG directamente pero con tipos inseguros.

Después: Se mejoró el tipado usando la conversión explícita a JwtPayload. La función protect ahora acepta Request genérico de Express y hace casting interno a AuthRequest, lo que resuelve los problemas de compatibilidad de tipos con las rutas.

### 4.3. appointmentRoutes.ts y clinicalRoutes.ts

Antes: Las rutas pasaban directamente los controladores con tipo AuthRequest a Express Router, causando errores de tipo porque Express espera Request.

Después: Se agregó un wrapper llamado authHandler que convierte el handler con AuthRequest a un handler con Request estándar de Express, resolviendo los conflictos de tipos.

---

## 5. Fundamentación Técnica: Por Qué las Funcionalidades de Videollamada y Audio Siguen Funcionando

La videollamada y el audio son funcionalidades críticas en mediCampo-v2. Antes de la refactorización, estas funcionalidades funcionaban correctamente. Tras los cambios, es posible afirmar con fundamentos técnicos que continúan operando sin alteraciones por las siguientes razones:

### 5.1. El flujo de la videollamada no fue modificado

El flujo completo de una videollamada en mediCampo-v2 sigue esta secuencia:

1. El cliente solicita un token a GET /api/livekit/token con los parámetros room y username.
2. El middleware protect verifica el JWT del usuario.
3. El controlador livekitController llama a LiveKitService para generar el token.
4. LiveKitService usa livekit-server-sdk para crear un AccessToken firmado.
5. El cliente usa ese token para conectarse al servidor LiveKit.
6. Socket.io maneja los eventos de sala (join-room, user-connected, disconnect).

En la refactorización, este flujo se mantiene intacto. La ruta /api/livekit/token sigue existiendo, el middleware protect sigue validando el token, y LiveKitService sigue generando el mismo AccessToken con los mismos grants (roomJoin, canPublish, canSubscribe, canPublishData).

### 5.2. LiveKitService es una extracción directa, no una reescritura

El código de LiveKitService se extrajo del controlador original sin modificar la lógica interna. Las mismas validaciones de parámetros, la misma creación de AccessToken, los mismos grants y el mismo tiempo de vida (TTL de 10 minutos) se mantienen. La única diferencia es que ahora está encapsulado en una clase que implementa ILiveKitService, lo que permite inyectarlo y probarlo, pero no altera su comportamiento en producción.

### 5.3. Socket.io se mantiene con la misma configuración

La configuración de Socket.io se movió a config/socket.ts, pero el middleware de autenticación, los eventos de conexión, join-room y disconnect son idénticos. El servidor HTTP que se pasa a SocketConfig es el mismo que se creaba antes en server.ts. No hay cambios en la lógica de eventos ni en la configuración CORS.

### 5.4. Las rutas y endpoints no cambiaron

Todas las rutas de la API se mantienen en los mismos paths:
- /api/auth/register y /api/auth/login
- /api/appointments/doctors, /api/appointments/book, /api/appointments/my-appointments, /api/appointments/room/:roomId, /api/appointments/:id/status, /api/appointments/all
- /api/clinical/:appointmentId, /api/clinical/patient/:patientId, /api/clinical/appointment/:appointmentId, /api/clinical/admin/stats
- /api/livekit/token

El frontend no requiere ningún cambio en las URLs que consume.

### 5.5. La base de datos no fue modificada

No se realizaron cambios en el esquema de Prisma ni en la estructura de la base de datos. Los repositorios utilizan las mismas consultas que antes estaban dispersas en los controladores. La instancia de PrismaClient sigue siendo la misma.

### 5.6. Las dependencias externas no cambiaron

Las mismas librerías se utilizan: jsonwebtoken para JWT, bcryptjs para hashing, livekit-server-sdk para tokens de videollamada, socket.io para comunicación en tiempo real, y @prisma/client para acceso a datos. No se agregaron ni eliminaron dependencias.

### 5.7. Verificación de compilación exitosa

El proyecto compila sin errores con TypeScript, lo que garantiza que no hay problemas de tipos, importaciones incorrectas o referencias rotas entre archivos.

---

## 6. Beneficios de la Nueva Arquitectura

### 6.1. Mantenibilidad

Cada capa tiene una responsabilidad clara. Si hay que cambiar la lógica de negocio de las citas, solo se modifica AppointmentService. Si hay que cambiar cómo se accede a los datos de usuarios, solo se modifica UserRepository. Si hay que cambiar cómo se exponen los endpoints, solo se modifican los controladores.

### 6.2. Testeabilidad

Los servicios pueden ser probados de forma aislada inyectando repositorios mock. Los controladores pueden ser probados inyectando servicios mock. Las interfaces facilitan la creación de dobles de prueba.

### 6.3. Extensibilidad

Para agregar un nuevo método de autenticación, solo se crea una nueva implementación de IAuthService. Para agregar un nuevo tipo de reporte, solo se agrega un método a IClinicalService y su implementación. No es necesario modificar el código existente.

### 6.4. Separación de preocupaciones

La lógica HTTP está en los controladores, la lógica de negocio en los servicios, el acceso a datos en los repositorios, y la configuración en archivos dedicados. Esto facilita la navegación del código y la incorporación de nuevos desarrolladores al proyecto.

---

## 7. Conclusión

La refactorización del backend de mediCampo-v2 bajo principios SOLID era necesaria y se realizó en el momento adecuado. La nueva arquitectura en capas con interfaces, repositorios, servicios y controladores separados mejora significativamente la mantenibilidad, testeabilidad y extensibilidad del proyecto.

Las funcionalidades existentes, incluyendo la videollamada y el audio, no se vieron afectadas porque el flujo de ejecución, las rutas, las dependencias externas y la lógica central se mantuvieron intactas. La refactorización fue una extracción y reorganización del código, no una reescritura.

El frontend no requirió cambios en esta etapa, ya que su estructura actual de componentes y hooks es adecuada para el estado actual del proyecto. Una refactorización del frontend podría considerarse en el futuro cuando la aplicación crezca en complejidad y número de componentes.
