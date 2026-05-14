const mongoose = require('mongoose')
const doctor = require('./doctorModel')

const doctorImageSchema = new mongoose.Schema({
    img_name:{
        type: String,
        maxLength: 30,
        required: true
    },
    img_url:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ['active','inactive'],
        default: 'active',
        required: true
    },
    doctor:{
        type: mongoose.Types.ObjectId,
        ref: 'doctor',
        required: true
    }
});

const doctorImageModel = mongoose.model('doctor_image',doctorImageSchema);
module.exports = doctorImageModel;