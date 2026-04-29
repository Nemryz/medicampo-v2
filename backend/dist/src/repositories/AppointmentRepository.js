"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
/**
 * AppointmentRepository
 *
 * S - Single Responsibility: Solo maneja operaciones de BD para citas.
 * D - Dependency Inversion: Recibe PrismaClient por inyección.
 */
class AppointmentRepository {
    constructor(prisma) {
        this.prisma = prisma || database_1.default.getInstance();
    }
    async create(data) {
        return this.prisma.appointment.create({
            data,
            include: {
                doctor: { select: { name: true, specialty: true } },
                patient: { select: { name: true, rut: true } },
            },
        });
    }
    async findByUserId(userId, role) {
        return this.prisma.appointment.findMany({
            where: role === 'DOCTOR' ? { doctorId: userId } : { patientId: userId },
            include: {
                doctor: { select: { name: true, specialty: true } },
                patient: { select: { name: true, rut: true } },
                clinicalRecord: { select: { diagnosis: true } },
            },
            orderBy: { date: 'asc' },
        });
    }
    async findByMeetingLink(meetingLink) {
        return this.prisma.appointment.findFirst({
            where: { meetingLink },
            include: {
                doctor: { select: { id: true, name: true, specialty: true } },
                patient: { select: { id: true, name: true, rut: true } },
                clinicalRecord: true,
            },
        });
    }
    async findById(id) {
        return this.prisma.appointment.findUnique({ where: { id } });
    }
    async findByIdAndDoctor(id, doctorId) {
        return this.prisma.appointment.findFirst({
            where: { id, doctorId },
        });
    }
    async updateStatus(id, status) {
        return this.prisma.appointment.update({
            where: { id },
            data: { status },
        });
    }
    async deleteAll() {
        await this.prisma.appointment.deleteMany({});
    }
    async countAll() {
        return this.prisma.appointment.count();
    }
    async countByStatus(status) {
        return this.prisma.appointment.count({ where: { status } });
    }
    async findRecent(limit = 10) {
        return this.prisma.appointment.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                patient: { select: { name: true } },
                doctor: { select: { name: true } },
            },
        });
    }
}
exports.AppointmentRepository = AppointmentRepository;
