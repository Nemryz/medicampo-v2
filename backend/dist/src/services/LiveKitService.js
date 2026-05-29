"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveKitService = void 0;
const livekit_server_sdk_1 = require("livekit-server-sdk");
const AuthService_1 = require("./AuthService");
const database_1 = __importDefault(require("../config/database"));
/**
 * LiveKitService
 *
 * S - Single Responsibility: Solo genera tokens de acceso para LiveKit.
 * O - Open/Closed: Facil de extender con nuevos permisos sin modificar la clase base.
 * D - Dependency Inversion: Implementa ILiveKitService, los controladores dependen de la abstraccion.
 */
class LiveKitService {
    constructor() {
        this.apiKey = process.env.LIVEKIT_API_KEY || '';
        this.apiSecret = process.env.LIVEKIT_API_SECRET || '';
    }
    async getAccessToken(roomName, participantName, userId) {
        if (!roomName || !participantName) {
            throw new AuthService_1.AppError('Faltan parametros: room e identity son obligatorios.', 400);
        }
        if (!this.apiKey || !this.apiSecret) {
            throw new AuthService_1.AppError('Configuracion del servidor incompleta (API Keys faltantes).', 500);
        }
        // Verificar que el usuario esta asignado a la cita asociada a esta sala
        if (userId && roomName !== 'test-room-livekit') {
            const prisma = database_1.default.getInstance();
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
                throw new AuthService_1.AppError('No tienes una cita asignada a esta sala.', 403);
            }
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
