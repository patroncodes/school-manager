import ListHeader from "@/components/ListHeader"
import Pagination from "@/components/Pagination"
import Table from "@/components/Table"
import { attendanceColumn } from "@/components/tables/attendanceColumn"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/serverUtils"
import { ITEMS_PER_PAGE } from "@/lib/settings"
import type { SearchParams } from "@/types"
import type { Prisma } from "@prisma/client"

const AttendanceListPage = async ({ searchParams }: SearchParams) => {
    const { page, ...queryParams } = await searchParams
    const p = page ? Number.parseInt(page) : 1

    const { role, currentUserId } = await getCurrentUser()

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
        default:
            break;
    }

    query.startTime = { lt: new Date() }

    const [data, count] = await prisma.$transaction([
        prisma.lesson.findMany({
            where: query,
            select: {
                id: true,
                name: true,
                startTime: true,
                class: {
                    select: { name: true, _count: { select: { students: true } } }
                },
                teacher: {
                    select: { name: true, surname: true }
                },
                subject: {
                    select: { name: true }
                },
                _count: {
                    select: { attendances: { where: { present: true } } }
                },
            },
            orderBy: { startTime: 'desc' },
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1),
        }),

        prisma.lesson.count({ where: query }),
    ])

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <ListHeader title="Attendance Records" role={role!} table="attendance" />
            <Table columns={attendanceColumn} data={data} role={role!} />
            <Pagination count={count} page={p} />
        </div>
    )
}

export default AttendanceListPage
