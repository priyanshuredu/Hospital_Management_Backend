const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {createTest ,updateTestStatus ,getAlltests ,getTest ,getRecentTest, getAllActivetests ,getAllTestsByLab} = require('../controller/testController')

router.get('/recent-test', getRecentTest)
router.get('/active', getAllActivetests)
router.get('/all' ,getAlltests);
router.get('/:labId', getAllTestsByLab)
router.get('/:id', getTest);

router.post('/create', auth, createTest);
router.patch('/update-status', updateTestStatus);

module.exports = router;