"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "paygate_token";

export async function getToken(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(COOKIE_NAME)?.value;
}

export async function requireAuth(): Promise<string> {
  const token = await getToken();
  if (!token) redirect("/login");
  return token;
}

export async function setToken(token: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
}

export async function clearToken() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
