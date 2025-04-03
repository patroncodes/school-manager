"use client"

import { ColumnDef } from "@tanstack/react-table"
import FormModal from "../FormModal"

import { role } from "@/lib/data"

type AssignmentsList = {
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
    startDate: Date;
    dueDate: Date;
    lessonId: number;
}

export const assignmentsColumn: ColumnDef<AssignmentsList>[] = [
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
        accessorKey: "startDate",
        header: "Start Date",
        cell: ({ row: { original: { startDate } } }) => new Intl.DateTimeFormat("en-NG").format(startDate)
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row: { original: data } }) => {
            return (
                <div className="flex items-center gap-2">
                    <FormModal table="assignment" type="update" data={data} />
                    {role === "admin" && (
                        <FormModal table="assignment" type="delete" id={data.id} />
                    )}
                </div>
            )
        }
    },
]
