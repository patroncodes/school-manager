"use client";

import { subjectSchema, SubjectSchema } from "@/lib/zod/validation";
import { FormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import InputField, { FormFieldType } from "../InputField";
import { Form } from "@/components/ui/form";
import {
  AccessLevel,
  CreateSubjectMutation,
  UpdateSubjectMutation,
  useCreateSubjectMutation,
  useGetStaffsQuery,
  useUpdateSubjectMutation,
} from "@/lib/generated/graphql/client";
import { toast } from "sonner";
import { handleGraphqlClientErrors } from "@/lib/utils";

const SubjectForm = ({ type, data, setOpen }: FormProps) => {
  const router = useRouter();
  const [teachersResult] = useGetStaffsQuery({
    variables: { filter: { isActive: true, accessLevel: AccessLevel.Teacher } },
  });

  const [subjectsCreateResult, createSubject] = useCreateSubjectMutation();
  const [subjectsUpdateResult, updateSubject] = useUpdateSubjectMutation();

  const teachers = teachersResult.data?.staffs;

  const form = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: data?.name ?? "",
      teachers:
        data?.teachers.map((teacher: { id: string }) => teacher.id) ?? [],
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const formData = {
      ...(type === "update" && { id: data.id, relationId: data?.teachers?.id }),
      ...values,
    };

    const response =
      type === "create"
        ? await createSubject({ input: formData })
        : await updateSubject({ input: formData });

    const mutationResult =
      type === "create"
        ? (response.data as CreateSubjectMutation)?.createSubject
        : (response.data as UpdateSubjectMutation)?.updateSubject;

    if (!mutationResult) {
      toast.error("Something went wrong");
      return;
    }

    if (
      mutationResult.__typename === "MutationCreateSubjectSuccess" ||
      mutationResult.__typename === "MutationUpdateSubjectSuccess"
    ) {
      toast.success(`Subject ${type}d successfully!`);
      setOpen(false);
      router.refresh();
    } else {
      const error = handleGraphqlClientErrors(mutationResult);
      toast.error(error ?? "Something went wrong");
    }
  });

  const formattedTeachers = teachers?.map(
    (teacher: { id: string; name: string; surname: string }) => ({
      id: teacher.id,
      name: teacher.name + " " + teacher.surname,
    }),
  );

  const isLoading =
    subjectsCreateResult.fetching || subjectsUpdateResult.fetching;

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <span className="text-xs font-medium text-gray-400">
          Subject Information
        </span>

        <div className="flex w-full flex-wrap justify-between gap-4">
          <InputField
            label="Name"
            control={form.control}
            name="name"
            fieldType={FormFieldType.INPUT}
            inputProps={{ autoFocus: true }}
          />

          <InputField
            label="Teachers"
            control={form.control}
            name="teachers"
            placeholder="Select teachers"
            fieldType={FormFieldType.MULTI_SELECT}
            options={formattedTeachers}
          />
        </div>

        <button
          type="submit"
          className="form-submit_btn"
          disabled={!form.formState.isDirty || isLoading}
        >
          {!isLoading ? type : <Loader2 className="animate-spin" />}
        </button>
      </form>
    </Form>
  );
};

export default SubjectForm;
