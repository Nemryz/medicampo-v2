import { ClinicalRecord, Appointment } from '@prisma/client';
import { IClinicalService, ClinicalRecordDto, AdminStatsDto } from '../interfaces/IClinicalService';
import { ClinicalRecordRepository } from '../repositories/ClinicalRecordRepository';
import { AppointmentRepository } from '../repositories/AppointmentRepository';
import { UserRepository } from '../repositories/UserRepository';
import { AppError } from './AuthService';

/**
 * ClinicalService
 * 
 * S - Single Responsibility: Solo maneja lógica de negocio de fichas clínicas.
 * D - Dependency Inversion: Depende de repositorios inyectados.
 */
export class ClinicalService implements IClinicalService {
    private clinicalRecordRepository: ClinicalRecordRepository;
    private appointmentRepository: AppointmentRepository;
    private userRepository: UserRepository;

    constructor(
        clinicalRecordRepository?: ClinicalRecordRepository,
        appointmentRepository?: AppointmentRepository,
        userRepository?: UserRepository
    ) {
        this.clinicalRecordRepository = clinicalRecordRepository || new ClinicalRecordRepository();
        this.appointmentRepository = appointmentRepository || new AppointmentRepository();
        this.userRepository = userRepository || new UserRepository();
    }

    async saveClinicalRecord(appointmentId: number, doctorId: number, data: ClinicalRecordDto): Promise<ClinicalRecord> {
        // Verificar que el appointment pertenece a este doctor
        const appointment = await this.appointmentRepository.findByIdAndDoctor(appointmentId, doctorId);
        if (!appointment) {
            throw new AppError('No tienes acceso a esta cita', 403);
        }

        const record = await this.clinicalRecordRepository.upsert(appointmentId, data as any);

        // Marcar la cita como COMPLETED
        await this.clinicalRecordRepository.markAppointmentCompleted(appointmentId);

        return record;
    }

    async getPatientHistory(patientId: number, requesterId: number, requesterRole: string): Promise<Appointment[]> {
        // Pacientes solo pueden ver su propio historial
        if (requesterRole === 'PATIENT' && requesterId !== patientId) {
            throw new AppError('Acceso denegado', 403);
        }

        return this.clinicalRecordRepository.findPatientHistory(patientId);
    }

    async getAppointmentRecord(appointmentId: number): Promise<ClinicalRecord | null> {
        const record = await this.clinicalRecordRepository.findByAppointmentId(appointmentId);
        if (!record) {
            throw new AppError('Ficha no encontrada', 404);
        }
        return record;
    }

    async getAdminStats(): Promise<AdminStatsDto> {
        const [totalPatients, totalDoctors, totalAppointments, completedAppointments, recentAppointments] =
            await Promise.all([
                this.userRepository.countByRole('PATIENT'),
                this.userRepository.countByRole('DOCTOR'),
                this.appointmentRepository.countAll(),
                this.appointmentRepository.countByStatus('COMPLETED'),
                this.appointmentRepository.findRecent(10),
            ]);

        return {
            totalPatients,
            totalDoctors,
            totalAppointments,
            completedAppointments,
            recentAppointments,
        };
    }
}
