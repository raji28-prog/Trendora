import env from './env.js';
import { v2 as cloudinary } from 'cloudinary';

// Check if Cloudinary is configured
export const isCloudinaryConfigured = () =>
  Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET &&
    env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name');

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload to Cloudinary from:
 *  - a base64 data URI string  ("data:image/png;base64,...")
 *  - a remote https:// URL
 *  - a Buffer (from multer memoryStorage)
 *
 * Returns the secure Cloudinary URL, or null if Cloudinary is not configured.
 */
export const uploadToCloudinary = async (fileInput, options = {}) => {
  if (!isCloudinaryConfigured()) {
    console.warn('⚠️  Cloudinary not configured — skipping upload, returning null.');
    return null;
  }

  if (!fileInput) return null;

  try {
    const uploadOptions = { folder: 'trendora', ...options };

    // Buffer upload (from multer memoryStorage)
    if (Buffer.isBuffer(fileInput)) {
      return await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
          if (err) return reject(err);
          resolve(result.secure_url);
        });
        uploadStream.end(fileInput);
      });
    }

    // String upload: base64 URI, https URL, or local file path
    const result = await cloudinary.uploader.upload(fileInput, uploadOptions);
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export default cloudinary;
