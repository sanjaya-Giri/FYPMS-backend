import express from "express";
import { forgotPassword, getUser, loginUser, logout, registerUser, resetPassword } from "../controllers/authController.js"
import multer from "multer";
import { isAuthenticated } from "../middlewares/authMiddleware.js";


const router=express.Router();

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/me",isAuthenticated,getUser)
router.get("/logout",isAuthenticated,logout)
router.post("/password/forgot",forgotPassword)
router.put("/reset/password/:token",resetPassword)

export default router;