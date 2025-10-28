"use server";

import { handleServerErrors } from "@/lib/utils";
import { ResultSchema } from "@/lib/zod/validation";
import { CurrentState } from "@/types";
import { getCurrentUser } from "../serverUtils";
import prisma from "../prisma";

type DataType = ResultSchema & {
  type: string;
  lessonId: number;
};

export const createResult = async (
  currentState: CurrentState,
  data: DataType,
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
          error: `This ${data.type} doesn't belong to your class`,
        };
      }
    }

    const resData = await prisma.result.create({
      data: {
        score: data.score,
        ...(data.type === "exam"
          ? { examId: data.testId }
          : { assignmentId: data.testId }),
        studentId: data.studentId,
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

export const updateResult = async (
  currentState: CurrentState,
  data: DataType,
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
          error: `This ${data.type} doesn't belong to your class`,
        };
      }
    }

    const resData = await prisma.result.update({
      where: {
        id: data.id,
      },
      data: {
        score: data.score,
        ...(data.type === "exam"
          ? { examId: data.testId }
          : { assignmentId: data.testId }),
        studentId: data.studentId,
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

export const deleteResult = async (id: string) => {
  try {
    const { role, currentUserId } = await getCurrentUser();

    const resData = await prisma.result.delete({
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
