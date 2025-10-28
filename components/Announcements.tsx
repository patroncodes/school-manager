import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { RoleAccessLevel } from "@/types";
import Link from "next/link";

interface AnnouncementsProps {
  schoolId: string;

  // Logged-in user's announcements
  accessLevel?: RoleAccessLevel;
  userId?: string;

  // Class-specific announcements
  classId?: string;
}

const Announcements = async ({
  accessLevel,
  userId,
  schoolId,
  classId,
}: AnnouncementsProps) => {
  const roleConditions = {
    teacher: {
      OR: [
        { formTeacher: { clerkUserId: userId! } },
        { classTeacherId: { clerkUserId: userId! } }
      ]
    },
    student: { students: { some: { clerkUserId: userId! } } },
    parent: {
      is: {
        students: {
          some: {
            parentStudents: {
              some: {
                parent: {
                  clerkUserId: userId!
                }
              },
            },
          },
        },
      },
    },
  };

  const data = await prisma.announcement.findMany({
    where: {
      schoolId,
      ...(accessLevel
        ? accessLevel !== "manager" && {
          OR: [
            { classId: null },
            {
              class:
                roleConditions[accessLevel as keyof typeof roleConditions] || {},
            },
          ],
        }
        : {
          classId: classId,
        }),
    },
    take: 3,
    orderBy: { draftedAt: "desc" },
  });

  return (
    <div className="rounded-md bg-white p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <Link href="/list/announcements" className="text-xs text-gray-400">
          {" "}
          View All
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {data.slice(0, 3).map((announcement, index) => (
          <div
            key={announcement.id}
            className={cn("rounded-md bg-lamaSkyLight p-4", {
              "odd:bg-lamaSkyLight": index === 0,
              "odd:bg-lamaPurpleLight": index === 1,
              "odd:bg-lamaYellowLight": index === 2,
            })}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{announcement.title}</h2>
              <span className="rounded-md bg-white px-2 py-1 text-xs text-gray-400">
                {new Intl.DateTimeFormat("en-NG").format(announcement.publishedAt!)}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-400">{announcement.content}</p>
          </div>
        ))}

        {data.length === 0 && (
          <div className="flex-center h-16 text-sm font-light text-gray-600">
            No announcement found
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
