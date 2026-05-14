const mongoose = require('mongoose')
const hospital = require('./hospitalModel')
const subDepartment = require('./subDepartmentModel')

const doctorSchema = new mongoose.Schema({
    doctor_name:{
        type: String,
        maxLength: 35,
        required: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: Number,
        maxLength: 10,
        required: true,
    },
    gender:{
        type: String,
        enum: ['male','female','other'],
        required: true
    },
    age:{
        type: Number,
        maxLength: 2,
        min: 24,
        max: 70,
        required: true
    },
    qualification:{
        type:String,
        required: true,
    },
    degree:{
        type:String,
        required: true
    },
    institution:{
        type: String,
        required: true
    },
    yearOfCompletion:{
        type: Number,
        required: true,
        min: Date.now
    },
    experience:{
        type: Number,
        min: 0,
        max: 50,
        required: true
    },
    hospital: {
        type: mongoose.Types.ObjectId,
        ref: 'hospital'
    },
    sub_department:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'subDepartment'
    },
    consultation_fee:{
        type: Number,
        min: 199,
        required: true
    },
    accountStatus:{
        type: String,
        enum: ['active','inActive'],
        default:'active'
    }

});

const doctorModel = mongoose.model('doctor', doctorSchema);
module.exports = doctorModel;