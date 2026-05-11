const adminModel = require('../model/adminModel');
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel')
const mongoose = require('mongoose');

const createAdmin = async (req,res) => {
    const {username ,email ,phoneNumber ,age ,bg_description ,gender ,password} = req.body;
    if(!username || !email || !phoneNumber || !age || !bg_description || !gender || !password) return res.status(400).json({
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

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password ,salt);
        const admin = {username ,email ,phoneNumber ,age ,bg_description ,gender ,password:hash};
        const user = {username ,email ,password:hash ,role:"admin"};

        const adminResult = new adminModel(admin);
        adminResult.save({session});
        
        const userResult = new userModel(user);
        userResult.save({session});

        await session.commitTransaction();
        if(adminResult && userResult) return res.status(200).json({
            message:"Admin created successfully in both tables",
            adminResult,
            userResult
        })
    } catch(error) {
        await session.abortTransaction();
        return res.status(500).json({
            message: error.message
        })
    } finally{
        await session.endSession();
    }
}

module.exports = { createAdmin}