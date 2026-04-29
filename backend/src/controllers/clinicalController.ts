import { Response } from 'express';
import { ClinicalService } from '../services/ClinicalService';
import { AppError } from '../services/AuthService';
import { AuthRequest } from '../middleware/authMiddleware';

/**
 * ClinicalController
 * 
 * S - Single Responsibility: Solo maneja la capa HTTP (request/response) de fichas clínicas.
 * D - Dependency Inversion: Depende de ClinicalService (abstracción).
 */
const clinicalService = new ClinicalService();

// POST /api/clinical/:appointmentId — Guardar/actualizar ficha clínica (solo DOCTOR)
export const saveClinicalRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { appointmentId } = req.params;
    const doctorId = req.user.sub;

    const {
      symptoms, diagnosis, prescription, observations, allergies,
      weight, height, bloodPressure, temperature, heartRate, oxygenSat,
    } = req.body;

    const record = await clinicalService.saveClinicalRecord(
      Number(appointmentId),
      doctorId,
      { symptoms, diagnosis, prescription, observations, allergies, weight, height, bloodPressure, temperature, heartRate, oxygenSat }
    );

    res.json(record);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Error al guardar la ficha clínica' });
  }
};

// GET /api/clinical/patient/:patientId — Historial completo del paciente
export const getPatientHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;
    const records = await clinicalService.getPatientHistory(
      Number(patientId),
      req.user.sub,
      req.user.role
    );
    res.json(records);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Error al obtener historial' });
  }
};

// GET /api/clinical/appointment/:appointmentId — Ficha de cita específica
export const getAppointmentRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { appointmentId } = req.params;
    const record = await clinicalService.getAppointmentRecord(Number(appointmentId));
    res.json(record);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Error al obtener ficha' });
  }
};

// GET /api/clinical/admin/stats — Estadísticas globales (solo ADMIN)
export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user.role !== 'ADMIN') {
      res.status(403).json({ error: 'Solo administradores pueden ver estadísticas' });
      return;
    }

    const stats = await clinicalService.getAdminStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};
