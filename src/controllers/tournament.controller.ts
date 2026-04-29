import type { Request, Response } from "express";
import { generateS3Key, uploadToS3 } from "../lib/s3Upload.ts";
import { type CreateTournamentSchemaType } from "../schemas/tournament/createTournament.schema.ts";
import tournamentServices from "../services/tournament.services.ts";
import { HttpStatus } from "../types/statusCode.ts";
import { validateImageFile } from "../utils/fileValidation.ts";

class TournamentControllers {
  create = async (req: Request, res: Response) => {
    const tournamentData = req.body as CreateTournamentSchemaType;

    const file = req.file;
    let profilePictureKey: string | undefined = undefined;

    if (file) {
      // Validates presence, MIME type, and size — throws ApiError(400) on failure
      validateImageFile(file);

      // Generate a unique S3 object key
      const s3Key = generateS3Key("tournament_logos", file.originalname);

      // Upload file buffer directly to S3
      const { url } = await uploadToS3({
        buffer: file.buffer,
        mimetype: file.mimetype,
        key: s3Key,
      });
      profilePictureKey = s3Key;
    }

    const createdTournamentData = await tournamentServices.create({
      ...tournamentData,
      profilePictureKey,
    });

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
