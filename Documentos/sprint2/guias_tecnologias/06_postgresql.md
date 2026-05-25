# Guía sobre PostgreSQL en mediCampo v2

Este documento explica desde lo más básico qué es PostgreSQL, por qué lo elegimos como base de datos para mediCampo v2 y cómo se integra con el resto del sistema a través de Prisma. La idea es que cualquier integrante del equipo entienda los fundamentos de las bases de datos relacionales y, en particular, las características específicas de PostgreSQL que aprovechamos en el proyecto.

## Qué es una base de datos relacional

Antes de hablar específicamente de PostgreSQL, conviene entender qué es una base de datos relacional, dado que ese es el tipo de base que usamos en mediCampo v2.

Una base de datos es esencialmente un lugar organizado donde guardamos información de manera persistente, esto es, información que no desaparece cuando se apaga el servidor ni cuando se cierra la aplicación. A diferencia de las variables en memoria (que existen solo mientras un programa está corriendo), los datos en una base de datos sobreviven el tiempo que sea necesario, pudiendo ser consultados y modificados desde múltiples aplicaciones.

Una base de datos relacional es aquella donde los datos se organizan en tablas, similar a las hojas de cálculo de Excel. Cada tabla tiene columnas (que representan los campos o atributos) y filas (que representan los registros individuales). Por ejemplo, en mediCampo v2 tenemos una tabla User con columnas como id, email, password y role, donde cada fila representa a un usuario específico del sistema.

Lo distintivo de las bases relacionales es que las tablas pueden estar conectadas entre sí mediante relaciones, esto es, una fila de una tabla puede hacer referencia a filas de otras tablas mediante llaves foráneas. Por ejemplo, la tabla Appointment tiene columnas patientId y doctorId que apuntan a registros de la tabla User, vinculando cada cita con el paciente y el médico que participan en ella.

El lenguaje universal para hablar con las bases de datos relacionales es SQL, que es un lenguaje declarativo donde describimos qué queremos hacer (leer, crear, actualizar, eliminar) sin entrar en cómo la base lo va a ejecutar internamente.

## Qué es PostgreSQL

PostgreSQL, también conocida cariñosamente como Postgres por la comunidad, es una base de datos relacional de código abierto que existe desde 1996, evolucionando a partir de un proyecto académico de la Universidad de California en Berkeley llamado Ingres. A lo largo de casi tres décadas se ha consolidado como una de las bases de datos más respetadas del mundo, conocida por su robustez, su cumplimiento estricto del estándar SQL y su capacidad para manejar tanto cargas pequeñas como aplicaciones empresariales de gran escala.

Algunas de las características que distinguen a PostgreSQL de otras bases relacionales son las siguientes.

Cumplimiento estricto de ACID, esto es, las transacciones en Postgres garantizan Atomicidad (las operaciones se completan todas o ninguna), Consistencia (la base siempre queda en un estado válido), Aislamiento (las transacciones concurrentes no interfieren entre sí) y Durabilidad (una vez confirmada, una transacción persiste incluso ante caídas del servidor).

Soporte para tipos de datos avanzados, incluyendo arrays, JSON nativo, datos geoespaciales, tipos personalizados y tipos enumerados.

Extensibilidad, esto es, permite agregar funcionalidades adicionales mediante extensiones, algunas muy populares como PostGIS para datos geográficos o pgvector para búsquedas vectoriales en aplicaciones de IA.

Concurrencia mediante MVCC (Multi-Version Concurrency Control), esto es, múltiples usuarios pueden leer y escribir simultáneamente sin bloquearse entre sí, lo cual es crítico para aplicaciones con muchos usuarios concurrentes.

Comunidad enorme y documentación excelente, lo cual significa que cualquier problema que enfrentemos probablemente ya tiene solución documentada en internet.

## Por qué elegimos PostgreSQL para mediCampo v2

La decisión de usar PostgreSQL en lugar de otras alternativas como MySQL, SQLite o MongoDB se basó en varias razones que se complementan entre sí.

La primera razón es la naturaleza estructurada de nuestros datos. En mediCampo v2 manejamos entidades muy bien definidas con relaciones claras entre ellas, esto es, usuarios que pueden ser pacientes, médicos o administradores, especialidades que agrupan a los médicos, citas que conectan pacientes con médicos y fichas clínicas que documentan cada consulta. Este tipo de modelo encaja perfectamente con las bases relacionales, donde las relaciones se expresan explícitamente y se respetan mediante restricciones de integridad referencial.

La segunda razón es la confiabilidad para datos sensibles. Estamos manejando información de salud, esto es, fichas clínicas con diagnósticos y prescripciones que pueden tener relevancia legal. PostgreSQL ofrece garantías de durabilidad y consistencia que son críticas para este tipo de datos, dado que un error de pérdida o corrupción podría tener consecuencias serias.

