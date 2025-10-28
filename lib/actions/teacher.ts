"use server";

import { StaffSchema } from "../zod/validation";
import prisma from "../prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { extractImageId, handleServerErrors } from "../utils";
import { deleteImage } from "../cloudinary";
import { getCurrentUser, handleGraphqlServerErrors } from "@/lib/serverUtils";
import { revalidatePath } from "next/cache";
import {
  createUser,
  deleteUserAuthInfo,
  updateUser,
} from "@/lib/actions/school";
import { NotFoundError } from "@/lib/pothos/errors";

export const createStaffAction = async ({
  password,
  id,
  accessLevel,
  grades,
  subjects,
  ...data
}: StaffSchema) => {
  const { schoolId } = await getCurrentUser();

  // During create process, id is basically null or undefined, so this is fine
  let clerkUserId = id;

  delete data.gradeId;

  try {
    if (accessLevel !== "RESTRICTED" && password) {
      const user = await createUser({
        username: data.employeeId,
        password: password,
        firstName: data.name,
        lastName: data.surname,
        accessLevel: accessLevel.toLowerCase(),
        schoolId,
      });

      clerkUserId = user.id;
    }

    return await prisma.$transaction(async (tx) => {
      const staff = await tx.staff.create({
        data: {
          ...data,
          schoolId: schoolId!,
          accessLevel,
          clerkUserId,
        },
      });

      if (
        accessLevel === "TEACHER" &&
        subjects &&
        subjects?.length > 0 &&
        grades
      ) {
        for (const grade of grades) {
          await tx.teacherSubjectAssignment.createMany({
            data: subjects.map((subject) => ({
              schoolId: schoolId!,
              teacherId: staff.id,
              gradeId: grade,
              subjectId: subject,
            })),
          });
        }
      }

      return staff;
    });
  } catch (e) {
    if (clerkUserId) {
      await deleteUserAuthInfo(clerkUserId);
    }

    handleGraphqlServerErrors(e);
  }
};

export const updateStaffAction = async ({
  password,
  accessLevel,
  ...data
}: StaffSchema) => {
  if (!data?.id) throw new NotFoundError();

  try {
    const { schoolId } = await getCurrentUser();

    await updateUser({
      username: data.employeeId,
      firstName: data.name,
      lastName: data.surname,
      accessLevel: accessLevel.toLowerCase(),
      clerkId: data.clerkUserId!,
      ...(password && password !== "" ? { password } : {}),
    });

    if (data.img && data.oldImg) {
      const publicId = extractImageId(data.oldImg);

      await deleteImage(publicId.id as string);
    }

    return await prisma.staff.update({
      where: {
        id: data.id!,
        schoolId,
      },
      data: {
        ...data,
        id: data.id!,
        // subjects: {
        //   set: data.subjects?.map((subjectId) => ({
        //     id: parseInt(subjectId),
        //   })),
        // },
      },
    });
  } catch (err: any) {
    console.log(err);
    handleGraphqlServerErrors(err);
  }
};

export const deleteStaffAction = async (id: string) => {
  try {
    const { schoolId } = await getCurrentUser();
    const client = await clerkClient();

    await client.users.deleteUser(id);

    const teacherImg = await prisma.staff.findUnique({
      where: {
        id,
        schoolId,
      },
      select: { img: true },
    });

    if (teacherImg?.img) {
      const imageId = extractImageId(teacherImg.img);
      await deleteImage(imageId.id as string);
    }

    await prisma.staff.delete({
      where: {
        id,
        schoolId,
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

export const deactivateStaff = async ({
  clerkUserId,
  staffId,
  type,
}: {
  clerkUserId: string;
  staffId: string;
  type: "activate" | "deactivate";
}) => {
  try {
    const { accessLevel, schoolId } = await getCurrentUser();
    const client = await clerkClient();

    if (accessLevel !== "manager" && accessLevel !== "administration") {
      return { success: false, error: "Unauthorized" };
    }

    if (type === "activate") {
      await client.users.unbanUser(clerkUserId);
    } else {
      await client.users.banUser(clerkUserId);
    }

    await prisma.staff.update({
      where: { id: staffId, schoolId },
      data: { isActive: type === "activate" },
    });

    revalidatePath("/list/staffs");

    return { success: true };
  } catch (err) {
    const serverErrors = handleServerErrors(err);

    if (serverErrors?.error) {
      return {
        success: false,
        error: serverErrors.error,
      };
    }

    return {
      success: false,
      error: "There seems to be an error. Please try again later",
    };
  }
};
