"use client"

import {
    ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ITEMS_PER_PAGE } from "@/lib/settings"
import { useRouter } from "next/navigation"
import { useState } from "react"
import DataTableHeader from "../DataTableHeader"
import { Button } from "./button"
import { type Table as ListTable } from "@/types"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[];
    tableFor: ListTable;
    filterBy: string;
    count?: number
    p?: number
}

export function DataTable<TData, TValue>({
    columns,
    data,
    tableFor,
    filterBy,
    count,
    p
}: DataTableProps<TData, TValue>) {
    const router = useRouter();

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
            columnFilters,
        }
    })

    const handlePageClick = (newPage: number) => {
        if (p && count) {
            const params = new URLSearchParams(window.location.search)
            params.set('page', newPage.toString())

            router.push(`${window.location.pathname}?${params}`)
        } else {
            table.setPageIndex(newPage)
        }
    }

    const pageCount = count ? Math.ceil(count / ITEMS_PER_PAGE) : table.getPageCount()

    return (
        <div>
            <DataTableHeader listTable={tableFor} table={table} filterBy={filterBy} />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-lamaSkyLight ">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="font-sans font-semibold tracking-wider">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between w-full space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>

                <div className="flex items-center gap-2 text-sm">
                    {Array.from(
                        { length: pageCount },
                        (_, index) => {
                            const page = p ? p : table.getState().pagination.pageIndex + 1
                            const pageIndex = index + 1

                            return (
                                <button
                                    key={index}
                                    className={`px-2 rounded-sm ${page === pageIndex ? "bg-lamaSky" : ""
                                        }`}
                                    onClick={() => handlePageClick((p && count) ? pageIndex : index)}
                                >
                                    {pageIndex}
                                </button>
                            );
                        }
                    )}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
