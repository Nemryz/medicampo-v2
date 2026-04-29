import { Router, Request, Response } from 'express';
import { getAccessToken } from '../controllers/livekitController';
import { protect, AuthRequest } from '../middleware/authMiddleware';

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
const router = Router();

// Wrapper to handle AuthRequest type compatibility with Express
const authHandler = (fn: (req: AuthRequest, res: Response) => Promise<void>) => {
    return (req: Request, res: Response) => fn(req as AuthRequest, res);
};

// Endpoint para obtener el Access Token.
// Requiere: Parametros 'room' y 'username' en el query string.
router.get('/token', protect, authHandler(getAccessToken));

export default router;
