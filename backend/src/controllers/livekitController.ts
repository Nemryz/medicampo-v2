import { Request, Response } from 'express';
import { LiveKitService } from '../services/LiveKitService';
import { AppError } from '../services/AuthService';

/**
 * LiveKitController
 * 
 * S - Single Responsibility: Solo maneja la capa HTTP (request/response) de LiveKit.
 * D - Dependency Inversion: Depende de LiveKitService (abstracción).
 */
const liveKitService = new LiveKitService();

export const getAccessToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const roomName = (req.query.room || req.query.roomName) as string;
        const participantName = (req.query.identity || req.query.username) as string;

        const result = await liveKitService.getAccessToken(roomName, participantName);
        res.json(result);
    } catch (error) {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        console.error('Error generando LiveKit Token:', error);
        res.status(500).json({ error: 'Error interno al generar el token de acceso.' });
    }
};
