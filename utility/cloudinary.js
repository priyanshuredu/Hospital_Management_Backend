const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret
})

exports.uploadImage = async (files) => {
    // console.log(`>>>>>>files`, files);
   
    const fileArray = Object.values(files);
    const results = [];
    
    // console.log("files array:", fileArray);
    
    for (const file of fileArray) {
        try {
            // Extract the buffer from the file object
            // Based on your output, the buffer appears to be at index 1
            let fileBuffer;
            
            // Check different possible file structures
            if (Buffer.isBuffer(file)) {
                fileBuffer = file;
            } else if (file.data && Buffer.isBuffer(file.data)) {
                fileBuffer = file.data;
            } else if (Array.isArray(file) && file[1] && Buffer.isBuffer(file[1])) {
                fileBuffer = file[1]; // Your structure shows buffer at index 1
            } else if (file.buffer) {
                fileBuffer = file.buffer;
            } else {
                // console.error('Unknown file structure:', file);
                continue;
            }
            
            // Check if buffer is empty
            if (!fileBuffer || fileBuffer.length === 0) {
                // console.error('Empty file buffer');
                continue;
            }
            
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'uploads', // optional: specify a folder
                        resource_type: 'auto' // auto-detect file type
                    },
                    (error, result) => {
                        // console.log(`Upload result for ${file.name || 'file'}:`, error || result);
                       
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
                
                // Send the buffer to Cloudinary
                uploadStream.end(fileBuffer);
            });
            
            results.push({
                success: true,
                url: result.secure_url,
                public_id: result.public_id,
                original_name: file.name || file[0] || 'unknown'
            });
            
        } catch (error) {
            // console.error('Error uploading file:', error);
            results.push({
                success: false,
                error: error.message,
                original_name: file.name || file[0] || 'unknown'
            });
        }
    }
    
    return results;
};