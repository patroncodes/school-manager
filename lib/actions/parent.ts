"use server";

import { CurrentState } from "@/types";
import { clerkClient } from "@clerk/nextjs/server";
import prisma from "../prisma";
import { handleServerErrors } from "../utils";
import { ParentSchema } from "../validation";

export const createParent = async (
  currentState: CurrentState,
  { password, ...data }: ParentSchema,
) => {
  const client = await clerkClient();
  let userId = "";

  try {
    const user = await client.users.createUser({
      username: data.username,
      password: password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "parent" },
    });

    userId = user.id;

    await prisma.parent.create({
      data: {
        id: userId,
        ...data,
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

    const client = await clerkClient();

    const user = await client.users.updateUser(data.id, {
      username: data.username,
      ...(password !== "" && { password: password }),
      firstName: data.name,
      lastName: data.surname,
    });

    if (!user) throw Error;

    const resData = await prisma.parent.update({
      where: {
        id: data.id,
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

export const deleteParent = async (id: string) => {
  try {
    const client = await clerkClient();

    const user = await client.users.deleteUser(id);

    if (!user) throw Error;
    const resData = await prisma.parent.delete({
      where: {
        id,
      },
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
    const parents = await prisma.parent.findMany({
      where: {
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
