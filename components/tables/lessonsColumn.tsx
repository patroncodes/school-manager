import { UserRole } from "@/types";
import FormModal from "../FormModal";
import { Lesson } from "@prisma/client";

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
    {
        accessor: "teacher",
        header: "Teacher",
        cell: (item: LessonsList) => <div>{item.teacher.name + " " + item.teacher.surname}</div>
    },
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
    ...(role === "admin"
        ? [
            {
                header: "Actions",
                accessor: "action",
                cell: (item: LessonsList) => (
                    <div>
                        <div className="flex items-center gap-2">
                            <FormModal table="lesson" type="update" data={item} />
                            <FormModal table="lesson" type="delete" id={item.id} />
                        </div>
                    </div>
                )
            },
        ]
        : []),
]