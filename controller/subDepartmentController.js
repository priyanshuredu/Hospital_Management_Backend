const departmentModel = require('../model/departmentModel');
const subDepartmentModel = require('../model/subDepartmentModel');

const createSubDepartment = async (req, res) => {
    const { sub_departmentName ,departmentId} = req.body;
    if(!sub_departmentName || !departmentId) return res.status(400).json({
        success: false,
        message:"Req body not found."
    })
    
    if(sub_departmentName.length > 20) {
        return res.status(400).json({
            success: false,
            message: 'Sub department name is greater than 20 characters.'
        });
    }
    
    try{
        const existingSubDepartment = await subDepartmentModel.findOne({sub_departmentName});
        if(existingSubDepartment) return res.status(400).json({
            success: false,
            message: `${subDepartment_Data} is already exists.`
        })
        const subDepartment_Data = {sub_departmentName ,department: departmentId}
        
        const result = await subDepartmentModel.create(subDepartment_Data);
        console.log(result)
        if(result) return res.status(200).json({
            success: true,
            message:"New sub-department added successfully.",
            result
        })
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getAllSubDepartments = async (req,res) => {
    try{
        const subDepartments = await subDepartmentModel.find().populate('department','departmentName');
        // console.log(subDepartments)
        return res.status(200).json({
            success: true,
            message: "All sub departments.",
            subDepartments
        })
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateSubDepartmentStatus = async (req,res) => {
    const {id ,status} = req.body;
    if(!id || !status) return res.status(400).json({
        success: false,
        message:"Req body not found."
    })

    const validStatus = ['active', 'inactive'];
    if(!validStatus.includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Sub department status must be one of: active or inactive.'
        });
    }
    try{
        const updatedSubDepartment = await subDepartmentModel.findByIdAndUpdate(id,{status: status},{new: true});

        if(updatedSubDepartment) return res.status(200).json({
            success: true,
            message:`${updatedSubDepartment.sub_departmentName} status changed to ${status} successfully.`,
            updatedSubDepartment
        })
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteSubDepartment = async (req,res) => {
    const {id} = req.params;
    if(!id) return res.status(400).json({
        success: false,
        message:"Id not found."
    })

    try{
        const deletedsubDepartment = await subDepartmentModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message:`Sub Department deleted successfully.`,
            deletedsubDepartment
        })
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getSubDepartmentById = async (req, res) => {
    const { id } = req.params;
    if(!id) return res.status(400).json({
        success: false,
        message:"Id not found."
    })
    try {
        const subDepartment = await subDepartmentModel.findById(id);
        if (!subDepartment) {
            return res.status(404).json({ 
                success: false,
                message: "Sub Department not found" });
        }
        return res.status(200).json({
            success: true,
            message: "Sub Department found",
            subDepartment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const getSubDepByDepartment = async (req, res) => {
    const { id } = req.params;
    if(!id) return res.status(400).json({
        message:"Department Id not found."
    }) 
    try {
        const subdepartments = await subDepartmentModel.find({ department: id });
        return res.status(200).json({
            message: "Sub departments found",
            subdepartments
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {createSubDepartment ,getAllSubDepartments ,getSubDepartmentById ,updateSubDepartmentStatus ,deleteSubDepartment ,getSubDepByDepartment}; 