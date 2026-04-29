"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllAppointments = exports.updateAppointmentStatus = exports.getAppointmentByRoomId = exports.getMyAppointments = exports.createAppointment = exports.getDoctors = void 0;
const AppointmentService_1 = require("../services/AppointmentService");
const AuthService_1 = require("../services/AuthService");
/**
 * AppointmentController
 *
 * S - Single Responsibility: Solo maneja la capa HTTP (request/response) de citas.
 * D - Dependency Inversion: Depende de AppointmentService (abstracción).
 */
const appointmentService = new AppointmentService_1.AppointmentService();
// Obtener todas las especialidades y doctores
const getDoctors = async (req, res) => {
    try {
        const doctors = await appointmentService.getDoctors();
        res.json(doctors);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener doctores' });
    }
};
exports.getDoctors = getDoctors;
// Crear una reserva
const createAppointment = async (req, res) => {
    try {
        const { doctorId, date } = req.body;
        const patientId = Number(req.user.sub);
        const appointment = await appointmentService.createAppointment({
            doctorId,
            date,
            patientId,
        });
        res.status(201).json(appointment);
    }
    catch (error) {
        console.error('Error creando cita:', error);
        res.status(500).json({ error: 'Error al crear la cita' });
    }
};
exports.createAppointment = createAppointment;
// Mis citas
const getMyAppointments = async (req, res) => {
    try {
        const userId = Number(req.user.sub);
        const role = req.user.role;
        const appointments = await appointmentService.getMyAppointments(userId, role);
        res.json(appointments);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener tu agenda de citas' });
    }
};
exports.getMyAppointments = getMyAppointments;
// Obtener info de cita por link de sala
const getAppointmentByRoomId = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const appointment = await appointmentService.getAppointmentByRoomId(roomId);
        if (!appointment) {
            res.status(404).json({ error: 'Cita no encontrada para esta sala' });
            return;
        }
        res.json(appointment);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener datos de la sala' });
    }
};
exports.getAppointmentByRoomId = getAppointmentByRoomId;
// Actualizar estado de cita (Aceptar/Rechazar)
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = Number(req.user.sub);
        const updated = await appointmentService.updateAppointmentStatus(Number(id), userId, status);
        res.json(updated);
    }
    catch (error) {
        if (error instanceof AuthService_1.AppError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Error al actualizar el estado de la cita' });
    }
};
exports.updateAppointmentStatus = updateAppointmentStatus;
// Eliminar todas las citas (Solo para ADMIN durante pruebas)
const deleteAllAppointments = async (req, res) => {
    try {
        await appointmentService.deleteAllAppointments(req.user.role);
        res.json({ message: '✓ Todas las citas han sido eliminadas correctamente' });
    }
    catch (error) {
        if (error instanceof AuthService_1.AppError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        console.error('Error al limpiar citas:', error);
        res.status(500).json({ error: 'Error al eliminar las citas' });
    }
};
exports.deleteAllAppointments = deleteAllAppointments;
