import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/profile");
userRoutes.put("/update-profile");
userRoutes.put("/profile-image");
userRoutes.get("/profile-image");

export default userRoutes;
