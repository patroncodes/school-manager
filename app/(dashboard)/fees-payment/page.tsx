"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import PaymentForm from "@/components/forms/PaymentForm"

export default function PaymentPage() {
    const searchParams = useSearchParams()
    const reference = searchParams.get("reference")
    const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "failed" | null>(null)
    const [transactionData, setTransactionData] = useState<any>(null)

    useEffect(() => {
        if (reference) {
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

    const handlePaymentSuccess = (data: any) => {
        console.log("Payment initialized successfully:", data)
    }

    const handlePaymentError = (error: string) => {
        console.error("Payment error:", error)
    }

    // Show verification result if we have a reference
    if (reference) {
        return (
            <div className="container mx-auto p-6">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Payment Verification</h1>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
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
                                            <p>
                                                <strong>Reference:</strong> {transactionData.reference}
                                            </p>
                                            <p>
                                                <strong>Amount:</strong> ₦{(transactionData.amount / 100).toLocaleString()}
                                            </p>
                                            <p>
                                                <strong>Email:</strong> {transactionData.customer.email}
                                            </p>
                                            <p>
                                                <strong>Date:</strong> {new Date(transactionData.paid_at).toLocaleString()}
                                            </p>
                                        </div>
                                    )}

                                    <Button onClick={() => (window.location.href = "/payment")}>Make Another Payment</Button>
                                </div>
                            )}

                            {verificationStatus === "failed" && (
                                <div className="text-center space-y-4">
                                    <XCircle className="h-12 w-12 mx-auto text-red-600" />
                                    <h3 className="text-lg font-semibold text-red-600">Payment Failed</h3>
                                    <p className="text-muted-foreground">
                                        We couldn&apos;t verify your payment. Please try again or contact support.
                                    </p>
                                    <Button onClick={() => (window.location.href = "/payment")}>Try Again</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    // Show payment form if no reference
    return (
        <div className="container mx-auto p-6">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">School Payment Portal</h1>
                    <p className="text-muted-foreground mt-2">Secure payment processing for school fees and services</p>
                </div>

                <PaymentForm purpose="School Fees Payment" onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
            </div>
        </div>
    )
}
