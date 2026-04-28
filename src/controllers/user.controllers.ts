import type { Request, Response } from "express";
import userServices from "../services/user.services.ts";
import { HttpStatus } from "../types/statusCode.ts";
import type { UpdateUserDTO } from "../types/user.types.ts";

class UserControllers {
  getProfile = async (req: Request, res: Response) => {
    const user = (req as any).user;

    const userProfile = await userServices.getProfile(user.id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Profile fetched successfully",
      data: userProfile,
    });
  };

  updateProfile = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const body = req.body as UpdateUserDTO;

    const userProfile = await userServices.updateProfile(user.id, body);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Profile updated successfully",
      data: userProfile,
    });
  };
}

export default new UserControllers();
