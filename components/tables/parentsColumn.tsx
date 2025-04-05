import FormModal from "../FormModal"
import { Parent, Student } from "@prisma/client"

type ParentsList = Parent & { students: Student[] }

export const parentsColumn = (role: string) => [
    {
        accessor: "surname",
        header: "Info",
        cell: (item: ParentsList) => (
            <div className="flex flex-col ">
                <h3 className="font-semibold">{item.name} {item.surname}</h3>
                <p className="text-xs text-gray-500">{item.email}</p>
            </div>
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
