import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
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
        status: 'PENDING'
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

// Obtener info de cita por link de sala
export const getAppointmentByRoomId = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { roomId } = req.params;
    const fullLink = `/room/${roomId}`;

    const appointment = await prisma.appointment.findFirst({
      where: { meetingLink: fullLink },
      include: {
        doctor: { select: { id: true, name: true, specialty: true } },
        patient: { select: { id: true, name: true, rut: true } },
        clinicalRecord: true
      }
    });

    if (!appointment) {
      res.status(404).json({ error: 'Cita no encontrada para esta sala' });
      return;
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos de la sala' });
  }
};

// Actualizar estado de cita (Aceptar/Rechazar)
export const updateAppointmentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = Number(req.user.sub);

    // Solo el médico asignado puede cambiar el estado
    const appointment = await prisma.appointment.findFirst({
      where: { id: Number(id), doctorId: userId }
    });

    if (!appointment) {
      res.status(403).json({ error: 'No tienes permiso para modificar esta cita' });
      return;
    }

    const updated = await prisma.appointment.update({
      where: { id: Number(id) },
      data: { status }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estado de la cita' });
  }
};
// Eliminar todas las citas (Solo para ADMIN durante pruebas)
export const deleteAllAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user.role !== 'ADMIN') {
      res.status(403).json({ error: 'Solo el administrador puede realizar esta acción' });
      return;
    }

    // Eliminamos las citas (Prisma maneja el borrado)
    await prisma.appointment.deleteMany({});
    
    res.json({ message: '✓ Todas las citas han sido eliminadas correctamente' });
  } catch (error) {
    console.error('Error al limpiar citas:', error);
    res.status(500).json({ error: 'Error al eliminar las citas' });
  }
};
