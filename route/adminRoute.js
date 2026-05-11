const express = require('express');
const router = express.Router();
const {createAdmin ,updateAdminInfo} = require('../controller/adminController')

router.post('/create', createAdmin);
router.put('/update-admin', updateAdminInfo);

module.exports = router;