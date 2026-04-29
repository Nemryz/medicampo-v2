"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveKitService = void 0;
const livekit_server_sdk_1 = require("livekit-server-sdk");
const AuthService_1 = require("./AuthService");
/**
 * LiveKitService
 *
 * S - Single Responsibility: Solo genera tokens de acceso para LiveKit.
 * O - Open/Closed: Fácil de extender con nuevos permisos sin modificar la clase base.
 * D - Dependency Inversion: Implementa ILiveKitService, los controladores dependen de la abstracción.
 */
class LiveKitService {
    constructor() {
        this.apiKey = process.env.LIVEKIT_API_KEY || '';
        this.apiSecret = process.env.LIVEKIT_API_SECRET || '';
    }
    async getAccessToken(roomName, participantName) {
        if (!roomName || !participantName) {
            throw new AuthService_1.AppError('Faltan parámetros: room e identity son obligatorios.', 400);
        }
        if (!this.apiKey || !this.apiSecret) {
            throw new AuthService_1.AppError('Configuración del servidor incompleta (API Keys faltantes).', 500);
        }
        const at = new livekit_server_sdk_1.AccessToken(this.apiKey, this.apiSecret, {
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
exports.LiveKitService = LiveKitService;
