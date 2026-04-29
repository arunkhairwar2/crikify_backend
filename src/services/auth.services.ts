import userRepositories from "../repositories/user.repository.ts";
import type { LoginSchemaType } from "../schemas/auth/login.schema.ts";
import type { VerifyOtpSchemaType } from "../schemas/auth/otp.schema.ts";
import type { RegisterSchemaType } from "../schemas/auth/register.schema.ts";
import { generateAccessToken } from "../security/generateAccessToken.ts";
import { HttpStatus } from "../types/statusCode.ts";
import { ApiError } from "../utils/ApiError.ts";
import { generateOtp, getOtpExpiryTime } from "../utils/otp.utils.ts";
import { checkPassword, hashPassword } from "../utils/password.utils.ts";
import pinnacleSmsServices from "./pinnacleSms.services.ts";

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

    await pinnacleSmsServices.sendOtp(
      userData.countryCode + userData.mobile,
      otp,
    );

    return user;
  }

  async verifyOtp(verifyOtpData: VerifyOtpSchemaType) {
    const { otp, countryCode, mobile } = verifyOtpData;
    const user = await userRepositories.findByMobile(countryCode, mobile);

    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, "User not found");
    }

    if (user.security?.mobileVerified) {
      throw new ApiError(
        HttpStatus.CONFLICT,
        "Mobile number already verified , please login",
      );
    }

    if (user.security?.otp !== otp) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, "Invalid OTP");
    }

    if (user.security?.otpExpiry < new Date()) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, "OTP expired");
    }

    await userRepositories.updateMobileVerification(user.id, true);
    const token = generateAccessToken(user.id);
    return token;
  }

  async resendOtp(countryCode: string, mobile: string) {
    const user = await userRepositories.findByMobile(countryCode, mobile);

    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, "User not found");
    }

    const otp = generateOtp();
    const otpExpiry = getOtpExpiryTime();
    await userRepositories.updateOtpAndExpiry(user.id, otp, otpExpiry);
    const mobileNumberWithISD = user.countryCode + user.mobile;
    await pinnacleSmsServices.sendOtp(mobileNumberWithISD, otp);

    return;
  }

  async login(loginData: LoginSchemaType) {
    const { countryCode, mobile, password } = loginData;
    const user = await userRepositories.findByMobile(countryCode, mobile);
    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, "User not found");
    }
    if (!user.security?.mobileVerified) {
      throw new ApiError(
        HttpStatus.UNAUTHORIZED,
        "Mobile number not verified , please verify mobile number first",
      );
    }
    const isPasswordValid = await checkPassword(
      password,
      user.security?.passwordHash as string,
    );
    if (!isPasswordValid) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, "Invalid password");
    }

    const token = generateAccessToken(user.id);
    return token;
  }
}

export default new AuthServices();
