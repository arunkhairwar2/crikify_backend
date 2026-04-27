import type { Request, Response } from "express";
import type { RegisterSchemaType } from "../schemas/auth.schema.ts";
import authServices from "../services/auth.services.ts";
import { HttpStatus } from "../types/statusCode.ts";

class AuthControllers {
  register = async (req: Request, res: Response) => {
    const registerData = req.body as RegisterSchemaType;

    const user = await authServices.registerUser(registerData);
    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  };
}

export default new AuthControllers();
