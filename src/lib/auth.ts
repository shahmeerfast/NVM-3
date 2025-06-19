import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET!;

export function createToken(userId: string, role?: string) {
  console.log({ userId, role });

  return jwt.sign({ userId, role }, SECRET, { expiresIn: "7d" });
}

export async function setTokenCookie(token: string) {
  const cookie = await cookies();
  cookie.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function getUserIdFromToken() {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function removeToken() {
  const cookie = await cookies();
  cookie.set("token", "", { maxAge: -1 });
}
