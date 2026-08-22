import { v2 as cloudinary } from "cloudinary";

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadImage(
  fileBuffer: Buffer,
  folder: string = "globetrotter"
): Promise<string | null> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn("Cloudinary not configured. Returning mock image URL.");
    return "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop";
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        if (result) return resolve(result.secure_url);
        resolve(null);
      }
    );

    uploadStream.end(fileBuffer);
  });
}
