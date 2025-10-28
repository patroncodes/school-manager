"use client";

import { createLesson, updateLesson } from "@/lib/actions";
import { toDatetimeLocal } from "@/lib/utils";
import { LessonSchema, lessonSchema } from "@/lib/zod/validation";
import { FormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "../InputField";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const LessonForm = ({ type, data, setOpen, relatedData }: FormProps) => {
  const router = useRouter();

  const { teachers, subjects, classes } = relatedData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
  });

  const [state, formAction, pending] = useActionState(
    type === "create" ? createLesson : updateLesson,
    { success: false, error: false },
  );

  useEffect(() => {
    if (state.success) {
      toast.success(`Lesson has been ${type}d`);
      setOpen(false);

      router.refresh();
    } else if (state.error) {
      if (typeof state.error === "string") {
        toast.error(state.error);
      } else {
        toast.error(`Failed to ${type} lesson`);
      }
    }
  }, [state, type, router, setOpen]);

  const onSubmit = handleSubmit((values) => {
    const formData = {
      ...(type === "update" && { id: data.id }),
      ...values,
    };
    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <span className="text-xs font-medium text-gray-400">
        Lesson Information
      </span>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputField
          label="Lesson Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
          inputProps={{ autoFocus: true }}
        />

        <div className="flex w-full flex-col gap-2 md:w-1/4">
          <Label htmlFor="description" className="text-xs text-gray-500">
            Description
          </Label>
          <Textarea
            id="description"
            {...register("description")}
            className="custom-scrollbar w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
            defaultValue={data?.description?.join("; ") ?? ""}
          />
        </div>

        <div className="flex w-full flex-col gap-2 md:w-1/4">
          <label htmlFor="classId" className="text-xs text-gray-500">
            Class
          </label>
          <select
            {...register("classId")}
            id="classId"
            className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
            defaultValue={data?.classId}
          >
            {classes?.map((item: { id: number; name: string }) => (
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

        <div className="flex w-full flex-col gap-2 md:w-1/4">
          <label htmlFor="teacherId" className="text-xs text-gray-500">
            Teacher
          </label>
          <select
            {...register("teacherId")}
            id="teacherId"
            className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
            defaultValue={data?.teacherId}
          >
            {teachers?.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option key={teacher.id} value={teacher.id} className="py-1">
                  {teacher.name + " " + teacher.surname}
                </option>
              ),
            )}
          </select>
          {errors.teacherId?.message && (
            <p className="text-xs text-red-400">
              {errors.teacherId.message.toString()}
            </p>
          )}
        </div>

        <div className="flex w-full flex-col gap-2 md:w-1/4">
          <label htmlFor="subjectId" className="text-xs text-gray-500">
            Subject
          </label>
          <select
            {...register("subjectId")}
            id="subjectId"
            className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
            defaultValue={data?.subjectId}
          >
            {subjects?.map((subject: { id: number; name: string }) => (
              <option key={subject.id} value={subject.id} className="py-1">
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjectId?.message && (
            <p className="text-xs text-red-400">
              {errors.subjectId.message.toString()}
            </p>
          )}
        </div>

        <InputField
          label="Start Time"
          name="startTime"
          type="datetime-local"
          defaultValue={
            data?.startTime ? toDatetimeLocal(data?.startTime) : undefined
          }
          register={register}
          error={errors.startTime}
          inputProps={{
            min: new Date().toISOString().slice(0, 16),
          }}
        />
        <InputField
          label="End Time"
          name="endTime"
          type="datetime-local"
          defaultValue={
            data?.endTime ? toDatetimeLocal(data?.endTime) : undefined
          }
          register={register}
          error={errors.endTime}
          inputProps={{
            min: new Date().toISOString().slice(0, 16),
          }}
        />

        <div className="flex w-full flex-col gap-2 md:w-1/4">
          <Label htmlFor="materials" className="text-xs text-gray-500">
            Materials
          </Label>
          <Textarea
            id="materials"
            {...register("materials")}
            className="custom-scrollbar w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
            defaultValue={data?.materials?.join("; ") ?? ""}
          />
        </div>

        <div className="flex w-full flex-col gap-2 md:w-1/4">
          <Label htmlFor="objectives" className="text-xs text-gray-500">
            Objectives
          </Label>
          <Textarea
            id="objectives"
            {...register("objectives")}
            className="custom-scrollbar max-h-16 w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
            defaultValue={data?.objectives?.join("; ") ?? ""}
          />
        </div>
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong</span>
      )}
      <button type="submit" className="form-submit_btn" disabled={pending}>
        {!pending ? type : <Loader2 className="animate-spin" />}
      </button>
    </form>
  );
};

export default LessonForm;
