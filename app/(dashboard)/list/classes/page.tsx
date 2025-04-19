import ListHeader from "@/components/ListHeader";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { classesColumn } from "@/components/tables/classesColumn";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/serverUtils";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";

const ClassesListPage = async ({ searchParams }: SearchParams) => {
  const { page, ...queryParams } = await searchParams
  const p = page ? parseInt(page) : 1;

  const { role } = await getCurrentUser()

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

  const [data, count] = await prisma.$transaction([
    prisma.class.findMany({
      orderBy: {
        name: 'asc'
      },
      where: query,
      include: {
        supervisor: true
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),

    prisma.class.count({ where: query }),
  ])

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <ListHeader role={role!} title="All Classes" table="class" />
      <Table columns={classesColumn} data={data} role={role!} />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ClassesListPage;
