const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
        enum: ['user','admin','doctor','nurse','staff'],
        default: 'user'
    },
    accountStatus:{
        type: String,
        enum: ['active','inActive'],
        default:'active'
    },
    profileImage:{
        type: String,
    },
    backgroundImage:{
        type: String
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
    }
},{
        timestamps:true 
    });

const userModel = mongoose.model('user',userSchema);

module.exports = userModel;