import type { Request, Response } from "express";
import type { LoginSchemaType } from "../schemas/auth/login.schema.ts";
import type {
  ResendOtpSchemaType,
  VerifyOtpSchemaType,
} from "../schemas/auth/otp.schema.ts";
import type { RegisterSchemaType } from "../schemas/auth/register.schema.ts";
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
    const token = await authServices.verifyOtp(verifyOtpData);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: "OTP verified successfully",
      data: { token },
    });
  };

  resendOtp = async (req: Request, res: Response) => {
    const { countryCode, mobile } = req.body as ResendOtpSchemaType;
    await authServices.resendOtp(countryCode, mobile);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: "OTP resent successfully",
    });
  };

  login = async (req: Request, res: Response) => {
    const loginData = req.body as LoginSchemaType;
    const token = await authServices.login(loginData);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "User logged in successfully",
      data: { token },
    });
  };
}

export default new AuthControllers();
