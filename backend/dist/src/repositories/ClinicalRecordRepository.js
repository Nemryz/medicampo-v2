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
        // (NOTA arreglo guardado de ficha): quitamos las claves con valor 'undefined'
        // para no sobrescribir datos existentes en el 'update' ni romper el 'create'.
        const clean = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
        return this.prisma.clinicalRecord.upsert({
            where: { appointmentId },
            // (NOTA arreglo guardado de ficha): 'symptoms' y 'diagnosis' son OBLIGATORIOS
            // en el esquema Prisma, pero el formulario del medico solo envia 'diagnosis' y
            // 'prescription'. Sin un valor para 'symptoms', Prisma lanzaba
            // "Argument `symptoms` is missing" -> error 500 "Error al guardar la ficha clinica".
            // Garantizamos un string por defecto SOLO al crear; si el form llegara a enviarlos,
            // 'clean' los sobreescribe.
            create: { appointmentId, symptoms: '', diagnosis: '', ...clean },
            update: clean,
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
