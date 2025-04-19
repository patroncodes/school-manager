"use client";

import { createSubject, updateSubject } from "@/lib/actions";
import { subjectSchema, SubjectSchema } from "@/lib/validation";
import { FormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "../InputField";

const SubjectForm = ({ type, data, setOpen, relatedData }: FormProps) => {
  const router = useRouter();

  const { teachers } = relatedData

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema)
  });

  const [state, formAction, pending] = useActionState(
    type === 'create' ? createSubject : updateSubject,
    { success: false, error: false }
  )

  useEffect(() => {
    if (state.success) {
      toast.success(`Subject has been ${type}d`)
      setOpen(false)

      router.refresh()
    } else if (state.error) {
      if (typeof state.error === 'string') {
        toast.error(state.error)
      } else {
        toast.error(`Failed to ${type} subject`)
      }
    }
  }, [state, type, router, setOpen])

  const onSubmit = handleSubmit((values) => {
    const formData = {
      ...(type === 'update' && { id: data.id }),
      name: values.name,
      teachers: values.teachers
    }
    startTransition(() => {
      formAction(formData)
    })
  })

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <span className="text-xs text-gray-400 font-medium">
        Subject Information
      </span>

      <div className="flex gap-4">
        <InputField
          label="Subject Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
          inputProps={{ autoFocus: true }}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label htmlFor="sex" className="text-xs text-gray-500">
            Teachers
          </label>
          <select
            multiple
            {...register("teachers")}
            id="teachers"
            className="ring-[1.5px] ring-gray-500 p-2 rounded-md text-sm w-full"
            defaultValue={data?.teachers.map((teacher: { id: string }) => teacher.id)}
          >
            {teachers.map((teacher: { id: string; name: string; surname: string }) => (
              <option key={teacher.id} value={teacher.id} className="py-1">
                {teacher.name + " " + teacher.surname}
              </option>
            ))}
          </select>
          {errors.teachers?.message && (
            <p className="text-xs text-red-400">
              {errors.teachers.message.toString()}
            </p>
          )}
        </div>
      </div>

      {state.error && <span className="text-red-500">Something went wrong</span>}
      <button
        type="submit"
        className="form-submit_btn"
        disabled={pending}
      >
        {!pending ? type : <Loader2 className="animate-spin" />}
      </button>
    </form>
  );
};

export default SubjectForm;
