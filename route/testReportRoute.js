const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {getPendingReports ,getInprocessReports ,getCompletedReports ,getAllReports ,updateReportStatus ,getUserTestReportHistory ,addReport ,getReportByID} = require('../controller/testReportController');

router.post('/add-report', auth , addReport)
router.get('/pending', getPendingReports);
router.get('/in-progress', getInprocessReports);
router.get('/completed', getCompletedReports);
router.get('/all', getAllReports);
router.get('/test-report-history',auth ,getUserTestReportHistory)
router.get('/:id', getReportByID)

router.patch('/update-status', updateReportStatus);

module.exports = router;