"use client";

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import DeleteModal from "@/components/DeleteModal";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import DropdownOptions from "@/components/DropdownOptions";
import { ProgramName } from "@/lib/generated/graphql/client";

type ProgramsList = {
  id: string;
  name: ProgramName;
  updatedAt: Date;
  grades: {
    id: string;
    name: string;
    classes: {
      studentCount: number;
    }[];
  }[];
};

export const programsColumn: ColumnDef<ProgramsList>[] = [
  {
    accessorKey: "name",
    header: "Program",
    cell: ({ row: { original } }) => <span>{original.name}</span>,
  },
  {
    accessorFn: (row) => row.grades.map((grade) => grade.name).join(", "),
    header: "Grades",
    cell: ({ row: { original } }) => (
      <span>{original.grades.map((c) => c.name).join(", ")}</span>
    ),
  },
  {
    accessorKey: "students",
    header: "Active Students",
    cell: ({ row: { original } }) => {
      const studentCount = original.grades.reduce((acc, grade) => {
        const classTotal = grade.classes.reduce(
          (sum, cls) => sum + cls.studentCount,
          0,
        );

        return acc + classTotal;
      }, 0);

      return <span>{studentCount}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row: { original } }) => {
      return (
        <DropdownOptions>
          <>
            <DropdownMenuItem asChild>
              <Link href={`/list/grades/${original.id}`}>View Grade</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <DeleteModal id={original.id} table="grade">
                <span className="px-2 py-1 text-sm font-medium text-destructive">
                  Delete Grade
                </span>
              </DeleteModal>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              {/*<FormContainer table="subject" type="update" data={original} />*/}
            </DropdownMenuItem>
          </>
        </DropdownOptions>
      );
    },
    enableSorting: false,
    enableGlobalFilter: false,
    enableHiding: false,
    meta: { visibility: ["manager", "administration"] },
  },
];
