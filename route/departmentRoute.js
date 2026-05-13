const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {createDepartment ,getAllDepartments ,getDepartmentById ,updateDepartmentStatus ,deleteDepartment} = require('../controller/departmentController');

router.get('/all', getAllDepartments);
router.get('/:id', getDepartmentById);

router.post('/create', createDepartment);

router.patch('/update-status', updateDepartmentStatus);

router.delete('/:id' ,deleteDepartment);

module.exports = router;
