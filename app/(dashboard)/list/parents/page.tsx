import { parentsColumn } from "@/components/tables/parentsColumn";
import { DataTable } from "@/components/ui/data-table";
import prisma from "@/lib/prisma";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";

const ParentsListPage = async ({ searchParams }: SearchParams) => {
  const { ...queryParams } = await searchParams

  const query: Prisma.ParentWhereInput = {}

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
  const parents = await prisma.parent.findMany({
    where: query,
    include: {
      students: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <DataTable
        tableFor="parent"
        columns={parentsColumn}
        data={parents}
        filterBy="surname"
      />
    </div>
  );
};

export default ParentsListPage;
