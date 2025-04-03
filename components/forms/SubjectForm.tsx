"use client";

import { useModalContext } from "@/context/ModalContext";
import { subjectSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Subject } from "@prisma/client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

const SubjectForm = ({ type, data }: { type: 'create' | 'update'; data: Subject }) => {
  const { setModalToOpen } = useModalContext()

  const form = useForm<z.infer<typeof subjectSchema>>({
    resolver: zodResolver(subjectSchema),
    defaultValues: data,
  });

  const { register, handleSubmit, formState: { errors } } = form

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
            ? "Create a new subject"
            : "Update Subject Information"}
        </h1>

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
          />

          <InputField
            label="Teachers"
            name="teachers"
            defaultValue={data?.name}
            register={register}
            error={errors.teachers}
          />
        </div>

        <button
          type="submit"
          className="form-submit_btn rounded-md capitalize"
        >
          {type}
        </button>
      </form>
    </Form>
  );
};

export default SubjectForm;
