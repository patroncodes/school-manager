"use client"

import { ColumnDef } from "@tanstack/react-table"
import FormModal from "../FormModal"

import { role } from "@/lib/data"
import { formatTimeRange } from "@/lib/utils"

type ExamsList = {
    lesson: {
        subject: {
            name: string;
        };
        class: {
            name: string;
        };
        teacher: {
            name: string;
            surname: string;
        };
    };
} & {
    id: number;
    title: string;
    lessonId: number;
    startTime: Date;
    endTime: Date;
}


export const examsColumn: ColumnDef<ExamsList>[] = [
    {
        accessorKey: "subject",
        header: "Subject",
        cell: ({ row: { original: { lesson } } }) => lesson.subject.name
    },
    {
        accessorKey: "class",
        header: "Class",
        cell: ({ row: { original: { lesson } } }) => lesson.class.name
    },
    {
        accessorKey: "teacher",
        header: "Teacher",
        cell: ({ row: { original: { lesson } } }) =>
            `${lesson.teacher.name + " " + lesson.teacher.surname}`
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row: { original: { startTime, endTime } } }) => formatTimeRange(startTime, endTime)
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row: { original: data } }) => {
            return (
                <div className="flex items-center gap-2">
                    <FormModal table="exam" type="update" data={data} />
                    {role === "admin" && (
                        <FormModal table="exam" type="delete" id={data.id} />
                    )}
                </div>
            )
        }
    },
]
