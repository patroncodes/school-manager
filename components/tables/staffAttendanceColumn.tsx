"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { markStaffAttendance } from "@/lib/actions";
import { isToday, isWeekend } from "date-fns";

type StaffAttendanceList = {
  id: string;
  name: string;
  surname: string;
  date: Date;
  attendances: {
    clockInTime: Date;
  }[];
};

export const staffAttendanceColumn: ColumnDef<StaffAttendanceList>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row: { original } }) => (
      <span>{original.name + " " + original.surname}</span>
    ),
  },
  {
    accessorKey: "clockInTime",
    header: "Clock In Time",
    cell: ({ row: { original } }) => (
      <span>
        {original.attendances[0]?.clockInTime.toLocaleTimeString("en-CA", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }) ?? "-"}
      </span>
    ),
    enableGlobalFilter: false,
  },
  {
    id: "actions",
    cell: ({ row: { original } }) => {
      const isEndOfTheWeek = isWeekend(original.date);
      const isDateToday = isToday(original.date);

      if (original.attendances.length === 0 && isDateToday && !isEndOfTheWeek) {
        return (
          <Button
            variant="ghost"
            className="rounded-xl bg-lamaPurple"
            onClick={async () => {
              await markStaffAttendance({
                staffId: original.id,
                date: original.date,
              });
            }}
          >
            Check in
          </Button>
        );
      }
    },
    enableSorting: false,
    enableGlobalFilter: false,
    enableHiding: false,
    meta: { roles: ["manager", "administration"] },
  },
];
