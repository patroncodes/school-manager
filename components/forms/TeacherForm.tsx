"use client";

import { useModalContext } from "@/context/ModalContext";
import { teachersSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Teacher } from "@prisma/client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { Button } from "../ui/button";

const TeacherForm = ({ type, data }: { type: 'create' | 'update'; data: Teacher }) => {
  const { setModalToOpen } = useModalContext()

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof teachersSchema>>({
    resolver: zodResolver(teachersSchema),
    defaultValues: {
      ...data,
      img: ""
    },
  });


  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <Button onClick={() => setModalToOpen(null)} className="absolute top-2 right-2 w-10 h-10 bg-lamaSky">
        <Image src="/close.svg" alt="close form" width={20} height={20} />
      </Button>
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Create a new teacher"
          : "Update Teacher Information"}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>

      <div className="flex justify-between gap-4 flex-wrap">
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors.username}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          defaultValue={data?.email || ''}
          register={register}
          error={errors.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={''}
          register={register}
          error={errors.password}
        />
      </div>

      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>

      <div className="flex justify-between gap-4 flex-wrap">
        <InputField
          label="First Name"
          name="firstName"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Last Name"
          name="lastName"
          defaultValue={data?.surname}
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType}
        />
        <InputField
          label="Date of Birth"
          name="birthday"
          type="date"
          defaultValue={data?.birthday}
          register={register}
          error={errors.birthday}
        />

        {/* SEX */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="sex" className="text-xs text-gray-500">
            Sex
          </label>
          <select
            {...register("sex")}
            id="sex"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.sex}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>

        {/* UPLOAD IMAGE */}
        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            htmlFor="img"
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
          >
            <Image src="/upload.svg" alt="upload" width={28} height={28} />
            <span>Upload a photo</span>
          </label>
          <input
            {...register("img")}
            id="img"
            type="file"
            className="hidden"
            defaultValue={data?.img || ''}
          />
          {errors.img?.message && (
            <p className="text-xs text-red-400">
              {errors.img.message.toString()}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="form-submit_btn rounded-md capitalize"
      >
        {type}
      </button>
    </form>
  );
};

export default TeacherForm;
