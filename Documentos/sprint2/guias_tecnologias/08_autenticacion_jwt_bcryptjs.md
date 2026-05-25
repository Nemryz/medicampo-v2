# Guía sobre Autenticación con JWT y bcryptjs en mediCampo v2

Este documento explica desde lo más básico cómo funciona la autenticación en mediCampo v2, qué son las dos librerías centrales que usamos para ello (jsonwebtoken y bcryptjs) y por qué cada una resuelve una parte específica del problema. La idea es que cualquier integrante del equipo entienda los principios de seguridad detrás del sistema de inicio de sesión y por qué las decisiones que tomamos protegen efectivamente a los usuarios del sistema.

## El problema general de la autenticación

Antes de hablar de las herramientas específicas, conviene entender qué problema estamos resolviendo cuando construimos un sistema de autenticación.

Cuando una persona quiere acceder a un sistema digital, necesitamos hacer dos cosas distintas. La primera es identificar quién dice ser, es decir, recibir un nombre de usuario, correo electrónico o algún otro identificador. La segunda es verificar que efectivamente sea esa persona, no alguien que se está haciendo pasar por ella. Esta segunda parte es la autenticación propiamente tal, y la forma más común de hacerla es pidiendo una contraseña que solo el dueño legítimo de la cuenta debería conocer.

Sin embargo, manejar contraseñas correctamente es complicado y se ha vuelto una de las áreas más sensibles del desarrollo web, dado que un error aquí puede comprometer la seguridad de miles de usuarios. Hay dos problemas centrales que cualquier sistema serio debe resolver.

El primer problema es cómo almacenar las contraseñas de forma segura, esto es, que aunque alguien logre acceder al contenido de la base de datos, no pueda recuperar las contraseñas originales de los usuarios.

El segundo problema es cómo mantener la sesión del usuario después del login inicial, esto es, que no tengamos que pedirle la contraseña en cada petición HTTP que hace, pero al mismo tiempo evitando que un atacante pueda hacerse pasar por él.

Para el primer problema usamos bcryptjs. Para el segundo usamos JWT. Veamos cada uno en detalle.

## bcryptjs y el hashing de contraseñas

### Por qué nunca guardar contraseñas en texto plano

Lo primero que hay que entender es que jamás se deben guardar las contraseñas en texto plano dentro de la base de datos, esto es, tal como las escribió el usuario. Las razones son varias y todas críticas.

Primero, si alguien logra acceder a la base (ya sea un atacante externo o incluso un empleado interno con malas intenciones), tendría inmediatamente acceso a todas las cuentas del sistema.

Segundo, muchas personas reutilizan la misma contraseña en múltiples sitios. Si nuestra base se filtra con contraseñas en texto plano, esas contraseñas también funcionarían en los correos electrónicos, redes sociales y cuentas bancarias de los usuarios, multiplicando el daño.

Tercero, incluso si confiamos absolutamente en nuestros propios desarrolladores, la responsabilidad legal y ética es enorme, dado que cualquier filtración podría tener consecuencias graves para los usuarios.

### Qué es una función hash

Una función hash es un algoritmo matemático que toma una entrada de cualquier tamaño y produce una salida de tamaño fijo, con la propiedad de que es prácticamente imposible reconstruir la entrada original a partir de la salida. Esto se conoce como propiedad de unidireccionalidad.

Por ejemplo, si aplicamos una función hash a la palabra contraseña123, obtenemos algo como abc123def456ghi789. Si después le pasamos otra vez la misma palabra al hash, obtenemos exactamente el mismo resultado abc123def456ghi789. Pero si solo tenemos abc123def456ghi789, no hay forma matemática de recuperar contraseña123 sin probar todas las posibilidades, lo cual sería computacionalmente prohibitivo para contraseñas mínimamente complejas.

La idea entonces es no guardar la contraseña original en la base, sino solo su hash. Cuando el usuario inicia sesión, le aplicamos el hash a la contraseña que ingresó y comparamos el resultado con el hash almacenado. Si coinciden, sabemos que la contraseña es correcta, sin haber guardado nunca la contraseña original.

### Qué es bcrypt y por qué bcryptjs

bcrypt es una función hash diseñada específicamente para contraseñas, creada en 1999. A diferencia de las funciones hash genéricas como MD5 o SHA-256, bcrypt tiene varias propiedades pensadas para la seguridad de contraseñas.

Primero, bcrypt incorpora un salt, esto es, un valor aleatorio único que se agrega a cada contraseña antes de hashearla. El salt evita que dos usuarios con la misma contraseña tengan el mismo hash en la base, lo cual frustra los ataques de rainbow tables (tablas precomputadas de hashes comunes).

