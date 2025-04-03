"use client"

import { role } from "@/lib/data"
import { Class, Subject, Teacher } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import FormModal from "../FormModal"

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] }

export const teachersColumn: ColumnDef<TeacherList>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="hover:bg-transparent"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Info
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row: { original: data } }) => (
            <div className="flex items-center gap-4 p-2 min-w-[14rem]">
                <Image
                    src={data.img || '/noAvatar.png'}
                    alt={data.username}
                    width={40}
                    height={40}
                    className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                    <h3 className="font-semibold">{data.name} {data.surname}</h3>
                    <p className="text-xs text-gray-500">{data.email}</p>
                </div>
            </div>
        )
    },
    {
        accessorKey: "subjects",
        header: "Subjects",
        cell: ({ row: { original: { subjects } } }) => (
            <div>{subjects.map(subject => subject.name).join(',')}</div>
        )
    },
    {
        accessorKey: "classes",
        header: "Classes",
        cell: ({ row: { original: { classes } } }) => (
            <div>{classes.map(class_ => class_.name).join(',')}</div>
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
                    <Link href={`/list/teachers/${data.id}`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                            <Image src="/view.svg" alt="" width={16} height={16} />
                        </button>
                    </Link>
                    {role === "admin" && (
                        <FormModal table="student" type="delete" id={data.id} />
                    )}
                </div>
            )
        }
    },
]