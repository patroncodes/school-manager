import prisma from "@/lib/prisma";
import { RoleAccessLevel } from "@/types";
import { Prisma } from "@prisma/client";
import { subDays } from "date-fns";

const Notifications = async ({
  accessLevel,
  userId,
}: {
  accessLevel: RoleAccessLevel;
  userId: string;
}) => {
  const sevenDaysAgo = subDays(new Date(), 7)

  const query: Prisma.AnnouncementWhereInput = {};

  const roleConditions = {
    teacher: {
      OR: [
        { class: { formTeacherId: userId } },
        { class: { classTeacherId: userId } }
      ]
    },
    student: { class: { students: { some: { id: userId } } } },
    parent: {
      class: {
        students: { some: { parentStudents: { some: { parentId: userId } } } },
      },
    },
  };

  query.OR = [
    { classId: null },
    roleConditions[accessLevel as keyof typeof roleConditions] || {},
  ];

  const announcements = await prisma.announcement.count({
    where: {
      ...query,
      draftedAt: { gte: sevenDaysAgo },
    },
  });

  return (
    <div className="absolute -top-3 -right-3 flex-center h-5 w-5 rounded-full bg-purple-500 text-xs text-white">
      {announcements}
    </div>
  );
};

export default Notifications;
