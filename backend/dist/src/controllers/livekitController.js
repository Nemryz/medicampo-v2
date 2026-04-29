"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = void 0;
const LiveKitService_1 = require("../services/LiveKitService");
const AuthService_1 = require("../services/AuthService");
/**
 * LiveKitController
 *
 * S - Single Responsibility: Solo maneja la capa HTTP (request/response) de LiveKit.
 * D - Dependency Inversion: Depende de LiveKitService (abstracción).
 */
const liveKitService = new LiveKitService_1.LiveKitService();
const getAccessToken = async (req, res) => {
    try {
        const roomName = (req.query.room || req.query.roomName);
        const participantName = (req.query.identity || req.query.username);
        const result = await liveKitService.getAccessToken(roomName, participantName);
        res.json(result);
    }
    catch (error) {
        if (error instanceof AuthService_1.AppError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        console.error('Error generando LiveKit Token:', error);
        res.status(500).json({ error: 'Error interno al generar el token de acceso.' });
    }
};
exports.getAccessToken = getAccessToken;
