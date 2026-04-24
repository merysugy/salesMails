"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AUTH_COOKIE } from "@/lib/auth-constants";

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(AUTH_COOKIE);
  jar.delete("refresh_token");
  redirect("/");
}
