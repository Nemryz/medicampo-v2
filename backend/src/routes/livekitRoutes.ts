import { Router } from 'express';
import { livekitController } from '../controllers/livekitController';
import { protect } from '../middleware/authMiddleware';

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
 * 
 * CÓMO MODIFICARLO:
 * - Para cambiar el prefijo de la URL: Edita la línea correspondiente en backend/src/server.ts.
 * - Para añadir más seguridad (ej. roles): Puedes añadir un middleware adicional aquí.
 */
const router = Router();

// Endpoint para obtener el Access Token.
// Requiere: Parámetros 'room' y 'username' en el query string.
router.get('/token', protect, (req, res) => livekitController.getAccessToken(req, res));

export default router;
