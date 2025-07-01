"use server";

import { CurrentState } from "@/types";
import { clerkClient } from "@clerk/nextjs/server";
import prisma from "../prisma";
import { extractImageId, handleServerErrors } from "../utils";
import { StudentSchema } from "../validation";
import { deleteImage } from "../cloudinary";

export const createStudent = async (
  currentState: CurrentState,
  { password, ...data }: StudentSchema,
) => {
  const client = await clerkClient();
  let userId = "";
  try {
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      select: { capacity: true, _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return {
        success: false,
        error: "There's no space in the selected class.",
      };
    }

    const user = await client.users.createUser({
      username: data.username,
      password: password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "student" },
    });

    userId = user.id;

    await prisma.student.create({
      data: {
        id: userId,
        ...data,
      },
    });

    return { success: true, error: false };
  } catch (err: any) {
    if (userId !== "") {
      await client.users.deleteUser(userId);
    }
    console.log(err);
    const serverErrors = handleServerErrors(err);

    if (serverErrors?.error) {
      return {
        success: false,
        error: serverErrors.error,
      };
    }

    return {
      success: false,
      error: "Something went wrong while creating the teacher",
    };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  { password, oldImg, ...data }: StudentSchema,
) => {
  try {
    if (!data.id) return { success: false, error: "Student doesn't exist" };

    const client = await clerkClient();

    const user = await client.users.updateUser(data.id, {
      username: data.username,
      ...(password !== "" && { password: password }),
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "student" },
    });

    if (!user) throw Error;

    if (data.img && oldImg) {
      const publicId = extractImageId(oldImg);

      await deleteImage(publicId.id as string);
    }

    const resData = await prisma.student.update({
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

    return {
      success: false,
      error: "Something went wrong while updating the student",
    };
  }
};

export const deleteStudent = async (id: string) => {
  try {
    const client = await clerkClient();

    const user = await client.users.deleteUser(id);

    if (!user) throw Error;

    const studentImg = await prisma.student.findUnique({
      where: {
        id,
      },
      select: { img: true },
    });

    if (studentImg?.img) {
      const imageId = extractImageId(studentImg.img);
      await deleteImage(imageId.id as string);
    }

    const resData = await prisma.student.delete({
      where: {
        id,
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

export const getStudents = async (
  currentState: {
    data: { id: string; name: string; surname: string }[] | undefined;
    error: boolean;
  },
  searchTerm: string,
) => {
  try {
    const students: { id: string; name: string; surname: string }[] =
      await prisma.student.findMany({
        where: {
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
