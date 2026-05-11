const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const {createAdmin ,updateAdminInfo} = require('../controller/adminController')

router.post('/create', createAdmin);
router.put('/update-admin',auth , updateAdminInfo);

module.exports = router;