import Announcements from "@/components/Announcements";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import { InfoCard, ParentInfoCard, SmallCard } from "@/components/Card";
import PerformanceChartContainer from "@/components/PerformanceChartContainer";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/serverUtils";
import { SearchParams } from "@/types";
import { AttendanceStatus, Parent, ParentStudentRelationship, Student } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

const SingleStudentPage = async ({ params }: SearchParams) => {
  const { id } = await params;
  const { schoolId, currentUserId } = await getCurrentUser();

  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceMonday);

  const student:
    | ({
      class: {
        id: string;
        name: string;
        grade: {
          id: string;
          name: string;
        };
      };
      parentStudents:
      | {
        relation: ParentStudentRelationship;
        parent: Parent;
      }[]
      | null;
      attendances: {
        date: Date;
        status: AttendanceStatus;
      }[];
    } & Student)
    | null = await prisma.student.findUnique({
      where: {
        id,
        schoolId
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            grade: { select: { id: true, name: true } },
          },
        },
        parentStudents: {
          select: {
            relation: true,
            parent: true,
          },
        },
        attendances: {
          where: { studentId: id, date: { gte: lastMonday } },
          select: { date: true, status: true },
        },
      },
    });

  if (!student) return notFound();

  const presentDays = student.attendances.filter((day) => day.status === "PRESENT").length;
  const percentage = Math.floor((presentDays / 5) * 100);

  const cards = [
    {
      value: `${percentage || "-"}%`,
      desc: "Attendance",
      img: "/singleAttendance.svg",
    },
    {
      value: `${student.class.grade.name}`,
      desc: "Grade",
      img: "/singleBranch.svg",
    },
    {
      value: student.class.name,
      desc: "Class",
      img: "/singleClass.svg",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="flex flex-col gap-4 lg:flex-row">
          <InfoCard table="student" data={student} />
          <SmallCard cards={cards} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex w-full flex-col gap-4 xl:w-1/3">
        <div className="rounded-md bg-white p-4">
          <h2 className="text-lg font-semibold">Shortcuts</h2>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
            <Link
              className="rounded-md bg-lamaPurpleLight p-3"
              href={`/list/teachers?classId=${student.class.id}`}
            >
              Student&apos;s Teachers
            </Link>
            <Link
              className="rounded-md bg-pink-50 p-3"
              href={`/list/exams?classId=${student.class.id}`}
            >
              Student&apos;s Exams
            </Link>
            <Link
              className="rounded-md bg-lamaSkyLight p-3"
              href={`/list/assignments?classId=${student.class.id}`}
            >
              Student&apos;s Assignments
            </Link>
            <Link
              className="rounded-md bg-lamaYellowLight p-3"
              href={`/list/results?studentId=${id}`}
            >
              Student&apos;s Results
            </Link>
            <div className="flex cursor-pointer items-center gap-2 rounded-md bg-lamaSkyLight p-3">
              <span>Pay Fees</span>
            </div>
          </div>
        </div>

        {student.parentStudents && (
          <ParentInfoCard data={student.parentStudents} />
        )}

        <PerformanceChartContainer schoolId={schoolId} studentId={id} />

        <AttendanceChartContainer studentId={id} />

        <Announcements accessLevel="student" userId={currentUserId!} schoolId={schoolId} />
      </div>
    </div>
  );
};

export default SingleStudentPage;
