# Cómo Creamos la Historia de Usuario HU3 — Paso a Paso

Este documento explica de forma narrativa cómo abordamos la construcción de la historia de usuario HU3 (Registro e inicio de sesión del médico y de los usuarios), desde el momento en que comenzamos a pensarla hasta que quedó funcionando dentro del sistema. La idea es que cualquier integrante del equipo pueda leer esta guía y entender no solo qué hicimos sino también por qué tomamos cada decisión, de modo que pueda explicarlo con seguridad durante la revisión presencial.

Está escrita como un relato del proceso real, con todos los detalles técnicos relevantes pero sin caer en jerga innecesaria, manteniendo el tono cercano y accesible para que quien no participó directamente en cada paso pueda igualmente entender la lógica detrás del trabajo.

## El punto de partida

Antes de comenzar con el código, lo primero que hicimos como equipo fue conversar sobre qué necesitábamos exactamente para que la HU3 quedara cubierta. La historia, en su redacción base, dice que como usuario del sistema necesitamos poder registrarnos e iniciar sesión en la plataforma para acceder de forma segura a las funcionalidades correspondientes al rol. Eso es claro pero general, así que descompusimos en preguntas más concretas, esto es, qué datos vamos a pedir al registrarse, cómo vamos a manejar las contraseñas, cómo va a funcionar la sesión después del login, qué pasa cuando alguien intenta acceder a una sección que no le corresponde según su rol y cómo se diferencian visualmente los flujos según el tipo de usuario.

Estas conversaciones quedaron registradas en los primeros Daily Scrum del sprint y dieron pie a la lista de tareas técnicas que conforman la HU3, las cuales numeramos como T03.1 hasta T03.7.

## Paso 1 — Diseñar el modelo de datos (T03.1)

Antes de escribir cualquier código del backend o del frontend, necesitábamos definir cómo iba a verse un usuario dentro de la base de datos. Esto se llama modelado de datos y es uno de los pasos más importantes de cualquier proyecto, dado que las decisiones que se toman aquí afectan todo lo que viene después.

James se encargó de esta tarea trabajando en el archivo backend/prisma/schema.prisma. Después de discutirlo con el equipo, decidimos que el modelo User iba a tener los siguientes campos.

Un campo id de tipo entero con autoincremento, marcado como llave primaria. Este es el identificador único que la base le va a dar automáticamente a cada usuario que se registre.

Un campo rut de tipo string, marcado como único. Decidimos pedir el RUT porque es el identificador estándar en Chile y permite asociar a cada persona con su identidad real, lo cual es importante para el contexto de salud donde no podemos tener pacientes anónimos.

Un campo name de tipo string para el nombre completo. Sin restricciones de unicidad porque varias personas pueden tener el mismo nombre.

Un campo email de tipo string, marcado como único. Este sería el identificador principal para iniciar sesión, dado que es más fácil de recordar que el RUT.

Un campo password de tipo string. Aquí no vamos a guardar la contraseña original sino su hash bcrypt, pero la columna en sí es un string que almacena ese hash.

Un campo role de tipo string con valor por defecto PATIENT. Aquí guardamos qué tipo de usuario es la persona, esto es, PATIENT para pacientes, DOCTOR para médicos o ADMIN para administradores. El default PATIENT significa que cuando alguien se registra por la vía pública (sin intervención del admin), automáticamente queda como paciente.

Un campo specialtyId de tipo entero opcional. Esto solo aplica para los médicos, dado que cada médico tiene una especialidad asociada. Para los pacientes y administradores este campo queda nulo.

Dos campos de timestamp createdAt y updatedAt que Prisma maneja automáticamente, indicando cuándo se creó el registro y cuándo fue modificado por última vez.

Una vez definido el modelo, James ejecutó el comando npx prisma migrate dev seguido de un nombre descriptivo como add user model. Prisma comparó el esquema con el estado actual de la base, generó automáticamente un archivo SQL con la sentencia CREATE TABLE correspondiente y la aplicó a la instancia de PostgreSQL en DigitalOcean. A partir de ese momento la tabla User quedó creada y lista para usarse.

## Paso 2 — Construir el endpoint de registro (T03.2)

Con el modelo listo, lo siguiente era construir el endpoint que permitiera crear nuevos usuarios. James trabajó en esto desarrollando tres capas según el patrón de arquitectura limpia que adoptamos.

La primera capa es la ruta, definida en backend/src/routes/authRoutes.ts. Ahí se asocia la URL /api/auth/register con el método HTTP POST y se apunta al controlador correspondiente.