La tercera razón es la disponibilidad como servicio administrado en DigitalOcean. Nuestro proveedor de nube ofrece bases de datos PostgreSQL completamente administradas, donde DigitalOcean se encarga de los respaldos automáticos, las actualizaciones de seguridad, la alta disponibilidad y el monitoreo, dejándonos libres para concentrarnos en la lógica de la aplicación en lugar de en la operación de la base.

La cuarta razón es la integración con Prisma. Si bien Prisma soporta múltiples bases (MySQL, SQLite, SQL Server, MongoDB), su integración con PostgreSQL es particularmente robusta, aprovechando muchas características avanzadas de la base sin perder portabilidad.

La quinta razón es el costo. Al ser código abierto, PostgreSQL no tiene licencias asociadas, y los créditos del GitHub Student Pack nos permiten usar la instancia administrada de DigitalOcean sin costo durante todo el desarrollo del proyecto.

## Conceptos fundamentales que necesitamos manejar

### Tablas, columnas y filas

Las tablas son el contenedor principal de los datos en PostgreSQL. Cada tabla tiene un nombre único dentro de una base y se define mediante un esquema que especifica sus columnas, los tipos de datos y las restricciones aplicables.

En mediCampo v2 tenemos cuatro tablas principales, esto es, User (que almacena todos los usuarios del sistema), Specialty (las especialidades médicas), Appointment (las citas agendadas) y ClinicalRecord (las fichas clínicas asociadas a las citas). Cada una de estas tablas tiene un conjunto de columnas que se definen en el archivo schema.prisma y se materializan en la base mediante las migraciones de Prisma.

### Tipos de datos

PostgreSQL soporta una gran cantidad de tipos de datos. Los que usamos con más frecuencia en mediCampo v2 son los siguientes.

INTEGER (o INT) para números enteros, usado por ejemplo en los campos id de cada tabla.

SERIAL es un alias para INTEGER con auto-incremento automático, ideal para llaves primarias.

VARCHAR(n) o TEXT para cadenas de texto, donde VARCHAR(n) limita el largo a n caracteres mientras que TEXT no tiene límite. Lo usamos para campos como name, email, rut y password.

BOOLEAN para valores verdadero o falso.

TIMESTAMP para fechas con hora, usado por ejemplo en createdAt y updatedAt.

DECIMAL o NUMERIC para números decimales con precisión específica, útiles para datos monetarios o constantes vitales.

### Llaves primarias y llaves foráneas

La llave primaria (PRIMARY KEY) es la columna o conjunto de columnas que identifica de manera única a cada fila de una tabla. Cada fila debe tener un valor distinto en la llave primaria, y este valor no puede ser nulo. En mediCampo v2 usamos el campo id de tipo SERIAL como llave primaria en todas las tablas.

La llave foránea (FOREIGN KEY) es una columna que hace referencia a la llave primaria de otra tabla, estableciendo así una relación entre ambas tablas. PostgreSQL garantiza la integridad referencial, esto es, no permite que una llave foránea apunte a un registro que no existe en la tabla referenciada.

En mediCampo v2 tenemos varias llaves foráneas. La tabla Appointment tiene patientId y doctorId que apuntan a la tabla User. La tabla User tiene specialtyId opcional que apunta a la tabla Specialty (para los médicos). La tabla ClinicalRecord tiene appointmentId que apunta a la tabla Appointment.

### Índices

Los índices son estructuras auxiliares que aceleran las consultas sobre ciertas columnas, similar a un índice al final de un libro que permite encontrar rápidamente las páginas donde aparece un tema. Sin índices, la base tendría que recorrer todas las filas de una tabla cada vez que busca algo, lo cual se vuelve lento a medida que la tabla crece.

PostgreSQL crea automáticamente índices sobre las llaves primarias y sobre las columnas marcadas como UNIQUE. En mediCampo v2 esto significa que las búsquedas por id, email o rut son muy rápidas, dado que esas columnas tienen índices automáticos.

### Transacciones

Una transacción es un grupo de operaciones que se ejecutan como una unidad atómica, esto es, todas se completan o ninguna se aplica. Las transacciones son críticas cuando una operación involucra múltiples cambios que deben mantenerse consistentes.

Por ejemplo, en mediCampo v2, cuando un médico guarda la ficha clínica al final de una consulta, en realidad se hacen dos operaciones, esto es, se crea o actualiza el registro en la tabla ClinicalRecord y se actualiza el estado de la cita en la tabla Appointment de CONFIRMED a COMPLETED. Ambas operaciones deben suceder juntas, dado que si solo se completara una, la base quedaría en un estado inconsistente. Prisma maneja esto automáticamente envolviendo las operaciones relacionadas en transacciones.

## La base de datos administrada en DigitalOcean

### Qué significa que sea administrada

Cuando hablamos de una base de datos administrada, nos referimos a que el proveedor de nube (DigitalOcean en nuestro caso) se encarga de toda la operación técnica de la base, dejándonos solo la responsabilidad de definir el esquema y usar la base desde nuestra aplicación. Las tareas que asume DigitalOcean incluyen.

