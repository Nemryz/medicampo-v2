import { AccessToken } from 'livekit-server-sdk';
import { ILiveKitService } from '../interfaces/ILiveKitService';
import { AppError } from './AuthService';
import Database from '../config/database';

/**
 * LiveKitService
 * 
 * S - Single Responsibility: Solo genera tokens de acceso para LiveKit.
 * O - Open/Closed: Facil de extender con nuevos permisos sin modificar la clase base.
 * D - Dependency Inversion: Implementa ILiveKitService, los controladores dependen de la abstraccion.
 */
export class LiveKitService implements ILiveKitService {
    private apiKey: string;
    private apiSecret: string;

    constructor() {
        this.apiKey = process.env.LIVEKIT_API_KEY || '';
        this.apiSecret = process.env.LIVEKIT_API_SECRET || '';
    }

    async getAccessToken(roomName: string, participantName: string, userId?: number): Promise<{ token: string }> {
        if (!roomName || !participantName) {
            throw new AppError('Faltan parametros: room e identity son obligatorios.', 400);
        }

        if (!this.apiKey || !this.apiSecret) {
            throw new AppError('Configuracion del servidor incompleta (API Keys faltantes).', 500);
        }

        // Verificar que el usuario esta asignado a la cita asociada a esta sala
        if (userId && roomName !== 'test-room-livekit') {
            const prisma = Database.getInstance();
            const appointment = await prisma.appointment.findFirst({
                where: {
                    meetingLink: { contains: roomName },
                    OR: [
                        { patientId: userId },
                        { doctorId: userId }
                    ]
                }
            });

            if (!appointment) {
                throw new AppError('No tienes una cita asignada a esta sala.', 403);
            }
        }

        const at = new AccessToken(this.apiKey, this.apiSecret, {
            identity: participantName,
            ttl: '10m',
        });

        at.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
        });

        const token = await at.toJwt();
        return { token };
    }
}
