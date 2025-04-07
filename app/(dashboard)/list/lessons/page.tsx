import ListHeader from "@/components/ListHeader";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { lessonsColumn } from "@/components/tables/lessonsColumn";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/serverUtils";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";

const LessonsListPage = async ({ searchParams }: SearchParams) => {
  const { page, ...queryParams } = await searchParams
  const p = page ? parseInt(page) : 1;

  const { currentUserId, role } = await getCurrentUser()
  const query: Prisma.LessonWhereInput = {}

  // URL PARAMS CONDITION
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'teacherId':
            query.teacherId = value
            break;
          case 'classId':
            query.classId = parseInt(value)
            break;
          case 'search':
            query.OR = [
              { subject: { name: { contains: value, mode: 'insensitive' } } },
              {
                teacher: {
                  name: { contains: value, mode: 'insensitive' },
                  surname: { contains: value, mode: 'insensitive' }
                }
              }
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  switch (role) {
    case 'admin':
      break;
    case 'teacher':
      query.teacherId = currentUserId!
      break;
    case 'student':
      query.class = {
        students: { some: { id: currentUserId! } }
      }
    case 'parent':
      query.class = {
        students: { some: { parentId: currentUserId! } }
      }
    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.lesson.findMany({
      where: query,
      include: {
        teacher: { select: { name: true, surname: true } },
        subject: { select: { name: true } },
        class: { select: { name: true } }
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),

    prisma.lesson.count({ where: query }),
  ])

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <ListHeader role={role!} title="All Lessons" table="lesson" />
      <Table columns={lessonsColumn} data={data} role={role!} />
      <Pagination count={count} page={p} />
    </div>
  );
};

export default LessonsListPage;
