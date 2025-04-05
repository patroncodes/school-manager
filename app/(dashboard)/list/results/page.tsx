import ListHeader from "@/components/ListHeader";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { resultsColumn } from "@/components/tables/resultsColumn";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { SearchParams, UserRole } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

const ResultsListPage = async ({ searchParams }: SearchParams) => {
  const { page, ...queryParams } = await searchParams
  const p = page ? parseInt(page) : 1;

  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: UserRole })?.role;
  const query: Prisma.ResultWhereInput = {}

  // URL PARAMS CONDITION
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'studentId':
            query.studentId = value
            break;
          case 'search':
            query.OR = [
              { exam: { title: { contains: value, mode: 'insensitive' } } },
              {
                student: {
                  name: { contains: value, mode: 'insensitive' },
                  surname: { contains: value, mode: 'insensitive' }
                }
              }
            ]
            break;
          default:
            break;
        }
      }
    }
  }

  const [results, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: { select: { name: true, surname: true } },
        exam: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } }
              }
            }
          }
        },

        assignment: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } }
              }
            }
          }
        }
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),

    prisma.result.count({ where: query }),
  ]);

  const data = results.map((item) => {
    const assessment = item.exam || item.assignment;

    if (!assessment) return null

    const isExam = "startTime" in assessment

    return {
      id: item.id,
      title: assessment.title,
      studentName: item.student.name,
      studentSurname: item.student.surname,
      teacherName: assessment.lesson.teacher.name,
      teacherSurname: assessment.lesson.teacher.surname,
      score: item.score,
      className: assessment.lesson.class.name,
      startTime: isExam ? assessment.startTime : assessment.startDate,
      endTime: isExam ? assessment.endTime : assessment.dueDate,
      type: isExam ? "Exam" : "Assignment"
    }
  })

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <ListHeader title="All Results" role={role!} />
      <Table columns={resultsColumn} data={data} role={role!} />
      <Pagination count={count} page={p} />
    </div>
  );
};

export default ResultsListPage;
