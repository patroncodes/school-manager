import AttendanceMarker from "@/components/AttendanceMarker";
import { SearchParams } from "@/types";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/serverUtils";
import { redirect } from "next/navigation";
import { endOfDay, format, startOfDay } from "date-fns";

const Page = async ({ params, searchParams }: SearchParams) => {
  const { classId } = await params;
  const { date } = await searchParams;
  const { schoolId } = await getCurrentUser();

  const targetDate = date ? new Date(`${date}T08:12:00Z`) : new Date();

  const start = startOfDay(targetDate);
  const end = endOfDay(targetDate);

  const data = await prisma.class.findUnique({
    where: {
      schoolId,
      id: classId,
    },
    select: {
      name: true,
      attendances: {
        where: {
          schoolId,
          date: { gte: start, lte: end },
        },
        select: {
          status: true,
          studentId: true,
          updatedAt: true,
        },
      },
      students: {
        select: {
          id: true,
          name: true,
          surname: true,
        },
      },
    },
  });

  if (!data) redirect("/list/attendance/class");

  const lastUpdated = data.attendances[0].updatedAt;

  return (
    <div className="m-4 mt-0 flex-1 space-y-7 rounded-md bg-white p-4">
      <h1 className="text-center text-lg font-semibold">
        Attendance for {date}
      </h1>
      <div>
        {lastUpdated && (
          <p className="pr-2 text-right text-sm md:text-base">
            Updated: <span>{format(lastUpdated, "PP - p")}</span>
          </p>
        )}
        <AttendanceMarker
          classId={classId}
          date={start}
          students={data.students}
          attendanceState={data.attendances}
        />
      </div>
    </div>
  );
};
export default Page;
