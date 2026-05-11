const mongoose = require('mongoose');
const districtLocation = require('./districtLocationModel')

const cityLocationSchema = new mongoose.Schema({
    cityName:{
        type:String,
        required: true,
    },
    district:{
        type: mongoose.Types.ObjectId,
        ref :'districtLocation',
        required: true
    }
})

const cityLocationModel = mongoose.model('cityLocation', cityLocationSchema);