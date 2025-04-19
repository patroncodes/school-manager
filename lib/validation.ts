import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, "Username must be up to 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-z0-9._]+$/,
      "Username must contain only lowercase letters, numbers, dots, or underscores",
    ),
  name: z.string().min(1, { message: "First Name is required" }),
  surname: z.string().min(1, { message: "Surname is required" }),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(passwordRegex, {
      message:
        "Password must include uppercase, lowercase, number, and special character",
    })
    .optional()
    .or(z.literal("")),
  address: z.string(),
  img: z.string().optional(),
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
      /^[a-z0-9._]+$/,
      "Username must contain only lowercase letters, numbers, dots, or underscores",
    ),
  name: z.string().min(1, { message: "First Name is required" }),
  surname: z.string().min(1, { message: "Surname is required" }),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(11, { message: "Phone is required" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(passwordRegex, {
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

export const lessonSchema = z.object({
  name: z.string().min(2, { message: "Lesson Name is required" }),
  class: z.string().min(2, { message: "Class is required" }),
  teacher: z.string().min(5, { message: "Teacher is required" }),
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
