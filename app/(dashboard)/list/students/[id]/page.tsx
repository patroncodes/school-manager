import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import { InfoCard, SmallCard } from "@/components/Card";
import PerformanceChart from "@/components/PerformanceChart";
import prisma from "@/lib/prisma";
import { SearchParams } from "@/types";
import { Student } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";

const SingleStudentPage = async ({ params }: SearchParams) => {
  const { id } = await params

  const student: ({
    class: {
      id: number;
      name: string;
      _count: {
        lessons: number;
      };
    };
    parent: {
      id: string;
      name: string;
      surname: string;
    } | null;
  } & Student) | null
    = await prisma.student.findUnique({
      where: {
        id
      },
      include: {
        class: {
          select: { id: true, name: true, _count: { select: { lessons: true } } }
        },
        parent: { select: { id: true, name: true, surname: true } },
      }
    })

  if (!student) return notFound()

  const cards = [
    {
      value: `${student.class.name[0]}`,
      desc: "Grade",
      img: "/singleBranch.svg",
    },
    {
      value: `${student.class._count.lessons}`,
      desc: "Lessons",
      img: "/singleLesson.svg",
    },
    {
      value: student.class.name,
      desc: "Class",
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
            table="student"
            data={student}
          />
          <SmallCard cards={cards} id={id} />
        </div>

        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h2 className="text-lg font-semibold">Student&apos;s Schedule</h2>
          <BigCalendarContainer type="classId" id={student.class.id} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h2 className="text-lg font-semibold">Shortcuts</h2>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-lamaSkyLight" href={`/list/lessons?classId=${student.class.id}`}>
              Student&apos;s Lessons
            </Link>
            <Link className="p-3 rounded-md bg-lamaPurpleLight" href={`/list/teachers?classId=${student.class.id}`}>
              Student&apos;s Teachers
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href={`/list/exams?classId=${student.class.id}`}>
              Student&apos;s Exams
            </Link>
            <Link className="p-3 rounded-md bg-lamaSkyLight" href={`/list/assignments?classId=${student.class.id}`}>
              Student&apos;s Assignments
            </Link>
            <Link className="p-3 rounded-md bg-lamaYellowLight" href={`/list/results?studentId=${id}`}>
              Student&apos;s Results
            </Link>
          </div>
        </div>

        <PerformanceChart />

        <Announcements role="student" userId={id} />
      </div>
    </div>
  );
};

export default SingleStudentPage;
