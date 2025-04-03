"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { Class } from "@/types";
import { classSchema } from "@/lib/validation";
import { Button } from "../ui/button";
import Image from "next/image";
import { useModalContext } from "@/context/ModalContext";

const ClassForm = ({ type, data }: { type: 'create' | 'update'; data: Class }) => {
  const { setModalToOpen } = useModalContext()

  const form = useForm<z.infer<typeof classSchema>>({
    resolver: zodResolver(classSchema),
    defaultValues: data,
  });

  const { register, handleSubmit, formState: { errors, isDirty } } = form

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <Button onClick={() => setModalToOpen(null)} className="absolute top-2 right-2 w-10 h-10 bg-lamaSky">
        <Image src="/close.svg" alt="close form" width={20} height={20} />
      </Button>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new class" : "Update Class Information"}
      </h1>

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
        <InputField
          label="Grade"
          name="grade"
          type="number"
          defaultValue={data?.grade}
          register={register}
          error={errors.grade}
        />
        <InputField
          label="Supervisor"
          name="supervisor"
          defaultValue={data?.supervisor}
          register={register}
          error={errors.supervisor}
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
  );
};

export default ClassForm;
