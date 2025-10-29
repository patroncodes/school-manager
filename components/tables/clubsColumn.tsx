"use client";

import { Club } from "@/lib/generated/prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import FormModal from "@/components/FormModal";
import DeleteModal from "@/components/DeleteModal";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import DropdownOptions from "@/components/DropdownOptions";

export const clubsColumn: ColumnDef<Club>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row: { original } }) => <div>{original.name}</div>,
  },
  {
    accessorKey: "startTime",
    header: "Date",
    cell: ({
      row: {
        original: { foundedAt },
      },
    }) => (
      <span>
        {foundedAt
          ? new Intl.DateTimeFormat("en-NG").format(new Date(foundedAt))
          : "-"}
      </span>
    ),
  },
  {
    header: "Actions",
    accessorKey: "action",
    cell: ({ row: { original } }) => (
      <DropdownOptions>
        <>
          <DropdownMenuItem asChild>
            <FormModal
              table="club"
              type="update"
              data={original}
              triggerTitle="Update"
            />
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
    ),
  },
];
