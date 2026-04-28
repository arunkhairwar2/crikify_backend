import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

// -----------------------------------------------------------------------------
// Masking Utility
// -----------------------------------------------------------------------------
const SENSITIVE_KEYS = [
  "password",
  "token",
  "authorization",
  "cookie",
  "secret",
  "apikey",
  "accesstoken",
  "refreshtoken",
];

export const maskSensitiveData = (data: any): any => {
  if (data == null) return data;

  if (Array.isArray(data)) {
    return data.map((item) => maskSensitiveData(item));
  }

  if (typeof data === "object") {
    const maskedObj: any = {};
    for (const key of Object.keys(data)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.some((sensitive) => lowerKey.includes(sensitive))) {
        maskedObj[key] = "***MASKED***";
      } else {
        maskedObj[key] = maskSensitiveData(data[key]);
      }
    }
    return maskedObj;
  }

  return data;
};

// -----------------------------------------------------------------------------
// Logger Configuration
// -----------------------------------------------------------------------------
const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom console format for better DX
const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `[${timestamp}] ${level}: ${message}`;
    if (Object.keys(meta).length > 0) {
      log += ` \n  ${JSON.stringify(meta, null, 2)}`;
    }
    if (stack) {
      log += `\n  ${stack}`;
    }
    return log;
  })
);

// Custom format to mask sensitive data while preserving Winston's internal Symbols
const maskFormat = winston.format((info) => {
  const maskedInfo = maskSensitiveData(info);
  // Restore all symbols (like Symbol.for('level') and Symbol.for('message'))
  const symbols = Object.getOwnPropertySymbols(info);
  for (const sym of symbols) {
    maskedInfo[sym] = info[sym];
  }
  return maskedInfo;
});

// Custom file format (JSON, structured, masked)
const fileFormat = combine(
  timestamp(),
  errors({ stack: true }),
  maskFormat(),
  json()
);

// Define log colors for console
winston.addColors({
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "cyan",
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: fileFormat, // Default format
  transports: [
    // 1. Console transport (readable)
    new winston.transports.Console({
      format: consoleFormat,
    }),

    // 2. Error log file rotation transport
    new DailyRotateFile({
      level: "error",
      dirname: path.join(process.cwd(), "logs/errors"),
      filename: "%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d", // Keep logs for 14 days
      format: fileFormat,
    }),
  ],
  exitOnError: false, // Do not exit on handled exceptions
});

// Handle uncaught exceptions and unhandled rejections globally within logger
// to ensure they are captured in the error log files before crashing.
logger.exceptions.handle(
  new DailyRotateFile({
    dirname: path.join(process.cwd(), "logs/errors"),
    filename: "exceptions-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: fileFormat,
  })
);

logger.rejections.handle(
  new DailyRotateFile({
    dirname: path.join(process.cwd(), "logs/errors"),
    filename: "rejections-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: fileFormat,
  })
);
