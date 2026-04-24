import { Router } from "express";
import authController from "../controllers/auth.controllers.ts";

const authRoutes = Router();

authRoutes.post("/register", authController.register);
// router.post("/login", login);
// router.post("/verify-otp", verifyOtp);
// router.post("/refresh-token", refreshToken);
// router.post("/reset-password", resetPassword);
// router.post("/change-password", changePassword);
// router.post("/logout", logout);

export default authRoutes;
