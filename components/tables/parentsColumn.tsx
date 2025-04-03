"use client"

import { ColumnDef } from "@tanstack/react-table"
import FormModal from "../FormModal"

import { role } from "@/lib/data"
import { Parent, Student } from "@prisma/client"

type ParentsList = Parent & { students: Student[] }

export const parentsColumn: ColumnDef<ParentsList>[] = [
    {
        accessorKey: "surname",
        header: "Info",
        cell: ({ row: { original: data } }) => (
            <div className="flex flex-col p-1">
                <h3 className="font-semibold">{data.name} {data.surname}</h3>
                <p className="text-xs text-gray-500">{data.email}</p>
            </div>
        )
    },
    {
        accessorKey: "students",
        header: "Student Names",
        cell: ({ row: { original: { students } } }) => (
            <div>{students.map(student => student.name).join(',')}</div>
        )
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row: { original: data } }) => {
            return (
                <div className="flex items-center gap-2">
                    <FormModal table="parent" type="update" data={data} />
                    {role === "admin" && (
                        <FormModal table="parent" type="delete" id={data.id} />
                    )}
                </div>
            )
        }
    },
]
