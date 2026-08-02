import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Automatically detects image, video, pdf, etc.
      folder: "bug_attachments",
    });

    // Remove local file after successful upload
    fs.unlinkSync(localFilePath);
    return response.url;
  } catch (error) {
    // Log the real reason so failures aren't silent (bad credentials,
    // invalid file, network issue, etc. all look identical otherwise)
    console.error("Cloudinary upload failed:", error.message);
    // Remove local temp file if upload failed
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};
