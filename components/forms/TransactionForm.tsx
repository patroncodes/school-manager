"use client"

import type React from "react"

import { initiateTransaction } from "@/lib/actions"
import { transactionSchema, TransactionSchema } from "@/lib/validation"
import { UserRole } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Fee, Student } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { startTransition, useActionState, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import InputField from "../InputField"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"

type FeeType = Pick<Fee, 'id' | 'amount' | 'description'>
type StudentType = Pick<Student, 'id' | 'name' | 'surname'>

interface PaymentFormProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    relatedData: {
        email?: string;
        feeId?: number;
        studentId?: string;
        paymentDetails: FeeType[];
        userRole: UserRole;
        students: StudentType[]
    }
}

const TransactionForm = ({ setOpen, relatedData }: PaymentFormProps) => {
    const router = useRouter()
    const [selectedFee, setSelectedFee] = useState<FeeType | null>(null)
    const [selectedStudent, setSelectedStudent] = useState<StudentType | null>(null)

    const { email, paymentDetails, userRole, students } = relatedData

    const defaultAmount = paymentDetails.find(fee => fee.id === relatedData?.feeId)?.amount || 0

    const {
        watch,
        setValue,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TransactionSchema>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            email: email,
            amount: defaultAmount,
            feeId: relatedData?.feeId || parseInt(""),
            studentId: relatedData?.studentId || "",
            extraDescription: ""
        }
    });

    const feeId = watch("feeId")
    const studentId = watch("studentId")
    const amount = watch("amount")

    const [state, formAction, pending] = useActionState(initiateTransaction,
        { success: false, error: false, data: '' }
    )

    useEffect(() => {
        if (state.success && state.data) {
            toast.success("Payment Initialized", { description: "Redirecting to payment page" })
            setOpen(false)

            router.push(state.data)
        } else if (state.error) {
            if (typeof state.error === 'string') {
                toast.error(state.error)
            } else {
                toast.error(`Payment initialization failed`)
            }
        }
    }, [state, router, setOpen])

    useEffect(() => {
        const feeSelected = paymentDetails.find(fee => fee.id.toString() === feeId.toString())
        if (feeSelected) {
            setSelectedFee({
                id: feeSelected.id,
                amount: feeSelected.amount,
                description: feeSelected.description
            })

            setValue("amount", feeSelected.amount, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true
            })
        }

        const studentSelected = students?.find(student => student.id === studentId)
        if (studentSelected) {
            setSelectedStudent({
                id: studentSelected.id,
                name: studentSelected.name,
                surname: studentSelected.surname,
            })
        }
    }, [feeId, studentId, paymentDetails, students, setValue])

    const onSubmit = handleSubmit((values) => {
        if (!selectedFee || !selectedStudent) return;

        const formData = {
            ...values,
            userRole,
            fee: selectedFee,
            student: selectedStudent
        }

        startTransition(() => {
            formAction(formData)
        })
    })

    return (
        <form onSubmit={onSubmit} className="flex items-center justify-between gap-4 flex-wrap">
            <InputField
                label="Email"
                name="email"
                type="email"
                register={register}
                error={errors.email}
                containerClassName="md:w-[45%]"
            />

            <div className="flex flex-col gap-2 w-full md:w-[45%]">
                <Label htmlFor="studentId" className="text-xs text-gray-500">
                    Student
                </Label>
                <select
                    {...register("studentId")}
                    id="studentId"
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                >
                    {students?.map((student: { id: string; name: string; surname: string }) => (
                        <option key={student.id} value={student.id} className="py-1">
                            {student.name + " " + student.surname}
                        </option>
                    ))}
                </select>
                {errors.studentId?.message && (
                    <p className="text-xs text-red-400">
                        {errors.studentId.message.toString()}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-2 w-full md:w-[45%]">
                <Label htmlFor="feeId" className="text-xs text-gray-500">
                    Fee
                </Label>
                <select
                    {...register("feeId")}
                    id="feeId"
                    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                >
                    {paymentDetails?.map((fee) => (
                        <option key={fee.id} value={fee.id} className="py-1">
                            {fee.description}
                        </option>
                    ))}
                </select>
                {errors.feeId?.message && (
                    <p className="text-xs text-red-400">
                        {errors.feeId.message.toString()}
                    </p>
                )}
            </div>

            <InputField
                label="Amount"
                name="amount"
                type="amount"
                register={register}
                error={errors.amount}
                containerClassName="md:w-[45%]"
                inputProps={{ disabled: true }}
            />

            <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="description" className="text-xs text-gray-500">
                    Description
                </Label>
                <Textarea
                    id="description"
                    {...register("extraDescription")}
                    className="custom-scrollbar ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                />
            </div>

            {state?.error && <span className="text-red-500">Something went wrong</span>}
            <button
                type="submit"
                className="form-submit_btn w-full mt-5"
                disabled={pending}
            >
                {!pending ? `Pay ${amount}` : <Loader2 className="animate-spin" />}
            </button>
        </form>
    )
}

export default TransactionForm