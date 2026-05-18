# Plan de Implementación — mediCampo v2

Este documento consolida el estado completo del proyecto mediCampo v2, tarea por tarea, historia por historia, cubriendo lo que ya funciona, lo que está a la mitad y lo que falta construir desde cero. Está pensado para ser leído antes de cualquier sesión de trabajo, de modo que cualquier desarrollador que lo abra pueda saber exactamente dónde está parado el proyecto, qué hacer primero y cómo ejecutar cada paso sin depender de memoria ni de otra fuente externa.

El orden de lectura sigue las épicas y las historias de usuario tal como están definidas en Documentos/informacion_del_proyecto/historias_de_usuario.md, pero incorpora observaciones sobre la calidad de ese documento, referencias directas a los archivos de código y las credenciales verificadas de la infraestructura activa en DigitalOcean.

---

## Infraestructura activa y credenciales verificadas

Antes de ejecutar cualquier tarea es necesario entender sobre qué servidores corre el sistema actualmente, qué credenciales existen y cuáles están vigentes.

### Servidor LiveKit en DigitalOcean

El servidor de videollamadas corre en un Droplet de DigitalOcean con las siguientes características:

- Dirección IP del Droplet: 138.197.205.30
- Nombre del Droplet: marketplace-s-1vcpu-2gb-sfo2
- Sistema operativo: Ubuntu 22.04.5 LTS con Docker preinstalado
- Dominio principal: medicampo-rtc.duckdns.org (apunta a la IP anterior)
- Dominio TURN: medicampo-turn.duckdns.org (apunta a la misma IP)
- URL del servidor LiveKit: wss://medicampo-rtc.duckdns.org
- Versión de LiveKit: 1.11.0
- Proxy SSL: Caddy, que obtiene certificados automáticamente de Let's Encrypt
- Usuario SSH: root, autenticación por clave pública

Paso a paso para acceder a la terminal del servidor y verificar credenciales:

Paso 1. Abrir una terminal en la máquina local. En Windows se puede usar PowerShell, Git Bash o el terminal integrado de VS Code. En macOS o Linux se abre la Terminal del sistema.

Paso 2. Ejecutar el siguiente comando para iniciar la conexión SSH al servidor:

ssh root@138.197.205.30

La clave pública registrada en el servidor corresponde a:
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPYN9gCRgOnNFxM0zywEieB4wf1zx+u3gAgtfr9UMcOr ignac@PC_Nasu

La conexión solo funciona desde la máquina llamada "PC_Nasu" porque esa es la máquina que tiene la clave privada correspondiente a esa clave pública. Si la conexión es exitosa, el terminal cambia y muestra un prompt del estilo root@marketplace-s-1vcpu-2gb-sfo2:~# lo que indica que ya se está dentro del servidor.

Paso 3. Si es la primera vez que se conecta desde esa máquina, el sistema pregunta:

Are you sure you want to continue connecting (yes/no/[fingerprint])?

Escribir yes y presionar Enter. Esto agrega el servidor a la lista de hosts conocidos y no vuelve a preguntar en conexiones futuras desde esa misma máquina.

Paso 4. Si la conexión falla con el mensaje "Permission denied (publickey)", significa que la máquina desde la que se intenta conectar no tiene la clave privada correcta. En ese caso hay dos opciones: conectarse desde la consola web de DigitalOcean (ver el paso alternativo al final de esta sección) o agregar la clave pública de la nueva máquina al servidor.

Paso 5. Una vez dentro del servidor, verificar que los contenedores Docker están corriendo:

docker ps

La salida debe mostrar al menos dos contenedores activos. El primero es el servidor LiveKit con imagen livekit/livekit-server y el segundo es Caddy con imagen caddy. Si alguno no aparece en la lista, significa que se cayó y hay que levantarlo nuevamente con el comando del paso siguiente.

Paso 6. Si algún contenedor no está corriendo, levantarlo con:

cd /root/medicampo-rtc.duckdns.org && docker compose up -d

El flag -d indica que los contenedores se inician en segundo plano. Ejecutar docker ps nuevamente para confirmar que ya están activos.

Paso 7. Ver las claves de API activas que el servidor LiveKit está usando actualmente:

cat /root/medicampo-rtc.duckdns.org/livekit.yaml

La sección keys del archivo muestra las claves en el formato:

keys:
  API_KEY_AQUI: SECRETO_AQUI

Esas son las únicas claves válidas para ese servidor. Cualquier token generado con claves distintas será rechazado con error 401 o 403 cuando el cliente intente conectarse a la sala.

Paso 8. Ver las variables de entorno que el contenedor de LiveKit está usando en este momento:

docker inspect livekit-server | grep -A 20 '"Env"'

Paso 9. Ver los logs recientes del servidor LiveKit para detectar errores de conexión, tokens rechazados o problemas de SSL:

docker logs livekit-server --tail 50

El flag --tail 50 muestra solo las últimas 50 líneas. Si se quiere seguir los logs en tiempo real mientras se prueba la videollamada, agregar el flag -f:

docker logs livekit-server -f

Para detener el seguimiento en tiempo real, presionar Ctrl + C.

Paso 10. Verificar que el certificado SSL de Caddy está vigente y que el dominio DuckDNS apunta correctamente a la IP del servidor:

docker logs caddy-server --tail 30

Si el certificado está bien, los logs muestran líneas como "certificate obtained successfully" o "serving" sin errores. Si hay errores de tipo "failed to obtain certificate", significa que el dominio DuckDNS no está apuntando a la IP correcta o que el puerto 80 está bloqueado en el firewall.

Paso 11. Verificar desde el servidor que el dominio DuckDNS resuelve a la IP correcta:

curl -s "api.duckdns.org/info.php?domains=medicampo-rtc"

Alternativamente, desde el servidor también se puede hacer un ping al propio dominio:

ping medicampo-rtc.duckdns.org -c 4

La IP que devuelve debe ser 138.197.205.30. Si devuelve otra IP, hay que actualizar el registro DNS en la cuenta de DuckDNS.

Paso 12. Para salir del servidor y volver a la terminal local, ejecutar:

exit

Paso alternativo — Acceso desde la consola web de DigitalOcean si SSH no funciona:

Cuando no es posible conectarse por SSH desde la terminal local, DigitalOcean ofrece una consola web integrada. Para usarla, ir al panel de control en cloud.digitalocean.com, hacer clic en "Droplets" en el menú izquierdo, seleccionar el Droplet llamado "marketplace-s-1vcpu-2gb-sfo2" con IP 138.197.205.30, hacer clic en el botón "Console" que aparece en la parte superior derecha del panel del Droplet, y esperar a que cargue el terminal web. Ingresar como usuario root. Desde esa consola se pueden ejecutar todos los comandos de los pasos anteriores de la misma forma que desde una terminal local.

