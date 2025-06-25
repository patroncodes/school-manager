"use server";

import { CurrentState } from "@/types";
import prisma from "../prisma";
import { handleServerErrors } from "../utils";
import { FeeSchema } from "../validation";

export const createFee = async (
  currentState: CurrentState,
  data: FeeSchema,
) => {
  try {
    const resData = await prisma.fee.create({
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
    return { success: false, error: true };
  }
};

export const updateFee = async (
  currentState: CurrentState,
  data: FeeSchema,
) => {
  try {
    const resData = await prisma.fee.update({
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
    return { success: false, error: true };
  }
};

export const deleteFee = async (id: string) => {
  try {
    const resData = await prisma.fee.delete({
      where: {
        id: parseInt(id),
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
