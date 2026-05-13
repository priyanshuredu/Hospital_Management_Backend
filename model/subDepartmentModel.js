const mongoose = require('mongoose');
const department = require('./departmentModel');

const subDepartmentSchema = new mongoose.Schema({
    sub_departmentName:{
        type: String,
        maxLength: 20,
        required: true,
        unique: true
    },
    status:{
        type: String,
        enum: ['active','inactive'],
        default: "active",
        required: true
    },
    department:{
        type: mongoose.Types.ObjectId,
        ref: 'department',
        required: true
    }
});

const subDepartmentModel = mongoose.model('sub_departments', subDepartmentSchema);

module.exports = subDepartmentModel