const mongoose = require('mongoose');
const cityLocation = require('./cityLocationModel')
const districtLocation = require('./districtLocationModel')
const stateLocation = require('./stateLocationModel') 

const hospitalSchema = new mongoose.Schema({
    hospital_name:{
        type:String,
        minLength: 10,
        maxLength: 100,
        require: true
    },
    registration_no:{
        type: String,
        unique: true,
        maxLength:16 ,
        required: true
    },
    hospital_type:{
        type: String,
        enum: ['govt.','private','trust','corporate'],
        required: true,
        default: 'private'
    },
    ownership:{
        type: String,
        enum: ['individual','partnership','pvt ltd','ngo'],
        default: 'individual'
    },
    established_year:{
        type: Number,
        maxLength: 4,
        minLength: 4,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    primary_phone:{
        type: Number,
        maxLength: 10,
        minLength: 10,
        required: true
    },
    secondary_phone:{
        type: Number,
        maxLength: 10,
        minLength: 10
    },
    hospital_address:{
        type: String,
        maxLength: 200,
        require: true
    },
    city:{
        type: mongoose.Types.ObjectId,
        ref: 'cityLocation',
        required: true
    },
    district:{
        type: mongoose.Types.ObjectId,
        ref: 'districtLocation',
        required: true
    },
    state:{
        type: mongoose.Types.ObjectId,
        ref: 'stateLocation',
        required: true
    },
    country:{
        type: String,
        default: "India"
    },
    total_doctors:{
        type: Number,
        required: true
    },
    total_beds:{
        type:Number,
        required: true
    },
    icu_beds:{
        type:Number,
        required: true
    },
    emergency_service:{
        type: Boolean,
        required: true
    },
    ambulance_service:{
        type: Boolean,
        required: true
    },
    departments:{
        type: Array,
        required: true,
    },
    hospital_manager:{
        type: String,
        maxLength: 50,
        required: true
    },
    status:{
        type: String,
        enum: ['pending','approved','rejected'],
        default: 'pending',
        required: true
    },
    hospital_description:{
        type: String,
        maxLength: 500,
        required: true
    }
});

const hospitalModel = mongoose.model('hospital',hospitalSchema);
module.exports = hospitalModel;