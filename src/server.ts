import { env } from "./config/env.ts";
import app from "./app.ts";
import prisma from "./config/database.ts";
import { logger, maskSensitiveData } from "./utils/logger.ts";

async function bootstrap() {
  try {
    await prisma.$connect();
    logger.info("✓ Database connected");

    logger.info("Environment Variables Loaded:");
    const maskedEnv = maskSensitiveData(env);
    
    // Print each variable separately instead of as a single object
    for (const [key, value] of Object.entries(maskedEnv)) {
      logger.info(`   ➔ ${key}: ${value}`);
    }

    app.listen(env.PORT, () => {
      logger.info(`✓ Server running on port ${env.PORT}`);
      logger.info(`✓ Environment: ${env.NODE_ENV}`);
    });
  } catch (err) {
    logger.error("Failed to start server", err);
    setTimeout(() => process.exit(1), 500);
  }
}

bootstrap();
