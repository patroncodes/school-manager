"use client";

import { resultSchema, ResultSchema } from "@/lib/zod/validation";
import { FormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField, { FormFieldType } from "../InputField";
import UserSearchForm from "../UserSearchForm";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Form } from "@/components/ui/form";
import { SelectContent, SelectItem } from "@/components/ui/select";

const ResultForm = ({ type, data, setOpen, relatedData }: FormProps) => {
  const router = useRouter();

  const [resultType, setResultType] = useState(
    data?.type === "Exam" ? "exam" : "assignment",
  );

  const { exams, assignments } = relatedData;
  const resultTests = resultType === "assignment" ? assignments : exams;

  const form = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
    defaultValues: { ...data, lessonId: data?.lessonId },
  });

  const onSubmit = handleSubmit((values) => {
    const lessonId = resultTests.find(
      (test) => test.id === values.testId,
    ).lessonId;

    if (lessonId === undefined) {
      toast.error("Please select an exam or assignment");
      return;
    }

    const formData = {
      ...(type === "update" && { id: data.id }),
      score: values.score,
      lessonId,
      studentId: values.student.id,
      testId: values.testId,
      type: resultType,
    };

    console.log(formData);
  });

  const isLoading = false;

  return (
    <Form {...form}>
      <form className="flex flex-col gap-8" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            label="Score"
            name="score"
            type="number"
            control={form.control}
            fieldType={FormFieldType.INPUT}
          />

          <InputField
            control={form.control}
            fieldType={FormFieldType.RADIO}
            label="Result"
            name="resultFor"
            options={[
              { id: "exam", name: "exam" },
              { id: "assignment", name: "assignment" },
            ]}
          />

          <InputField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            label={resultType}
            name="testId"
          >
            <SelectContent>
              {resultTests.map(
                (test: { id: string; title: string; lessonId: string }) => (
                  <SelectItem key={test.id} value={test.id} className="py-1">
                    {test.title}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </InputField>

          <UserSearchForm
            type="student"
            label="Student"
            name="student"
            control={form.control}
          />
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

export default ResultForm;
