"use client";

import Image from "next/image";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import DropdownOptions from "@/components/DropdownOptions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type StudentsList = {
  id: string;
  name: string;
  surname: string;
  img: string;
  registrationNumber: string;
  sex: string;
};

export const classStudentsColumn: ColumnDef<StudentsList>[] = [
  {
    header: "Student",
    accessorFn: (row) => row.name + " " + row.surname,
    cell: ({ row: { original } }) => (
      <span className="flex items-center gap-4">
        <Image
          src={original?.img || "/noAvatar.png"}
          alt="student"
          width={40}
          height={40}
          className="h-10 w-10 rounded-full"
        />
        <h3 className="font-semibold">
          {original.name} {original.surname}
        </h3>
      </span>
    ),
  },
  {
    header: "Reg No",
    accessorKey: "registrationNumber",
    cell: ({ row: { original } }) => <span>{original.registrationNumber}</span>,
  },
  {
    header: "Gender",
    accessorKey: "sex",
    cell: ({ row: { original } }) => (
      <span className="capitalize">{original.sex[0]}</span>
    ),
  },
  {
    header: "",
    accessorKey: "action",
    cell: ({ row: { original } }) => (
      <DropdownOptions>
        <DropdownMenuItem>
          <Link href={`/list/students/${original.id}`}>
            <span>View student</span>
          </Link>
        </DropdownMenuItem>
      </DropdownOptions>
    ),
    meta: { roles: ["manager", "administration"] },
    enableHiding: false,
  },
];
