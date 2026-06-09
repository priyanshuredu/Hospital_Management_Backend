const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const {login, verifyEmail, forgotPassword, resetPassword, getAllUsers, updateUserInfo, updateAccountStatus ,getAllUserData ,updateProfile ,getUser} = require('../controller/userController');

router.post('/login' ,login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-mail', verifyEmail)
router.get('/all-users',auth , getAllUsers);
router.get('/getMe',auth ,getUser)
router.get('/get-user',auth ,getUser)
router.get('/user-data',auth , getAllUserData);
router.patch('/reset-password',auth , resetPassword);
router.patch('/update-profile-img', auth, updateProfile)
router.patch('/account-status',auth , updateAccountStatus);
router.put('/profile-update',auth , updateUserInfo);

module.exports = router;