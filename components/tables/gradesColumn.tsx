"use client";

import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import DeleteModal from "@/components/DeleteModal";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import DropdownOptions from "@/components/DropdownOptions";

type GradesList = {
  id: string;
  name: string;
  updatedAt: Date;
  classes: {
    id: string;
    name: string;
    studentCount: number;
  }[];
};

export const gradesColumn: ColumnDef<GradesList>[] = [
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row: { original } }) => <span>{original.name}</span>,
  },
  {
    accessorKey: "classes",
    header: "Classes",
    cell: ({ row: { original } }) => (
      <span>{original.classes.map((c) => c.name).join(", ")}</span>
    ),
  },
  {
    accessorKey: "students",
    header: "Enrolled Students",
    cell: ({ row: { original } }) => {
      const studentCount = original.classes.reduce(
        (acc, c) => acc + c.studentCount,
        0,
      );
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
              <DeleteModal
                id={original.id}
                table="grade"
                triggerTitle="Delete Grade"
              />
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
