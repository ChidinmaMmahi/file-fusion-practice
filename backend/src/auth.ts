import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "token";

type JwtPayload = {
  userId: string;
};

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
}

export function signToken(userId: string): string {
  return jwt.sign({ userId } satisfies JwtPayload, getJwtSecret(), {
    expiresIn: "7d",
  });
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export type AuthedRequest = Request & { userId: string };

export function getUserId(req: Request): string {
  return (req as AuthedRequest).userId;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.[COOKIE_NAME] as string | undefined;
  if (!token) {
    res.status(401).json({ error: "You need to sign in" });
    return;
  }

  try {
    const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;
    (req as unknown as AuthedRequest).userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: "Session expired. Please sign in again" });
  }
}
