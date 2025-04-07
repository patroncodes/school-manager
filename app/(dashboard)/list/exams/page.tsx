import ListHeader from "@/components/ListHeader";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { examsColumn } from "@/components/tables/examsColumn";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/serverUtils";
import { ITEMS_PER_PAGE } from "@/lib/settings";
import { SearchParams } from "@/types";
import { Prisma } from "@prisma/client";

const ExamsListPage = async ({ searchParams }: SearchParams) => {
  const { page, ...queryParams } = await searchParams
  const p = page ? parseInt(page) : 1;

  const { role, currentUserId } = await getCurrentUser()

  const query: Prisma.ExamWhereInput = {}

  query.lesson = {}

  // URL PARAMS CONDITION
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'classId':
            query.lesson.classId = parseInt(value)
            break;
          case 'teacherId':
            query.lesson.teacherId = value
            break;
          case 'search':
            query.lesson.subject = { name: { contains: value, mode: 'insensitive' } }
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS
  switch (role) {
    case 'admin':
      break;
    case 'teacher':
      query.lesson.teacherId = currentUserId!
      break;
    case 'student':
      query.lesson.class = {
        students: {
          some: { id: currentUserId! }
        }
      }
      break;
    case 'parent':
      query.lesson.class = {
        students: {
          some: { parentId: currentUserId! }
        }
      }
      break;

    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
            class: { select: { name: true } }
          }
        }
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),

    prisma.exam.count({ where: query })
  ])

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <ListHeader title="All Exams" role={role!} table="exam" />
      <Table columns={examsColumn} data={data} role={role!} />
      <Pagination count={count} page={p} />
    </div>
  );
};

export default ExamsListPage;
