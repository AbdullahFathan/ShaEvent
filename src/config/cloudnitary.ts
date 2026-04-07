import { v2 as cloudinary } from "cloudinary";
import { configApp } from "./config_app";

// Setup Kredensial
cloudinary.config({
  cloud_name: configApp.cloudinary.cloudName,
  api_key: configApp.cloudinary.apiKey,
  api_secret: configApp.cloudinary.apiSecret,
});

export default cloudinary;
