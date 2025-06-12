'use client'

import { useClerk } from "@clerk/nextjs"
import { LogOut } from "lucide-react"

const SignOutButton = () => {
    const { signOut } = useClerk()

    return (
        <button
            className="flex items-center justify-center lg:justify-start gap-4 w-full py-2 md:px-2 ml-0.5 md:ml-0 rounded-md bg-transparent hover:bg-lamaSkyLight"
            onClick={() => signOut({ redirectUrl: '/' })}
        >
            <LogOut size={21} color="#4a5565" />
            <span className="hidden lg:block text-gray-500">Sign Out</span>
        </button>
    )
}

export default SignOutButton