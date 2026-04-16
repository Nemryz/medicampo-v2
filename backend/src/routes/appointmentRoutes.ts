import { Router } from 'express';
import { getDoctors, createAppointment, getMyAppointments, getAppointmentByRoomId, updateAppointmentStatus } from '../controllers/appointmentController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/doctors', protect, getDoctors);
router.post('/book', protect, createAppointment);
router.get('/my-appointments', protect, getMyAppointments);
router.get('/room/:roomId', protect, getAppointmentByRoomId);
router.patch('/:id/status', protect, updateAppointmentStatus);

export default router;