Si se quiere conectar desde otra máquina por SSH en el futuro, se puede agregar su clave pública al servidor ejecutando dentro de la consola web:

echo "ssh-ed25519 CLAVE_PUBLICA_DE_LA_NUEVA_MAQUINA usuario@nombre" >> /root/.ssh/authorized_keys

### Credenciales de la API de LiveKit — situación actual

Se detectaron dos conjuntos de claves de LiveKit en los archivos del escritorio. El primero corresponde a las claves que actualmente están en el archivo livekit.yaml del servidor según los registros de despliegue anteriores:

Clave API vieja (LiveKitt.txt): APIQGDQzr8pgWX4
Secreto API viejo: ly5Xjur3ZqMTSYHkUfxMevKXeg5isvawOodby4fz2luC

El segundo conjunto fue generado más recientemente por el asistente de configuración de LiveKit Cloud o del propio servidor, y se encuentra en command.txt:

Clave API nueva (command.txt): APIFDpTohrspFM8
Secreto API nuevo: 7kwWxVnPRAiUovmIXlJ8jswCJfVCQDO8oIqyV5K3N2J

Esta discrepancia requiere verificación antes de continuar cualquier trabajo en la videollamada. El conjunto que está activo en el archivo /root/livekit.yaml del servidor es el que define cuál de los dos funciona. Para verificarlo, se conecta al servidor y se ejecuta:

cat /root/medicampo-rtc.duckdns.org/livekit.yaml

El resultado mostrará las claves que el servidor está usando para firmar y verificar tokens. El backend de mediCampo en backend/.env debe usar exactamente las mismas claves que aparezcan en ese archivo, porque si las claves no coinciden los tokens generados por el backend son rechazados por el servidor y la videollamada no abre.

### Backend desplegado en DigitalOcean

El backend está desplegado como DigitalOcean App Platform Web Service en la URL:
https://medicampo-api-cvqas.ondigitalocean.app

Las variables de entorno que ese servicio necesita están definidas en el panel de DigitalOcean App Platform. Los valores locales de desarrollo están en el archivo backend/.env que no está en el repositorio (está en .gitignore). El archivo backend/.env.example muestra la estructura esperada:

PORT=5000
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require
JWT_SECRET=clave_secreta_para_firmar_jwt
FRONTEND_URL=https://medicampo-frontend.ondigitalocean.app

A esas variables hay que agregarles las de LiveKit para que el backend pueda generar tokens:

LIVEKIT_API_KEY=la_clave_que_coincida_con_el_servidor
LIVEKIT_API_SECRET=el_secreto_que_coincida_con_el_servidor
LIVEKIT_URL=wss://medicampo-rtc.duckdns.org

### Frontend desplegado en DigitalOcean

El frontend está desplegado como DigitalOcean Static Site. La URL del sitio estático no fue registrada en los documentos del proyecto pero se puede obtener desde el panel de App Platform. El archivo frontend/.env actual tiene los siguientes valores para desarrollo local:

VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_LIVEKIT_URL=wss://medicampo-rtc.duckdns.org

En producción, VITE_API_URL debe apuntar a https://medicampo-api-cvqas.ondigitalocean.app y eso se configura en las variables de entorno del Static Site dentro del panel de DigitalOcean, no en el archivo local.

### Puertos que deben estar abiertos en el firewall del Droplet

Para que la videollamada funcione correctamente, el firewall de DigitalOcean que protege el Droplet debe tener los siguientes puertos abiertos:

Puerto 80 TCP: necesario para que Caddy pueda obtener los certificados SSL de Let's Encrypt durante la emisión o renovación.
Puerto 443 TCP: para el tráfico HTTPS y para la señalización WebSocket segura wss://.
Puerto 7881 TCP: para WebRTC sobre TCP, que se usa cuando los puertos UDP están bloqueados por el ISP del usuario.
Puerto 3478 UDP: para el servidor TURN que relay el tráfico cuando hay NAT estricto.
Puertos 50000 a 60000 UDP: para los flujos de media de WebRTC. Este rango es el más crítico. Si está cerrado, la señalización funciona pero el video y audio no aparecen. El síntoma es una pantalla negra con las cajas de video vacías a pesar de que la conexión parece establecida.

Para verificar el estado del firewall se va al panel de DigitalOcean, se selecciona Networking, luego Firewalls, y se comprueba que las reglas entrantes cubran todos esos puertos.

---

## Épica 1 — Acceso, autenticación y gestión de usuarios

Esta épica cubre todo lo relacionado con cómo el sistema identifica a sus usuarios, cómo protege las rutas y cómo diferencia el acceso según el rol de cada cuenta.

---

### HU00 — Preparación técnica del entorno full-stack

Estado actual: parcialmente completado

Lo que está hecho: el repositorio Git existe de forma independiente, desvinculado de Bolt.new. El servidor Express arranca correctamente con los middlewares de CORS y JSON registrados en backend/src/server.ts. La base de datos PostgreSQL en DigitalOcean está provisionada y Prisma puede sincronizar el schema con el comando npx prisma db push. El frontend corre como proyecto Vite independiente en la carpeta frontend/ con su propio package.json. Las variables de entorno están documentadas en backend/.env.example. El backend corre dentro de Docker según los registros de despliegue.

Lo que falta completar:

Tarea T00.5 — ESLint, Prettier y Husky:

Paso 1. Instalar las dependencias de desarrollo en el backend:
cd backend && npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser husky lint-staged

Paso 2. Crear el archivo backend/.eslintrc.json con la configuración base para TypeScript:
{
  "parser": "@typescript-eslint/parser",
  "extends": ["plugin:@typescript-eslint/recommended", "prettier"],
  "plugins": ["@typescript-eslint", "prettier"],
  "rules": { "prettier/prettier": "error" }
}

Paso 3. Crear el archivo backend/.prettierrc con las reglas de formato:
{ "semi": true, "singleQuote": true, "tabWidth": 2, "trailingComma": "es5" }

Paso 4. Hacer lo mismo en el frontend con npm install --save-dev eslint prettier eslint-plugin-react eslint-plugin-react-hooks.

Paso 5. Inicializar Husky desde la raíz del repositorio:
npx husky init

