# Guía sobre Prisma en mediCampo v2

Este documento explica desde lo más básico qué es Prisma, por qué lo elegimos como ORM para manejar la base de datos de mediCampo v2 y cómo se usa concretamente dentro del proyecto. La idea es que cualquier integrante del equipo entienda no solo qué hace Prisma, sino también el problema más amplio que viene a resolver y cómo se compara con otras alternativas que podríamos haber elegido.

## Qué problema resuelve Prisma

### El desafío de hablar con la base de datos

Cuando se construye una aplicación que necesita guardar y leer información persistente, casi siempre se usa una base de datos. En el caso de mediCampo v2, usamos PostgreSQL, una base de datos relacional muy robusta. Sin embargo, las bases de datos relacionales hablan SQL, que es un lenguaje declarativo distinto a JavaScript o TypeScript. Esto genera una brecha entre el código de la aplicación y la base de datos, conocida en la jerga técnica como el desajuste objeto-relacional.

Tradicionalmente, los desarrolladores resolvían este problema de dos formas. La primera era escribir las consultas SQL directamente como strings dentro del código y enviarlas a la base mediante un driver, esto es, una librería que se encarga de la comunicación. Esto funciona pero tiene varios problemas. Las consultas SQL son strings sin tipos, por lo cual cualquier error tipográfico solo se detecta en tiempo de ejecución. Los resultados de las consultas vienen como objetos genéricos sin tipado, por lo cual no hay forma de saber qué propiedades tienen sin consultar la documentación. Y mezclar SQL con JavaScript hace que el código sea menos legible y más propenso a vulnerabilidades como inyección SQL.

La segunda forma de resolver el problema era usar un ORM, esto es, un Object-Relational Mapper, que es una herramienta que permite trabajar con la base de datos usando objetos y métodos en el lenguaje de programación de la aplicación, sin escribir SQL directamente. Los ORMs tradicionales como Sequelize, TypeORM o Hibernate llevan años en el mercado pero tienen sus propios problemas, esto es, su sintaxis suele ser complicada, los tipos no siempre están bien sincronizados con la base, y configurarlos correctamente lleva tiempo.

### La propuesta de Prisma

Prisma es un ORM moderno creado en 2018 que propone una solución más limpia al problema. La idea fundamental es definir la estructura de la base de datos en un archivo declarativo llamado schema.prisma, usando una sintaxis muy legible y específica para esto. A partir de ese archivo, Prisma genera automáticamente un cliente tipado en TypeScript que permite hacer consultas usando métodos intuitivos.

Lo más destacable de Prisma es la calidad del tipado, esto es, cuando hacemos una consulta como prisma.user.findUnique con un where específico, TypeScript sabe exactamente qué tipo va a tener el resultado, incluyendo todas las propiedades del modelo User. Esto significa que el editor de código nos da autocompletado preciso, y si intentamos acceder a una propiedad que no existe, el compilador nos avisa de inmediato antes de ejecutar el código.

Adicionalmente, Prisma viene con un sistema de migraciones automático, esto es, cada vez que modificamos el schema.prisma, Prisma puede generar el SQL necesario para llevar la base de datos al nuevo estado, manteniendo un historial versionado de todos los cambios.

## Conceptos básicos de Prisma

### El archivo schema.prisma

El archivo schema.prisma vive en la carpeta prisma/ del backend y es la fuente de verdad sobre la estructura de nuestra base de datos. Está dividido en varias secciones que cumplen distintos roles.

La sección generator client le dice a Prisma que queremos generar el cliente de JavaScript/TypeScript que usaremos desde el código backend. Esta sección típicamente tiene la línea provider igual a prisma-client-js.

La sección datasource db define la conexión a la base de datos, esto es, qué tipo de base es (en nuestro caso postgresql) y dónde está (mediante la variable de entorno DATABASE_URL que apunta a nuestra instancia de DigitalOcean).

Las secciones model definen las tablas de la base. Por ejemplo, model User abre una llave donde adentro listamos los campos del modelo User, cada uno con su tipo y atributos opcionales.

Las secciones enum (que no usamos en este sprint pero podríamos usar en el futuro) definen tipos enumerados con valores fijos predefinidos.

### Definición de un modelo

Un modelo en Prisma se define con la palabra model seguida del nombre y un bloque entre llaves. Dentro del bloque listamos los campos, donde cada campo tiene un nombre, un tipo y opcionalmente algunos atributos especiales precedidos por arroba.

Por ejemplo, el modelo User de mediCampo v2 podría verse aproximadamente así. La línea id Int arroba id arroba default open paréntesis autoincrement open paréntesis close cierra paréntesis declara un campo id de tipo entero, marcado como llave primaria con autoincremento. La línea rut String arroba unique declara un campo rut de tipo string, marcado como único en la base. La línea email String arroba unique es similar para el correo. La línea password String declara la contraseña como string sin restricciones de unicidad. La línea name String declara el nombre. La línea role String arroba default open paréntesis comilla PATIENT comilla close cierra paréntesis declara el rol con valor por defecto PATIENT. La línea createdAt DateTime arroba default open paréntesis now open paréntesis close cierra paréntesis declara un timestamp que se completa automáticamente al crear. La línea updatedAt DateTime arroba updatedAt declara un timestamp que se actualiza automáticamente en cada modificación.

