"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser, handleGraphqlServerErrors } from "@/lib/serverUtils";
import { clerkClient } from "@clerk/nextjs/server";
import { deleteImage } from "../cloudinary";
import { extractImageId } from "../utils";
import { StudentSchema } from "../zod/validation";
import { AppError } from "@/lib/pothos/errors";
import { ParentStudentRelationship } from "@/lib/generated/prisma/enums";

export const createStudentAction = async ({
  password,
  programId,
  ...data
}: StudentSchema) => {
  const client = await clerkClient();
  const { accessLevel, schoolId } = await getCurrentUser();

  if (!schoolId) {
    throw new AppError(
      "Please log in to perform this action",
      "SCHOOLID_MISSING",
    );
  }

  if (accessLevel !== "manager") {
    throw new AppError(
      "You are not authorized to perform this action",
      "UNAUTHORIZED",
    );
  }

  let clerkUserId = "";

  try {
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId, schoolId: schoolId! },
      select: { capacity: true, _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      throw new AppError("There's no space in this class", "CLASS_OCCUPIED");
    }

    const program = await prisma.program.findUnique({
      where: { id: programId!, schoolId: schoolId! },
      select: { name: true },
    });

    if (program && program.name === "SECONDARY" && password) {
      const user = await client.users.createUser({
        username: data.registrationNumber,
        password,
        firstName: data.name,
        lastName: data.surname,
        publicMetadata: { accessLevel: "student", schoolId },
      });

      clerkUserId = user.id;
    }

    const {
      primaryGuardian,
      primaryGuardianRelationship,
      secondaryGuardian,
      secondaryGuardianRelationship,
      ...input
    } = data;

    return await prisma.$transaction(async (tx) => {
      const student = await tx.student.create({
        data: {
          ...input,
          schoolId: schoolId!,
          clerkUserId,
        },
      });

      const guardians = [
        {
          parentId: primaryGuardian.id,
          studentId: student.id,
          relation: primaryGuardianRelationship as ParentStudentRelationship,
          isPrimary: true,
        },
        ...(secondaryGuardian?.id
          ? [
              {
                parentId: secondaryGuardian.id,
                studentId: student.id,
                relation:
                  secondaryGuardianRelationship as ParentStudentRelationship,
                isPrimary: false,
              },
            ]
          : []),
      ];

      await tx.parentStudent.createMany({
        data: guardians,
      });

      return student;
    });
  } catch (err: any) {
    if (clerkUserId !== "") {
      await client.users.deleteUser(clerkUserId);
    }
    handleGraphqlServerErrors(err);

    throw new AppError("Failed to this action", "FAILED_ACTION");
  }
};

export const updateStudent = async ({
  password,
  oldImg,
  ...data
}: StudentSchema) => {
  try {
    if (!data.id) return { success: false, error: "Student doesn't exist" };

    delete data.programId;

    const { accessLevel, schoolId } = await getCurrentUser();

    if (accessLevel !== "manager") {
      throw new AppError(
        "You are not authorized to perform this action",
        "UNAUTHORIZED",
      );
    }

    const classItem = await prisma.class.findUnique({
      where: { id: data.classId, schoolId: schoolId! },
      select: { capacity: true, _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      throw new AppError("There's no space in this class", "CLASS_OCCUPIED");
    }

    const client = await clerkClient();

    await client.users.updateUser(data.id, {
      username: data.registrationNumber,
      ...(password && password !== "" && { password: password! }),
      firstName: data.name,
      lastName: data.surname,
    });

    if (data.img && oldImg) {
      const publicId = extractImageId(oldImg);

      await deleteImage(publicId.id as string);
    }

    const {
      primaryGuardian,
      primaryGuardianRelationship,
      secondaryGuardian,
      secondaryGuardianRelationship,
      ...input
    } = data;

    return prisma.$transaction(async (tx) => {
      const student = tx.student.update({
        where: {
          id: data.id,
          schoolId,
        },
        data: {
          ...input,
        },
      });

      const guardians = [
        {
          parentId: primaryGuardian.id,
          studentId: input.id!,
          relation: primaryGuardianRelationship as ParentStudentRelationship,
          isPrimary: true,
        },
        ...(secondaryGuardian?.id
          ? [
              {
                parentId: secondaryGuardian.id,
                studentId: input.id!,
                relation:
                  secondaryGuardianRelationship as ParentStudentRelationship,
                isPrimary: false,
              },
            ]
          : []),
      ];

      await tx.parentStudent.createMany({
        data: guardians,
      });

      return student;
    });
  } catch (err: any) {
    handleGraphqlServerErrors(err);
  }
};

export const deleteStudent = async (studentId: string) => {
  try {
    const { accessLevel, schoolId } = await getCurrentUser();

    if (accessLevel !== "manager") {
      return { success: false, error: "Unauthorized" };
    }

    const client = await clerkClient();

    await prisma.$transaction(async (tx) => {
      const parentLinks = await tx.parentStudent.findMany({
        where: { studentId },
        select: { parentId: true },
      });

      const parentIds = parentLinks.map((p) => p.parentId);

      await tx.student.delete({
        where: {
          id: studentId,
          schoolId,
        },
      });

      if (parentIds.length > 0) {
        await tx.parent.deleteMany({
          where: {
            id: {
              in: parentIds,
            },
            parentStudents: { none: {} },
          },
        });
      }
    });

    const studentImg = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      select: { img: true },
    });

    if (studentImg?.img) {
      const imageId = extractImageId(studentImg.img);
      await deleteImage(imageId.id as string);
    }

    await client.users.deleteUser(studentId);

    return { success: true, error: "" };
  } catch (err: any) {
    console.log(err);
    handleGraphqlServerErrors(err);
  }
};

export const getStudents = async (
  currentState: {
    data: { id: string; name: string; surname: string }[] | undefined;
    error: boolean;
  },
  searchTerm: string,
) => {
  try {
    const { schoolId } = await getCurrentUser();

    const students: { id: string; name: string; surname: string }[] =
      await prisma.student.findMany({
        where: {
          schoolId,
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { surname: { contains: searchTerm, mode: "insensitive" } },
          ],
        },
        select: { id: true, name: true, surname: true },
      });

    return { data: students, error: false };
  } catch (error) {
    console.log(error);
    return { data: undefined, error: true };
  }
};
