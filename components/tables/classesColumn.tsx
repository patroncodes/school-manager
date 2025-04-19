import { UserRole } from "@/types"
import { Class, Teacher } from "@prisma/client"
import FormContainer from "../FormContainer"

type ClassesList = Class & { supervisor: Teacher | null }

export const classesColumn = (role: UserRole) => [
    {
        accessor: "name",
        header: "Class",
        cell: (item: ClassesList) => <span>{item.name}</span>
    },
    {
        accessor: "capacity",
        header: "Capacity",
        cell: (item: ClassesList) => <span>{item.capacity}</span>
    },
    {
        accessor: "grade",
        header: "Grade",
        cell: (item: ClassesList) => <span>{item.name[0]}</span>
    },
    {
        accessor: "supervisor",
        header: "Supervisor",
        cell: (item: ClassesList) => <span>{item?.supervisor?.name} {item?.supervisor?.surname}</span>
    },
    ...(role === "admin"
        ? [
            {
                header: "Actions",
                accessor: "action",
                cell: (item: ClassesList) => (
                    <div>
                        <div className="flex items-center gap-2">
                            <FormContainer table="class" type="update" data={item} />
                            <FormContainer table="class" type="delete" id={item.id} />
                        </div>
                    </div>
                )
            },
        ]
        : []),
]
