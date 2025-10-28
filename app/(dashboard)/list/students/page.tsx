import { DataTable } from "@/components/tables/data-table";
import { studentsColumn } from "@/components/tables/studentsColumn";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/serverUtils";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";

const StudentsListPage = async ({ searchParams }: SearchParams) => {
  const { ...queryParams } = await searchParams;

  const { accessLevel, schoolId } = await getCurrentUser();
  const query: Prisma.StudentWhereInput = {};

  // URL PARAMS CONDITION
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            query.class = {
              OR: [{ formTeacherId: value }, { classTeacherId: value }],
            };
            break;
          case "display":
            if (value === "enrolled") {
              query.activeState = { in: ["ACTIVE", "SUSPENDED"] };
            } else if (value === "formerly-enrolled") {
              query.activeState = { notIn: ["ACTIVE", "SUSPENDED"] };
            }
            break;
          default:
            break;
        }
      }
    }
  }

  const data = await prisma.student.findMany({
    where: {
      schoolId,
      activeState: { in: ["ACTIVE", "SUSPENDED"] },
      ...query,
    },
    include: {
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
    orderBy: {
      createdAt: "desc",
    },
  });

  const tableTitle =
    queryParams?.display === "formerly-enrolled"
      ? "Formerly Enrolled Students"
      : "Currently Enrolled Students";

  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      <DataTable
        title={tableTitle}
        columns={studentsColumn}
        data={data}
        accessLevel={accessLevel!}
      />
    </div>
  );
};

export default StudentsListPage;
