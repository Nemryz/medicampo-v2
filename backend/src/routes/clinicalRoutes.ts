import { Router, Request, Response } from 'express';
import {
  saveClinicalRecord,
  getPatientHistory,
  getAppointmentRecord,
  getAdminStats,
} from '../controllers/clinicalController';
import { protect, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// Wrapper to handle AuthRequest type compatibility with Express
const authHandler = (fn: (req: AuthRequest, res: Response) => Promise<void>) => {
  return (req: Request, res: Response) => fn(req as AuthRequest, res);
};

router.post('/:appointmentId', protect, authHandler(saveClinicalRecord));
router.get('/patient/:patientId', protect, authHandler(getPatientHistory));
router.get('/appointment/:appointmentId', protect, authHandler(getAppointmentRecord));
router.get('/admin/stats', protect, authHandler(getAdminStats));

export default router;
