const cityLocationModel = require('../model/cityLocationModel');

const createCity = async (req,res) => {
    const {districtId ,stateId ,cityName } = req.body;
    if(!cityName) return res.status(400).json({
        message:"Req body not found."
    })

    try{
        const cityData = {cityName ,district: districtId , state: stateId}
        const result = await cityLocationModel.create(cityData);

        if(result) return res.status(200).json({
            message:"New city added successfully.",
            result
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const updateCityStatus = async (req,res) => {
    const {id ,status} = req.body;
    if(!status) return res.status(400).json({
        message:"Req body not found."
    })

    try{
        const result = await cityLocationModel.findByIdAndUpdate(id,{status: status},{new: true});

        if(result) return res.status(200).json({
            message:`${result.cityName} ${status} successfully.`,
            result
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const getAllCities = async (req,res) => {
    try{
        const cities = await cityLocationModel.find();

        console.log(cities)
        return res.status(200).json({
            message: "All  cities.",
            cities
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const deleteCity = async (req,res) => {
    const {id} = req.params;
    if(!id) return res.status(400).json({
        message:"Id not found."
    })

    try{
        const deletedCity = await cityLocationModel.findByIdAndDelete(id);

        return res.status(200).json({
            message:`City deleted successfully.`,
            deletedCity
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const getCityById = async (req, res) => {
    const { id } = req.params;
    try {
        const cities = await cityLocationModel.find({district: id})
        .populate({path: 'district',
            populate:{
                path:'state'
            }
    });

    console.log("cityt:",cities)
        if (!cities) {
            return res.status(404).json({ message: "City not found" });
        }
        return res.status(200).json({
            message: "City found",
            cities
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {createCity ,updateCityStatus ,getAllCities ,deleteCity , getCityById}