"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicalRecordRepository = void 0;
const database_1 = __importDefault(require("../config/database"));
/**
 * ClinicalRecordRepository
 *
 * S - Single Responsibility: Solo maneja operaciones de BD para fichas clínicas.
 * D - Dependency Inversion: Recibe PrismaClient por inyección.
 */
class ClinicalRecordRepository {
    constructor(prisma) {
        this.prisma = prisma || database_1.default.getInstance();
    }
    async upsert(appointmentId, data) {
        return this.prisma.clinicalRecord.upsert({
            where: { appointmentId },
            create: { appointmentId, ...data },
            update: data,
        });
    }
    async findByAppointmentId(appointmentId) {
        return this.prisma.clinicalRecord.findUnique({
            where: { appointmentId },
            include: {
                appointment: {
                    include: {
                        patient: { select: { name: true, rut: true } },
                        doctor: { select: { name: true } },
                    },
                },
            },
        });
    }
    async findPatientHistory(patientId) {
        return this.prisma.appointment.findMany({
            where: { patientId, status: 'COMPLETED' },
            include: {
                clinicalRecord: true,
                doctor: { select: { name: true, specialty: true } },
            },
            orderBy: { date: 'desc' },
        });
    }
    async markAppointmentCompleted(appointmentId) {
        await this.prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'COMPLETED' },
        });
    }
}
exports.ClinicalRecordRepository = ClinicalRecordRepository;
