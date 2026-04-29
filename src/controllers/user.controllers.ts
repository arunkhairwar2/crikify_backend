import type { Request, Response } from "express";
import userServices from "../services/user.services.ts";
import { uploadToS3, generateS3Key } from "../lib/s3Upload.ts";
import { HttpStatus } from "../types/statusCode.ts";
import type { UpdateUserDTO } from "../types/user.types.ts";
import { ApiError } from "../utils/ApiError.ts";
import { validateImageFile } from "../utils/fileValidation.ts";

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

  /**
   * Handle profile picture upload.
   *
   * Flow:
   *  1. Read file from `req.file` (populated by multer middleware)
   *  2. Validate MIME type + file size (belt-and-suspenders — multer already filters)
   *  3. Generate a unique S3 key under "profile-pictures/"
   *  4. Upload the buffer to S3
   *  5. Pass the S3 URL to the service for DB persistence + old-file cleanup
   */
  updateProfilePicture = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const file = req.file;

    // Validates presence, MIME type, and size — throws ApiError(400) on failure
    validateImageFile(file);

    // Generate a unique S3 object key
    const s3Key = generateS3Key("profile-pictures", file.originalname);

    // Upload file buffer directly to S3
    const { url } = await uploadToS3({
      buffer: file.buffer,
      mimetype: file.mimetype,
      key: s3Key,
    });

    // Persist URL in DB and clean up old S3 object
    const userProfile = await userServices.updateProfilePicture(user.id, url);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "Profile picture updated successfully",
      data: userProfile,
    });
  };
}

export default new UserControllers();

