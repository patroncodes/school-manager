"use client"

import { ColumnDef } from "@tanstack/react-table"
import FormModal from "../FormModal"

import { role } from "@/lib/data"
import { Event } from "@prisma/client"

type EventsList = Event & { class: { name: string } | null }

export const eventsColumn: ColumnDef<EventsList>[] = [
    {
        accessorKey: "title",
        header: "Title"
    },
    {
        accessorFn: ({ class: className }) => className?.name || "-",
        header: "Class",
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row: { original: { startTime } } }) => new Intl.DateTimeFormat("en-NG").format(startTime)
    },
    {
        accessorKey: "startTime",
        header: "Start Time",
        cell: ({ row: { original: { startTime } } }) => startTime.toLocaleTimeString('en-NG', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
    },
    {
        accessorKey: "endTime",
        header: "End Time",
        cell: ({ row: { original: { endTime } } }) => endTime.toLocaleTimeString('en-NG', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
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
