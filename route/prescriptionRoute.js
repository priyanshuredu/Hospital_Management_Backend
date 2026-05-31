const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {createPrescription ,getAllprescriptionsByDoctor ,getAllprescriptionsToUser ,getAllprescriptionsByHospital} = require('../controller/prescriptionController');

router.post('/create',auth, createPrescription);

router.get('/by-doctor',auth , getAllprescriptionsByDoctor);
router.get('/by-user', getAllprescriptionsToUser);
router.get('/by-hospital', getAllprescriptionsByHospital)

module.exports = router;