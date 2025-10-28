// "use server";

import prisma from "@/lib/prisma";
import { RoleAccessLevel } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@/lib/generated/prisma/client";
import { cookies } from "next/headers";
import { createUrqlClient } from "@/lib/urql/client";
import {
  AppError,
  ForeignKeyError,
  IdentifierExistsError,
  NotFoundError,
  PasswordPwnedError,
  PasswordTooShortError,
  UniqueConstraintError,
} from "@/lib/pothos/errors";

export async function getCurrentUser() {
  const { userId, sessionClaims } = await auth();

  const metadata = sessionClaims?.metadata as
    | {
        accessLevel?: RoleAccessLevel;
        schoolId?: string;
      }
    | undefined;

  return {
    schoolId: metadata?.schoolId,
    currentUserId: userId,
    accessLevel: metadata?.accessLevel,
  };
}

export async function getSchool(schoolId: string) {
  const { accessLevel, currentUserId: userId } = await getCurrentUser();

  let where: Prisma.SchoolWhereInput;

  switch (accessLevel as RoleAccessLevel) {
    case "student":
      where = { students: { some: { clerkUserId: userId } } };
      break;
    case "parent":
      where = { parents: { some: { clerkUserId: userId } } };
      break;
    case "manager":
      where = { managers: { some: { clerkUserId: userId } } };
      break;
    case "finance":
    case "academics":
    case "administration":
    case "teacher":
      where = { staffs: { some: { clerkUserId: userId } } };
      break;
    default:
      where = {
        OR: [
          { students: { some: { clerkUserId: userId } } },
          { staffs: { some: { clerkUserId: userId } } },
        ],
      };
  }

  return await prisma.school.findFirst({
    where: { id: schoolId, ...where },
    select: {
      id: true,
      slug: true,
      name: true,
      logo: true,
      motto: true,
    },
  });
}

export const createServerClient = async () => {
  const cookieStore = await cookies();

  const req = {
    headers: {
      get: (key: string) => (key === "cookie" ? cookieStore : null),
    },
  };

  return createUrqlClient(req as any);
};

export const handleGraphqlServerErrors = (error: any) => {
  console.log(error);

  // CLERK ERRORS
  if (error?.errors && Array.isArray(error.errors)) {
    const primaryError = error.errors[0];

    switch (primaryError.code) {
      case "form_password_pwned":
        throw new PasswordPwnedError();

      case "form_password_length_too_short":
        throw new PasswordTooShortError();

      case "form_identifier_exists":
        throw new IdentifierExistsError();

      case "unexpected_error":
        throw new AppError("Something went wrong. Please try again later.", "");

      case "resource_not_found":
        throw new NotFoundError();

      default:
        break;
    }
  }

  // // PRISMA ERRORS
  if (error?.code) {
    const errorCode = error.code;
    const meta = error?.meta;

    console.log({ meta });

    switch (errorCode) {
      case "P2002":
        throw new UniqueConstraintError(meta?.target[meta?.target.length - 1]);

      case "P2003":
        throw new ForeignKeyError();

      default:
        break;
    }
  }

  throw new AppError("Something went wrong. Please try again later.", "");
};
