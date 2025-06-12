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

    const query: Prisma.AttendanceWhereInput = {}

    // Initialize nested objects
    query.lesson = {}
    query.student = {}

    // URL PARAMS CONDITION
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "classId":
                        query.lesson.classId = Number.parseInt(value)
                        break
                    case "teacherId":
                        query.lesson.teacherId = value
                        break
                    case "studentId":
                        query.studentId = value
                        break
                    case "subjectId":
                        query.lesson.subjectId = Number.parseInt(value)
                        break
                    case "present":
                        query.present = value === "true"
                        break
                    case "date":
                        // Filter by specific date
                        const searchDate = new Date(value)
                        const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0))
                        const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999))
                        query.date = {
                            gte: startOfDay,
                            lte: endOfDay,
                        }
                        break
                    case "search":
                        // Search by student name or lesson name
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
                            },
                            {
                                lesson: {
                                    name: { contains: value, mode: "insensitive" },
                                },
                            },
                            {
                                lesson: {
                                    subject: {
                                        name: { contains: value, mode: "insensitive" },
                                    },
                                },
                            },
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
        case "teacher":
            query.lesson.teacherId = currentUserId!
            break
        case "student":
            query.studentId = currentUserId!
            break
        case "parent":
            query.student = {
                parentId: currentUserId!,
            }
            break
        default:
            break
    }

    const [data, count] = await prisma.$transaction([
        prisma.attendance.findMany({
            where: query,
            include: {
                student: {
                    select: {
                        name: true,
                        surname: true,
                    },
                },
                lesson: {
                    select: {
                        id: true,
                        subject: {
                            select: {
                                name: true,
                            },
                        },
                        teacher: {
                            select: {
                                name: true,
                                surname: true,
                            },
                        },
                        class: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: [{ date: "desc" }, { lesson: { startTime: "desc" } }],
            take: ITEMS_PER_PAGE,
            skip: ITEMS_PER_PAGE * (p - 1),
        }),

        prisma.attendance.count({ where: query }),
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
