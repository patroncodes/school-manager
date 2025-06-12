"use server";

import { handleServerErrors } from "@/lib/utils";
import { LessonSchema } from "@/lib/validation";
import { CurrentState } from "@/types";
import prisma from "../prisma";
import { getCurrentUser } from "../serverUtils";
import { dayOfWeek } from "@/constants";
import { Day } from "@prisma/client";

export const createLesson = async (
  currentState: CurrentState,
  data: LessonSchema,
) => {
  try {
    const startDayIndex = new Date(data.startTime).getDay();
    const index = startDayIndex === 0 ? 6 : startDayIndex - 1;
    const startDay = dayOfWeek[index] as Day;

    const materials = data.materials?.split(";") || [];
    const objectives = data.objectives?.split(";") || [];

    const resData = await prisma.lesson.create({
      data: {
        ...data,
        materials,
        objectives,
        day: startDay,
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

export const updateLesson = async (
  currentState: CurrentState,
  data: LessonSchema,
) => {
  try {
    const startDayIndex = new Date(data.startTime).getDay();
    const index = startDayIndex === 0 ? 6 : startDayIndex - 1;
    const startDay = dayOfWeek[index] as Day;

    const materials =
      data.materials?.split(";").map((item) => item.trim()) || [];
    const objectives =
      data.objectives?.split(";").map((item) => item.trim()) || [];

    const resData = await prisma.lesson.update({
      where: {
        id: data.id,
      },
      data: {
        ...data,
        materials,
        objectives,
        day: startDay,
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

export const deleteLesson = async (id: string) => {
  try {
    const { role, currentUserId } = await getCurrentUser();

    const resData = await prisma.lesson.delete({
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
