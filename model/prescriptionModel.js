const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    appointment:{
        type: mongoose.Types.ObjectId,
        ref:'appointment',
        required: true
    },
    // hospital:{
    //     type: mongoose.Types.ObjectId,
    //     ref:'hospital',
    //     required: true
    // },
    doctor:{
        type: mongoose.Types.ObjectId,
        ref:'doctor',
        required: true
    },
    medicines:{
        type: String,
    },
    precautions:{
        type: String
    },
    test:{
        type: mongoose.Types.ObjectId,
        ref:'test',
        required: true
    },
    testResport:{
        type: mongoose.Types.ObjectId,
        ref:'testReport',
        required: true
    },
    follow_up:{
        type: Date
    }
});

const prescriptionModel = mongoose.model('prescription',prescriptionSchema);

module.exports = prescriptionModel;