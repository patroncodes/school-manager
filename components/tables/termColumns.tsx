"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import DropdownOptions from "@/components/DropdownOptions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { schoolTerms } from "@/constants";

type TermsList = {
  id: string;
  year?: string;
  term?: number;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
};

export const termsColumns: ColumnDef<TermsList>[] = [
  {
    header: "Year / Term",
    accessorFn: (row) => row.year || row.term,
    cell: ({
      row: {
        original: { term, year },
      },
    }) => (
      <div className="flex items-center gap-4">
        <span className="size-4 rounded-full bg-green-300"></span>
        <span>
          {term ? schoolTerms.find((t) => t.id === term)?.name : year}
        </span>
      </div>
    ),
  },
  {
    header: "Start Date",
    accessorKey: "startDate",
    cell: ({ row: { original } }) => (
      <span>
        {new Intl.DateTimeFormat("en-NG").format(new Date(original.startDate))}
      </span>
    ),
  },
  {
    header: "End Date",
    accessorKey: "endDate",
    cell: ({
      row: {
        original: { endDate },
      },
    }) => (
      <span>
        {endDate
          ? new Intl.DateTimeFormat("en-NG").format(new Date(endDate))
          : "-"}
      </span>
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
