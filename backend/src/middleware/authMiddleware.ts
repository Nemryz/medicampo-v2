import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG, JwtPayload } from '../config/jwt';

/**
 * AuthMiddleware
 * 
 * S - Single Responsibility: Solo valida tokens JWT en las peticiones.
 * D - Dependency Inversion: Usa JWT_CONFIG que abstrae la configuración.
 */

export interface AuthRequest extends Request {
  user: JwtPayload;
}

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ error: 'No autorizado, token faltante' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.secret) as unknown as JwtPayload;
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'No autorizado, token fallido' });
  }
};
