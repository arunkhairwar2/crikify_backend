import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler.ts";
import { notFound } from "./middlewares/notFound.ts";
import router from "./routes/index.ts";

const app = express();

app.use(helmet()); // it sets various http headers to secure the application
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // it's a http logger actually

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/v1", router);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
