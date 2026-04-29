"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const AuthService_1 = require("../services/AuthService");
/**
 * AuthController
 *
 * S - Single Responsibility: Solo maneja la capa HTTP (request/response) de autenticación.
 * D - Dependency Inversion: Depende de AuthService (abstracción), no de implementaciones concretas.
 */
const authService = new AuthService_1.AuthService();
const register = async (req, res) => {
    try {
        const { rut, name, email, password } = req.body;
        const result = await authService.register({ rut, name, email, password });
        res.status(201).json(result);
    }
    catch (error) {
        if (error instanceof AuthService_1.AppError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor al registrar' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        res.json(result);
    }
    catch (error) {
        if (error instanceof AuthService_1.AppError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        console.error(error);
        res.status(500).json({ error: 'Error interno al iniciar sesión' });
    }
};
exports.login = login;
