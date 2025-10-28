import ListHeader from "@/components/ListHeader";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { announcementsColumn } from "@/components/tables/announcementsColumn";
import { prismaForSchool } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/serverUtils";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";

const AnnouncementsListPage = async ({ searchParams }: SearchParams) => {
  const { page, ...queryParams } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const { role, currentUserId, schoolId } = await getCurrentUser();
  const prisma = prismaForSchool(schoolId);

  const query: Prisma.AnnouncementWhereInput = {};

  // URL PARAMS CONDITION
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.title = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  const roleConditions = {
    teacher: {
      is: {
        supervisorId: currentUserId!,
      },
    },
    student: { students: { some: { id: currentUserId! } } },
    parent: {
      is: {
        students: {
          some: {
            parentStudent: {
              some: {
                parentId: currentUserId!,
              },
            },
          },
        },
      },
    },
  };

  if (role !== "admin") {
    query.OR = [
      { classId: null },
      { class: roleConditions[role as keyof typeof roleConditions] },
    ];
  }

  const [data, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: {
        ...(role !== "admin" && {
          OR: [
            { classId: null },
            {
              class: roleConditions[role as keyof typeof roleConditions] || {},
            },
          ],
        }),
      },
      include: {
        class: { select: { arm: true } },
      },
      orderBy: { createdAt: "desc" },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),

    prisma.announcement.count({ where: query }),
  ]);
  return (
    <div className="m-4 mt-0 flex-1 rounded-md bg-white p-4">
      <ListHeader title="Announcements" role={role!} table="announcement" />
      <Table columns={announcementsColumn} data={data} role={role!} />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AnnouncementsListPage;
