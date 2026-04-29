import { PrismaClient } from '@prisma/client';

/**
 * Database Singleton (PrismaClient)
 * 
 * S - Single Responsibility: Única responsabilidad es gestionar la conexión a BD.
 * D - Dependency Inversion: Las dependencias reciben PrismaClient por inyección.
 */
class Database {
    private static instance: PrismaClient;

    private constructor() { }

    public static getInstance(): PrismaClient {
        if (!Database.instance) {
            Database.instance = new PrismaClient({
                log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
            });
        }
        return Database.instance;
    }

    public static async disconnect(): Promise<void> {
        if (Database.instance) {
            await Database.instance.$disconnect();
        }
    }
}

export default Database;
