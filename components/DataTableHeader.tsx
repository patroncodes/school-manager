import { role } from '@/lib/data';
import { Table as ListTable } from '@/types';
import { Table } from '@tanstack/react-table';
import { RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import FormModal from './FormModal';
import { Input } from './ui/input';

interface DataTableHeaderProps<TData> {
    filterBy: string;
    table: Table<TData>;
    listTable: ListTable
}

function DataTableHeader<TData>({ filterBy, table, listTable }: DataTableHeaderProps<TData>) {
    const router = useRouter();
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const value = (e.currentTarget[0] as HTMLInputElement).value

        const params = new URLSearchParams(searchParams.toString())
        params.set('search', value)

        router.push(`${pathname}?${params}`)
    }

    const resetSearchParam = () => {
        const params = new URLSearchParams(searchParams.toString());

        params.delete("search");

        const newQueryString = params.toString();
        const newUrl = newQueryString ? `${pathname}?${newQueryString}` : pathname;

        router.replace(newUrl);
    }
    return (
        <div className="flex items-center justify-between my-4">
            <h1 className="hidden md:block text-lg font-semibold capitalize">All {listTable}s</h1>

            <div className='flex flex-col-reverse items-end gap-4 xl:items-center space-x-4 w-full md:w-auto xl:flex-row'>
                <form onSubmit={handleSearchSubmit} className="flex items-center space-x-4 ml-6">
                    <Input
                        placeholder={`Search...`}
                        value={(table.getColumn(filterBy)?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn(filterBy)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />

                    <button type="button" className="w-8 h-8 rounded-full flex-center p-2 bg-lamaYellow cursor-pointer">
                        <RefreshCw onClick={resetSearchParam} />
                    </button>
                </form>

                <div className="flex items-center justify-end gap-4">
                    <button className="w-8 h-8 flex-center rounded-full bg-lamaYellow">
                        <Image src="/filter.svg" alt="filter" width={12} height={14} />
                    </button>
                    <button className="w-8 h-8 flex-center rounded-full bg-lamaYellow">
                        <Image src="/sort.svg" alt="filter" width={12} height={14} />
                    </button>
                    {role === "admin" && <FormModal table={listTable} type="create" />}
                </div>
            </div>
        </div>
    )
}

export default DataTableHeader