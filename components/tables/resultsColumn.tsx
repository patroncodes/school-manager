import { UserRole } from "@/types";
import FormModal from "../FormModal"

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


export const resultsColumn = (role: UserRole) => [
    {
        accessor: "title",
        header: 'Subject',
        cell: (item: ResultsList) => <div>{item?.title}</div>
    },
    {
        accessor: "student",
        header: "Student",
        cell: (item: ResultsList) => <div>{item?.studentName} {item?.studentSurname}</div>
    },
    {
        accessor: "teacher",
        header: "Teacher",
        cell: (item: ResultsList) => <div>{item?.teacherName} {item?.teacherSurname}</div>
    },
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
                            <FormModal table="result" type="update" data={item} />
                            <FormModal table="result" type="delete" id={item?.id} />
                        </div>
                    </div>
                )
            },
        ]
        : []),
]
