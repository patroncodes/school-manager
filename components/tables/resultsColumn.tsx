"use client"

import { ColumnDef } from "@tanstack/react-table"
import FormModal from "../FormModal"

import { role } from "@/lib/data"

type ResultsList = {
    id: number;
    title: string;
    studentName: string;
    studentSurname: string;
    teacherName: string;
    teacherSurname: string;
    score: number;
    className: string;
    startTime: Date;
    endTime: Date;
    type: string;
} | null


export const resultsColumn: ColumnDef<ResultsList>[] = [
    {
        accessorKey: "title",
        header: 'Subject',
    },
    {
        accessorKey: "studentSurname",
        header: "Student",
        cell: ({ row: { original: data } }) => (
            <div>{data?.studentName} {data?.studentSurname}</div>
        )
    },
    {
        accessorKey: "teacher",
        header: "Teacher",
        cell: ({ row: { original: data } }) => (
            <div>{data?.teacherName} {data?.teacherSurname}</div>
        )
    },
    {
        accessorKey: "score",
        header: "Score",
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row: { original: data } }) => (
            <div className="capitalize">{data?.type}</div>
        )
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row: { original: data } }) => new Intl.DateTimeFormat("en-NG").format(data?.startTime)
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row: { original: data } }) => {
            return (
                <div className="flex items-center gap-2">
                    <FormModal table="parent" type="update" data={data} />
                    {role === "admin" && (
                        <FormModal table="parent" type="delete" id={data?.id} />
                    )}
                </div>
            )
        }
    },
]
