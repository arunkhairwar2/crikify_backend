import { Router } from "express";
import tournamentController from "../controllers/tournament.controller.ts";
import { validate } from "../middlewares/validate.ts";
import { createTournamentSchema } from "../schemas/tournament/createTournament.schema.ts";
import { uploadSingle } from "../middlewares/upload.middleware.ts";

const tournamentRoutes = Router();

tournamentRoutes.post(
  "/create",
  uploadSingle("profilePicture"),
  validate(createTournamentSchema),
  tournamentController.create,
);

export default tournamentRoutes;
