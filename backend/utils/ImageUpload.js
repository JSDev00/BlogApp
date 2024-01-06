const cloudinary = require("cloudinary");

//cloudinary configration

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//cloudinary uploadImg
const uploadImageToCloudinary = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return data;
  } catch (error) {
    throw new Error("Internal Server Error")
  }
};

//cloudinary uploadImg
const removeImageFromCloudinary = async (ImgPublicId) => {
  try {
    const data = await cloudinary.uploader.destroy(ImgPublicId);
    return data;
  } catch (error) {
    throw new Error("Internal Server Error")
  }
};
const removeMultipleImagesFromCloudinary = async(publicIds)=>{
  try {
    const data = await cloudinary.v2.api.resources(publicIds)
    return data
  } catch (error) {
    throw new Error("Internal Server Error")
  }
}
module.exports = {
  removeImageFromCloudinary,
  uploadImageToCloudinary,
  removeMultipleImagesFromCloudinary
};
