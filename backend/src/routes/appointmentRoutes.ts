import { Router, Request, Response } from 'express';
import {
    getDoctors,
    createAppointment,
    getMyAppointments,
    getAppointmentByRoomId,
    updateAppointmentStatus,
    deleteAllAppointments,
} from '../controllers/appointmentController';
import { protect, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// Wrapper to handle AuthRequest type compatibility with Express
const authHandler = (fn: (req: AuthRequest, res: Response) => Promise<void>) => {
    return (req: Request, res: Response) => fn(req as AuthRequest, res);
};

router.get('/doctors', protect, getDoctors);
router.post('/book', protect, authHandler(createAppointment));
router.get('/my-appointments', protect, authHandler(getMyAppointments));
router.get('/room/:roomId', protect, authHandler(getAppointmentByRoomId));
router.patch('/:id/status', protect, authHandler(updateAppointmentStatus));
router.delete('/all', protect, authHandler(deleteAllAppointments));

export default router;
