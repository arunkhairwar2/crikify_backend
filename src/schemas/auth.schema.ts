import z from "zod";

export const phoneValidation = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .refine((val) => /^\+?[1-9]\d{6,14}$/.test(val), {
    message: "Please enter a valid phone number.",
  });

export const emailValidation = z
  .string()
  .min(1, "Email is required")
  .max(50, "Email must be less than 50 characters")
  .trim()
  .email("Please enter a valid email address")
  .transform((val) => val.toLowerCase());

export const passwordValidation = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .max(16, "Password must be less than 16 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

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
  primaryPhoneNumber: phoneValidation,
  dob: z.coerce.date().max(new Date(), "DOB cannot be future date"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  email: emailValidation,
  password: passwordValidation,
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
// export type LoginSchemaType = z.infer<typeof LoginSchema>;
// export type PhoneValidationType = z.infer<typeof phoneValidation>;
// export type EmailValidationType = z.infer<typeof emailValidation>;
// export type PasswordValidationType = z.infer<typeof passwordValidation>;
