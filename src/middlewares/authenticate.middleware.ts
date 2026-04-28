import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import userRepository from "../repositories/user.repository.ts";
import { HttpStatus } from "../types/statusCode.ts";
import { ApiError } from "../utils/ApiError.ts";

/**
 * Routes that do NOT require authentication.
 * Matched against `req.path` (which is relative to where the middleware is mounted).
 * Because this middleware is mounted at the app level, `req.path` equals the full path.
 */
const PUBLIC_ROUTES: { method?: string; path: string }[] = [
  { path: "/health" },
  { method: "POST", path: "/api/v1/auth/register" },
  { method: "POST", path: "/api/v1/auth/login" },
  { method: "POST", path: "/api/v1/auth/verify-otp" },
  { method: "POST", path: "/api/v1/auth/resent-otp" },
];

/**
 * Check whether the incoming request matches any public route.
 */
function isPublicRoute(req: Request): boolean {
  return PUBLIC_ROUTES.some((route) => {
    const pathMatch = req.path === route.path;
    const methodMatch = route.method
      ? req.method.toUpperCase() === route.method.toUpperCase()
      : true;
    return pathMatch && methodMatch;
  });
}

/**
 * Authentication middleware.
 *
 * - Skips verification for public routes (login, register, health).
 * - Reads the JWT from the `accessToken` cookie.
 * - Verifies the token using `JWT_SECRET` from env.
 * - Attaches the decoded payload to `req.user` for downstream handlers.
 * - Throws 401 ApiError on missing / invalid / expired tokens.
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  // Allow public routes through without any token check
  if (isPublicRoute(req)) {
    return next();
  }

  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace(/^Bearer\s+/, "");

  if (!token) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Authentication required");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Server misconfiguration — JWT_SECRET is not set",
    );
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    // Attach decoded user payload so controllers can access it
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new ApiError(
        HttpStatus.UNAUTHORIZED,
        "Invalid authentication token",
      );
    }
    req.user = user;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(
        HttpStatus.UNAUTHORIZED,
        "Token has expired — please log in again",
      );
    }
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Invalid authentication token");
  }
};
