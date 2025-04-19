import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import { InfoCard, SmallCard } from "@/components/Card";
import PerformanceChart from "@/components/PerformanceChart";
import prisma from "@/lib/prisma";
import { SearchParams } from "@/types";
import { Teacher } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

const SingleTeacherPage = async ({ params }: SearchParams) => {
  const { id } = await params

  const teacher: (Teacher & { _count: { subjects: number; lessons: number, classes: number } }) | null = await prisma.teacher.findUnique({
    where: {
      id
    },
    include: {
      _count: {
        select: {
          subjects: true,
          lessons: true,
          classes: true
        }
      }
    }
  })

  if (!teacher) return notFound()

  const smallCards = [
    {
      value: "90%",
      desc: "Attendance",
      img: "/singleAttendance.svg",
    },
    {
      value: `${teacher._count.subjects}`,
      desc: "Subjects",
      img: "/singleBranch.svg",
    },
    {
      value: `${teacher._count.lessons}`,
      desc: "Lessons",
      img: "/singleLesson.svg",
    },
    {
      value: `${teacher._count.classes}`,
      desc: "Classes",
      img: "/singleClass.svg",
    },
  ];

  return (
    <div className="flex-1 p-4 flex flex-col xl:flex-row gap-4">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          <InfoCard
            table="teacher"
            data={teacher}
          />
          <SmallCard cards={smallCards} />
        </div>

        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h2 className="text-lg font-semibold">Teacher&apos;s Schedule</h2>
          <BigCalendarContainer type="teacherId" id={id} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h2 className="text-lg font-semibold">Shortcuts</h2>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-lamaSkyLight" href={`/list/classes?supervisorId=${id}`}>
              Teacher&apos;s Classes
            </Link>
            <Link className="p-3 rounded-md bg-lamaPurpleLight" href={`/list/students?teacherId=${id}`}>
              Teacher&apos;s Students
            </Link>
            <Link className="p-3 rounded-md bg-lamaYellowLight" href={`/list/lessons?teacherId=${id}`}>
              Teacher&apos;s Lessons
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href={`/list/exams?teacherId=${id}`}>
              Teacher&apos;s Exams
            </Link>
            <Link className="p-3 rounded-md bg-lamaSkyLight" href={`/list/assignments?teacherId=${id}`}>
              Teacher&apos;s Assignments
            </Link>
          </div>
        </div>

        <PerformanceChart />

        <Announcements role="teacher" userId={id} />
      </div>
    </div>
  );
};

export default SingleTeacherPage;
