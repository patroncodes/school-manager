import { attendanceColumn } from "@/components/tables/attendanceColumn";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/serverUtils";
import type { SearchParams } from "@/types";
import { DataTable } from "@/components/tables/data-table";
import EventCalendar from "@/components/EventCalendar";
import { endOfDay, startOfDay } from "date-fns";

const ClassAttendanceListPage = async ({ searchParams }: SearchParams) => {
  const { date, ...queryParams } = await searchParams;

  const targetDate = date ? new Date(`${date}T08:12:00Z`) : new Date();

  const start = startOfDay(targetDate);
  const end = endOfDay(targetDate);

  const { schoolId, accessLevel } = await getCurrentUser();
  let query;

  // URL PARAMS CONDITION
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            query = {};
            break;
          case "classId":
            query = {};
            break;
          default:
            break;
        }
      }
    }
  }

  switch (accessLevel) {
    case "manager":
    case "administration":
      break;
    case "teacher":
      query = {
        // class: {}
      };
      break;
    default:
      break;
  }

  const data = await prisma.class.findMany({
    where: {
      schoolId,
      ...query,
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          attendances: {
            where: {
              schoolId,
              date: { gte: start, lte: end },
              status: "PRESENT",
            },
          },
          students: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const formattedData = data.map((item) => ({
    ...item,
    date,
  }));

  return (
    <div className="m-4 mt-0 flex-1 space-y-12 rounded-md bg-white p-4">
      <EventCalendar />

      <DataTable
        columns={attendanceColumn}
        data={formattedData}
        accessLevel={accessLevel!}
        title={`Attendance Records for ${date}`}
        tableFor="attendance"
        filters={{ selectCount: false }}
      />
    </div>
  );
};

export default ClassAttendanceListPage;
