import { User } from '@prisma/client';

/**
 * IAuthService
 * 
 * I - Interface Segregation: Define solo los métodos necesarios para autenticación.
 * D - Dependency Inversion: Los controladores dependen de esta abstracción.
 */
export interface IAuthService {
    register(data: RegisterDto): Promise<{ user: Omit<User, 'password'>; message: string }>;
    login(data: LoginDto): Promise<{ token: string; user: Omit<User, 'password'> }>;
}

export interface RegisterDto {
    rut: string;
    name: string;
    email: string;
    password: string;
}

export interface LoginDto {
    email: string;
    password: string;
}
