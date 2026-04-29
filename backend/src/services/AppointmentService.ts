import { Appointment } from '@prisma/client';
import { IAppointmentService, CreateAppointmentDto } from '../interfaces/IAppointmentService';
import { AppointmentRepository } from '../repositories/AppointmentRepository';
import { UserRepository } from '../repositories/UserRepository';
import { AppError } from './AuthService';

/**
 * AppointmentService
 * 
 * S - Single Responsibility: Solo maneja lógica de negocio de citas.
 * O - Open/Closed: Extensible mediante nuevas estrategias sin modificar la clase.
 * D - Dependency Inversion: Depende de abstracciones (repositorios) inyectados.
 */
export class AppointmentService implements IAppointmentService {
    private appointmentRepository: AppointmentRepository;
    private userRepository: UserRepository;

    constructor(
        appointmentRepository?: AppointmentRepository,
        userRepository?: UserRepository
    ) {
        this.appointmentRepository = appointmentRepository || new AppointmentRepository();
        this.userRepository = userRepository || new UserRepository();
    }

    async getDoctors(): Promise<any[]> {
        return this.userRepository.findDoctors();
    }

    async createAppointment(data: CreateAppointmentDto): Promise<Appointment> {
        const { doctorId, date, patientId } = data;

        const meetingLink = `/room/${Math.random().toString(36).substring(7)}`;

        return this.appointmentRepository.create({
            patientId,
            doctorId: Number(doctorId),
            date: new Date(date),
            meetingLink,
            status: 'PENDING',
        });
    }

    async getMyAppointments(userId: number, role: string): Promise<Appointment[]> {
        return this.appointmentRepository.findByUserId(userId, role);
    }

    async getAppointmentByRoomId(roomId: string): Promise<Appointment | null> {
        const fullLink = `/room/${roomId}`;
        return this.appointmentRepository.findByMeetingLink(fullLink);
    }

    async updateAppointmentStatus(id: number, userId: number, status: string): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findByIdAndDoctor(id, userId);

        if (!appointment) {
            throw new AppError('No tienes permiso para modificar esta cita', 403);
        }

        return this.appointmentRepository.updateStatus(id, status);
    }

    async deleteAllAppointments(role: string): Promise<void> {
        if (role !== 'ADMIN') {
            throw new AppError('Solo el administrador puede realizar esta acción', 403);
        }

        await this.appointmentRepository.deleteAll();
    }
}
