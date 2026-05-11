const jwt = require('jsonwebtoken')
const userModel = require('../model/userModel')
const secretKey = process.env.secretKey;

module.exports = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if(!authorizationHeader) return res.status(400).json({
        message:"Authorization header not found."
    });

    const token = authorizationHeader.split(' ')[1];
    // console.log("Token :",token);
    if(!token) return res.status(400).json({
        message:"Token not found in header."
    });

    try{
        const user = await jwt.verify(token ,secretKey);
        const userDetails = user._doc;
        const email = userDetails.email;
        const result = await userModel.findOne({email});
        if(!result){
            return res.status(400).json({
                message:"User not found in Database."
            });
        } 
        else{
            req.user = userDetails;
            next()
        }
    } catch(error){
        return res.status(400).json({
            message:error
        })
    }
} 