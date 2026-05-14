const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const {addImage ,updateImageStatus ,getImageById ,getImagesByHospital ,deleteImage} = require('../controller/hospitalImageController');

router.get('/hospital/:id', getImagesByHospital);
router.get('/:id', getImageById);

router.patch('/update', updateImageStatus);

router.delete('/:id', deleteImage);

module.exports = router;
