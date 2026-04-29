import { PrismaClient, User } from '@prisma/client';
import Database from '../config/database';

/**
 * UserRepository
 * 
 * S - Single Responsibility: Solo maneja operaciones de BD para usuarios.
 * D - Dependency Inversion: Recibe PrismaClient por inyección (o usa el singleton).
 */
export class UserRepository {
    private prisma: PrismaClient;

    constructor(prisma?: PrismaClient) {
        this.prisma = prisma || Database.getInstance();
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async findByRut(rut: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { rut } });
    }

    async findById(id: number): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async findDoctors(): Promise<any[]> {
        return this.prisma.user.findMany({
            where: { role: 'DOCTOR' },
            select: {
                id: true,
                name: true,
                specialty: true,
            },
        });
    }

    async create(data: {
        rut: string;
        name: string;
        email: string;
        password: string;
        role?: string;
    }): Promise<User> {
        return this.prisma.user.create({ data });
    }

    async countByRole(role: string): Promise<number> {
        return this.prisma.user.count({ where: { role } });
    }
}
