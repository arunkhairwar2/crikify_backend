import { Router } from "express";
import authController from "../controllers/auth.controllers.ts";
import { validate } from "../middlewares/validate.ts";
import {
  ResendOtpSchema,
  VerifyOtpSchema,
} from "../schemas/auth/otp.schema.ts";
import { RegisterSchema } from "../schemas/auth/register.schema.ts";

const authRoutes = Router();

authRoutes.post("/register", validate(RegisterSchema), authController.register);
authRoutes.post(
  "/verify-otp",
  validate(VerifyOtpSchema),
  authController.verifyOtp,
);
authRoutes.post(
  "/resent-otp",
  validate(ResendOtpSchema),
  authController.resendOtp,
);
//  // take mobile number as query param.
// router.post("/login", login);
// router.post("/verify-otp", verifyOtp);
// router.post("/refresh-token", refreshToken);
// router.post("/forgot-password", forgotPassword); // send email as body param.
// router.post("/reset-password", resetPassword); // take otp and new password in body.
// router.post("/logout", logout); //

export default authRoutes;
