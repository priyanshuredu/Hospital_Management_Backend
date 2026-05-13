const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    departmentName :{
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
    }
});

const departmentModel = mongoose.model('department', departmentSchema);

module.exports = departmentModel;