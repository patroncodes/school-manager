import prisma from "@/lib/prisma";
import Image from "next/image";
import dynamic from "next/dynamic";

const AttendanceChart = dynamic(() => import("./AttendanceChart"), {
  loading: () => <h1>Loading...</h1>,
});

const AttendanceChartContainer = async ({ classId, studentId, schoolId }: { classId?: string, studentId?: string, schoolId: string }) => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = (dayOfWeek + 6) % 7;

  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceMonday);
  lastMonday.setHours(0, 0, 0, 0);

  const resData = await prisma.studentAttendance.findMany({
    where: {
      schoolId,
      date: { gte: lastMonday, lte: today },
      ...(classId ? { student: { classId } } : {}),
      ...(studentId ? { student: { id: studentId } } : {}),
    },
    select: {
      date: true,
      status: true,
    },
  });

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const attendanceMap: { [key: string]: { present: number; absent: number } } =
  {
    Mon: { present: 0, absent: 0 },
    Tue: { present: 0, absent: 0 },
    Wed: { present: 0, absent: 0 },
    Thu: { present: 0, absent: 0 },
    Fri: { present: 0, absent: 0 },
  };

  resData.forEach((item) => {
    const itemDate = new Date(item.date);
    const itemDay = itemDate.getDay();
    const dayIndex = itemDay === 0 ? 6 : itemDay - 1;
    const dayName = daysOfWeek[dayIndex];

    if (dayName in attendanceMap) {
      if (item.status === "PRESENT") {
        attendanceMap[dayName].present++;
      } else {
        attendanceMap[dayName].absent++;
      }
    }
  });

  const data = daysOfWeek.map((day) => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent,
  }));

  return (
    <div className="h-full w-full rounded-xl bg-white p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.svg" alt="more" width={20} height={20} />
      </div>

      <AttendanceChart data={data} />
    </div>
  );
};

export default AttendanceChartContainer;
