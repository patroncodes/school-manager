"use client";

import Image from "next/image";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import DeleteModal from "@/components/DeleteModal";
import DropdownOptions from "@/components/DropdownOptions";
import { deactivateStaff } from "@/lib/actions/teacher";
import { Staff } from "@/lib/generated/graphql/client";

type TeacherList = Staff & {
  isActive: boolean;
};

export const staffColumn: ColumnDef<TeacherList>[] = [
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
    header: "Name",
    id: "info",
    cell: ({ row: { original } }) => (
      <div className="flex items-center gap-4 p-2">
        <Image
          src={original.img || "/noAvatar.png"}
          alt={original.name}
          width={100}
          height={100}
          className="size-10 rounded-full"
        />
        <h3 className="font-semibold">
          {original.name} {original.surname}
        </h3>
      </div>
    ),
  },
  {
    header: "Role",
    accessorKey: "role",
    cell: ({ row: { original } }) => <span>{original.role}</span>,
  },
  {
    header: "Phone",
    accessorKey: "phone",
    cell: ({ row: { original } }) => <span>{original.phone}</span>,
  },
  {
    header: "Email",
    accessorKey: "email",
    cell: ({ row: { original } }) => <span>{original.email}</span>,
  },
  {
    header: "Address",
    accessorKey: "address",
    cell: ({ row: { original } }) => <span>{original.address}</span>,
  },
  {
    header: "Class",
    accessorFn: (row) => row.class?.name,
    cell: ({ row: { original } }) => (
      <span>
        {original.class?.grade.name} {original.class?.name}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({
      row: {
        original: { id, clerkUserId, isActive },
      },
    }) => {
      return (
        <DropdownOptions>
          <DropdownMenuItem asChild>
            <Link href={`/list/staffs/${id}`}>View</Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {clerkUserId && (
            <DropdownMenuItem
              onClick={async () =>
                await deactivateStaff({
                  clerkUserId: clerkUserId!,
                  staffId: id,
                  type: isActive ? "deactivate" : "activate",
                })
              }
            >
              {isActive ? "Deactivate account" : "Activate account"}
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild>
            <DeleteModal id={id} table="staff" triggerTitle="Delete" />
          </DropdownMenuItem>
        </DropdownOptions>
      );
    },
  },
];
