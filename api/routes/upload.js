import { Router } from "express";
import {
  uploadSingle,
  uploadPostImage,
  uploadProfileImage,
  uploadCoverImage,
  handleUploadError
} from "../controller/upload.controller.js";

export const uploadRoute = Router();

// Upload post image
uploadRoute.post("/posts", uploadSingle, uploadPostImage, handleUploadError);

// Upload profile image
uploadRoute.post("/profile", (req, res, next) => {
  req.body.type = 'profile';
  next();
}, uploadSingle, uploadProfileImage, handleUploadError);

// Upload cover image
uploadRoute.post("/cover", (req, res, next) => {
  req.body.type = 'cover';
  next();
}, uploadSingle, uploadCoverImage, handleUploadError);

// Legacy upload endpoint (for backward compatibility)
uploadRoute.post("/", uploadSingle, uploadPostImage, handleUploadError);
