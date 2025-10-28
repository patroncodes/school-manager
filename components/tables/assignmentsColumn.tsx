"use client";

import { Assignment } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

type AssignmentsList = Assignment & {
  subject: { name: string };
  class: { name: string };
};

export const assignmentsColumn: ColumnDef<AssignmentsList>[] = [
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row: { original } }) => <span>{original.subject.name}</span>,
  },
  {
    accessorKey: "class",
    header: "Class",
    cell: ({ row: { original } }) => <span>{original.class.name}</span>,
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row: { original } }) => (
      <span>{new Intl.DateTimeFormat("en-NG").format(original.startDate)}</span>
    ),
  },
];
