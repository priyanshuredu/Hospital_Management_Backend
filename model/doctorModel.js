const mongoose = require('mongoose')
const hospital = require('./hospitalModel')
const sub_departments = require('./subDepartmentModel')

const doctorSchema = new mongoose.Schema({
    doctor_name:{
        type: String,
        maxLength: 35,
        required: true,
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
        ref: 'sub_departments'
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