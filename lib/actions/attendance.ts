"use server";

import prisma from "../prisma";
import { handleServerErrors } from "../utils";

export const markAttendance = async (
  lessonId: number,
  attendance: { studentId: string; present: boolean }[],
) => {
  try {
    const attendanceRecords = await Promise.all(
      attendance.map((record) =>
        prisma.attendance.upsert({
          where: {
            studentId_lessonId: {
              studentId: record.studentId,
              lessonId: lessonId,
            },
          },
          update: {
            present: record.present,
          },
          create: {
            studentId: record.studentId,
            lessonId: lessonId,
            present: record.present,
            date: new Date(),
          },
        }),
      ),
    );

    if (!attendanceRecords) throw Error;

    return { success: true, error: false };
  } catch (error) {
    console.log(error);
    const serverErrors = handleServerErrors(error);

    if (serverErrors?.error) {
      return {
        success: false,
        error: serverErrors.error,
      };
    }
    return { success: false, error: true };
  }
};
