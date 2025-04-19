"use client";

import { classSchema, ClassSchema } from "@/lib/validation";
import { FormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClass, updateClass } from "@/lib/actions";
import { Loader2 } from "lucide-react";

const ClassForm = ({ type, data, setOpen, relatedData }: FormProps) => {
  const router = useRouter()

  const { teachers, grades } = relatedData

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema)
  });

  const [state, formAction, pending] = useActionState(
    type === 'create' ? createClass : updateClass,
    { success: false, error: false }
  )

  useEffect(() => {
    if (state.success) {
      toast.success(`Class has been ${type}d`)
      setOpen(false)

      router.refresh()
    } else if (state.error) {
      if (typeof state.error === 'string') {
        toast.error(state.error)
      } else {
        toast.error(`Failed to ${type} class`)
      }
    }
  }, [state, type, router, setOpen])

  const onSubmit = handleSubmit((values) => {
    const formData = {
      ...(type === 'update' && { id: data.id }),
      ...values,
    }

    startTransition(() => {
      formAction(formData)
    })
  })

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <span className="text-xs text-gray-400 font-medium">
        Class Information
      </span>

      <div className="flex justify-between gap-4 flex-wrap">
        <InputField
          label="Class Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Capacity"
          name="capacity"
          type="number"
          defaultValue={data?.capacity}
          register={register}
          error={errors.capacity}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="gradeId" className="text-xs text-gray-500">
            Grade
          </label>
          <select
            {...register("gradeId")}
            id="gradeId"
            className="select-input"
            defaultValue={data?.gradeId}
          >
            {grades.map((grade: { id: number; level: number }) => (
              <option
                key={grade.id}
                value={grade.id}
                className="py-1"
              >
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">
              {errors.gradeId.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label htmlFor="supervisorId" className="text-xs text-gray-500">
            Supervisor
          </label>
          <select
            {...register("supervisorId")}
            id="supervisorId"
            className="select-input"
            defaultValue={data?.supervisorId}
          >
            {teachers.map((teacher: { id: string; name: string; surname: string }) => (
              <option key={teacher.id} value={teacher.id} className="py-1">
                {teacher.name + " " + teacher.surname}
              </option>
            ))}
          </select>
          {errors.supervisorId?.message && (
            <p className="text-xs text-red-400">
              {errors.supervisorId.message.toString()}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="form-submit_btn"
      >
        {!pending ? type : <Loader2 className="animate-spin text-lamaYellow" />}
      </button>
    </form>
  );
};

export default ClassForm;