Los tipos básicos de Prisma incluyen Int para enteros, String para texto, Boolean para verdadero o falso, DateTime para fechas y horas, Float para números decimales y Bytes para datos binarios. Si un campo es opcional, se agrega un signo de interrogación al final del tipo, por ejemplo specialtyId Int signo de interrogación indica que ese campo puede ser nulo.

### Relaciones entre modelos

Las relaciones son una de las características más potentes de Prisma. Permiten declarar cómo se conectan dos modelos entre sí, y Prisma se encarga de manejar las llaves foráneas y las consultas anidadas automáticamente.

Hay tres tipos principales de relaciones, esto es, uno a muchos, muchos a muchos y uno a uno.

En una relación uno a muchos (que es la más común), una entidad puede tener muchas instancias de otra entidad. Por ejemplo, una Specialty puede tener muchos doctores, mientras que cada doctor tiene una sola Specialty. Esto se modela en Prisma agregando un campo de tipo Specialty signo de interrogación dentro de User junto con la llave foránea specialtyId Int signo de interrogación, y agregando un campo doctors User corchete corchete dentro de Specialty para listar los doctores asociados.

En una relación uno a uno, cada instancia de una entidad se relaciona con exactamente una instancia de otra. Por ejemplo, cada Appointment tiene exactamente un ClinicalRecord asociado y viceversa. Esto se modela con campos opcionales en ambos lados más una restricción de unicidad en la llave foránea.

En mediCampo v2 tenemos relaciones nominales para distinguir entre las citas atendidas por un médico y las citas recibidas por un paciente. Esto se logra usando arroba relation con un nombre específico, por ejemplo arroba relation open paréntesis comilla DoctorAppointments comilla close cierra paréntesis para una relación y arroba relation open paréntesis comilla PatientAppointments comilla close cierra paréntesis para la otra. De esta forma, desde un User podemos consultar tanto sus citas como médico (doctorAppointments) como sus citas como paciente (patientAppointments).

### Migraciones

Una migración es un script versionado que describe un cambio en la estructura de la base de datos. Cuando modificamos el archivo schema.prisma (por ejemplo, agregando un nuevo modelo, modificando un campo o cambiando una relación), ejecutamos el comando npx prisma migrate dev seguido de una descripción del cambio.

Prisma compara el estado actual del esquema con el último aplicado, genera un archivo SQL en la carpeta prisma/migrations con las sentencias CREATE TABLE, ALTER TABLE o DROP TABLE necesarias, y lo aplica automáticamente a la base de datos. El archivo SQL queda guardado en el repositorio Git, por lo cual cualquier desarrollador puede aplicar todas las migraciones a una base nueva y obtener exactamente el mismo esquema.

En producción se usa el comando npx prisma migrate deploy en lugar de migrate dev, dado que deploy solo aplica las migraciones existentes sin generar nuevas ni preguntar interactivamente.

### El cliente generado

Una vez que el esquema está definido y las migraciones aplicadas, ejecutamos npx prisma generate para que Prisma genere el cliente tipado en JavaScript/TypeScript. Este cliente queda dentro de node_modules/@prisma/client y se importa desde el código backend.

Para usarlo, primero creamos una única instancia del cliente, típicamente en un archivo de configuración como backend/src/config/database.ts donde escribimos algo como import open llave PrismaClient close llave from comilla arroba prisma barra client comilla seguido de const prisma igual new PrismaClient open paréntesis close paréntesis y luego export default prisma. Esta instancia única se reutiliza en todos los repositorios.

## Operaciones CRUD con Prisma

Las operaciones más comunes que hacemos con Prisma son las que se conocen como CRUD, esto es, Create (crear), Read (leer), Update (actualizar) y Delete (eliminar). Veamos los métodos principales de Prisma para cada una.

### Crear registros

Para crear un nuevo registro usamos el método create. Por ejemplo, prisma.user.create con un objeto que tiene la clave data y dentro los valores del nuevo usuario. Si el modelo tiene relaciones, podemos crear el registro relacionado en la misma operación usando connect o create anidado.

En mediCampo v2 usamos create cuando un nuevo paciente se registra (en el endpoint POST /api/auth/register) y cuando se crea una nueva cita (en el endpoint POST /api/appointments/book).

### Leer registros

Para leer registros tenemos varios métodos según lo que necesitemos.

findUnique busca un único registro por una clave única, esto es, una llave primaria o un campo marcado como unique. Por ejemplo, prisma.user.findUnique con where igual al email busca al usuario con ese correo específico.

findFirst busca el primer registro que coincida con una condición. Es útil cuando la condición no involucra una clave única.

