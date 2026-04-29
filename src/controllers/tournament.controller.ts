import type { Request, Response } from "express";
import { type CreateTournamentSchemaType } from "../schemas/tournament/createTournament.schema.ts";
import tournamentServices from "../services/tournament.services.ts";
import { HttpStatus } from "../types/statusCode.ts";

class TournamentControllers {
  create = async (req: Request, res: Response) => {
    const tournamentData = req.body as CreateTournamentSchemaType;

    const createdTournamentData =
      await tournamentServices.create(tournamentData);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: "Tournament created successfully",
      data: createdTournamentData,
    });
  };

  update = async (req: Request, res: Response) => {};

  //   delete = async (req: Request, res: Response) => {};

  getAll = async (req: Request, res: Response) => {};

  getById = async (req: Request, res: Response) => {};
}

export default new TournamentControllers();
