"use client";

import { createFee, updateFee } from "@/lib/actions/fee";
import { FeeSchema, feeSchema } from "@/lib/zod/validation";
import { FormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "../InputField";

const FeeForm = ({ type, data, setOpen, relatedData }: FormProps) => {
  const router = useRouter();

  const { classes } = relatedData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FeeSchema>({
    resolver: zodResolver(feeSchema),
  });

  const [state, formAction, pending] = useActionState(
    type === "create" ? createFee : updateFee,
    { success: false, error: false },
  );

  useEffect(() => {
    if (state.success) {
      toast.success(`Fee has been ${type}d`);
      setOpen(false);

      router.refresh();
    } else if (state.error) {
      if (typeof state.error === "string") {
        toast.error(state.error);
      } else {
        toast.error(`Failed to ${type} fee`);
      }
    }
  }, [state, type, router, setOpen]);

  const onSubmit = handleSubmit((values) => {
    const formData = {
      ...(type === "update" && { id: data.id }),
      ...values,
      classId: values.classId === 0 ? null : values.classId,
    };

    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputField
          label="Description"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors.description}
        />

        <InputField
          label="Amount"
          name="amount"
          defaultValue={data?.amount}
          register={register}
          type="number"
          error={errors.amount}
          inputProps={{
            step: 1000,
          }}
        />

        <InputField
          label="Due Date"
          name="dueDate"
          type="date"
          defaultValue={data?.dueDate.toISOString().split("T")[0]}
          register={register}
          error={errors.dueDate}
          inputProps={{
            min: new Date().toISOString().split("T")[0],
          }}
        />

        <div className="flex w-full flex-col gap-2 md:w-1/4">
          <label htmlFor="classId" className="text-xs text-gray-500">
            Class
          </label>
          <select
            {...register("classId")}
            id="classId"
            className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
            defaultValue={data?.classId ?? ""}
          >
            <option value="">Select a class</option>
            {classes.map((item: { id: number; name: string }) => (
              <option key={item.id} value={item.id} className="py-1">
                {item.name}
              </option>
            ))}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong</span>
      )}
      <button type="submit" disabled={pending} className="form-submit_btn">
        {!pending ? type : <Loader2 className="animate-spin text-lamaYellow" />}
      </button>
    </form>
  );
};

export default FeeForm;
