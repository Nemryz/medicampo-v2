"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyAppointments = exports.createAppointment = exports.getDoctors = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Obtener todas las especialidades y doctores
const getDoctors = async (req, res) => {
    try {
        const doctors = await prisma.user.findMany({
            where: { role: 'DOCTOR' },
            select: {
                id: true,
                name: true,
                specialty: true,
            }
        });
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
        const patientId = Number(req.user.sub); // JWT sub puede venir como string
        const appointment = await prisma.appointment.create({
            data: {
                patientId,
                doctorId: Number(doctorId),
                date: new Date(date),
                meetingLink: `/room/${Math.random().toString(36).substring(7)}`,
                status: 'CONFIRMED'
            },
            include: {
                doctor: { select: { name: true, specialty: true } },
                patient: { select: { name: true, rut: true } }
            }
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
        const appointments = await prisma.appointment.findMany({
            where: role === 'DOCTOR' ? { doctorId: userId } : { patientId: userId },
            include: {
                doctor: { select: { name: true, specialty: true } },
                patient: { select: { name: true, rut: true } },
                clinicalRecord: { select: { diagnosis: true } }
            },
            orderBy: { date: 'asc' }
        });
        res.json(appointments);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener tu agenda de citas' });
    }
};
exports.getMyAppointments = getMyAppointments;