Paso 6. Agregar el hook de pre-commit en el archivo .husky/pre-commit:
cd backend && npm run lint
cd frontend && npm run lint

Paso 7. Agregar el script "lint" en cada package.json:
En backend: "lint": "eslint src --ext .ts"
En frontend: "lint": "eslint src --ext .ts,.tsx"

Paso 8. Probar que el hook funciona haciendo un commit con código que viole las reglas, y verificar que el commit es bloqueado.

Tarea T00.6 — Carga de datos del excel:

Esta tarea requiere que el equipo tenga el archivo excel con los datos reales de especialidades y médicos. El proceso consiste en leer ese archivo desde Node.js usando una librería como xlsx, transformar cada fila en el formato que espera el schema de Prisma y ejecutar prisma.user.createMany o una serie de upserts dentro de un script separado al seed.ts actual. Este trabajo solo puede comenzar cuando se tenga el excel de referencia.

---

### HU03 — Registro e inicio de sesión y administración de cuentas

Estado actual: parcialmente completado

Lo que está hecho: los endpoints POST /api/auth/register y POST /api/auth/login funcionan correctamente. El registro valida duplicados de email y RUT, hashea la contraseña con bcryptjs usando 10 rondas de salt y almacena el usuario con rol PATIENT por defecto. El login compara con bcrypt.compare y genera un JWT firmado con la clave configurada en JWT_CONFIG. El token JWT tiene un payload con los campos sub (id del usuario), role y name. El AuthContext en frontend/src/context/AuthContext.tsx persiste el token y el objeto usuario en localStorage bajo las claves medicampo_token y medicampo_user. Los formularios Login.tsx y Register.tsx funcionan y llaman a los endpoints correctamente.

Lo que falta completar:

Tarea T03.6 — Formulario de creación de médicos en el panel de administración:

Esta es la tarea pendiente más importante de esta historia porque sin ella el sistema no puede incorporar nuevos médicos en producción sin acceso directo a la base de datos.

Paso 1. En el backend, crear un nuevo endpoint POST /api/auth/admin/create-doctor dentro de authRoutes.ts, protegido por el middleware protect de authMiddleware.ts. Este endpoint solo debe ser accesible con rol ADMIN.

Paso 2. En el authController.ts agregar la función createDoctor que recibe del cuerpo de la petición los campos name, email, rut, password y specialtyId. La función verifica que el rol del usuario autenticado (req.user.role) sea ADMIN antes de proceder. Si no lo es, lanza AppError con código 403.

Paso 3. En el AuthService.ts agregar el método createDoctor que sigue el mismo flujo que register: verifica duplicados de email y RUT, hashea la contraseña con bcrypt, y llama a userRepository.create pasando el rol DOCTOR y el specialtyId. La diferencia clave es que este método acepta el parámetro role, cosa que register no hace deliberadamente.

Paso 4. En el frontend, dentro de DashboardAdmin.tsx, agregar un estado showDoctorForm que controla la visibilidad del formulario. Crear el componente del formulario con campos para nombre, RUT, email, contraseña temporal y selector de especialidad. El selector de especialidad debe cargar las opciones desde GET /api/appointments/doctors para obtener las especialidades disponibles (o bien desde un nuevo endpoint GET /api/specialties si se crea uno específico).

Paso 5. Al enviar el formulario, llamar a POST /api/auth/admin/create-doctor con apiFetch de frontend/src/lib/api.ts pasando los datos del formulario en el cuerpo. Si la respuesta es exitosa, mostrar una confirmación y refrescar la lista de estadísticas con fetchStats.

Paso 6. Añadir validación en el formulario del frontend: el email debe tener formato válido, el RUT debe coincidir con el formato chileno (dígito verificador incluido), la contraseña debe tener al menos 8 caracteres, y la especialidad debe estar seleccionada.

Tarea T03.7 — Rediseño de las pantallas de login y registro con Material UI:

Paso 1. Instalar Material UI en el frontend:
cd frontend && npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

Paso 2. Reemplazar los estilos de clase Tailwind de Login.tsx por los componentes TextField, Button, Paper, Typography y Box de Material UI. El layout general de la pantalla de login debe centrar el formulario vertical y horizontalmente, con el logo de mediCampo en la parte superior, seguido del título y los dos campos de entrada.

Paso 3. Hacer lo mismo con Register.tsx, donde además hay campos adicionales para el nombre y el RUT. Agregar validación inline de Material UI con el prop error y helperText en los TextField.

Paso 4. Definir un tema personalizado de Material UI en un archivo frontend/src/theme.ts que use la paleta de colores del sistema: verde esmeralda para los botones primarios, blanco para los fondos de formulario y gris claro para los bordes.

---

### HU06 — Panel de administración

Estado actual: parcialmente completado

Lo que está hecho: el endpoint GET /api/clinical/admin/stats devuelve en una sola respuesta el total de pacientes, total de médicos, total de citas, citas completadas y las últimas 10 citas. La verificación de rol ADMIN ocurre en el controlador antes de llamar al servicio. El DashboardAdmin.tsx muestra los cuatro KPIs principales con íconos y el log de actividad reciente. El endpoint DELETE /api/appointments/all elimina todas las citas y el botón "Limpiar Todas las Citas" en el dashboard lo invoca con una confirmación de tipo window.confirm.

Lo que falta completar:

Tarea T06.5 — Sistema de auditoría:

Paso 1. En backend/prisma/schema.prisma agregar el modelo AuditLog:

model AuditLog {
  id        Int      @id @default(autoincrement())
  userId    Int
  action    String
  details   String?
  ip        String?
  createdAt DateTime @default(now())
}

Paso 2. Ejecutar npx prisma db push para crear la tabla en la base de datos, o bien crear una migración con npx prisma migrate dev --name add_audit_log.

Paso 3. Crear el archivo backend/src/repositories/AuditLogRepository.ts que tiene un método create que recibe userId, action, details e ip y ejecuta prisma.auditLog.create.

Paso 4. En el authMiddleware.ts o en los controladores de administración, llamar al AuditLogRepository.create después de cada acción crítica: eliminar todas las citas, crear un médico nuevo, consultar estadísticas.

Paso 5. Crear el endpoint GET /api/admin/audit-logs protegido con rol ADMIN, que devuelve los últimos 50 registros de la tabla AuditLog ordenados por createdAt descendente.

Paso 6. En el DashboardAdmin.tsx agregar una nueva sección "Log de Auditoría" que muestre esos registros con la fecha, la acción, quién la realizó y desde qué IP.

Tarea T06.6 — Interfaz de administración de usuarios:

