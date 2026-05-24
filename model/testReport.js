const mongoose = require('mongoose')

const testReportSchema = new mongoose.Schema({
    test:{
        type: mongoose.Types.ObjectId,
        ref:'test',
        required: true
    },
    appointment:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref:'appointment'
    },
    reportStatus:{
        type:String,
        enum: ['pending','in-process','completed'],
        default:'pending'
    },
    report:{
        type:String
    }
});

const testReportModel = mongoose.model('testReport', testReportSchema);

module.exports = testReportModel;