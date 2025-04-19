import React, { ReactNode, SetStateAction } from "react";
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
  | "announcement";

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
  defaultValue?: Date | string | number;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

declare type SelectFieldProps = {
  label: string;
  selectOptions: () => ReactNode;
  selectedItem: string;
  setSelectedItem: Dispatch<SetStateAction<string>>;
  error?: FieldError;
  selectProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
};
