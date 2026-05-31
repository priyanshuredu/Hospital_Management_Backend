const testModel = require('../model/testModel');
const labModel = require('../model/labModel')

const createTest = async (req,res) => {
    const {testName ,fee ,precautions} = req.body;
    const labId = req.user.lab;
    if(!testName || !fee || !precautions) return res.status(400).json({
        message:'Request body not found.'
    })

    try{
        const lab = await labModel.findById(labId);

        if(lab){

            const test_data ={testName ,lab: labId ,hospital: lab.hospital ,fee ,precautions}
            // console.log("Test data:", test_data);
            // return 
            const test = await testModel.create(test_data);

            return res.status(201).json({
                message:'Test added in lab',
                testModel
            })
        } else{
            return res.status(404).json({
                message:"Failed to find lab"
            })
        }
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const updateTestStatus = async (req,res) => {
    const { id, status } = req.body;
    const labId = '6a0e1a13db952fa2ab1db808';

    if (!id) {
        return res.status(400).json({
            message: 'Test ID is required in request body.'
        });
    }

    if (!status) {
        return res.status(400).json({
            message: 'Status is required in request body.'
        });
    }

    // Validate status value (assuming status can be 'active', 'inactive' etc.)
    const validStatuses = ['active', 'inActive'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            message: `Invalid status. Status must be one of: ${validStatuses.join(', ')}`
        });
    }

    try {
        // First check if lab exists and belongs to the hospital
        const existingTest = await testModel.findOne({ 
            _id: id, 
            lab: labId 
        });

        if (!existingTest) {
            return res.status(404).json({
                message: 'Lab not found or you do not have permission to update this lab.'
            });
        }

        // Update the lab status
        const updatedTest = await testModel.findByIdAndUpdate(
            id,
            { status: status },
            { new: true, runValidators: true }
        );

        // Optional: Also update the associated user's status if needed
        // if (updatedLab) {
        //     // If you want to deactivate the user when lab is inactive/suspended
        //     if (status === 'inactive' || status === 'suspended') {
        //         await userModel.findOneAndUpdate(
        //             { lab: id, role: "lab-assistant" },
        //             { isActive: false } // Assuming you have an isActive field in user model
        //         );
        //     } else if (status === 'active') {
        //         await userModel.findOneAndUpdate(
        //             { lab: id, role: "lab-assistant" },
        //             { isActive: true }
        //         );
        //     }
        // }

        return res.status(200).json({
            message: `Test status updated to '${status}' successfully.`,
            lab: updatedTest
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const getAllActivetests = async (req,res) =>{
    // const {id} = req.body;
    // if(!id) return res.status(400).json({
    //     message:"Lab id not found."
    // });

    try{
        const tests = await testModel.find({status: 'active'}).populate('lab').populate('hospital');

        return res.status(200).json({
            message:"All tests",
            tests
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const getAlltests = async (req,res) =>{
    // const {id} = req.body;
    // if(!id) return res.status(400).json({
    //     message:"Lab id not found."
    // });

    try{
        const tests = await testModel.find().populate('lab').populate('hospital');

        return res.status(200).json({
            message:"All tests",
            tests
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const getAllTestsByLab = async (req,res) => {
    const {labId} = req.params;

    if(!labId) return res.status(400).json({
        message:"Lab in not found."
    })
    try{
        const tests = await testModel.find({lab: labId});

        return res.status(200).json({
            message:"All test by this lab.",
            tests
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const getTest = async (req,res) => {
    const {id} = req.params;
    if(!id) return res.status(400).json({
        message:"Test id not found."
    });

    try{
        const test = await testModel.findById(id);

        return res.status(200).json({
            message:"Test found",
            test
        })
    } catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
}

const getRecentTest = async(req,res) => {
    try {
        const recentTests = await testModel.find()
                            .populate('lab','labName')
                            .populate('hospital','hospital_name')
                            .sort({ createdAt: -1 })
                            .limit(10);
        
        console.log("first 144",recentTests)
    return res.status(200).json({
      success: true,
      count: recentTests.length,
      tests: recentTests
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


module.exports = {createTest ,updateTestStatus ,getAlltests ,getTest ,getRecentTest ,getAllActivetests ,getAllTestsByLab};