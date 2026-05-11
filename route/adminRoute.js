const express = require('express');
const router = express.Router();
const {createAdmin} = require('../controller/adminController')

router.post('/create', createAdmin);

module.exports = router;