/* eslint-disable @typescript-eslint/no-unused-vars */

import "@tanstack/react-table";
import { RoleAccessLevel } from "@/types";

declare module "@tanstack/react-table" {
  interface ColumnMeta<_TData, TValue> {
    roles?: RoleAccessLevel[];
  }
}
