const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createLab, updateLabData, updateLabStatus, getLabById, getAllLabs} = require('../controller/labController');

router.post('/create', createLab);

router.put('/update/:id', updateLabData);
router.patch('/update-status', updateLabStatus);

router.get('/all', getAllLabs);
router.get('/:id', getLabById);

module.exports = router