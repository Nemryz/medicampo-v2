import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { IAuthService, RegisterDto, LoginDto } from '../interfaces/IAuthService';
import { UserRepository } from '../repositories/UserRepository';
import { JWT_CONFIG, JwtPayload } from '../config/jwt';

/**
 * AuthService
 * 
 * S - Single Responsibility: Solo maneja lógica de autenticación (registro y login).
 * O - Open/Closed: Extensible mediante nuevas estrategias sin modificar la clase.
 * D - Dependency Inversion: Depende de abstracciones (UserRepository) y recibe sus dependencias por inyección.
 */
export class AuthService implements IAuthService {
    private userRepository: UserRepository;

    constructor(userRepository?: UserRepository) {
        this.userRepository = userRepository || new UserRepository();
    }

    async register(data: RegisterDto): Promise<{ user: Omit<User, 'password'>; message: string }> {
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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

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

    async login(data: LoginDto): Promise<{ token: string; user: Omit<User, 'password'> }> {
        const { email, password } = data;

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError('Credenciales inválidas.', 400);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AppError('Credenciales inválidas.', 400);
        }

        const payload: JwtPayload = {
            sub: user.id,
            role: user.role,
            name: user.name,
        };

        const token = jwt.sign(payload, JWT_CONFIG.secret, { expiresIn: JWT_CONFIG.expiresIn });

        const { password: _, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
    }
}

/**
 * AppError - Error personalizado con código HTTP
 * 
 * S - Single Responsibility: Solo representa un error con código de estado.
 */
export class AppError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
