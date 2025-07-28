const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// Validate environment variables
const requiredEnvVars = ['CLOUD_NAME', 'CLOUD_API_KEY', 'CLOUD_API_SECRET'];
requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
});




cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
})



// Test Cloudinary configuration
cloudinary.api.ping((error, result) => {
    if (error) {
        console.error("Cloudinary configuration failed:", error);
        throw new Error("Failed to connect to Cloudinary");
    }
    console.log("Cloudinary Config Successful:", result);
});





console.log("Cloudinary Config:", cloudinary.config());


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'havenly',
      allowedFormats: ["png","jpg","jpeg"],
    },
  }); 


module.exports={
    cloudinary,
    storage,
}