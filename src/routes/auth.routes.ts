import { Router } from "express";
import authController from "../controllers/auth.controllers.ts";
import { validate } from "../middlewares/validate.ts";
import { RegisterSchema } from "../schemas/auth.schema.ts";

const authRoutes = Router();

authRoutes.post("/register", validate(RegisterSchema), authController.register);
// router.post("/login", login);
// router.post("/verify-otp", verifyOtp);
// router.post("/refresh-token", refreshToken);
// router.post("/reset-password", resetPassword);
// router.post("/change-password", changePassword);
// router.post("/logout", logout);

export default authRoutes;
