import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler.ts";
import { notFound } from "./middlewares/notFound.ts";
import router from "./routes/index.ts";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/v1", router);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
