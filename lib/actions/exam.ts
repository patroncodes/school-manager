"use server";

import { CurrentState } from "@/types";
import prisma from "../prisma";
import { getCurrentUser } from "../serverUtils";
import { handleServerErrors } from "../utils";
import { ExamSchema } from "../zod/validation";

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema,
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
            "You can't create an exam for a lesson that doesn't belong to you",
        };
      }
    }

    const resData = await prisma.exam.create({
      data, // Since the key-value pairs all have the same name
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

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema,
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
    const resData = await prisma.exam.update({
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

export const deleteExam = async (id: string) => {
  try {
    const { role, currentUserId } = await getCurrentUser();

    const resData = await prisma.exam.delete({
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
