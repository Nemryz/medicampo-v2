import { Router } from 'express';
import { getDoctors, createAppointment, getMyAppointments, getAppointmentByRoomId } from '../controllers/appointmentController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/doctors', protect, getDoctors);
router.post('/book', protect, createAppointment);
router.get('/my-appointments', protect, getMyAppointments);
router.get('/room/:roomId', protect, getAppointmentByRoomId);

export default router;
