"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { Parent } from "@prisma/client";
import { parentSchema } from "@/lib/validation";
import { Button } from "../ui/button";
import Image from "next/image";
import { useModalContext } from "@/context/ModalContext";

const ParentForm = ({ type, data }: { type: 'create' | 'update'; data?: Parent }) => {
  const { setModalToOpen } = useModalContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof parentSchema>>({
    resolver: zodResolver(parentSchema),
    defaultValues: data,
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
          ? "Create a new parent"
          : "Update Parent Information"}
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
          defaultValue={data?.email || ""}
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
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Surname"
          name="surname"
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

        {/* SEX */}
        {/* <div className="flex flex-col gap-2 w-full md:w-1/4">
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
        </div> */}
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

export default ParentForm;
