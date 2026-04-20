import { Request, Response } from 'express';
import { AccessToken } from 'livekit-server-sdk';

/**
 * LiveKitController
 * 
 * DESCRIPCIÓN:
 * Esta clase se encarga de la lógica de generación de tokens para LiveKit.
 * Sigue el principio de Responsabilidad Única (SOLID), delegando la seguridad
 * de la videollamada al servidor de LiveKit mediante firmas criptográficas.
 * 
 * CÓMO FUNCIONA:
 * 1. Recibe el nombre de la sala (room) e identidad del usuario desde el frontend.
 * 2. Utiliza la API_KEY y API_SECRET del archivo .env para firmar un AccessToken.
 * 3. El token otorga permisos específicos (unirse a sala, publicar video/audio).
 * 4. El cliente (navegador) usa este token para autenticarse directamente con el servidor LiveKit.
 */
export class LiveKitController {
    
    /**
     * getAccessToken
     * 
     * @param req Request de Express conteniendo 'room' y 'username' en el query.
     * @param res Response de Express.
     * 
     * CÓMO MODIFICARLO:
     * - Para cambiar permisos: Modifica el objeto 'at.addGrant'.
     * - Para cambiar el tiempo de vida: Cambia el valor de 'ttl' en las opciones de AccessToken (ej. '1h' para una hora).
     */
    public async getAccessToken(req: Request, res: Response): Promise<void> {
        try {
            // El hook useToken del frontend suele enviar 'room' e 'identity'
            const roomName = (req.query.room || req.query.roomName) as string;
            const participantName = (req.query.identity || req.query.username) as string;

            // Validación de parámetros obligatorios
            if (!roomName || !participantName) {
                res.status(400).json({ 
                    error: 'Faltan parámetros: room e identity son obligatorios.',
                    received: { room: roomName, identity: participantName }
                });
                return;
            }

            // Recuperación de credenciales del entorno
            const apiKey = process.env.LIVEKIT_API_KEY;
            const apiSecret = process.env.LIVEKIT_API_SECRET;

            if (!apiKey || !apiSecret) {
                res.status(500).json({ error: 'Configuración del servidor incompleta (API Keys faltantes).' });
                return;
            }

            // Creación del Token de Acceso
            const at = new AccessToken(apiKey, apiSecret, {
                identity: participantName,
                // TTL (Time To Live): El token expira en 10 minutos si no se usa para conectar.
                ttl: '10m', 
            });

            // Asignación de permisos (Grants)
            // Agregamos permisos explícitos para video, audio y chat (Data Channels)
            at.addGrant({ 
                roomJoin: true, 
                room: roomName,
                canPublish: true,      // Permite encender cámara/micro
                canSubscribe: true,    // Permite ver a los demás
                canPublishData: true,  // Permite usar el chat
            });

            // Generación del JWT y envío al frontend
            const token = await at.toJwt();
            res.json({ token });
            
        } catch (error) {
            console.error('Error generando LiveKit Token:', error);
            res.status(500).json({ error: 'Error interno al generar el token de acceso.' });
        }
    }
}

// Exportamos una instancia única para ser usada en las rutas.
export const livekitController = new LiveKitController();
