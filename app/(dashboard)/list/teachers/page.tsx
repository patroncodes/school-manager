import { teachersColumn } from "@/components/tables/teachersColumn";
import { DataTable } from "@/components/ui/data-table";
import prisma from "@/lib/prisma";
import { SearchParams } from "@/types";
import { Prisma } from '@prisma/client';

const TeachersListPage = async ({ searchParams }: SearchParams) => {
  const { ...queryParams } = await searchParams

  const query: Prisma.TeacherWhereInput = {}

  // URL PARAMS CONDITION
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'classId':
            query.lessons = {
              some: {
                classId: parseInt(value)
              }
            }
            break;
          case 'search':
            query.name = { contains: value, mode: 'insensitive' }
            break;
          default:
            break;
        }
      }
    }
  }

  const teachers = await prisma.teacher.findMany({
    where: query,
    include: {
      subjects: true,
      classes: true
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <DataTable tableFor="teacher" columns={teachersColumn} data={teachers} filterBy="name" />
    </div>
  );
};

export default TeachersListPage;