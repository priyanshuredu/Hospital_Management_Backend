const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {createAppointment ,getAppointmentById ,getAllAppointmentsByUser ,getAllAppointmentsByHospital ,getAllAppointmentsByDoctors ,updateAppointmentAttendance} = require('../controller/appointmentController')

router.post('/create', createAppointment);

router.get('/by-user', getAllAppointmentsByUser);
router.get('/by-doctor', getAllAppointmentsByDoctors);
router.get('/by-hospital', getAllAppointmentsByHospital);
router.get('/:id', getAppointmentById);

router.patch('/update-attendance', updateAppointmentAttendance);

module.exports = router