"use server";

import { CurrentState, UserRole } from "@/types";
import { TransactionSchema } from "../validation";
import { TransactionType } from "@prisma/client";

interface TransactionState extends TransactionSchema {
  fee: {
    id: number;
    amount: number;
    description: string;
  };
  student: {
    name: string;
    surname: string;
  };
  userRole: UserRole;
}

export const initiateTransaction = async (
  currentState: CurrentState,
  data: TransactionState,
) => {
  try {
    const { email, studentId, fee, userRole, student, extraDescription } = data;

    const amountInKobo = Math.round(fee?.amount * 100);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL!}/api/paystack/initialize`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          amount: amountInKobo,
          callback_url:
            userRole !== "admin"
              ? `${process.env.NEXT_PUBLIC_BASE_URL!}/list/fees`
              : `${process.env.NEXT_PUBLIC_BASE_URL!}/list/transactions`,
          metadata: {
            fee_id: fee.id,
            student_id: studentId,
            first_name: student.name,
            last_name: student.surname,
            description: fee.description,
            extraDescription: extraDescription,
            type: TransactionType.INCOME,
          },
        }),
      },
    );

    const responseData = await response.json();

    if (responseData.status && responseData.data?.authorization_url) {
      return {
        success: true,
        error: false,
        data: responseData.data.authorization_url,
      };
    } else {
      throw new Error(responseData.message || "Payment initialization failed");
    }
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "An error occurred. Please try again",
    };
  }
};
