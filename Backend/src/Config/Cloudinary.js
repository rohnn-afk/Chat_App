import {v2 as cloudinary} from 'cloudinary'
import dotenv from "dotenv"
import streamifier from "streamifier";


dotenv.config()

export const connectCloudinary = async () =>{

    cloudinary.config({
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_SECRET_KEY
    })
}

export const uploadCloudImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return result.secure_url;

  } catch (error) {

    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image");
  }
};



export const uploadCloudImageMessages = async (file) => {
  try {
      
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto", // Automatically detects file type (image, video, etc.)
    });

    return result.secure_url; // Return the URL of the uploaded image
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image");
  }
};

