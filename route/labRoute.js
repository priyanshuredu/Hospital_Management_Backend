const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createLab, updateLabData, updateLabStatus, getLabById, getAllLabs ,getLabsByHospital} = require('../controller/labController');

router.post('/create', createLab);

router.put('/update/:id', updateLabData);
router.patch('/status', updateLabStatus);

router.get('/all',auth , getAllLabs);
router.get('/hospital/:id', getLabsByHospital);
router.get('/:id', getLabById);

module.exports = router