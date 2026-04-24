import "dotenv/config";
import app from "./app.ts";
import prisma from "./config/database.ts";

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  await prisma.$connect();
  console.log("✓ Database connected");

  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
