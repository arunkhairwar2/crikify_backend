import { Router } from "express";
import userControllers from "../controllers/user.controllers.ts";
import { authenticate } from "../middlewares/authenticate.middleware.ts";

const userRoutes = Router();

userRoutes.get("/profile", authenticate, userControllers.getProfile);
userRoutes.patch("/profile", authenticate, userControllers.updateProfile);
// userRoutes.put("/update-profile");
// userRoutes.put("/profile-image");
// userRoutes.get("/profile-image");

export default userRoutes;
