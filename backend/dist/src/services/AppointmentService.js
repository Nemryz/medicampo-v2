"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const AppointmentRepository_1 = require("../repositories/AppointmentRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const AuthService_1 = require("./AuthService");
/**
 * AppointmentService
 *
 * S - Single Responsibility: Solo maneja lógica de negocio de citas.
 * O - Open/Closed: Extensible mediante nuevas estrategias sin modificar la clase.
 * D - Dependency Inversion: Depende de abstracciones (repositorios) inyectados.
 */
class AppointmentService {
    constructor(appointmentRepository, userRepository) {
        this.appointmentRepository = appointmentRepository || new AppointmentRepository_1.AppointmentRepository();
        this.userRepository = userRepository || new UserRepository_1.UserRepository();
    }
    async getDoctors() {
        return this.userRepository.findDoctors();
    }
    async createAppointment(data) {
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
    async getMyAppointments(userId, role) {
        return this.appointmentRepository.findByUserId(userId, role);
    }
    async getAppointmentByRoomId(roomId) {
        const fullLink = `/room/${roomId}`;
        return this.appointmentRepository.findByMeetingLink(fullLink);
    }
    async updateAppointmentStatus(id, userId, status) {
        const appointment = await this.appointmentRepository.findByIdAndDoctor(id, userId);
        if (!appointment) {
            throw new AuthService_1.AppError('No tienes permiso para modificar esta cita', 403);
        }
        return this.appointmentRepository.updateStatus(id, status);
    }
    async deleteAllAppointments(role) {
        if (role !== 'ADMIN') {
            throw new AuthService_1.AppError('Solo el administrador puede realizar esta acción', 403);
        }
        await this.appointmentRepository.deleteAll();
    }
}
exports.AppointmentService = AppointmentService;
