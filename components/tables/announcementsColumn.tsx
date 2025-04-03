"use client"

import { ColumnDef } from "@tanstack/react-table"
import FormModal from "../FormModal"
import { Announcement } from "@prisma/client"
import { role } from "@/lib/data"

type AnnouncementsList = Announcement & { class: { name: string } | null }


export const announcementsColumn: ColumnDef<AnnouncementsList>[] = [
    {
        accessorKey: "title",
        header: "Title"
    },
    {
        accessorKey: "description",
        header: "Description"
    },
    {
        accessorFn: ({ class: className }) => className?.name || "-",
        header: "Class",
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row: { original: { date } } }) => new Intl.DateTimeFormat("en-NG").format(date)
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
