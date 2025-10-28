"use server";

import prisma from "../prisma";
import { getCurrentUser } from "@/lib/serverUtils";
import { Table } from "@/types";
import { handleServerErrors } from "@/lib/utils";

export const getFormRelatedData = async (table: Table, data?: any) => {
  const { accessLevel, schoolId, currentUserId } = await getCurrentUser();

  let relatedData = {};

  switch (table) {
    case "subject":
      const subjectTeachers = await prisma.staff.findMany({
        where: {
          schoolId,
          isActive: true,
          accessLevel: "TEACHER",
        },
        select: { id: true, name: true, surname: true },
      });
      relatedData = { teachers: subjectTeachers };
      break;
    case "class":
      const [classPrograms, classGrades, classTeachers] =
        await prisma.$transaction([
          prisma.program.findMany({
            where: { schoolId },
            select: { id: true, name: true },
          }),

          prisma.grade.findMany({
            where: { schoolId },
            select: { id: true, name: true },
          }),

          prisma.staff.findMany({
            where: {
              schoolId,
              isActive: true,
              accessLevel: "TEACHER",
            },
            select: { id: true, name: true, surname: true },
          }),
        ]);
      relatedData = {
        programs: classPrograms,
        grades: classGrades,
        teachers: classTeachers,
      };
      break;
    case "staff":
      const teacherSubjects = await prisma.subject.findMany({
        where: { schoolId },
        select: { id: true, name: true },
      });
      relatedData = { subjects: teacherSubjects };
      break;
    case "student":
      const studentGrades = await prisma.grade.findMany({
        where: { schoolId },
        select: { id: true, name: true },
      });
      const studentClasses = await prisma.class.findMany({
        where: { schoolId },
        select: {
          id: true,
          name: true,
          capacity: true,
          gradeId: true,
          _count: { select: { students: true } },
        },
      });
      relatedData = { classes: studentClasses, grades: studentGrades };
      break;
    case "exam":
      const examLessons = await prisma.lesson.findMany({
        where: {
          ...(accessLevel === "teacher" ? { teacherId: currentUserId! } : {}),
        },
        select: { id: true, name: true },
      });
      relatedData = { lessons: examLessons };
      break;
    case "assignment":
      const assignmentLessons = await prisma.lesson.findMany({
        where: {
          ...(accessLevel === "teacher" ? { teacherId: currentUserId! } : {}),
        },
        select: { id: true, name: true },
      });
      relatedData = { lessons: assignmentLessons };
      break;
    case "lesson":
      const lessonSubjects = await prisma.subject.findMany({
        select: { id: true, name: true },
      });
      const lessonClasses = await prisma.class.findMany({
        select: { id: true, name: true },
      });
      const lessonTeachers = await prisma.staff.findMany({
        where: { schoolId, isActive: true, accessLevel: "TEACHER" },
        select: { id: true, name: true, surname: true },
      });
      relatedData = {
        subjects: lessonSubjects,
        classes: lessonClasses,
        teachers: lessonTeachers,
      };
      break;
    case "timetable":
      const timetableSubjects = await prisma.subject.findMany({
        select: { id: true, name: true },
      });
      relatedData = {
        subjects: timetableSubjects,
      };
      break;
    // case "result":
    //   const resultExams = await prisma.exam.findMany({
    //     where: {
    //       ...(role === "teacher"
    //         ? { lesson: { teacherId: currentUserId! } }
    //         : {}),
    //     },
    //     select: { id: true, title: true, lessonId: true },
    //   });
    //   const resultAssignments = await prisma.assignment.findMany({
    //     where: {
    //       ...(role === "teacher"
    //         ? { lesson: { teacherId: currentUserId! } }
    //         : {}),
    //     },
    //     select: { id: true, title: true, lessonId: true },
    //   });
    //   relatedData = { exams: resultExams, assignments: resultAssignments };
    //   break;
    // case "event":
    //   const eventClasses = await prisma.class.findMany({
    //     select: { id: true, name: true },
    //   });
    //   relatedData = { classes: eventClasses };
    //   break;
    // case "announcement":
    //   const announcementClasses = await prisma.class.findMany({
    //     select: { id: true, name: true },
    //   });
    //   relatedData = { classes: announcementClasses };
    //   break;
    // case "fee":
    //   const feeClasses = await prisma.class.findMany({
    //     select: { id: true, name: true },
    //   });
    //   relatedData = { classes: feeClasses };
    //   break;
    // case "transaction":
    //   let studentDetails;

    //   const parentId =
    //     role === "admin" ? (data?.parentId as string) : currentUserId!;

    //   const parent = await prisma.parent.findUnique({
    //     where: { id: parentId },
    //     select: {
    //       email: true,
    //       students: {
    //         select: { id: true, name: true, surname: true },
    //       },
    //     },
    //   });

    //   const student = parent?.students.filter(
    //     (student) => student.id === data?.studentId,
    //   );

    //   if (student && student.length < 1) {
    //     studentDetails = parent?.students;
    //   } else {
    //     studentDetails = student;
    //   }

    //   const paymentDetails = await prisma.fee.findMany({
    //     where: {
    //       OR: [
    //         ...(data?.feeId
    //           ? [{ id: data.feeId as number }]
    //           : [
    //             {
    //               student: {
    //                 parentId: parentId,
    //               },
    //             },
    //             {
    //               studentId: null,
    //               classId: null,
    //             },
    //             {
    //               class: {
    //                 students: {
    //                   some: {
    //                     parentId: parentId,
    //                   },
    //                 },
    //               },
    //             },
    //           ]),
    //       ],
    //     },
    //     select: { id: true, amount: true, description: true },
    //   });

    //   relatedData = {
    //     email: parent?.email,
    //     paymentDetails,
    //     userRole: role,
    //     students: studentDetails,
    //     feeId: data?.feeId,
    //     studentId: data?.studentId,
    //   };
    //   break;
    default:
      break;
  }

  return relatedData;
};

export const getActiveTerm = async (termId?: string) => {
  const { schoolId } = await getCurrentUser();

  return await prisma.term.findFirst({
    where: {
      id: termId,
      schoolId,
      isCurrent: true,
    },
    select: {
      id: true,
      term: true,
      startDate: true,
      endDate: true,
    },
  });
};

export const getTerms = async () => {
  const { schoolId } = await getCurrentUser();

  return await prisma.term.findMany({
    where: {
      schoolId,
    },
    select: {
      id: true,
      term: true,
      isCurrent: true,
      academicYear: {
        select: {
          year: true,
        },
      },
    },
  });
};
