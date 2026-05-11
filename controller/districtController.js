const districtLocationModel = require('../model/districtLocationModel');
const cityLocationModel = require('../model/cityLocationModel');
const mongoose = require('mongoose')

const createDistrict = async (req,res) => {
    const {districtName } = req.body;
    if(!districtName) return res.status(400).json({
        message:"Req body not found."
    })

    try{
        const result = await districtLocationModel.create(districtName);

        if(result) return res.status(200).json({
            message:"New district added successfully.",
            result
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const updateDistrictStatus = async (req,res) => {
    const {id ,status} = req.body;
    if(!status) return res.status(400).json({
        message:"Req body not found."
    })

    try{
        const result = await districtLocationModel.findByIdAndUpdate(id,{status: status},{new: true});

        if(result) return res.status(200).json({
            message:`District ${status} successfully.`,
            result
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const getAllDistricts = async (req,res) => {
    try{
        const districts = await districtLocationModel.find();

        return res.status(200).json({
            message: "All districts.",
            districts
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const deleteDistrict = async (req,res) => {
    const {id} = req.params;
    if(!id) return res.status(400).json({
        message:"Id not found."
    })

    const session = await mongoose.startSession();
    try{
        await session.startTransaction();

        const deletedCities = await cityLocationModel.deleteMany({state: id},{session});

        const deletedDistrict = await districtLocationModel.findByIdAndDelete(id ,{session});

        await session.commitTransaction();
        return res.status(200).json({
            message:`District and associated cities deleted successfully.`,
            deletedDistrict,
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

module.exports = {createDistrict ,updateDistrictStatus ,getAllDistricts ,deleteDistrict}