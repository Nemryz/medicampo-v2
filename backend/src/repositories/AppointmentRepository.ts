import { PrismaClient, Appointment } from '@prisma/client';
import Database from '../config/database';

/**
 * AppointmentRepository
 * 
 * S - Single Responsibility: Solo maneja operaciones de BD para citas.
 * D - Dependency Inversion: Recibe PrismaClient por inyección.
 */
export class AppointmentRepository {
    private prisma: PrismaClient;

    constructor(prisma?: PrismaClient) {
        this.prisma = prisma || Database.getInstance();
    }

    async create(data: {
        patientId: number;
        doctorId: number;
        date: Date;
        meetingLink: string;
        status: string;
    }): Promise<Appointment> {
        return this.prisma.appointment.create({
            data,
            include: {
                doctor: { select: { name: true, specialty: true } },
                patient: { select: { name: true, rut: true } },
            },
        });
    }

    async findByUserId(userId: number, role: string): Promise<Appointment[]> {
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

    async findByMeetingLink(meetingLink: string): Promise<Appointment | null> {
        return this.prisma.appointment.findFirst({
            where: { meetingLink },
            include: {
                doctor: { select: { id: true, name: true, specialty: true } },
                patient: { select: { id: true, name: true, rut: true } },
                clinicalRecord: true,
            },
        });
    }

    async findById(id: number): Promise<Appointment | null> {
        return this.prisma.appointment.findUnique({ where: { id } });
    }

    async findByIdAndDoctor(id: number, doctorId: number): Promise<Appointment | null> {
        return this.prisma.appointment.findFirst({
            where: { id, doctorId },
        });
    }

    async updateStatus(id: number, status: string): Promise<Appointment> {
        return this.prisma.appointment.update({
            where: { id },
            data: { status },
        });
    }

    async deleteAll(): Promise<void> {
        await this.prisma.appointment.deleteMany({});
    }

    async countAll(): Promise<number> {
        return this.prisma.appointment.count();
    }

    async countByStatus(status: string): Promise<number> {
        return this.prisma.appointment.count({ where: { status } });
    }

    async findRecent(limit: number = 10): Promise<Appointment[]> {
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