La segunda capa es el controlador, en backend/src/controllers/authController.ts. Su trabajo es recibir la petición HTTP, extraer los datos del cuerpo (rut, name, email, password) y delegar la lógica al servicio. Si el servicio responde con éxito, el controlador devuelve los datos del usuario creado con código 201. Si responde con error, el controlador traduce el error a un código HTTP apropiado y un mensaje legible.

La tercera capa es el servicio, en backend/src/services/AuthService.ts. Aquí vive la lógica de negocio. Primero verifica que no exista otro usuario con el mismo email, llamando al repositorio. Si existe, lanza un error 409 Conflict con un mensaje que indica que el email ya está registrado. Luego hace lo mismo con el RUT. Si tampoco existe, procede a hashear la contraseña con bcrypt.hash usando 10 rounds de salt. Finalmente llama al repositorio para crear el nuevo registro con el rol PATIENT por defecto.

La cuarta capa es el repositorio, en backend/src/repositories/UserRepository.ts. Tiene métodos como findByEmail, findByRut y create, cada uno encapsulando una operación de Prisma. Esto mantiene la lógica de acceso a datos separada del resto del código.

Una vez todo cableado, James probó el endpoint con Postman enviando peticiones POST a /api/auth/register con cuerpos de prueba. Verificó que un usuario nuevo se creaba correctamente, que un intento con email duplicado retornaba el error esperado, y que la contraseña efectivamente se almacenaba como hash en la base de datos.

## Paso 3 — Construir el endpoint de login (T03.3)

El siguiente paso fue construir el endpoint complementario para que los usuarios ya registrados pudieran iniciar sesión. James lo abordó con la misma estructura de capas.

En la ruta se definió POST /api/auth/login. En el controlador se extraen el email y la contraseña del cuerpo de la petición. En el servicio se busca al usuario por email mediante el repositorio. Si no existe, se retorna un error 401 Unauthorized con un mensaje genérico (sin especificar si el problema fue el email o la contraseña, para no dar pistas a un atacante). Si existe, se compara la contraseña ingresada con el hash almacenado usando bcrypt.compare. Si no coinciden, se retorna el mismo error 401 genérico.

Si la verificación es exitosa, llega el momento de generar el token JWT. El servicio construye el payload con los datos relevantes del usuario, esto es, un objeto con las claves sub (que contiene el id del usuario), role (su rol) y name (su nombre). Luego llama a jwt.sign pasándole el payload, la clave secreta JWT_SECRET y la opción expiresIn con la duración deseada.

El controlador recibe el resultado del servicio, esto es, un objeto con el token y los datos del usuario sin la contraseña, y lo devuelve como JSON al cliente con código 200.

James probó el endpoint con Postman, primero con credenciales correctas para verificar que devolvía el token, luego con email inexistente y contraseña incorrecta para verificar que retornaba el error genérico esperado.

## Paso 4 — Construir el componente Login en el frontend (T03.4)

Mientras James trabajaba en los endpoints, Vicente comenzó la construcción del componente visual de inicio de sesión, ubicado en frontend/src/components/auth/Login.tsx.

Vicente partió desde un boceto mental basado en pantallas de login modernas que había visto en otras aplicaciones de salud y tecnología. La idea era transmitir confianza y profesionalismo desde el primer momento, dado que es la primera pantalla que ve el usuario y la primera impresión cuenta mucho.

Vicente decidió usar un fondo oscuro casi negro con dos gradientes circulares desenfocados en tonalidades emerald y cyan, lo cual genera una sensación moderna sin ser excesivamente recargada. En el centro ubicó un contenedor con efecto glassmorphism (vidrio esmerilado), que es una técnica visual muy popular en interfaces modernas que da sensación de profundidad y elegancia.

Dentro del contenedor agregó un ícono HeartPulse arriba como elemento de identidad visual, simbolizando el latido vital de la plataforma de salud. Debajo del ícono el título Bienvenido de vuelta y el subtítulo Tu salud conectada desde cualquier lugar.

El formulario tiene dos campos, esto es, correo electrónico y contraseña, cada uno con un ícono a la izquierda (Mail y Lock respectivamente). Los inputs tienen efectos de focus con un ring de color emerald translúcido que aparece cuando el usuario hace clic en el campo, dando retroalimentación visual de dónde está el cursor.

Bajo el formulario está el botón principal Iniciar Sesión con fondo de gradiente emerald a cyan, manteniendo coherencia con el resto de la paleta. Cuando la petición está en curso, el texto se reemplaza por un ícono Loader2 girando, indicando al usuario que algo está pasando.

