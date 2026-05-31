const labModel = require('../model/labModel')
const mongoose = require('mongoose')
const {generatePasswordWithUUID} = require('../utility/uuidGenerator')
const bcrypt = require('bcrypt') 
const userModel = require('../model/userModel')
const {sendWelcomeEmail} = require('../utility/mailServices')

const createLab = async (req,res) => {
    const {labName ,labManager ,email ,age ,qualification } = req.body;
    const hospitalId = '6a0375dae1ad0eaad0f5238a';

    if(!labName || !labManager || !email || !age || !qualification) return res.status(400).json({
        message:'Req body not found.'
    })
    
    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        const lab_data = {labName ,labManager ,email ,age ,qualification ,hospital: hospitalId};
        const lab = await labModel.create([lab_data],{session});

        const password = generatePasswordWithUUID();
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password ,salt);
        const labId = lab[0]._id;
        const user_data = {username: labManager, email ,password: hash ,role:"lab-assistant" ,lab: labId};
        const user = await userModel.create([user_data],{session});

        if(user.length !== 0 && lab.length !== 0){
            const {username ,role} = user[0];
            sendWelcomeEmail(email ,username ,password ,role);
            await session.commitTransaction();
            return res.status(200).json({
                message: 'Lab created successfully.',
                lab: lab[0]
            })
        } else{
            await session.abortTransaction();
            return res.status(400).json({
                message:'Failed to create lab.'
            })
        }

    } catch(error){
        await session.abortTransaction();
        return res.status(500).json({
            message: error.message
        })
    } finally {
        session.endSession();
    }
}

// Function to update lab data
const updateLabData = async (req, res) => {
    console.log("first")
    const { id } = req.params;
    const { labName, labManager, age, qualification } = req.body;
    const hospitalId = '6a0375dae1ad0eaad0f5238a';

    if (!id) {
        return res.status(400).json({
            message: 'Lab ID is required.'
        });
    }

    // Validate if at least one field is provided for update
    if (!labName && !labManager && !age && !qualification) {
        return res.status(400).json({
            message: 'At least one field (labName, labManager, age, qualification) is required for update.'
        });
    }

    try {
        // First check if lab exists and belongs to the hospital
        const existingLab = await labModel.findOne({ 
            _id: id, 
            hospital: hospitalId 
        });

        if (!existingLab) {
            return res.status(404).json({
                message: 'Lab not found or you do not have permission to update this lab.'
            });
        }

        // Prepare update data
        const updateData = {};
        if (labName) updateData.labName = labName;
        if (labManager) updateData.labManager = labManager;
        if (age) updateData.age = age;
        if (qualification) updateData.qualification = qualification;

        // Update the lab
        const updatedLab = await labModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        // If labManager is updated, also update the associated user's username
        if (labManager && updatedLab) {
            await userModel.findOneAndUpdate(
                { lab: id, role: "lab-assistant" },
                { username: labManager },
                { new: true }
            );
        }

        return res.status(200).json({
            message: 'Lab data updated successfully.',
            lab: updatedLab
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// Function to update lab status
const updateLabStatus = async (req, res) => {
    const { id, status } = req.body;
    const hospitalId = '6a0375dae1ad0eaad0f5238a';

    if (!id) {
        return res.status(400).json({
            message: 'Lab ID is required in request body.'
        });
    }

    if (!status) {
        return res.status(400).json({
            message: 'Status is required in request body.'
        });
    }

    // Validate status value (assuming status can be 'active', 'inactive' etc.)
    const validStatuses = ['active', 'inActive'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            message: `Invalid status. Status must be one of: ${validStatuses.join(', ')}`
        });
    }

    try {
        // First check if lab exists and belongs to the hospital
        const existingLab = await labModel.findOne({ 
            _id: id, 
            hospital: hospitalId 
        });

        if (!existingLab) {
            return res.status(404).json({
                message: 'Lab not found or you do not have permission to update this lab.'
            });
        }

        // Update the lab status
        const updatedLab = await labModel.findByIdAndUpdate(
            id,
            { status: status },
            { new: true, runValidators: true }
        );

        // Optional: Also update the associated user's status if needed
        // if (updatedLab) {
        //     // If you want to deactivate the user when lab is inactive/suspended
        //     if (status === 'inactive' || status === 'suspended') {
        //         await userModel.findOneAndUpdate(
        //             { lab: id, role: "lab-assistant" },
        //             { isActive: false } // Assuming you have an isActive field in user model
        //         );
        //     } else if (status === 'active') {
        //         await userModel.findOneAndUpdate(
        //             { lab: id, role: "lab-assistant" },
        //             { isActive: true }
        //         );
        //     }
        // }

        return res.status(200).json({
            message: `Lab status updated to '${status}' successfully.`,
            lab: updatedLab
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// Additional function: Get lab details by ID
const getLabById = async (req, res) => {
    const { id } = req.params;
    const hospitalId = '6a0375dae1ad0eaad0f5238a';

    if (!id) {
        return res.status(400).json({
            message: 'Lab ID is required.'
        });
    }

    try {
        const lab = await labModel.findOne({ 
            _id: id, 
            hospital: hospitalId 
        }).populate('hospital', 'name email'); // Populate hospital details if needed

        if (!lab) {
            return res.status(404).json({
                message: 'Lab not found or you do not have permission to view this lab.'
            });
        }

        return res.status(200).json({
            message: 'Lab details retrieved successfully.',
            lab
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

// Additional function: Get all labs for a hospital
const getAllLabs = async (req, res) => {
    console.log("first")
    const userRole = req.user.role;
    const hospitalId = '6a0375dae1ad0eaad0f5238a';
    try {
        if(userRole === "admin"){
            const labs = await labModel.find().populate('hospital','hospital_name');
            
            return res.status(200).json({
                message:"All labs",
                labs
            })
        } else if(userRole === 'hospital-admin'){
            const labs = await labModel.find({hospital: hospitalId}).populate('hospital','hospital_name')

            return res.status(200).json({
                message: 'Labs retrieved successfully.',
                labs
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const getLabsByHospital = async (req,res) => {
    const {id} = req.params;

    try{
        const labs = await labModel.find({hospital: id}).populate('hospital','hospital_name');

        return res.status(200).json({
            message:"All labs by hospital",
            labs
        })
    } catch(error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

// Export all functions
module.exports = { createLab, updateLabData, updateLabStatus, getLabById, getAllLabs ,getLabsByHospital}