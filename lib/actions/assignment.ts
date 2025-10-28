"use server";

import { handleServerErrors } from "@/lib/utils";
import { AssignmentSchema } from "@/lib/zod/validation";
import { CurrentState } from "@/types";
import { getCurrentUser } from "../serverUtils";
import prisma from "../prisma";

export const createAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema,
) => {
  try {
    const { accessLevel, schoolId } = await getCurrentUser();

    const permittedRoles = ["manager", "teacher", "administration"];

    if (!permittedRoles.includes(accessLevel!)) {
      return {
        success: false,
        error: "You don't have permission to update this assignment",
      };
    }

    await prisma.assignment.create({
      data: {
        schoolId,
        termId: data.termId!,
        ...data,
      },
    });

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

export const updateAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema,
) => {
  try {
    const { currentUserId, accessLevel, schoolId } = await getCurrentUser();

    const permittedRoles = ["manager", "teacher", "administration"];

    if (!permittedRoles.includes(accessLevel!)) {
      return {
        success: false,
        error: "You don't have permission to update this assignment",
      };
    }

    await prisma.assignment.update({
      where: {
        id: data.id,
        schoolId,
        ...(accessLevel === "teacher"
          ? {
              class: {
                OR: [
                  { formTeacherId: currentUserId },
                  { classTeacherId: currentUserId },
                ],
              },
            }
          : {}),
      },
      data,
    });

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

export const deleteAssignment = async (id: string) => {
  try {
    const { accessLevel, currentUserId, schoolId } = await getCurrentUser();

    const permittedRoles = ["manager", "teacher", "administration"];

    if (!permittedRoles.includes(accessLevel!)) {
      return {
        success: false,
        error: "You don't have permission to delete assignments",
      };
    }

    await prisma.assignment.delete({
      where: {
        id,
        schoolId,
        ...(accessLevel === "teacher"
          ? {
              class: {
                OR: [
                  { formTeacherId: currentUserId },
                  { classTeacherId: currentUserId },
                ],
              },
            }
          : {}),
      },
    });

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
