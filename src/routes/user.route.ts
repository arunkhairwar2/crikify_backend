import { Router } from "express";
import userControllers from "../controllers/user.controller.ts";
import { authenticate } from "../middlewares/authenticate.middleware.ts";
import { uploadSingle } from "../middlewares/upload.middleware.ts";

const userRoutes = Router();

userRoutes.get("/profile", authenticate, userControllers.getProfile);
userRoutes.patch("/profile", authenticate, userControllers.updateProfile);
userRoutes.put(
  "/profile-picture",
  authenticate,
  uploadSingle("profilePicture"),
  userControllers.updateProfilePicture,
);

export default userRoutes;
