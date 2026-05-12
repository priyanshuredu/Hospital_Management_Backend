const {createHospital ,updateHospitalStatus ,getHospitalById ,getAllHospitals} = require('../controller/hospitalController');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')

router.get('/:id', getHospitalById);
router.get('/all', getAllHospitals);

router.post('/create', createHospital);

router.patch('/update-request', updateHospitalStatus);

module.exports = router;