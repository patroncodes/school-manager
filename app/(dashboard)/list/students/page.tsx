import { studentsColumn } from "@/components/tables/studentsColumn";
import { DataTable } from "@/components/ui/data-table";
import prisma from "@/lib/prisma";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";

const StudentsListPage = async ({ searchParams }: SearchParams) => {
  const { ...queryParams } = await searchParams

  const query: Prisma.StudentWhereInput = {}

  // URL PARAMS CONDITION
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'teacherId':
            query.class = {
              lessons: {
                some: {
                  teacherId: value
                }
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
  const students = await prisma.student.findMany({
    where: query,
    include: {
      class: true
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <DataTable tableFor="student" columns={studentsColumn} data={students} filterBy="name" />
    </div>
  );
};

export default StudentsListPage;
