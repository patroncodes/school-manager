import ListHeader from "@/components/ListHeader"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import { transactionsColumn } from "@/components/tables/transactionsColumn"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/serverUtils"
import { ITEMS_PER_PAGE } from "@/lib/settings"
import type { SearchParams } from "@/types"
import type { Prisma } from "@prisma/client"

const TransactionsListPage = async ({ searchParams }: SearchParams) => {
    const { page, ...queryParams } = await searchParams
    const p = page ? Number.parseInt(page) : 1

    const { role } = await getCurrentUser()

    const query: Prisma.TransactionWhereInput = {}

    // URL PARAMS CONDITION
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
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

    const [data, count] = await prisma.$transaction([
        prisma.transaction.findMany({
            where: query,
            include: {
                student: {
                    select: {
                        name: true,
                        surname: true,
                    },
                },
                fee: {
                    select: {
                        description: true,
                    }
                }
            },
            orderBy: [{ date: "desc" }],
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1),
        }),

        prisma.transaction.count({ where: query }),
    ])

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <ListHeader title="All Transactions" role={role!} table="transaction" />
            <Table columns={transactionsColumn} data={data} role={role!} />
            <Pagination count={count} page={p} />
        </div>
    )
}

export default TransactionsListPage
