"use client";

import { classSchema, ClassSchema } from "@/lib/zod/validation";
import { FormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField, { FormFieldType } from "../InputField";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import { classDefaultValues } from "@/lib/zod/defaultValues";
import {
  AccessLevel,
  CreateClassMutation,
  UpdateClassMutation,
  useCreateClassMutation,
  useGetGradesQuery,
  useGetStaffsQuery,
  useUpdateClassMutation,
} from "@/lib/generated/graphql/client";
import { handleGraphqlClientErrors } from "@/lib/utils";
import { useRouter } from "next/navigation";

const ClassForm = ({ type, data, setOpen }: FormProps) => {
  const router = useRouter();

  const [gradesResult] = useGetGradesQuery();
  const [teachersResult] = useGetStaffsQuery({
    variables: { filter: { isActive: true, accessLevel: AccessLevel.Teacher } },
  });
  const [createResult, createClass] = useCreateClassMutation();
  const [updateResult, updateClass] = useUpdateClassMutation();

  const grades = gradesResult?.data?.grades;
  const teachers = teachersResult?.data?.staffs;

  const form = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
    defaultValues: classDefaultValues(data),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const formData = {
      ...(type === "update" && { id: data.id }),
      ...values,
    };

    const res =
      type === "create"
        ? await createClass({ input: formData })
        : await updateClass({ input: formData });

    const mutationResult =
      type === "create"
        ? (res.data as CreateClassMutation)?.createClass
        : (res.data as UpdateClassMutation)?.updateClass;

    if (!mutationResult) {
      toast.error("Something went wrong");
      return;
    }

    if (
      mutationResult.__typename === "MutationCreateClassSuccess" ||
      mutationResult.__typename === "MutationUpdateClassSuccess"
    ) {
      toast.success(`Class ${type}d successfully!`);
      setOpen(false);
      router.refresh();
    } else {
      const error = handleGraphqlClientErrors(mutationResult);
      toast.error(error ?? "Something went wrong");
    }
  });

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <span className="text-xs font-medium text-gray-500">
          Class Information
        </span>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="Name"
            name="name"
            placeholder="A B or Gold"
          />

          <InputField
            label="Grade"
            control={form.control}
            name="gradeId"
            placeholder="Select grade"
            fieldType={FormFieldType.SELECT}
          >
            <SelectContent>
              <SelectItem value="0" disabled={true}>
                {gradesResult.fetching
                  ? "Loading"
                  : grades?.length === 0
                    ? "No grade was found"
                    : "Select grade"}
              </SelectItem>
              {grades?.map(({ id, name }) => (
                <SelectItem key={id} value={id!}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </InputField>

          <InputField
            label="Capacity"
            name="capacity"
            type="number"
            control={form.control}
            fieldType={FormFieldType.INPUT}
            placeholder="100"
          />

          <InputField
            label="Supervisors"
            control={form.control}
            name="supervisors"
            placeholder={
              teachers?.length === 0
                ? "No teacher was found"
                : "Select supervisors"
            }
            fieldType={FormFieldType.MULTI_SELECT}
            options={teachers ?? []}
          />
        </div>

        <button
          type="submit"
          disabled={createResult.fetching || updateResult.fetching}
          className="form-submit_btn"
        >
          {createResult.fetching || updateResult.fetching ? (
            <Loader2 className="animate-spin text-lamaYellow" />
          ) : (
            type
          )}
        </button>
      </form>
    </Form>
  );
};

export default ClassForm;
