const stateLoactionModel = require('../model/stateLocationModel');
const districtLocationModel = require('../model/districtLocationModel');
const mongoose = require('mongoose')

const createState = async (req,res) => {
    const {stateName } = req.body;
    if(!stateName) return res.status(400).json({
        message:"Req body not found."
    })

    try{
        const result = await stateLoactionModel.create(stateName);

        if(result) return res.status(200).json({
            message:"New State added successfully.",
            result
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const getAllStates = async (req,res) => {
    try{
        const states = await stateLoactionModel.find();

        return res.status(200).json({
            message: "All states.",
            states
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const updateStatus = async (req,res) => {
    const {id ,status} = req.body;
    if(!status) return res.status(400).json({
        message:"Req body not found."
    })

    try{
        const result = await stateLoactionModel.findByIdAndUpdate(id,{status: status},{new: true});

        if(result) return res.status(200).json({
            message:`State ${status} successfully.`,
            result
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const deleteState = async (req,res) => {
    const {id} = req.params;
    if(!id) return res.status(400).json({
        message:"Id not found."
    })

    const session = await mongoose.startSession();
    try{
        await session.startTransaction();

        const deletedDistricts = await districtLocationModel.deleteMany({state: id},{session});

        const deletedState = await stateLoactionModel.findByIdAndDelete(id ,{session});

        await session.commitTransaction();
        return res.status(200).json({
            message:`State and associated districts deleted successfully.`,
            deleteState,
            deletedDistricts
        })
    } catch(error){
        await session.abortTransaction();
        return res.status(500).json({
            message: error.message
        })
    } finally{
        await session.endSession();
    }
}