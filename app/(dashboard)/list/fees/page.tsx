import ListHeader from "@/components/ListHeader"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import { feesColumn } from "@/components/tables/feesColumn"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/serverUtils"
import { ITEMS_PER_PAGE } from "@/lib/settings"
import type { SearchParams } from "@/types"
import type { Class, Fee, Prisma, Student, Transaction } from "@prisma/client"
import dynamic from "next/dynamic"

export type FeeWithRelations = Fee & {
  transactions: Pick<Transaction, "id">[];
  student: Pick<Student, "name" | "surname"> | null;
  class: Pick<Class, "name"> | null
};


const PaymentVerification = dynamic(() => import("@/components/PaymentVerification"), {
  loading: () => <h1>Loading...</h1>
});

const FeesListPage = async ({ searchParams }: SearchParams) => {
  const { page, ...queryParams } = await searchParams
  const p = page ? Number.parseInt(page) : 1

  const { role, currentUserId } = await getCurrentUser()
  const students: string[] = []

  const query: Prisma.FeeWhereInput = {}

  // URL PARAMS CONDITION
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId":
            query.studentId = value
            break
          case "search":
            query.OR = [
              {
                student: {
                  name: { contains: value, mode: "insensitive" },
                },
              },
              {
                student: {
                  surname: { contains: value, mode: "insensitive" },
                },
              }
            ]
            break
          default:
            break
        }
      }
    }
  }

  // ROLE CONDITIONS
  switch (role) {
    case "admin":
      break
    case "parent":
      query.OR = [
        {
          student: {
            parentId: currentUserId!,
          },
        },
        {
          studentId: null,
          classId: null,
        },
        {
          class: {
            students: {
              some: {
                parentId: currentUserId!,
              },
            },
          },
        },
      ]
      break
    default:
      break
  }

  if (role === 'parent') {
    const parent = await prisma.parent.findUnique({
      where: { id: currentUserId! },
      select: { students: { select: { id: true } } }
    });

    const studentIds = parent!.students.map((s) => s.id);
    students.push(...studentIds)
  }


  const [data, count] = await prisma.$transaction([
    prisma.fee.findMany({
      where: query,
      include: {
        student: {
          select: {
            name: true,
            surname: true,
          },
        },
        class: {
          select: {
            name: true
          }
        },
        transactions: {
          where: { studentId: { in: students } },
          select: { id: true, reference: true }
        }
      },
      orderBy: [{ createdAt: "desc" }],
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (p - 1),
    }),

    prisma.fee.count({ where: query }),
  ])

  const updatedFees = (data as FeeWithRelations[]).map(fee => ({
    ...fee,
    hasPaid: fee.transactions.length > 0,
  }))

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <ListHeader title="Certified Fees" role={role!} table="fee" />
      <Table columns={feesColumn} data={updatedFees} role={role!} />
      <Pagination count={count} page={p} />

      {queryParams.reference && (
        <PaymentVerification reference={queryParams.reference} userRole={role!} />
      )}
    </div>
  )
}

export default FeesListPage
