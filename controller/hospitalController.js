const bcrypt = require('bcrypt');
const userModel = require('../model/userModel')
const hospitalModel = require('../model/hospitalModel')
const mongoose = require('mongoose');
const {sendWelcomeEmail ,sendHospitalApprovalEmail ,sendHospitalRejectionEmail} = require('../utility/mailServices')
const {generatePasswordWithUUID} = require('../utility/uuidGenerator');

const createHospital = async (req,res) => {
    const {hospital_name, registration_no, hospital_type, ownership, established_year, email, primary_phone, secondary_phone, hospital_address, city, district, state, total_doctors, total_beds, icu_beds, emergency_service, ambulance_service, departments, hospital_manager, hospital_description} = req.body;
    console.log("Req body :",req.body)

    const requiredFields = [
    'hospital_name', 'registration_no', 'hospital_type', 'email', 
    'primary_phone', 'hospital_address', 'city', 'district', 
    'state', 'total_doctors', 'total_beds', 'icu_beds', 
    'emergency_service', 'ambulance_service', 'departments', 
    'hospital_manager', 'hospital_description'
];

const missingFields = requiredFields.filter(field => !req.body[field]);

if (missingFields.length > 0) {
    return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields: missingFields
    });
}

    // if(!hospital_name || !registration_no || !hospital_type || !ownership || !established_year || !email || !primary_phone || !secondary_phone || !hospital_address || !city || !district || !state || !total_doctors || !total_beds || !icu_beds || !emergency_service || !ambulance_service || !departments || !hospital_manager || !hospital_description) return res.status(400).json({
    // message: 'Req body not found.'
    // });

    if(hospital_name.length < 10 || hospital_name.length > 100) {
        return res.status(400).json({
            success: false,
            message: 'Hospital name must be between 10 and 100 characters.'
        });
    }
    
    if(registration_no.length > 16) {
        return res.status(400).json({
            success: false,
            message: 'Registration number cannot exceed 16 characters.'
        });
    }   
    const validHospitalTypes = ['govt.', 'private', 'trust', 'corporate'];
    if(!validHospitalTypes.includes(hospital_type)) {
        return res.status(400).json({
            success: false,
            message: 'Hospital type must be one of: govt., private, trust, corporate.'
        });
    }
    // 5. ownership validations (optional field but validate if provided)
    if(ownership && !['individual', 'partnership', 'pvt ltd', 'ngo'].includes(ownership)) {
        return res.status(400).json({
            success: false,
            message: 'Ownership must be one of: individual, partnership, pvt ltd, ngo.'
        });
    }

    // 6. established_year validations
    if(established_year.toString().length !== 4 || established_year < 1800 || established_year > new Date().getFullYear()) {
        return res.status(400).json({
            success: false,
            message: `Established year must be a valid 4-digit year between 1800 and ${new Date().getFullYear()}.`
        });
    }

    // 7. email validations (basic)
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if(!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address.'
        });
    }

    // 8. primary_phone validations
    if(primary_phone.toString().length !== 10 || isNaN(primary_phone)) {
        return res.status(400).json({
            success: false,
            message: 'Primary phone number must be exactly 10 digits.'
        });
    }

    // 9. secondary_phone validations (optional but validate if provided)
    if(secondary_phone && (secondary_phone.toString().length !== 10 || isNaN(secondary_phone))) {
        return res.status(400).json({
            success: false,
            message: 'Secondary phone number must be exactly 10 digits.'
        });
    }

    // 10. hospital_address validations
    if(hospital_address.length > 200) {
        return res.status(400).json({
            success: false,
            message: 'Hospital address cannot exceed 200 characters.'
        });
    }

    // 11. city, district, state validations (MongoDB ObjectId check)
    if(!mongoose.Types.ObjectId.isValid(city)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid city ID format.'
        });
    }
    if(!mongoose.Types.ObjectId.isValid(district)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid district ID format.'
        });
    }
    if(!mongoose.Types.ObjectId.isValid(state)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid state ID format.'
        });
    }

    // 12. total_doctors validations
    if(total_doctors < 0 || !Number.isInteger(total_doctors)) {
        return res.status(400).json({
            success: false,
            message: 'Total doctors must be a positive integer.'
        });
    }

    // 13. total_beds validations
    if(total_beds < 0 || !Number.isInteger(total_beds)) {
        return res.status(400).json({
            success: false,
            message: 'Total beds must be a positive integer.'
        });
    }

    // 14. icu_beds validations
    if(icu_beds < 0 || !Number.isInteger(icu_beds)) {
        return res.status(400).json({
            success: false,
            message: 'ICU beds must be a positive integer.'
        });
    }

    // 15. ICU beds cannot exceed total beds
    if(icu_beds > total_beds) {
        return res.status(400).json({
            success: false,
            message: 'ICU beds cannot exceed total beds.'
        });
    }

    // 16. emergency_service validations (boolean)
    if(typeof emergency_service !== 'boolean') {
        return res.status(400).json({
            success: false,
            message: 'Emergency service must be true or false.'
        });
    }

    // 17. ambulance_service validations (boolean)
    if(typeof ambulance_service !== 'boolean') {
        return res.status(400).json({
            success: false,
            message: 'Ambulance service must be true or false.'
        });
    }

    // 18. departments validations
    if(!Array.isArray(departments) || departments.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Departments must be a non-empty array.'
        });
    }

    // 19. hospital_manager validations
    if(hospital_manager.length > 50) {
        return res.status(400).json({
            success: false,
            message: 'Hospital manager name cannot exceed 50 characters.'
        });
    }

    // 20. hospital_description validations
    if(hospital_description.length > 500) {
        return res.status(400).json({
            success: false,
            message: 'Hospital description cannot exceed 500 characters.'
        });
    }

    try{
        const hospital_data = {hospital_name, registration_no, hospital_type, ownership, established_year, email, primary_phone, secondary_phone, hospital_address, city, district, state, total_doctors, total_beds , icu_beds, emergency_service, ambulance_service, departments, hospital_manager, hospital_description};
        const result = await hospitalModel.create(hospital_data);

        return res.status(200).json({
            success: true,
            message:"Hospital added successfully.",
            result
        })
    } catch(error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }

}

