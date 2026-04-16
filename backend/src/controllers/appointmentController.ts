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
    const patientId = req.user.sub;

    // TODO: Validate that the doctor exists and doesn't have a schedule collision

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        date: new Date(date),
        meetingLink: `/room/${Math.random().toString(36).substring(7)}`, // Generar ID de sala local
        status: 'CONFIRMED'
      }
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la cita' });
  }
};

// Mis citas
export const getMyAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.sub;
    const role = req.user.role;

    const appointments = await prisma.appointment.findMany({
      where: role === 'DOCTOR' ? { doctorId: userId } : { patientId: userId },
      include: {
        doctor: { select: { name: true, specialty: true } },
        patient: { select: { name: true, rut: true } }
      },
      orderBy: { date: 'asc' }
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tu agenda de citas' });
  }
};
