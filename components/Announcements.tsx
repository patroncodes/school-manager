import prisma from "@/lib/prisma";
import { UserRole } from "@/types";
import Link from "next/link";

const Announcements = async ({ role, userId }: { role: UserRole; userId: string }) => {
  const roleConditions = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },
    parent: { students: { some: { parentId: userId! } } },
  }

  const data = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: 'desc' },
    where: {
      ...(role !== 'admin' && {
        OR: [
          { classId: null },
          { class: roleConditions[role as keyof typeof roleConditions] || {} },
        ]
      })
    },
  })

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <Link href='/list/announcements' className="text-xs text-gray-400"> View All</Link>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {data[0] && <div className="bg-lamaSkyLight p-4 rounded-md">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">{data[0].title}</h2>
            <span className="text-gray-400 text-xs bg-white px-2 py-1 rounded-md">
              {new Intl.DateTimeFormat("en-NG").format(data[0].date)}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {data[0].description}
          </p>
        </div>}

        {data[1] && <div className="bg-lamaPurpleLight p-4 rounded-md">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">{data[1]?.title}</h2>
            <span className="text-gray-400 text-xs bg-white px-2 py-1 rounded-md">
              {new Intl.DateTimeFormat("en-NG").format(data[1]?.date)}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {data[1]?.description}
          </p>
        </div>}

        {data[2] && <div className="bg-lamaYellowLight p-4 rounded-md">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">{data[2]?.title}</h2>
            <span className="text-gray-400 text-xs bg-white px-2 py-1 rounded-md">
              {new Intl.DateTimeFormat("en-NG").format(data[2]?.date)}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {data[2]?.description}
          </p>
        </div>}
      </div>
    </div>
  );
};

export default Announcements;
