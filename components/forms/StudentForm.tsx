"use client";

import { bloodTypes } from "@/constants";
import { createStudent, updateStudent } from "@/lib/actions";
import { StudentSchema, studentSchema } from "@/lib/validation";
import { FormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { CldImage, CldUploadWidget } from 'next-cloudinary'
import Image from "next/image";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "../InputField";
import UserSearchForm from "../UserSearchForm";
import { Label } from "../ui/label";

const StudentForm = ({ type, data, setOpen, relatedData }: FormProps) => {
  const image = {
    secure_url: data?.img
  }
  const router = useRouter()
  const [img, setImg] = useState<any>(image)
  const [user, setUser] = useState({
    id: data?.parent.id ?? "",
    name: data?.parent.name ?? "",
    surname: data?.parent.surname ?? ""
  })

  const { classes, grades } = relatedData

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema)
  });

  const [state, formAction, pending] = useActionState(
    type === 'create' ? createStudent : updateStudent,
    { success: false, error: false }
  )

  useEffect(() => {
    if (state.success) {
      toast.success(`Student has been ${type}d`)
      setOpen(false)

      router.refresh()
    } else if (state.error) {
      if (typeof state.error === 'string') {
        toast.error(state.error)
      } else {
        toast.error(`Failed to ${type} student`)
      }
    }
  }, [state, type, router, setOpen])

  const onSubmit = handleSubmit((values) => {
    const hasNewImg = image?.secure_url !== img?.secure_url

    const formData = {
      ...(type === 'update' && {
        id: data.id,
        ...(hasNewImg && { oldImg: image?.secure_url })
      }),
      ...values,
      parentId: user.id,
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

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="gradeId" className="text-xs text-gray-500">
            Grade
          </label>
          <select
            {...register("gradeId")}
            id="gradeId"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.gradeId}
          >
            {grades.map((grade: { id: number; level: number }) => (
              <option key={grade.id} value={grade.id} className="py-1">
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">
              {errors.gradeId.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="classId" className="text-xs text-gray-500">
            Class
          </label>
          <select
            {...register("classId")}
            id="classId"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.classId}
          >
            {classes.map((item: { id: number; name: string; capacity: number; _count: { students: number } }) => (
              <option key={item.id} value={item.id} className="py-1">
                {item.name} - {item._count.students + "/" + item.capacity}
              </option>
            ))}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>

        {/* PARENT ID */}
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <Label htmlFor="parentId" className="text-sm text-gray-700">
            Parent
          </Label>
          <div className="flex items-center gap-2 w-full">
            <input
              id="parentId"
              readOnly
              value={user.id ? `${user.name} ${user.surname}` : "Select Parent"}
              {...register("parentId")}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            />
            <UserSearchForm type="parent" setUser={setUser} />
          </div>
          {errors.parentId?.message && (
            <p className="text-xs text-red-400">
              {errors.parentId.message.toString()}
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

export default StudentForm;
