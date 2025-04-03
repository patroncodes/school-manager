"use client"

import { ColumnDef } from "@tanstack/react-table"
import FormModal from "../FormModal"

import { role } from "@/lib/data"
import { Subject, Teacher } from "@prisma/client"
import { ArrowUpDown } from "lucide-react"
import { Button } from "../ui/button"

type SubjectsList = Subject & { teachers: Teacher[] }

export const subjectsColumn: ColumnDef<SubjectsList>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="hover:bg-transparent"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Subject
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row: { original: data } }) => (
            <div className="flex items-center p-2">
                {data.name}
            </div>
        )
    },
    {
        accessorKey: "teachers",
        header: "Teachers",
        cell: ({ row: { original: { teachers } } }) => (
            <div>{teachers.map(teacher => teacher.name).join(',')}</div>
        )
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row: { original: data } }) => {
            return (
                <div className="flex items-center gap-2">
                    <FormModal table="subject" type="update" data={data} />
                    {role === "admin" && (
                        <FormModal table="subject" type="delete" id={data.id} />
                    )}
                </div>
            )
        }
    },
]
