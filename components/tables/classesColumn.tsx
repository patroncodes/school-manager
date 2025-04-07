import { UserRole } from "@/types"
import FormModal from "../FormModal"
import { Class, Teacher } from "@prisma/client"

type ClassesList = Class & { supervisor: Teacher | null }

export const classesColumn = (role: UserRole) => [
    {
        accessor: "name",
        header: "Class",
        cell: (item: ClassesList) => <div className="py-4 px-2">{item.name}</div>
    },
    {
        accessor: "capacity",
        header: "Capacity",
        cell: (item: ClassesList) => <div className="py-4 px-2">{item.capacity}</div>
    },
    {
        accessor: "grade",
        header: "Grade",
        className: "hidden md:table-cell",
        cell: (item: ClassesList) => <div className="hidden md:table-cell py-4 px-2">{item.name[0]}</div>
    },
    {
        accessor: "supervisor",
        header: "Supervisor",
        className: "hidden md:table-cell",
        cell: (item: ClassesList) => <div className="py-4 px-2">{item?.supervisor?.name} {item?.supervisor?.surname}</div>
    },
    ...(role === "admin"
        ? [
            {
                header: "Actions",
                accessor: "action",
                cell: (item: ClassesList) => (
                    <div>
                        <div className="flex items-center gap-2">
                            <FormModal table="class" type="update" data={item} />
                            <FormModal table="class" type="delete" id={item.id} />
                        </div>
                    </div>
                )
            },
        ]
        : []),
]
