import ListHeader from "@/components/ListHeader";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { resultsColumn } from "@/components/tables/resultsColumn";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/serverUtils";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";

const ResultsListPage = async ({ searchParams }: SearchParams) => {
  const { page, ...queryParams } = await searchParams
  const p = page ? parseInt(page) : 1;

  const { role, currentUserId } = await getCurrentUser()
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

  switch (role) {
    case 'admin':
      break;
    case 'teacher':
      query.OR = [
        { exam: { lesson: { teacherId: currentUserId! } } },
        { assignment: { lesson: { teacherId: currentUserId! } } }
      ]
      break;
    case 'student':
      query.studentId = currentUserId!
      break;
    case 'parent':
      query.student = { parentId: currentUserId! }
      break;
    default:
      break;
  }

  const [results, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: { select: { id: true, name: true, surname: true } },
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
        },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),

    prisma.result.count({ where: query }),
  ]);

  results.sort((a, b) => {
    const aDate = a.exam?.startTime ?? a.assignment?.dueDate ?? new Date(0);
    const bDate = b.exam?.startTime ?? b.assignment?.dueDate ?? new Date(0);
    return bDate.getTime() - aDate.getTime();
  });

  const data = results.map((item) => {
    const assessment = item.exam || item.assignment;

    if (!assessment) return null

    const isExam = "startTime" in assessment

    return {
      id: item.id,
      title: assessment.title,
      student: {
        id: item.student.id,
        name: item.student.name,
        surname: item.student.surname
      },
      teacher: {
        name: assessment.lesson.teacher.name,
        surname: assessment.lesson.teacher.surname
      },
      score: item.score,
      className: assessment.lesson.class.name,
      testId: assessment.id,
      lessonId: assessment.lessonId,
      startTime: isExam ? assessment.startTime : assessment.startDate,
      endTime: isExam ? assessment.endTime : assessment.dueDate,
      type: isExam ? "Exam" : "Assignment"
    }
  })

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <ListHeader title="All Results" role={role!} table="result" />
      <Table columns={resultsColumn} data={data} role={role!} />
      <Pagination count={count} page={p} />
    </div>
  );
};

export default ResultsListPage;
