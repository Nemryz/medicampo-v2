import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

// Obtener todas las especialidades y doctores
export const getDoctors = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener doctores' });
  }
};

// Crear una reserva
export const createAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
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
  } catch (error) {
    console.error('Error creando cita:', error);
    res.status(500).json({ error: 'Error al crear la cita' });
  }
};

// Mis citas
export const getMyAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
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
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tu agenda de citas' });
  }
};
