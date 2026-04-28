import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret_key_for_crikify";

export const generateAccessToken = (userId: string) => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "24h",
  });

  return token;
};

export const generateRefreshToken = (userId: string) => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};
