"use server";

import { handleServerErrors } from "../utils";
import { SubjectSchema } from "../zod/validation";
import { getCurrentUser, handleGraphqlServerErrors } from "@/lib/serverUtils";
import prisma from "../prisma";
import { AppError } from "@/lib/pothos/errors";

export const createSubjectAction = async ({
  name,
  teachers,
}: SubjectSchema) => {
  try {
    const { accessLevel, schoolId } = await getCurrentUser();

    if (accessLevel !== "manager")
      throw new AppError("Unauthorized", "UNAUTHORIZED");

    return await prisma.$transaction(async (tx) => {
      const subject = await tx.subject.create({
        data: { schoolId: schoolId!, name },
      });

      if (teachers.length > 0) {
        await tx.teacherSubjectAssignment.createMany({
          data: teachers.map((teacherId) => ({
            schoolId: schoolId!,
            subjectId: subject.id,
            teacherId,
          })),
        });
      }

      return subject;
    });
  } catch (err: any) {
    handleGraphqlServerErrors(err);
  }
};

export const updateSubjectAction = async (data: SubjectSchema) => {
  try {
    const { accessLevel, schoolId } = await getCurrentUser();

    if (accessLevel !== "manager")
      throw new AppError("Unauthorized", "UNAUTHORIZED");

    return await prisma.subject.update({
      where: {
        id: data.id!,
        schoolId,
      },
      data: {
        name: data.name,
        ...(data.teachers.length > 0 && {
          teacherSubjectAssignments: {
            connectOrCreate: data.teachers.map((teacherId) => ({
              where: { id: data.relationId! },
              create: {
                schoolId: schoolId!,
                subjectId: data.id!,
                teacherId,
              },
            })),
          },
        }),
      },
    });
  } catch (err: any) {
    handleGraphqlServerErrors(err);
  }
};

export const deleteSubjectAction = async (id: string) => {
  try {
    const { accessLevel, schoolId } = await getCurrentUser();

    if (accessLevel !== "manager") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.subject.delete({
      where: {
        id,
        schoolId,
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
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
