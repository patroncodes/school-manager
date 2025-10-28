import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/serverUtils";
import type { SearchParams } from "@/types";
import EventCalendar from "@/components/EventCalendar";
import { DataTable } from "@/components/tables/data-table";
import { staffAttendanceColumn } from "@/components/tables/staffAttendanceColumn";
import { endOfDay, startOfDay } from "date-fns";

const ClassAttendanceListPage = async ({ searchParams }: SearchParams) => {
  const { date } = await searchParams;

  const targetDate = date ? new Date(`${date}T08:12:00Z`) : new Date();

  const start = startOfDay(targetDate);
  const end = endOfDay(targetDate);

  const { accessLevel, schoolId } = await getCurrentUser();

  const data = await prisma.staff.findMany({
    where: {
      schoolId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      surname: true,
      attendances: {
        where: {
          schoolId,
          date: { gte: start, lte: end },
        },
        select: {
          clockInTime: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const formattedData = data.map((item) => ({
    ...item,
    date: targetDate,
  }));

  return (
    <div className="m-4 mt-0 flex-1 space-y-12 rounded-md bg-white p-4">
      <EventCalendar />

      <DataTable
        columns={staffAttendanceColumn}
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
