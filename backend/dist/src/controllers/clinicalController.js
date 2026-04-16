"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminStats = exports.getAppointmentRecord = exports.getPatientHistory = exports.saveClinicalRecord = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// POST /api/clinical/:appointmentId — Guardar/actualizar ficha clínica (solo DOCTOR)
const saveClinicalRecord = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const doctorId = req.user.sub;
        // Verificar que el appointment pertenece a este doctor
        const appointment = await prisma.appointment.findFirst({
            where: { id: Number(appointmentId), doctorId }
        });
        if (!appointment) {
            res.status(403).json({ error: 'No tienes acceso a esta cita' });
            return;
        }
        const { symptoms, diagnosis, prescription, observations, allergies, weight, height, bloodPressure, temperature, heartRate, oxygenSat } = req.body;
        const record = await prisma.clinicalRecord.upsert({
            where: { appointmentId: Number(appointmentId) },
            create: {
                appointmentId: Number(appointmentId),
                symptoms, diagnosis, prescription, observations, allergies,
                weight, height, bloodPressure, temperature, heartRate, oxygenSat
            },
            update: {
                symptoms, diagnosis, prescription, observations, allergies,
                weight, height, bloodPressure, temperature, heartRate, oxygenSat
            }
        });
        // Marcar la cita como COMPLETED al guardar ficha
        await prisma.appointment.update({
            where: { id: Number(appointmentId) },
            data: { status: 'COMPLETED' }
        });
        res.json(record);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar la ficha clínica' });
    }
};
exports.saveClinicalRecord = saveClinicalRecord;
// GET /api/clinical/patient/:patientId — Historial completo del paciente
const getPatientHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        // Pacientes solo pueden ver su propio historial; médicos y admin pueden ver cualquiera
        if (req.user.role === 'PATIENT' && req.user.sub !== Number(patientId)) {
            res.status(403).json({ error: 'Acceso denegado' });
            return;
        }
        const records = await prisma.appointment.findMany({
            where: { patientId: Number(patientId), status: 'COMPLETED' },
            include: {
                clinicalRecord: true,
                doctor: { select: { name: true, specialty: true } }
            },
            orderBy: { date: 'desc' }
        });
        res.json(records);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener historial' });
    }
};
exports.getPatientHistory = getPatientHistory;
// GET /api/clinical/appointment/:appointmentId — Ficha de cita específica
const getAppointmentRecord = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const record = await prisma.clinicalRecord.findUnique({
            where: { appointmentId: Number(appointmentId) },
            include: { appointment: { include: { patient: { select: { name: true, rut: true } }, doctor: { select: { name: true } } } } }
        });
        if (!record) {
            res.status(404).json({ error: 'Ficha no encontrada' });
            return;
        }
        res.json(record);
    }
    catch (error) {
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
        const [totalPatients, totalDoctors, totalAppointments, completedAppointments] = await Promise.all([
            prisma.user.count({ where: { role: 'PATIENT' } }),
            prisma.user.count({ where: { role: 'DOCTOR' } }),
            prisma.appointment.count(),
            prisma.appointment.count({ where: { status: 'COMPLETED' } })
        ]);
        const recentAppointments = await prisma.appointment.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                patient: { select: { name: true } },
                doctor: { select: { name: true } }
            }
        });
        res.json({ totalPatients, totalDoctors, totalAppointments, completedAppointments, recentAppointments });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};
exports.getAdminStats = getAdminStats;
