import userRepository from "../repositories/user.repository.ts";
import { deleteFromS3, extractKeyFromUrl } from "../lib/s3Upload.ts";
import { HttpStatus } from "../types/statusCode.ts";
import type { UpdateUserDTO } from "../types/user.types.ts";
import { ApiError } from "../utils/ApiError.ts";
import { logger } from "../utils/logger.ts";

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

  /**
   * Update the user's profile picture.
   *
   * @param userId         — authenticated user ID
   * @param newPictureUrl  — the S3 URL of the newly uploaded image
   *
   * After persisting the new URL, the old S3 object (if any) is deleted
   * asynchronously. Cleanup failures are logged but never block the response.
   */
  async updateProfilePicture(userId: string, newPictureUrl: string) {
    // 1. Fetch the current picture URL before overwriting
    const oldPictureUrl = await userRepository.getProfilePicture(userId);

    // 2. Persist the new picture URL in the database
    const user = await userRepository.updateProfilePicture(
      userId,
      newPictureUrl,
    );

    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, "User not found");
    }

    // 3. Clean up old S3 object (fire-and-forget)
    if (oldPictureUrl) {
      const oldKey = extractKeyFromUrl(oldPictureUrl);
      if (oldKey) {
        deleteFromS3(oldKey).catch((err) => {
          logger.error("Failed to delete old profile picture from S3", {
            userId,
            oldKey,
            error: err,
          });
        });
      }
    }

    return user;
  }
}

export default new UserServices();
