import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as TokenPayload;

    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}
