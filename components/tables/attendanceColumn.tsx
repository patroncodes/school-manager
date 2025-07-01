import { UserRole } from "@/types";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Eye } from "lucide-react";
import { Button } from "../ui/button";

type AttendanceList = {
    id: number;
    name: string;
    startTime: Date;
    class: { name: string, _count: { students: number } };
    subject: { name: string };
    teacher: { name: string, surname: string };
    _count: { attendances: number }
} | null


export const attendanceColumn = (role: UserRole) => [
    {
        accessor: "lesson",
        header: "Lesson",
        cell: (item: AttendanceList) => <div>{item?.name}</div>
    },
    {
        accessor: "subject",
        header: "Subject",
        cell: (item: AttendanceList) => <div>{item?.subject.name}</div>
    },
    ...(role !== 'teacher' ? [{
        accessor: "teacher",
        header: "Teacher",
        cell: (item: AttendanceList) => <div>{item?.teacher.name} {item?.teacher.surname}</div>
    }] : []),
    {
        accessor: "date",
        header: "Date",
        cell: (item: AttendanceList) => <div>{new Intl.DateTimeFormat("en-NG").format(item?.startTime)}</div>
    },
    {
        accessor: "class",
        header: "Class",
        cell: (item: AttendanceList) => <div>{item?.class.name}</div>
    },
    {
        accessor: "present",
        header: "Status",
        cell: (item: AttendanceList) => (
            <Badge variant="secondary" className="text-xs">
                {`${item?._count.attendances} / ${item?.class._count.students}`} present
            </Badge>
        )
    },
    ...(role === "admin" || role === 'teacher'
        ? [
            {
                header: "Actions",
                accessor: "action",
                cell: (item: AttendanceList) => (
                    <Button
                        className={`w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky hover:bg-lamaSky/80`}
                        asChild
                    >
                        <Link href={`/list/lessons/${item?.id}`}>
                            <Eye color="#000" />
                        </Link>
                    </Button>
                )
            },
        ]
        : []),
]
