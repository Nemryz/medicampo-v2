mediCampo - Plataforma de Telemedicina

mediCampo es una aplicacion full-stack diseñada para gestionar clinicas medicas, agendas de pacientes y proporcionar salas de teleconsulta seguras.

Cronica de cambios realizados y arquitectura de produccion

1. Reestructuracion del proyecto
Se realizo la migracion de una maqueta inicial a una arquitectura profesional separada en frontend y backend. El servidor funciona con Node.js y Express, mientras que la interfaz de usuario utiliza React con TypeScript.

2. Gestion de base de datos
Se implemento Prisma ORM para gestionar una base de datos PostgreSQL alojada en DigitalOcean. Se crearon modelos para usuarios, especialidades, citas y fichas clinicas.

3. Sistema de autenticacion
Se configuro un sistema de seguridad basado en JSON Web Tokens (JWT). Las contraseñas se almacenan de forma segura utilizando encriptado Bcrypt.

4. Motor de teleconsulta WebRTC
Se integro Socket.io para la señalizacion entre usuarios y PeerJS para la conexion de video punto a punto. Se añadieron servidores STUN de Google para mejorar la conectividad entre diferentes redes y dispositivos moviles.

5. Flujo de aprobacion de citas
Se desarrollo una logica de negocio donde las citas tienen estados. El paciente solicita una cita (estado Pendiente) y el medico debe aceptarla desde su panel (estado Confirmado) para que la sala de video se habilite.

6. Ficha clinica y diagnostico
Se creo un panel de diagnostico dentro de la videollamada para que el medico registre sintomas, diagnostico y recetas. Se diseño una vista de historial clinico profesional vinculada a la base de datos real y optimizada para impresion.

7. Despliegue en DigitalOcean
Se realizo el despliegue completo en DigitalOcean App Platform. El frontend se sirve como un sitio estatico y el backend como un servicio web, ambos orquestados bajo un mismo dominio mediante reglas de enrutamiento por rutas.

Instrucciones para pruebas en produccion

Cuentas de acceso para evaluacion:

Cuenta de administrador
Email: admin@medicampo.cl
Contraseña: medicampo123

Cuenta de medico
Email: doctor@medicampo.cl
Contraseña: medicampo123

Cuenta de paciente
Email: paciente@medicampo.cl
Contraseña: medicampo123

Pasos para efectuar una llamada de prueba:
1. Iniciar sesion como paciente y agendar una cita con un especialista.
2. Iniciar sesion como medico en otro navegador o pestaña de incognito.
3. El medico debe aceptar la solicitud pendiente en su panel de control.
4. Una vez aceptada, ambos usuarios veran el boton para entrar a la sala.
5. Iniciar la videollamada y completar el diagnostico medico.
