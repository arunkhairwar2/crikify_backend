import type { CreateTournamentSchemaType } from "../schemas/tournament/createTournament.schema.ts";
import { logger } from "../utils/logger.ts";

class TournamentServices {
  create = async (tournamentData: CreateTournamentSchemaType) => {
    logger.info("[Tournament] Creating tournament...", tournamentData);
    return tournamentData;
  };
}

export default new TournamentServices();
