import userRepositories from "../repositories/user.repository.ts";
import type { RegisterSchemaType } from "../schemas/auth/register.schema.ts";
import { VerifyOtpSchemaType } from "../schemas/auth/verifyotp.schema.ts";
import { HttpStatus } from "../types/statusCode.ts";
import { ApiError } from "../utils/ApiError.ts";
import {
  generateOtp,
  getOtpExpiryTime
} from "../utils/otp.utils.ts";
import { hashPassword } from "../utils/password.utils.ts";

class AuthServices {
  async registerUser(userData: RegisterSchemaType) {
    const userExistsByMobile = await userRepositories.findByMobile(
      userData.countryCode,
      userData.mobile,
    );
    const userExistsByEmail = await userRepositories.findByEmail(
      userData.email,
    );

    if (userExistsByMobile || userExistsByEmail) {
      throw new ApiError(
        HttpStatus.CONFLICT,
        userExistsByEmail
          ? "User already exists with this email"
          : "User already exists with this mobile number",
      );
    }

    const hashedPassword = await hashPassword(userData.password);
    const otp = generateOtp();
    const otpExpiry = getOtpExpiryTime(); // 10 minutes from now

    const user = await userRepositories.create({
      ...userData,
      password: hashedPassword,
      otp,
      otpExpiry,
    });

    return user;
  }

  async verifyOtp(verifyOtpData: VerifyOtpSchemaType) {
    const { otp, countryCode, mobile } = verifyOtpData;
    const user = await userRepositories.findByMobile(countryCode, mobile);

    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, "User not found");
    }

    if (user.security?.otp !== otp) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, "Invalid OTP");
    }

    if (user.security?.otpExpiry < new Date()) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, "OTP expired");
    }

    userRepositories.updateMobileVerification(user.id, true);

    return user;
  }

  async login() {}
}

export default new AuthServices();
