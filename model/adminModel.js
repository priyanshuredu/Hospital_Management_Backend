const mongoose = require('mongoose');
const user = require('./userModel');

const adminSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: [true, "Username not available."],
        minLength: 4,
        maxLength: 16,
        required: true
    },
    email:{
        type: String,
        unique: [true, "Mail already exists."],
        required: true
    },
    phoneNumber:{
        type: Number,
        maxLength: 10,
        minLength: 10,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    bg_description:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    currentStatus:{
        type: String,
        enum: ['offline','online'],
        default: 'offline'
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    role:{
        type: String,
        enum: ['user','admin'],
        default: 'user'
    },
    accountStatus:{
        type: String,
        enum: ['active','inActive'],
        default:'active'
    },
    resetPassOtp:{
        type: Number
    },
    otpExpireIn:{
        type: Date
    }
})

const adminModel = mongoose.model('admin',adminSchema);

module.exports = adminModel;