const doctorModel = require('../model/doctorModel')
const doctorImageModel = require('../model/doctorImageModel')
const userModel = require('../model/userModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const sendWelcomeEmail = require('../utility/mailServices')
const { generatePasswordWithUUID } = require('../utility/uuidGenerator');

const createDoctor = async (req,res) => {
    const images = req.files;
    const hospitalId = ''
    const {doctor_name, email, phone ,gender ,age ,qualification ,degree ,institution ,yearOfCompletion ,experience ,sub_department , consultation_fee} = req.body;

    if(!images) return res.status(400).json({
        message: "No images found."
    })

    if(!doctor_name|| !email|| !phone || !gender || !age || !qualification || !degree || !institution || !yearOfCompletion ||!experience || !sub_department || !consultation_fee) return res.status(400).json({
        message: "No request body found."
    })

    const session = await mongoose.startSession();
    try{
        session.startTransaction();

        const existingDoctor = await doctorModel.findOne({email},{session});
        if(existingDoctor) return res.status(400).json({
            message: `Doctor already exists with ${email}.`,
            existingDoctor
        })
        const password = generatePasswordWithUUID();
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password ,salt);

        const user_data = {username: doctor_name ,email ,password: hash ,role:"doctor"}
        const user = await userModel.create(user_data,{session});

        if(user) {
            sendWelcomeEmail(email ,doctor_name ,password ,role="doctor");

            const doctor_data = {doctor_name, email, phone ,gender ,age ,qualification ,degree ,institution ,yearOfCompletion ,experience ,sub_department , consultation_fee ,hospital: hospitalId};
            const doctor = await doctorModel.create(doctor_data,{session});

            if(doctor) {
                if(images){
                    const imagesKeys = Object.keys(images);
                    imagesKeys.map( async (key) => {
                        const uploadedImage = await uploadImage(images.key);
                        
                        if(!uploadedImage) return res.status(404).json({
                            message:"Failed to make image url."
                        })
                        const imgUrl = uploadedImage[0].url;
                        console.log("img-url:",imgUrl)
        
                        const image_data = {
                            img_name: images.key,
                            img_url: imgUrl,
                            hospital: result._id
                        }
        
                        const addedImage = await doctorImageModel.create(image_data,{session})
                        if(!addedImage) return res.status(400).json({
                            message:"Failed to add image."
                        })
                    })
                }
            } else return res.status(400).json({
                message: "Failed to create doctor."
            })
        } else return res.status(400).json({
                message: "Failed to create user."
        }) 
    } catch(error) {
        session.abortTransaction();
        return res.status(500).json({
            message: error.message
        })
    } finally {
        session.endSession();
    }  
}

const getAllDoctors = async (req,res) => {
    try{
        const doctors = await doctorModel.find()
                                .populate("hospital","hospital_name")
                                .populate({
                                    path: 'sub_department',
                                    populate: {
                                        path: 'department'
                                    }
                                });

        if(doctors.length === 0){
            return res.status(200).json({
                success: true,
                message: "No doctors present in database."
            })
        } 
        if(doctors.length > 0){
            return res.status(200).json({
                success: true,
                message: "doctors present in database.",
                doctors
            })
        }
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getDoctorById = async (req,res) => {
    const {id} = req.params;
    
    if(!id) return res.status(400).json({
        success: false,
        message: "Id is required."
    })

    try{
        const doctor = await doctorModel.findById(id)
                        .populate("hospital","hospital_name")
                        .populate({
                            path: 'sub_department',
                            populate: {
                                path: 'department'
                            }
                        });

        if(doctor) return res.status(200).json({
            success: true,
            message: "doctor found.",
            doctor
        })  
        else return res.status(400).json({
            success: false,
            message: "No doctor found in database"
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateDoctorStatus = async (req,res) => {
    const {id ,status} = req.body;
    if(!status) return res.status(400).json({
        message:"Req body not found."
    })

    try{
        const updatedDoctor = await doctorModel.findByIdAndUpdate(id,{status: status},{new: true});

        if(updatedDoctor) return res.status(200).json({
            message:`${updatedDoctor.doctor_name} ${status} successfully.`,
            updatedDoctor
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const updateDoctor = async (req,res) => {
    const {id} = req.params;
    const {doctor_name, email, phone ,gender ,age ,qualification ,degree ,institution ,yearOfCompletion ,experience ,sub_department , consultation_fee} = req.body;

    if(!doctor_name|| !email|| !phone || !gender || !age || !qualification || !degree || !institution || !yearOfCompletion ||!experience || !sub_department || !consultation_fee) return res.status(400).json({
        message: "No request body found."
    })

    try{
        const doctor_data = {doctor_name, email, phone ,gender ,age ,qualification ,degree ,institution ,yearOfCompletion ,experience ,sub_department , consultation_fee };

        const updatedDoctor = await doctorModel.findByIdAndUpdate(id,{doctor_data},{nre: true});

        if(updateDoctor) return res.status(200).json({
            messsage: "Doctor updated successfully.",
            updatedDoctor
        })
        else return res.status(400).json({
            message: "Failed to update."
        })
    } catch(error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const getDoctorByHospital = async (req,res) => {
    const { id } = req.params;
    if(!id) return res.status(400).json({
        message:"Hospital Id not found."
    }) 
    try {
        const doctors = await doctorModel.find({ hospital: id });
        console.log(doctor)
        return res.status(200).json({
            message: "Doctors found",
            doctors
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const deleteDoctor = async (req,res) => {
    const {id} = req.params;
    if(!id) return res.status(400).json({
        message:"Id not found."
    })

    try{
        const deletedDoctor = await doctorModel.findByIdAndDelete(id);

        return res.status(200).json({
            message:`Doctor deleted successfully.`,
            deletedDoctor
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {createDoctor ,getAllDoctors ,getDoctorById ,updateDoctorStatus ,updateDoctor ,getDoctorByHospital ,deleteDoctor};