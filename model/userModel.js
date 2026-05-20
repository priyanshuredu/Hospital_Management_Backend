const mongoose = require('mongoose');
const admin = require('./adminModel');
const doctor = require('./doctorModel');
const hospital = require('./hospitalModel');
const lab = require('./labModel')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: [true, "Username not available."],
        minLength: 4,
        maxLength: 35,
        required: true
    },
    email:{
        type: String,
        unique: [true, "Mail already exists."],
        required: true
    },
    password:{
        type: String,
        required: true,
    },
    currentStatus:{
        type: String,
        enum: ['offline','online'],
        default: 'offline'
    },
    role:{
        type: String,
        enum: ['user','admin','doctor','hospital-admin','lab-assistant','staff'],
        default: 'user'
    },
    accountStatus:{
        type: String,
        enum: ['active','inActive'],
        default:'active'
    },
    profile_image:{
        type: String,
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    resetPassOtp:{
        type: Number
    },
    otpExpireIn:{
        type: Date
    },
    admin:{
        type: mongoose.Types.ObjectId,
        ref: 'admin'
    },
    doctor:{
        type: mongoose.Types.ObjectId,
        ref: 'doctor'
    },
    hospital:{
        type: mongoose.Types.ObjectId,
        ref: 'hospital'
    },
    lab:{
        type: mongoose.Types.ObjectId,
        ref: 'lab'
    }
},{
        timestamps:true 
    });

const userModel = mongoose.model('user',userSchema);

module.exports = userModel;