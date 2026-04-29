"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointmentController_1 = require("../controllers/appointmentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Wrapper to handle AuthRequest type compatibility with Express
const authHandler = (fn) => {
    return (req, res) => fn(req, res);
};
router.get('/doctors', authMiddleware_1.protect, appointmentController_1.getDoctors);
router.post('/book', authMiddleware_1.protect, authHandler(appointmentController_1.createAppointment));
router.get('/my-appointments', authMiddleware_1.protect, authHandler(appointmentController_1.getMyAppointments));
router.get('/room/:roomId', authMiddleware_1.protect, authHandler(appointmentController_1.getAppointmentByRoomId));
router.patch('/:id/status', authMiddleware_1.protect, authHandler(appointmentController_1.updateAppointmentStatus));
router.delete('/all', authMiddleware_1.protect, authHandler(appointmentController_1.deleteAllAppointments));
exports.default = router;
