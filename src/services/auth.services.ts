import userRepositories from "../repositories/user.repository.ts";
import type { RegisterSchemaType } from "../schemas/auth.schema.ts";
import { HttpStatus } from "../types/statusCode.ts";
import { ApiError } from "../utils/ApiError.ts";

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
          : "User already exists with this phone number",
      );
    }

    const user = await userRepositories.create(userData);
    return user;
  }
}

export default new AuthServices();
