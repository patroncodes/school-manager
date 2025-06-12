import { UserRole } from "@/types";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Eye } from "lucide-react";

type AttendanceList = {
    id: number;
    date: Date;
    present: boolean;
    student: {
        name: string;
        surname: string;
    };
    lesson: {
        id: number;
        subject: { name: string }
        teacher: { name: string, surname: string }
        class: { name: string }
    }
} | null


export const attendanceColumn = (role: UserRole) => [
    ...(role !== 'student' ? [
        {
            accessor: "student",
            header: 'Student',
            cell: (item: AttendanceList) => <div>{item?.student.name} {item?.student.surname}</div>
        },
    ] : []),
    {
        accessor: "lesson",
        header: "Lesson",
        cell: (item: AttendanceList) => <div>{item?.lesson.subject.name}</div>
    },
    ...(role !== 'teacher' ? [{
        accessor: "teacher",
        header: "Teacher",
        cell: (item: AttendanceList) => <div>{item?.lesson.teacher.name} {item?.lesson.teacher.surname}</div>
    }] : []),
    {
        accessor: "date",
        header: "Date",
        cell: (item: AttendanceList) => <div>{new Intl.DateTimeFormat("en-NG").format(item?.date)}</div>
    },
    {
        accessor: "present",
        header: "Status",
        cell: (item: AttendanceList) => (
            <Badge variant={item?.present ? "default" : "destructive"} className="text-xs">
                {item?.present ? "Present" : "Absent"}
            </Badge>
        )
    },
    ...(role === "admin"
        ? [
            {
                header: "Actions",
                accessor: "action",
                cell: (item: AttendanceList) => (
                    <Link href={`/list/lessons/${item?.lesson.id}`}>
                        <Eye />
                    </Link>
                )
            },
        ]
        : []),
]
