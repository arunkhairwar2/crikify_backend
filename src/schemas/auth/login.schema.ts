import z from "zod";
import { passwordValidation, phoneValidation } from "../common.schemas.ts";

export const LoginSchema = z.object({
  countryCode: z
    .string()
    .min(2, "Country code must be at least 2 characters")
    .trim(),
  mobile: phoneValidation,
  password: passwordValidation,
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
