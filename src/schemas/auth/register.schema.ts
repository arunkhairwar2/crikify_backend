import z from "zod";
import {
  emailValidation,
  passwordValidation,
  phoneValidation,
} from "../common.schemas.ts";

export const RegisterSchema = z.object({
  firstName: z
    .string()
    .min(3, "First name must be at least 3 characters")
    .max(100, "First name must be less than 100 characters")
    .trim()
    .regex(/^[A-Za-z]+$/, "First name must contain only letters"),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(3, "Last name must be at least 3 characters")
    .max(100, "Last name must be less than 100 characters")
    .trim()
    .regex(/^[A-Za-z]+$/, "Last name must contain only letters"),
  countryCode: z
    .string()
    .min(2, "Country code must be at least 2 characters")
    .trim(),
  mobile: phoneValidation,
  // dob: z.coerce.date().max(new Date(), "DOB cannot be future date"),
  // gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  email: emailValidation,
  password: passwordValidation,
  isAdultConfirmed: z.boolean().refine((val) => val === true, {
    message: "You must be at least 18 years old to register",
  }),
});



export type RegisterSchemaType = z.infer<typeof RegisterSchema>;


// export type LoginSchemaType = z.infer<typeof LoginSchema>;
// export type PhoneValidationType = z.infer<typeof phoneValidation>;
// export type EmailValidationType = z.infer<typeof emailValidation>;
// export type PasswordValidationType = z.infer<typeof passwordValidation>;
