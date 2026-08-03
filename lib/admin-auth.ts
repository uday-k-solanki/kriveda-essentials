import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "kriveda-admin-2026";
const COOKIE_NAME = "kriveda_admin_token";
const TOKEN_VALUE = "authenticated"; // simple — replace with signed JWT for production

export function signAdminToken(): string {
  // In production, use a proper JWT with jose or jsonwebtoken
  return Buffer.from(`${TOKEN_VALUE}:${Date.now()}`).toString("base64");
}

export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return decoded.startsWith(TOKEN_VALUE + ":");
  } catch {
    return false;
  }
}

export function validatePassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export function createAuthResponse(redirectTo: string) {
  return NextResponse.redirect(redirectTo);
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
