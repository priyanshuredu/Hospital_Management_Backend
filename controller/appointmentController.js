const appointmentModel = require('../modeL/appointmentModel')
const mongoose = require('mongoose');
const doctorModel = require('../model/doctorModel');
const userModel = require('../model/userModel');

const createAppointment = async (req,res) => {
    const {hospital ,doctor , appointmentDate ,timeSlot ,patientName ,patientPhone ,patientAge ,patientGender ,fee ,bookingDate} = req.body;
    const userId = '6a01e1565a83dda2f97d1c6c';

    if(!hospital || !doctor || !appointmentDate || !timeSlot || !patientName || !patientPhone || !patientAge || !patientGender || !fee || !bookingDate) return res.status(400).json({
        message:'Req body not found.'
    })

    try{
        const appointment_data = {user: userId, hospital, doctor, appointmentDate ,timeSlot ,patientName ,patientPhone ,patientAge ,patientGender ,fee ,bookingDate};
        const appointment = await appointmentModel.create(appointment_data);

        console.log("Appointment:",appointment)
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
    const role = req.user.role
    const hospitalId = req.user.hospital
    console.log("USer",req.user)
    if(role === 'hospital-admin'){
        try{
            console.log("ID :",hospitalId)
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
    const role = 'doctor';
    const doctorId = '6a06ae7d5b5c5ce49d1553af'
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
    console.log("first",req.body)
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
// NEW ENDPOINTS FOR DOCTOR HOME PAGE (REFACTORED)

// Get doctor dashboard stats
const getDoctorStats = async (req, res) => {
    try {
        const doctorId = req.user.doctor;
        
        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID not found in user profile'
            });
        }
        
        // Get current date (start of day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Get all appointments for this doctor using MongoDB query instead of filtering in JS
        const allAppointments = await appointmentModel.find({ doctor: doctorId });
        
        // Use MongoDB aggregation for better performance
        const todayAppointmentsCount = await appointmentModel.countDocuments({
            doctor: doctorId,
            appointmentDate: {
                $gte: today,
                $lt: tomorrow
            }
        });
        
        const completedAppointmentsCount = await appointmentModel.countDocuments({
            doctor: doctorId,
            appointmentAttended: true
        });
        
        const totalRevenueResult = await appointmentModel.aggregate([
            {
                $match: {
                    doctor: doctorId,
                    appointmentAttended: true
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$fee' }
                }
            }
        ]);
        
        const upcomingAppointmentsCount = await appointmentModel.countDocuments({
            doctor: doctorId,
            appointmentDate: { $gt: new Date() },
            appointmentAttended: { $ne: true }
        });
        
        const totalPatients = allAppointments.length;
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;
        
        return res.status(200).json({
            success: true,
            stats: {
                totalPatients,
                todayAppointments: todayAppointmentsCount,
                completedAppointments: completedAppointmentsCount,
                totalRevenue,
                upcomingAppointments: upcomingAppointmentsCount
            }
        });
    } catch (error) {
        console.error('Error in getDoctorStats:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get today's appointments for doctor
const getTodayAppointments = async (req, res) => {
    try {
        const doctorId = req.user.doctor;
        
        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID not found in user profile'
            });
        }
        
        // Get today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const appointments = await appointmentModel.find({
            doctor: doctorId,
            appointmentDate: {
                $gte: today,
                $lt: tomorrow
            }
        })
        .populate('user', 'username email profile_image')
        .sort({ timeSlot: 1 });
        
        // Format the response
        const formattedAppointments = appointments.map(apt => ({
            _id: apt._id,
            patientName: apt.patientName,
            patientPhone: apt.patientPhone,
            patientAge: apt.patientAge,
            patientGender: apt.patientGender,
            timeSlot: apt.timeSlot,
            appointmentDate: apt.appointmentDate,
            appointmentAttended: apt.appointmentAttended,
            fee: apt.fee,
            user: apt.user
        }));
        
        return res.status(200).json({
            success: true,
            appointments: formattedAppointments
        });
    } catch (error) {
        console.error('Error in getTodayAppointments:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get upcoming appointments for doctor
const getUpcomingAppointments = async (req, res) => {
    try {
        const doctorId = req.user.doctor;
        
        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID not found in user profile'
            });
        }
        
        const { limit = 10 } = req.query;
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        const appointments = await appointmentModel.find({
            doctor: doctorId,
            appointmentDate: { $gt: currentDate },
            appointmentAttended: { $ne: true }
        })
        .populate('user', 'username email profile_image')
        .sort({ appointmentDate: 1, timeSlot: 1 })
        .limit(parseInt(limit));
        
        // Format the response
        const formattedAppointments = appointments.map(apt => ({
            _id: apt._id,
            patientName: apt.patientName,
            patientPhone: apt.patientPhone,
            patientAge: apt.patientAge,
            patientGender: apt.patientGender,
            timeSlot: apt.timeSlot,
            appointmentDate: apt.appointmentDate,
            fee: apt.fee,
            user: apt.user
        }));
        
        return res.status(200).json({
            success: true,
            appointments: formattedAppointments,
            count: formattedAppointments.length
        });
    } catch (error) {
        console.error('Error in getUpcomingAppointments:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get doctor profile information
const getDoctorProfile = async (req, res) => {
    console.log("first")
    try {
        const doctorId = req.user.doctor;
        const userId = req.user._id;
        
        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: 'Doctor profile not found for this user'
            });
        }
        
        // Fetch doctor details
        const doctor = await doctorModel.findById(doctorId)
            .populate('sub_department', 'sub_departmentName department')
            .populate('hospital', 'hospital_name hospital_address city');
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }
        
        // Fetch user details
        const user = await userModel.findById(userId).select('username email profile_image');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        return res.status(200).json({
            success: true,
            doctor: {
                id: doctor._id,
                name: doctor.doctor_name,
                qualification: doctor.qualification || 'N/A',
                degree: doctor.degree || 'N/A',
                experience: doctor.experience || 0,
                consultation_fee: doctor.consultation_fee || 0,
                sub_department: doctor.sub_department || null,
                hospital: doctor.hospital || null,
                username: user.username,
                email: user.email,
                profile_image: user.profile_image || null
            }
        });
    } catch (error) {
        console.error('Error in getDoctorProfile:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update appointment status (confirm/cancel/complete)
// Note: This uses appointmentStatus field which doesn't exist in your schema
// Fixed to use appointmentAttended field instead
const updateAppointmentStatus = async (req, res) => {
    const { id, status } = req.body;
    
    if (!id || !status) {
        return res.status(400).json({
            success: false,
            message: 'Appointment ID and status are required'
        });
    }
    
    try {
        let updateData = {};
        
        // Map status to actual database fields
        switch(status) {
            case 'completed':
                updateData = { appointmentAttended: true };
                break;
            case 'pending':
            case 'confirmed':
                updateData = { appointmentAttended: false };
                break;
            case 'cancelled':
                // You might want to add a cancelled field to your schema
                updateData = { appointmentAttended: false };
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Use: completed, pending, confirmed, or cancelled'
                });
        }
        
        const updatedAppointment = await appointmentModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedAppointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }
        
        return res.status(200).json({
            success: true,
            message: `Appointment marked as ${status} successfully`,
            appointment: updatedAppointment
        });
    } catch (error) {
        console.error('Error in updateAppointmentStatus:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get appointments by date range
const getAppointmentsByDateRange = async (req, res) => {
    try {
        const doctorId = req.user.doctor;
        
        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID not found in user profile'
            });
        }
        
        const { startDate, endDate } = req.query;
        
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date and end date are required'
            });
        }
        
        // Parse dates and set to start/end of day
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        // Validate dates
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use YYYY-MM-DD'
            });
        }
        
        if (start > end) {
            return res.status(400).json({
                success: false,
                message: 'Start date must be before end date'
            });
        }
        
        const appointments = await appointmentModel.find({
            doctor: doctorId,
            appointmentDate: {
                $gte: start,
                $lte: end
            }
        })
        .populate('user', 'username email profile_image')
        .sort({ appointmentDate: 1, timeSlot: 1 });
        
        // Group appointments by date
        const groupedByDate = appointments.reduce((acc, apt) => {
            const dateKey = apt.appointmentDate.toISOString().split('T')[0];
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push({
                _id: apt._id,
                patientName: apt.patientName,
                patientPhone: apt.patientPhone,
                patientAge: apt.patientAge,
                patientGender: apt.patientGender,
                timeSlot: apt.timeSlot,
                appointmentAttended: apt.appointmentAttended,
                fee: apt.fee,
                user: apt.user
            });
            return acc;
        }, {});
        
        return res.status(200).json({
            success: true,
            appointments,
            groupedByDate,
            totalCount: appointments.length,
            dateRange: { startDate: start, endDate: end }
        });
    } catch (error) {
        console.error('Error in getAppointmentsByDateRange:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Additional helper function: Get appointment summary by week/month
const getAppointmentSummary = async (req, res) => {
    try {
        const doctorId = req.user.doctor;
        const { period = 'week' } = req.query; // week or month
        
        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID not found in user profile'
            });
        }
        
        let startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        
        if (period === 'week') {
            // Get start of current week (Sunday)
            startDate.setDate(startDate.getDate() - startDate.getDay());
        } else if (period === 'month') {
            // Get start of current month
            startDate.setDate(1);
        }
        
        const appointments = await appointmentModel.find({
            doctor: doctorId,
            appointmentDate: { $gte: startDate },
            appointmentAttended: true
        });
        
        // Calculate daily stats
        const dailyStats = {};
        appointments.forEach(apt => {
            const dateKey = apt.appointmentDate.toISOString().split('T')[0];
            if (!dailyStats[dateKey]) {
                dailyStats[dateKey] = {
                    count: 0,
                    revenue: 0
                };
            }
            dailyStats[dateKey].count++;
            dailyStats[dateKey].revenue += apt.fee || 0;
        });
        
        const totalAppointments = appointments.length;
        const totalRevenue = appointments.reduce((sum, apt) => sum + (apt.fee || 0), 0);
        
        return res.status(200).json({
            success: true,
            summary: {
                period,
                startDate,
                totalAppointments,
                totalRevenue,
                dailyStats,
                averagePerDay: totalAppointments / Object.keys(dailyStats).length || 0
            }
        });
    } catch (error) {
        console.error('Error in getAppointmentSummary:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAppointmentHistoryByUser = async (req,res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit); 
    const userRole = req.user.role;
    if(!page || !limit) return res.status(400).json({
        message:"Req. query not found."
    })
    
    try{
        const skip = (page - 1)*limit;
        if(userRole === "admin"){
            const appointments = await appointmentModel.find().sort({createdAt: -1}).skip(skip).limit(limit);
            const totalItems = await appointmentModel.countDocuments();
            const totalPage = Math.ceil(totalItems/limit);
            console.log("Appointments :",appointments,"\nTotal Items:",totalItems,"\nTotal Pages:",totalPage);
            return res.status(200).json({
                message:"All appointments",
                appointments,
                totalPage
            })
        } else if(userRole === "doctor"){
            console.log("first")
            const doctorId = req.user.doctor;
            const appointments = await appointmentModel.find({doctor :doctorId}).sort({createdAt: -1}).skip(skip).limit(limit);
            const totalItems = await appointmentModel.countDocuments();
            const totalPage = Math.ceil(totalItems/limit);
            console.log("Appointments :",appointments,"\nTotal Items:",totalItems,"\nTotal Pages:",totalPage);
            return res.status(200).json({
                message:"All appointments",
                appointments,
                totalPage
            })
        } else if(userRole === "hospital-admin"){
            const hospitalId = req.user.hospital;
            const appointments = await appointmentModel.find({hospital :hospitalId}).sort({createdAt: -1}).skip(skip).limit(limit);
            const totalItems = await appointmentModel.countDocuments();
            const totalPage = Math.ceil(totalItems/limit);
            console.log("Appointments :",appointments,"\nTotal Items:",totalItems,"\nTotal Pages:",totalPage);
            return res.status(200).json({
                message:"All appointments",
                appointments,
                totalPage
            })
        } else if(userRole === "user"){
            const userId = req.user._id;
            const appointments = await appointmentModel.find({user :userId}).sort({createdAt: -1}).skip(skip).limit(limit);
            const totalItems = await appointmentModel.countDocuments();
            const totalPage = Math.ceil(totalItems/limit);
            console.log("Appointments :",appointments,"\nTotal Items:",totalItems,"\nTotal Pages:",totalPage);
            return res.status(200).json({
                message:"All appointments",
                appointments,
                totalPage
            })
        }
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const getAllPatients = async (req, res) => {

}

module.exports = {
    createAppointment,
    getAppointmentById,
    getAllAppointmentsByUser,
    getAllAppointmentsByHospital,
    getAllAppointmentsByDoctors,
    updateAppointmentAttendance,
    getDoctorStats,
    getTodayAppointments,
    getUpcomingAppointments,
    getDoctorProfile,
    updateAppointmentStatus,
    getAppointmentsByDateRange,
    getAppointmentSummary,
    getAllPatients,
    getAppointmentHistoryByUser  // Add this new helper function
};