import "server-only";

import { cloudinary } from "./cloudinary";

const MAX_PROPERTY_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_PROPERTY_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export type CloudinaryImageUploadResult = {
  url: string;
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
};

export async function uploadPropertyImage(
  file: File,
): Promise<CloudinaryImageUploadResult> {
  if (!ALLOWED_PROPERTY_IMAGE_TYPES.has(file.type)) {
    throw new Error("Property images must be JPEG, PNG, or WebP files.");
  }

  if (file.size === 0) {
    throw new Error("The property image is empty.");
  }

  if (file.size > MAX_PROPERTY_IMAGE_SIZE) {
    throw new Error("Property images must be 10 MB or smaller.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "propora/properties",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed."));
          return;
        }

        resolve({
          url: result.url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      },
    );

    uploadStream.end(buffer);
  });
}