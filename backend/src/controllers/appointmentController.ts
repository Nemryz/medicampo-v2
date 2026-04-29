import { Request, Response } from 'express';
import { AppointmentService } from '../services/AppointmentService';
import { AppError } from '../services/AuthService';
import { AuthRequest } from '../middleware/authMiddleware';

/**
 * AppointmentController
 * 
 * S - Single Responsibility: Solo maneja la capa HTTP (request/response) de citas.
 * D - Dependency Inversion: Depende de AppointmentService (abstracción).
 */
const appointmentService = new AppointmentService();

// Obtener todas las especialidades y doctores
export const getDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctors = await appointmentService.getDoctors();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener doctores' });
  }
};

// Crear una reserva
export const createAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { doctorId, date } = req.body;
    const patientId = Number(req.user.sub);

    const appointment = await appointmentService.createAppointment({
      doctorId,
      date,
      patientId,
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

    const appointments = await appointmentService.getMyAppointments(userId, role);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tu agenda de citas' });
  }
};

// Obtener info de cita por link de sala
export const getAppointmentByRoomId = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const roomId = req.params.roomId as string;
    const appointment = await appointmentService.getAppointmentByRoomId(roomId);

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

    const updated = await appointmentService.updateAppointmentStatus(Number(id), userId, status);
    res.json(updated);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Error al actualizar el estado de la cita' });
  }
};

// Eliminar todas las citas (Solo para ADMIN durante pruebas)
export const deleteAllAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await appointmentService.deleteAllAppointments(req.user.role);
    res.json({ message: '✓ Todas las citas han sido eliminadas correctamente' });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    console.error('Error al limpiar citas:', error);
    res.status(500).json({ error: 'Error al eliminar las citas' });
  }
};