Al pie del contenedor incluyó un mensaje invitando al registro con un botón que cambia la vista al componente Register cuando se presiona.

La lógica del componente usa useState para manejar el estado del email, la contraseña, los errores y el indicador de loading. Cuando el usuario envía el formulario, se ejecuta una función async que hace fetch al endpoint /api/auth/login que ya tenía James, maneja la respuesta y, si todo va bien, llama al método login del AuthContext (que veremos en el paso siguiente).

Si el backend retorna un error, el componente lo muestra en una caja roja translúcida sobre el formulario, con animación de fade-in para llamar la atención sin sobresaltar al usuario.

Vicente probó el componente conectándolo con el backend real, verificando que tanto los escenarios de éxito como los de error funcionaran correctamente.

## Paso 5 — Construir el componente Register en el frontend (T03.5)

Después del Login, Vicente construyó el componente Register en frontend/src/components/auth/Register.tsx, reusando los patrones visuales del Login pero con algunos ajustes.

El contenedor es ligeramente más ancho y tiene más padding vertical para acomodar los cuatro campos en lugar de dos. Los gradientes del fondo se invierten (cyan arriba, emerald abajo) para diferenciar visualmente las dos pantallas pero manteniendo coherencia.

El título cambia a Crea tu cuenta con el subtítulo Únete a mediCampo y recibe atención donde estés, alineando el copy con el valor central del producto.

Los cuatro campos son Nombre Completo (con ícono User), RUT (con ícono FileText y placeholder 12345678-9 que sugiere el formato esperado), Correo Electrónico (con ícono Mail) y Contraseña (con ícono Lock).

La gracia del Register está en la lógica del envío. Cuando el usuario presiona Registrarse, la función handleSubmit hace dos peticiones encadenadas, esto es, primero un POST a /api/auth/register para crear la cuenta, y si esa fue exitosa, inmediatamente un POST a /api/auth/login con las mismas credenciales recién creadas. Esto deja al usuario autenticado automáticamente sin necesidad de pedirle que vuelva a ingresar sus datos.

La razón de este auto-login es la experiencia de usuario. Para un paciente rural con poca familiaridad digital, tener que ingresar las credenciales otra vez justo después de registrarse podría ser confuso o frustrante. Con el auto-login, simplemente entra al sistema directamente después de crear la cuenta.

## Paso 6 — Construir el AuthContext con persistencia (T03.6)

Aquí entré yo (Ignacio) con una pieza que conecta todo lo anterior. El AuthContext es el contenedor global que mantiene la sesión del usuario disponible para toda la aplicación, sin importar en qué componente esté ubicada la información que necesita acceder al usuario actual.

El archivo es frontend/src/context/AuthContext.tsx. La estructura básica es la siguiente.

Primero defino la interfaz del contexto, esto es, qué datos y qué funciones expone. En nuestro caso expone user (el objeto del usuario autenticado o null si no hay sesión), token (el JWT actual o null), login (una función que recibe el token y el usuario y los persiste) y logout (una función que limpia la sesión).

Luego creo el contexto con createContext de React, pasándole los valores por defecto.

Después construyo el componente AuthProvider, que es el que envuelve a toda la aplicación. Internamente usa useState para mantener el user y el token. Al inicio del componente uso useEffect para leer localStorage y restaurar la sesión si existe, esto es, busco las claves medicampo_token y medicampo_user, las parseo y las pongo en el estado. Si no existen, el estado queda en null y la aplicación se comporta como si no hubiera sesión.

El método login recibe los nuevos valores, los guarda en localStorage con localStorage.setItem y actualiza el estado. El método logout hace lo opuesto, esto es, ejecuta localStorage.removeItem para ambas claves y resetea el estado a null.

Finalmente exporto un hook useAuth que es simplemente useContext del AuthContext, lo cual es un atajo conveniente para que cualquier componente pueda hacer const { user, login, logout } = useAuth() y trabajar con la sesión.

El AuthProvider se ubica en main.tsx envolviendo a toda la aplicación, lo cual hace que el contexto esté disponible en cualquier punto de la jerarquía de componentes.

## Paso 7 — Construir el RoleRoute como guardián de rutas (T03.7)

La última pieza que faltaba era el control de acceso por rol. El RoleRoute es un componente de envoltura que verifica el rol del usuario antes de permitir que la ruta solicitada se renderice.

