import { subjectsColumn } from "@/components/tables/subjectsColumn";
import { DataTable } from "@/components/ui/data-table";
import prisma from "@/lib/prisma";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";

const SubjectsListPage = async ({ searchParams }: SearchParams) => {
  const { ...queryParams } = await searchParams

  const query: Prisma.SubjectWhereInput = {}

  // URL PARAMS CONDITION
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search':
            query.name = { contains: value, mode: 'insensitive' }
            break;
          default:
            break;
        }
      }
    }
  }
  const subjects = await prisma.subject.findMany({
    where: query,
    include: {
      teachers: true,
    },
  })
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <DataTable tableFor="subject" columns={subjectsColumn} data={subjects} filterBy="name" />
    </div>
  );
};

export default SubjectsListPage;
