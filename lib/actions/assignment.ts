"use server";

import { handleServerErrors } from "@/lib/utils";
import { AssignmentSchema } from "@/lib/validation";
import prisma from "./prisma";
import { getCurrentUser } from "./serverUtils";

export const createAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema,
) => {
  try {
    const { currentUserId, role } = await getCurrentUser();
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: currentUserId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return {
          success: false,
          error:
            "You can't create an assignment for a lesson that doesn't belong to you",
        };
      }
    }

    const resData = await prisma.assignment.create({
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
    return { success: false, error: true };
  }
};

export const updateAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema,
) => {
  try {
    const { currentUserId, role } = await getCurrentUser();
    if (role === "teacher") {
      const teacherLesson = await prisma.lesson.findFirst({
        where: {
          teacherId: currentUserId!,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return {
          success: false,
          error:
            "You can't update an assignment for a lesson that doesn't belong to you",
        };
      }
    }

    const resData = await prisma.assignment.update({
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
    return { success: false, error: true };
  }
};

export const deleteAssignment = async (id: string) => {
  try {
    const { role, currentUserId } = await getCurrentUser();

    const resData = await prisma.assignment.delete({
      where: {
        id: parseInt(id),
        ...(role === "teacher"
          ? { lesson: { teacherId: currentUserId! } }
          : {}),
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
