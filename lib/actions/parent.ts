"use server";

import { CurrentState } from "@/types";
import { clerkClient } from "@clerk/nextjs/server";
import { handleServerErrors } from "../utils";
import { ParentSchema } from "../zod/validation";
import { getCurrentUser } from "@/lib/serverUtils";
import prisma from "../prisma";

export const createParent = async (
  currentState: CurrentState,
  { password, ...data }: ParentSchema,
) => {
  const { accessLevel, schoolId } = await getCurrentUser();

  if (accessLevel !== "manager") {
    return { success: false, error: "Unauthorized" };
  }

  const client = await clerkClient();
  let userId = "";

  try {
    const user = await client.users.createUser({
      username: data.username,
      password: password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { accessLevel: "parent" },
    });

    userId = user.id;

    await prisma.parent.create({
      data: {
        ...data,
        clerkUserId: userId,
        schoolId,
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    if (userId !== "") {
      await client.users.deleteUser(userId);
    }

    console.log(err);
    const serverErrors = handleServerErrors(err);

    if (serverErrors?.error) {
      return {
        success: false,
        error: serverErrors.error,
      };
    }

    return {
      success: false,
      error: "Something went wrong while creating the parent",
    };
  }
};

export const updateParent = async (
  currentState: CurrentState,
  { password, ...data }: ParentSchema,
) => {
  try {
    if (!data.id) return { success: false, error: "Parent doesn't exist" };

    const { accessLevel, schoolId } = await getCurrentUser();

    if (accessLevel !== "manager") {
      return { success: false, error: "Unauthorized" };
    }

    const client = await clerkClient();

    await client.users.updateUser(data.id, {
      username: data.username,
      ...(password !== "" && { password: password }),
      firstName: data.name,
      lastName: data.surname,
    });

    const resData = await prisma.parent.update({
      where: {
        id: data.id,
        schoolId,
      },
      data,
    });

    if (!resData) throw Error;

    return { success: true, error: false };
  } catch (err: any) {
    console.log(err);
    const serverErrors = handleServerErrors(err);

    if (serverErrors?.error) {
      return {
        success: false,
        error: serverErrors.error,
      };
    }

    return {
      success: false,
      error: "Something went wrong while updating the parent",
    };
  }
};

export const deleteParent = async (parentId: string) => {
  try {
    const client = await clerkClient();
    const { accessLevel, schoolId } = await getCurrentUser();

    if (accessLevel !== "manager") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.parent.delete({
      where: {
        id: parentId,
        schoolId,
      },
    });

    await client.users.deleteUser(parentId);

    return { success: true, error: "" };
  } catch (err: any) {
    console.log(err);
    const serverErrors = handleServerErrors(err);

    if (serverErrors?.error) {
      return {
        success: false,
        error: serverErrors.error,
      };
    }

    return { success: false, error: true };
  }
};

export const getParents = async (
  currentState: {
    data: { id: string; name: string; surname: string }[] | undefined;
    error: boolean;
  },
  searchTerm: string,
) => {
  try {
    const { schoolId } = await getCurrentUser();

    const parents: { id: string; name: string; surname: string }[] =
      await prisma.parent.findMany({
        where: {
          schoolId,
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { surname: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, surname: true },
      });

    return { data: parents, error: false };
  } catch (error) {
    console.log(error);
    return { data: undefined, error: true };
  }
};
