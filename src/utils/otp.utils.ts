export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getOtpExpiryTime = () => {
  return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
};

export const isOtpMatch = (otp: string, storedOtp: string) => {
  return otp === storedOtp;
};
