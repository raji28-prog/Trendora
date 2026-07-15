import env from './env.js';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadToCloudinary = async (fileInput) => {
  if (!fileInput) return null;

  try {
    const res = await cloudinary.uploader.upload(fileInput, {
      folder: 'trendora_businesses',
    });
    return res.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error(`Failed to upload image to Cloudinary: ${error.message || error}`);
  }
};

export default cloudinary;