Esta tarea es la continuación directa de T03.6. Una vez que el endpoint de creación de médicos existe, el dashboard de administración necesita la lista de usuarios activos con opciones de activación y desactivación. Para eso se necesita primero agregar un campo isActive Boolean con valor por defecto true en el modelo User del schema.prisma, luego crear un endpoint PATCH /api/admin/users/:id/status que reciba el valor deseado de isActive, y finalmente reflejar ese campo en el middleware protect para que los usuarios inactivos reciban error 401 aunque su token sea válido.

Tarea T06.2 — Confirmación destructiva mejorada para la limpieza de citas:

El window.confirm actual no es adecuado para una acción que borra datos médicos de forma irreversible. El reemplazo requiere crear un componente ConfirmModal en frontend/src/components/ConfirmModal.tsx que recibe un mensaje, un texto de confirmación requerido (por ejemplo "ELIMINAR") y dos callbacks: onConfirm y onCancel. El modal se muestra como overlay sobre el contenido y solo habilita el botón de confirmación cuando el usuario escribe exactamente el texto requerido en el campo de entrada. En DashboardAdmin.tsx se reemplaza el confirm por el estado showConfirmModal y se renderiza el ConfirmModal condicionalmente.

---

## Épica 2 — Gestión de la atención médica

Esta épica cubre el ciclo completo de una teleconsulta: desde que el paciente busca un médico hasta que el historial clínico queda guardado y disponible para consulta e impresión.

---

### HU04 — Reserva de teleconsulta

Estado actual: completado con mejoras pendientes

Lo que está hecho: el flujo de tres pasos en ReservaCita.tsx funciona correctamente. El componente obtiene la lista de médicos desde GET /api/appointments/doctors, muestra un selector de fecha, ofrece los seis horarios fijos disponibles (09:00, 10:00, 11:30, 14:00, 15:30, 17:00) y llama a POST /api/appointments/book al confirmar. El backend crea la cita con estado PENDING y un meetingLink del formato /room/[hash aleatorio de 7 caracteres]. El médico ve las solicitudes PENDING en DashboardMedico.tsx con botones para aceptar o rechazar mediante PATCH /api/appointments/:id/status.

Lo que falta completar:

Tarea T04.3 — Filtro de especialidades en el selector de médicos:

Actualmente la lista muestra todos los médicos sin posibilidad de filtrar por especialidad. Para implementarlo:

Paso 1. Agregar en el componente ReservaCita.tsx un estado selectedSpecialty y un bloque de botones de filtro generados a partir del array de médicos cargados, extrayendo las especialidades únicas con un Set.

Paso 2. Filtrar el array doctors antes de renderizarlo: doctors.filter(d => selectedSpecialty === null || d.specialty?.name === selectedSpecialty).

Paso 3. Si el proyecto crece en número de especialidades, considerar crear un endpoint GET /api/specialties que devuelva las especialidades directamente desde la tabla Specialty, lo que es más eficiente que derivarlas del listado de médicos.

Tarea T04.8 — Prevención de choques de horario:

Esta es la tarea de corrección más urgente de esta historia porque actualmente dos pacientes pueden reservar con el mismo médico en el mismo horario sin que el sistema lo detecte.

Paso 1. En AppointmentService.ts, dentro del método createAppointment, antes de llamar a this.appointmentRepository.create, agregar una consulta que verifique si ya existe una cita con ese doctorId en ese mismo rango de tiempo. El rango razonable es la misma hora exacta (la cita es de 60 minutos, por lo que el rango de conflicto sería desde date hasta date + 60 minutos).

Paso 2. En AppointmentRepository.ts, agregar el método findConflictingAppointment que recibe doctorId, date y duration y ejecuta:

prisma.appointment.findFirst({
  where: {
    doctorId,
    status: { in: ['PENDING', 'CONFIRMED'] },
    date: { gte: new Date(date.getTime() - duration), lte: new Date(date.getTime() + duration) }
  }
})

Paso 3. Si el método devuelve un resultado, el AppointmentService lanza AppError con código 409 y el mensaje "El médico ya tiene una cita en ese horario. Por favor selecciona otro horario disponible."

Paso 4. En el frontend, en ReservaCita.tsx, el bloque catch del handleBooking ya captura el error y lo muestra en el estado error. Solo hay que asegurarse de que el mensaje del error de la respuesta JSON se propague correctamente.

Tarea T04.10 — Visualización del estado de conflicto de horarios en la interfaz:

Una vez que el backend devuelve el error 409, el componente ReservaCita.tsx debe mostrar los horarios que ya están ocupados de forma diferenciada en la cuadrícula de selección de hora. Para eso:

Paso 1. Crear un nuevo endpoint GET /api/appointments/availability?doctorId=X&date=Y que devuelva la lista de horas ocupadas para ese médico en esa fecha, consultando las citas PENDING y CONFIRMED del día.

Paso 2. En ReservaCita.tsx, cuando el usuario selecciona un médico y una fecha, llamar automáticamente a ese endpoint y almacenar las horas ocupadas en el estado blockedTimes.

Paso 3. En la cuadrícula de horarios, los botones cuya hora esté en blockedTimes se renderizan con clase de color rojo y disabled true, mostrando el texto "Ocupado" en lugar de la hora.

---

### HU01 — Videollamada segura

Estado actual: completado

Lo que está hecho: la videollamada usa LiveKit SFU como servidor de media. El componente Videollamada.tsx coordina el PreFlightCheck, la obtención del token desde GET /api/livekit/token, la conexión a LiveKitRoom con los props token y serverUrl, la renderización de los participantes con EscenarioVideo (GridLayout + ParticipantTile), los controles con ControlesPersonalizados, el indicador de calidad de red con IndicadorCalidadRed y el chat con ChatConsulta. El acceso a cada sala está protegido: LiveKitService verifica que el userId del token JWT corresponda al patientId o doctorId de la cita asociada a ese roomId antes de generar el token de LiveKit.

Verificación de que el servidor LiveKit sigue activo:

Desde la terminal local se puede verificar con:
ssh root@138.197.205.30 "docker ps"

La salida debe mostrar dos contenedores corriendo: livekit-server y caddy-server. Si alguno no aparece, se reinicia con:
ssh root@138.197.205.30 "cd /root && docker compose up -d"

Verificar credenciales activas:
ssh root@138.197.205.30 "cat /root/medicampo-rtc.duckdns.org/livekit.yaml"

