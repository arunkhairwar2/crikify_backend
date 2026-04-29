import crypto from "crypto";

export const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const getOtpExpiryTime = () => {
  return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
};

export const isOtpMatch = (otp: string, storedOtp: string) => {
  return otp === storedOtp;
};
