"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
/**
 * UserRepository
 *
 * S - Single Responsibility: Solo maneja operaciones de BD para usuarios.
 * D - Dependency Inversion: Recibe PrismaClient por inyección (o usa el singleton).
 */
class UserRepository {
    constructor(prisma) {
        this.prisma = prisma || database_1.default.getInstance();
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
    async findByRut(rut) {
        return this.prisma.user.findUnique({ where: { rut } });
    }
    async findById(id) {
        return this.prisma.user.findUnique({ where: { id } });
    }
    async findDoctors() {
        return this.prisma.user.findMany({
            where: { role: 'DOCTOR' },
            select: {
                id: true,
                name: true,
                specialty: true,
            },
        });
    }
    async create(data) {
        return this.prisma.user.create({ data });
    }
    async countByRole(role) {
        return this.prisma.user.count({ where: { role } });
    }
}
exports.UserRepository = UserRepository;