Las claves que aparezcan en ese archivo (en los campos key y secret de la sección keys) son las que deben estar en el backend/.env. Si las claves del archivo difieren de las del .env, el servidor rechaza los tokens y la videollamada falla con error 403.

---

### HU07 — Videollamada de alta disponibilidad

Estado actual: completado con optimización pendiente

Lo que está hecho: LiveKit reemplazó completamente a PeerJS. Las opciones adaptiveStream y dynacast están activadas en la instancia de LiveKitRoom en Videollamada.tsx. La lógica de fetchToken reintenta hasta 3 veces con backoff progresivo (2, 4 y 6 segundos) ante errores de respuesta del endpoint de token.

Lo que falta completar:

Tarea T07.5 — Reducción de resolución mínima para redes muy lentas:

LiveKit permite configurar los parámetros de calidad de video directamente en el cliente. Para restringir la resolución mínima en conexiones rurales de baja velocidad:

Paso 1. En Videollamada.tsx, en el momento de crear la instancia de Room o configurar LiveKitRoom, agregar un objeto de opciones de publicación de video que incluya dimensiones máximas reducidas:

const videoOptions = {
  resolution: { width: 640, height: 480, frameRate: 15 },
  simulcast: true
}

Paso 2. Pasar esas opciones a la cámara local mediante el hook useLocalParticipant o a través de las props de publicación de LiveKitRoom.

Paso 3. Con dynacast activo (que ya lo está), LiveKit seleccionará automáticamente la capa de simulcast más adecuada para cada receptor según su ancho de banda disponible.

---

### HU02 — Historial clínico

Estado actual: completado con mejoras de interfaz pendientes

Lo que está hecho: el modelo ClinicalRecord en schema.prisma define todos los campos del acto médico: weight, height, bloodPressure, temperature, heartRate, oxygenSat, allergies, symptoms, diagnosis, prescription y observations. El endpoint POST /api/clinical/:appointmentId verifica que el médico autenticado sea el asignado a esa cita, ejecuta un upsert en ClinicalRecord y marca la cita como COMPLETED de forma secuencial. El paciente puede ver el historial desde /historial y el detalle desde /historial/:appointmentId con el componente HistorialClinico.tsx.

Lo que falta completar:

Tarea T02.4 — Campos de constantes vitales en el formulario de videollamada:

El formulario actual en el panel lateral de Videollamada.tsx solo tiene dos campos: diagnosis y prescription. El modelo de base de datos soporta seis campos adicionales de signos vitales que el médico no puede registrar desde la interfaz.

Paso 1. En el estado formData dentro de Videollamada.tsx, agregar los campos faltantes:

const [formData, setFormData] = useState({
  symptoms: '',
  diagnosis: '',
  prescription: '',
  observations: '',
  allergies: '',
  weight: '',
  height: '',
  bloodPressure: '',
  temperature: '',
  heartRate: '',
  oxygenSat: '',
});

Paso 2. En el formulario del panel lateral (la sección que solo se renderiza para role === 'DOCTOR'), agregar los campos de constantes vitales agrupados en una sección "Signos Vitales" con inputs numéricos para peso, talla, temperatura, frecuencia cardíaca, saturación de oxígeno y un campo de texto para presión arterial (que sigue el formato "120/80").

Paso 3. Ajustar el body de la petición POST /api/clinical/:appointmentId para incluir todos los campos del estado formData.

Paso 4. En el backend, en la interfaz ClinicalRecordDto dentro de IClinicalService.ts, verificar que todos esos campos estén declarados como opcionales para que TypeScript no rechace la compilación.

Tarea faltante no documentada — Edición de ficha clínica ya guardada:

El upsert del backend soporta actualización si ya existe un registro para ese appointmentId, pero la interfaz no expone ningún botón de edición una vez que la cita está COMPLETED. Para implementarlo:

Paso 1. En HistorialClinico.tsx, en la vista de detalle de una consulta, agregar un botón "Editar Ficha" que solo sea visible cuando el usuario autenticado es el médico que realizó esa consulta (comparando user.id con appointment.doctor.id).

Paso 2. Al hacer clic en ese botón, el componente cambia a modo edición mostrando los mismos campos del formulario prellenados con los valores actuales.

Paso 3. Al guardar los cambios, envía POST /api/clinical/:appointmentId (el mismo endpoint con upsert) que actualiza el registro existente. No es necesario un nuevo endpoint.

---

### HU08 — Receta médica imprimible

Estado actual: parcialmente completado

Lo que está hecho: el layout de impresión en HistorialClinico.tsx usa clases no-print para ocultar los controles de navegación. El botón "Imprimir Receta / Ficha" llama a window.print(). El documento imprimible muestra el nombre del médico, su especialidad, el nombre y RUT del paciente, la fecha de la consulta, los signos vitales (si fueron registrados), el diagnóstico y la prescripción.

Lo que falta completar:

Tarea T08.4 — Rediseño tipográfico con fuentes serif y márgenes amplios:

Paso 1. Agregar en el archivo frontend/src/index.css (o en el CSS global del componente) un bloque @media print que establezca la tipografía del documento imprimible:

@media print {
  .print-document {
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: 12pt;
    line-height: 1.5;
    margin: 2.5cm;
    color: #000;
  }
  .print-document h1 { font-size: 18pt; }
  .print-document h2 { font-size: 16pt; }
  .print-document .section-label { font-size: 10pt; text-transform: uppercase; letter-spacing: 0.05em; }
}

Paso 2. Aplicar la clase print-document al contenedor raíz del documento en HistorialClinico.tsx.

Paso 3. Agregar el número de folio al encabezado del documento. El folio puede ser el id de la cita o el appointmentId con formato FOLIO-00001.

Tarea T08.5 y T08.6 — Generación de PDF con html2canvas y jsPDF:

Paso 1. Instalar las librerías:
cd frontend && npm install html2canvas jspdf

Paso 2. En HistorialClinico.tsx, agregar una función handleDownloadPDF que:
- Obtiene la referencia al div del documento con useRef.
- Llama a html2canvas(ref.current, { scale: 2 }) para capturar el contenido con alta resolución.
- Crea una instancia de jsPDF con formato A4 en orientación vertical.
- Calcula las dimensiones para que el contenido llene el ancho de la página.
- Llama a pdf.addImage y luego a pdf.save('receta-medicampo.pdf').

Paso 3. Agregar un botón "Descargar PDF" junto al botón de impresión existente. Ambos botones deben estar dentro de una sección con clase no-print para no aparecer en el documento impreso.

Tarea T08.7 — Envío del PDF por correo electrónico al paciente:

