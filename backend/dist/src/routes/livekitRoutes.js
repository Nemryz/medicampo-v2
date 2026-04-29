"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const livekitController_1 = require("../controllers/livekitController");
const authMiddleware_1 = require("../middleware/authMiddleware");
/**
 * LiveKit Routes
 *
 * DESCRIPCIÓN:
 * Define los puntos de entrada (endpoints) para la gestión de videollamadas.
 *
 * CÓMO FUNCIONA:
 * 1. El cliente solicita un token a /api/livekit/token.
 * 2. El middleware 'protect' valida que el usuario esté logueado en MediCampo (JWT).
 * 3. Si es válido, el controlador genera y devuelve el pase de acceso firmado.
 */
const router = (0, express_1.Router)();
// Endpoint para obtener el Access Token.
// Requiere: Parámetros 'room' y 'username' en el query string.
router.get('/token', authMiddleware_1.protect, livekitController_1.getAccessToken);
exports.default = router;
