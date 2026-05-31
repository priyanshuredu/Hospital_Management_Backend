const userModel = require('../model/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const os = require('node:os')
const secretKey = process.env.secretKey;
const upload =  require('../utility/cloudinary')
const {sendWelcomeEmail ,sendForgotPasswordMail} = require('../utility/mailServices')
const generateOTPWithExpiry = require('../utility/otpServices')



const signUp = async (req,res) => {
    const {username ,email ,password} = req.body;
    if(!username || !email || !password) return res.status(400).json({
        message:"Request body not found."
    });
    try{
        const oldUser = await userModel.find({email});
        console.log("Old user:",oldUser.length)
        if(oldUser.length !== 0) return res.status(400).json({
            message:`User with ${email} already exists.`
        })

        const oldUsername = await userModel.find({username});
        if(oldUsername.length !== 0) return res.status(400).json({
            message:`${username} is not available.`
        })

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password ,salt);
        const newUser = {username, email, password:hash };
        const result = await userModel.create(newUser);
        
        sendWelcomeEmail(email , username, password)
        return res.status(201).json({
            message:"New user added to database successfully.",
            result
        });
    } catch(error){
        return res.status(400).json({
            message:error
        });
    }
}

const login = async (req,res) => {
    const {email ,password} = req.body;
    console.log("first:",req.body)
    if(!email || !password) return res.status(400).json({
        message:"Request body not found."
    });
    
    try{
        const user = await userModel.findOne({email});
        const host = await os.hostname()
        const machine = os.platform()
        if(!host) return res.status(400).json({
            messgae: "host not found."
        })
        if(!user) return res.status(400).json({
            message:`No user found with ${email}`
        });
        // console.log("first",email,password)

        const id = user._id.toString();
        const username = user.username;
        const role = user.role;
        const hashPassword = user.password;
        const oldUser = {
            _id:id,
            ...user
        }

        const match = await bcrypt.compareSync(password ,hashPassword);
        if(user.accountStatus === "active"){
            if(match){
                const token = await jwt.sign(oldUser ,secretKey);
                // res.cookie('token',token);
                user.currentStatus="online";
                await user.save();
                const userData = {id: user._id ,username :user.username ,email: user.email ,role: user.role};
                return res.status(200).json({
                    message:`logged in successfully.`,
                    token,
                    userData
                });
            }else {
                return res.status(400).json({
                    message:"Password doesn't match."
                });
            }
        } else {
            return res.status(400).json({
                message:"Account is not active contact admin."
            })
        }
    } catch(error){
        return res.status(500).json({
            message:error.message
        })
    }
}
const verifyEmail = async (req,res) => {
    const {email} = req.body;
    console.log("first",email)
    if(!email) return res.status(400).json({
        message:"Mail is missing."
    })
    
    try{
        const userExists = await userModel.findOne({email});
        if(userExists){
            const {otp ,expiresAt} = generateOTPWithExpiry();
            userExists.resetPassOtp = otp;
            userExists.otpExpireIn = expiresAt;
            sendForgotPasswordMail(email , otp, userExists.username);
            await userExists.save();
            return res.status(200).json({
                message:"Otp sent."
            })
        }
        else{
            return res.status(400).json({
                message:`No user found with ${email}.`
            })
        }
    } catch(error){
        return res.status(400).json({
            message: error
        })
    }
}
const forgotPassword = async (req,res) => {
    const {email, otp ,password} = req.body
    console.log("New",email,otp,password)
    if(!email || !otp || !password) return res.status(400).json({
        message:"Request body not found."
    })
    
    try{
        const user = await userModel.findOne({email});
        if(user){
            const currentTime = Date.now();
            const expireTime = Date(user.otpExpireIn);
            if(currentTime > expireTime) return res.status(400).json({
                message:"Otp expired."
            })
            else{
                console.log("base ",user.resetPassOtp,parseInt(otp))
                if(user.resetPassOtp === parseInt(otp)){
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(password ,salt);
                    user.password = hash;

                    await user.save();
                    return res.status(200).json({
                        message:"password updated."
                    })
                }
                else{
                    return res.status(400).json({
                        message:"Otp doesn't match."
                    })
                }
            }
        } else {
            return res.status(400).json({
                message:`User not found with ${email}`
            })
        }
    } catch(error){
        return res.status(400).json({
            message: error
        })
    }
}
const resetPassword = async (req,res) => {
    const {oldPassword ,newPassword} = req.body;
    const id = req.user._id;
    if(!oldPassword || !newPassword) return res.status(400).json({
        message:"Request body not found."
    })

    if(oldPassword === newPassword) return res.status(400).json({
        message:"Enter a new password."
    })

    try{
        const user = await userModel.findById(id);
        if(user){
            const match = await bcrypt.compareSync(oldPassword ,user.password);
            if(match){
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(newPassword ,salt);
                const result = await userModel.findByIdAndUpdate(id,{
                    password: hash
                },{new: true})
                return res.status(200).json({
                    message:`${user.username}'s password updated.`,
                    result
                })
            }
        }
        return res.status(400).json({
            message:"User not found."
        });
    } catch(error){
        return res.status(400).json({
            message:error
        });
    }
}
const getAllUsers = async (req,res) => {
    const id = req.user._id;
    // console.log("Id :",id)
    try{
        const users = await userModel.find({$and:[{_id:{$ne: id}},{role:{$eq:"user"}}]})
        const result = users.map(({ username, email, accountStatus }) => ({
                                  username,
                                  email,
                                  accountStatus
                                }));
        return res.status(200).json({
            message:"All user present in db except you.",
            result
        })
    } catch(error){
        return res.status(400).json({
            message:error
        })
    }
}
const updateUserInfo = async (req,res) => {
    const {username} = req.body;
    const preUsername = req.user.username
    const id = req.user._id
    if(!username) return res.status(400).json({
        message:"Request body not found."
    })
    if(preUsername === username) return res.status(400).json({
        message:"Same as previos username."
    })

    try{
        const result = await userModel.findByIdAndUpdate(id, {
                    username: username
                },{new: true})

        return res.status(200).json({
            message:`User updated successfully`,
            result
        });
    } catch(error){
        return res.status(400).json({
            message:error
        });
    }
}
const updateAccountStatus = async (req,res) => {
    const {id ,status} = req.body
    const role = req.user.role;

    if(!id || !status) return res.status(400).json({
        message:"Request body not found."
    })

    if(role === "admin"){
        const validStatuses = ['active','inActive'];
        if(!validStatuses.includes(status)) return res.status(400).json({
            message:'Invalid account status. Must be "active" or "inActive"'
        })
        try{
            const result = await userModel.findByIdAndUpdate(id,{
                    accountStatus: status
                },{new: true})
            return res.status(200).json({
                message:"Account status updated.",
                result
            })
        } catch(error){
            return res.status(400).json({
                message:error
            })
        }
    }
    else{
        return res.status(400).json({
            message:"Not authorized."
        })
    }
}