La instalación y configuración inicial del software de PostgreSQL.

La asignación de recursos como CPU, memoria RAM y almacenamiento.

Los respaldos automáticos diarios, con la posibilidad de restaurar a puntos específicos en el tiempo.

Las actualizaciones de seguridad y los parches del software.

El monitoreo del rendimiento y la generación de alertas ante problemas.

La replicación opcional para alta disponibilidad.

Esto contrasta con la opción de instalar y mantener PostgreSQL en un servidor propio, lo cual habría requerido conocimientos profundos de administración de bases de datos y nos habría desviado del objetivo principal del proyecto, que es construir la aplicación.

### Cómo se conecta el backend a la base

La conexión entre el backend y la base de datos PostgreSQL se establece mediante una cadena de conexión que se guarda en la variable de entorno DATABASE_URL. Esta cadena tiene un formato específico que incluye el usuario, la contraseña, el host, el puerto, el nombre de la base y algunos parámetros adicionales.

Un ejemplo simplificado de cómo se ve esta cadena es postgresql dos puntos barra barra usuario dos puntos contraseña arroba host dos puntos puerto barra nombre-base signo de pregunta sslmode igual require. El parámetro sslmode igual require es importante en producción, dado que indica que la conexión debe estar cifrada con SSL para proteger los datos sensibles mientras viajan por la red.

Prisma toma esta cadena directamente desde la variable de entorno cuando se inicializa el cliente, sin necesidad de configuración adicional. Por eso es crítico que el archivo .env nunca se suba al repositorio Git, dado que contiene credenciales que darían acceso completo a la base.

## Operaciones que ejecutamos contra PostgreSQL

Para ilustrar cómo se traduce el código de Prisma en operaciones reales contra PostgreSQL, veamos algunos ejemplos del flujo típico de mediCampo v2.

Cuando un nuevo paciente se registra, Prisma ejecuta una sentencia INSERT INTO User abre paréntesis rut coma name coma email coma password coma role coma createdAt coma updatedAt cierra paréntesis VALUES abre paréntesis valores cierra paréntesis. PostgreSQL valida que el email y el rut no existan ya en la tabla (gracias a las restricciones UNIQUE), genera un id automático por el SERIAL y persiste la fila.

Cuando un paciente consulta sus citas, Prisma ejecuta algo como SELECT estrella FROM Appointment WHERE patientId igual al id del usuario, opcionalmente con un JOIN para traer los datos del médico y la especialidad anidados en la misma consulta.

Cuando un médico acepta una solicitud, Prisma ejecuta UPDATE Appointment SET status igual a CONFIRMED WHERE id igual al id de la cita AND doctorId igual al id del médico. Si la condición no se cumple (porque la cita no le pertenece al médico), la consulta no actualiza nada y Prisma lanza un error que se maneja en el servicio.

Cuando se ejecuta el limpiar todas las citas del panel admin, Prisma ejecuta DELETE FROM Appointment sin condiciones, vaciando completamente la tabla.

## Herramientas útiles para trabajar con la base

Aunque no las usamos directamente desde el código, vale la pena conocer algunas herramientas que facilitan trabajar con PostgreSQL.

psql es el cliente de línea de comandos oficial de PostgreSQL. Permite conectarse a la base y ejecutar consultas SQL directamente. Es útil para diagnosticar problemas o explorar la estructura de las tablas.

pgAdmin es una herramienta gráfica para administrar bases PostgreSQL. Tiene una interfaz visual donde se pueden ver las tablas, los datos, los índices y ejecutar consultas con resaltado de sintaxis.

DBeaver es otra herramienta gráfica multiplataforma que soporta no solo PostgreSQL sino también otras bases. Es muy popular entre desarrolladores y tiene una versión gratuita completa.

Prisma Studio, que ya mencionamos en la guía de Prisma, también funciona como una interfaz para explorar y editar los datos de la base sin tener que escribir SQL.

El panel de DigitalOcean también tiene herramientas para inspeccionar el estado de la base, ver las conexiones activas, las métricas de rendimiento y los respaldos disponibles.

## Recursos para profundizar

Para los integrantes que quieran aprender más sobre PostgreSQL, la documentación oficial en postgresql.org/docs es extremadamente completa y bien escrita, aunque puede ser densa al principio. Para quienes prefieren formatos más accesibles, hay cursos gratuitos en YouTube en español y en plataformas como freeCodeCamp.

Para aprender SQL específicamente (que es el lenguaje universal de las bases relacionales), recomendamos sitios interactivos como sqlbolt.com, sqlzoo.net o pgexercises.com, donde se pueden practicar consultas reales con feedback inmediato.

Una recomendación final es jugar con la base local durante el desarrollo, esto es, instalar PostgreSQL en la propia máquina y experimentar con consultas, índices y configuraciones sin miedo a romper la base de producción. Esto es la mejor forma de internalizar los conceptos.
