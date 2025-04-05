import Image from "next/image";
import Link from "next/link";
import FormModal from "../FormModal";
import { Class, Student } from "@prisma/client";

type StudentsList = Student & { class: Class };

export const studentsColumn = (role: string) => [
    {
        header: "Info",
        accessor: "info",
        cell: (item: StudentsList) => (
            <span className="flex items-center gap-4 p-4">
                <Image
                    src={item.img || "/noAvatar.png"}
                    alt=""
                    width={40}
                    height={40}
                    className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
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
        className: "hidden md:table-cell",
        cell: (item: StudentsList) => (
            <span className="hidden md:table-cell">{item.username}</span>
        )
    },
    {
        header: "Grade",
        accessor: "grade",
        cell: (item: StudentsList) => (
            <span>{item.class.name[0]}</span>
        )
    },
    {
        header: "Phone",
        accessor: "phone",
        className: "hidden lg:table-cell",
        cell: (item: StudentsList) => (
            <span className="hidden md:table-cell">{item.phone}</span>
        )
    },
    {
        header: "Address",
        accessor: "address",
        className: "hidden lg:table-cell",
        cell: (item: StudentsList) => (
            <span className="hidden md:table-cell">{item.address}</span>
        )
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
                                    <Image src="/view.png" alt="" width={16} height={16} />
                                </button>
                            </Link>
                            <FormModal table="student" type="delete" id={item.id} />
                        </div>
                    </div>
                )
            },
        ]
        : []),
];