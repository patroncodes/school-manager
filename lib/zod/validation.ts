import { parse, isBefore, subYears } from "date-fns";
import { z } from "zod";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const usernamePattern = /^[a-z0-9._]+$/;

const birthday = (diff: number) =>
  z.coerce
    .date({ message: "Birthday is required" })
    .max(new Date(), {
      message: "This user is not yet born? Please, select the correct birthday",
    })
    .refine(
      (date) => {
        return isBefore(date, subYears(new Date(), diff));
      },
      { message: `User must be at least ${diff} years old` },
    );

export const schoolSchema = z.object({
  slug: z.string().min(3, "This is required"),
  name: z.string().min(3, "What's your school's name?"),
  email: z.string().email(),
  phone: z.string().min(3, "Please enter a phone number"),
  address: z.string().min(3, "Please enter an address"),
  motto: z.string().nullable(),
  logo: z.string().optional(),
  programs: z
    .array(z.enum(["CRECHE", "NURSERY", "PRIMARY", "SECONDARY"]))
    .min(1, "Please select at least one program"),
  grades: z.array(z.string()).min(1, "Please select at least one grade"),
  managerUsername: z
    .string()
    .min(3, "Username must be up to 3 characters")
    .max(20, "Username must be at most 20 characters"),
  managerName: z.string().min(3, { message: "First Name is required" }),
  managerSurname: z.string().min(3, { message: "Surname is required" }),
  managerEmail: z.string().email(),
  managerPhone: z.string().min(10, "Phone number is incorrect"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(passwordPattern, {
      message:
        "Password must include uppercase, lowercase, number, and special character",
    }),
  managerBirthday: birthday(22),
  managerImage: z.string().optional(),
});

export type SchoolSchema = z.infer<typeof schoolSchema>;

export const programSchema = z.object({
  name: z.string().min(1, "Please select a program"),
  grades: z.array(z.string()).min(1, "Select at least one grade"),
});

export type ProgramSchema = z.infer<typeof programSchema>;

export const studentSchema = (slug: string) =>
  z
    .object({
      id: z.string().optional(),
      clerkUserId: z.string().optional(),
      registrationNumber: z
        .string()
        .min(3, "This must be up to 3 characters")
        .max(20, "Sorry. This shouldn't exceed 20 characters")
        .transform((val) => `${slug}-${val}`),
      name: z.string().min(2, { message: "First Name is required" }),
      surname: z.string().min(2, { message: "Surname is required" }),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(passwordPattern, {
          message:
            "Password must include uppercase, lowercase, number, and special character",
        })
        .optional()
        .nullable()
        .or(z.literal("")),
      address: z.string().min(3, "Please enter an address"),
      img: z.string().optional().nullable(),
      oldImg: z.string().optional().nullable(),
      birthday: birthday(1),
      medicalCondition: z.string().optional().nullable(),
      sex: z.enum(["MALE", "FEMALE", "OTHER"], { message: "Sex is required" }),
      programId: z.string().optional().nullable(),
      gradeId: z.string().optional().nullable(),
      classId: z.string().min(10, { message: "Class is required" }),

      primaryGuardianRelationship: z
        .string()
        .min(1, { message: "How are they related to the primary guardian?" }),
      secondaryGuardianRelationship: z.string().optional().nullable(),

      primaryGuardian: z.object(
        {
          id: z.string().min(5, "Id is missing"),
          name: z.string(),
        },
        { message: "Primary Guardian is required" },
      ),
      secondaryGuardian: z
        .object({
          id: z.string().optional().nullable(),
          name: z.string(),
        })
        .nullable(),
    })
    .refine(
      (data) =>
        !data.secondaryGuardian ||
        data.primaryGuardian.id !== data.secondaryGuardian.id,
      {
        message: "Primary and secondary guardian cannot be the same person",
        path: ["secondaryGuardian"],
      },
    )
    .refine(
      (data) => !data.secondaryGuardian || data.secondaryGuardianRelationship,
      {
        message: "How are they related to the secondary guardian?",
        path: ["secondaryGuardianRelationship"],
      },
    )
    .refine(
      (data) => !data.secondaryGuardianRelationship || data.secondaryGuardian,
      {
        message: "Secondary guardian is missing. Deselect or provide one",
        path: ["secondaryGuardian"],
      },
    );

export type StudentSchema = z.infer<ReturnType<typeof studentSchema>>;

export const staffSchema = (slug: string) =>
  z.object({
    id: z.string().optional().nullable(),
    clerkUserId: z.string().optional().nullable(),
    employeeId: z
      .string()
      .min(3, "Username must be up to 3 characters")
      .max(20, "Username must be at most 20 characters")
      .transform((val) => `${slug}-${val}`),
    name: z.string().min(1, { message: "First Name is required" }),
    surname: z.string().min(1, { message: "Surname is required" }),
    email: z.union([z.string().email().optional(), z.literal(""), z.null()]),
    phone: z.string().min(10, "Phone number is incorrect"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(passwordPattern, {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      })
      .optional()
      .nullable()
      .or(z.literal("")),
    address: z.string().min(5, { message: "Address is required" }),
    birthday: birthday(18),
    hireDate: z.coerce.date().optional().nullable(),
    sex: z.enum(["MALE", "FEMALE", "OTHER"], { message: "Sex is required" }),
    img: z.string().optional().nullable(),
    oldImg: z.string().optional().nullable(),
    contractType: z.enum(["CONTRACT", "PART_TIME", "PERMANENT"]),
    accessLevel: z.enum([
      "ACADEMICS",
      "ADMINISTRATION",
      "FINANCE",
      "RESTRICTED",
      "TEACHER",
    ]),
    role: z.string().min(1, { message: "Role is required" }),
    isActive: z.boolean().default(true),
    position: z.string().optional().nullable(),
    programId: z.string().optional().nullable(),

    // PRIMARY, NURSERY
    gradeId: z.string().optional().nullable(),
    classId: z.string().optional().nullable(),

    // SECONDARY
    grades: z.array(z.string()).optional().nullable(),
    subjects: z.array(z.string()).optional().nullable(),
  });

export type StaffSchema = z.infer<ReturnType<typeof staffSchema>>;

export const subjectSchema = z.object({
  id: z.string().optional().nullable(),
  relationId: z.string().optional().nullable(),
  name: z.string().min(2, { message: "Subject Name is required" }),
  teachers: z.array(z.string()),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const gradeSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().nonempty("Name is required"),
  programId: z.string({ message: "Please indicate the grade's program" }),
});

export type GradeSchema = z.infer<typeof gradeSchema>;

export const classSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(1, { message: "Class name is required" }),
  capacity: z.coerce
    .number({
      message: "How many students can this class hold?",
    })
    .min(1, { message: "Capacity must be at least 1" }),
  gradeId: z.string({ message: "Grade is required" }),
  supervisors: z.array(z.string()).optional().nullable(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const examSchema = z.object({
  id: z.string().optional().nullable(),
  date: z.coerce.date({ message: "Date is required" }),
  startTime: z.string(),
  endTime: z.string().optional().nullable(),
  type: z.enum(["FINAL", "TEST", "MIDTERM", "QUIZ", "PRACTICAL"]),
  maxScore: z.coerce.number().min(1),
  files: z.array(z.string()).optional().nullable(),
  subjectId: z.string().min(1, { message: "What subject is this exam for?" }),
  gradeId: z.string().min(1, { message: "Which grade is this exam for?" }),
  termId: z.string().min(1, { message: "Term is required" }),
});

export type ExamSchema = z.infer<typeof examSchema>;

export const assignmentSchema = z
  .object({
    id: z.string().optional().nullable(),
    startDate: z.coerce.date({ message: "Start Date is required" }),
    dueDate: z.coerce.date({ message: "When's the due date?" }),
    maxScore: z.coerce.number().min(1),
    files: z.array(z.string()).optional().nullable(),
    subjectId: z
      .string()
      .min(1, { message: "What subject is this assignment for?" }),
    classId: z
      .string()
      .min(1, { message: "Which class is this assignment for?" }),
    termId: z.string().min(1, { message: "Term is required" }),
    gradeId: z
      .string({ message: "Which class is this assignment for?" })
      .optional()
      .nullable(),
  })
  .refine((data) => data.dueDate >= data.startDate, {
    path: ["dueDate"],
    message: "Due date cannot be before start date",
  });

export type AssignmentSchema = z.infer<typeof assignmentSchema>;

export const clubSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(2, { message: "Name is required" }),
  description: z.string().min(2, { message: "Description is required" }),
  foundedAt: z.coerce
    .date({ message: "Start Time is required" })
    .optional()
    .nullable(),
});

export type ClubSchema = z.infer<typeof clubSchema>;

export const timetableAssignmentSchema = z
  .object({
    // Period
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
    daysOfWeek: z.array(z.string()),

    // Assignment
    id: z.string().optional(),
    subjectId: z.string().optional().nullable(),
    teacherId: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      const start = parse(data.startTime, "HH:mm", new Date("1970-01-01"));
      const end = parse(data.endTime, "HH:mm", new Date("1970-01-01"));
      return end > start;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  );

export type TimetableAssignmentSchema = z.infer<
  typeof timetableAssignmentSchema
>;

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
    id: z.string().optional().nullable(),
    title: z
      .string()
      .min(1, { message: "Event title must be over 8 characters" }),
    description: z
      .string()
      .min(5, { message: "Description is too short" })
      .max(500, { message: "Description is too long" }),
    startTime: z.coerce.date({ message: "Start time is required" }),
    endTime: z.coerce.date({ message: "End Time is required" }),
    gradeId: z.string().optional().nullable(),
  })
  .refine((data) => data.endTime >= data.startTime, {
    path: ["endTime"],
    message: "End Time cannot be before start time",
  });

