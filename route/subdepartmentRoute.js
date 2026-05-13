const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {createSubDepartment ,getAllSubDepartments ,getSubDepartmentById ,updateSubDepartmentStatus ,deleteSubDepartment ,getSubDepByDepartment} = require('../controller/subDepartmentController');

router.get('/all', getAllSubDepartments);
router.get('/:id', getSubDepartmentById);
router.get('/dep/:id', getSubDepByDepartment);

router.post('/create', createSubDepartment);

router.patch('/update-status', updateSubDepartmentStatus);

router.delete('/:id' ,deleteSubDepartment);

module.exports = router;
