"use server";

import { AnnouncementSchema } from "../zod/validation";
import { getCurrentUser } from "@/lib/serverUtils";
import { handleServerErrors } from "@/lib/utils";
import prisma from "../prisma";
import { AppError } from "@/lib/pothos/errors";

export const createAnnouncementAction = async (data: AnnouncementSchema) => {
  try {
    const { schoolId, accessLevel } = await getCurrentUser();

    if (!schoolId || !accessLevel)
      throw new AppError("Invalid user", "UNAUTHORIZED");

    return await prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        schoolId: schoolId!,
        termId: "3",
        publishedAt: new Date(),
      },
    });
  } catch (err: any) {
    const error = handleServerErrors(err);
    console.log(error);
  }
};

export const updateAnnouncementAction = async (data: AnnouncementSchema) => {
  try {
    const { schoolId } = await getCurrentUser();

    return await prisma.announcement.update({
      where: {
        id: data.id,
        schoolId,
      },
      data,
    });
  } catch (err: any) {
    await handleServerErrors(err);
  }
};

export const deleteAnnouncementAction = async (id: string) => {
  try {
    const { schoolId } = await getCurrentUser();

    await prisma.announcement.delete({
      where: {
        id,
        schoolId,
      },
    });

    return { success: true, error: null };
  } catch (err: any) {
    console.log(err);
    return { success: false, error: err.message };
  }
};