Segundo, bcrypt es deliberadamente lento, con un parámetro llamado salt rounds o work factor que controla cuántas iteraciones se aplican. Mientras más alto el número, más tiempo toma generar el hash y, por lo mismo, más lento es para un atacante intentar adivinar contraseñas por fuerza bruta. En mediCampo v2 usamos 10 rounds, que es un balance razonable entre seguridad y rendimiento.

Tercero, bcrypt se adapta al hardware moderno. A medida que los computadores se vuelven más rápidos, simplemente se puede aumentar el parámetro de rounds para mantener el mismo nivel de protección.

bcryptjs es una implementación de bcrypt escrita en JavaScript puro, lo cual significa que funciona en Node.js sin necesidad de compilación nativa. Esto facilita el despliegue en distintos ambientes, aunque es ligeramente más lenta que la versión nativa bcrypt.

### Cómo usamos bcryptjs en mediCampo v2

En el endpoint POST /api/auth/register, cuando un nuevo usuario se registra, ejecutamos el hashing de la contraseña antes de guardarla. El código simplificado sería algo así. Importamos bcrypt desde bcryptjs. Luego, dentro del servicio AuthService, llamamos a bcrypt.hash pasándole la contraseña original y el número de rounds (10). Esta función devuelve una promesa con el hash resultante, que luego pasamos al repositorio para almacenarlo en la base.

En el endpoint POST /api/auth/login, cuando un usuario intenta iniciar sesión, ejecutamos la comparación. Primero buscamos al usuario por email en la base, lo cual nos devuelve el hash almacenado. Luego llamamos a bcrypt.compare pasándole la contraseña ingresada y el hash almacenado. Esta función devuelve una promesa con un booleano, esto es, verdadero si coinciden o falso si no. Basándonos en este resultado, decidimos si proceder con la generación del token o retornar un error 401.

Es importante notar que la función bcrypt.compare hace internamente el mismo proceso de hashing pero con el salt que estaba embebido en el hash original, garantizando que comparamos hashes equivalentes sin que tengamos que preocuparnos por gestionar el salt manualmente.

## JWT y la gestión de sesiones

### El problema de mantener la sesión

Una vez que el usuario inició sesión exitosamente, surge una pregunta nueva, esto es, cómo hacemos para que en las peticiones siguientes el sistema sepa que sigue siendo el mismo usuario, sin tener que pedirle la contraseña cada vez. Hay dos enfoques tradicionales para resolver esto.

El primer enfoque es usar sesiones con estado en el servidor, esto es, el servidor genera un identificador de sesión aleatorio, lo guarda en una base de datos junto con la información del usuario, y se lo envía al cliente en una cookie. En cada petición siguiente, el cliente envía la cookie con el identificador, y el servidor busca en su base la sesión correspondiente para recuperar quién es el usuario. Este enfoque funciona pero tiene el problema de que requiere que el servidor mantenga un estado en memoria o en base, lo cual complica el escalamiento horizontal (correr múltiples instancias del servidor en paralelo).

El segundo enfoque es usar tokens autocontenidos, donde el propio token lleva la información del usuario firmada criptográficamente, sin necesidad de que el servidor mantenga ningún estado. Este es el enfoque que usamos con JWT.

### Qué es un JWT

JWT son las siglas de JSON Web Token, un estándar abierto definido en la RFC 7519 que describe un formato compacto y seguro para transmitir información entre partes en forma de un objeto JSON firmado.

Un JWT está compuesto por tres partes separadas por puntos, esto es, header.payload.signature. Cada parte está codificada en base64url, lo cual la hace fácil de transportar en URLs, headers HTTP o cuerpos JSON.

El header contiene información sobre el tipo de token (JWT) y el algoritmo de firma usado, por ejemplo HS256 para HMAC con SHA-256.

El payload contiene las claims, esto es, las afirmaciones sobre el usuario que el token transmite. Hay claims estándar como sub (subject, el identificador del usuario), iat (issued at, cuándo se emitió) y exp (expiration, cuándo expira), junto con claims personalizadas que cada aplicación define según sus necesidades.

La signature es la firma criptográfica que se calcula tomando el header y el payload, junto con una clave secreta que solo el servidor conoce. Esta firma garantiza que el token no fue alterado en tránsito y que efectivamente fue emitido por el servidor.

### Cómo funciona la verificación

Cuando el servidor recibe un JWT en una petición posterior, ejecuta el siguiente proceso. Decodifica el header y el payload del token. Recalcula la firma usando la misma clave secreta. Compara la firma recalculada con la firma incluida en el token. Si coinciden, el token es válido y la información del payload es confiable. Si no coinciden, el token fue alterado o no fue emitido por este servidor, por lo cual se rechaza la petición.

Adicionalmente, el servidor verifica que el token no haya expirado comparando la claim exp con la hora actual. Si el token expiró, se rechaza incluso si la firma es válida.

### Por qué JWT funciona sin estado

