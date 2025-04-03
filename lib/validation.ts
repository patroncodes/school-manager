import { z } from "zod";

export const studentSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  phone: z.string().min(11, { message: "Phone is required" }),
  address: z.string().min(10, { message: "Address is required" }),
  bloodType: z.string().min(1, { message: "Blood Type is required" }),
  birthday: z.date({ message: "Birthday is required" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
  img: z.instanceof(File, { message: "Image is required" }),
});

export const teachersSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be up to 3 characters")
    .max(20, "Username must be at most 20 characters"),
  email: z.string().email().optional(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().min(1, { message: "First Name is required" }),
  surname: z.string().min(1, { message: "Last Name is required" }),
  phone: z.string().min(11, { message: "Phone is required" }),
  address: z.string().min(10, { message: "Address is required" }),
  bloodType: z.string().min(1, { message: "Blood Type is required" }),
  birthday: z.date({ message: "Birthday is required" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
  img: z.instanceof(File, { message: "Image is required" }),
});

export const subjectSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be up to 3 characters")
    .max(20, "Username must be at most 20 characters"),
  name: z.string().min(2, { message: "Class Name is required" }),
  teachers: z.string(),
});

export const classSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be up to 3 characters")
    .max(20, "Username must be at most 20 characters"),
  name: z.string().min(2, { message: "Class Name is required" }),
  capacity: z.coerce.number({ message: "Capacity is required" }),
  grade: z.coerce.number({ message: "Grade is required" }),
  supervisor: z.string().min(2, { message: "Supervisor is required" }),
});

export const lessonSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be up to 3 characters")
    .max(20, "Username must be at most 20 characters"),
  name: z.string().min(2, { message: "Lesson Name is required" }),
  class: z.string().min(2, { message: "Class is required" }),
  teacher: z.string().min(5, { message: "Teacher is required" }),
});

export const examSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be up to 3 characters")
    .max(20, "Username must be at most 20 characters"),
  subject: z.string().min(2, { message: "Lesson Name is required" }),
  class: z.string().min(2, { message: "Class is required" }),
  teacher: z.string().min(5, { message: "Teacher is required" }),
  date: z.date({ message: "Exam Date is required" }),
});

export const assignmentSchema = z.object({
  subject: z.string().min(2, { message: "Lesson Name is required" }),
  class: z.string().min(2, { message: "Class is required" }),
  teacher: z.string().min(5, { message: "Teacher is required" }),
  dueDate: z.date({ message: "Assignment Date is required" }),
});

export const resultSchema = z.object({
  subject: z.string().min(2, { message: "Lesson Name is required" }),
  class: z.string().min(2, { message: "Class is required" }),
  teacher: z.string().min(5, { message: "Teacher is required" }),
  student: z.string().min(5, { message: "Student is required" }),
  type: z.string().optional(),
  score: z.number({ message: "Score is required" }),
  date: z.date({ message: "Assignment Date is required" }),
});

export const parentSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be up to 3 characters")
    .max(20, "Username must be at most 20 characters"),
  name: z.string().min(1, { message: "First Name is required" }),
  surname: z.string().min(1, { message: "Last Name is required" }),
  email: z.string().email().nullable(),
  phone: z.string().min(11, { message: "Phone is required" }),
  address: z.string().min(10, { message: "Address is required" }),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
