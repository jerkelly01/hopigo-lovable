import { sign, verify } from "hono/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your-super-secret-refresh-key-change-in-production";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export async function generateTokens(userId: string, email: string, role: string) {
  const now = Math.floor(Date.now() / 1000);
  
  const accessToken = await sign(
    {
      userId,
      email,
      role,
      iat: now,
      exp: now + (15 * 60), // 15 minutes
    },
    JWT_SECRET
  );

  const refreshToken = await sign(
    {
      userId,
      email,
      role,
      iat: now,
      exp: now + (7 * 24 * 60 * 60), // 7 days
    },
    REFRESH_SECRET
  );

  return { accessToken, refreshToken };
}

export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const payload = await verify(token, JWT_SECRET) as JWTPayload;
    return payload;
  } catch (error) {
    console.error("Access token verification failed:", error);
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload | null> {
  try {
    const payload = await verify(token, REFRESH_SECRET) as JWTPayload;
    return payload;
  } catch (error) {
    console.error("Refresh token verification failed:", error);
    return null;
  }
}

export function hashPassword(password: string): string {
  // In a real app, use bcrypt or similar
  // This is a simple hash for demo purposes
  return Buffer.from(password).toString("base64");
}

export function verifyPassword(password: string, hash: string): boolean {
  return Buffer.from(password).toString("base64") === hash;
}