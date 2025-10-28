import ListHeader from "@/components/ListHeader";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { parentsColumn } from "@/components/tables/parentsColumn";
import { getCurrentUser } from "@/lib/serverUtils";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";
import { prismaForSchool } from "@/lib/prisma";

const ParentsListPage = async ({ searchParams }: SearchParams) => {
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const { role, schoolId } = await getCurrentUser();
  const prisma = prismaForSchool(schoolId);

  const query: Prisma.ParentWhereInput = {};

  // URL PARAMS CONDITION
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.parent.findMany({
      where: query,
      include: {
        ParentStudent: {
          select: {
            student: {
              select: {
                id: true,
                name: true,
                surname: true,
                class: {
                  select: {
                    grade: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
      orderBy: { createdAt: "desc" },
    }),
    prisma.parent.count({ where: query }),
  ]);

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      <ListHeader role={role!} title="All Parents" table="parent" />
      <Table columns={parentsColumn} data={data} role={role!} />
      <Pagination count={count} page={p} />
    </div>
  );
};

export default ParentsListPage;
