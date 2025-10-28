"use client";

import { Student } from "@/lib/generated/prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DeleteModal from "../DeleteModal";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type StudentsList = Student & { class: { grade: { name: string } } };

export const studentsColumn: ColumnDef<StudentsList>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableGlobalFilter: false,
    enableHiding: false,
  },
  {
    id: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorFn: (row) => `${row.name} ${row.surname}`,
    filterFn: (row, columnId, filterValue) => {
      const fullName = row.original.name + " " + row.original.surname;
      return fullName.toLowerCase().includes(filterValue.toLowerCase());
    },
    cell: ({ row: { original: student } }) => (
      <span className="flex items-center gap-4">
        <Image
          src={student.img || "/noAvatar.png"}
          alt="student"
          width={40}
          height={40}
          className="h-10 w-10 rounded-full"
        />
        <h3 className="font-semibold">
          {student.name + " " + student.surname}
        </h3>
      </span>
    ),
  },
  {
    header: "Registration No",
    accessorKey: "registration Number",
    cell: ({ row: { original: student } }) => (
      <span>{student.registrationNumber}</span>
    ),
  },
  {
    id: "Grade",
    header: "Grade",
    accessorFn: (row) => row.class.grade.name,
    cell: ({ row: { original: student } }) => (
      <span>{student.class.grade.name}</span>
    ),
  },
  {
    header: "Address",
    accessorKey: "address",
    cell: ({ row: { original: student } }) => <span>{student.address}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/list/students/${row.original.id}`}>
                View student
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem>Deactivate student</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DeleteModal id={row.original.id} table="student">
                <span className="px-2 py-1 text-sm font-medium text-destructive">
                  Delete Student
                </span>
              </DeleteModal>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
