import userRepositories from "../repositories/user.repository.ts";
import type { RegisterSchemaType } from "../schemas/auth.schema.ts";

class AuthServices {
  async registerUser(userData: RegisterSchemaType) {
    // if (userExists) {
    //   throw new ApiError(
    //     HttpStatus.CONFLICT,
    //     "User already exists with this phone number",
    //   );
    // }

    const user = await userRepositories.create(userData);
    return user;
  }
}

export default new AuthServices();
