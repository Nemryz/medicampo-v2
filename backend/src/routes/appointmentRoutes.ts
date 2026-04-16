import { Router } from 'express';
import { getDoctors, createAppointment, getMyAppointments } from '../controllers/appointmentController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/doctors', protect, getDoctors);
router.post('/book', protect, createAppointment);
router.get('/my-appointments', protect, getMyAppointments);

export default router;
