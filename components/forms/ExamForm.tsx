"use client";

import { examSchema, ExamSchema } from "@/lib/validation";
import { FormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "../InputField";
import { createExam, updateExam } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { toDatetimeLocal } from "@/lib/utils";

const ExamForm = ({ type, data, setOpen, relatedData }: FormProps) => {
  const router = useRouter();

  const { lessons } = relatedData

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema)
  });

  const [state, formAction, pending] = useActionState(
    type === 'create' ? createExam : updateExam,
    { success: false, error: false }
  )

  useEffect(() => {
    if (state.success) {
      toast.success(`Exam has been ${type}d`)
      setOpen(false)

      router.refresh()
    } else if (state.error) {
      if (typeof state.error === 'string') {
        toast.error(state.error)
      } else {
        toast.error(`Failed to ${type} exam`)
      }
    }
  }, [state, type, router, setOpen])

  const onSubmit = handleSubmit((values) => {
    const formData = {
      ...(type === 'update' && { id: data.id }),
      ...values
    }

    startTransition(() => {
      formAction(formData)
    })
  })


  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <div className="flex justify-between gap-4 flex-wrap">
        <InputField
          label="Title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors.title}
        />
        <InputField
          label="Start Time"
          name="startTime"
          type="datetime-local"
          defaultValue={data?.startTime ? toDatetimeLocal(data?.startTime) : undefined}
          register={register}
          error={errors.startTime}
        />
        <InputField
          label="End Time"
          name="endTime"
          type="datetime-local"
          defaultValue={data?.endTime ? toDatetimeLocal(data?.endTime) : undefined}
          register={register}
          error={errors.endTime}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="gradeId" className="text-xs text-gray-500">
            Lesson
          </label>
          <select
            {...register("lessonId")}
            id="lessonId"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.lessonId}
          >
            {lessons.map((lesson: { id: number; name: string }) => (
              <option key={lesson.id} value={lesson.id} className="py-1">
                {lesson.name}
              </option>
            ))}
          </select>
          {errors.lessonId?.message && (
            <p className="text-xs text-red-400">
              {errors.lessonId.message.toString()}
            </p>
          )}
        </div>
      </div>

      {state.error && <span className="text-red-500">Something went wrong</span>}
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

export default ExamForm;
