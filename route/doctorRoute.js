const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const {createDoctor ,getAllDoctors ,getDoctorById ,updateDoctorStatus ,updateDoctor ,getDoctorByHospital ,deleteDoctor} = require('../controller/doctorController');

router.post('/create', createDoctor);

router.get('/all', getAllDoctors);
router.get('/hospital/:id', getDoctorByHospital);
router.get('/:id', getDoctorById);

router.patch('/update-status', updateDoctorStatus);
router.put('/update/:id', updateDoctor);

router.delete('/:id', deleteDoctor);


module.exports = router;