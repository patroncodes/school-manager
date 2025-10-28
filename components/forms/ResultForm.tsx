"use client";

import { createResult, updateResult } from "@/lib/actions";
import { resultSchema, ResultSchema } from "@/lib/zod/validation";
import { FormProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "../InputField";
import UserSearchForm from "../UserSearchForm";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const ResultForm = ({ type, data, setOpen, relatedData }: FormProps) => {
  const router = useRouter();

  const [resultType, setResultType] = useState(
    data?.type === "Exam" ? "exam" : "assignment",
  );
  const [user, setUser] = useState({
    id: data?.student.id ?? "",
    name: data?.student.name ?? "",
    surname: data?.student.surname ?? "",
  });
  const [selectedLessonId, setSelectedLessonId] = useState<number>(
    data?.lessonId,
  );

  const { exams, assignments } = relatedData;
  const resultTests = resultType === "assignment" ? assignments : exams;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
    defaultValues: data,
  });

  const [state, formAction, pending] = useActionState(
    type === "create" ? createResult : updateResult,
    { success: false, error: false },
  );

  useEffect(() => {
    if (state.success) {
      toast.success(`Result has been ${type}d`);
      setOpen(false);

      router.refresh();
    } else if (state.error) {
      if (typeof state.error === "string") {
        toast.error(state.error);
      } else {
        toast.error(`Failed to ${type} result`);
      }
    }
  }, [state, type, router, setOpen]);

  const onSubmit = handleSubmit((values) => {
    if (selectedLessonId === undefined) {
      toast.error("Please select an exam or assignment");
      return;
    }

    const formData = {
      ...(type === "update" && { id: data.id }),
      score: values.score,
      lessonId: selectedLessonId,
      studentId: user.id,
      testId: values.testId,
      type: resultType,
    };

    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputField
          label="Score"
          name="score"
          type="number"
          defaultValue={data?.score}
          register={register}
          error={errors.score}
          containerClassName="md:w-[48%]"
        />

        <div className="flex w-full flex-col gap-2 md:w-[48%]">
          <div className="text-sm text-gray-500">Result For:</div>
          <RadioGroup
            onValueChange={() =>
              setResultType((prev) => (prev === "exam" ? "assignment" : "exam"))
            }
            defaultValue={resultType}
            className="flex gap-4 rounded-md border border-dashed border-gray-300 px-2 py-3"
          >
            {["exam", "assignment"].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="capitalize">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-[48%]">
          <label htmlFor="testId" className="text-sm text-gray-500 capitalize">
            {resultType}
          </label>
          <select
            {...register("testId")}
            id="testId"
            className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
            defaultValue={data?.testId}
            onChange={(e) => {
              const selectedTest = resultTests.find(
                (test: any) => test.id === Number(e.target.value),
              );
              if (selectedTest) {
                setSelectedLessonId(selectedTest.lessonId);
              }
            }}
          >
            {resultTests.map(
              (test: { id: number; title: string; lessonId: number }) => (
                <option key={test.id} value={test.id} className="py-1">
                  {test.title}
                </option>
              ),
            )}
          </select>
          {errors.testId?.message && (
            <p className="text-xs text-red-400">
              {errors.testId.message.toString()}
            </p>
          )}
        </div>

        {/* STUDENT ID */}
        <div className="flex w-full flex-col gap-2 md:w-[48%]">
          <Label htmlFor="studentId" className="text-sm text-gray-700">
            Student
          </Label>
          <div className="flex w-full items-center gap-2">
            <input
              id="studentId"
              readOnly
              value={
                user.id ? `${user.name} ${user.surname}` : "Select Student"
              }
              {...register("studentId")}
              className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
            />
            <UserSearchForm type="student" setUser={setUser} />
          </div>
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">
              {errors.studentId.message.toString()}
            </p>
          )}
        </div>
      </div>

      {state.error && (
        <span className="text-red-500">Something went wrong</span>
      )}
      <button type="submit" disabled={pending} className="form-submit_btn">
        {!pending ? type : <Loader2 className="animate-spin text-lamaYellow" />}
      </button>
    </form>
  );
};

export default ResultForm;
