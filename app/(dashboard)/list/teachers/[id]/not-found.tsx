import { Button } from "@/components/ui/button"
import Link from "next/link"

const NotFoundPage = () => {
    return (
        <div className='relative h-[90vh] w-full flex-center flex-col gap-5'>
            <h1 className='font-bold text-4xl font-serif'>404</h1>
            <p className="text-xl text-gray-600">Teacher Not Found</p>
            <Button asChild>

                <Link href="/list/teachers" className="text-black bg-lamaYellow">
                    Go Back
                </Link>
            </Button>
        </div>
    )
}

export default NotFoundPage