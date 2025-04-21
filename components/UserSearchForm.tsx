"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { getParents } from "@/lib/actions/parent"
import { Loader2, Search } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"
import { startTransition, useActionState, useEffect, useState } from "react"
import { Label } from "./ui/label"
import { toast } from "sonner"
import { getStudents } from "@/lib/actions/student"

const initState = [{ id: '', name: '', surname: '' }]

type ParentSearchFormProps = {
    type: "parent" | "student";
    setUser: Dispatch<SetStateAction<{
        id: string;
        name: string;
        surname: string;
    }>>
}

const UserSearchForm = ({
    type,
    setUser,
}: ParentSearchFormProps) => {
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState<{ id: string; name: string; surname: string }[]>([])

    const [state, formAction, pending] = useActionState(
        type === 'parent' ? getParents : getStudents,
        { data: initState, error: false }
    )

    useEffect(() => {
        if (state.error && state.data === undefined) {
            toast.error("Error getting parents")
        } else if (state.data) {
            setSearchResults(state.data)
        }
    }, [state])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()

        if (!searchTerm) return;

        startTransition(() => {
            formAction(searchTerm)
        })
    }

    const handleUserSelect = ({ id, name, surname }: { id: string; name: string; surname: string }) => {
        setUser({ id, name, surname })

        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen} modal={false}>
            <DialogTrigger>
                <Search size={32} className="text-blue-400 border border-gray-400 p-1 rounded-sm" />
            </DialogTrigger>
            <DialogContent overlayClassName="bg-black" className="sm:max-w-lg z-[9999]" forceMount>
                <DialogHeader>
                    <DialogTitle className="capitalize">Find {type}</DialogTitle>
                    <DialogDescription>Search for a {type} by entering a name</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="searchTerm" className="sr-only">Search</Label>
                        <Input
                            id="searchTerm"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoComplete="off"
                        />
                    </div>

                    <Button type="submit" disabled={pending}>
                        {pending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Searching...
                            </>
                        ) : (
                            <>
                                <Search className="mr-2 h-4 w-4" />
                                Search
                            </>
                        )}
                    </Button>
                </form>
                <DialogFooter className="mt-4 shadow-xl shadow-gray-300 bg-lamaSkyLight p-2 rounded-md max-h-[10rem] overflow-y-scroll custom-scrollbar">
                    {searchResults.length === 0 ? (
                        <p>No result</p>
                    ) : searchResults.map((result) => (
                        <div
                            key={result.id}
                            className="hover:bg-lamaSky w-full rounded-sm px-1 cursor-default"
                            onClick={() => handleUserSelect({ id: result.id, name: result.name, surname: result.surname })}
                        >
                            {result.name} {result.surname}
                        </div>
                    ))}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UserSearchForm
