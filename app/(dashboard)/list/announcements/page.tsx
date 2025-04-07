import ListHeader from "@/components/ListHeader";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { announcementsColumn } from "@/components/tables/announcementsColumn";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/serverUtils";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";

const AnnouncementsListPage = async ({ searchParams }: SearchParams) => {
  const { page, ...queryParams } = await searchParams
  const p = page ? parseInt(page) : 1;

  const { role, currentUserId } = await getCurrentUser()

  const query: Prisma.AnnouncementWhereInput = {}

  // URL PARAMS CONDITION
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'search':
            query.title = { contains: value, mode: 'insensitive' }
            break;
          default:
            break;
        }
      }
    }
  }

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { id: currentUserId! } } },
    parent: { students: { some: { parentId: currentUserId! } } },
  }

  query.OR = [
    { classId: null },
    { class: roleConditions[role as keyof typeof roleConditions] || {} },
  ]

  const [data, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: query,
      include: {
        class: { select: { name: true } }
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),

    prisma.announcement.count({ where: query })
  ])
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <ListHeader title="All Announcements" role={role!} table="announcement" />
      <Table columns={announcementsColumn} data={data} role={role!} />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AnnouncementsListPage;
