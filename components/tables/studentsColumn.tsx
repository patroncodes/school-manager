import { UserRole } from "@/types";
import { Class, Student } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import FormContainer from "../FormContainer";

type StudentsList = Student & { class: Class };

export const studentsColumn = (role: UserRole) => [
    {
        header: "Info",
        accessor: "info",
        className: 'min-w-56',
        cell: (item: StudentsList) => (
            <span className="flex items-center gap-4 p-4">
                <Image
                    src={item.img || "/noAvatar.png"}
                    alt="student"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col">
                    <h3 className="font-semibold">{item.name + " " + item.surname}</h3>
                    <p className="text-xs text-gray-500">{item.class.name}</p>
                </div>
            </span>
        )
    },
    {
        header: "Student ID",
        accessor: "studentId",
        className: 'min-w-56',
        cell: (item: StudentsList) => <span>{item.username}</span>
    },
    {
        header: "Grade",
        accessor: "grade",
        className: 'min-w-56',
        cell: (item: StudentsList) => <span>{item.class.name[0]}</span>
    },
    {
        header: "Phone",
        accessor: "phone",
        className: 'min-w-56',
        cell: (item: StudentsList) => <span>{item.phone}</span>
    },
    {
        header: "Address",
        accessor: "address",
        className: 'min-w-56',
        cell: (item: StudentsList) => <span>{item.address}</span>
    },
    ...(role === "admin"
        ? [
            {
                header: "Actions",
                accessor: "action",
                cell: (item: StudentsList) => (
                    <div>
                        <div className="flex items-center gap-2">
                            <Link href={`/list/students/${item.id}`}>
                                <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                                    <Image src="/view.svg" alt="view" width={16} height={16} />
                                </button>
                            </Link>
                            <FormContainer table="student" type="delete" id={item.id} />
                        </div>
                    </div>
                )
            },
        ]
        : []),
];