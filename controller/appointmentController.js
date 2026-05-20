const appointmentModel = require('../modeL/appointmentModel')

const createAppointment = async (req,res) => {
    const {hospital ,doctor , appointmentDate} = req.body;
    const userId = req.user._id;

    if(!hospital || !doctor || !appointmentDate) return res.status(400).json({
        message:'Req body not found.'
    })

    try{
        const appointment_data = {user: userId, hospital, doctor, appointmentDate};
        const appointment = await appointmentModel.create(appointment_data);

        return res.status(200).json({
            message:"Appointment scheduled.",
            appointment
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const getAllAppointmentsByHospital = async (req,res) => {
    const role = req.user.role;
    const hospitalId = req.user.hospital
    if(role === 'hospital-admin'){
        try{
            const appointments = await appointmentModel.find({hospital: hospitalId})
                                    .populate('user','username')
                                    .populate({
                                        path:'doctor',
                                        populate:{
                                            path:'hospital'
                                        }
                                    })
                                    
            return res.status(200).json({
                message:"All appointments",
                appointments
            })
        } catch(error){
            return res.status(500).json({
                message: error.message
            })
        }
    } else return res.status(400).json({
        message:"Not authorised."
    })
}

const getAllAppointmentsByDoctors = async (req,res) => {
    const role = req.user.role;
    const doctorId = req.user.doctor
    if(role === 'doctor'){
        try{
            const appointments = await appointmentModel.find({doctor: doctorId})
                                    .populate('user','username')
                                    .populate({
                                        path:'doctor',
                                        populate:{
                                            path:'hospital'
                                        }
                                    })
                                    
            return res.status(200).json({
                message:"All appointments",
                appointments
            })
        } catch(error){
            return res.status(500).json({
                message: error.message
            })
        }
    } else return res.status(400).json({
        message:"Not authorised."
    })
}

const getAllAppointmentsByUser = async (req,res) => {
    const role = req.user.role;
    const id = req.user._id
    if(role === 'user'){
        try{
            const appointments = await appointmentModel.find({user: id})
                                    .populate({
                                        path:'doctor',
                                        populate:{
                                            path:'hospital'
                                        }
                                    })
                                    
            return res.status(200).json({
                message:"All appointments",
                appointments
            })
        } catch(error){
            return res.status(500).json({
                message: error.message
            })
        }
    } else return res.status(400).json({
        message:"Not authorised."
    })
}

const getAppointmentById = async (req, res) => {
    const {id} = req.params;
    try{
        const appointment = await appointmentModel.findById(id);

        return res.status(200).json({
            message: "Appointment fetched.",
            appointment
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const updateAppointmentAttendance = async (req,res) =>{
    const {id ,status} = req.body;
    if(!id || !status) return res.status(400).json({
        message:'No req body found.'
    });

    try{
        const updatedAppointment = await appointmentModel.findByIdAndUpdate(id,{appointmentAttended :status},{new: true});

        return res.status(200).json({
            message:'Appointment marked as attended successfully.',
            updatedAppointment
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {createAppointment ,getAppointmentById ,getAllAppointmentsByUser ,getAllAppointmentsByHospital ,getAllAppointmentsByDoctors ,updateAppointmentAttendance};