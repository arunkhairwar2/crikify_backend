import type { Request, Response } from "express";

class AuthControllers {
  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
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
