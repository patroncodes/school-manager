"use client";

import { bloodTypes } from "@/constants";
import { createTeacher, updateTeacher } from "@/lib/actions";
import { teacherSchema, TeacherSchema } from "@/lib/validation";
import { FormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "../InputField";

const TeacherForm = ({ type, data, setOpen, relatedData }: FormProps) => {
  const image = {
    secure_url: data?.img
  }

  const router = useRouter()
  const [img, setImg] = useState<any>(image)

  const { subjects } = relatedData

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema)
  });

  const [state, formAction, pending] = useActionState(
    type === 'create' ? createTeacher : updateTeacher,
    { success: false, error: false }
  )

  useEffect(() => {
    if (state.success) {
      toast.success(`Teacher has been ${type}d`)
      setOpen(false)

      router.refresh()
    } else if (state.error) {
      if (typeof state.error === 'string') {
        toast.error(state.error)
      } else {
        toast.error(`Failed to ${type} teacher`)
      }
    }
  }, [state, type, router, setOpen])

  const onSubmit = handleSubmit((values) => {
    const formData = {
      ...(type === 'update' && { id: data.id, oldImg: image?.secure_url }),
      ...values,
      img: img?.secure_url
    }

    startTransition(() => {
      formAction(formData)
    })
  })

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
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
          defaultValue={data?.email}
          register={register}
          error={errors.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
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
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="bloodType" className="text-xs text-gray-500">
            BloodType
          </label>
          <select
            {...register("bloodType")}
            id="bloodType"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.bloodType}
          >
            {bloodTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.bloodType?.message && (
            <p className="text-xs text-red-400">
              {errors.bloodType.message.toString()}
            </p>
          )}
        </div>
        <InputField
          label="Date of Birth"
          name="birthday"
          type="date"
          defaultValue={data?.birthday.toISOString().split("T")[0]}
          register={register}
          error={errors.birthday}
          inputProps={
            {
              min: new Date(new Date().setFullYear(new Date().getFullYear() - 60)).toISOString().split("T")[0],
              max: new Date().toISOString().split("T")[0]
            }
          }
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
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>

        {/* SUBJECTS */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="subjects" className="text-xs text-gray-500">
            Subjects
          </label>
          <select
            {...register("subjects")}
            multiple
            id="subjects"
            className="select-input"
            defaultValue={data?.subjects?.map((subject: { id: string }) => subject.id) ?? []}
          >
            {subjects.map((subject: { id: string; name: string }) => (
              <option key={subject.id} value={subject.id} className="py-1">
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjects?.message && (
            <p className="text-xs text-red-400">
              {errors.subjects.message.toString()}
            </p>
          )}
        </div>

        {/* PROFILE PHOTO */}
        <CldUploadWidget
          uploadPreset="school-manager"
          onSuccess={(result, { widget }) => {
            setImg(result?.info)
            widget.close()
          }}
        >
          {({ open }) => {
            return (
              <div
                className="w-full md:w-1/4"
                onClick={(e) => {
                  e.preventDefault()
                  open()
                }}
              >
                {img.secure_url ? (
                  <CldImage
                    width="200"
                    height="300"
                    src={img.secure_url}
                    alt="profile photo"
                    className="w-full h-auto object-center rounded-md"
                  />
                ) : (
                  <div className="flex-center w-full py-8 rounded-md border-2 border-dashed border-gray-300 text-xs text-gray-500 gap-2 cursor-pointer">
                    <Image src="/upload.svg" alt="upload" width={28} height={28} />
                    <span>Upload a photo</span>
                  </div>
                )}

              </div>
            );
          }}
        </CldUploadWidget>
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

export default TeacherForm;
