const mongoose = require('mongoose');
const districtLocation = require('./districtLocationModel')
const stateLocation = require('./stateLocationModel')

const cityLocationSchema = new mongoose.Schema({
    cityName:{
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
    },
    district:{
        type: mongoose.Types.ObjectId,
        ref :'districtLocation',
        required: true
    }
})

const cityLocationModel = mongoose.model('cityLocation', cityLocationSchema);

module.exports = cityLocationModel;