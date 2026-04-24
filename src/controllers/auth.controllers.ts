import type { Request, Response } from "express";
import type { RegisterSchemaType } from "../schemas/auth.schema.ts";
import { RegisterSchema } from "../schemas/auth.schema.ts";

class AuthControllers {
  register = async (req: Request, res: Response) => {
    try {
      const registerData = req.body as RegisterSchemaType;

      const validatedUser = RegisterSchema.parse(registerData);

      if (!validatedUser) {
        return res.status(400).json({ message: "Invalid user data" });
      }

      // const user = await authServices.registerUser({ name, email, password });
      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default new AuthControllers();
