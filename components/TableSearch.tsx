"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const TableSearch = () => {
    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const searchParam = searchParams.get('search')

    const [searchTerm, setSearchTerm] = useState(searchParam || "")


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!searchTerm.trim()) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set("search", searchTerm.trim());

        router.push(`${pathname}?${params.toString()}`);
    };

    const handleClear = () => {
        setSearchTerm("")

        router.push(pathname)
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2 relative"
        >
            <button
                type="submit"
                disabled={!searchTerm || searchTerm === ''}
                className="w-6 h-6 rounded-full flex-center p-1 cursor-pointer">
                <Search />
            </button>

            <input
                type="text"
                placeholder="Search..."
                className="w-[200px] h-full p-2 bg-transparent outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {(searchTerm !== "" || searchParam) && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-lamaPurpleLight opacity-25 hover:opacity-90 transition-opacity flex-center p-1">
                    <X />
                </button>
            )}
        </form>
    );
};

export default TableSearch;