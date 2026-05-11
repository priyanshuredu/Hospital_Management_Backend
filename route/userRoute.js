const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const {login, verifyEmail, forgotPassword, resetPassword, getAllUsers, updateUserInfo, updateAccountStatus ,getAllUserData ,updateProfile ,getUser} = require('../controller/userController');

router.post('/login' ,login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-mail', verifyEmail)
router.patch('/reset-password',auth , resetPassword);
router.get('/all-users',auth , getAllUsers);
router.get('/get-user',auth ,getUser)
router.patch('/update-profile-img', auth, updateProfile)
router.get('/user-data',auth , getAllUserData);
router.put('/profile-update',auth , updateUserInfo);
router.patch('/account-status',auth , updateAccountStatus);

module.exports = router;