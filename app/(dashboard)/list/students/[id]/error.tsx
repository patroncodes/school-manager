'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const Error = () => {
    const router = useRouter()

    return (
        <div className="flex-center flex-col gap-7 h-[90vh]">
            <h2 className="text-3xl font-semibold">
                Oops!! There seems to be an error
            </h2>

            <Button onClick={() => router.back()}>Go Back</Button>
        </div>
    )
}

export default Error