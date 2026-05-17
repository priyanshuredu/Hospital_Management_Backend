const doctorModel = require('../model/doctorModel')
const doctorImageModel = require('../model/doctorImageModel')
const userModel = require('../model/userModel');
const mongoose = require('mongoose');
const upload = require('../utility/cloudinary')
const bcrypt = require('bcrypt')
const {sendWelcomeEmail} = require('../utility/mailServices')
const { generatePasswordWithUUID } = require('../utility/uuidGenerator');

const createDoctor = async (req,res) => {
    const images = req.files.images;
    const hospitalId = '6a0375dae1ad0eaad0f5238a'
    const {doctor_name, email, phone ,gender ,age ,qualification ,degree ,institution ,yearOfCompletion ,experience ,sub_department , consultation_fee ,imageNames} = req.body;

    if(!images) return res.status(400).json({
        message: "No images found."
    })

    const session = await mongoose.startSession();
    try{
        session.startTransaction();
        
        const existingDoctor = await doctorModel.findOne({email});
        if(existingDoctor) return res.status(400).json({
            message: `Doctor already exists with ${email}.`,
            existingDoctor
        })

        const password = generatePasswordWithUUID();
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password ,salt);
        const username = doctor_name

        const user_data = {username ,email ,password: hash ,role:"doctor"}
        const user = await userModel.create([user_data],{session});
        console.log(">>>>>>>>>>>>>>>36user :",user)

        if(user) {
            const role = user.role;
            sendWelcomeEmail(email ,username ,password ,role);

            const doctor_data = {doctor_name, email, phone ,gender ,age ,qualification ,degree ,institution ,yearOfCompletion ,experience ,sub_department , consultation_fee ,hospital: hospitalId};

            const doctor = await doctorModel.create([doctor_data],{session});
            console.log(">>>>>>>>>>>>>>>>>>>.45doc :",doctor)

            if(doctor) {
                if(images){
                    const imagesKeys = imageNames;
                    
                    const uploadPromises = imageNames.map(async (key, index) => {
                        
                        const imgObj = images[index];
                        console.log(`>>>>>>>>>>>>>>>53`);
                        
                        
                        const uploadedImage = await upload.uploadImage(imgObj);
console.log(`>>>>>>>>>>>>>>>>>>>>>57`);

                        if (!uploadedImage) {
                            throw new Error(`Failed to make image url for ${key}`);
                        }

                        const imgUrl = uploadedImage[0].url;
                        console.log(">>>>>>>>>>>>>>>>..61img-url:", imgUrl);
                        const doctorId = doctor[0]._id

                        const image_data = {
                            img_name: key,
                            img_url: imgUrl,
                            doctor: doctorId
                        };
                        console.log(">>>>>>>>>>>>>>>>>>>>>72img-data:", image_data);

                        const addedImage = await doctorImageModel.create([image_data],{session});
                        console.log(">>>>>>>>>>>>>>>>>>75first",addedImage)

                        if (!addedImage) {
                            throw new Error(`Failed to add image for ${key}`);
                        }
                        return addedImage;
                    });

                    console.log(`>>>>>>>>>>>>>>84`,uploadPromises);
                    
                    try {
                        const uploadedImages = await Promise.allSettled(uploadPromises);
                        console.log(`>>>>>>>>>>>>>>>>>84>>`,uploadedImages);
                        await session.commitTransaction();
                    } catch (error) {
                        console.log(">>>>>>>>>>>>>>>>86error :",error.message)
                        return res.status(400).json({
                            message: error.message
                        });
                    }
                } else return res.status(400).json({
                    message: "Failed to create doctor."
                })
            } else return res.status(400).json({
                message: "Failed to create user."
            }) 
        } 
    } catch(error) {
        console.log(`>>>>>>>>>>>>>>???????????????????????????`);
        
        session.abortTransaction();
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>97error :",error.message)
        return res.status(500).json({
            message: error.message
        })
    } finally {
        console.log(`>>>>>>>>>>>>>>>>>>>>105>`);
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




// const str = "Hello World";
// const count = str.replace(/\s/g, '').length;
// console.log(count);