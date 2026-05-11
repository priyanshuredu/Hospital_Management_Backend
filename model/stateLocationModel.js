const mongoose = require('mongoose');

const stateLocationSchema = new mongoose.Schema({
    stateName:{
        type:String,
        required: true,
    },
    status:{
        type: String,
        enum: ['active','inactive'],
        default: "active",
        required: true
    },
    country :{
        type: String,
        default: "India"
    }
})

const stateLocationModel = mongoose.model('stateLocation',stateLocationSchema);

module.exports = stateLocationModel;