export type EventSchema = z.infer<typeof eventSchema>;

export const announcementSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(8, { message: "Event title must be over 8 characters" }),
  content: z
    .string()
    .min(5, { message: "Description is too short" })
    .max(1000, { message: "Description is too long" }),
  isPublished: z.boolean(),
  classId: z.string().optional().nullable(),
  gradeId: z.string().optional().nullable(),
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

export const studentAttendanceSchema = z.object({
  lessonId: z.string().optional(),
  classId: z.string().optional(),
  date: z.coerce.date(),
  records: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
    }),
  ),
});

export type StudentAttendanceSchema = z.infer<typeof studentAttendanceSchema>;

export const staffAttendanceSchema = z.object({
  staffId: z.string(),
  date: z.coerce.date().default(() => new Date()),
});

export type StaffAttendanceSchema = z.infer<typeof staffAttendanceSchema>;

export const termSchema = (type: "academic-year" | "term") =>
  z
    .object({
      id: z.string().optional().nullable(),
      term: type === "term" ? z.string() : z.null(),
      year: type === "term" ? z.null() : z.string(),
      startDate: z.coerce.date({ message: "Start date is required" }),
      endDate: z.coerce
        .date({ message: "End date is required" })
        .optional()
        .nullable(),
      isCurrent: z.boolean(),
      academicYearId: type === "term" ? z.string() : z.null(),
    })
    .refine((data) => data.endDate == null || data.endDate >= data.startDate, {
      path: ["endDate"],
      message: "End Date cannot be before Start Date",
    });

export type TermSchema = z.infer<ReturnType<typeof termSchema>>;
