import { Router } from "express";
import tournamentController from "../controllers/tournament.controller.ts";
import { validate } from "../middlewares/validate.ts";
import { createTournamentSchema } from "../schemas/tournament/createTournament.schema.ts";
import { uploadSingle } from "../middlewares/upload.middleware.ts";
import { authenticate } from "../middlewares/authenticate.middleware.ts";

const tournamentRoutes = Router();

tournamentRoutes.post(
  "/create",
  authenticate,
  uploadSingle("tournamentLogo"),
  validate(createTournamentSchema),
  tournamentController.create,
);

export default tournamentRoutes;
