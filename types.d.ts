import React from "react";
import { FieldError } from "react-hook-form";

type SearchParams = {
  searchParams: Promise<{ [key: string]: string }>;
  params: Promise<{ [key: string]: string }>;
};

type CurrentState = { success: boolean; error: boolean | string };

type Table =
  | "teacher"
  | "student"
  | "parent"
  | "subject"
  | "class"
  | "lesson"
  | "exam"
  | "assignment"
  | "result"
  | "attendance"
  | "event"
  | "announcement"
  | "fee"
  | "transaction";

type UserRole = "admin" | "teacher" | "student" | "parent";

enum Sex {
  MALE = "male",
  FEMALE = "female",
}

declare type FormContainerProps = {
  table: Table;
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
  studentId?: string;
};

declare type FormProps = {
  type: "create" | "update";
  data: any;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  relatedData: any;
};

declare type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  containerClassName?: string;
  defaultValue?: Date | string | number;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

declare type AttendanceSchema = {
  id?: number;
  date: Date;
  present: boolean;
  studentId: string;
  lessonId: number;
};

declare type TransactionData = {
  id: number;
  status: boolean;
  reference: string;
  amount: number;
  customer: {
    email: string;
  };
  metadata: {
    description: string;
    fee_id: string;
    first_name: string;
    last_name: string;
    user_id: string;
  };
  paidAt: Date | string;
};
