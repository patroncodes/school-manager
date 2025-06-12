import { UserRole } from "@/types";
import { Lesson } from "@prisma/client";
import { Eye } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const FormContainer = dynamic(() => import('../FormContainer'))

type LessonsList = Lesson &
{
    teacher: { surname: string; name: string };
    subject: { name: string; };
    class: { name: string }
}

export const lessonsColumn = (role: UserRole) => [
    {
        accessor: "subject",
        header: "Subject",
        cell: (item: LessonsList) => <div>{item.subject.name}</div>
    },
    ...(role === 'teacher'
        ? []
        : [
            {
                accessor: "teacher",
                header: "Teacher",
                cell: (item: LessonsList) => <div>{item.teacher.name + " " + item.teacher.surname}</div>
            }]),
    {
        accessor: "class",
        header: "Class",
        cell: (item: LessonsList) => <div>{item.class.name}</div>
    },
    {
        accessor: "startTime",
        header: "Date",
        cell: (item: LessonsList) => <div>
            <span>{item.day.slice(0, 3)}</span>,
            {new Intl.DateTimeFormat("en-NG").format(item.startTime)}
        </div>
    },
    ...(role === "admin" || role === 'teacher'
        ? [
            {
                header: "Actions",
                accessor: "action",
                cell: (item: LessonsList) => (
                    <div>
                        <div className="flex items-center gap-2">
                            <Link href={`/list/lessons/${item.id}`} className="bg-lamaPurple w-7 h-7 rounded-full flex-center p-1">
                                <Eye color="white" />
                            </Link>

                            {/* <FormContainer table="lesson" type="update" data={item} /> */}

                            {role === 'admin' && (
                                <FormContainer table="lesson" type="delete" id={item.id} />
                            )}
                        </div>
                    </div>
                )
            },
        ]
        : []),
]