import { FieldError } from "react-hook-form";

type SearchParams = {
  searchParams: Promise<{ [key: string]: string }>;
  params: string;
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
  | "announcement";

enum Sex {
  MALE = "male",
  FEMALE = "female",
}

interface Teacher {
  id: number;
  teacherId: string;
  name: string;
  email?: string;
  photo: string;
  phone: string;
  subjects: string[];
  classes: string[];
  address: string;
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
  email?: string;
  phone?: string;
  address: string;
  grade: number;
  class: string;
  bloodType: string;
  sex: Sex;
  birthday: Date;
  img: string;
}

interface Parent {
  id: number;
  name: string;
  email?: string;
  students: string[];
  phone: string;
  address: string;
}

interface Subject {
  id: number;
  name: string;
  teachers: string[];
}

interface Class {
  id: number;
  name: string;
  capacity: number;
  grade: number;
  supervisor: string;
}

interface Lesson {
  id: number;
  subject: string;
  class: string;
  teacher: string;
}

interface Exam {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  date: Date;
}

interface Assignment {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  dueDate: Date;
}

interface Result {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  student: string;
  date: Date;
  type: string;
  score: number;
}

interface Announcement {
  id: number;
  title: string;
  class: string;
  date: string;
}

declare interface Event {
  id: number;
  title: string;
  class: string;
  date: string;
  startTime: string;
  endTime: string;
}

declare type FormModalProps = {
  table: Table;
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
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
