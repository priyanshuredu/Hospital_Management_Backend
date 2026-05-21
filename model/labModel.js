const mongoose = require('mongoose');
const hospital = require('./hospitalModel')

const labSchema = new mongoose.Schema({
    labName:{
        type: String,
        required: true,
        unique: true
    },
    labManager:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    age:{
        type:Number,
        max:60,
        min:22,
        required: true
    },
    qualification:{
        type: String,
        required: true
    },
    hospital:{
        type: mongoose.Types.ObjectId,
        ref: 'hospital',
        required: true
    },
    status:{
        type: String,
        enum: ['active','inActive'],
        default:'active'
    }
});

const labModel = mongoose.model('lab',labSchema);
module.exports = labModel;