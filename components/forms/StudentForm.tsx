"use client";

import { StudentSchema, studentSchema } from "@/lib/zod/validation";
import { FormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField, { FormFieldType } from "../InputField";
import UserSearchForm from "../UserSearchForm";
import FileUploader from "@/components/FileUploader";
import { Form } from "@/components/ui/form";
import { SelectContent, SelectItem } from "@/components/ui/select";
import { relationships, userSex } from "@/constants";
import {
  SexEnum,
  useCreateStudentMutation,
  useGetClassesQuery,
  useGetGradesQuery,
  useGetProgramsQuery,
} from "@/lib/generated/graphql/client";
import { studentDefaultValues } from "@/lib/zod/defaultValues";
import { Button } from "@/components/ui/button";
import { handleGraphqlClientErrors } from "@/lib/utils";

const StudentForm = ({ type, data, setOpen, relatedData }: FormProps) => {
  const router = useRouter();

  const { schoolSlug } = relatedData ?? {};

  const form = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema(schoolSlug)),
    defaultValues: studentDefaultValues(data, relatedData),
  });

  const [programs] = useGetProgramsQuery();

  const programId = form.watch("programId");
  const [grades] = useGetGradesQuery({
    pause: !programId,
    variables: { where: { programId: programId! } },
  });

  const gradeId = form.watch("gradeId");
  const [classes] = useGetClassesQuery({
    variables: { where: { gradeId: gradeId! } },
    pause: !gradeId,
  });

  const [mutationResult, createStudent] = useCreateStudentMutation();

  const onSubmit = form.handleSubmit(async (values) => {
    const hasNewImg = data?.img !== values.img;

    const formData = {
      ...(type === "update" && {
        id: data.id,
        omgImg: hasNewImg ? data?.img : null,
      }),
      ...values,
      sex: values.sex as SexEnum,
      primaryGuardian: values.primaryGuardian.id,
      secondaryGuardian: values?.secondaryGuardian?.id,
    };

    delete formData.gradeId;

    const response = await createStudent({ input: formData });

    const typeName = response.data?.createStudent?.__typename;
    if (typeName === "MutationCreateStudentSuccess") {
      toast.success(`Student ${type}d successfully!`);
      setOpen(false);
      router.refresh();
    } else {
      const error = handleGraphqlClientErrors(typeName);
      toast.error(error ?? "Something went wrong");
    }
  });

  const selectedProgram = programs?.data?.programs?.find(
    ({ id }) => programId === id,
  )?.name;

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <span className="text-xs font-medium text-gray-400">
          Personal Information
        </span>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Registration Number"
            control={form.control}
            name="registrationNumber"
            placeholder="202"
            fieldType={FormFieldType.INPUT}
          />
          <InputField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="First Name"
            name="name"
          />

          <InputField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="Surname"
            name="surname"
          />
          <InputField
            control={form.control}
            fieldType={FormFieldType.DATE_PICKER}
            label="Date of Birth"
            name="birthday"
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

          <InputField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="Address"
            name="address"
          />

          <FileUploader
            control={form.control}
            name="img"
            folder={schoolSlug ? `${schoolSlug}/students` : "students"}
            label="Students"
          />
        </div>

        <span className="text-xs font-medium text-gray-400">
          Guardian Information
        </span>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UserSearchForm
            type="parent"
            label="Primary Guardian"
            control={form.control}
            name="primaryGuardian"
          />

          <InputField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            label="Relationship"
            name="primaryGuardianRelationship"
          >
            <SelectContent>
              {relationships.map((relationship) => (
                <SelectItem value={relationship} key={relationship}>
                  {relationship}
                </SelectItem>
              ))}
            </SelectContent>
          </InputField>

          <UserSearchForm
            type="parent"
            label="Secondary Guardian"
            control={form.control}
            name="secondaryGuardian"
          />

          <InputField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            label="Relationship"
            name="secondaryGuardianRelationship"
            placeholder="Select relationship"
          >
            <SelectContent>
              {/*<SelectItem value={""}>Select</SelectItem>*/}
              {relationships.map((relationship) => (
                <SelectItem value={relationship} key={relationship}>
                  {relationship}
                </SelectItem>
              ))}
            </SelectContent>
          </InputField>
        </div>

        <span className="text-xs font-medium text-gray-400">
          Class Information
        </span>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            label="Program"
            name="programId"
            placeholder="Select a program"
          >
            <SelectContent>
              {programs?.data?.programs?.map(({ id, name }) => (
                <SelectItem key={id} value={id!}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </InputField>

          <InputField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            label="Grade"
            name="gradeId"
            placeholder="Select a grade"
          >
            <SelectContent>
              {grades?.data?.grades?.map(({ id, name }) => (
                <SelectItem key={id} value={id!}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </InputField>

          <InputField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            label="Class"
            name="classId"
            placeholder="Select a class"
          >
            <SelectContent>
              {classes?.data?.classes?.map(({ id, name }) => (
                <SelectItem key={id} value={id!}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </InputField>

          {selectedProgram === "SECONDARY" && (
            <InputField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              type="password"
              label="Password"
              name="password"
            />
          )}
        </div>

        <Button
          type="submit"
          disabled={mutationResult.fetching}
          className="form-submit_btn"
        >
          {mutationResult.fetching ? (
            <Loader2 className="animate-spin text-lamaYellow" />
          ) : (
            type
          )}
        </Button>
      </form>
    </Form>
  );
};

export default StudentForm;