Lo desarrollé directamente dentro de App.tsx por simplicidad, aunque podría haberse extraído a un archivo separado. La lógica es la siguiente.

El componente recibe dos props, esto es, un array allowedRoles con los roles permitidos para esa ruta, y un children con el componente que se quiere renderizar dentro.

Internamente usa useAuth para obtener el usuario actual. Si user es null, esto es, no hay sesión activa, redirige al login usando Navigate. Si user existe pero su role no está dentro del array allowedRoles, redirige a la página principal. Si el role coincide, simplemente renderiza el children.

Después de tener el RoleRoute listo, lo apliqué a todas las rutas sensibles de App.tsx. Por ejemplo, la ruta /dashboard-paciente se envolvió con RoleRoute con allowedRoles igual a corchete PATIENT corchete, la ruta /dashboard-medico con allowedRoles igual a corchete DOCTOR corchete, y la ruta /admin con allowedRoles igual a corchete ADMIN corchete.

Es importante destacar que el RoleRoute es solo la primera capa de control de acceso, dado que toda la seguridad real se valida también en el backend en cada endpoint. Si alguien intenta saltarse el frontend y hacer peticiones directas a la API, el backend igualmente verificará el JWT y los permisos correspondientes.

## Pruebas integradas

Una vez que las siete tareas estaban completas, hicimos una prueba integrada end-to-end del flujo completo de la HU3.

Primero, abrimos un navegador limpio sin sesiones previas. Verificamos que la aplicación nos llevaba al Login.

Segundo, presionamos el enlace de registro para ir al componente Register. Completamos los cuatro campos con datos de prueba de un paciente ficticio y presionamos Registrarse. Verificamos que la petición POST a /api/auth/register se ejecutaba correctamente, seguida inmediatamente por el POST a /api/auth/login. El backend devolvía el token JWT y el objeto usuario, y el frontend nos redirigía al DashboardPaciente con el nombre del usuario en el header.

Tercero, recargamos la página con F5 para verificar que la sesión persistía. Efectivamente, el AuthContext leía localStorage y mantenía al usuario autenticado sin pedir credenciales otra vez.

Cuarto, intentamos acceder manualmente a la URL /dashboard-medico escribiéndola en la barra del navegador. El RoleRoute detectó que nuestro rol era PATIENT y no DOCTOR, y nos redirigió de vuelta a la página principal, validando que el control de acceso funcionaba.

Quinto, cerramos sesión con el botón Logout en el Navbar. Verificamos que localStorage se limpiaba y que la aplicación nos llevaba de vuelta al Login.

Sexto, intentamos iniciar sesión con la cuenta recién creada usando el Login. Funcionó correctamente, llevándonos otra vez al DashboardPaciente.

Séptimo, intentamos registrar otra cuenta con el mismo email para verificar que el error de duplicado se mostraba correctamente. El backend devolvió el error 409 con el mensaje esperado y el componente Register lo mostró en la caja roja.

Octavo, intentamos iniciar sesión con una contraseña incorrecta. El backend devolvió el error 401 genérico y el componente Login lo mostró correctamente.

Todos los escenarios funcionaron como esperábamos. Con esto dimos por cerrada la HU3 en sus aspectos centrales, dejando solo la creación de cuentas de médico desde el panel administrativo como pendiente menor para el Sprint 3.

## Aprendizajes que dejó la HU3

Construir esta historia nos dejó varios aprendizajes que aplicamos al resto del sprint.

Primero, la separación en capas (controlador, servicio, repositorio) hace que el código sea mucho más mantenible. Aunque al principio parecía agregar burocracia, después se demostró que facilita mucho los cambios y las pruebas.

Segundo, la decisión de hashear las contraseñas con bcrypt desde el día uno nos dejó tranquilos respecto a la seguridad. Habría sido más rápido guardar las contraseñas en texto plano y agregar el hashing después, pero esa práctica es siempre una mala idea.

Tercero, el AuthContext con persistencia en localStorage demostró ser una pieza arquitectónica clave, dado que después fue usado por casi todos los componentes que construimos en el resto del sprint.

Cuarto, el RoleRoute nos enseñó que la seguridad debe aplicarse en múltiples capas. El frontend protege la experiencia visual, pero el backend es donde vive la seguridad real.

Quinto, las pruebas integradas end-to-end son fundamentales antes de dar por cerrada una historia. Probar cada pieza individualmente no garantiza que el flujo completo funcione, dado que es en las uniones entre piezas donde suelen aparecer los problemas más sutiles.
