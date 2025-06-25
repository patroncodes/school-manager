"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { ChangeEvent, useEffect, useState } from "react"
import { toast } from 'sonner'
import { getParent } from "@/lib/actions/parent"

interface Fee {
    id: number;
    amount: number;
    description: string;
}

interface PaymentFormProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    relatedData: {
        email?: string;
        paymentDetails: Fee[]
    }
}

export default function PaymentForm({
    setOpen,
    relatedData,
}: PaymentFormProps) {
    const { email, paymentDetails } = relatedData

    const [payerEmail, setPayerEmail] = useState(email)
    const [selectedDescription, setSelectedDescription] = useState("")
    const [selectedFee, setSelectedFee] = useState<Fee | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const selected = paymentDetails.find(fee => fee.description === selectedDescription)
        if (selected) {
            setSelectedFee({
                id: selected.id,
                amount: selected.amount,
                description: selected.description
            })
        }
    }, [selectedDescription, paymentDetails])


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (!payerEmail || !selectedFee) {
                toast.error("No parent found with this email")
                setIsLoading(false)
                return
            }
            const { data: parentInfo, error } = await getParent(payerEmail)

            if (error && !parentInfo) {
                toast.error("No parent found with this email")
                setIsLoading(false)
                return
            }

            const amountInKobo = Math.round(selectedFee?.amount * 100)

            const response = await fetch("/api/paystack/initialize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: payerEmail,
                    amount: amountInKobo,
                    callback_url: `${window.location.origin}/list/fees`,
                    metadata: {
                        fee_id: selectedFee.id,
                        user_id: parentInfo?.id,
                        first_name: parentInfo?.name,
                        last_name: parentInfo?.surname,
                        description: selectedFee.description
                    },
                }),
            })

            const data = await response.json()

            if (data.status && data.data?.authorization_url) {
                toast.success(data.message, { description: "Redirecting to payment page" })
                setOpen(false)

                window.location.href = data.data.authorization_url
            } else {
                throw new Error(data.message || "Payment initialization failed")
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred"
            toast.error("Payment Error", {
                description: errorMessage,
                richColors: true
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
                label="email"
                onChange={(e) => setPayerEmail(e.target.value)}
                value={payerEmail}
                inputProps={{ placeholder: relatedData.email }}
            />

            <div className="space-y-2">
                <Label htmlFor="description">Select Fee</Label>
                <select
                    id="description"
                    value={selectedDescription}
                    onChange={(e) => setSelectedDescription(e.target.value)}
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    required
                >
                    <option value="">-- Select Fee --</option>
                    {paymentDetails.map((fee, idx) => (
                        <option key={idx} value={fee.description}>
                            {fee.description}
                        </option>
                    ))}
                </select>
            </div>

            <InputField
                label="amount"
                inputProps={{ type: 'number', disabled: true, placeholder: `${selectedFee?.amount}` }}
            />

            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading || !selectedFee?.amount}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    `Pay ₦${selectedFee?.amount || "0"}`
                )}
            </Button>
        </form>
    )
}

const InputField = ({ label, value, inputProps, onChange }: { label: string, value?: string | number | undefined; inputProps?: React.InputHTMLAttributes<HTMLInputElement>; onChange?: (e: ChangeEvent<HTMLInputElement>) => void }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={label} className="capitalize text-xs text-gray-500">{label}</Label>
            <Input
                id={label}
                value={value}
                onChange={onChange}
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...inputProps}
            />
        </div>
    )
}