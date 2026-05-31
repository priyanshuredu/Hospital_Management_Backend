const prescriptionModel = require('../model/prescriptionModel');
const testReportModel = require('../model/testReport');
const mongoose = require('mongoose');

const createPrescription = async (req,res) => {
    const doctorId = req.user.doctor;
    const {appointment , medicines, precautions, test, follow_up} = req.body
    if(!appointment || !medicines || !precautions || !follow_up) return res.status(400).json({
        message:'Req. body not found.'
    })

    if(Array.isArray(test)) return res.status(400).json({
        message: "Tests is an array."
    })

    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        const medicinesString = medicines.map((item,index) => `${index+1}. Medicine:${item.name} Dosage :${item.dosage} mg duration:${item.duration} days frequency:${item.frequency} day instructions:${item.instructions}`).join('; ')
        
        const test_data = {test ,appointment};
        console.log("medicines String:",medicinesString)
        console.log("test_data:",test_data)
        
        
        
        const testreport = await testReportModel.create([test_data],{session});
        const testreportId = testreport[0]._id;
        
        const prescription_data = {appointment ,doctor :doctorId , medicines: medicinesString, precautions, test, testResport: testreportId, follow_up};
        console.log("prescription_data:",prescription_data)
        const prescription = await prescriptionModel.create([prescription_data],{session});

        if(testreport.length !== 0 && prescription.length !== 0){
            session.commitTransaction();
            return res.status(201).json({
                message:'Prescription created.',
                prescription 
            })
        } else return res.status(400).json({
            message:'Failed to create prescription.'
        })
    } catch(error){
        session.abortTransaction();
        return res.status(500).json({
            message: error.message
        })
    } finally {
        session.endSession()
    }
}

const getAllprescriptionsByDoctor = async (req,res) => {
    const id = req.user.doctor;
    if(!id) return res.status(400).json({
        message:'Req. body not found.'
    })

    try{
        const prescriptions = await prescriptionModel.find({doctor: id})
                                    .populate('appointment')
                                    .populate({
                                        path:'test',
                                        populate:{
                                            path:'lab'
                                        }
                                    })
                                    .populate({
                                        path:'doctor',
                                        populate:{
                                            path:'hospital'
                                        }
                                    })
                                    .populate('testResport')
        
        return res.status(200).json({
            message:'All prescriptions assigned by dcotor',
            prescriptions
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const getAllprescriptionsToUser = async (req,res) => {
    const {id} = req.params;
    if(!id) return res.status(400).json({
        message:'Req. body not found.'
    })

    try{
        const prescriptions = await prescriptionModel.find({appointment: id})
                                    .populate('doctor')
                                    .populate('hospital')
                                    .populate('test')
        
        return res.status(200).json({
            message:'All prescriptions assigned to user',
            prescriptions
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const getAllprescriptionsByHospital = async (req,res) => {
    const {id} = req.params;
    if(!id) return res.status(400).json({
        message:'Req. body not found.'
    })

    try{
        const prescriptions = await prescriptionModel.find({hospital: id})
                                    .populate('appointment')
                                    .populate('test')
        
        return res.status(200).json({
            message:'All prescriptions assigned by dcotor',
            prescriptions
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {createPrescription ,getAllprescriptionsByDoctor ,getAllprescriptionsToUser ,getAllprescriptionsByHospital}