const mongoose = require('mongoose');
const stateLocation = require('./stateLocationModel');

const districtLocationSchema = new mongoose.Schema({
    districtName:{
        type:String,
        required: true,
    },
    status:{
        type: String,
        enum: ['active','inactive'],
        default: "active",
        required: true
    },
    state:{
        type: mongoose.Types.ObjectId,
        ref :'stateLocation',
        required: true
    }
})

const districtLocationModel = mongoose.model('districtLocation',districtLocationSchema);

module.exports = districtLocationModel;