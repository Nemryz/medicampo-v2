"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserRepository_1 = require("../repositories/UserRepository");
const jwt_1 = require("../config/jwt");
/**
 * AuthService
 *
 * S - Single Responsibility: Solo maneja lógica de autenticación (registro y login).
 * O - Open/Closed: Extensible mediante nuevas estrategias sin modificar la clase.
 * D - Dependency Inversion: Depende de abstracciones (UserRepository) y recibe sus dependencias por inyección.
 */
class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository || new UserRepository_1.UserRepository();
    }
    async register(data) {
        const { rut, name, email, password } = data;
        // Verificar si existe
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new AppError('El usuario con ese correo o RUT ya existe.', 400);
        }
        const existingRut = await this.userRepository.findByRut(rut);
        if (existingRut) {
            throw new AppError('El usuario con ese correo o RUT ya existe.', 400);
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const newUser = await this.userRepository.create({
            rut,
            name,
            email,
            password: hashedPassword,
            role: 'PATIENT',
        });
        const { password: _, ...userWithoutPassword } = newUser;
        return { user: userWithoutPassword, message: 'Usuario registrado exitosamente' };
    }
    async login(data) {
        const { email, password } = data;
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError('Credenciales inválidas.', 400);
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new AppError('Credenciales inválidas.', 400);
        }
        const payload = {
            sub: user.id,
            role: user.role,
            name: user.name,
        };
        const token = jsonwebtoken_1.default.sign(payload, jwt_1.JWT_CONFIG.secret, { expiresIn: jwt_1.JWT_CONFIG.expiresIn });
        const { password: _, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
    }
}
exports.AuthService = AuthService;
/**
 * AppError - Error personalizado con código HTTP
 *
 * S - Single Responsibility: Solo representa un error con código de estado.
 */
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
