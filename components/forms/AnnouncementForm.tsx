"use client";

import { announcementSchema, AnnouncementSchema } from "@/lib/zod/validation";
import { FormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import InputField, { FormFieldType } from "../InputField";
import { Form } from "@/components/ui/form";
import { useGetClassesQuery } from "@/lib/generated/graphql/client";
import { SelectContent, SelectItem } from "@/components/ui/select";

const AnnouncementForm = ({ type, data, setOpen }: FormProps) => {
  const router = useRouter();
  const [classesResult] = useGetClassesQuery();
  const classes = classesResult?.data?.classes ?? [];

  const form = useForm<AnnouncementSchema>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: data?.title ?? "",
      content: data?.content ?? "",
      classId: data?.classId ?? "",
      gradeId: data?.gradeId ?? "",
    },
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
      <form className="flex flex-col gap-8" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Title"
            name="title"
            control={form.control}
            fieldType={FormFieldType.INPUT}
          />

          <InputField
            label="Description"
            name="description"
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
          />

          <InputField
            label="Class"
            name="classId"
            control={form.control}
            fieldType={FormFieldType.SELECT}
          >
            <SelectContent>
              {classes.map(({ id, name }) => (
                <SelectItem key={id} value={id!} className="py-1">
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
            <option className="py-1" value={-1}>
              Select a class
            </option>
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

export default AnnouncementForm;
