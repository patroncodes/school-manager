import { resultsColumn } from "@/components/tables/resultsColumn";
import { DataTable } from "@/components/ui/data-table";
import prisma from "@/lib/prisma";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";

const ResultsListPage = async ({ searchParams }: SearchParams) => {
  const { ...queryParams } = await searchParams

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

  const results = await prisma.result.findMany({
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
    }
  })

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
      <DataTable tableFor="result" columns={resultsColumn} data={data} filterBy="studentSurname" />
    </div>
  );
};

export default ResultsListPage;
