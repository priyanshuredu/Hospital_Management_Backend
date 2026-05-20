const mongoose = require('mongoose');
const user = require('./userModel');
const hospital = require('./hospitalModel');
const doctor = require('./doctorModel');

const appointmentSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    hospital:{
        type: mongoose.Types.ObjectId,
        ref: 'hospital',
        required: true
    },
    doctor:{
        type: mongoose.Types.ObjectId,
        ref: 'doctor',
        required: true
    },
    appointmentDate:{
        type: Date,
        required: true
    },
    appointmentAttended: {
        type: Boolean,
        default: false
    }
})

const appointmentModel = mongoose.model('appointment', appointmentSchema);
module.exports = appointmentModel;