import { getCurrentUser } from "@/lib/serverUtils";
import { assignmentsColumn } from "@/components/tables/assignmentsColumn";
import prisma from "@/lib/prisma";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";
import { DataTable } from "@/components/tables/data-table";
import { getTerms } from "@/lib/actions/general";

const AssignmentsListPage = async ({ searchParams }: SearchParams) => {
  const { term, ...queryParams } = await searchParams;

  const query: Prisma.AssignmentWhereInput = {};

  const terms = await getTerms();

  const { accessLevel, currentUserId, schoolId } = await getCurrentUser();

  // URL PARAMS CONDITION
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.classId = value;
            break;
          case "teacherId":
            query.class = {
              OR: [{ formTeacherId: value }, { classTeacherId: value }],
            };
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITION
  switch (accessLevel) {
    case "manager":
      break;
    case "teacher":
      query.class = {
        OR: [
          { formTeacherId: currentUserId! },
          { classTeacherId: currentUserId! },
        ],
      };
      break;
    case "student":
      query.class = { students: { some: { id: currentUserId! } } };
      break;
    case "parent":
      query.class = {
        students: {
          some: { parentStudents: { some: { parentId: currentUserId! } } },
        },
      };
      break;
    default:
      break;
  }

  const data = await prisma.assignment.findMany({
    where: {
      schoolId,
      ...(term
        ? { termId: term }
        : {
            term: {
              isCurrent: true,
            },
          }),
      ...query,
    },
    include: {
      subject: {
        select: {
          name: true,
        },
      },
      class: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      <DataTable
        columns={assignmentsColumn}
        data={data}
        accessLevel={accessLevel!}
        title="All Assignments"
        termFilter={{
          terms,
          selectedTermId: term,
        }}
      />
    </div>
  );
};

export default AssignmentsListPage;
