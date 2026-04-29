import type { CreateTournamentSchemaType } from "../schemas/tournament/createTournament.schema.ts";
import { logger } from "../utils/logger.ts";

class TournamentServices {
  create = async (
    tournamentData: CreateTournamentSchemaType & { profilePictureKey?: string },
  ) => {
    logger.info("[Tournament] Creating tournament...", tournamentData);
    return {
      ...tournamentData,
      startAt: new Date(tournamentData.startAt),
      endAt: new Date(tournamentData.endAt),
    };
  };
}

export default new TournamentServices();
