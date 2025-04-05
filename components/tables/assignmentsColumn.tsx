import FormModal from "../FormModal";
import { Assignment, Class, Subject, Teacher } from "@prisma/client";

type AssignmentsList = Assignment & {
    lesson: {
        subject: Subject;
        class: Class;
        teacher: Teacher;
    };
};

export const assignmentsColumn = (role: string) => [
    {
        accessor: "subject",
        header: "Subject",
        cell: (item: AssignmentsList) => <span>{item.lesson.subject.name}</span>
    },
    {
        accessor: "class",
        header: "Class",
        cell: (item: AssignmentsList) => <span>{item.lesson.class.name}</span>
    },
    {
        accessor: "teacher",
        header: "Teacher",
        cell: (item: AssignmentsList) => <span>{item.lesson.teacher.name + " " + item.lesson.teacher.surname}</span>
    },
    {
        accessor: "startDate",
        header: "Start Date",
        cell: (item: AssignmentsList) => <span>{new Intl.DateTimeFormat("en-NG").format(item.startDate)}</span>
    },
    ...(role === "admin"
        ? [
            {
                header: "Actions",
                accessor: "action",
                cell: (item: AssignmentsList) => (
                    <div>
                        <div className="flex items-center gap-2">
                            <FormModal table="assignment" type="update" data={item} />
                            <FormModal table="assignment" type="delete" id={item.id} />
                        </div>
                    </div>
                )
            },
        ]
        : []),
]
