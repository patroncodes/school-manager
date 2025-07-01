import { z } from "zod";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const usernamePattern = /^[a-z0-9._]+$/;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, "Username must be up to 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      usernamePattern,
      "Username must contain only lowercase letters, numbers, dots, or underscores",
    ),
  name: z.string().min(1, { message: "First Name is required" }),
  surname: z.string().min(1, { message: "Surname is required" }),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(passwordPattern, {
      message:
        "Password must include uppercase, lowercase, number, and special character",
    })
    .optional()
    .or(z.literal("")),
  address: z.string(),
  img: z.string().optional(),
  oldImg: z.string().optional(),
  birthday: z.coerce.date({ message: "Birthday is required" }),
  bloodType: z.string().min(2, { message: "Blood Type is required" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
  gradeId: z.coerce.number().min(2, { message: "Grade is required" }),
  classId: z.coerce.number().min(2, { message: "Class is required" }),
  parentId: z.string().min(2, { message: "Parent is required" }),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, "Username must be up to 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      usernamePattern,
      "Username must contain only lowercase letters, numbers, dots, or underscores",
    ),
  name: z.string().min(1, { message: "First Name is required" }),
  surname: z.string().min(1, { message: "Surname is required" }),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(11, { message: "Phone is required" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(passwordPattern, {
      message:
        "Password must include uppercase, lowercase, number, and special character",
    })
    .optional()
    .or(z.literal("")),
  address: z.string(),
  bloodType: z.string().min(1, { message: "Blood Type is required" }),
  birthday: z.coerce.date({ message: "Birthday is required" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
  img: z.string().optional(),
  oldImg: z.string().optional(),
  subjects: z.array(z.string()).optional(),
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(2, { message: "Subject Name is required" }),
  teachers: z.array(z.string()),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(2, { message: "Class Name is required" }),
  capacity: z.coerce.number({ message: "Capacity is required" }),
  gradeId: z.coerce.number({ message: "Grade is required" }),
  supervisorId: z.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const examSchema = z
  .object({
    id: z.coerce.number().optional(),
    title: z.string().min(2, { message: "Title is required" }),
    startTime: z.coerce.date({ message: "Start time is required" }),
    endTime: z.coerce.date({ message: "End Time is required" }),
    lessonId: z.coerce.number(),
  })
  .refine((data) => data.endTime >= data.startTime, {
    path: ["endTime"],
    message: "End Time cannot be before Start Time",
  });

export type ExamSchema = z.infer<typeof examSchema>;

export const assignmentSchema = z
  .object({
    id: z.coerce.number().optional(),
    title: z.string().min(2, { message: "Title is required" }),
    startDate: z.coerce.date({ message: "Start Date is required" }),
    dueDate: z.coerce.date({ message: "Due date is required" }),
    lessonId: z.coerce.number(),
  })
  .refine((data) => data.dueDate >= data.startDate, {
    path: ["dueDate"],
    message: "Due date cannot be before start date",
  });

export type AssignmentSchema = z.infer<typeof assignmentSchema>;

export const lessonSchema = z
  .object({
    id: z.coerce.number().optional(),
    name: z.string().min(2, { message: "Lesson Name is required" }),
    description: z.string().optional(),
    startTime: z.coerce.date({ message: "Start Time is required" }),
    endTime: z.coerce.date({ message: "End Time is required" }),
    teacherId: z.string(),
    subjectId: z.coerce.number(),
    classId: z.coerce.number(),

    materials: z.string().optional(),
    objectives: z.string().optional(),
  })
  .refine((data) => data.endTime >= data.startTime, {
    path: ["endTime"],
    message: "End time cannot be before start time",
  });

export type LessonSchema = z.infer<typeof lessonSchema>;

export const parentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, "Username must be up to 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      usernamePattern,
      "Username must contain only lowercase letters, numbers, dots, or underscores",
    ),
  name: z.string().min(1, { message: "First Name is required" }),
  surname: z.string().min(1, { message: "Surname is required" }),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(11, { message: "Phone is required" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(passwordPattern, {
      message:
        "Password must include uppercase, lowercase, number, and special character",
    })
    .optional()
    .or(z.literal("")),
  address: z.string(),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
});

export type ParentSchema = z.infer<typeof parentSchema>;

export const resultSchema = z.object({
  id: z.coerce.number().optional(),
  score: z.coerce.number().nonnegative(),
  testId: z.coerce.number().optional(),
  studentId: z.string(),
});

export type ResultSchema = z.infer<typeof resultSchema>;

export const eventSchema = z
  .object({
    id: z.coerce.number().optional(),
    title: z
      .string()
      .min(8, { message: "Event title must be over 8 characters" }),
    description: z
      .string()
      .min(15, { message: "Description is too short" })
      .max(100, { message: "Description is too long" }),
    startTime: z.coerce.date({ message: "Start time is required" }),
    endTime: z.coerce.date({ message: "End Time is required" }),
    classId: z.coerce.number().optional().nullable(),
  })
  .refine((data) => data.endTime >= data.startTime, {
    path: ["endTime"],
    message: "End Time cannot be before start time",
  });

export type EventSchema = z.infer<typeof eventSchema>;

export const announcementSchema = z.object({
  id: z.coerce.number().optional(),
  title: z
    .string()
    .min(8, { message: "Event title must be over 8 characters" }),
  description: z
    .string()
    .min(15, { message: "Description is too short" })
    .max(100, { message: "Description is too long" }),
  date: z.coerce.date({ message: "Date is required" }),
  classId: z.coerce.number().optional().nullable(),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;

export const feeSchema = z
  .object({
    id: z.coerce.number().optional(),
    amount: z.coerce.number().gt(0, { message: "Please enter an amount" }),
    description: z
      .string()
      .min(8, { message: "Too short" })
      .max(35, { message: "Too long" }),
    dueDate: z.coerce.date().optional().nullable(),
    classId: z.coerce.number().optional().nullable(),
    studentId: z.string().optional().nullable(),
  })
  .refine((data) => data.dueDate && data?.dueDate >= new Date(), {
    path: ["dueDate"],
    message: "Due date cannot be in the past",
  });

export type FeeSchema = z.infer<typeof feeSchema>;

export const transactionSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  studentId: z.string({ message: "Please select a student" }),
  feeId: z.coerce.number(),
  amount: z.coerce.number(),
  extraDescription: z.string().nullable(),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;
