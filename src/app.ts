import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { authenticate } from "./middlewares/authenticate.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";
import { notFound } from "./middlewares/notFound.ts";
import router from "./routes/index.ts";
import { HttpStatus } from "./types/statusCode.ts";
import { ApiError } from "./utils/ApiError.ts";

const app = express();

// --------------- Security Headers ---------------
app.use(helmet());

// --------------- CORS with specific origin ---------------
const allowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new ApiError(
          HttpStatus.FORBIDDEN,
          `Origin '${origin}' is not allowed by CORS policy`,
        ),
      );
    },
    credentials: true, // allow cookies to be sent cross-origin
  }),
);

// --------------- Body parsers & logger ---------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// --------------- Auth middleware (skips public routes) ---------------
app.use(authenticate);

// --------------- Routes ---------------
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/v1", router);

// --------------- Error Handling ---------------
app.use(notFound);
app.use(errorHandler);

export default app;