const getAllUserData = async (req,res) => {
    const id = req.user._id;
    const role = req.user.role
    if(!id || !role) return res.status(400).json({
        message:"Request user not Found"
    })
    if(role === "admin"){
        try{
            const response = await userModel.find({$and:[{_id:{$ne: id}},{role:{$ne:"admin"}}]});
            const filteredData = await response.map(({ _id, username, email, currentStatus, accountStatus }) => ({_id,username,email, currentStatus,accountStatus}));

            console.log("Response :",filteredData)
            return res.status(200).json({
                filteredData
            })
        } catch(error){
            return res.status(500).json({
                message: error.message
            })
        }
    } else {
        return res.status(400).json({
            message:"Not authorized."
        })
    }
}
const getUser = async (req,res) =>{
    const id = req.user._id;
    const role = req.user.role
    
    if(role === 'admin'){
        try{
        const response = await  userModel.findById(id).populate('admin');

        return res.status(200).json({
            message:"User fetched successfully.",
            response
        })

    } catch(error){
        return res.status(400).json({
            message: error.message
        })
    }
    } else if (role === 'hospital-admin') {
        try{
        const response = await  userModel.findById(id).populate('hospital');

        return res.status(200).json({
            message:"User fetched successfully.",
            response
        })

    } catch(error){
        return res.status(400).json({
            message: error.message
        })
    }
    } else if(role === 'doctor') {
        try{
        const response = await  userModel.findById(id).populate('doctor');

        return res.status(200).json({
            message:"User fetched successfully.",
            response
        })

    } catch(error){
        return res.status(400).json({
            message: error.message
        })
    }
    } else if(role === 'lab-assistant') {
        try{
        const response = await  userModel.findById(id).populate('lab');

        return res.status(200).json({
            message:"User fetched successfully.",
            response
        })

    } catch(error){
        return res.status(400).json({
            message: error.message
        })
    }
    } else {
        try{
        const response = await  userModel.findById(id);

        return res.status(200).json({
            message:"User fetched successfully.",
            response
        })

    } catch(error){
        return res.status(400).json({
            message: error.message
        })
    }
    }
    
}

const updateProfile = async (req,res) => {
    console.log("image:",req.files.image)
    const id = req.user._id
    const image =req.files.image


    if(!id || !image) return res.status(404).json({
        message:"Request body not found."
    })

    try{
        const uploadedImage = await upload.uploadImage(image);

        if(!uploadedImage) return res.status(404).json({
            message:"Failed to make image url."
        })
        const imgUrl = uploadedImage[0].url;

        // console.log("Img url:",imgUrl)

        const user = await userModel.findById(id);
        user.profile_image = imgUrl;
        await user.save();

        return res.status(200).json({
            message:"Profile image updated successfully.",
            user
        })
    } catch(error){
        return res.status(400).json({
            message: error.message
        })
    }
}

module.exports = {login, verifyEmail, forgotPassword, resetPassword, getAllUsers, updateUserInfo, updateAccountStatus ,getAllUserData ,updateProfile ,getUser}