const getHospitalById = async (req,res) => {
    const {id} = req.params;

    if(!id) return res.status(400).json({
        success: false,
        message: "Id is required."
    })

    try{
        const hospital = await hospitalModel.findById(id)
        .populate("state","stateName")
        .populate("district","districtName")
        .populate("city","cityName");

        if(hospital) return res.status(200).json({
            success: true,
            message: "Hospital found.",
            hospital
        })  
        else return res.status(400).json({
            success: false,
            message: "No hospital found in database"
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateHospitalStatus = async (req,res) => {
    const {id ,status} = req.body;

    if(!id || !status) return res.status(400).json({
        success: false,
        message: "Req body not found."
    })

    const validHospitalStatus = ['pending','approved','rejected'];
    if(!validHospitalStatus.includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Hospital status must be one of: pending, approved or rejected.'
        });
    }
    const session = await mongoose.startSession();
    try{
        session.startTransaction();

        const hospital = await hospitalModel.findByIdAndUpdate(id ,{status : status},{new :true});

        const hospitalMail = hospital.email;
        const hospitalName = hospital.hospital_name;
        if(hospital.status === 'pending'){
            return res.status(200).json({
                success: true,
                message: "Status updated successfully.",
                hospital
            })
        } else if(hospital.status === 'rejected') {
            sendHospitalRejectionEmail(hospitalMail ,hospitalName);
            return res.status(200).json({
                success: true,
                message: "Status updated successfully.",
                hospital
            })
        } else if(hospital.status === 'approved') {
            const password = generatePasswordWithUUID();
            sendHospitalApprovalEmail(hospitalMail ,hospitalName ,password);
            const user_data = {username: hospital.hospital_name ,email :hospital.email ,password ,role:"hospital-admin" }

            const user = await userModel.create(user_data);
            if(user){
                return res.status(200).json({
                success: true,
                message: "User created successfully.",
                user
            })
            }
        }

    } catch(error){
        session.abortTransaction();
        return res.status(500).json({
            success: false,
            message: error.message
        })
    } finally {
        session.endSession();
    }
}

const getAllHospitals = async (req,res) => {
    try{
        const hospitals = await hospitalModel.find().populate("city","cityName");

        if(hospitals.length === 0){
            return res.status(200).json({
                success: true,
                message: "No hospitals present in database."
            })
        } 
        if(hospitals.length > 0){
            return res.status(200).json({
                success: true,
                message: "Hospitals present in database.",
                hospitals
            })
        }
    } catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {createHospital ,updateHospitalStatus ,getHospitalById ,getAllHospitals};