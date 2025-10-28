"use client";

import { createParent, updateParent } from "@/lib/actions";
import { ParentSchema, parentSchema } from "@/lib/zod/validation";
import { FormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "../InputField";

const ParentForm = ({ type, data, setOpen }: FormProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentSchema>({
    resolver: zodResolver(parentSchema),
  });

  const [state, formAction, pending] = useActionState(
    type === "create" ? createParent : updateParent,
    { success: false, error: false },
  );

  useEffect(() => {
    if (state.success) {
      toast.success(`Parent has been ${type}d`);
      setOpen(false);

      router.refresh();
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
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <span className="text-xs font-medium text-gray-400">
        Authentication Information
      </span>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

      <span className="text-xs font-medium text-gray-400">
        Personal Information
      </span>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

        <InputField
          label="Sex"
          register={register}
          name="sex"
          defaultValue={data?.sex}
          error={errors.sex}
          select
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </InputField>
      </div>

      {state.error && (
        <span className="text-red-500">
          {typeof state.error === "string"
            ? state.error
            : `Failed to ${type} student`}
        </span>
      )}
      <button type="submit" disabled={pending} className="form-submit_btn">
        {!pending ? type : <Loader2 className="animate-spin text-lamaYellow" />}
      </button>
    </form>
  );
};

export default ParentForm;
