import "server-only";

import { v2 as cloudinary } from "cloudinary";

import { serverEnv } from "@/config/env.server";

const cloudinaryClient = cloudinary.config({
  cloud_name: serverEnv.CLOUDINARY_CLOUD_NAME,
  api_key: serverEnv.CLOUDINARY_API_KEY,
  api_secret: serverEnv.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinaryClient, cloudinary };