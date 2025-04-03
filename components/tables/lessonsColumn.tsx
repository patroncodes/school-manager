"use client"

import { ColumnDef } from "@tanstack/react-table"
import FormModal from "../FormModal"

import { role } from "@/lib/data"
import { formatTimeRange } from "@/lib/utils"
import { Lesson } from "@prisma/client"

type LessonsList = Lesson &
{
    teacher: { surname: string; name: string };
    subject: { name: string; };
    class: { name: string }
}

export const lessonsColumn: ColumnDef<LessonsList>[] = [
    {
        accessorFn: (row) => row.subject.name,
        header: "Subject",
    },
    {
        accessorFn: (row) => `${row.teacher.name} ${row.teacher.surname}`,
        header: "Teacher",
    },
    {
        accessorKey: "class",
        header: "Class",
        cell: ({ row: { original: data } }) => <div>{data.class.name}</div>
    },
    {
        accessorKey: "startTime",
        header: "Date",
        cell: ({ row: { original: data } }) => (
            <div>{formatTimeRange(data.startTime, data.endTime)}</div>
        )
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row: { original: data } }) => {
            return (
                <div className="flex items-center gap-2">
                    <FormModal table="lesson" type="update" data={data} />
                    {role === "admin" && (
                        <FormModal table="lesson" type="delete" id={data.id} />
                    )}
                </div>
            )
        }
    },
]