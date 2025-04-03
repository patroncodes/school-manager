import { assignmentsColumn } from "@/components/tables/assignmentsColumn";
import { DataTable } from "@/components/ui/data-table";
import prisma from "@/lib/prisma";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";

const AssignmentsListPage = async ({ searchParams }: SearchParams) => {
  const { ...queryParams } = await searchParams

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

  const assignments = await prisma.assignment.findMany({
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
      <DataTable tableFor="assignment" columns={assignmentsColumn} data={assignments} filterBy="subject" />
    </div>
  );
};

export default AssignmentsListPage;
