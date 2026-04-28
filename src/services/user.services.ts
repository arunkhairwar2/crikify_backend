import userRepository from "../repositories/user.repository.ts";
import { HttpStatus } from "../types/statusCode.ts";
import type { UpdateUserDTO } from "../types/user.types.ts";
import { ApiError } from "../utils/ApiError.ts";

class UserServices {
  async getProfile(userId: string) {
    const user = await userRepository.getProfile(userId);
    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, "User not found");
    }
    return user;
  }

  async updateProfile(userId: string, profileData: UpdateUserDTO) {
    const user = await userRepository.updateProfile(userId, profileData);
    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, "User not found");
    }
    return user;
  }
}

export default new UserServices();
