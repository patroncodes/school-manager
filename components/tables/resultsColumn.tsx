import { UserRole } from "@/types";
import FormContainer from "../FormContainer";

type ResultsList = {
    id: number;
    score: number;
    title: string;
    student: {
        id: string;
        name: string;
        surname: string;
    };
    teacher: {
        name: string;
        surname: string;
    };
    className: string;
    startTime: Date;
    endTime: Date;
    type: string;
    lessonId: number;
    testId: number;
} | null


export const resultsColumn = (role: UserRole) => [
    {
        accessor: "title",
        header: 'Subject',
        cell: (item: ResultsList) => <div>{item?.title}</div>
    },
    {
        accessor: "student",
        header: "Student",
        cell: (item: ResultsList) => <div>{item?.student.name} {item?.student.surname}</div>
    },
    ...(role === 'admin' ? [{
        accessor: "teacher",
        header: "Teacher",
        cell: (item: ResultsList) => <div>{item?.teacher.name} {item?.teacher.surname}</div>
    }] : []),
    {
        accessor: "score",
        header: "Score",
        cell: (item: ResultsList) => <div>{item?.score}</div>
    },
    {
        accessor: "type",
        header: "Type",
        cell: (item: ResultsList) => <div className="capitalize">{item?.type}</div>
    },
    {
        accessor: "date",
        header: "Date",
        cell: (item: ResultsList) => <div>{new Intl.DateTimeFormat("en-NG").format(item?.startTime)}</div>
    },
    ...(role === "admin" || role === "teacher"
        ? [
            {
                header: "Actions",
                accessor: "action",
                cell: (item: ResultsList) => (
                    <div>
                        <div className="flex items-center gap-2">
                            <FormContainer table="result" type="update" data={item} />
                            <FormContainer table="result" type="delete" id={item?.id} />
                        </div>
                    </div>
                )
            },
        ]
        : []),
]
