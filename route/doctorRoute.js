const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const {createDoctor ,getAllDoctors ,getDoctorById ,updateDoctorStatus ,updateDoctor ,getDoctorByHospital ,deleteDoctor} = require('../controller/doctorController');

module.exports = router;