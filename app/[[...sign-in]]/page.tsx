'use client'

import * as Clerk from "@clerk/elements/common"
import * as SignIn from '@clerk/elements/sign-in'
import { useUser } from "@clerk/nextjs"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const LoginPage = () => {
    const router = useRouter()
    const { user } = useUser()

    useEffect(() => {
        const role = user?.publicMetadata?.role;

        if (role) {
            router.push(`/${role}`)
        }
    }, [user, router])

    return (
        <div className="h-screen bg-lamaSkylight flex-center">
            <SignIn.Root>
                <SignIn.Step name='start' className='bg-white p-12 rounded-md shadow-2xl shadow-amber-100 flex flex-col gap-2'>
                    <div className="flex-center flex-col w-full my-5">
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <Image src='/logo.svg' alt="logo" width={24} height={24} />
                            School Lama</h1>
                        <h2 className="text-gray-400">Sign in to your account</h2>
                    </div>

                    <Clerk.GlobalError className="text-sm text-red-300" />
                    <Clerk.Field name='identifier' className="flex flex-col gap-2">
                        <Clerk.Label className="text-md text-gray-500">Username</Clerk.Label>
                        <Clerk.Input className="p-2 rounded-md ring-1 ring-gray-300" type="text" required autoFocus />
                        <Clerk.FieldError className="text-xs text-red-300" />
                    </Clerk.Field>
                    <Clerk.Field name="password" className="flex flex-col gap-2">
                        <Clerk.Label className="text-md text-gray-500">Password</Clerk.Label>
                        <Clerk.Input className="p-2 rounded-md ring-1 ring-gray-300" type="password" required />
                        <Clerk.FieldError className="text-xs text-red-300" />
                    </Clerk.Field>

                    <SignIn.Action submit className="bg-blue-500 text-white my-1 rounded-md text-sm py-[10px]">Sign In</SignIn.Action>
                </SignIn.Step>
            </SignIn.Root>
        </div>
    )
}

export default LoginPage