Esta tarea depende de que HU05 (notificaciones) esté parcialmente implementada primero, ya que reutiliza el sistema de correo transaccional. El proceso implica generar el PDF en el servidor (no en el cliente) usando una librería como Puppeteer o una variante de jsPDF para Node.js, guardarlo temporalmente y adjuntarlo al correo de la receta.

Tarea T08.8 — Mejoras de UI para dispositivos móviles:

El botón "Imprimir" tiene sentido en un computador de escritorio pero en un teléfono móvil la impresión directa no es la acción más útil. En dispositivos con pantalla pequeña se debería mostrar el botón de descarga de PDF en lugar del botón de impresión. Esto se resuelve con una condición en el render: si window.innerWidth < 768 o si la constante de diseño mobile es verdadera, mostrar el botón de PDF; en caso contrario mostrar el de impresión.

---

### HU09 — Sincronización automática de identidad en salas

Estado actual: completado con mejora de UI móvil pendiente

Lo que está hecho: el endpoint GET /api/appointments/room/:roomId devuelve la cita completa incluyendo los datos del médico y del paciente. Videollamada.tsx almacena esa cita en el estado appointment y usa el rol del usuario autenticado para decidir qué información mostrar en el panel lateral: el médico ve el nombre y RUT del paciente, el paciente ve el nombre y especialidad del médico.

Tarea T09.5 — Mejorar la UI del panel lateral en móviles:

En dispositivos móviles la pantalla no tiene espacio para mostrar el panel lateral junto al video al mismo tiempo. La solución es convertir el panel en un drawer deslizable que el usuario abre y cierra con un botón flotante.

Paso 1. Agregar un estado sidebarOpen en Videollamada.tsx con valor por defecto false en móviles (detectado con window.innerWidth < 768 al montar el componente).

Paso 2. Renderizar el panel lateral con una clase que lo coloca fuera de la pantalla cuando sidebarOpen es false, y dentro cuando es true, usando una transición CSS de tipo translate.

Paso 3. Agregar un botón flotante en la esquina inferior derecha que dice "Ver Paciente" o "Ver Médico" según el rol, que alterna el valor de sidebarOpen.

---

### HU05 — Notificaciones de cita

Estado actual: pendiente completo

Esta historia no tiene ninguna línea de código implementada. Es la siguiente prioridad después de completar las tareas críticas de HU03 (creación de médicos) y HU04 (prevención de choques). A continuación se describe el proceso completo desde cero.

Paso 1. Elegir el proveedor de correo transaccional. Las dos opciones válidas son Nodemailer (configura un servidor SMTP propio o usa Gmail) y Resend (servicio dedicado a correo transaccional con SDK de Node.js y plan gratuito). Se recomienda Resend porque tiene una API REST simple y no requiere configuración de servidor SMTP. Crear una cuenta en resend.com y obtener la API key.

Paso 2. Instalar el SDK de Resend en el backend:
cd backend && npm install resend

Paso 3. Agregar la variable de entorno RESEND_API_KEY en backend/.env y en las variables de entorno del Web Service de DigitalOcean.

Paso 4. Crear el archivo backend/src/services/NotificationService.ts que encapsula toda la lógica de envío de correos. El constructor recibe la API key de Resend desde las variables de entorno. El método sendAppointmentReminder recibe el correo del paciente, el nombre del médico, la especialidad y la fecha de la cita, y llama a resend.emails.send con un cuerpo HTML que contiene la información formateada.

Paso 5. Crear el archivo backend/src/jobs/reminderJob.ts que implementa el cron job. Para ejecutar cron jobs en Node.js se usa la librería node-cron:
cd backend && npm install node-cron @types/node-cron

Paso 6. En el archivo reminderJob.ts, definir dos programaciones: una que se ejecuta cada hora a los 0 minutos para buscar citas que están a exactamente 24 horas de distancia, y otra que también se ejecuta cada hora para buscar las que están a exactamente 1 hora. La consulta de Prisma que encuentra esas citas tiene el siguiente patrón:

prisma.appointment.findMany({
  where: {
    status: 'CONFIRMED',
    date: {
      gte: new Date(now.getTime() + targetMs - windowMs),
      lte: new Date(now.getTime() + targetMs + windowMs)
    }
  },
  include: { patient: true, doctor: { include: { specialty: true } } }
})

Donde targetMs es 24 * 60 * 60 * 1000 para el primer recordatorio y 60 * 60 * 1000 para el segundo, y windowMs es 30 * 60 * 1000 (ventana de 30 minutos para compensar el drift del cron).

Paso 7. Para evitar enviar el mismo recordatorio dos veces, agregar un campo reminderSent24h Boolean con valor por defecto false y reminderSent1h Boolean con valor por defecto false en el modelo Appointment del schema.prisma, y actualizar esos campos con prisma.appointment.update después de cada envío exitoso.

Paso 8. Registrar el cron job en el arranque del servidor, en backend/src/server.ts, llamando a startReminderJob() después de que el servidor empieza a escuchar. De esta forma el job solo corre mientras el servidor está activo.

Tarea T05.4 — Interfaz de confirmación en el frontend:

Una vez que el sistema envía recordatorios, es útil que el paciente pueda ver en su dashboard si el recordatorio fue enviado. En DashboardPaciente.tsx, junto al badge de estado de la cita, mostrar un ícono de correo con el tooltip "Recordatorio enviado" si los campos reminderSent24h o reminderSent1h de la cita son verdaderos.

Tarea T05.5 — Preferencias de notificación en el perfil del paciente:

Esta tarea requiere crear una vista de perfil de usuario que aún no existe en el sistema. Es la tarea de menor urgencia de esta historia y puede postergarse para un sprint posterior.

---

## Épica 3 — Seguridad del desarrollo y calidad del código

Esta épica cubre las herramientas de seguridad del ciclo de desarrollo. Todas las tareas de esta épica están pendientes y se ejecutan principalmente dentro del editor de código (VS Code) más que en el código del proyecto mismo.

---

### HU11 — 1Password para gestión de secretos

Estado actual: pendiente completo

El problema actual: los archivos de credenciales en el escritorio (command.txt, LiveKitt.txt, SSH.txt) contienen claves de API, secretos y claves SSH en texto plano. Si alguno de esos archivos se comparte por un canal inseguro (correo, WhatsApp, Slack sin cifrado), las credenciales quedan expuestas. Además el archivo backend/.env tiene los valores en texto plano dentro del repositorio local.

