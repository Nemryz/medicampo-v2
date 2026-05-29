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
        // (NOTA arreglo guardado de ficha): quitamos las claves con valor 'undefined'
        // para no sobrescribir datos existentes en el 'update' ni romper el 'create'.
        const clean = Object.fromEntries(
            Object.entries(data).filter(([, value]) => value !== undefined)
        );

        return this.prisma.clinicalRecord.upsert({
            where: { appointmentId },
            // (NOTA arreglo guardado de ficha): 'symptoms' y 'diagnosis' son OBLIGATORIOS
            // en el esquema Prisma, pero el formulario del medico solo envia 'diagnosis' y
            // 'prescription'. Sin un valor para 'symptoms', Prisma lanzaba
            // "Argument `symptoms` is missing" -> error 500 "Error al guardar la ficha clinica".
            // Garantizamos un string por defecto SOLO al crear; si el form llegara a enviarlos,
            // 'clean' los sobreescribe.
            create: { appointmentId, symptoms: '', diagnosis: '', ...clean } as any,
            update: clean as any,
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
