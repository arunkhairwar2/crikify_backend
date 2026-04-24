import type { Request, Response } from "express";
import type { RegisterSchemaType } from "../schemas/auth.schema.ts";

class AuthControllers {
  register = async (req: Request, res: Response) => {
    const registerData = req.body as RegisterSchemaType;

    // Data is already validated by the validate middleware
    // You can safely use registerData here

    // const user = await authServices.registerUser(registerData);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  };
}

export default new AuthControllers();

