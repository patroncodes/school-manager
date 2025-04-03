"use client"

import { ColumnDef } from "@tanstack/react-table"
import FormModal from "../FormModal"

import { role } from "@/lib/data"
import { Class, Teacher } from "@prisma/client"
import { ArrowUpDown } from "lucide-react"
import { Button } from "../ui/button"

type ClassesList = Class & { supervisor: Teacher | null }

export const classesColumn: ColumnDef<ClassesList>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="hover:bg-transparent"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Class
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: "capacity",
        header: "Capacity",
    },
    {
        accessorKey: "gradeId",
        header: "Grade",
        cell: ({ row: { original: { name } } }) => (
            <div>{name[0]}</div>
        )
    },
    {
        accessorKey: "supervisor",
        header: "Supervisor",
        cell: ({ row: { original: data } }) => (
            <div>{data?.supervisor?.name} {data?.supervisor?.surname}</div>
        ),
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row: { original: data } }) => {
            return (
                <div className="flex items-center gap-2">
                    <FormModal table="class" type="update" data={data} />
                    {role === "admin" && (
                        <FormModal table="class" type="delete" id={data.id} />
                    )}
                </div>
            )
        }
    },
]
