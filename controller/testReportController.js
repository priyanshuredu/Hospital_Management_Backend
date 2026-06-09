const testReportModel = require('../model/testReport')
const mongoose = require('mongoose')
const upload =  require('../utility/cloudinary')


const addReport = async (req,res) => {
    const report = req.files.report;
    const {id} = req.body;
    const role = req.user.role;

    if(role !== "lab-assistant") return res.status(400).json({
        message:"Not Authorised."
    })
    try{
        const uploadedReport = await upload.uploadImage(report);

        if(!uploadedReport) return res.status(404).json({
            message:"Failed to make image url."
        })
        const imgUrl = uploadedReport[0].url;

        const testReport = await testReportModel.findById(id);
        testReport.report = imgUrl;
        testReport.reportStatus = 'completed';
        testReport.save();

        return res.status(200).json({
            message:"Report added."
        })
        
    } catch(error) {
        res.status(500).json({
            message: error.message
        })
    }

    return
}

const getReportByID = async (req,res) => {
    const {id} = req.params;

    try{
        const testReport = await testReportModel.findById(id).populate('test').populate({
            path:'appointment',
            populate:{
                path:'doctor'
            }
        });

        res.status(200).json({
            message:"Report",
            testReport
        })
    } catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const getPendingReports = async (req,res) => {
    try{
        const tests = await testReportModel.find({reportStatus: 'pending'})
                                            .populate({
                                                path:'test',
                                                populate:{
                                                    path:'lab'
                                                }
                                            })
                                            .populate('appointment');

        return res.status(200).json({
            message:"Tests with pending status.",
            tests
        })
    } catch(error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const getInprocessReports = async (req,res) => {
    try{
        const tests = await testReportModel.find({reportStatus: 'in-process'})
                                            .populate({
                                                path:'test',
                                                populate:{
                                                    path:'lab'
                                                }
                                            })
                                            .populate('appointment');

        return res.status(200).json({
            message:"Tests with in-process status.",
            tests
        })
    } catch(error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const getCompletedReports = async (req,res) => {
    try{
        const tests = await testReportModel.find({reportStatus: 'completed'})
                                            .populate({
                                                path:'test',
                                                populate:{
                                                    path:'lab'
                                                }
                                            })
                                            .populate('appointment');

        return res.status(200).json({
            message:"Tests with completed status.",
            tests
        })
    } catch(error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const getAllReports = async (req,res) => {
    try{
        const tests = await testReportModel.find()
                                            .populate({
                                                path:'test',
                                                populate:{
                                                    path:'lab'
                                                }
                                            })
                                            .populate('appointment');

        return res.status(200).json({
            message:"All test reports.",
            tests
        })
    } catch(error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const updateReportStatus = async (req,res) => {
    const {id, status} = req.body;
    if(!id || !status) return res.status(400).json({
        message:"Req. body not found."
    })

    try{
        const test = await testReportModel.findByIdAndUpdate(id,{reportStatus: status},{new: true})

        return res.status(200).json({
            message:"Tests status updated.",
            test
        })
    } catch(error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const getUserTestReportHistory = async (req,res) => {
    const role = req.user.role;


    try{
    if(role === "user"){
        const UserId = req.user._id;
        const testReports = await testReportModel.aggregate([
                              {
                                $lookup: {
                                  from: 'appointments',
                                  localField: 'appointment',
                                  foreignField: '_id',
                                  as: 'appointment'
                                }
                              },
                              { $unwind: '$appointment' },
                              { 
                                $match: { 
                                    'appointment.user': new mongoose.Types.ObjectId(UserId) 
                                } 
                            }
                            ]);

        return res.status(200).json({
            message:"All test reports.",
            testReports
        })
    } else if (role === "doctor"){
        const UserId = req.user.doctor;
        const testReports = await testReportModel.aggregate([
                              {
                                $lookup: {
                                  from: 'appointments',
                                  localField: 'appointment',
                                  foreignField: '_id',
                                  as: 'appointment'
                                }
                              },
                              { $unwind: '$appointment' },
                              { 
                                $match: { 
                                    'appointment.user': new mongoose.Types.ObjectId(UserId) 
                                } 
                            }
                            ]);

        return res.status(200).json({
            message:"All test reports.",
            testReports
        })
    } else if(role === "lab-assistant"){
        const UserId = req.user.lab;
        const testReports = await testReportModel.aggregate([
                              {
                                $lookup: {
                                  from: 'tests',
                                  localField: 'test',
                                  foreignField: '_id',
                                  as: 'test'
                                }
                              },
                              { $unwind: '$test' },
                              { 
                                $match: { 
                                    'test.lab': new mongoose.Types.ObjectId(UserId) 
                                } 
                            }
                            ]);

        return res.status(200).json({
            message:"All test reports.",
            testReports
        })
    }
        
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {getPendingReports ,getInprocessReports ,getCompletedReports ,getAllReports ,updateReportStatus ,getUserTestReportHistory ,addReport , getReportByID}