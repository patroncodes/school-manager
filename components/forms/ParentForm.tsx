"use client";

import { ParentSchema, parentSchema } from "@/lib/zod/validation";
import { FormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import InputField, { FormFieldType } from "../InputField";
import { Form } from "@/components/ui/form";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { userSex } from "@/constants";

const ParentForm = ({ type, data, setOpen }: FormProps) => {
  const router = useRouter();

  const form = useForm<ParentSchema>({
    resolver: zodResolver(parentSchema),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const formData = {
      ...(type === "update" && { id: data.id }),
      ...values,
    };

    console.log(formData);
  });

  const isLoading = false;

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <span className="text-xs font-medium text-gray-400">
          Authentication Information
        </span>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Username"
            name="primaryId"
            control={form.control}
            fieldType={FormFieldType.INPUT}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            control={form.control}
            fieldType={FormFieldType.INPUT}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            control={form.control}
            fieldType={FormFieldType.INPUT}
          />
        </div>

        <span className="text-xs font-medium text-gray-400">
          Personal Information
        </span>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="First Name"
            name="name"
            control={form.control}
            fieldType={FormFieldType.INPUT}
          />
          <InputField
            label="Surname"
            name="surname"
            control={form.control}
            fieldType={FormFieldType.INPUT}
          />
          <InputField
            label="Phone"
            name="phone"
            type="tel"
            control={form.control}
            fieldType={FormFieldType.INPUT}
          />
          <InputField
            label="Address"
            name="address"
            control={form.control}
            fieldType={FormFieldType.INPUT}
          />

          <InputField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            label="Gender"
            name="sex"
          >
            <SelectContent>
              {userSex.map((sex) => (
                <SelectItem key={sex} value={sex.toUpperCase()}>
                  {sex}
                </SelectItem>
              ))}
            </SelectContent>
          </InputField>
        </div>

        <button
          type="submit"
          disabled={!form.formState.isDirty || isLoading}
          className="form-submit_btn"
        >
          {!isLoading ? (
            type
          ) : (
            <Loader2 className="animate-spin text-lamaYellow" />
          )}
        </button>
      </form>
    </Form>
  );
};

export default ParentForm;
