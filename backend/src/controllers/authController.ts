import { Request, Response } from 'express';
import { AuthService, AppError } from '../services/AuthService';

/**
 * AuthController
 * 
 * S - Single Responsibility: Solo maneja la capa HTTP (request/response) de autenticación.
 * D - Dependency Inversion: Depende de AuthService (abstracción), no de implementaciones concretas.
 */
const authService = new AuthService();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rut, name, email, password } = req.body;
    const result = await authService.register({ rut, name, email, password });
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor al registrar' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Error interno al iniciar sesión' });
  }
};
