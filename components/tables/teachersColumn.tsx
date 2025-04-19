import { UserRole } from "@/types";
import { Class, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import FormContainer from "../FormContainer";

type TeacherList = Teacher & { subjects: Subject[] } & { classes: Class[] }

export const teachersColumn = (role: UserRole) => [
    {
        header: "Info",
        accessor: "info",
        className: 'min-w-56',
        cell: (item: TeacherList) => (
            <div className="flex items-center gap-4 p-2">
                <Image
                    src={item.img || '/noAvatar.png'}
                    alt={item.username}
                    width={40}
                    height={40}
                    className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
                />
                <h3 className="font-semibold">{item.name} {item.surname}</h3>
            </div>
        )
    },
    {
        header: "Teacher ID",
        accessor: "teacherId",
        className: 'min-w-56',
        cell: (item: TeacherList) => <span>{item.username}</span>
    },
    {
        header: "Subjects",
        accessor: "subjects",
        className: 'min-w-56',
        cell: (item: TeacherList) => <span>{item.subjects.map(subject => subject.name).join(',')}</span>
    },
    {
        header: "Classes",
        accessor: "classes",
        className: 'min-w-56',
        cell: (item: TeacherList) => <span>{item.classes.map(className => className.name).join(',') || "-"}</span>
    },
    {
        header: "Phone",
        accessor: "phone",
        className: 'min-w-56',
        cell: (item: TeacherList) => <span>{item.phone}</span>
    },
    {
        header: "Email",
        accessor: "email",
        className: 'min-w-56',
        cell: (item: TeacherList) => <span>{item.email}</span>
    },
    {
        header: "Address",
        accessor: "address",
        className: 'min-w-56',
        cell: (item: TeacherList) => <span>{item.address}</span>
    },
    ...(role === "admin"
        ? [
            {
                header: "Actions",
                accessor: "action",
                cell: (item: TeacherList) => (
                    <div>
                        <div className="flex items-center gap-2">
                            <Link href={`/list/teachers/${item.id}`}>
                                <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                                    <Image src="/view.svg" alt="" width={16} height={16} />
                                </button>
                            </Link>
                            <FormContainer table="teacher" type="delete" id={item.id} />
                        </div>
                    </div>
                )
            },
        ]
        : []),
];