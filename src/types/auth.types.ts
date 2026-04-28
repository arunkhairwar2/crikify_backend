import { RegisterSchemaType } from "../schemas/auth/register.schema.ts";

export type UserRegisterType = {
  otp: string;
  otpExpiry: Date;
} & RegisterSchemaType;
