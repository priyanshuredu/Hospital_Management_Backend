const adminModel = require('../model/adminModel');
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel')
const mongoose = require('mongoose');
const {sendWelcomeEmail} = require('../utility/mailServices')
const generatePasswordWithUUID = require('../utility/uuidGenerator')

const createAdmin = async (req,res) => {
    const {username ,email ,phoneNumber ,age ,bg_description ,gender } = req.body;
    if(!username || !email || !phoneNumber || !age || !bg_description || !gender ) return res.status(400).json({
        message:"Req body not found."
    })

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const existingUser = await adminModel.find({email});
        if(existingUser.length !== 0) return res.status(400).json({
            message:`Admin already exists with ${email}`
        })

        const existingUsername = await adminModel.findOne({username});
        if(existingUsername) return res.status(400).json({
            message:`Username is already taken ${username}.`
        })

        const password = generatePasswordWithUUID()
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password ,salt);
        const user = {username ,email ,password:hash ,role:"admin"};
        const userResult = await userModel.create(user,{session});
        const userId = userResult._id;
        
        const admin = {username ,email ,phoneNumber ,age ,bg_description ,gender ,password:hash , user:userId};
        const adminResult = new adminModel(admin);
        adminResult.save({session});


        await session.commitTransaction();
        if(adminResult && userResult) {
            const userRole = userResult.role;
            sendWelcomeEmail(email ,username ,password , userRole);

            return res.status(200).json({
            message:"Admin created successfully in both tables",
            adminResult,
            userResult
        })
    }
    } catch(error) {
        await session.abortTransaction();
        return res.status(500).json({
            message: error.message
        })
    } finally{
        await session.endSession();
    }
}

const updateAdminInfo = async (req,res) => {
    const {username ,email ,phoneNumber ,age ,bg_description ,gender } = req.body;
    const id = req.user._id
    console.log("Id :",id);
    if(!username || !email || !phoneNumber || !age || !bg_description || !gender) return res.status(400).json({
        message:"Req body not found."
    })

    try{
        const updatedData = {username ,email ,phoneNumber ,age ,bg_description ,gender};
        const adminUpdatedInfo = await userModel.findByIdAndUpdate(id, updatedData,{new: true})
        console.log("Updated data :",adminUpdatedInfo);

        return res.status(200).json({
            message:`${username} info updated.`,
            adminUpdatedInfo
        });
    } catch(error){
        return res.status(400).json({
            message:error.message
        });
    }
}

module.exports = { createAdmin ,updateAdminInfo }