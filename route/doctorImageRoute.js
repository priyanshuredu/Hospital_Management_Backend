const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const {addImage ,updateImageStatus ,getImageById ,getImagesByHospital ,deleteImage} = require('../controller/doctorImageController');

router.get('/doctor/:id', getImagesByHospital);
router.get('/:id', getImageById);

router.patch('/update', updateImageStatus);

router.delete('/:id', deleteImage);

module.exports = router;