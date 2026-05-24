const testReportModel = require('../model/testReport')

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

module.exports = {getPendingReports ,getInprocessReports ,getCompletedReports ,getAllReports ,updateReportStatus}