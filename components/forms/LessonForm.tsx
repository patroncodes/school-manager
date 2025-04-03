"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { Lesson } from "@/types";
import { lessonSchema } from "@/lib/validation";
import { useModalContext } from "@/context/ModalContext";
import { Button } from "../ui/button";
import Image from "next/image";
import { Form } from "../ui/form";

const LessonForm = ({ type, data }: { type: 'create' | 'update'; data: Lesson }) => {
  const { setModalToOpen } = useModalContext()

  const form = useForm<z.infer<typeof lessonSchema>>({
    resolver: zodResolver(lessonSchema),
    defaultValues: data,
  });

  const { register, handleSubmit, formState: { errors, isDirty } } = form

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <Form {...form}>
      <form className="flex flex-col gap-8" onSubmit={onSubmit}>
        <Button onClick={() => setModalToOpen(null)} className="absolute top-2 right-2 w-10 h-10 bg-lamaSky">
          <Image src="/close.svg" alt="close form" width={20} height={20} />
        </Button>
        <h1 className="text-xl font-semibold">
          {type === "create"
            ? "Create a new lesson"
            : "Update Lesson Information"}
        </h1>

        <span className="text-xs text-gray-400 font-medium">
          Lesson Information
        </span>

        <div className="flex justify-between gap-4">
          <InputField
            label="Subject"
            name="subject"
            defaultValue={data?.subject}
            register={register}
            error={errors.name}
          />

          <InputField
            label="Class"
            name="class"
            defaultValue={data?.class}
            register={register}
            error={errors.class}
          />

          <InputField
            label="Teacher"
            name="teacher"
            defaultValue={data?.teacher}
            register={register}
            error={errors.teacher}
          />
        </div>

        <Button
          type="submit"
          disabled={!isDirty}
          className="form-submit_btn"
        >
          {type}
        </Button>
      </form>
    </Form>
  );
};

export default LessonForm;
