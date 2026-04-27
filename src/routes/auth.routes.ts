import { Router } from "express";
import authController from "../controllers/auth.controllers.ts";
import { validate } from "../middlewares/validate.ts";
import { RegisterSchema } from "../schemas/auth.schema.ts";

const authRoutes = Router();

authRoutes.post("/register", validate(RegisterSchema), authController.register);
// router.post("/login", login);
// router.post("/verify-otp", verifyOtp);
// router.post("/resent-otp", resendOtp); // take mobile number as query param. 
// router.post("/refresh-token", refreshToken);
// router.post("/forgot-password", forgotPassword); // send email as body param.
// router.post("/reset-password", resetPassword); // take otp and new password in body. 
// router.post("/logout", logout); // 

export default authRoutes;
