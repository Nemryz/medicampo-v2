"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const livekitController_1 = require("../controllers/livekitController");
const authMiddleware_1 = require("../middleware/authMiddleware");
/**
 * LiveKit Routes
 *
 * DESCRIPCION:
 * Define los puntos de entrada (endpoints) para la gestion de videollamadas.
 *
 * COMO FUNCIONA:
 * 1. El cliente solicita un token a /api/livekit/token.
 * 2. El middleware 'protect' valida que el usuario este logueado en MediCampo (JWT).
 * 3. Si es valido, el controlador genera y devuelve el pase de acceso firmado.
 */
const router = (0, express_1.Router)();
// Wrapper to handle AuthRequest type compatibility with Express
const authHandler = (fn) => {
    return (req, res) => fn(req, res);
};
// Endpoint para obtener el Access Token.
// Requiere: Parametros 'room' y 'username' en el query string.
router.get('/token', authMiddleware_1.protect, authHandler(livekitController_1.getAccessToken));
exports.default = router;
