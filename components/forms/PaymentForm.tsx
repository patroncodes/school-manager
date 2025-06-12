"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Loader2 } from "lucide-react"
import { toast } from 'sonner'

interface PaymentFormProps {
    defaultEmail?: string
    defaultAmount?: number
    purpose?: string
    onSuccess?: (data: any) => void
    onError?: (error: string) => void
}

export default function PaymentForm({
    defaultEmail = "",
    defaultAmount = 0,
    purpose = "School Payment",
    onSuccess,
    onError,
}: PaymentFormProps) {
    const [email, setEmail] = useState(defaultEmail)
    const [amount, setAmount] = useState(defaultAmount.toString())
    const [description, setDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Convert amount to kobo (multiply by 100)
            const amountInKobo = Math.round(Number.parseFloat(amount) * 100)

            const response = await fetch("/api/paystack/initialize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    amount: amountInKobo,
                    callback_url: `${window.location.origin}/payment`,
                    metadata: {
                        purpose,
                        description,
                        custom_fields: [
                            {
                                display_name: "Purpose",
                                variable_name: "purpose",
                                value: purpose,
                            },
                        ],
                    },
                }),
            })

            const data = await response.json()

            if (data.status && data.data?.authorization_url) {
                toast.success("Payment Initialized", { description: "Redirecting to payment page" })

                // Redirect to Paystack payment page
                window.location.href = data.data.authorization_url

                if (onSuccess) {
                    onSuccess(data.data)
                }
            } else {
                throw new Error(data.message || "Payment initialization failed")
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred"
            toast.error("Payment Error", {
                description: errorMessage,
                richColors: true
            })

            if (onError) {
                onError(errorMessage)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Make Payment
                </CardTitle>
                <CardDescription>Enter your payment details to proceed</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₦)</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="1"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Payment description"
                            rows={3}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading || !email || !amount}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            `Pay ₦${Number.parseFloat(amount || "0").toLocaleString()}`
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
