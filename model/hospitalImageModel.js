const mongoose = require('mongoose')
const hospital = require('./hospitalModel')

const hospitalImageSchema = new mongoose.Schema({
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
    hospital:{
        type: mongoose.Types.ObjectId,
        ref: 'hospital',
        required: true
    }
});

const hospitalImageModel = mongoose.model('hospital_image',hospitalImageSchema);
module.exports = hospitalImageModel;