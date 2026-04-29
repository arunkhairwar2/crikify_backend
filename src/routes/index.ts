import { Router } from "express";
import authRoutes from "./auth.routes.ts";
import tournamentRoutes from "./tournament.routes.ts";
import userRoutes from "./user.route.ts";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/tournament", tournamentRoutes);

export default router;