Paso 1. Instalar la extensión "1Password — Password Manager" desde el marketplace de VS Code. Buscarla por el publisher "1Password" para evitar instalar extensiones falsas.

Paso 2. Autenticarse en la extensión con la cuenta de 1Password del equipo. Si no existe una cuenta de equipo, crear una en 1password.com (el plan Families o el Teams son los más adecuados para proyectos universitarios y tienen pruebas gratuitas).

Paso 3. Crear una bóveda llamada "mediCampo Producción" dentro de la cuenta de 1Password.

Paso 4. Crear entradas individuales en esa bóveda para cada secreto:
- Entrada "LiveKit Production": URL del servidor, API Key, API Secret.
- Entrada "PostgreSQL DigitalOcean": la DATABASE_URL completa con usuario, contraseña, host, puerto y nombre de la base de datos.
- Entrada "JWT Secret": la clave usada para firmar los tokens JWT.
- Entrada "Resend API Key" (cuando se implemente HU05): la clave del proveedor de correo.
- Entrada "SSH Key mediCampo": la clave privada SSH y la contraseña del servidor.

Paso 5. Reemplazar los valores en texto plano en backend/.env por referencias del formato op://, por ejemplo:
LIVEKIT_API_KEY=op://mediCampo Producción/LiveKit Production/api_key

Paso 6. Para que el servidor de DigitalOcean pueda leer esas referencias, el equipo usa el CLI de 1Password (op) con el comando:
op run --env-file=.env -- node dist/src/server.js

Paso 7. Eliminar los archivos command.txt, LiveKitt.txt y SSH.txt del escritorio una vez que todas las credenciales estén en la bóveda de 1Password. Verificar antes que la bóveda tiene todos los valores correctos.

---

### HU12 — Snyk para escaneo de vulnerabilidades

Estado actual: pendiente completo

Paso 1. Instalar la extensión "Snyk Security" desde el marketplace de VS Code. El ID del publisher es "snyk-security".

Paso 2. Autenticarse con una cuenta gratuita en snyk.io. El plan gratuito incluye análisis de código abierto (SCA) y análisis estático básico (SAST) para repositorios individuales.

Paso 3. Una vez autenticado, VS Code mostrará automáticamente los avisos de Snyk en el panel de problemas. La primera vez puede tardar algunos minutos mientras indexa el proyecto.

Paso 4. Ejecutar también el análisis desde la terminal para obtener un informe completo:
cd backend && npx snyk test
cd frontend && npx snyk test

Paso 5. Revisar cada vulnerabilidad reportada. Las de severidad crítica y alta se corrigen actualizando el paquete afectado a la versión recomendada por Snyk. Las de severidad media se documentan en diagnosticos.md y se planifican para el siguiente sprint.

Paso 6. Para los Dockerfile, ejecutar:
npx snyk container test node:18-alpine

Reemplazando node:18-alpine por la imagen base que use el Dockerfile del backend.

---

### HU13 — CodeQL para análisis estático avanzado

Estado actual: pendiente completo

Paso 1. Instalar la extensión "CodeQL" desde el marketplace de VS Code. El publisher es "GitHub".

Paso 2. Una vez instalada, la extensión requiere descargar la base de datos del proyecto. Desde la paleta de comandos (Ctrl+Shift+P) buscar "CodeQL: Create Database" y seguir el proceso para crear la base de datos local del proyecto TypeScript.

Paso 3. Seleccionar la suite de consultas "Security Extended" para JavaScript y TypeScript. Desde la paleta de comandos buscar "CodeQL: Run Queries in Selected Directory" y seleccionar la carpeta que contiene las queries de seguridad extendida.

Paso 4. Esperar a que el análisis complete. Dependiendo del tamaño del proyecto puede tomar entre 2 y 10 minutos.

Paso 5. Revisar los resultados en el panel de CodeQL. Priorizar los hallazgos en los siguientes archivos críticos:
- backend/src/middleware/authMiddleware.ts: verificar que no hay caminos donde un token inválido llegue al controlador.
- backend/src/controllers/clinicalController.ts: verificar que la verificación de rol ADMIN es inalcanzable sin pasar por el middleware.
- backend/src/services/LiveKitService.ts: verificar que la verificación de cita asignada no puede ser omitida.

Paso 6. Documentar cada hallazgo en Documentos/informacion_del_proyecto/diagnosticos.md bajo la sección HU13, indicando el archivo afectado, la línea, el tipo de vulnerabilidad y la corrección aplicada.

---

### HU14 — Keploy para generación de pruebas automatizadas

Estado actual: pendiente completo

Paso 1. Instalar la extensión "Keploy" desde el marketplace de VS Code.

Paso 2. Configurar Jest en el backend como framework de testing:
cd backend && npm install --save-dev jest @types/jest ts-jest

Paso 3. Crear el archivo backend/jest.config.js:
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts'],
};

Paso 4. Agregar el script en backend/package.json:
"test": "jest"

Paso 5. Crear la carpeta backend/src/__tests__/ donde irán los archivos de test.

Paso 6. Usar Keploy para generar tests del AppointmentService: abrir el archivo backend/src/services/AppointmentService.ts, hacer clic derecho sobre el método createAppointment y buscar la opción "Generate Unit Tests with Keploy". La extensión analiza la firma del método y genera el archivo __tests__/AppointmentService.test.ts con casos de éxito y error.

Paso 7. Repetir el proceso para ClinicalService.saveClinicalRecord y AuthService.login.

Paso 8. Revisar manualmente los tests generados y ajustar los mocks de Prisma para que usen datos del seed (las cuentas admin@medicampo.cl, doctor@medicampo.cl, dra.silva@medicampo.cl, paciente@medicampo.cl con contraseña medicampo123).

Paso 9. Ejecutar npm test para verificar que todos los tests pasan.

Paso 10. Una vez que los tests pasan, integrarlos con el hook de Husky configurado en T00.5 para que se ejecuten en cada commit.

---

### HU15 — SecureCodeGuard para detección en tiempo real

Estado actual: pendiente completo

Paso 1. Instalar la extensión "SecureCodeGuard" desde el marketplace de VS Code.

Paso 2. Autenticarse con la cuenta del equipo y configurar las reglas para TypeScript, JavaScript y React (TSX/JSX).

Paso 3. Con la extensión activa, abrir cada uno de los siguientes archivos y revisar las advertencias que muestre:
- frontend/src/components/auth/Login.tsx
- frontend/src/components/auth/Register.tsx
- frontend/src/components/ReservaCita.tsx
- frontend/src/components/HistorialClinico.tsx

