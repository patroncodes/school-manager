import { UserRole } from "@/types";
import { Assignment, Class, Subject, Teacher } from "@prisma/client";
import FormContainer from "../FormContainer";

type AssignmentsList = Assignment & {
    lesson: {
        subject: Subject;
        class: Class;
        teacher: Teacher;
    };
};

export const assignmentsColumn = (role: UserRole) => [
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
    ...(role === "admin" || role === "teacher"
        ? [
            {
                header: "Actions",
                accessor: "action",
                cell: (item: AssignmentsList) => (
                    <div>
                        <div className="flex items-center gap-2">
                            <FormContainer table="assignment" type="update" data={item} />
                            <FormContainer table="assignment" type="delete" id={item.id} />
                        </div>
                    </div>
                )
            },
        ]
        : []),
]
