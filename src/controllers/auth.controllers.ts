import type { Request, Response } from "express";
import type { RegisterSchemaType } from "../schemas/auth/register.schema.ts";
import { VerifyOtpSchemaType } from "../schemas/auth/verifyotp.schema.ts";
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

  verifyOtp = async (req: Request, res: Response) => {
    const verifyOtpData = req.body as VerifyOtpSchemaType;
    const user = await authServices.verifyOtp(verifyOtpData);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: "OTP verified successfully",
      data: user,
    });
  };
}

export default new AuthControllers();
