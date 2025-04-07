import TableSearch from './TableSearch'
import Image from 'next/image'
import FormModal from './FormModal'
import { Table, UserRole } from '@/types';
import { listCreationAccess } from '@/lib/settings';

const ListHeader = ({ role, table, title }: { role: UserRole; table: Table; title: string }) => {
    return (
        <div className="flex items-center justify-between">
            <h1 className="hidden md:block text-lg font-semibold">{title}</h1>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                <TableSearch />
                <div className="flex items-center gap-4 self-end">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                        <Image src="/filter.svg" alt="" width={14} height={14} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                        <Image src="/sort.svg" alt="" width={14} height={14} />
                    </button>
                    {listCreationAccess[role].includes(table) && (
                        <FormModal table={table} type="create" />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ListHeader