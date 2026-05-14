const hospitalImageModel = require('../model/hospitalImageModel')

const addImage = async (req, res) => {

}

const updateImageStatus = async (req,res) => {
    const {id ,status} = req.body;
    if(!status) return res.status(400).json({
        message:"Req body not found."
    })

    try{
        const updatedImage = await hospitalImageModel.findByIdAndUpdate(id,{status: status},{new: true});

        if(updatedImage) return res.status(200).json({
            message:`Updated status to ${status} successfully.`,
            updatedImage
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const getImageById = async (req,res) => {
    const {id} = req.params;
    
    if(!id) return res.status(400).json({
        success: false,
        message: "Id is required."
    })

    try{
        const image = await hospitalImageModel.findById(id)
                        .populate("hospital","hospital_name")

        if(image) return res.status(200).json({
            success: true,
            message: "Image found.",
            image
        })  
        else return res.status(400).json({
            success: false,
            message: "No image found in database"
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getImagesByHospital = async (req,res) => {
    const { id } = req.params;
    if(!id) return res.status(400).json({
        message:"Hospital Id not found."
    }) 
    try {
        const images = await hospitalImageModel.find({ hospital: id });
        const length = images.length
        return res.status(200).json({
            message: `${length} images found`,
            images
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

const deleteImage = async (req,res) => {
    const {id} = req.params;
    if(!id) return res.status(400).json({
        message:"Id not found."
    })

    try{
        const deletedImage = await hospitalImageModel.findByIdAndDelete(id);

        return res.status(200).json({
            message:`Image deleted successfully.`,
            deletedImage
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {addImage ,updateImageStatus ,getImageById ,getImagesByHospital ,deleteImage};