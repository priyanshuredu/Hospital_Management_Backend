const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {getPendingReports ,getInprocessReports ,getCompletedReports ,getAllReports ,updateReportStatus} = require('../controller/testReportController');

router.get('/pending', getPendingReports);
router.get('/in-progress', getInprocessReports);
router.get('/completed', getCompletedReports);
router.get('/all', getAllReports);

router.patch('/update-status', updateReportStatus);

module.exports = router;