import { AccessToken } from 'livekit-server-sdk';
import { ILiveKitService } from '../interfaces/ILiveKitService';
import { AppError } from './AuthService';

/**
 * LiveKitService
 * 
 * S - Single Responsibility: Solo genera tokens de acceso para LiveKit.
 * O - Open/Closed: Fácil de extender con nuevos permisos sin modificar la clase base.
 * D - Dependency Inversion: Implementa ILiveKitService, los controladores dependen de la abstracción.
 */
export class LiveKitService implements ILiveKitService {
    private apiKey: string;
    private apiSecret: string;

    constructor() {
        this.apiKey = process.env.LIVEKIT_API_KEY || '';
        this.apiSecret = process.env.LIVEKIT_API_SECRET || '';
    }

    async getAccessToken(roomName: string, participantName: string): Promise<{ token: string }> {
        if (!roomName || !participantName) {
            throw new AppError('Faltan parámetros: room e identity son obligatorios.', 400);
        }

        if (!this.apiKey || !this.apiSecret) {
            throw new AppError('Configuración del servidor incompleta (API Keys faltantes).', 500);
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
