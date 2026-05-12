const {createHospital ,updateHospitalStatus ,getHospitalById ,getAllHospitals} = require('../controller/hospitalController');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')

router.get('/all', getAllHospitals);
router.get('/:id', getHospitalById);

router.post('/create', createHospital);

router.patch('/update-request', updateHospitalStatus);

module.exports = router;