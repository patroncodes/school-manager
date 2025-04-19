import { clerkClient } from "@clerk/nextjs/server";
import { handleServerErrors } from "../utils";
import prisma from "../prisma";
import { CurrentState } from "@/types";
import { StudentSchema } from "../validation";

export const createStudent = async (
  currentState: CurrentState,
  { password, ...data }: StudentSchema,
) => {
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

    const client = await clerkClient();

    const user = await client.users.createUser({
      username: data.username,
      password: password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "student" },
    });

    const resData = await prisma.student.create({
      data: {
        id: user.id,
        ...data,
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

    return {
      success: false,
      error: "Something went wrong while creating the teacher",
    };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  { password, ...data }: StudentSchema,
) => {
  try {
    if (!data.id) return { success: false, error: "Student doesn't exist" };

    const client = await clerkClient();

    const user = await client.users.updateUser(data.id, {
      username: data.username,
      ...(password !== "" && { password: password }),
      firstName: data.name,
      lastName: data.surname,
    });

    if (!user) throw Error;

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
