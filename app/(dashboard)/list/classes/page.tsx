import { classesColumn } from "@/components/tables/classesColumn";
import { DataTable } from "@/components/ui/data-table";
import prisma from "@/lib/prisma";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";

const ClassesListPage = async ({ searchParams }: SearchParams) => {
  const { ...queryParams } = await searchParams

  const query: Prisma.ClassWhereInput = {}

  // URL PARAMS CONDITION
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search':
            query.name = { contains: value, mode: 'insensitive' }
            break;
          case 'supervisorId':
            query.supervisorId = value
            break;
          default:
            break;
        }
      }
    }
  }
  const classes = await prisma.class.findMany({
    where: query,
    include: {
      supervisor: true
    }
  })

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <DataTable tableFor="class" columns={classesColumn} data={classes} filterBy="supervisor" />
    </div>
  );
};

export default ClassesListPage;
