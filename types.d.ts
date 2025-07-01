import React, { ReactNode } from "react";
import { FieldError } from "react-hook-form";

type SearchParams = {
  searchParams: Promise<{ [key: string]: string }>;
  params: Promise<{ [key: string]: string }>;
};

type CurrentState = {
  success: boolean;
  error: boolean | string;
  data?: string;
};

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

declare interface ParentProfileProps {
  students: {
    id: string;
    name: string;
    surname: string;
    class: { name: string };
    attendances: Array<{
      date: string;
      present: boolean;
      lesson: {
        name: string;
        subject: {
          name: string;
        };
      };
    }>;
    results: Array<{
      score: number;
      createdAt: Date;
      exam?: {
        title: string;
      };
      assignment?: {
        title: string;
      };
    }>;
  }[];
}

declare interface TabItemProps {
  icon: ReactNode;
  label: string;
  subLabel: string;
  value: string;
  className?: string;
}

declare interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, any>;
    log: any;
    fees: number;
    fees_split: any;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string | null;
    };
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: Record<string, any>;
      risk_action: string;
      international_format_phone: string | null;
    };
    plan: any;
    split: any;
    order_id: any;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: any;
    source: any;
    fees_breakdown: any;
  };
}
