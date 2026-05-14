const stateLoactionModel = require('../model/stateLocationModel');
const districtLocationModel = require('../model/districtLocationModel');
const cityLocationModel = require('../model/cityLocationModel');
const mongoose = require('mongoose')

const createState = async (req,res) => {
    const {stateName } = req.body;
    if(!stateName) return res.status(400).json({
        message:"Req body not found."
    })

    try{
        const state = await stateLoactionModel.create({stateName});

        if(state) return res.status(200).json({
            message:"New State added successfully.",
            state
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

const updateStateStatus = async (req,res) => {
    const {id ,status} = req.body;
    if(!status) return res.status(400).json({
        message:"Req body not found."
    })
    const session = await mongoose.startSession();
    try{
        await session.startTransaction();

        const updatedCitiesStatus = await cityLocationModel.updateMany({state: {$eq: id}},{$set: { status: status}},{session});

        const updatedDistrictsStatus = await districtLocationModel.updateMany({state: {$eq: id}},{$set: { status: status}},{session});

        const updatedStatesStatus = await stateLoactionModel.findByIdAndUpdate(id,{status: status},{new: true});

        if(result) return res.status(200).json({
            message:`State ${status} successfully.`,
            updatedStatesStatus,
            updatedDistrictsStatus,
            updatedCitiesStatus
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

        const deletedCities = await cityLocationModel.deleteMany({state: id},{session});

        const deletedDistricts = await districtLocationModel.deleteMany({state: id},{session});

        const deletedState = await stateLoactionModel.findByIdAndDelete(id ,{session});

        await session.commitTransaction();
        return res.status(200).json({
            message:`State and associated districts deleted successfully.`,
            deleteState,
            deletedDistricts,
            deletedCities
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

const getStateById = async (req, res) => {
    const { id } = req.params;
    console.log("id :",id)
    try {
        const state = await stateLoactionModel.findById(id);
        if (!state) {
            return res.status(404).json({ message: "State not found" });
        }
        return res.status(200).json({
            message: "State found",
            state
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {createState ,getAllStates ,updateStateStatus ,deleteState ,getStateById}