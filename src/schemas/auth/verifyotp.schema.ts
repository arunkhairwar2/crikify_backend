import z from "zod";
import { phoneValidation } from "../common.schemas.ts";

export const VerifyOtpSchema = z.object({
  countryCode: z.string().min(2, "Country code must be at least 2 characters"),
  mobile: phoneValidation,
  otp: z
    .string()
    .min(6, "OTP must be at least 6 digits")
    .max(6, "OTP must be at most 6 digits"),
});

export type VerifyOtpSchemaType = z.infer<typeof VerifyOtpSchema>;