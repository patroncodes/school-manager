import { examsColumn } from "@/components/tables/examsColumn";
import { DataTable } from "@/components/ui/data-table";
import prisma from "@/lib/prisma";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";

const ExamsListPage = async ({ searchParams }: SearchParams) => {
  const { ...queryParams } = await searchParams

  const query: Prisma.ExamWhereInput = {}

  // URL PARAMS CONDITION
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'classId':
            query.lesson = { classId: parseInt(value) }
            break;
          case 'teacherId':
            query.lesson = { teacherId: value }
            break;
          case 'search':
            query.lesson = {
              subject: { name: { contains: value, mode: 'insensitive' } }
            }
            break;
          default:
            break;
        }
      }
    }
  }
  const exams = await prisma.exam.findMany({
    where: query,
    include: {
      lesson: {
        select: {
          subject: { select: { name: true } },
          teacher: { select: { name: true, surname: true } },
          class: { select: { name: true } }
        }
      }
    }
  })
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <DataTable tableFor="exam" columns={examsColumn} data={exams} filterBy="subject" />
    </div>
  );
};

export default ExamsListPage;
