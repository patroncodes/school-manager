"use client";

import { createAnnouncement, updateAnnouncement } from "@/lib/actions";
import { announcementSchema, AnnouncementSchema } from "@/lib/validation";
import { FormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "../InputField";
import { Label } from "../ui/label";

const AnnouncementForm = ({ type, data, setOpen, relatedData }: FormProps) => {
  const router = useRouter();

  const { classes } = relatedData

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementSchema>({
    resolver: zodResolver(announcementSchema)
  });

  const [state, formAction, pending] = useActionState(
    type === 'create' ? createAnnouncement : updateAnnouncement,
    { success: false, error: false }
  )

  useEffect(() => {
    if (state.success) {
      toast.success(`Announcement has been ${type}d`)
      setOpen(false)

      router.refresh()
    } else if (state.error) {
      if (typeof state.error === 'string') {
        toast.error(state.error)
      } else {
        toast.error(`Failed to ${type} announcement`)
      }
    }
  }, [state, type, router, setOpen])

  const onSubmit = handleSubmit((values) => {
    const formData = {
      ...(type === 'update' && { id: data.id }),
      ...values,
      classId: values.classId === 0 ? null : values.classId
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
          label="Date"
          name="date"
          type="date"
          defaultValue={data?.date.toISOString().split("T")[0]}
          register={register}
          error={errors.date}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="classId" className="text-xs text-gray-500">
            Class
          </label>
          <select
            {...register("classId")}
            id="classId"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.classId ?? ""}
          >
            <option value="">
              Select a class
            </option>
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

        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="description" className="text-xs text-gray-500">
            Description
          </Label>
          <textarea
            id="description"
            {...register("description")}
            className="custom-scrollbar ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.description}
          />
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

export default AnnouncementForm;
