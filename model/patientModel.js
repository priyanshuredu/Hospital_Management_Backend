const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name:{
        type: String,
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
    }
});

const patientModel = mongoose.model('patient', patientSchema);

module.exports = patientModel;


// 