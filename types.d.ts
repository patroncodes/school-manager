import React, { ReactNode } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ProgramType } from "@/lib/generated/prisma/enums";

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
  | "staff"
  | "student"
  | "parent"
  | "subject"
  | "class"
  | "club"
  | "exam"
  | "assignment"
  | "result"
  | "attendance"
  | "event"
  | "announcement"
  | "fee"
  | "transaction"
  | "grade"
  | "program"
  | "timetable"
  | "term"
  | "academic-year";

type RoleAccessLevel =
  | "student"
  | "parent"
  | "academics"
  | "finance"
  | "administration"
  | "teacher"
  | "manager";

enum Sex {
  MALE = "male",
  FEMALE = "female",
}

declare type ErrorTypes =
  | "AppError"
  | "BaseAppError"
  | "UniqueConstraintError"
  | "ForeignKeyError"
  | "NotFoundError"
  | "IdentifierExistsError"
  | "PasswordTooShortError"
  | "PasswordPwnedError";

declare type FormModalProps = {
  table: Table;
  type: "create" | "update";
  data?: any;
  studentId?: string;
  triggerTitle?: string;
  relatedData?: any;
  children?: React.ReactNode;
};

declare interface FormProps
  extends Pick<FormModalProps, "type" | "data" | "relatedData"> {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

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

declare interface DataTableProps {
  columns: ColumnDef<any, any>[];
  data: any[];
  accessLevel: RoleAccessLevel;
  title?: string;
  termFilter?: TermSelectorProps;
  tableFor: Table;
  filters?: {
    listCreation?: boolean;
    termFilter?: boolean;
    selectCount?: boolean;
  };
  relatedData?: any;
}

declare interface TermSelectorProps {
  terms: {
    id: string;
    term: number;
    isCurrent: boolean;
    academicYear: {
      year: string;
    };
  }[];
  selectedTermId: string;
}

declare interface CreateSchoolInput {
  programs: ProgramType[];
  grades: {
    gradeName: string;
    programName: string;
  }[];
  manager: {
    username: string;
    password: string;
    name: string;
    surname: string;
    birthday: Date;
    email: string;
    phone: string;
    img?: string | null;
  };
  slug: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  logo?: string | null;
  motto?: string | null;
}

declare interface UserAuthInput {
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  accessLevel: string;
  schoolId?: string;
}
