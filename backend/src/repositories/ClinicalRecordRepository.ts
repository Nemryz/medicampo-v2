import { PrismaClient, ClinicalRecord, Appointment } from '@prisma/client';
import Database from '../config/database';

/**
 * ClinicalRecordRepository
 * 
 * S - Single Responsibility: Solo maneja operaciones de BD para fichas clínicas.
 * D - Dependency Inversion: Recibe PrismaClient por inyección.
 */
export class ClinicalRecordRepository {
    private prisma: PrismaClient;

    constructor(prisma?: PrismaClient) {
        this.prisma = prisma || Database.getInstance();
    }

    async upsert(
        appointmentId: number,
        data: Partial<ClinicalRecord>
    ): Promise<ClinicalRecord> {
        return this.prisma.clinicalRecord.upsert({
            where: { appointmentId },
            create: { appointmentId, ...data } as any,
            update: data,
        });
    }

    async findByAppointmentId(appointmentId: number): Promise<ClinicalRecord | null> {
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

    async findPatientHistory(patientId: number): Promise<Appointment[]> {
        return this.prisma.appointment.findMany({
            where: { patientId, status: 'COMPLETED' },
            include: {
                clinicalRecord: true,
                doctor: { select: { name: true, specialty: true } },
            },
            orderBy: { date: 'desc' },
        });
    }

    async markAppointmentCompleted(appointmentId: number): Promise<void> {
        await this.prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'COMPLETED' },
        });
    }
}