Paso 4. Aplicar las correcciones sugeridas por la extensión para cada advertencia genuina. Si aparecen falsos positivos recurrentes, ajustar la configuración de reglas para excluirlos.

Paso 5. Documentar el resultado en diagnosticos.md bajo la sección HU15.

---

## Verificación general y mejoras identificadas en historias_de_usuario.md

El archivo Documentos/informacion_del_proyecto/historias_de_usuario.md tiene el contenido correcto pero presenta varias inconsistencias de formato y estructura que conviene corregir antes de que el documento crezca más con nuevas historias.

Inconsistencia 1 — El orden de las historias no es secuencial:

El documento presenta las historias en el orden HU00, HU03, HU04, HU01, HU07, HU02, HU08, HU09, HU05, HU06, HU10, HU11 a HU15. Ese orden refleja el orden en que fueron implementadas o discutidas, no el orden numérico de los identificadores. Esto hace difícil encontrar una historia específica cuando se busca por número. La corrección consiste en reordenarlas numéricamente dentro de cada épica: HU00, HU03 en Épica 1, y HU01, HU02, HU04, HU05, HU06, HU07, HU08, HU09, HU10 en Épica 2. Si el reordenamiento genera confusión por el salto de HU01 a HU07, es señal de que el esquema de numeración debería revisarse para que los números sean consecutivos dentro de cada épica.

Inconsistencia 2 — Los encabezados de criterios de aceptación varían entre historias:

Algunas historias usan "Criterios de aceptación:" y otras usan "Criterios de aceptación que deberán cumplirse:". El documento debería usar el mismo encabezado en todas las historias para que sea más fácil encontrar esa sección al leer rápidamente.

Inconsistencia 3 — No todas las historias tienen sección "Implementación en el código":

HU00, HU01, HU07, HU02, HU08, HU09, HU05, HU06, HU10 y todas las de la Épica 3 no tienen esa sección. Solo HU03 y HU04 la tienen. Las historias completadas deberían tener esta sección porque es la más valiosa para quien retoma el trabajo después de un tiempo. Para las historias pendientes, la sección puede llamarse "Flujo esperado" y describir cómo se implementará cuando esté lista.

Inconsistencia 4 — La descripción de HU01 mezcla información técnica desactualizada:

La historia HU01 dice que "el servidor de encriptación de las salas debe ser iniciado manualmente desde la terminal del servidor con npm run dev". Eso es incorrecto: el servidor LiveKit se inicia mediante Docker y no con npm run dev. Esta línea es un residuo de una implementación anterior que debe actualizarse para reflejar que el servidor corre con docker compose up -d.

Inconsistencia 5 — Las historias de la Épica 3 no tienen estimación de esfuerzo ni prioridad:

Las historias HU11 a HU15 están todas marcadas como "pendiente" sin ninguna indicación de cuál ejecutar primero. Sería útil agregar a cada historia un campo de prioridad (alta, media, baja) y una estimación en horas o puntos de historia para poder planificar el sprint correctamente. La prioridad sugerida es: primero HU14 (tests automatizados, porque bloquea la confiabilidad de todo lo demás), luego HU12 (Snyk, porque es el más fácil de instalar y da resultados inmediatos), luego HU13 (CodeQL, análisis más profundo), luego HU11 (1Password, gestión de secretos) y finalmente HU15 (SecureCodeGuard, beneficio incremental sobre los anteriores).

Inconsistencia 6 — La tarea T09.5 de HU09 no tiene detalle de implementación suficiente:

La tarea dice "Mejorar UI de la sala virtual en el entorno móvil y de navegador" pero no describe cómo ni qué componente modificar. Se debería reemplazar esa descripción por el detalle concreto del drawer deslizable descrito en la sección HU09 de este documento.

Inconsistencia 7 — HU04 menciona notificaciones como parte de la historia de reserva:

El concepto de implementación de HU04 dice que "el módulo también contempla notificaciones de recordatorio 24 y 1 hora antes de la teleconsulta". Esa funcionalidad está en HU05, no en HU04. Mezclar el concepto de dos historias diferentes en una sola genera confusión sobre qué está completo y qué no. La descripción de HU04 debería hacer referencia a HU05 en lugar de describir esa funcionalidad.

Inconsistencia 8 — Falta un campo de "Responsable" en cada historia:

Para proyectos con más de un desarrollador, cada historia debería tener un campo que indica quién es el responsable principal de implementarla. Esto no cambia el formato general pero sería una adición útil, especialmente para HU11 a HU15 que son todas pendientes y cualquier miembro del equipo podría tomar.

---

## Orden de trabajo recomendado para el próximo sprint

Las tareas se ordenan aquí según urgencia e impacto en el sistema, considerando dependencias entre ellas.

Primero, T04.8 (prevención de choques de citas): es una falla activa que permite crear citas duplicadas en el mismo horario. Afecta a todos los usuarios del sistema y es corrección de bug, no feature nueva. Tiempo estimado: 3 horas.

Segundo, T03.6 (formulario de creación de médicos desde el admin): sin esta tarea, el sistema no puede incorporar nuevos médicos en producción. Es la funcionalidad operativamente más bloqueante. Tiempo estimado: 6 horas.

Tercero, T02.4 (constantes vitales en el formulario de videollamada): el modelo de base de datos ya soporta estos campos y el backend los acepta, pero el médico no puede completarlos desde la interfaz. Es una mejora de alta visibilidad para los médicos. Tiempo estimado: 4 horas.

Cuarto, verificar las credenciales de LiveKit: comparar las claves en command.txt con las que están en el archivo livekit.yaml del servidor y las que están en el backend/.env del despliegue de DigitalOcean. Si hay discrepancia, actualizar las que corresponda. Tiempo estimado: 1 hora.

Quinto, T08.5 y T08.6 (generación de PDF): el botón de descarga de PDF es la siguiente mejora de mayor valor para los pacientes. Tiempo estimado: 4 horas.

Sexto, HU05 completo (sistema de notificaciones): tiene todas sus tareas pendientes y es una historia entera. Tiempo estimado: 8 horas.

Séptimo, HU14 (Keploy y tests automatizados): se ejecuta en paralelo con el desarrollo de nuevas features, no después. Cada vez que se implementa una tarea nueva se genera el test correspondiente. Tiempo estimado: 4 horas de configuración inicial más 1-2 horas por controlador.

Octavo, HU11, HU12, HU13, HU15: son las herramientas de seguridad del entorno de desarrollo. Se ejecutan en el orden indicado en la sección de la Épica 3.
