import { Router } from 'express';
import {
  saveClinicalRecord,
  getPatientHistory,
  getAppointmentRecord,
  getAdminStats
} from '../controllers/clinicalController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/:appointmentId', protect, saveClinicalRecord);
router.get('/patient/:patientId', protect, getPatientHistory);
router.get('/appointment/:appointmentId', protect, getAppointmentRecord);
router.get('/admin/stats', protect, getAdminStats);

export default router;
