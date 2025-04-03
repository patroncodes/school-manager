import { lessonsColumn } from "@/components/tables/lessonsColumn";
import { DataTable } from "@/components/ui/data-table";
import prisma from "@/lib/prisma";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";

const LessonsListPage = async ({ searchParams }: SearchParams) => {
  const { ...queryParams } = await searchParams

  const query: Prisma.LessonWhereInput = {}

  // URL PARAMS CONDITION
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'teacherId':
            query.teacherId = value
            break;
          case 'classId':
            query.classId = parseInt(value)
            break;
          case 'search':
            query.OR = [
              { subject: { name: { contains: value, mode: 'insensitive' } } },
              {
                teacher: {
                  name: { contains: value, mode: 'insensitive' },
                  surname: { contains: value, mode: 'insensitive' }
                }
              }
            ];
            break;
          default:
            break;
        }
      }
    }
  }
  const lessons = await prisma.lesson.findMany({
    where: query,
    include: {
      teacher: { select: { name: true, surname: true } },
      subject: { select: { name: true } },
      class: { select: { name: true } }
    }
  })

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <DataTable tableFor="lesson" columns={lessonsColumn} data={lessons} filterBy="startTime" />
    </div>
  );
};

export default LessonsListPage;
