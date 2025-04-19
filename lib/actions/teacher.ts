import { CurrentState } from "@/types";
import { TeacherSchema } from "../validation";
import prisma from "../prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { handleServerErrors } from "../utils";

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema,
) => {
  try {
    const client = await clerkClient();

    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "student" },
    });

    const resData = await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        birthday: data.birthday,
        sex: data.sex,
        subjects: {
          connect: data.subjects?.map((subjectId) => ({
            id: parseInt(subjectId),
          })),
        },
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

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema,
) => {
  try {
    const client = await clerkClient();

    if (!data.id) return { success: false, error: "Teacher doesn't exist" };

    const user = await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    if (!user) throw Error;

    const resData = await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        birthday: data.birthday,
        sex: data.sex,
        subjects: {
          set: data.subjects?.map((subjectId) => ({
            id: parseInt(subjectId),
          })),
        },
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
      error: "Something went wrong while updating the teacher",
    };
  }
};

export const deleteTeacher = async (id: string) => {
  try {
    const client = await clerkClient();

    const user = await client.users.deleteUser(id);

    if (!user) throw Error;
    const resData = await prisma.teacher.delete({
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
