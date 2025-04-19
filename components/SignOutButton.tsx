'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { Button } from "./ui/button"
import { useClerk } from "@clerk/nextjs"
import { LogOut } from "lucide-react"

const SignOutButton = ({ img }: { img?: string }) => {
    const { signOut } = useClerk()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Image
                    src={img ?? "/avatar.svg"}
                    alt="avatar"
                    width={36}
                    height={36}
                    className="rounded-full"
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <Button className="w-full bg-transparent text-black hover:bg-transparent cursor-pointer" onClick={() => signOut({ redirectUrl: '/' })}>
                    <LogOut /> Sign Out
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default SignOutButton