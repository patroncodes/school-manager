"use client";

import { ColumnDef } from "@tanstack/react-table";
import FormModal from "@/components/FormModal";
import DeleteModal from "@/components/DeleteModal";
import DropdownOptions from "@/components/DropdownOptions";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Event } from "@/lib/generated/prisma/client";
import { Checkbox } from "@/components/ui/checkbox";

type EventsList = Event & { grade: { name: string } | null };

export const eventsColumn: ColumnDef<EventsList>[] = [
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
    accessorKey: "title",
    header: "Title",
    cell: ({ row: { original } }) => <span>{original.title}</span>,
  },
  {
    accessorFn: (row) => row.grade?.name || "grade",
    header: "Grade",
    cell: ({ row: { original } }) => <span>{original.grade?.name || "-"}</span>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row: { original } }) => (
      <span>{new Intl.DateTimeFormat("en-NG").format(original.startTime)}</span>
    ),
  },
  {
    accessorKey: "startTime",
    header: "Starts",
    cell: ({ row: { original } }) => (
      <span>
        {original.startTime.toLocaleTimeString("en-NG", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </span>
    ),
  },
  {
    accessorKey: "endTime",
    header: "Ends",
    cell: ({ row: { original } }) => (
      <span>
        {original.endTime.toLocaleTimeString("en-NG", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row: { original } }) => {
      return (
        <DropdownOptions>
          <DropdownMenuItem asChild>
            <FormModal
              table="event"
              type="update"
              data={original}
              triggerTitle="Update"
            />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <DeleteModal id={original.id} table="staff" triggerTitle="Delete" />
          </DropdownMenuItem>
        </DropdownOptions>
      );
    },
  },
];
