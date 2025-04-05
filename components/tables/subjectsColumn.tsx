import FormModal from "../FormModal"
import { Subject, Teacher } from "@prisma/client"

type SubjectsList = Subject & { teachers: Teacher[] }

export const subjectsColumn = (role: string) => [
    {
        accessorKey: "name",
        header: 'Subject',
        cell: (item: SubjectsList) => <div className="flex items-center p-2">{item.name}</div>
    },
    {
        accessorKey: "teachers",
        header: "Teachers",
        cell: (item: SubjectsList) => <div>{item.teachers.map(teacher => teacher.name).join(',')}</div>
    },
    ...(role === "admin"
        ? [
            {
                header: "Actions",
                accessor: "action",
                cell: (item: SubjectsList) => (
                    <div>
                        <div className="flex items-center gap-2">
                            <FormModal table="subject" type="update" data={item} />
                            <FormModal table="subject" type="delete" id={item?.id} />
                        </div>
                    </div>
                )
            },
        ]
        : []),
]
