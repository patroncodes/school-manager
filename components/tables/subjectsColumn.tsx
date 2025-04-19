import { UserRole } from "@/types"
import { Subject, Teacher } from "@prisma/client"
import FormContainer from "../FormContainer"

type SubjectsList = Subject & { teachers: Teacher[] }

export const subjectsColumn = (role: UserRole) => [
    {
        accessor: "name",
        header: 'Subject',
        cell: (item: SubjectsList) => <span>{item.name}</span>
    },
    {
        accessor: "teachers",
        header: "Teachers",
        cell: (item: SubjectsList) => <span>{item.teachers.map(teacher => teacher.name).join(',')}</span>
    },
    ...(role === "admin"
        ? [
            {
                header: "Actions",
                accessor: "action",
                cell: (item: SubjectsList) => (
                    <div>
                        <div className="flex items-center gap-2">
                            <FormContainer table="subject" type="update" data={item} />
                            <FormContainer table="subject" type="delete" id={item?.id} />
                        </div>
                    </div>
                )
            },
        ]
        : []),
]
