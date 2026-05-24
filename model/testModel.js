const mongoose = require('mongoose')

const testSchema = new mongoose.Schema({
    testName:{
        type:String,
        required: true,
        unique: true
    },
    lab:{
        type: mongoose.Types.ObjectId,
        ref:'lab'
    },
    hospital:{
        type: mongoose.Types.ObjectId,
        ref:'hospital'
    },
    fee:{
        type: Number,
        required: true
    },
    precautions:{
        type:String
    },
    status:{
        type: String,
        enum: ['active','inActive'],
        default:'active'
    }
});

const testModel = mongoose.model('test',testSchema);
module.exports = testModel;