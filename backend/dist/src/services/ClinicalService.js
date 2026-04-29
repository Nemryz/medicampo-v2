"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicalService = void 0;
const ClinicalRecordRepository_1 = require("../repositories/ClinicalRecordRepository");
const AppointmentRepository_1 = require("../repositories/AppointmentRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const AuthService_1 = require("./AuthService");
/**
 * ClinicalService
 *
 * S - Single Responsibility: Solo maneja lógica de negocio de fichas clínicas.
 * D - Dependency Inversion: Depende de repositorios inyectados.
 */
class ClinicalService {
    constructor(clinicalRecordRepository, appointmentRepository, userRepository) {
        this.clinicalRecordRepository = clinicalRecordRepository || new ClinicalRecordRepository_1.ClinicalRecordRepository();
        this.appointmentRepository = appointmentRepository || new AppointmentRepository_1.AppointmentRepository();
        this.userRepository = userRepository || new UserRepository_1.UserRepository();
    }
    async saveClinicalRecord(appointmentId, doctorId, data) {
        // Verificar que el appointment pertenece a este doctor
        const appointment = await this.appointmentRepository.findByIdAndDoctor(appointmentId, doctorId);
        if (!appointment) {
            throw new AuthService_1.AppError('No tienes acceso a esta cita', 403);
        }
        const record = await this.clinicalRecordRepository.upsert(appointmentId, data);
        // Marcar la cita como COMPLETED
        await this.clinicalRecordRepository.markAppointmentCompleted(appointmentId);
        return record;
    }
    async getPatientHistory(patientId, requesterId, requesterRole) {
        // Pacientes solo pueden ver su propio historial
        if (requesterRole === 'PATIENT' && requesterId !== patientId) {
            throw new AuthService_1.AppError('Acceso denegado', 403);
        }
        return this.clinicalRecordRepository.findPatientHistory(patientId);
    }
    async getAppointmentRecord(appointmentId) {
        const record = await this.clinicalRecordRepository.findByAppointmentId(appointmentId);
        if (!record) {
            throw new AuthService_1.AppError('Ficha no encontrada', 404);
        }
        return record;
    }
    async getAdminStats() {
        const [totalPatients, totalDoctors, totalAppointments, completedAppointments, recentAppointments] = await Promise.all([
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
exports.ClinicalService = ClinicalService;
