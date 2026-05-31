const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createAppointment,
    getAppointmentById,
    getAllAppointmentsByUser,
    getAllAppointmentsByHospital,
    getAllAppointmentsByDoctors,
    updateAppointmentAttendance,
    getDoctorStats,
    getTodayAppointments,
    getUpcomingAppointments,
    getDoctorProfile,
    updateAppointmentStatus,
    getAppointmentsByDateRange,
    getAppointmentHistoryByUser,
    getAllPatients
} = require('../controller/appointmentController');

// Existing routes
router.post('/create', auth, createAppointment);
router.get('/by-user', auth, getAllAppointmentsByUser);
router.get('/by-doctor', auth, getAllAppointmentsByDoctors);
router.get('/history', auth ,getAppointmentHistoryByUser)
router.get('/by-hospital', auth, getAllAppointmentsByHospital);
router.get('/patients-by-doctor', auth ,getAllPatients)
router.patch('/update-attendance', auth, updateAppointmentAttendance);

// New routes for doctor home page
router.get('/doctor/stats', auth, getDoctorStats);
router.get('/doctor/today', auth, getTodayAppointments);
router.get('/doctor/upcoming', auth, getUpcomingAppointments);
router.get('/doctor/profile', auth, getDoctorProfile);
router.patch('/doctor/update-status', auth, updateAppointmentStatus);
router.get('/doctor/date-range', auth, getAppointmentsByDateRange);
router.get('/:id', auth, getAppointmentById);

module.exports = router;