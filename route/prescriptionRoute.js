const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {createPrescription ,getAllprescriptionsByDoctor ,getAllprescriptionsToUser ,getAllprescriptionsByHospital} = require('../controller/prescriptionController');

router.post('/create', createPrescription);

router.get('/by-doctor', getAllprescriptionsByDoctor);
router.get('/by-user', getAllprescriptionsToUser);
router.get('/by-hospital', getAllprescriptionsByHospital)

module.exports = router;