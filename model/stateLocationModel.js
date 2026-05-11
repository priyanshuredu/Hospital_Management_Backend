const mongoose = require('mongoose');

const stateLocationSchema = new mongoose.Schema({
    stateName:{
        type:String,
        required: true,
    },
    country :{
        type: String,
        default: "India"
    }
})

const stateLocationModel = mongoose.model('stateLocation',stateLocationSchema);