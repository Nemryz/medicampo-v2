"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
/**
 * Database Singleton (PrismaClient)
 *
 * S - Single Responsibility: Única responsabilidad es gestionar la conexión a BD.
 * D - Dependency Inversion: Las dependencias reciben PrismaClient por inyección.
 */
class Database {
    constructor() { }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new client_1.PrismaClient({
                log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
            });
        }
        return Database.instance;
    }
    static async disconnect() {
        if (Database.instance) {
            await Database.instance.$disconnect();
        }
    }
}
exports.default = Database;
