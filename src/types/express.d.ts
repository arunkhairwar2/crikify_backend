import { JwtPayload } from "jsonwebtoken";
import { UserBase } from "./user.types.ts";

declare global {
  namespace Express {
    interface Request {
      user?: UserBase | JwtPayload;
    }
  }
}

export {};