La belleza de JWT es que toda la información necesaria está dentro del propio token, esto es, el servidor no necesita guardar nada en su base ni en memoria para verificarlo. Esto significa que múltiples instancias del servidor pueden verificar tokens emitidos por cualquiera de ellas, siempre y cuando compartan la misma clave secreta.

Esto también significa que invalidar un token antes de su expiración es más complicado, dado que el servidor no tiene una lista de tokens activos a la que pueda quitar el token comprometido. Las estrategias para esto incluyen mantener una lista negra de tokens revocados (lo cual reintroduce algo de estado), usar tokens de corta duración con refresh tokens, o simplemente cambiar la clave secreta cuando se necesita invalidar todos los tokens.

### Cómo usamos JWT en mediCampo v2

En el endpoint POST /api/auth/login, después de verificar exitosamente la contraseña con bcrypt, generamos un JWT que se devuelve al cliente. El código simplificado sería algo así. Importamos jwt desde jsonwebtoken. Construimos el payload con los datos relevantes del usuario, esto es, un objeto con las claves sub (el id del usuario), role (su rol) y name (su nombre). Llamamos a jwt.sign pasándole el payload, la clave secreta (que viene de la variable de entorno JWT_SECRET) y opciones como la duración (por ejemplo expiresIn 10m). Esta función devuelve el token como un string que enviamos al cliente.

El cliente guarda este token en localStorage bajo la clave medicampo_token, junto con el objeto usuario bajo la clave medicampo_user. En cada petición posterior, el cliente incluye el token en el header Authorization con el formato Bearer seguido del token.

En el backend tenemos un middleware llamado protect (en backend/src/middleware/authMiddleware.ts) que se ejecuta antes de los handlers de las rutas protegidas. Este middleware extrae el token del header, llama a jwt.verify pasándole el token y la misma clave secreta, y si la verificación es exitosa, agrega el payload decodificado al objeto request como req.user. Si la verificación falla (token inválido, expirado o ausente), retorna un error 401 Unauthorized y la petición no llega al handler.

A partir de ese momento, cualquier handler que se ejecute después del middleware puede acceder a req.user para saber quién es el usuario autenticado, sin tener que verificar el token nuevamente.

### Configuración centralizada de JWT

Para mantener la configuración limpia, centralizamos los parámetros de JWT en el archivo backend/src/config/jwt.ts. Este archivo exporta la clave secreta (leída desde la variable de entorno JWT_SECRET) y las opciones por defecto como la duración de los tokens. Esto facilita cambiar la configuración en un solo lugar si en el futuro queremos ajustar algún parámetro.

## Buenas prácticas de seguridad que aplicamos

Más allá del uso correcto de las librerías, hay varias prácticas de seguridad que aplicamos en mediCampo v2 para fortalecer la autenticación.

Nunca enviamos las contraseñas como parte de las URLs ni las dejamos en logs del servidor. Solo viajan en el cuerpo de las peticiones POST, sobre HTTPS, y se descartan inmediatamente después de la verificación.

Cuando el login falla, devolvemos siempre el mismo mensaje genérico sin especificar si el problema fue el email o la contraseña. Esto evita dar pistas a un atacante que esté intentando enumerar correos válidos.

Los tokens JWT tienen una duración limitada (típicamente entre 10 minutos y unas pocas horas), de modo que aunque un token se filtre, el daño potencial está acotado en el tiempo.

La clave secreta JWT_SECRET nunca se commitea al repositorio Git. Vive en el archivo .env que está incluido en .gitignore, y se configura como secret en el servidor de producción.

Toda la comunicación entre el frontend y el backend va sobre HTTPS, lo cual cifra los tokens y contraseñas en tránsito. En el caso de LiveKit, también usamos WebSocket seguro (WSS) sobre TLS.

Aplicamos validación adicional de propiedad en los endpoints sensibles. Por ejemplo, cuando el médico actualiza el estado de una cita, no basta con que tenga un token válido, sino que además verificamos que la cita le pertenezca, evitando que un médico autenticado pueda modificar citas ajenas.

## Recursos para profundizar

Para los integrantes que quieran aprender más sobre seguridad en autenticación, OWASP (Open Web Application Security Project) tiene guías excelentes en owasp.org, especialmente la Cheat Sheet sobre almacenamiento de contraseñas y la sobre tokens JWT.

Para profundizar en JWT específicamente, el sitio jwt.io es una referencia obligada, con un depurador interactivo donde se pueden decodificar tokens y entender su estructura.

Para bcrypt, el paper original de su creador Niels Provos titulado A Future-Adaptable Password Scheme es lectura técnica avanzada pero muy ilustrativa de las decisiones de diseño detrás del algoritmo.

Una recomendación final es nunca implementar criptografía propia, esto es, siempre usar librerías bien probadas y mantenidas por la comunidad como bcryptjs y jsonwebtoken. La criptografía es un área donde las pequeñas fallas tienen consecuencias enormes, y reinventar la rueda casi siempre termina mal.
