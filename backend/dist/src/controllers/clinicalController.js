"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminStats = exports.getAppointmentRecord = exports.getPatientHistory = exports.saveClinicalRecord = void 0;
const ClinicalService_1 = require("../services/ClinicalService");
const AuthService_1 = require("../services/AuthService");
/**
 * ClinicalController
 *
 * S - Single Responsibility: Solo maneja la capa HTTP (request/response) de fichas clínicas.
 * D - Dependency Inversion: Depende de ClinicalService (abstracción).
 */
const clinicalService = new ClinicalService_1.ClinicalService();
// POST /api/clinical/:appointmentId — Guardar/actualizar ficha clínica (solo DOCTOR)
const saveClinicalRecord = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const doctorId = req.user.sub;
        const { symptoms, diagnosis, prescription, observations, allergies, weight, height, bloodPressure, temperature, heartRate, oxygenSat, } = req.body;
        const record = await clinicalService.saveClinicalRecord(Number(appointmentId), doctorId, { symptoms, diagnosis, prescription, observations, allergies, weight, height, bloodPressure, temperature, heartRate, oxygenSat });
        res.json(record);
    }
    catch (error) {
        if (error instanceof AuthService_1.AppError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        console.error(error);
        res.status(500).json({ error: 'Error al guardar la ficha clínica' });
    }
};
exports.saveClinicalRecord = saveClinicalRecord;
// GET /api/clinical/patient/:patientId — Historial completo del paciente
const getPatientHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        const records = await clinicalService.getPatientHistory(Number(patientId), req.user.sub, req.user.role);
        res.json(records);
    }
    catch (error) {
        if (error instanceof AuthService_1.AppError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Error al obtener historial' });
    }
};
exports.getPatientHistory = getPatientHistory;
// GET /api/clinical/appointment/:appointmentId — Ficha de cita específica
const getAppointmentRecord = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const record = await clinicalService.getAppointmentRecord(Number(appointmentId));
        res.json(record);
    }
    catch (error) {
        if (error instanceof AuthService_1.AppError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Error al obtener ficha' });
    }
};
exports.getAppointmentRecord = getAppointmentRecord;
// GET /api/clinical/admin/stats — Estadísticas globales (solo ADMIN)
const getAdminStats = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            res.status(403).json({ error: 'Solo administradores pueden ver estadísticas' });
            return;
        }
        const stats = await clinicalService.getAdminStats();
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};
exports.getAdminStats = getAdminStats;
