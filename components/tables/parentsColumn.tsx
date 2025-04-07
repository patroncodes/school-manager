import { UserRole } from "@/types"
import FormModal from "../FormModal"
import { Parent, Student } from "@prisma/client"

type ParentsList = Parent & { students: Student[] }

export const parentsColumn = (role: UserRole) => [
    {
        accessor: "surname",
        header: "Info",
        cell: (item: ParentsList) => (
            <div className="font-semibold">{item.name} {item.surname}</div>
        )
    },
    {
        accessor: "students",
        header: "Student Names",
        cell: (item: ParentsList) => (
            <div className="">{item.students.map(student => student.name).join(',')}</div>
        )
    },
    {
        accessor: "phone",
        header: "Phone",
        cell: (item: ParentsList) => <span>{item.phone}</span>
    },
    {
        accessor: "email",
        header: "Email",
        cell: (item: ParentsList) => <span>{item.email}</span>
    },
    {
        accessor: "address",
        header: "Address",
        cell: (item: ParentsList) => <span>{item.address}</span>
    },
    ...(role === "admin"
        ? [
            {
                header: "Actions",
                accessor: "action",
                cell: (item: ParentsList) => (
                    <div>
                        <div className="flex items-center gap-2">
                            <FormModal table="parent" type="update" data={item} />
                            <FormModal table="parent" type="delete" id={item.id} />
                        </div>
                    </div>
                )
            },
        ]
        : []),
]
