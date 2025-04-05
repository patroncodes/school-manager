import ListHeader from "@/components/ListHeader";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { assignmentsColumn } from "@/components/tables/assignmentsColumn";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { SearchParams, UserRole } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

const AssignmentsListPage = async ({ searchParams }: SearchParams) => {
  const { page, ...queryParams } = await searchParams
  const p = page ? parseInt(page) : 1;

  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: UserRole })?.role;

  const query: Prisma.AssignmentWhereInput = {}

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

  const [data, count] = await prisma.$transaction([
    prisma.assignment.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
            class: { select: { name: true } }
          }
        }
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),

    prisma.assignment.count({ where: query }),
  ])

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <ListHeader title="All Assignments" role={role!} />
      <Table columns={assignmentsColumn} data={data} role={role!} />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AssignmentsListPage;
