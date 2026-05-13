const departmentModel = require('../model/departmentModel');
const subDepartmentModel = require('../model/subDepartmentModel');
const mongoose = require('mongoose');

const createDepartment = async (req,res) => {
    const { departmentName} = req.body;
    if(!departmentName) return res.status(400).json({
        success: false,
        message:"Req body not found."
    })

    if(departmentName.length < 21) {
        return res.status(400).json({
            success: false,
            message: 'Department name is greater than 20 characters.'
        });
    }

    try{
        const existingDepartment = await departmentModel.findOne({departmentName});
        if(existingDepartment) return res.status(400).json({
            success: false,
            message: `${departmentName} is already exists.`
        })

        const result = await departmentModel.create({departmentName});
        if(result) return res.status(200).json({
            success: true,
            message:"New department added successfully.",
            result
        })
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getAllDepartments = async (req,res) => {
    try{
        const departments = await departmentModel.find();

        return res.status(200).json({
            success: true,
            message: "All states.",
            departments
        })
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateDepartmentStatus = async (req,res) => {
    const {id ,status} = req.body;
    if(!status) return res.status(400).json({
        success: false,
        message:"Req body not found."
    })

    const validStatus = ['active', 'inactive'];
    if(!validStatus.includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Department status must be one of: active or inactive.'
        });
    }
    try{
        const updatedDepartment = await departmentModel.findByIdAndUpdate(id,{status: status},{new: true});

        if(updatedDepartment) return res.status(200).json({
            success: true,
            message:`${result.departmentName} status changed to ${status} successfully.`,
            updatedDepartment
        })
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteDepartment = async (req,res) => {
    const {id} = req.params;
    if(!id) return res.status(400).json({
        success: false,
        message:"Id not found."
    })

    const session = await mongoose.startSession();
    try{
        await session.startTransaction();

        const deletedsubDepartments = await subDepartmentModel.deleteMany({department: id},{session});

        const deletedDepartment = await departmentModel.findByIdAndDelete(id ,{session});

        await session.commitTransaction();
        return res.status(200).json({
            success: true,
            message:`Department and associated sub-departments deleted successfully.`,
            deletedDepartment,
            deletedsubDepartments
        })
    } catch(error){
        await session.abortTransaction();
        return res.status(500).json({
            success: false,
            message: error.message
        })
    } finally{
        await session.endSession();
    }
}

const getDepartmentById = async (req, res) => {
    const { id } = req.params;
    if(!id) return res.status(400).json({
        success: false,
        message:"Id not found."
    })
    try {
        const department = await departmentModel.findById(id);
        if (!department) {
            return res.status(404).json({ 
                success: false,
                message: "Department not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Department found",
            department
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {createDepartment ,getAllDepartments ,getDepartmentById ,updateDepartmentStatus ,deleteDepartment}