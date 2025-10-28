"use client";

import { staffSchema, StaffSchema } from "@/lib/zod/validation";
import { FormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import InputField, { FormFieldType } from "../InputField";
import FileUploader from "@/components/FileUploader";
import { Form } from "../ui/form";
import { SelectContent, SelectItem } from "../ui/select";
import { staffDefaultValues } from "@/lib/zod/defaultValues";
import {
  AccessLevel,
  ContractType,
  Sex,
  useCreateStaffMutation,
  useGetClassesQuery,
  useGetGradesQuery,
  useGetProgramsQuery,
  useGetSubjectsQuery,
} from "@/lib/generated/graphql/client";
import { toast } from "sonner";
import { handleGraphqlClientErrors } from "@/lib/utils";
import { useEffect } from "react";

// TODO: Create Slug

const StaffForm = ({ type, data, setOpen }: FormProps) => {
  const router = useRouter();

  const form = useForm<StaffSchema>({
    resolver: zodResolver(staffSchema("learnatffs")),
    defaultValues: staffDefaultValues(data),
  });

  const accessLevel = form.watch("accessLevel");
  const [programsResult] = useGetProgramsQuery({
    pause: accessLevel !== "TEACHER",
  });

  const programId = form.watch("programId");

  const selectedProgram = programsResult.data?.programs?.find(
    (program) => program.id === programId,
  )?.name;

  const [gradesResult, reexecuteGrades] = useGetGradesQuery({
    variables: { where: { programId } },
    pause: !programId || accessLevel !== "TEACHER",
  });

  // PRIMARY | NURSERY
  const gradeId = form.watch("gradeId");
  const [classesResult, reexecuteClasses] = useGetClassesQuery({
    pause:
      accessLevel !== "TEACHER" || selectedProgram === "SECONDARY" || !gradeId,
    variables: { where: { gradeId } },
  });

  // SECONDARY
  const [subjectsResult] = useGetSubjectsQuery({
    pause: accessLevel !== "TEACHER" || selectedProgram !== "SECONDARY",
  });

  const [mutationResult, createStaff] = useCreateStaffMutation();

  useEffect(() => {
    if (selectedProgram) {
      if (selectedProgram === "SECONDARY") {
        reexecuteGrades();
      } else {
        reexecuteClasses();
      }
    }
  }, [selectedProgram, reexecuteGrades, reexecuteClasses]);

  useEffect(() => {
    form.resetField(selectedProgram === "SECONDARY" ? "classId" : "grades");
  }, [selectedProgram, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    const formData = {
      ...(type === "update" && { id: data.id, oldImg: "" }),
      ...values,
      employeeId: values.employeeId.trim().toLowerCase(),
      accessLevel: values.accessLevel as AccessLevel,
      contractType: values.contractType as ContractType,
      sex: values.sex as Sex,
    };

    delete formData.programId;
    delete formData.gradeId;

    const response = await createStaff({ input: formData });
    console.log(response);

    const typeName = response.data?.createStaff?.__typename;
    if (typeName === "MutationCreateStaffSuccess") {
      toast.success(`Staff ${type}d successfully!`);
      setOpen(false);
      router.refresh();
    } else {
      const error = handleGraphqlClientErrors(typeName);
      toast.error(error ?? "Something went wrong");
    }
  });

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
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
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="Email"
            name="email"
            type="email"
          />
          <InputField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="Phone"
            name="phone"
            type="tel"
          />
          <InputField
            label="Address"
            name="address"
            control={form.control}
            fieldType={FormFieldType.INPUT}
          />

          <InputField
            label="Date of Birth"
            name="birthday"
            type="date"
            control={form.control}
            fieldType={FormFieldType.DATE_PICKER}
            // inputProps={{
            //   min: new Date(new Date().setFullYear(new Date().getFullYear() - 60))
            //     .toISOString()
            //     .split("T")[0],
            //   max: new Date().toISOString().split("T")[0],
            // }}
          />

          {/* SEX */}
          <InputField
            label="Sex"
            name="sex"
            control={form.control}
            fieldType={FormFieldType.SELECT}
          >
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
            </SelectContent>
          </InputField>

          <FileUploader
            control={form.control}
            name="img"
            label="Photo"
            folder="learnatffs"
          />
        </div>

        <span className="mt-4 text-xs font-medium text-gray-400">
          Work Information
        </span>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="EmployeeID"
            name="employeeId"
          />
          <InputField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            label="Contract Type"
            name="contractType"
          >
            <SelectContent>
              <SelectItem value="PERMANENT">Permanent</SelectItem>
              <SelectItem value="CONTRACT">Contract</SelectItem>
              <SelectItem value="PART_TIME">Part-Time</SelectItem>
            </SelectContent>
          </InputField>

          <InputField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            label="Access Level"
            name="accessLevel"
          >
            <SelectContent>
              <SelectItem value="FINANCE">Finance</SelectItem>
              <SelectItem value="ACADEMICS">Academics</SelectItem>
              <SelectItem value="ADMINISTRATION">Administration</SelectItem>
              <SelectItem value="TEACHER">Teacher</SelectItem>
              <SelectItem value="RESTRICTED">Restricted</SelectItem>
            </SelectContent>
          </InputField>

          <InputField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="Role"
            name="role"
            placeholder="eg: Mathematics Teacher"
          />
          <InputField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="Position"
            name="position"
            placeholder="eg: Headmistress"
          />

          <InputField
            control={form.control}
            fieldType={FormFieldType.DATE_PICKER}
            label="Hire Date"
            name="hireDate"
          />

          {accessLevel !== "RESTRICTED" && (
            <InputField
              label="Password"
              name="password"
              type="password"
              control={form.control}
              fieldType={FormFieldType.INPUT}
            />
          )}
        </div>

        {accessLevel === "TEACHER" && (
          <>
            <span className="mt-4 text-xs font-medium text-gray-400">
              For Teachers Only
            </span>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputField
                control={form.control}
                fieldType={FormFieldType.SELECT}
                label="Program"
                name="programId"
                placeholder="Which program will this teacher teach?"
              >
                <SelectContent>
                  {programsResult.data?.programs?.map(({ id, name }) => (
                    <SelectItem key={id} value={id!}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </InputField>

              {selectedProgram &&
                (selectedProgram === "SECONDARY" ? (
                  <>
                    <InputField
                      control={form.control}
                      fieldType={FormFieldType.MULTI_SELECT}
                      label="Grades"
                      name="grades"
                      placeholder={
                        gradesResult.fetching
                          ? "Fetching grades..."
                          : "What grade will they teach?"
                      }
                      options={gradesResult.data?.grades ?? []}
                    />

                    <InputField
                      control={form.control}
                      fieldType={FormFieldType.MULTI_SELECT}
                      label="Subjects To Handle"
                      name="gradeId"
                      placeholder={
                        subjectsResult.fetching
                          ? "Fetching subjects..."
                          : "Subjects to handle"
                      }
                      options={subjectsResult?.data?.subjects ?? []}
                    />
                  </>
                ) : (
                  <>
                    <InputField
                      control={form.control}
                      fieldType={FormFieldType.SELECT}
                      label="Grade"
                      name="gradeId"
                      placeholder="Select Grade"
                    >
                      <SelectContent>
                        {gradesResult.fetching && (
                          <div className="text-sm text-gray-600">Loading</div>
                        )}
                        {gradesResult.data?.grades?.length === 0 && (
                          <div className="text-sm text-gray-600">
                            No class was found
                          </div>
                        )}

                        {gradesResult.data?.grades?.map(({ id, name }) => (
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
                      placeholder="Select Class"
                    >
                      <SelectContent>
                        {classesResult.fetching && (
                          <div className="text-sm text-gray-600">Loading</div>
                        )}
                        {classesResult.data?.classes?.length === 0 && (
                          <div className="text-sm text-gray-600">
                            No class was found
                          </div>
                        )}

                        {classesResult.data?.classes?.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </InputField>
                  </>
                ))}
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={!form.formState.isDirty || mutationResult.fetching}
          className="form-submit_btn"
        >
          {!mutationResult.fetching ? (
            type
          ) : (
            <Loader2 className="animate-spin text-lamaYellow" />
          )}
        </button>
      </form>
    </Form>
  );
};

export default StaffForm;
