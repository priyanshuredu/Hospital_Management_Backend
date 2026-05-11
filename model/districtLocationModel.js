const mongoose = require('mongoose');
const stateLocation = require('./stateLocationModel');

const districtLocationSchema = new mongoose.Schema({
    districtName:{
        type:String,
        required: true,
    },
    state:{
        type: mongoose.Types.ObjectId,
        ref :'stateLocation',
        required: true
    }
})

const districtLocationModel = mongoose.model('districtLocation',districtLocationSchema);