findMany busca todos los registros que coincidan con una condición, devolviendo un arreglo. Si no se pasa where, devuelve todos los registros de la tabla.

En todas estas operaciones podemos usar la opción include para traer las relaciones anidadas en la misma consulta, evitando el problema N+1 (que es cuando se hacen muchas consultas separadas para traer datos relacionados). Por ejemplo, prisma.appointment.findMany con include igual a un objeto que incluye doctor y patient devuelve las citas con los datos completos del médico y del paciente anidados.

También podemos usar la opción select para traer solo algunos campos específicos en lugar del registro completo, lo cual es útil para reducir la cantidad de datos transferidos.

### Actualizar registros

Para actualizar registros usamos update si conocemos la clave única, o updateMany si queremos actualizar múltiples registros que cumplan una condición.

Por ejemplo, prisma.appointment.update con where igual al id y data igual a un objeto con el nuevo status actualiza una cita específica.

### Eliminar registros

Para eliminar usamos delete con una clave única o deleteMany con una condición. Por ejemplo, prisma.appointment.deleteMany sin where elimina todas las citas (lo cual usamos en el endpoint DELETE /api/appointments/all del panel admin).

### El método especial upsert

upsert es un método híbrido que actualiza un registro si existe o lo crea si no existe. Es muy útil cuando queremos asegurar que un registro esté presente sin importar su estado previo.

En mediCampo v2 usamos upsert para guardar la ficha clínica en el endpoint POST /api/clinical/:appointmentId, dado que queremos crear el registro si es la primera vez que se guarda, o actualizar el existente si el médico está modificando una ficha previa.

## Prisma dentro de mediCampo v2

### Los modelos que tenemos

Los modelos principales de mediCampo v2 son los siguientes.

User representa a cualquier usuario del sistema, con su rol diferenciando si es PATIENT, DOCTOR o ADMIN. Tiene campos como id, rut, name, email, password, role, specialtyId, createdAt y updatedAt.

Specialty representa las especialidades médicas disponibles. Tiene campos como id y name, con la relación inversa hacia los doctores asociados.

Appointment representa una cita médica entre un paciente y un médico. Tiene campos como id, date, status, meetingLink, patientId, doctorId, junto con la relación uno a uno hacia ClinicalRecord.

ClinicalRecord representa la ficha clínica generada después de una consulta. Tiene campos textuales (diagnosis, prescription, observations, allergies, symptoms) y de constantes vitales (weight, height, bloodPressure, temperature, heartRate, oxygenSat), junto con la relación inversa hacia el Appointment.

### Los repositorios

Para mantener el código organizado, no usamos Prisma directamente desde los controladores, sino que lo encapsulamos en repositorios. Los repositorios son clases o módulos que ofrecen métodos específicos de alto nivel, ocultando los detalles de cómo se ejecutan las consultas.

Por ejemplo, UserRepository tiene métodos como findByEmail, findById, create y findByRut. Cada uno internamente usa Prisma con las opciones adecuadas para esa consulta. Esta separación hace que el código de los servicios sea más limpio y permita cambiar el ORM en el futuro sin tocar la lógica de negocio.

AppointmentRepository tiene métodos como findByUserId (que filtra por rol del usuario para devolver las citas relevantes), findByIdAndDoctor (para verificar la propiedad antes de actualizar), findByMeetingLink (usado por el endpoint que mapea el roomId con la cita) y create.

ClinicalRecordRepository tiene métodos para el upsert de la ficha y para consultar las fichas existentes.

## Comandos útiles de Prisma

Para terminar, conviene listar los comandos de Prisma que se usan con más frecuencia.

npx prisma init crea el esqueleto inicial de Prisma en un proyecto nuevo. Solo se ejecuta una vez al comenzar.

npx prisma migrate dev seguido de un nombre genera una nueva migración y la aplica a la base de desarrollo. Se ejecuta cada vez que modificamos el schema.

npx prisma migrate deploy aplica las migraciones existentes a la base de producción sin generar nuevas.

npx prisma generate regenera el cliente tipado a partir del esquema actual. Generalmente Prisma lo hace automáticamente, pero a veces hay que ejecutarlo manualmente.

npx prisma studio abre una interfaz web visual donde podemos navegar e incluso editar los datos de la base. Es muy útil durante el desarrollo para verificar qué hay en la base sin tener que escribir consultas.

npx prisma db seed ejecuta el script seed.ts que poblamos con datos iniciales, como los médicos y especialidades de prueba.

## Recursos para profundizar

Para aprender más sobre Prisma, la documentación oficial en prisma.io/docs es excelente, con guías paso a paso y ejemplos de casos comunes. También hay un canal de YouTube oficial con tutoriales en video, y la comunidad de Prisma en Slack es muy activa para responder preguntas.

Una recomendación práctica es jugar con Prisma Studio durante el desarrollo, dado que es la forma más rápida de verificar que los cambios están funcionando como se espera sin tener que escribir consultas en SQL ni armar endpoints temporales para inspeccionar la base.
