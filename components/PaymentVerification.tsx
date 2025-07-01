"use client"

import { UserRole } from "@/types"
import { CheckCircle, Loader2, XCircle } from "lucide-react"
import moment from "moment"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"

const PaymentVerification = ({ reference, userRole }: { reference: string; userRole: UserRole }) => {
    const router = useRouter()

    const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "failed" | null>(null)
    const [transactionData, setTransactionData] = useState<any>(null)
    const [open, setOpen] = useState(false)
    const hasRunRef = useRef(false)

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (hasRunRef.current) return;

        if (reference) {
            hasRunRef.current = true
            setOpen(true)
            verifyPayment(reference)
        }
    }, [reference])

    const verifyPayment = async (ref: string) => {
        setVerificationStatus("loading")

        try {
            const response = await fetch(`/api/paystack/verify?reference=${ref}`)
            const data = await response.json()

            if (data.status && data.data?.status === "success") {
                setVerificationStatus("success")
                setTransactionData(data.data)
            } else {
                setVerificationStatus("failed")
            }
        } catch (error) {
            console.error("Verification error:", error)
            setVerificationStatus("failed")
        }
    }

    const handleOpenChange = (open: boolean) => {
        setOpen(open)

        if (!open) {
            setVerificationStatus(null)
            setTransactionData(null)
            router.replace(userRole === "admin"
                ? '/list/transactions'
                : '/list/fees',
                { scroll: false }
            )
        }
    }

    const transactionDetails = [
        {
            label: 'Reference',
            value: transactionData?.reference
        },
        {
            label: 'Amount',
            value: `₦${transactionData?.amount / 100}`
        },
        {
            label: 'Email',
            value: transactionData?.customer.email
        },
        {
            label: 'Student',
            value: `${transactionData?.metadata.first_name} ${transactionData?.metadata.last_name}`
        },
        {
            label: 'Date',
            value: moment(transactionData?.paidAt).format('MMMM D, YYYY - h:mm A')
        }
    ]

    if (reference) {
        return (
            <Dialog open={open} onOpenChange={(open) => handleOpenChange(open)}>
                <DialogContent className="max-h-[90vh] sm:w-[75vw] lg:w-[45vw]">
                    <DialogHeader className="sr-only">
                        <DialogTitle>
                            Payment Verification
                        </DialogTitle>
                    </DialogHeader>
                    {verificationStatus === "loading" && (
                        <div className="text-center space-y-4">
                            <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                            <h3 className="text-lg font-semibold">Verifying Payment...</h3>
                            <p className="text-muted-foreground">Please wait while we confirm your payment</p>
                        </div>
                    )}

                    {verificationStatus === "success" && (
                        <div className="text-center space-y-4">
                            <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
                            <h3 className="text-lg font-semibold text-green-600">Payment Successful!</h3>
                            <p className="text-muted-foreground">Your payment has been processed successfully</p>

                            {transactionData && (
                                <div className="bg-green-50 p-4 rounded-lg space-y-2 text-left">
                                    {transactionDetails.map(item => (
                                        <div key={item.label} className="flex gap-4 items-center">
                                            <strong className="min-w-20">{item.label}:</strong>
                                            <p>{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {verificationStatus === "failed" && (
                        <div className="text-center space-y-4">
                            <XCircle className="h-12 w-12 mx-auto text-red-600" />
                            <h3 className="text-lg font-semibold text-red-600">Payment Failed</h3>
                            <p className="text-muted-foreground">
                                We couldn&apos;t verify your payment. Please try again or contact support.
                            </p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        )
    }
}

export default PaymentVerification