import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {CloudinaryStorage}  from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const  storage = new CloudinaryStorage({
  cloudinary,
  params: (req,file)=>{
    let folder="temp";
    if(req.path.includes("/upload/:projectId")){
      folder=`projects/${req.params.projectId}`;
    }else if(req.path.includes("/upload/:userId")){
      folder=`users/${req.params.userId}`;

    }

    return {
      folder,
      resource_type:"auto",
      public_id: `${Date.now()}-${file.originalname}`,
    }

    }
  
});





// File filter (optional but recommended)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/zip",
    "application/x-zip-compressed",
    "application/x-rar-compressed",
    "application/x-rar",
    "application/vnd.rar",
    "application/octet-stream",
    "image/jpeg",
    "image/png",
    "image/gif",
    "text/plain",
    "application/javascript",
    "text/css",
    "text/html",
    "application/json",
  ];

  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".zip",
    ".rar",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".txt",
    ".js",
    ".css",
    ".html",
    ".json",
  ];

  const fileExt=path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(file.mimetype)||allowedExtensions.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid type PDF,DOC,DOCX,PPT,ZIP"), false);
  }
};

// Multer instance
export const upload = multer({
  storage,
  
  limits: { 
    fileSize: 50 * 1024 * 1024,
    files:10,
   }, // 50MB limit per file
  fileFilter,
});

export const handleUploadError = (err, req, res, next) => {
  // Multer specific errors
  if (err instanceof multer.MulterError) {
    let message = err.message;

    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size exceeds 50MB limit";
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      message = "Maximum 10 files allowed";
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Unexpected field name (use 'files')";
    }

    return res.status(400).json({
      success: false,
      message,
    });
  }

  // Custom fileFilter error
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "File upload failed",
    });
  }

  next();
};

export default {upload,handleUploadError};
