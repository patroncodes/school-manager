"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { StudentFormProps } from "../../..";
import InputField from "../InputField";

const schema = z.object({
  username: z
    .string()
    .min(3, "Username must be up to 3 characters")
    .max(20, "Username must be at most 20 characters"),
  subject: z.string().min(2, { message: "Lesson Name is required" }),
  class: z.string().min(2, { message: "Class is required" }),
  teacher: z.string().min(5, { message: "Teacher is required" }),
  student: z.string().min(5, { message: "Student is required" }),
  type: z.string().optional(),
  score: z.number({ message: "Score is required" }),
  date: z.date({ message: "Assignment Date is required" }),
});

const ResultForm = ({ type, data }: StudentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new result"
          : "Update Result Information"}
      </h1>

      <span className="text-xs text-gray-400 font-medium">
        Result Information
      </span>

      <div className="flex justify-between gap-4 flex-wrap">
        <InputField
          label="Subject"
          name="subject"
          defaultValue={data?.subject}
          register={register}
          error={errors.subject}
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
        <InputField
          label="Date"
          name="date"
          type="date"
          defaultValue={data?.date}
          register={register}
          error={errors.date}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-400 text-white p-4 rounded-md capitalize"
      >
        {type}
      </button>
    </form>
  );
};

export default ResultForm;
