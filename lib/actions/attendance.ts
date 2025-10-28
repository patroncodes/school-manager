"use server";

import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { handleServerErrors } from "../utils";
import { getCurrentUser } from "@/lib/serverUtils";
import {
  StaffAttendanceSchema,
  StudentAttendanceSchema,
} from "@/lib/zod/validation";

export const markStudentAttendance = async (data: StudentAttendanceSchema) => {
  try {
    const { schoolId } = await getCurrentUser();

    const { lessonId, records, classId, date } = data;

    await Promise.all(
      records.map((record) =>
        prisma.studentAttendance.upsert({
          where: lessonId
            ? {
                schoolId_studentId_date_lessonId: {
                  schoolId,
                  date,
                  lessonId,
                  studentId: record.studentId,
                },
              }
            : {
                schoolId_studentId_date_classId: {
                  schoolId,
                  date,
                  studentId: record.studentId,
                  classId: classId!,
                },
              },
          update: {
            status: record.status,
          },
          create: {
            schoolId,
            termId: "54f1dae1-0c83-4a1e-b282-d8a48d033d8a",
            classId,
            lessonId,
            date,
            studentId: record.studentId,
            status: record.status,
          },
        }),
      ),
    );

    revalidatePath("/list/attendance");

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

export const markStaffAttendance = async (data: StaffAttendanceSchema) => {
  try {
    const { schoolId } = await getCurrentUser();

    console.log(data);

    const { date, staffId } = data;

    await prisma.staffAttendance.create({
      data: {
        schoolId,
        termId: "54f1dae1-0c83-4a1e-b282-d8a48d033d8a",
        date,
        staffId,
      },
    });

    revalidatePath("/list/attendance/staff");

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
