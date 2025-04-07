"use server";

import { UserRole } from "@/types";
import { auth } from "@clerk/nextjs/server";

export async function getCurrentUser() {
  const { userId, sessionClaims } = await auth();

  const role = (sessionClaims?.metadata as { role?: UserRole })?.role;
  const currentUserId = userId;

  return { role, currentUserId };
}
